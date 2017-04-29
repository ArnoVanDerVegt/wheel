(function() {
    var wheel = require('../utils/base.js').wheel;

    wheel(
        'compiler.CompilerMeta',
        wheel.Class(function() {
            this.init = function(opts) {
                this._compiler     = opts.compiler;
                this._compilerData = opts.compilerData;
            };

            this.findVar = function(vr) {
                var compilerData = this._compilerData;
                return compilerData.findGlobal(vr) || compilerData.findLocal(vr);
            };

            this.expectRecord = function(param) {
                var parts = param.split('.');
                var vr    = this.findVar(parts[0]);
                if (vr) {
                    var record = vr.record;
                    if (record) {
                        var k = 1;
                        while (k < parts.length) {
                            var field = record.list.getList()[parts[k]];
                            if (field) {
                                record = field.record;
                                if (!record) {
                                    break;
                                }
                            } else {
                                // todo: Error
                            }
                            k++;
                        }
                    }
                    if (!record) {
                        throw this._compiler.createError(wheel.compiler.error.TYPE_ERROR_STRUCT_EXPECTED, 'Type error.');
                    }
                } else {
                    // todo: Error
                }
            };

            this.expectArray = function(param) {
                var parts = param.split('.');
                var vr    = this.findVar(parts[0]);
                if (vr) {
                    var i = 1;
                    if (parts.length > 1) {
                        var record = vr.record;
                        for (var i = 1; i < parts.length; i++) {
                            var field = record.list.getList()[parts[i]];
                            if (!field) {
                                // todo: error
                            }
                            field.record && (record = field.record);
                        }
                        vr = record;
                    }
                    if (vr.length <= 1) {
                        throw this._compiler.createError(wheel.compiler.error.TYPE_ERROR_ARRAY_EXPECTED, 'Type error.');
                    }
                } else {
                    // todo: Error
                }
            };

            this.updateConditionalLines = function(lines, index, conditionTrue) {
                    var commandFromLine = function(line) {
                            var i = line.indexOf(' ');
                            return (i === -1) ? line : line.substr(0, i);
                        };
                    var updateLines = function(endCommand, clear) {
                            var clearLine = function(index) {
                                    lines[index] = '';
                                };

                            var count = 1;
                            var done  = false;
                            while (!done && (index < lines.length)) {
                                var command = commandFromLine(lines[index].trim());
                                switch (command) {
                                    case '%if_size_1':
                                        count++;
                                        break;

                                    case '%if_global':
                                        count++;
                                        break;

                                    case '%if_record':
                                        count++;
                                        break;

                                    case '%if_pointer':
                                        count++;
                                        break;

                                    default:
                                        if (command === endCommand) {
                                            count--;
                                            done = !count;
                                            done && clearLine(index);
                                        }
                                        break;
                                }
                                if (!done) {
                                    clear && clearLine(index);
                                    index++;
                                }
                            }
                        };

                updateLines('%else', !conditionTrue);
                updateLines('%end',  conditionTrue);
            };

            this.cleanIdentifier = function(identifier) {
                var s = '';
                var i = 0;

                while (i < identifier.length) {
                    var c = identifier[i++];
                    switch (c) {
                        case '[':
                            open = 1;
                            while (open) {
                                c = identifier[i++];
                                switch (c) {
                                    case '[':
                                        open++;
                                        break;

                                    case ']':
                                        open--;
                                        break;
                                }
                            }
                            break;

                        case '&':
                            break;

                        default:
                            s += c;
                            break;
                    }
                }
                return s;
            };

            /**
             * Get the last type of a composite type...
             *
             * a     --> return type info about "a"
             * a.b.c --> return type info about "c"
            **/
            this.findLastType = function(identifier) {
                identifier = this.cleanIdentifier(identifier);
                var vr     = this._compilerData.findGlobal(identifier) || this._compilerData.findLocal(identifier);
                var result = null;
                if (vr) {
                    result = vr;
                    var parts = identifier.split('.');
                    if (parts.length > 1) {
                        var record = result.record;
                        var i = 1;
                        while (i < parts.length) {
                            var field = record.list.getList()[parts[i]];
                            if (field) {
                                result = field;
                                record = field.record;
                            } else {
                                result = null;
                                break;
                            }
                            i++;
                        }
                    }
                }
                return result;
            };

            this.findMetaParam = function(line, param) {
                param = param + '(';
                var i = line.indexOf(param);
                if (i === -1) {
                    return false;
                }

                var j = line.indexOf(')', i);
                var k = param.length;

                return line.substr(i + k, j - i - k);
            };

            this.replaceMetaParam = function(line, param, value) {
                param = param + '(';
                var i = line.indexOf(param);
                var j = line.indexOf(')', i);

                return line.substr(0, i) + value + line.substr(j, j - line.length);
            };

            this.compileParams = function(line) {
                var replacers = {
                        '%offset': (function(line, param) {
                            var type = this.findLastType(param);
                            if (type === null) {
                                if (isNaN(param)) {
                                    throw this._compiler.createError(wheel.compiler.error.UNDEFINED_IDENTIFIER, 'Undefined identifier "' + param + '".');
                                } else {
                                    throw this._compiler.createError(wheel.compiler.error.TYPE_MISMATCH, 'Type mismatch "' + param + '".');
                                }
                            } else {
                                line = this.replaceMetaParam(line, '%offset', type.offset);
                            }
                            return line;
                        }).bind(this),
                        '%sizeof': (function(line, param) {
                            var type = this.findLastType(param);
                            if (type === null) {
                                throw new Error('sizeof Param "' + param + '" not found');
                                // todo: error
                            } else {
                                line = this.replaceMetaParam(line, '%sizeof', type.size);
                            }
                            return line;
                        }).bind(this)
                    };

                for (var replacer in replacers) {
                    var param = this.findMetaParam(line, replacer);
                    while (param) {
                        line  = replacers[replacer](line, param);
                        param = this.findMetaParam(line, replacer);
                    }
                }

                return line;
            };

            this.compile = function(lines, line, index) {
                var result = line;

                if (line.length && (line[0] === '%')) {
                    var i       = line.indexOf(' ');
                    var command = line.trim;
                    var param   = line.substr(i - line.length).trim();
                    (i !== -1) && (command = line.substr(0, i));

                    switch (command) {
                        case '%rem':
                            result = '';
                            break;

                        case '%expect_record':
                            this.expectRecord(param);
                            result = '';
                            break;

                        case '%expect_array':
                            this.expectArray(param);
                            result = '';
                            break;

                        case '%if_size_1':
                            result       = '';
                            lines[index] = '';
                            var vr = this.findLastType(this.cleanIdentifier(param));
                            if (vr) {
                                this.updateConditionalLines(lines, index, vr.size * vr.length <= 1);
                            } else {
                                // todo: error
                            }
                            break;

                        case '%if_global':
                            result       = '';
                            lines[index] = '';
                            this.updateConditionalLines(lines, index, !!this._compilerData.findGlobal(this.cleanIdentifier(param)));
                            break;

                        case '%if_record':
                            result = '';
                            var vr = this.findLastType(this.cleanIdentifier(param));
                            if (vr) {
                                lines[index] = '';
                                this.updateConditionalLines(lines, index, !!vr.record);
                            } else {
                                // todo: error
                            }
                            break;

                        case '%if_pointer':
                            result = '';
                            var vr = this.findLastType(this.cleanIdentifier(param));
                            if (vr) {
                                lines[index] = '';
                                this.updateConditionalLines(lines, index, vr.metaType === wheel.compiler.command.T_META_POINTER);
                            } else if (!isNaN(vr)) {
                                lines[index] = '';
                                this.updateConditionalLines(lines, index, false);
                            } else {
                                // todo: error
                            }
                            break;
                    }
                }

                return result;
            };
        })
    );
})();
