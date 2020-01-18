/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const multiplexerModuleConstants = require('../../../../shared/vm/modules/multiplexerModuleConstants');
const VMModule                   = require('./../VMModule').VMModule;

exports.MultiplexerModule = class extends VMModule {
    run(commandId) {
        let vmData = this._vmData;
        switch (commandId) {
            case multiplexerModuleConstants.MULTI_MULTI_SET_WRITE_OFFSET:
                break;

            case multiplexerModuleConstants.MULTI__MULTI_START:
                break;

            case multiplexerModuleConstants.MULTI_MULTI_STOP:
                break;

            case multiplexerModuleConstants.MULTI_MULTI_STOP_ALL:
                break;
        }
    }
};
