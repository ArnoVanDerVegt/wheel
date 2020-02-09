/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const deviceModuleConstants = require('../../../../shared/vm/modules/poweredUpModuleConstants');
const VMModule              = require('./../VMModule').VMModule;

exports.PoweredUpModule = class extends VMModule {
    run(commandId) {
        let vmData = this._vmData;
        let vm     = this._vm;
        switch (commandId) {
            case deviceModuleConstants.POWERED_UP_START:
                this.emit('PoweredUp.Start', vmData.getRegSrc());
                break;
        }
    }
};
