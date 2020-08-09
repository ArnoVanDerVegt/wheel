/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const pspModuleConstants = require('../../../../shared/vm/modules/pspModuleConstants');
const VMModule           = require('./../VMModule').VMModule;

exports.PspModule = class extends VMModule {
    constructor(opts) {
        super(opts);
        this._writeOffset = 0;
    }

    run(commandId) {
        let vmData = this._vmData;
        switch (commandId) {
            case pspModuleConstants.PSP_PSP_SET_WRITE_OFFSET:
                this._writeOffset = vmData.getRegSrc();
                break;

            case pspModuleConstants.PSP_PSP_START:
                break;

            case pspModuleConstants.PSP_PSP_STOP:
                break;
        }
    }

    onValueChanged(input, value) {
        if (this._writeOffset === 0) {
            return;
        }
        this._vmData.setNumberAtOffset(value, this._writeOffset + input);
    }
};
