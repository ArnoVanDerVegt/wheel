/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const platform              = require('../../lib/platform');
const sensorModuleConstants = require('../../vm/modules/sensorModuleConstants');
const BasicDevice           = require('../BasicDevice').BasicDevice;
const CommandQueue          = require('./CommandQueue').CommandQueue;
const messageEncoder        = require('./messageEncoder');
const Message               = require('./Message').Message;
const constants             = require('./constants');

exports.EV3 = class extends BasicDevice {
    constructor(opts) {
        opts.layerCount = 4;
        super(opts);
        this._serialPortConstructor  = opts.serialPortConstructor;
        this._port                   = null;
        this._connectionFailed       = false;
        this._commandQueue           = null;
        this._updateListByLayer      = [];
        this._poll                   = {count: 0, layer: 0, main: 0, mainLayer: 0};
        this._stopPolling            = false;
        this._deviceName             = '';
        this._retryCount             = 0;
        this._startConnectionPolling = this.startConnectionPolling.bind(this);
    }

    getPort() {
        if (this._port) {
            return this._port;
        }
        let serialPort;
        if (platform.isWeb()) {
            serialPort = new this._serialPortConstructor(this.onOpenError.bind(this));
        } else {
            serialPort = new this._serialPortConstructor();
        }
        this._port = serialPort.getPort(
            this._deviceName,
            {
                baudRate:    57600,
                dataBits:    8,
                parity:      'none',
                stopBits:    1,
                flowControl: false,
                autoOpen:    false
            }
        );
        return this._port;
    }

    getConnecting() {
        return this._connecting;
    }

    getConnected() {
        return this._connected;
    }

    getCommandQueue() {
        return this._commandQueue;
    }

    getMotorPosition(layer) {
        return this._commandQueue.getMotorPosition(layer);
    }

    getUpdateList(layer) {
        if (this._updateListByLayer[layer]) {
            return this._updateListByLayer[layer];
        }
        this._updateListByLayer[layer] = [
            this.updateSensorPort.bind(this, layer, 0),
            this.updateSensorPort.bind(this, layer, 1),
            this.updateSensorPort.bind(this, layer, 2),
            this.updateSensorPort.bind(this, layer, 3),
            this.updateMotorPort.bind(this, layer, 0),
            this.updateMotorPort.bind(this, layer, 1),
            this.updateMotorPort.bind(this, layer, 2),
            this.updateMotorPort.bind(this, layer, 3)
        ];
        return this._updateListByLayer[layer];
    }

    updateSensorPort(layer, port) {
        let l = this._commandQueue.getLayers()[layer];
        switch (l[port].assigned) {
            case sensorModuleConstants.SENSOR_TYPE_NXT_TOUCH:
            case sensorModuleConstants.SENSOR_TYPE_TOUCH:
                this.readTouchSensor(layer, port);
                return true;
            case sensorModuleConstants.SENSOR_TYPE_NXT_COLOR:
                this.readSensor(layer, port, sensorModuleConstants.SENSOR_TYPE_NXT_COLOR, null);
                return true;
            case sensorModuleConstants.SENSOR_TYPE_COLOR:
                this.readSensor(layer, port, sensorModuleConstants.SENSOR_TYPE_COLOR, null);
                return true;
            case sensorModuleConstants.SENSOR_TYPE_INFRARED:
                this.readSensor(layer, port, sensorModuleConstants.SENSOR_TYPE_INFRARED, null);
                return true;
            case sensorModuleConstants.SENSOR_TYPE_NXT_LIGHT:
            case sensorModuleConstants.SENSOR_TYPE_NXT_SOUND:
            case sensorModuleConstants.SENSOR_TYPE_NXT_ULTRASONIC:
            case sensorModuleConstants.SENSOR_TYPE_NXT_TEMPERATURE:
            case sensorModuleConstants.SENSOR_TYPE_ULTRASONIC:
            case sensorModuleConstants.SENSOR_TYPE_GYRO:
                this.readSensor(layer, port, l[port].assigned, null);
                return true;
        }
        return false;
    }

    updateMotorPort(layer, port) {
        let l = this._commandQueue.getLayers()[layer];
        switch (l[port + 4].assigned) {
            case constants.LARGE_MOTOR:
            case constants.MEDIUM_MOTOR:
                this.readMotor(layer, port);
                return true;
        }
        return false;
    }

    startConnectionPolling() {
        if (!this._connected) {
            return;
        }
        let poll              = this._poll;
        let commandQueue      = this._commandQueue;
        let assignedPortCount = commandQueue.getAssignedPortCount();
        if (!commandQueue.getLength() && !this._stopPolling) {
            if (poll.main === 0) {
                let nextStep = true;
                this.getConnectedTypes(poll.mainLayer);
                if (commandQueue.getFoundDisconnect()) {
                    commandQueue.setFoundDisconnect(false);
                    this._retryCount++;
                    if (this._retryCount > 3) {
                        this._retryCount = 0;
                    } else {
                        nextStep = false;
                    }
                }
                if (nextStep) {
                    this._retryCount = 0;
                    poll.main        = 1;
                    poll.mainLayer   = (poll.mainLayer + 1) % this._activeLayerCount;
                }
            } else if (poll.main === 1) {
                this.readBattery();
                poll.main = 2;
            } else {
                let updateList = this.getUpdateList(poll.layer);
                let i          = 0;
                // Iterate through the updateList until we found a port which has a valid type connected...
                for (i = 0; i < updateList.length; i++) {
                    let found = updateList[poll.count](); // Try to update the port, found if there's a valid connection
                    poll.count++;
                    if (poll.count >= updateList.length) {
                        poll.count = 0;                                         // Reset the count...
                        poll.layer = (poll.layer + 1) % this._activeLayerCount; // Move to the next layer...
                    }
                    if (found) {
                        break;
                    }
                }
                poll.main = (poll.main + 1) % ((assignedPortCount > 1) ? 1000 : 200);
            }
        }
        let time = (assignedPortCount > 1) ? 1 : 20;
        setTimeout(this._startConnectionPolling, this._stopPolling ? 1000 : time);
    }

    onOpenError(error) {
        this._port       = null;
        this._connecting = false;
        this._connected  = false;
    }

    onPortOpen(error) {
        if (error) {
            this._connecting       = false;
            this._connected        = false;
            this._connectionFailed = error;
            return;
        }
        let count = 4;
        this._connecting = false;
        this._connected  = true;
        this.startConnectionPolling();
    }

    onPortData(data) {
        this._commandQueue.receiveHandler(data);
    }

    connect(deviceName, callback) {
        this._deviceName = deviceName;
        if (this._connecting || this._connected) {
            return;
        }
        this._connecting = true;
        let port         = this.getPort();
        let commandQueue = new CommandQueue(
                this,
                function(data) {
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
            );
        this._commandQueue = commandQueue;
        port.on('data', this.onPortData.bind(this));
        port.open(this.onPortOpen.bind(this, callback));
    }

    disconnect() {
        if (!this._connected) {
            return;
        }
        this._connected = false;
        this.getPort().close((err) => {
            this._port = null;
        });
    }

    playtone(frequency, duration, volume, callback) {
        if (!this._connected) {
            return;
        }
        this._commandQueue.addToCommandQueue({
            type:     null,
            response: false,
            callback: callback,
            message:  new Message()
                .addS(constants.DIRECT_COMMAND_PREFIX)
                .addS(constants.PLAYTONE)
                .add1(volume)
                .add2(frequency)
                .add2(duration)
        });
    }

    getConnectedTypes(layer) {
        let message = new Message().addS(constants.DIRECT_COMMAND_REPLY_ALL_TYPES_PREFIX);
        let offset  = 0;
        for (let i = 0; i < 8; i++) {
            message
                .addS(constants.INPUT_DEVICE_GET_TYPE_MODE)
                .addS('0' + layer)
                .addS(['00', '01', '02', '03', '10', '11', '12', '13'][i])
                .addS('e1')
                .addB(offset++)
                .addS('e1')
                .addB(offset++);
        }
        this._commandQueue.addToCommandQueue({
            type:     constants.INPUT_DEVICE_GET_TYPE_MODE,
            response: true,
            layer:    layer,
            message:  message
        });
    }

    getDefaultModeForType(type) {
        if (this._commandQueue) {
            return this._commandQueue.getDefaultModeForType(type);
        }
        return constants.MODE0;
    }

    motorReset(layer, id) {
        let layers = this._commandQueue.getLayers();
        let motor  = layers[layer][id + 4];
        if (!this._connected) {
            motor.reset = true;
            return;
        }
        motor.resetDegrees = motor.value;
    }

    motorDegrees(layer, motor, speed, degrees, brake, callback) {
        if (!this._connected) {
            return;
        }
        if (degrees < 0) {
            degrees *= -1;
            speed   *= -1;
        }
        this._commandQueue
            .setMotorMove(layer, motor, degrees)
            .addToCommandQueue({
                type:     null,
                response: false,
                callback: callback,
                message:  new Message()
                    .addS(constants.DIRECT_COMMAND_PREFIX)
                    .addS(constants.SET_MOTOR_STEP_SPEED)
                    .addS('0' + (1 << (motor & 3)).toString())
                    .add1(Math.max(Math.min(speed, 100), -100))
                    .add3(0)
                    .add3(degrees)
                    .add3(0)
                    .add1(brake) // 1 = brake, 0 = coast
                    .addS(constants.SET_MOTOR_START)
                    .addS('0' + (1 << (motor & 3)).toString())
        });
    }

    motorOn(layer, motor, speed, brake, callback) {
        if (!this._connected) {
            return;
        }
        this._commandQueue.addToCommandQueue({
            type:     null,
            response: false,
            callback: callback,
            message:  new Message()
                .addS(constants.DIRECT_COMMAND_PREFIX)
                .addS(constants.SET_MOTOR_SPEED)
                .addS('0' + (1 << (motor & 3)).toString())
                .add1(Math.max(Math.min(speed, 100), -100))
                .addS(constants.SET_MOTOR_START)
                .addS('0' + (1 << (motor & 3)).toString())
        });
    }

    motorStop(layer, motor, brake, callback) {
        if (!this._connected) {
            return;
        }
        this._commandQueue.addToCommandQueue({
            type:     null,
            response: false,
            callback: callback,
            message:  new Message()
                .addS(constants.DIRECT_COMMAND_PREFIX)
                .addS(constants.SET_MOTOR_STOP)
                .addS('0' + (1 << (motor & 3)).toString())
                .add1(brake) // 1 = brake, 0 = coast
        });
    }

    readTouchSensor(layer, port) {
        if (!this._connected) {
            return;
        }
        this._commandQueue.addToCommandQueue({
            type:     sensorModuleConstants.SENSOR_TYPE_TOUCH,
            response: true,
            layer:    layer,
            port:     port,
            message:  new Message()
                .addS(constants.DIRECT_COMMAND_REPLY_PREFIX)
                .addS(constants.READ_SENSOR)
                .addS('0' + layer)
                .addB(port)
                .addS(sensorModuleConstants.SENSOR_TYPE_TOUCH.toString(16))
                .addS('0060')
        });
    }

    readSensor(layer, port, type, mode) {
        if (!this._connected) {
            return;
        }
        let commandQueue = this._commandQueue;
        if (mode === null) {
            mode = commandQueue.getMode(layer, port);
            if (!mode && (mode !== 0)) {
                mode = commandQueue.getDefaultMode(layer, port);
                if (!mode && (mode !== 0)) {
                    this.getDefaultModeForType(type);
                }
            }
            if ((mode === undefined) || (mode === null)) {
                console.log('Bad mode for port:', port);
                return;
            }
        }
        commandQueue.addToCommandQueue({
            type:     type,
            response: false,
            layer:    layer,
            port:     port,
            mode:     mode,
            message:  new Message()
                .addS(constants.DIRECT_COMMAND_REPLY_SENSOR_PREFIX)
                .addS(constants.INPUT_DEVICE_READY_SI)
                .addS('0' + layer)
                .addB(port)
                .addS('00')
                .addS(('0' + mode.toString(16)).substr(-2))
                .addS('0160')
        });
    }

    readMotor(layer, port) {
        if (!this._connected) {
            return;
        }
        this._commandQueue.addToCommandQueue({
            type:     constants.READ_FROM_MOTOR,
            response: false,
            layer:    layer,
            port:     port,
            mode:     constants.READ_MOTOR_POSITION,
            message:  new Message()
                .addS(constants.DIRECT_COMMAND_REPLY_SENSOR_PREFIX)
                .addS(constants.INPUT_DEVICE_READY_SI)
                .addS('0' + layer)
                .addS(messageEncoder.byteString(port + 16) + '00')
                .addS(constants.READ_MOTOR_POSITION)
                .addS('0160')
        });
    }

    readBattery(callback) {
        if (!this._connected) {
            return;
        }
        this._commandQueue.addToCommandQueue({
            type:             constants.UIREAD_BATTERY,
            response:         true,
            responseCallback: callback || false,
            message:          new Message()
                .addS(constants.DIRECT_COMMAND_REPLY_PREFIX)
                .addS(constants.UIREAD)
                .addS(constants.UIREAD_BATTERY)
                .addS('60')
        });
    }

    setLed(layer, color) {
        if (!this._connected) {
            return;
        }
        this._commandQueue.addToCommandQueue({
            type:     constants.UIWRITE,
            response: false,
            message:  new Message()
                .addS(constants.DIRECT_COMMAND_PREFIX)
                .addS(constants.UIWRITE)
                .addS(constants.LED)
                .addS('0' + Math.min(Math.max(color, 0), 9))
        });
    }

    listFiles(path, callback) {
        this._commandQueue && this._commandQueue.addToCommandQueue({
            type:             constants.BEGIN_LIST_FILES,
            response:         true,
            responseCallback: callback || false,
            message:          new Message()
                .addS(constants.BEGIN_LIST_FILES)
                .addS('FFFF')
                .addH(path)
        });
    }

    downloadFile(filename, data, callback) {
        this._commandQueue && this._commandQueue.addToCommandQueue({
            type:             constants.BEGIN_DOWNLOAD,
            response:         true,
            responseCallback: callback || false,
            filename:         filename,
            data:             data,
            message:          new Message()
                .addS(constants.BEGIN_DOWNLOAD)
                .addS(messageEncoder.decimalToLittleEndianHex(data.length / 2, 8))
                .addH(filename)
        });
    }

    createDir(path, callback) {
        this._commandQueue && this._commandQueue.addToCommandQueue({
            type:             constants.SYSTEM_COMMAND,
            response:         true,
            responseCallback: callback || false,
            path:             path,
            message:          new Message()
                .addS(constants.CREATE_DIR)
                .addH(path)
        });
    }

    deleteFile(path, callback) {
        this._commandQueue && this._commandQueue.addToCommandQueue({
            type:             constants.SYSTEM_COMMAND,
            response:         true,
            responseCallback: callback || false,
            path:             path,
            command:          constants.DELETE_FILE,
            message:          new Message()
                .addS(constants.DELETE_FILE)
                .addH(path)
        });
    }

    module(module, command, data) {
        if (this._modules[module]) {
            this._modules[module].run(command, data);
        }
    }

    getState() {
        let commandQueue = this._commandQueue;
        let layers       = commandQueue.getLayers();
        return {
            connecting: this._connecting,
            layers:     layers,
            battery:    commandQueue.getBattery()
        };
    }

    setMode(layer, port, mode) {
        this._commandQueue && this._commandQueue.setMode(layer, port, mode);
    }

    stopPolling() {
        this._stopPolling = true;
    }

    resumePolling() {
        this._stopPolling = false;
    }
};
