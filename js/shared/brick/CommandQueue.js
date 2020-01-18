/**
 * Based on example code:
 * https://github.com/kayjtea/ev3-direct
 *
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 *
 * Added performance improvements by sending out multiple messages at once with an ID
 * and waiting for their response id.
**/
const sensorModuleConstants = require('../vm/modules/sensorModuleConstants');
const messageEncoder        = require('./messageEncoder');
const Message               = require('./Message').Message;
const constants             = require('./constants');

const MESSAGE_TIME_OUT_TIME = 50;

exports.CommandQueue = class {
    constructor(brick, sendFunction) {
        this._brick                      = brick;
        this._battery                    = 0;
        this._sendFunction               = sendFunction;
        this._pendingCommand             = null;
        this._pendingCount               = 0;
        this._failedConnectionTypesLayer = -1;
        this._queue                      = [];
        this._id                         = 0;
        this._layers                     = [this.initLayer(0), this.initLayer(1), this.initLayer(2), this.initLayer(3)];
    }

    initLayer(layer) {
        let result = [];
        let i      = 0;
        for (i = 0; i < 4; i++) {
            result.push({
                sending:  true,
                id:       0,
                layer:    layer,
                port:     i,
                mode:     null,
                message:  '',
                type:     null,
                response: false,
                time:     0,
                value:    0,
                assigned: null
            });
        }
        for (i = 0; i < 4; i++) {
            result.push({
                value:    0,
                assigned: null
            });
        }
        return result;
    }

    getMode(layer, port) {
        return this._layers[layer][port].mode;
    }

    setMode(layer, port, mode) {
        this._layers[layer][port].mode = mode;
    }

    getDefaultModeForType(type) {
        switch (type) {
            case sensorModuleConstants.SENSOR_TYPE_NXT_TOUCH:
            case sensorModuleConstants.SENSOR_TYPE_NXT_LIGHT:
            case sensorModuleConstants.SENSOR_TYPE_NXT_SOUND:
            case sensorModuleConstants.SENSOR_TYPE_NXT_ULTRASONIC:
            case sensorModuleConstants.SENSOR_TYPE_NXT_TEMPERATURE:
            case sensorModuleConstants.SENSOR_TYPE_TOUCH:
                return constants.MODE0;
            case sensorModuleConstants.SENSOR_TYPE_NXT_COLOR:
            case sensorModuleConstants.SENSOR_TYPE_COLOR:
                return sensorModuleConstants.COLOR_COLOR;
            case sensorModuleConstants.SENSOR_TYPE_ULTRASONIC:
                return sensorModuleConstants.ULTRASONIC_CM;
            case sensorModuleConstants.SENSOR_TYPE_GYRO:
                return sensorModuleConstants.GYRO_ANGLE;
            case sensorModuleConstants.SENSOR_TYPE_INFRARED:
                return sensorModuleConstants.IR_REMOTE;
        }
        return constants.MODE0;
    }

    getDefaultMode(layer, port) {
        let item = this._layers[layer][port];
        return this.getDefaultModeForType(item.assigned);
    }

    getLayers() {
        return this._layers;
    }

    getId() {
        this._id = (this._id + 1) & 255;
        return this._id;
    }

    getLength() {
        return this._queue.length;
    }

    getPendingCount() {
        return this._pendingCount;
    }

    getPendingCommand() {
        return this._pendingCommand;
    }

    getBattery() {
        return this._battery;
    }

    getAssignedPortCount() {
        let count = 0;
        this._layers.forEach(
            function(layer) {
                layer.forEach(
                    function(port, index) {
                        if (index < 4) {
                            count += this.isValidAssignedSensor(port);
                        } else if (index < 8) {
                            count += this.isValidAssignedMotor(port);
                        }
                    },
                    this
                );
            },
            this
        );
        return count;
    }

    getFloatResult(inputData) {
        let buf  = new ArrayBuffer(4);
        let view = new DataView(buf);
        view.setUint8(0, inputData[8]);
        view.setUint8(1, inputData[7]);
        view.setUint8(2, inputData[6]);
        view.setUint8(3, inputData[5]);
        let result = view.getFloat32(0);
        return isNaN(result) ? 0 : result;
    }

    getFailedConnectionTypesLayer() {
        return this._failedConnectionTypesLayer;
    }

    sendCommand(commandArray) {
        this._sendFunction(commandArray.buffer);
    }

    executeAgain(time) {
        setTimeout(this.execute.bind(this), time);
    }

    shouldChunkTranfers() {
        return false;
    }

    execute() {
        let queue = this._queue;
        if (queue.length === 0) {
            return; // Nothing to do
        }
        let time = Date.now();
        let command;
        for (let i = 0; i < queue.length; i++) {
            command = queue[i];
            if (command.time < time) {
                queue.splice(i, 1);
            }
        }
        if (!queue.length) {
            return;
        }
        command = queue[0]; // Peek at first in line
        if (command.response) {
            if (this._pendingCommand) {
                return;
            }
            queue.shift(); // Remove it from the queue
            this._pendingCommand    = command;
            this._pendingCommand.id = this.getId();
            this.sendCommand(messageEncoder.packMessageForSending(this._pendingCommand.id, command.message.get()));
        } else {
            if (this._pendingCommand) {   // Bail if we're waiting for a response
                return;
            }
            queue.shift(); // Remove it from the queue
            command.id = this.getId();
            this.sendCommand(messageEncoder.packMessageForSending(command.id, command.message.get()));
            command.callback && command.callback();
            this.executeAgain(1);   // Maybe do the next one
        }
    }

    addToCommandQueue(command) {
        let index = null;
        if (('layer' in command) && ('port' in command)) {
            if ([
                    sensorModuleConstants.SENSOR_TYPE_NXT_TOUCH,
                    sensorModuleConstants.SENSOR_TYPE_NXT_LIGHT,
                    sensorModuleConstants.SENSOR_TYPE_NXT_SOUND,
                    sensorModuleConstants.SENSOR_TYPE_NXT_COLOR,
                    sensorModuleConstants.SENSOR_TYPE_NXT_ULTRASONIC,
                    sensorModuleConstants.SENSOR_TYPE_NXT_TEMPERATURE,
                    sensorModuleConstants.SENSOR_TYPE_TOUCH,
                    sensorModuleConstants.SENSOR_TYPE_COLOR,
                    sensorModuleConstants.SENSOR_TYPE_ULTRASONIC,
                    sensorModuleConstants.SENSOR_TYPE_GYRO,
                    sensorModuleConstants.SENSOR_TYPE_INFRARED
                ].indexOf(command.type) !== -1) {
                index = command.port;
            } else if (command.type === constants.READ_FROM_MOTOR) {
                index = command.port + 4;
            }
        }
        let time = Date.now();
        if (index !== null) {
            let layer = command.layer;
            let item  = this._layers[layer][index];
            if (this._pendingCommand || item.sending) {
                if (item.sending && (time > item.time)) { // Timeout, send next time!
                    item.sending = false;
                }
                return;
            }
            item.sending  = true;
            item.id       = this.getId();
            item.layer    = command.layer;
            item.port     = command.port;
            item.mode     = command.mode;
            item.message  = command.message;
            item.type     = command.type;
            item.response = command.response;
            item.time     = time + MESSAGE_TIME_OUT_TIME;
            this.sendCommand(messageEncoder.packMessageForSending(item.id, command.message.get()));
            return;
        }
        let queue = this._queue;
        let i     = 0;
        while (i < queue.length) {
            if (queue[i].response && (queue[i].type === command.type)) {
                if (time > queue[i].time) {
                    queue.splice(i, 1);
                    break;
                } else {
                    return;
                }
            } else {
                i++;
            }
        }
        if (this._pendingCommand && (time > this._pendingCommand.time)) {
            this._pendingCommand = null;
        }
        command.time = time + 1000;
        this._queue.push(command);
        this.execute();
    }

    isValidAssignedMotor(assigned) {
        return ([7, 8].indexOf(assigned) !== -1);
    }

    isValidAssignedSensor(assigned) {
        return ([
            sensorModuleConstants.SENSOR_TYPE_NXT_TOUCH,
            sensorModuleConstants.SENSOR_TYPE_NXT_LIGHT,
            sensorModuleConstants.SENSOR_TYPE_NXT_SOUND,
            sensorModuleConstants.SENSOR_TYPE_NXT_COLOR,
            sensorModuleConstants.SENSOR_TYPE_NXT_ULTRASONIC,
            sensorModuleConstants.SENSOR_TYPE_NXT_TEMPERATURE,
            sensorModuleConstants.SENSOR_TYPE_TOUCH,
            sensorModuleConstants.SENSOR_TYPE_COLOR,
            sensorModuleConstants.SENSOR_TYPE_ULTRASONIC,
            sensorModuleConstants.SENSOR_TYPE_GYRO,
            sensorModuleConstants.SENSOR_TYPE_INFRARED
        ].indexOf(assigned) !== -1);
    }

    readFilesRecieved(inputData) {
        let files = [];
        let file  = '';
        let i     = 12;
        while (i < inputData.length) {
            let c = inputData[i++];
            if (c === 10) {
                files.push(file);
                file = '';
            } else {
                file += String.fromCharCode(c);
            }
        }
        if (file !== '') {
            files.push(file);
        }
        return files;
    }

    continueDownload(handle, filename, data) {
        let chunkSize = 65535;
        for (let i = 0; i < data.length; i += chunkSize) {
            let chunkData = data.substring(i, i + chunkSize);
            this.addToCommandQueue({
                type:    constants.SYSTEM_COMMAND,
                message: new Message()
                    .addS(constants.CONTINUE_DOWNLOAD)
                    .addS(handle)
                    .addS(chunkData)
            });
        }
    }

    receiveSensorData(inputData, id) {
        let layers     = this._layers;
        let layerCount = this._brick.getLayerCount();
        let found      = false;
        let time       = Date.now();
        this._pendingCount = 0;
        for (let i = 0; i <= layerCount; i++) {
            let layer = layers[i];
            for (let j = 0; j < 8; j++) {
                let item = layer[j];
                if (item.sending) {
                    if ((j > 3) && (time > item.time)) {
                        found        = true;
                        item.sending = false; // Message timed out, reset...
                        continue;
                    } else {
                        this._pendingCount++;
                    }
                }
                if (!item.sending || (item.id !== id)) {
                    continue;
                }
                this._pendingCount--;
                found = true;
                switch (item.type) {
                    case sensorModuleConstants.SENSOR_TYPE_NXT_TOUCH:
                    case sensorModuleConstants.SENSOR_TYPE_TOUCH:
                        item.value = (inputData[5] === 100) ? 1 : 0;
                        break;
                    case sensorModuleConstants.SENSOR_TYPE_NXT_COLOR:
                    case sensorModuleConstants.SENSOR_TYPE_COLOR:
                        let num = Math.floor(this.getFloatResult(inputData));
                        if (item.mode === sensorModuleConstants.COLOR_COLOR) {
                            item.value = ((num >= 0) && (num < 7)) ? num : 0;
                        } else {
                            item.value = num;
                        }
                        break;
                    case sensorModuleConstants.SENSOR_TYPE_INFRARED:
                        if ((item.mode === sensorModuleConstants.IR_REMOTE) ||
                            (item.mode === sensorModuleConstants.IR_REMOTE_ADVANCED)) {
                            item.value = Math.min(Math.max(Math.floor(this.getFloatResult(inputData)), 0), 11);
                        } else {
                            item.value = this.getFloatResult(inputData);
                        }
                        break;
                    case sensorModuleConstants.SENSOR_TYPE_NXT_LIGHT:
                    case sensorModuleConstants.SENSOR_TYPE_NXT_SOUND:
                    case sensorModuleConstants.SENSOR_TYPE_NXT_ULTRASONIC:
                    case sensorModuleConstants.SENSOR_TYPE_NXT_TEMPERATURE:
                    case sensorModuleConstants.SENSOR_TYPE_ULTRASONIC:
                    case sensorModuleConstants.SENSOR_TYPE_GYRO:
                        item.value = this.getFloatResult(inputData);
                        break;
                    case constants.READ_FROM_MOTOR:
                        item.value = Math.round(this.getFloatResult(inputData) * 360); // Round to nearest degree
                        break;
                }
                item.sending = false;
            }
        }
        return found;
    }

    /**
     * Process the inputData for the connected device information.
     *
     * Return true if there was an earlier connection but no connections are found now.
    **/
    receiveTypeMode(inputData) {
        const isAssigned = function(assigned) {
                // None, Port Error, Unknown, Initializing
                return [0x7E, 0x7F, 0xFF, 0x7D].indexOf(assigned) === -1;
            };
        let assignedCount = 0;
        let hadAssignment = false;
        let p             = this._layers[this._pendingCommand.layer || 0];
        for (let i = 0; i < 4; i++) {
            let value    = inputData[5 + (i * 2)] || 0;
            let assigned = parseInt(messageEncoder.byteString(value), 16);
            if (!isAssigned(assigned)) {
                p[i].mode = null;
            }
            p[i].assigned = assigned;
            let j = i + 4;
            value = inputData[5 + (j * 2)] || 0;
            if ([7, 8].indexOf(value) === -1) {
                hadAssignment = ([7, 8].indexOf(p[j].assigned) !== -1);
            } else {
                assignedCount++;
            }
            p[j].assigned = value;
        }
        return hadAssignment && (assignedCount === 0);
    }

    receiveHandler(data) {
        let inputData = new Uint8Array(data);
        let id        = inputData[2];
        if (this.receiveSensorData(inputData, id)) {
            return;
        }
        if (!this._pendingCommand) {
            // Received Data and didn't expect it...
            return;
        }
        let type     = this._pendingCommand.type;
        let mode     = this._pendingCommand.mode;
        let callback = this._pendingCommand.responseCallback;
        let handle   = null;
        let result   = null;
        switch (type) {
            case constants.UIREAD_BATTERY:
                this._battery = inputData[5];
                if (callback) {
                    callback(result);
                }
                break;
            case constants.BEGIN_DOWNLOAD:
                result = inputData[6];
                handle = inputData[7];
                if (result === 0) {
                    let filename = this._pendingCommand.filename;
                    let data     = this._pendingCommand.data;
                    this.continueDownload(messageEncoder.decimalToLittleEndianHex(handle, 2), filename, data);
                    callback && callback(false);
                } else {
                    console.log('Download failed, status:' + result + ' handle: ' + handle);
                    callback && callback(true);
                }
                break;
            case constants.BEGIN_LIST_FILES:
                let files = this.readFilesRecieved(inputData);
                if (callback) {
                    callback(files);
                }
                break;
            case constants.INPUT_DEVICE_GET_TYPE_MODE:
                if (this.receiveTypeMode(inputData)) {
                    // Receive probably failed...
                    console.log('Receive failed for layer:', this._pendingCommand.layer);
                    this._failedConnectionTypesLayer = this._pendingCommand.layer;
                } else if (this._failedConnectionTypesLayer === this._pendingCommand.layer) {
                    this._failedConnectionTypesLayer = -1;
                }
                break;
            case constants.SYSTEM_COMMAND:
                if (callback) {
                    callback(inputData[4] === 3);
                }
                break;
        }
        this._pendingCommand = null;
        this.executeAgain(1);
    }
};
