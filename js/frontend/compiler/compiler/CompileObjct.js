/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const $ = require('../../program/commands');

exports.CompileObjct = class {
    constructor(opts) {
        this._program = opts.program;
    }

    compileMethodTable(objct) {
        let commands    = this._program.getCommands();
        let methodTable = objct.getMethodTable();
        let index       = 0;
        objct.getVars().forEach((field) => {
            if (field.getProc()) {
                let methodOffset     = field.getOffset();
                let methodCodeOffset = field.getProc().getCodeOffset() - 1;
                let command          = commands[methodTable[index]];
                // Update the virtual method table...
                command.getParam1().setValue(methodOffset);
                command.getParam2().setValue(methodCodeOffset);
                index++;
            }
        });
    }

    compileConstructorCall(vr) {
        let objct = vr.getType();
        this._program.addCommand(
            // Set the self pointer...
            $.CMD_SET,  $.T_NUM_L, 3,                                $.T_NUM_C, vr.getOffset(),
            // Call the constructor...
            $.CMD_CALL, $.T_NUM_C, objct.getConstructorCodeOffset(), $.T_NUM_C, 3
        );
    }
};
