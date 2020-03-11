/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const multiplexerModuleConstants = require('../../../../shared/vm/modules/multiplexerModuleConstants');
const VMModule                   = require('./../VMModule').VMModule;

exports.MultiplexerModule = class extends VMModule {
    constructor(opts) {
        super(opts);
        this._writeOffset       = 0;
        this._writeOffsetByPort = [0, 0, 0, 0];
    }

    run(commandId) {
        let vmData = this._vmData;
        switch (commandId) {
            case multiplexerModuleConstants.MULTI_MULTI_SET_WRITE_OFFSET:
                this._writeOffset = vmData.getRegSrc();
                break;

            case multiplexerModuleConstants.MULTI_MULTI_START:
                let multi = vmData.getRecordFromSrcOffset(['port']);
                if (this._writeOffset !== 0) {
                    this._writeOffsetByPort[multi.port] = this._writeOffset;
                    this._writeOffset                   = 0;
                }
                break;

            case multiplexerModuleConstants.MULTI_MULTI_STOP:
                break;

            case multiplexerModuleConstants.MULTI_MULTI_STOP_ALL:
                break;
        }
    }

    onValueChanged(port, input, value) {
        let writeOffsetByPort = this._writeOffsetByPort;
        if (writeOffsetByPort[port] === 0) {
            return;
        }
        let offset = writeOffsetByPort[port] + input;
        this._vmData.setNumberAtOffset(value ? 1 : 0, offset);
    }
};
