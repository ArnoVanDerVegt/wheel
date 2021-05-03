/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const platform              = require('../../../shared/lib/platform');
const sensorModuleConstants = require('../../vm/modules/sensorModuleConstants');
const spikeModuleConstants  = require('../../vm/modules/spikeModuleConstants');
const buttonModuleConstants = require('../../vm/modules/buttonModuleConstants');
const constants             = require('./constants');

const COLOR_MAP = [
        sensorModuleConstants.COLOR_BLACK,  //  0
        sensorModuleConstants.COLOR_BROWN,  //  1
        sensorModuleConstants.COLOR_NONE,   //  2
        sensorModuleConstants.COLOR_BLUE,   //  3
        sensorModuleConstants.COLOR_AZURE,  //  4
        sensorModuleConstants.COLOR_GREEN,  //  5
        sensorModuleConstants.COLOR_VIOLET, //  6
        sensorModuleConstants.COLOR_YELLOW, //  7
        sensorModuleConstants.COLOR_NONE,   //  8
        sensorModuleConstants.COLOR_RED,    //  9
        sensorModuleConstants.COLOR_WHITE   // 10
    ];

exports.CommandQueue = class {
    constructor(opts) {
        this._ready                 = 0;
        this._messageId             = 0;
        this._messageLastId         = null;
        this._messageLastTime       = null;
        this._spike                 = opts.spike;
        this._serialPortConstructor = opts.serialPortConstructor;
        this._layer                 = opts.layer;
        this._queue                 = [];
        this._textEncoder           = new TextEncoder();
        this._port                  = this.getPort(opts);
        this._port.on('data', this.onPortData.bind(this));
        this._port.open(this.onPortOpen.bind(this));
    }

    getPort(opts) {
        let serialPort;
        if (platform.isWeb()) {
            serialPort = new this._serialPortConstructor(this.onOpenError.bind(this));
        } else {
            serialPort = new this._serialPortConstructor();
        }
        return serialPort.getPort(
            opts.deviceName,
            {
                baudRate: 115200,
                textMode: true
            }
        );
    }

    getMessageId() {
        let messageId = ('000' + this._messageId).substr(-4);
        this._messageLastId   = messageId;
        this._messageLastTime = Date.now();
        this._messageId++;
        return messageId;
    }

    onOpenError(error) {
        let layer = this._layer;
        layer.commandQueue = null;
        layer.connecting   = false;
        layer.connected    = false;
    }

    onPortOpen() {
        let layer = this._layer;
        layer.connecting = false;
        layer.connected  = true;
    }

    onPortData(data) {
        try {
            data = JSON.parse(data.toString());
        } catch (error) {
            return;
        }
        if (data.e) {
            try {
                let message = JSON.parse(Buffer.from(data.e, 'base64').toString());
                let lines   = message.message.split('\n');
                console.error('Error:', message.type);
                lines.forEach((line) => {
                    console.log(line);
                });
            } catch (error) {
            }
            return;
        }
        this.sendQueue(data.i || null);
        let ports = data.p;
        if (!ports) {
            return;
        }
        switch (data.m) {
            case constants.MESSAGE_TYPE_BUTTONS:
                this.readButtons(ports);
                break;
            case constants.MESSAGE_TYPE_BATTERY:
                this._layer.battery = ports[1];
                break;
            case constants.MESSAGE_TYPE_PORTS:
                this
                    .readPortStatus(ports)
                    .readTiltStatus(ports);
                break;
        }
        this.sendQueue();
    }

    readButtons(ports) {
        if (!ports[0]) {
            return;
        }
        let layer  = this._layer;
        switch (ports[0]) {
            case 'left':    layer.button = (ports[1] === 0) ? buttonModuleConstants.BUTTON_LEFT    : buttonModuleConstants.BUTTON_NONE; break;
            case 'center':  layer.button = (ports[1] === 0) ? buttonModuleConstants.BUTTON_CENTER  : buttonModuleConstants.BUTTON_NONE; break;
            case 'right':   layer.button = (ports[1] === 0) ? buttonModuleConstants.BUTTON_RIGHT   : buttonModuleConstants.BUTTON_NONE; break;
            case 'connect': layer.button = (ports[1] === 0) ? buttonModuleConstants.BUTTON_CONNECT : buttonModuleConstants.BUTTON_NONE; break;
        }
    }

    readPortStatus(ports) {
        let layer = this._layer;
        for (let i = 0; i < 6; i++) {
            let port     = layer.ports[i];
            let portInfo = ports[i];
            if ((portInfo === undefined) || (portInfo[0] === undefined)) {
                continue;
            }
            switch (portInfo[0] || 0) {
                case constants.DEVICE_TYPE_MEDIUM_MOTOR:
                    port.isMotor  = true;
                    port.assigned = spikeModuleConstants.SPIKE_DEVICE_MEDIUM_MOTOR;
                    port.value    = portInfo[1][1];
                    break;
                case constants.DEVICE_TYPE_COLOR_SENSOR:
                    let color = portInfo[1][1] || 0;
                    port.isMotor  = false;
                    port.assigned = sensorModuleConstants.SENSOR_TYPE_SPIKE_COLOR;
                    port.value    = (color in COLOR_MAP) ? COLOR_MAP[color] : sensorModuleConstants.COLOR_NONE;
                    break;
                case constants.DEVICE_TYPE_DISTANCE_SENSOR:
                    port.isMotor  = false;
                    port.assigned = sensorModuleConstants.SENSOR_TYPE_SPIKE_DISTANCE;
                    port.value    = portInfo[1][0] || -1;
                    break;
                case constants.DEVICE_TYPE_FORCE_SENSOR:
                    port.isMotor  = false;
                    port.assigned = sensorModuleConstants.SENSOR_TYPE_SPIKE_FORCE;
                    break;
                default:
                    port.assigned = 0;
                    break;
            }
        }
        return this;
    }

    readTiltStatus(ports) {
        let layer = this._layer;
        ['gyro', 'accel', 'pos'].forEach((property, index) => {
            index += 6;
            if (typeof ports[index] === 'object') {
                let p = layer[property];
                p.x = ports[index][0] || 0;
                p.y = ports[index][1] || 0;
                p.z = ports[index][2] || 0;
            }
        });
    }

    sendMessage(data) {
        let port = this._port;
        if (typeof data === 'object') {
            data.i = this.getMessageId();
            data   = JSON.stringify(data) + '\r\n';
        }
        if (!platform.isWeb()) {
            data = this._textEncoder.encode(data);
        }
        port.write(data, (error) => {
            if (error) {
                console.error('Write err:', error);
            }
            port.drain((error) => {
                if (error) {
                    console.error('Drain err:', error);
                }
            });
        });
    }

    sendQueue(id) {
        let queue = this._queue;
        if (!queue.length) {
            return;
        }
        let messageLastId   = this._messageLastId;
        let messageLastTime = this._messageLastTime;
        // Only allow a message to be send when:
        //     - It's the first message: messageLastTime === null
        //     - The last received message has the same id as the last sent message: id === messageLastId
        //     - There's a timeout: time > messageLastTime + 50
        if ((messageLastTime === null) || (Date.now() > messageLastTime + 50) || (id === messageLastId)) {
            this.sendMessage(queue.shift());
        }
    }

    addToCommandQueue(command) {
        this._queue.push(command);
    }
};
