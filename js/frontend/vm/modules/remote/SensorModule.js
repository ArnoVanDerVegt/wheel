/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const sensorModuleConstants = require('../../../../shared/vm/modules/sensorModuleConstants');
const VMModule              = require('./../VMModule').VMModule;

exports.SensorModule = class extends VMModule {
    run(commandId) {
        let vm     = this._vm;
        let vmData = this._vmData;
        let device = this._device();
        let sensor;
        switch (commandId) {
            case sensorModuleConstants.SENSOR_SET_TYPE:
                sensor = vmData.getRecordFromAtOffset(['layer', 'id', 'type']);
                this.emit('Sensor.SetType', sensor);
                device.module(sensorModuleConstants.MODULE_SENSOR, sensorModuleConstants.SENSOR_SET_TYPE, sensor);
                break;
            case sensorModuleConstants.SENSOR_GET_TYPE:
                sensor = vmData.getRecordFromAtOffset(['layer', 'id']);
                sensor.callback = function(value) { vmData.setNumberAtRet(value); };
                this.emit('Sensor.GetType', sensor);
                break;
            case sensorModuleConstants.SENSOR_SET_MODE:
                sensor = vmData.getRecordFromAtOffset(['layer', 'id', 'mode']);
                this.emit('Sensor.SetMode', sensor);
                device.module(sensorModuleConstants.MODULE_SENSOR, sensorModuleConstants.SENSOR_SET_MODE, sensor);
                break;
            case sensorModuleConstants.SENSOR_RESET:
                sensor = vmData.getRecordFromAtOffset(['layer', 'id']);
                device.module(sensorModuleConstants.MODULE_SENSOR, sensorModuleConstants.SENSOR_RESET, sensor);
                break;
            case sensorModuleConstants.SENSOR_READ:
                sensor = vmData.getRecordFromAtOffset(['layer', 'id']);
                device.module(sensorModuleConstants.MODULE_SENSOR, sensorModuleConstants.SENSOR_READ, sensor);
                let state = device.getLayerState(sensor.layer);
                if (state) {
                    let sensors = state.getSensors() || [];
                    let value   = sensors[sensor.id];
                    vmData.setNumberAtRet(value);
                }
                break;
        }
    }
};
