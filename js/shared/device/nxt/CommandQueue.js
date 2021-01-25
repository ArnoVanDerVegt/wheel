/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const sensorModuleConstants = require('../../../shared/vm/modules/sensorModuleConstants');
const platform              = require('../../../shared/lib/platform');
const ResponseMessage       = require('./Message').ResponseMessage;
const Message               = require('./Message').Message;
const constants             = require('./constants');

exports.CommandQueue = class {
    constructor(opts) {
        this._sending               = false;
        this._sendingPort           = 0;
        this._sendingTimeout        = null;
        this._nxt                   = opts.nxt;
        this._serialPortConstructor = opts.serialPortConstructor;
        this._layer                 = opts.layer;
        this._queue                 = [];
        this._poll                  = 0;
        this._responseMessage       = new ResponseMessage();
        this._port                  = this.getPort(opts);
        this._port.on('data',  this.onPortData.bind(this));
        this._port.on('error', this.onOpenError.bind(this));
        this._port.open(this.onPortOpen.bind(this));
    }

    getQueueLength() {
        return this._queue.length;
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
                textMode: false
            }
        );
    }

    onOpenError(error) {
        let layer = this._layer;
        layer.commandQueue = null;
        layer.connecting   = false;
        layer.connected    = false;
    }

    onPortOpen() {
        let layer = this._layer;
        layer.connecting     = false;
        layer.connected      = true;
        this._sendingTimeout = setTimeout(this.sendQueue.bind(this), 1000);
    }

    onPortData(data) {
        this._sending = false;
        let layer           = this._layer;
        let responseMessage = this._responseMessage;
        let sendingPort     = this._sendingPort;
        let port;
        let valid;
        responseMessage.setBuffer(data);
        responseMessage.readByte();
        responseMessage.readByte();
        responseMessage.readByte();
        let type   = responseMessage.readByte();
        let status = responseMessage.readByte();
        if (status === 0) {
            switch (type) {
                case constants.DIRECT_COMMAND_GET_INPUT_VALUES:
                    port  = responseMessage.readByte();
                    valid = (responseMessage.readByte() === 0x01);
                    if (valid && (port >= 0) && (port < 4)) {
                        let sensorStatus = layer.sensors[port];
                        sensorStatus.port            = port;
                        sensorStatus.valid           = valid;
                        sensorStatus.calibrated      = (responseMessage.readByte() === 0x01);
                        sensorStatus.sensorType      = responseMessage.readByte();
                        sensorStatus.sensorMode      = responseMessage.readByte();
                        sensorStatus.rawValue        = responseMessage.readWord();
                        sensorStatus.normalizedValue = responseMessage.readWord();
                        sensorStatus.scaledValue     = responseMessage.readWord();
                        sensorStatus.calibratedValue = responseMessage.readWord();
                        this.setSensorAssigned(sensorStatus);
                    }
                    break;
                case constants.DIRECT_COMMAND_GET_OUTPUT_STATE:
                    port = responseMessage.readByte();
                    if ((port >= 0) && (port < 3)) {
                        let motorStatus = layer.motors[port];
                        motorStatus.port            = port;
                        motorStatus.power           = responseMessage.readByte();
                        motorStatus.mode            = responseMessage.readByte();
                        motorStatus.regulationMode  = responseMessage.readByte();
                        motorStatus.turnRatio       = responseMessage.readByte();
                        motorStatus.runState        = responseMessage.readByte();
                        motorStatus.tachoLimit      = responseMessage.readDWord();
                        motorStatus.tachoCount      = responseMessage.readDWord();
                        motorStatus.blockTachoCount = responseMessage.readDWord();
                        motorStatus.rotationCount   = responseMessage.readDWord();
                        motorStatus.value           = motorStatus.tachoCount;
                        motorStatus.degrees         = motorStatus.value - motorStatus.resetDegrees;
                    }
                    break;
            }
        }
        this.sendQueue();
    }

    setSensorAssigned(sensorStatus) {
        let hasTimeout = !!sensorStatus.assignedTimeout;
        if (hasTimeout) {
            clearTimeout(sensorStatus.assignedTimeout);
            sensorStatus.assignedTimeout = null;
        }
        switch (sensorStatus.sensorType) {
            case constants.SENSOR_TYPE_SWITCH:
                sensorStatus.assigned = sensorModuleConstants.SENSOR_TYPE_NXT_TOUCH;
                sensorStatus.value    = (sensorStatus.rawValue < 512);
                break;
            case constants.SENSOR_TYPE_LOW_SPEED_9V:
                sensorStatus.assigned = sensorModuleConstants.SENSOR_TYPE_NXT_ULTRASONIC;
                sensorStatus.value    = sensorStatus.rawValue;
                break;
            case constants.SENSOR_TYPE_LIGHT_ACTIVE:
                sensorStatus.assigned = sensorModuleConstants.SENSOR_TYPE_NXT_LIGHT;
                sensorStatus.value    = sensorStatus.rawValue;
                break;
            default:
                if (hasTimeout) {
                    sensorStatus.assigned = 0;
                    sensorStatus.value    = 0;
                } else {
                    sensorStatus.assignedTimeout = setTimeout(
                        () => {
                            sensorStatus.assigned = 0;
                            sensorStatus.value    = 0;
                        },
                        5000
                    );
                }
                break;
        }
    }

    sendQueue() {
        if (this._sendingTimeout) {
            clearTimeout(this._sendingTimeout);
            this._sendingTimeout = null;
        }
        if (!this._layer.connected) {
            return;
        }
        let queue   = this._queue;
        let message = null;
        if (queue.length) {
            message = queue.shift();
            this._sendingPort = -1;
        } else if (this._poll < 4) {
            this._sendingPort = this._poll;
            message = new Message()
                .addByte(constants.COMMAND_TYPE_DIRECT)
                .addByte(constants.DIRECT_COMMAND_GET_INPUT_VALUES)
                .addByte(this._poll);
        } else {
            this._sendingPort = this._poll - 4;
            message = new Message()
                .addByte(constants.COMMAND_TYPE_DIRECT)
                .addByte(constants.DIRECT_COMMAND_GET_OUTPUT_STATE)
                .addByte(this._poll - 4);
        }
        this._poll    = (this._poll + 1) % 7;
        this._sending = true;
        let port = this._port;
        port.write(message.getData(), (error) => {
            if (error) {
                console.error('Write err:', error);
            }
            port.drain((error) => {
                if (error) {
                    console.error('Drain err:', error);
                }
            });
        });
        this._sendingTimeout = setTimeout(this.sendQueue.bind(this), 100);
    }

    addToCommandQueue(command) {
        this._queue.push(command);
        this.sendQueue();
    }

    disconnect() {
        let layer = this._layer;
        if (!layer.connected) {
            return;
        }
        if (this._sendingTimeout) {
            clearTimeout(this._sendingTimeout);
            this._sendingTimeout = null;
        }
        layer.commandQueue = null;
        layer.connecting   = false;
        layer.connected    = false;
        this._port.close();
    }
};
