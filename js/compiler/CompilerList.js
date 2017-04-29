(function() {
    var wheel = require('../utils/base.js').wheel;
    var $;

    wheel(
        'compiler.CompilerList',
        wheel.Class(function() {
            this.init = function(opts) {
                $ = wheel.compiler.command;

                this._compiler     = opts.compiler;
                this._compilerData = opts.compilerData;
                this.reset();
            };

            this.reset = function() {
                this._offset = 0;
                this._list   = {};
            };

            this.declareItem = function(name, type, arrayType, record, allowConstant) {
                var compiler     = this._compiler;
                var compilerData = this._compilerData;
                var metaType     = compilerData.getPointerVar(name) ? $.T_META_POINTER : null;
                var vr           = compilerData._parseVariable(compilerData.getNameWithoutPointer(name));
                var list         = this._list;
                var size         = (metaType === $.T_META_POINTER) ? 1 : (record ? record.size : 1);

                wheel.compiler.compilerHelper.checkDuplicateIdentifier(compiler, vr.name, list);
                wheel.compiler.compilerHelper.checkInvalidConstant(compiler, vr, allowConstant);

                var item = {
                        type:     (vr.length === 1) ? type : arrayType,
                        metaType: metaType,
                        offset:   this._offset,
                        size:     size,
                        length:   vr.length,
                        value:    vr.value,
                        record:   record ? record : null
                    };
                list[vr.name] = item;

                if (metaType === $.T_META_POINTER) {
                    this._offset += 1; // Only use 1 number for a pointer, the record size might differ...
                } else {
                    this._offset += vr.length * size;
                }

                return item;
            };

            this.allocate = function(size) {
                var offset = this._offset;
                this._offset += size;
                return offset;
            };

            this.find = function(name, baseType, baseArrayType) {
                var list  = this._list;
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
                        //if (vr.record) {
                            var record = vr.record;
                            var i      = 1;
                            while (record && (i < parts.length)) {
                                field = parts[i];
                                var fields = record.list.getList();
                                if (field in fields) {
                                    field           = fields[field];
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

            this.getList = function() {
                return this._list;
            };

            this.getOffset = function() {
                return this._offset;
            };
        })
    );
})();

