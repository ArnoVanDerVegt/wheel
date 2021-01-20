/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const sensorModuleConstants = require('../vm/modules/sensorModuleConstants');
const BasicDeviceModule     = require('./BasicDeviceModule').BasicDeviceModule;

exports.SensorModule = class extends BasicDeviceModule {
    run(commandId, data) {
        let device = this._device;
        switch (commandId) {
            case sensorModuleConstants.SENSOR_SET_TYPE:
                device && device.setType(data.layer, data.id, data.type);
                break;
            case sensorModuleConstants.SENSOR_SET_MODE:
                device && device.setMode(data.layer, data.id, data.mode);
                break;
        }
    }
};
