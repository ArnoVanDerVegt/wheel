/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const $             = require('../../program/commands');
const errors        = require('../errors');
const err           = require('../errors').errors;
const t             = require('../tokenizer/tokenizer');
const Objct         = require('../types/Objct').Objct;
const Var           = require('../types/Var');
const CompileRecord = require('./CompileRecord').CompileRecord;

exports.CompileObjct = class extends CompileRecord {
    getDataType() {
        return new Objct(null, this.getNamespacedRecordName(this._token.lexeme), false, this._compiler.getNamespace()).setToken(this._token);
    }

    compile(iterator) {
        let objct    = super.compile(iterator);
        let compiler = this._compiler;
        compiler.getUseInfo().setUseObjct(objct.getName());
        if (compiler.getPass() === 0) {
            return;
        }
        let program     = this._program;
        let methodTable = [];
        let methods     = compiler.getUseInfo().getUseObjct(objct.getName());
        objct
            .setConstructorCodeOffset(program.getLength())
            .setMethodTable(methodTable);
        // Move the self pointer to the pointer register...
        program.addCommand($.CMD_SET, $.T_NUM_G, $.REG_PTR, $.T_NUM_L, 0);
        // Create the virtual method table...
        for (let i = 0; i < methods; i++) {
            methodTable.push(program.getLength());
            // The offset relative to the self pointer and the method offset will be set when the main procedure is found!
            program.addCommand($.CMD_SET, $.T_NUM_P, 0, $.T_NUM_C, 0);
        }
        // Call the constructor for all object fields...
        objct.getVars().forEach((vr) => {
            if ((vr.getType() instanceof Objct) && !vr.getPointer()) {
                if (vr.getOffset() === 0) {
                    program.addCommand($.CMD_SET, $.T_NUM_L, 3, $.T_NUM_L, 0);
                } else {
                    program.addCommand(
                        $.CMD_SET, $.T_NUM_L, 3, $.T_NUM_L, 0,
                        $.CMD_ADD, $.T_NUM_L, 3, $.T_NUM_C, vr.getOffset()
                    );
                }
                program.addCommand($.CMD_CALL, $.T_NUM_C, vr.getType().getConstructorCodeOffset(), $.T_NUM_C, 3);
            }
        });
        program.addCommand($.CMD_RET, 0, 0, 0, 0);
    }
};
