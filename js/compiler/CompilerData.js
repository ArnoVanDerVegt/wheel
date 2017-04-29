(function() {
    var wheel = require('../utils/base.js').wheel;
    var $;

    wheel(
        'compiler.CompilerData',
        wheel.Class(function() {
            this.init = function(opts) {
                this._compiler = opts.compiler;

                $ = wheel.compiler.command;

                this.reset();
            };

            this.reset = function() {
                this._globalOffset      = 0;
                this._globalList        = {};
                this._globalConstants   = [];

                this._localOffset       = 0;
                this._localList         = {};

                this._labelList         = {};

                this._procedureList     = {};
                this._procedure         = null;

                this._recordOffset      = 0;
                this._recordList        = {};
                this._record            = null;
                this._recordLocal       = {};

                this._stringList        = [];

                this.declareGlobal('_____GLOBAL_REG_STACK_____',  $.T_NUM_G, 0, null, {}, false);
                this.declareGlobal('_____GLOBAL_REG_SRC_____',    $.T_NUM_G, 0, null, {}, false);
                this.declareGlobal('_____GLOBAL_REG_DEST_____',   $.T_NUM_G, 0, null, {}, false);
                this.declareGlobal('_____GLOBAL_REG_CODE_____',   $.T_NUM_G, 0, null, {}, false);
                this.declareGlobal('_____GLOBAL_REG_RETURN_____', $.T_NUM_G, 0, null, {}, false);
                this.declareGlobal('_____GLOBAL_REG_FLAGS_____',  $.T_NUM_G, 0, null, {}, false);
            };

            this._parseVariable = function(name) {
                var value = null;
                var i     = name.indexOf('=');

                if (i !== -1) {
                    value = name.substr(i + 1 - name.length).trim();
                    name  = name.substr(0, i).trim();
                }

                var length = 1;
                i = name.indexOf('[');
                if (i !== -1) {
                    if (name[name.length - 1] === ']') {
                        length = parseInt(name.substr(i + 1, name.length - i - 2));
                        name   = name.substr(0, i);
                    } else {
                        throw this._compiler.createError(wheel.compiler.error.SYNTAX_ERROR_ARRAY_CLOSE_EXPECTED, '"]" expected.');
                    }
                }

                return {
                    name:   name,
                    value:  value,
                    length: length
                };
            };

            this.getPointerVar = function(name) {
                return (name[0] === '*');
            };

            this.getNameWithoutPointer = function(name) {
                return this.getPointerVar(name) ? name.substr(1 - name.length) : name;
            };

            /* Global constants */
            this.declareConstant = function(offset, data) {
                this._globalConstants.push({
                    offset: offset,
                    data:   data
                });
            };

            this.getGlobalConstants = function() {
                return this._globalConstants;
            };

            /* Global */
            this.declareGlobal = function(name, type, arrayType, record, location, allowConstant) {
                var metaType   = this.getPointerVar(name) ? $.T_META_POINTER : null;
                var vr         = this._parseVariable(this.getNameWithoutPointer(name));
                var globalList = this._globalList;
                var size       = record ? record.size : 1;

                wheel.compiler.compilerHelper.checkDuplicateIdentifier(this._compiler, vr.name, globalList);
                wheel.compiler.compilerHelper.checkInvalidConstant(this._compiler, vr, allowConstant);

                var global = {
                        type:     (vr.length === 1) ? type : arrayType,
                        metaType: metaType,
                        offset:   this._globalOffset,
                        size:     size,
                        length:   vr.length,
                        record:   record ? record : null,
                        value:    vr.value,
                        location: location
                    };
                globalList[vr.name] = global;

                if (metaType === $.T_META_POINTER) {
                    size = 1; // Only use 1 number for a pointer, the record size might differ...
                }
                this._globalOffset += vr.length * size;

                return global;
            };

            this.declareString = function(value) {
                var stringList = this._stringList;
                var result     = stringList.indexOf(value);

                if (result === -1) {
                    result = this._stringList.length;
                    this._stringList.push(value);
                }
                return result;
            };

            this.getStringList = function() {
                return this._stringList;
            };

            this.allocateGlobal = function(size) {
                var offset = this._globalOffset;
                this._globalOffset += size;
                return offset;
            };

            this.findInList = function(list, name, baseType, baseArrayType) {
                var field = false;
                var parts = name.trim().split('.');

                if (parts.length > 1) {
                    field = true;
                    name  = parts[0];
                }

                if (name in list) {
                    var vr = list[name];
                    if (field) {
                        var result = {};
                        for (var i in vr) {
                            result[i] = vr[i];
                        }
                        result.origOffset = result.offset;
                        //if (vr.record) {
                            var record = vr.record;
                            var i      = 1;
                            while (record && (i < parts.length)) {
                                field = parts[i];
                                if (field in record.fields) {
                                    field           = record.fields[field];
                                    result.type     = (field.length > 1) ? baseArrayType : baseType;
                                    result.origType = field.type;
                                    result.metaType = field.metaType;
                                    result.offset += field.offset;
                                    record = field.record;
                                } else {
                                    throw this._compiler.createError(wheel.compiler.error.UNDEFINED_FIELD, 'Undefined field "' + field + '".');
                                }
                                i++;
                            }
                            return result;
                        //} else {
                        //    throw this._compiler.createError(wheel.compiler.error.TYPE_ERROR_STRUCT_EXPECTED, 'Type error.');
                        //}
                    }
                    return vr;
                }
                return null;
            };

            this.findGlobal = function(name) {
                return this.findInList(this._globalList, name, $.T_NUM_G, $.T_NUM_G_ARRAY);
            };

            this.getGlobalOffset = function() {
                return this._globalOffset;
            };

            /* Local */
            this.resetLocal = function() {
                this._localOffset = 0;
                this._localList   = {};

                this.declareLocal('_____LOCAL1_____', $.T_NUM_L, false, false, false);
                this.declareLocal('_____LOCAL2_____', $.T_NUM_L, false, false, false);
            };

            this.declareLocal = function(name, type, arrayType, record, allowConstant) {
                var metaType  = this.getPointerVar(name) ? $.T_META_POINTER : null;
                var vr        = this._parseVariable(this.getNameWithoutPointer(name));
                var localList = this._localList;
                var size      = (metaType === $.T_META_POINTER) ? 1 : (record ? record.size : 1);

                wheel.compiler.compilerHelper.checkDuplicateIdentifier(this._compiler, vr.name, localList);
                wheel.compiler.compilerHelper.checkInvalidConstant(this._compiler, vr, allowConstant);

                var local = {
                        type:     (vr.length === 1) ? type : arrayType,
                        metaType: metaType,
                        offset:   this._localOffset,
                        size:     size,
                        length:   vr.length,
                        value:    vr.value,
                        record:   record ? record : null
                    };
                localList[vr.name] = local;

                if (metaType === $.T_META_POINTER) {
                    this._localOffset += 1; // Only use 1 number for a pointer, the record size might differ...
                } else {
                    this._localOffset += vr.length * size;
                }

                return local;
            };

            this.findLocal = function(name) {
                return this.findInList(this._localList, name, $.T_NUM_L, $.T_NUM_L_ARRAY);
            };

            this.getLocalOffset = function() {
                return this._localOffset;
            };

            /* Label */
            this.declareLabel = function(name, location) {
                var labelList = this._labelList;
                if (name in labelList) {
                    return true;
                }
                labelList[name] = {
                    index:    null,
                    jumps:    [],
                    location: location
                };
                return false;
            };

            this.findLabel = function(name) {
                return this._labelList[name];
            };

            this.getLabelList = function() {
                return this._labelList;
            };

            /* Procedure */
            this.declareProcedure = function(name, index) {
                var procedureList = this._procedureList;

                wheel.compiler.compilerHelper.checkDuplicateIdentifier(this._compiler, name, procedureList);

                this.resetLocal();
                this._procedure = {
                    index:      index,
                    paramTypes: []
                };
                procedureList[name] = this._procedure;

                return this._procedure;
            };

            this.findProcedure = function(name) {
                return this._procedureList[name] || null;
            };

            /* Record */
            this.declareRecord = function(name, command, location) {
                var result = {
                        name:     name,
                        size:     0,
                        fields:   {},
                        location: location
                    };
                var compiler   = this._compiler;
                var recordList = this._recordList;
                if (!wheel.compiler.compilerHelper.validateString(name)) {
                    throw compiler.createError(wheel.compiler.error.SYNTAX_ERROR_INVALID_STRUCS_CHAR, 'Syntax error.');
                }

                wheel.compiler.compilerHelper.checkDuplicateIdentifier(this._compiler, name, recordList);

                recordList[name]   = result;
                this._record       = result;
                this._recordOffset = 0;

                if (compiler.getInProc()) {
                    this._recordLocal[name] = true;
                }

                return result;
            };

            this.removeLocalRecords = function() {
                for (var name in this._recordLocal) {
                    delete this._recordList[name];
                }
                this._recordLocal = {};
            };

            this.findRecord = function(name) {
                return this._recordList[name] || null;
            };

            this.declareRecordField = function(name, type, arrayType, size, recordType) {
                (size   === undefined) && (size   = 1);
                var metaType = this.getPointerVar(name) ? $.T_META_POINTER : null;
                var record   = this._record;

                name = this.getNameWithoutPointer(name);

                wheel.compiler.compilerHelper.checkDuplicateIdentifier(this._compiler, name, record);

                var vr          = this._parseVariable(name);
                var recordField = {
                        type:     (vr.length === 1) ? type : arrayType,
                        record:   recordType || false,
                        metaType: metaType,
                        offset:   this._recordOffset,
                        size:     size,
                        length:   vr.length
                    };
                record.fields[vr.name] = recordField;

                this._recordOffset += vr.length * size;
                record.size = this._recordOffset;

                return recordField;
            };

            this.paramInfo = function(param) {
                if (wheel.compiler.compilerHelper.getWrappedInChars(param, '"', '"')) {
                    return {
                        type:     $.T_NUM_C,
                        metaType: $.T_META_STRING,
                        value:    param.substr(1, param.length - 2),
                        param:    param
                    };
                } else if (wheel.compiler.compilerHelper.getWrappedInChars(param, '[', ']')) {
                    return {
                        type:  $.T_NUM_G_ARRAY, // Array constant
                        value: param,
                        param: param
                    };
                } else if (!isNaN(parseFloat(param))) {
                    return {
                        type:  $.T_NUM_C,
                        value: parseFloat(param),
                        param: param
                    };
                } else if (wheel.compiler.command.REGS.indexOf(param) !== -1) {
                    return {
                        type:  $.T_NUM_G,
                        value: wheel.compiler.command.REGS.indexOf(param),
                        param: param
                    };
                } else if (param === '%REG_STACK') {
                    return {
                        type:  $.T_NUM_L,
                        value: 0,
                        param: param
                    };
                } else {
                    var offset;
                    var vr       = null;
                    var type     = null;
                    var metaType = null;
                    var label    = null;
                    var name     = param;

                    if (name[0] === '&') {
                        name     = name.substr(1 - name.length);
                        metaType = $.T_META_ADDRESS;
                    } else if (this.getPointerVar(name)) {
                        name     = this.getNameWithoutPointer(name);
                        metaType = $.T_META_POINTER;
                    }

                    var local = this.findLocal(name);
                    if (local !== null) {
                        offset = local.offset;
                        type   = local.type;
                        vr     = local;
                    } else {
                        var global = this.findGlobal(name);
                        if (global !== null) {
                            offset = global.offset;
                            type   = global.type;
                            vr     = global;
                        } else {
                            var procedure = this.findProcedure(param);
                            if (procedure !== null) {
                                offset = procedure.index - 1; // Offset of procedure?
                                type   = $.T_PROC;
                                vr     = procedure;
                            } else {
                                offset = 0;
                                label  = this.findLabel(param);
                                label.jumps.push(this._compiler.getOutput().getLength());
                               type = $.T_LABEL;
                            }
                        }
                    }

                    //if (type === null) {
                    //    throw this._compiler.createError(wheel.compiler.error.UNDEFINED_IDENTIFIER, 'Undefined identifier "' + param + '".');
                    //}

                    return {
                        type:     type,
                        metaType: metaType,
                        vr:       vr,
                        value:    offset,
                        param:    param,
                        label:    label
                    };
                }
            };
        })
    );
})();