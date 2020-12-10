/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const $      = require('../../program/commands');
const Record = require('../types/Record').Record;
const Objct  = require('../types/Objct').Objct;

exports.CompileObjct = class {
    constructor(opts) {
        this._compiler      = opts.compiler;
        this._program       = opts.program;
        this._scope         = opts.scope;
        this._methodOffsets = null;
    }

    addCommand() {
        this._program.nextBlockId().addCommand.apply(this._program, [].slice.call(arguments));
    }

    addMethodPointer(field, commandIndex, superObjct) {
        if (field.getProc()) {
            let name             = field.getName();
            let methodOffset     = field.getOffset();
            let methodCodeOffset = field.getProc().getCodeOffset() - 1;
            if (!(name in this._methodOffsets)) {
                this._methodOffsets[name] = [];
            }
            this._methodOffsets[name].push({
                commandIndex: commandIndex,
                offset:       methodOffset,
                codeOffset:   methodCodeOffset
            });
            return true;
        }
        return false;
    }

    compileMethodTable(objct) {
        this._methodOffsets = {};
        let index       = 0;
        let methodTable = objct.getMethodTable();
        let superObjct  = objct.getParentScope();
        objct.getVars().forEach((field) => {
            if (this.addMethodPointer(field, methodTable[index], objct)) {
                index++;
            }
        });
        while (superObjct instanceof Objct) {
            index = (function(index, superObjct) {
                superObjct.getVars().forEach((field) => {
                    if (this.addMethodPointer(field, methodTable[index], superObjct)) {
                        index++;
                    }
                });
                return index;
            }).call(this, index, superObjct);
            superObjct = superObjct.getParentScope();
        }
        for (let name in this._methodOffsets) {
            let methods = this._methodOffsets[name];
            for (let i = 0; i < methods.length; i++) {
                let method  = methods[i];
                let command = this._program.getCommands()[method.commandIndex];
                command.getParam1().setValue(method.offset);
                command.getParam2().setValue(methods[methods.length - 1 - i].codeOffset); // Reverse the call order!
            }
        }
    }

    compileConstructorCall(local, offset, vr) {
        let objct   = vr.getType().type;
        let program = this._program;
        let size    = this._scope.getTotalSize();
        let call    = objct.getConstructorCodeOffset();
        if (vr.getArraySize() === false) {
            if (local) {
                program
                    .nextBlockId()
                    .addCommand(
                        $.CMD_SET,  $.T_NUM_L, size + 3, $.T_NUM_G, $.REG_STACK,
                        $.CMD_ADD,  $.T_NUM_L, size + 3, $.T_NUM_C, offset,                         // Set the self pointer...
                        $.CMD_CALL, $.T_NUM_C, call,     $.T_NUM_C, size + 3                        // Call the constructor...
                    );
            } else {
                program
                    .nextBlockId()
                    .addCommand(
                        $.CMD_SET,  $.T_NUM_L, size + 3, $.T_NUM_C, offset,                         // Set the self pointer...
                        $.CMD_CALL, $.T_NUM_C, call,     $.T_NUM_C, size + 3                        // Call the constructor...
                    );
            }
        } else {
            let loopJmpOffset;
            if (local) {
                loopJmpOffset = program.getLength() + 3;
                this.addCommand($.CMD_SET,  $.T_NUM_L, size + 2,    $.T_NUM_G, $.REG_STACK);        // Set the offset...
                this.addCommand($.CMD_ADD,  $.T_NUM_L, size + 2,    $.T_NUM_C, offset);             // Set the offset...
            } else {
                loopJmpOffset = program.getLength() + 2;
                this.addCommand($.CMD_SET,  $.T_NUM_L, size + 2,    $.T_NUM_C, offset);             // Set the offset...
            }
            this.addCommand($.CMD_SET,  $.T_NUM_L, size + 1,    $.T_NUM_C, 0);                      // Set a loop counter...
            this.addCommand($.CMD_SET,  $.T_NUM_L, size + 5,    $.T_NUM_L, size + 2);               // Set the self pointer...
            this.addCommand($.CMD_CALL, $.T_NUM_C, call,        $.T_NUM_C, size + 5);               // Call the constructor,  add 5 to the stack: 3 + 1 (counter) + 1 (offset)...
            this.addCommand($.CMD_ADD,  $.T_NUM_L, size + 2,    $.T_NUM_C, vr.getElementSize());    // Add the size to the offset...
            this.addCommand($.CMD_ADD,  $.T_NUM_L, size + 1,    $.T_NUM_C, 1);                      // Increase the loop counter...
            this.addCommand($.CMD_CMP,  $.T_NUM_L, size + 1,    $.T_NUM_C, vr.getArraySize());      // Compare the loop counter to the array size...
            this.addCommand($.CMD_JMPC, $.T_NUM_C, $.FLAG_LESS, $.T_NUM_C, loopJmpOffset);          // Jump if less...
        }
    }

    compileConstructorCalls(vr) {
        let baseOffset = vr.getOffset();
        let local      = !vr.getGlobal();
        const compileRecordFields = (vr, offset) => {
                if (vr.getParentScope() instanceof Objct) {
                    compileRecordFields(vr.getParentScope(), offset);
                }
                vr.getVars().forEach((field) => {
                    if (field.getUnionId() !== 0) { // Only initialize the first union part!
                        return;
                    }
                    if (field.getPointer() || field.getType().typePointer) {
                        return; // Don't call constructor on pointer!
                    }
                    if (!(field.getType().type instanceof Record)) {
                        return; // Only check Record or Objct...
                    }
                    let arraySize = field.getArraySize() || 1;
                    if (field.getType().type instanceof Objct) {
                        for (let i = 0; i < arraySize; i++) {
                            this.compileConstructorCall(local, baseOffset + offset + field.getOffset() + field.getElementSize() * i, field);
                            compileRecordFields(field.getType().type, offset + field.getOffset() + field.getElementSize() * i);
                        }
                    } else {
                        for (let i = 0; i < arraySize; i++) {
                            compileRecordFields(field.getType().type, offset + field.getOffset() + field.getElementSize() * i);
                        }
                    }
                });
            };
        if (vr.getType().type instanceof Objct) {
            if (!vr.getPointer() && !vr.getType().typePointer) {
                this.compileConstructorCall(local, vr.getOffset(), vr);
                compileRecordFields(vr.getType().type, 0);
            }
        } else if (vr.getType().type instanceof Record) {
            compileRecordFields(vr.getType().type, 0);
        }
    }
};
