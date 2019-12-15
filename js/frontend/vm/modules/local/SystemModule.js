/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const systemModuleConstants = require('../../../../shared/vm/modules/systemModuleConstants');
const VMModule              = require('./../VMModule').VMModule;

exports.SystemModule = class extends VMModule {
    run(commandId) {
        let vmData = this._vmData;
        let vm     = this._vm;
        switch (commandId) {
            case systemModuleConstants.SYSTEM_GET_BATTERY_VOLTAGE:
                this.emit('System.GetBatteryVoltage', {});
                vmData.setNumberAtRet(7);
                break;
            case systemModuleConstants.SYSTEM_GET_BATTERY_CURRENT:
                this.emit('System.GetBatteryCurrent', {});
                vmData.setNumberAtRet(500);
                break;
            case systemModuleConstants.SYSTEM_GET_BATTERY_LEVEL:
                this.emit('System.GetBatteryLevel', {});
                vmData.setNumberAtRet(25);
                break;
            case systemModuleConstants.SYSTEM_GET_VOLUME:
                this.emit('System.GetVolume', {});
                vmData.setNumberAtRet(50);
                break;
            case systemModuleConstants.SYSTEM_SET_VOLUME:
                let setVolume = vmData.getRecordFromAtOffset(['volume']);
                this.emit('System.SetVolume', setVolume);
                break;
            case systemModuleConstants.SYSTEM_GET_POWER_OFF_MINUTES:
                let getPowerOffMinutes = vmData.getRecordFromAtOffset(['minutes']);
                this.emit('System.GetPowerOffMinutes', getPowerOffMinutes);
                vmData.setNumberAtRet(30);
                break;
            case systemModuleConstants.SYSTEM_SET_POWER_OFF_MINUTES:
                this.emit('System.SetPowerOffMinutes', vmData.getRecordFromAtOffset(['time']));
                break;
            case systemModuleConstants.SYSTEM_GET_BRICKNAME:
                this.emit('System.GetBrickname', {});
                let getBrickname = vmData.getRecordFromAtOffset(['name']);
                vmData.getStringList()[getBrickname.name] = 'EV3';
                break;
            case systemModuleConstants.SYSTEM_SET_BRICKNAME:
                let setBrickname = vmData.getRecordFromAtOffset(['name']);
                this.emit('System.SetBrickname', {name: vmData.getStringList()[setBrickname.name]});
                break;
            case systemModuleConstants.SYSTEM_GET_MEMORY_TOTAL:
                this.emit('System.GetMemoryTotal', {});
                vmData.setNumberAtRet(1024 * 16);
                break;
            case systemModuleConstants.SYSTEM_GET_MEMORY_FREE:
                this.emit('System.GetMemoryFree', {});
                vmData.setNumberAtRet(1024 * 4);
                break;
        }
    }
};
