(function() {
    var wheel = require('../utils/base.js').wheel;

    wheel(
        'compiler.CompilerData',
        wheel.Class(function() {
            this.init = function(opts) {
                this._compiler = opts.compiler;

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

                this.declareGlobal('_____GLOBAL_REG_OFFSET_STACK_____', wheel.compiler.command.T_NUMBER_GLOBAL, 0, null, {}, false);
                this.declareGlobal('_____GLOBAL_REG_OFFSET_SRC_____',   wheel.compiler.command.T_NUMBER_GLOBAL, 0, null, {}, false);
                this.declareGlobal('_____GLOBAL_REG_OFFSET_DEST_____',  wheel.compiler.command.T_NUMBER_GLOBAL, 0, null, {}, false);
                this.declareGlobal('_____GLOBAL_REG_OFFSET_CODE_____',  wheel.compiler.command.T_NUMBER_GLOBAL, 0, null, {}, false);
                this.declareGlobal('_____GLOBAL_REG_RETURN_____',       wheel.compiler.command.T_NUMBER_GLOBAL, 0, null, {}, false);
                this.declareGlobal('_____GLOBAL_REG_FLAGS_____',        wheel.compiler.command.T_NUMBER_GLOBAL, 0, null, {}, false);
            };

            this._parseVariable = function(name) {
                var value = null,
                    i;

                i = name.indexOf('=');
                if (i !== -1) {
                    value = name.substr(i + 1 - name.length).trim();
                    name  = name.substr(0, i).trim();
                }

                var length = 1;
                i = name.indexOf('[');
                if (i !== -1) {
                    if (name[name.length - 1] === ']') {
                        length = parseFloat(name.substr(i + 1, name.length - i - 2));
                        if (isNaN(length)) {

                        }
                        name = name.substr(0, i);
                    } else {
                        throw this._compiler.createError('"]" expected.');
                    }
                }

                return {
                    name:   name,
                    value:  value,
                    length: length
                }
            }

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
                var metaType = null;

                if (name[0] === '*') {
                    name     = name.substr(1 - name.length);
                    metaType = wheel.compiler.command.T_META_POINTER;
                }

                var vr         = this._parseVariable(name);
                var globalList = this._globalList;
                var size       = struct ? struct.size : 1;

                if (vr.name in globalList) {
                    throw this._compiler.createError('Duplicate int identifier "' + vr.name + '".');
                }
                if ((vr.value !== null) && !allowConstant) {
                    throw this._compiler.createError('Invalid constant value "' + vr.value + '".');
                }

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

                if (metaType === wheel.compiler.command.T_META_POINTER) {
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

            this.findGlobal = function(name) {
                var globalList = this._globalList;
                var field      = null;
                var i          = name.indexOf('.');
                if (i !== -1) {
                    field = name.substr(i + 1 - name.length);
                    name  = name.substr(0, i);
                }
                if (name in globalList) {
                    var vr = globalList[name];
                    if (field) {
                        if (vr.struct) {
                            if (field in vr.struct.fields) {
                                field = vr.struct.fields[field];
                                var clonedVr = {};
                                for (var i in vr) {
                                    clonedVr[i] = vr[i];
                                }
                                clonedVr.offset += field.offset;
                                clonedVr.field    = field;
                                clonedVr.type     = (field.length > 1) ? wheel.compiler.command.T_NUMBER_GLOBAL_ARRAY : wheel.compiler.command.T_NUMBER_GLOBAL;
                                clonedVr.metaType = field.metaType;
                                return clonedVr;
                            }
                            throw this._compiler.createError('Undefined field "' + field + '".');
                        } else {
                            throw this._compiler.createError('Type error.');
                        }
                    }
                    return vr;
                }
                return null;
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

                this.declareLocal('_____LOCAL1_____', wheel.compiler.command.T_NUMBER_LOCAL, false, false, false);
                this.declareLocal('_____LOCAL2_____', wheel.compiler.command.T_NUMBER_LOCAL, false, false, false);
            };

            this.declareLocal = function(name, type, arrayType, struct, allowConstant) {
                var metaType = null;

                if (name[0] === '*') {
                    name         = name.substr(1 - name.length);
                    metaType     = wheel.compiler.command.T_META_POINTER;
                }

                var vr        = this._parseVariable(name);
                var localList = this._localList;
                var size      = struct ? struct.size : 1;

                if (vr.name in localList) {
                    throw this._compiler.createError('Duplicate int identifier "' + vr.name + '".');
                }
                if ((vr.value !== null) && !allowConstant) {
                    throw this._compiler.createError('Invalid constant value "' + vr.value + '".');
                }

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

                if (metaType === wheel.compiler.command.T_META_POINTER) {
                    size = 1; // Only use 1 number for a pointer, the struct size might differ...
                }
                this._localOffset += vr.length * size;

                return local;
            };

            this.findLocal = function(name) {
                var localList = this._localList;
                var field     = null;
                var i         = name.indexOf('.');
                if (i !== -1) {
                    field = name.substr(i + 1 - name.length);
                    name  = name.substr(0, i);
                }

                if (name in localList) {
                    var vr = localList[name];
                    if (field) {
                        if (vr.struct) {
                            if (field in vr.struct.fields) {
                                var clonedVr = {};
                                for (var i in vr) {
                                    clonedVr[i] = vr[i];
                                }
                                field = vr.struct.fields[field];
                                clonedVr.offset += field.offset;
                                clonedVr.type     = wheel.compiler.command.T_NUMBER_LOCAL;
                                clonedVr.metaType = field.metaType;
                                return clonedVr;
                            }
                            throw this._compiler.createError('Undefined field "' + field + '".');
                        } else {
                            throw this._compiler.createError('Type error.');
                        }
                    }
                    return vr;
                }
                return null;
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
                if (name in procedureList) {
                    throw this._compiler.createError('Duplicate procedure "' + name + '".');
                }
                this.resetLocal();
                this._procedure = {
                    index:      index,
                    paramTypes: []
                };
                procedureList[name] = this._procedure;

                return this._procedure;
            };

            this.findProcedure = function(name) {
                return (name in this._procedureList) ? this._procedureList[name] : null;
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
                if (name in structList) {
                    throw compiler.createError('Duplicate struct "' + name + '".');
                }
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
                return (name in this._structList) ? this._structList[name] : null;
            };

            this.declareStructField = function(name, type, arrayType) {
                var metaType = null;

                if (name[0] === '*') {
                    name      = name.substr(1 - name.length);
                    metaType  = wheel.compiler.command.T_META_POINTER;
                }

                var struct = this._struct;
                if (!struct) {
                    return null;
                }

                var vr = this._parseVariable(name);

                if (vr.name in struct) {
                    throw compiler.createError('Duplicate struct field "' + name + '".');
                }

                var structField = {
                        type:     (vr.length === 1) ? type : arrayType,
                        metaType: metaType,
                        offset:   this._structOffset,
                        size:     1,
                        length:   vr.length
                    };
                struct.fields[vr.name] = structField;

                this._structOffset += vr.length;
                struct.size = this._structOffset;

                return structField;
            };

            this.getStructList = function() {
                return this._structList;
            };

            this.paramInfo = function(param) {
                if (param === 'TRUE') {
                    return {
                        type:  wheel.compiler.command.T_NUMBER_CONSTANT,
                        value: 1,
                        param: param
                    }
                } else if (param === 'FALSE') {
                    return {
                        type:  wheel.compiler.command.T_NUMBER_CONSTANT,
                        value: 0,
                        param: param
                    }
                } else if ((param.length > 2) && (param[0] === '"') && (param.substr(-1) === '"')) {
                    return {
                        type:     wheel.compiler.command.T_NUMBER_CONSTANT,
                        metaType: wheel.compiler.command.T_META_STRING,
                        value:    param.substr(1, param.length - 2),
                        param:    param
                    };
                } else if ((param.length > 2) && (param[0] === '[') && (param.substr(-1) === ']')) {
                    return {
                        type:  wheel.compiler.command.T_NUMBER_GLOBAL_ARRAY, // Array constant
                        value: param,
                        param: param
                    };
                } else if (!isNaN(parseFloat(param))) {
                    return {
                        type:  wheel.compiler.command.T_NUMBER_CONSTANT,
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
                            metaType = wheel.compiler.command.T_META_ADDRESS;
                        } else if (name[0] === '*') {
                            name     = name.substr(1 - name.length);
                            metaType = wheel.compiler.command.T_META_POINTER;
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
                                offset = procedure.index;
                                type   = wheel.compiler.command.T_PROC;
                                vr     = procedure;
                            } else {
                                offset = 0;
                                label  = this.findLabel(param);
                                if (label !== null) {
                                    label.jumps.push(this._compiler.getOutput().getLength());
                                    type = wheel.compiler.command.T_LABEL;
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
                    }
                }
            };
        })
    );
})();