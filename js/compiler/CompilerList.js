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
                this._list   = [];
            };

            this.parseVariable = function(name) {
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

            this.declareItem = function(name, type, arrayType, record, allowConstant) {
                var compiler     = this._compiler;
                var compilerData = this._compilerData;
                var metaType     = compilerData.getPointerVar(name) ? $.T_META_POINTER : null;
                var vr           = this.parseVariable(compilerData.getNameWithoutPointer(name));
                var list         = this._list;
                var size         = (metaType === $.T_META_POINTER) ? 1 : (record ? record.size : 1);

                wheel.compiler.helpers.compilerHelper.checkDuplicateIdentifier(compiler, vr.name, list);
                wheel.compiler.helpers.compilerHelper.checkInvalidConstant(compiler, vr, allowConstant);

                var item = {
                        name:     vr.name,
                        type:     (vr.length === 1) ? type : arrayType,
                        metaType: metaType,
                        offset:   this._offset,
                        size:     size,
                        length:   vr.length,
                        value:    vr.value,
                        record:   record ? record : null
                    };
                list.push(item);

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
                var field = false;
                var parts = name.trim().split('.');

                if (parts.length > 1) {
                    field = true;
                    name  = parts[0];
                }

                var vr = this._list.filter(function(item) { return (item.name === name); })[0];
                if (vr) {
                    if (field) {
                        var result = {};
                        for (var i in vr) {
                            result[i] = vr[i];
                        }
                        var record = vr.record;
                        var i      = 1;
                        while (record && (i < parts.length)) {
                            var field = record.list.getByName(parts[i]);
                            if (field) {
                                result.type     = (field.length > 1) ? baseArrayType : baseType;
                                result.origType = field.type;
                                result.metaType = field.metaType;
                                result.offset += field.offset;
                                record = field.record;
                            } else {
                                throw this._compiler.createError(wheel.compiler.error.UNDEFINED_FIELD, 'Undefined field "' + parts[i] + '".');
                            }
                            i++;
                        }
                        return result;
                    }
                    return vr;
                }
                return null;
            };

            this.getList = function() {
                return this._list;
            };

            this.getByName = function(name) {
                return this._list.filter(function(item) { return (item.name === name); })[0] || null;
            };

            this.getOffset = function() {
                return this._offset;
            };
        })
    );
})();