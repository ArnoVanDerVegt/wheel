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
                this._globalConstants = [];
                this._global          = new wheel.compiler.CompilerList({compiler: this._compiler, compilerData: this});
                this._local           = new wheel.compiler.CompilerList({compiler: this._compiler, compilerData: this});
                this._labelList       = {};
                this._procedureList   = {};
                this._procedure       = null;
                this._record          = new wheel.compiler.CompilerRecord({compiler: this._compiler, compilerData: this});
                this._stringList      = [];

                this.declareGlobal('_____GLOBAL_REG_STACK_____',  $.T_NUM_G, 0, null, false);
                this.declareGlobal('_____GLOBAL_REG_SRC_____',    $.T_NUM_G, 0, null, false);
                this.declareGlobal('_____GLOBAL_REG_DEST_____',   $.T_NUM_G, 0, null, false);
                this.declareGlobal('_____GLOBAL_REG_CODE_____',   $.T_NUM_G, 0, null, false);
                this.declareGlobal('_____GLOBAL_REG_RETURN_____', $.T_NUM_G, 0, null, false);
                this.declareGlobal('_____GLOBAL_REG_FLAGS_____',  $.T_NUM_G, 0, null, false);
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
            this.declareGlobal = function(name, type, arrayType, record, allowConstant) {
                return this._global.declareItem(name, type, arrayType, record, allowConstant);
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
                return this._global.allocate(size);
            };

            this.findGlobal = function(name) {
                return this._global.find(name, $.T_NUM_G, $.T_NUM_G_ARRAY);
            };

            this.getGlobalOffset = function() {
                return this._global.getOffset();
            };

            /* Local */
            this.resetLocal = function() {
                this._local.reset();

                this.declareLocal('_____LOCAL1_____', $.T_NUM_L, false, false, false);
                this.declareLocal('_____LOCAL2_____', $.T_NUM_L, false, false, false);
            };

            this.declareLocal = function(name, type, arrayType, record, allowConstant) {
                return this._local.declareItem(name, type, arrayType, record, allowConstant);
            };

            this.findLocal = function(name) {
                return this._local.find(name, $.T_NUM_L, $.T_NUM_L_ARRAY);
            };

            this.getLocalOffset = function() {
                return this._local.getOffset();
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
                return this._record.declareRecord(name, command, location);
            };

            this.removeLocalRecords = function() {
                this._record.removeLocalRecords();
            };

            this.findRecord = function(name) {
                return this._record.findRecord(name);
            };

            this.declareRecordField = function(name, type, arrayType, size, recordType) {
                return this._record.declareRecordField(name, type, arrayType, size, recordType);
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