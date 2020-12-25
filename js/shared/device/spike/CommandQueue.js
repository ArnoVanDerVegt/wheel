/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
let constants             = require('./constants');
let spikeModuleConstants  = require('../../vm/modules/spikeModuleConstants');
let buttonModuleConstants = require('../../vm/modules/buttonModuleConstants');

exports.CommandQueue = class {
    constructor(opts) {
        this._ready                 = 0;
        this._messageId             = 0;
        this._messageLastId         = null;
        this._messageLastTime       = null;
        this._spike                 = opts.spike;
        this._serialPortConstructor = opts.serialPortConstructor;
        this._layer                 = opts.layer;
        this._layer.connecting      = true;
        this._queue                 = [];
        this._textEncoder           = new TextEncoder();
        this._port                  = new this._serialPortConstructor(
                opts.deviceName,
                {
                    baudRate: 115200,
                    autoOpen: false
                }
            );
        this._port.on('data', this.onPortData.bind(this));
        this._port.open(this.onPortOpen.bind(this));
    }

    getMessageId() {
        let messageId = ('000' + this._messageId).substr(-4);
        this._messageLastId   = messageId;
        this._messageLastTime = Date.now();
        this._messageId++;
        return messageId;
    }

    onPortOpen() {
        this._layer.connecting = false;
        this._layer.connected  = true;
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
        if (data.m === 3) {
            this
                .readButtons(ports);
        } else {
            this
                .readMotorStatus(ports)
                .readTiltStatus(ports);
        }
        this.sendQueue();
    }

    readButtons(ports) {
        if (!ports[0]) {
            return;
        }
        let layer  = this._layer;
        switch (ports[0]) {
            case 'left':
                layer.button = (ports[1] === 0) ? buttonModuleConstants.BUTTON_LEFT : buttonModuleConstants.BUTTON_NONE;
                break;
            case 'center':
                layer.button = (ports[1] === 0) ? buttonModuleConstants.BUTTON_CENTER : buttonModuleConstants.BUTTON_NONE;
                break;
            case 'right':
                layer.button = (ports[1] === 0) ? buttonModuleConstants.BUTTON_RIGHT : buttonModuleConstants.BUTTON_NONE;
                break;
            case 'connect':
                layer.button = (ports[1] === 0) ? buttonModuleConstants.BUTTON_CONNECT : buttonModuleConstants.BUTTON_NONE;
                break;
        }
    }

    readMotorStatus(ports) {
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
                    // "BLACK", "VIOLET", "BLUE", "AZURE", "GREEN", "YELLOW", "RED", "WHITE",
                    port.isMotor  = false;
                    port.assigned = spikeModuleConstants.SPIKE_DEVICE_COLOR_SENSOR;
                    port.value    = portInfo[1][1] || 0;
                    break;
                case constants.DEVICE_TYPE_DISTANCE_SENSOR:
                    port.isMotor  = false;
                    port.assigned = spikeModuleConstants.SPIKE_DEVICE_DISTANCE_SENSOR;
                    port.value    = portInfo[1][0] || -1;
                    break;
                case constants.DEVICE_TYPE_FORCE_SENSOR:
                    port.isMotor  = false;
                    port.assigned = spikeModuleConstants.SPIKE_DEVICE_FORCE_SENSOR;
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
        port.write(this._textEncoder.encode(data), (error) => {
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
        //     - There's a timeout: time > messageLastTime + 100
        if ((messageLastTime === null) || (Date.now() > messageLastTime + 25) || (id === messageLastId)) {
            this.sendMessage(queue.shift());
        }
    }

    addToCommandQueue(command) {
        this._queue.push(command);
    }
};
