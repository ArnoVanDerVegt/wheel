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

    compileExtends(iterator, dataType) {
        let token = iterator.skipWhiteSpace().peek();
        if (token.lexeme === t.LEXEME_EXTENDS) {
            iterator.next();
            iterator.skipWhiteSpace();
            token = iterator.next();
            if (token.cls !== t.TOKEN_IDENTIFIER) {
                throw errors.createError(err.IDENTIFIER_EXPECTED, token, 'Identifier expected.');
            }
            let superObjct = this._scope.findIdentifier(token.lexeme);
            if (!superObjct) {
                throw errors.createError(err.UNDEFINED_IDENTIFIER, token, 'Undefined identifier.');
            }
            if (!(superObjct instanceof Objct)) {
                throw errors.createError(err.OBJECT_TYPE_EXPECTED, token, 'Object type expected.');
            }
            dataType.extend(superObjct);
        }
    }

    compileMethodTable(objct, methodTable) {
        let compiler = this._compiler;
        let program  = this._program;
        let methods  = compiler.getUseInfo().getUseObjct(objct.getName());
        // Move the self pointer to the pointer register...
        program.addCommand($.CMD_SET, $.T_NUM_G, $.REG_PTR, $.T_NUM_L, 0);
        // Get the methods from the super objects...
        let superObjct = objct.getParentScope();
        while (superObjct instanceof Objct) {
            let superMethods = compiler.getUseInfo().getUseObjct(superObjct.getName());
            for (let i = 0; i < superMethods; i++) {
                methodTable.push(program.getLength());
                program.addCommand($.CMD_SET, $.T_NUM_P, 0, $.T_NUM_C, 0);
            }
            superObjct = superObjct.getParentScope();
        }
        // Create the virtual method table...
        for (let i = 0; i < methods; i++) {
            methodTable.push(program.getLength());
            // The offset relative to the self pointer and the method offset will be set when the main procedure is found!
            program.addCommand($.CMD_SET, $.T_NUM_P, 0, $.T_NUM_C, 0);
        }
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
        objct
            .setConstructorCodeOffset(program.getLength())
            .setMethodTable(methodTable);
        this.compileMethodTable(objct, methodTable);
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
