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

                this._structOffset      = 0;
                this._structList        = {};
                this._struct            = null;
                this._structLocal       = {};

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
                        throw this._compiler.createError('"]" expected.');
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
            this.declareGlobal = function(name, type, arrayType, struct, location, allowConstant) {
                var metaType   = this.getPointerVar(name) ? $.T_META_POINTER : null;
                var vr         = this._parseVariable(this.getNameWithoutPointer(name));
                var globalList = this._globalList;
                var size       = struct ? struct.size : 1;

                wheel.compiler.compilerHelper.checkDuplicateIdentifier(this._compiler, vr.name, globalList);
                wheel.compiler.compilerHelper.checkInvalidConstant(this._compiler, vr, allowConstant);

                var global = {
                        type:     (vr.length === 1) ? type : arrayType,
                        metaType: metaType,
                        offset:   this._globalOffset,
                        size:     size,
                        length:   vr.length,
                        struct:   struct ? struct : null,
                        value:    vr.value,
                        location: location
                    };
                globalList[vr.name] = global;

                if (metaType === $.T_META_POINTER) {
                    size = 1; // Only use 1 number for a pointer, the struct size might differ...
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
                        if (vr.struct) {
                            var struct = vr.struct;
                            var i      = 1;
                            while (struct && (i < parts.length)) {
                                field = parts[i];
                                if (field in struct.fields) {
                                    field           = struct.fields[field];
                                    result.type     = (field.length > 1) ? baseArrayType : baseType;
                                    result.origType = field.type;
                                    result.metaType = field.metaType;
                                    result.offset += field.offset;
                                    struct = field.struct;
                                } else {
                                    throw this._compiler.createError('Undefined field "' + field + '".');
                                }
                                i++;
                            }
                            return result;
                        } else {
                            throw this._compiler.createError('Type error.');
                        }
                    }
                    return vr;
                }
                return null;
            };

            this.findGlobal = function(name) {
                return this.findInList(this._globalList, name, $.T_NUM_G, $.T_NUM_G_ARRAY);
            };

            this.getGlobalList = function() {
                return this._globalList;
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

            this.declareLocal = function(name, type, arrayType, struct, allowConstant) {
                var metaType  = this.getPointerVar(name) ? $.T_META_POINTER : null;
                var vr        = this._parseVariable(this.getNameWithoutPointer(name));
                var localList = this._localList;
                var size      = (metaType === $.T_META_POINTER) ? 1 : (struct ? struct.size : 1);

                wheel.compiler.compilerHelper.checkDuplicateIdentifier(this._compiler, vr.name, localList);
                wheel.compiler.compilerHelper.checkInvalidConstant(this._compiler, vr, allowConstant);

                var local = {
                        type:     (vr.length === 1) ? type : arrayType,
                        metaType: metaType,
                        offset:   this._localOffset,
                        size:     size,
                        length:   vr.length,
                        value:    vr.value,
                        struct:   struct ? struct : null
                    };
                localList[vr.name] = local;

                if (metaType === $.T_META_POINTER) {
                    this._localOffset += 1; // Only use 1 number for a pointer, the struct size might differ...
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
                if (name in this._labelList) {
                    return this._labelList[name];
                }
                return null;
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

            /* Struct */
            this.declareStruct = function(name, command, location) {
                var result = {
                        name:     name,
                        size:     0,
                        fields:   {},
                        location: location
                    };
                var compiler   = this._compiler;
                var structList = this._structList;
                if (!wheel.compiler.compilerHelper.validateString(name)) {
                    throw compiler.createError('Syntax error.');
                }

                wheel.compiler.compilerHelper.checkDuplicateIdentifier(this._compiler, name, structList);

                structList[name]   = result;
                this._struct       = result;
                this._structOffset = 0;

                if (compiler.getInProc()) {
                    this._structLocal[name] = true;
                }

                return result;
            };

            this.removeLocalStructs = function() {
                for (var name in this._structLocal) {
                    delete this._structList[name];
                }
                this._structLocal = {};
            };

            this.findStruct = function(name) {
                return this._structList[name] || null;
            };

            this.declareStructField = function(name, type, arrayType, size, structType) {
                (size   === undefined) && (size   = 1);
                var metaType = this.getPointerVar(name) ? $.T_META_POINTER : null;

                name = this.getNameWithoutPointer(name);

                var struct = this._struct;
                if (!struct) {
                    return null;
                }

                wheel.compiler.compilerHelper.checkDuplicateIdentifier(this._compiler, name, struct);

                var vr          = this._parseVariable(name);
                var structField = {
                        type:     (vr.length === 1) ? type : arrayType,
                        struct:   structType || false,
                        metaType: metaType,
                        offset:   this._structOffset,
                        size:     size,
                        length:   vr.length
                    };
                struct.fields[vr.name] = structField;

                this._structOffset += vr.length * size;
                struct.size = this._structOffset;

                return structField;
            };

            this.getStructList = function() {
                return this._structList;
            };

            this.getStructOffset = function(param) {
                var offset = 0;
                if (param.vr.struct) {
                    var struct = param.vr.struct;
                    var p      = param.param.split('.');
                    var i      = 1;

                    while (struct && (i < p.length)) {
                        var field = p[i];
                        var field = struct.fields[field];
                        offset += field.offset;
                        struct = field.struct;
                        i++;
                    }
                }
                return offset;
            };

            this.getOffset = function(param) {
                return ('origOffset' in param.vr) ? param.vr.origOffset : param.vr.offset;
            };

            this.paramInfo = function(param) {
                if (param === 'TRUE') {
                    return {
                        type:  $.T_NUM_C,
                        value: 1,
                        param: param
                    };
                } else if (param === 'FALSE') {
                    return {
                        type:  $.T_NUM_C,
                        value: 0,
                        param: param
                    };
                } else if (wheel.compiler.compilerHelper.getWrappedInChars(param, '"', '"')) {
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
                } else {
                    var offset;
                    var vr       = null;
                    var type     = null;
                    var metaType = null;
                    var label    = null;

                    var name = param;
                    if (name.length) {
                        if (name[0] === '&') {
                            name     = name.substr(1 - name.length);
                            metaType = $.T_META_ADDRESS;
                        } else if (this.getPointerVar(name)) {
                            name     = this.getNameWithoutPointer(name);
                            metaType = $.T_META_POINTER;
                        }
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
                                if (label !== null) {
                                    label.jumps.push(this._compiler.getOutput().getLength());
                                    type = $.T_LABEL;
                                }
                            }
                        }
                    }

                    if (type === null) {
                        throw this._compiler.createError('Undefined identifier "' + param + '".');
                    }

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