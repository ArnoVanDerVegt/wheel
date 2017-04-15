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

            this.expectStruct = function(param) {
                var parts = param.split('.');
                var vr    = this.findVar(parts[0]);
                if (vr) {
                    var struct = vr.struct;
                    if (struct) {
                        var k = 1;
                        while (k < parts.length) {
                            var field = struct.fields[parts[k]];
                            if (field) {
                                struct = field.struct;
                                if (!struct) {
                                    break;
                                }
                            } else {
                                // todo: Error
                            }
                            k++;
                        }
                    }
                    if (!struct) {
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
                    if (vr.length <= 0) {
                        throw this._compiler.createError(wheel.compiler.error.TYPE_ERROR_ARRAY_EXPECTED, 'Type error.');
                    }
                } else {
                    // todo: Error
                }
            };

            this.compileParams = function(line) {
                var compilerData = this._compilerData;
                var i            = line.indexOf('%offset(');
                while (i !== -1) {
                    var j          = line.indexOf(')', i);
                    var identifier = line.substr(i + 8, j - i - 8);
                    var offset     = 0;
                    var vr         = compilerData.findGlobal(identifier) || compilerData.findLocal(identifier);

                    if (vr) {
                        offset = vr.offset;
                        var struct = vr.struct;
                        var parts  = identifier.split('.');
                        var k      = 1;
                        while (k < parts.length) {
                            var field = struct.fields[parts[k]];
                            if (field) {
                                offset = field.offset;
                                struct = field.struct;
                            } else {
                                // todo: Error
                            }
                            k++;
                        }
                    } else {
                        // todo: Error
                    }

                    line = line.substr(0, i) + offset + line.substr(j, j - line.length);
                    i    = line.indexOf('%offset(');
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

                        case '%expect_struct':
                            this.expectStruct(param);
                            result = '';
                            break;

                        case '%expect_array':
                            this.expectArray(param);
                            result = '';
                            break;

                        case '%ifglobal':
                            result = '';
                            if (this._compilerData.findGlobal(param)) {
                                while (index < lines.length) {
                                    if (lines[index] === '%else') {
                                        lines[index] = '';
                                        break;
                                    }
                                    index++;
                                }
                                while (index < lines.length) {
                                    if (lines[index] === '%end') {
                                        lines[index] = '';
                                        break;
                                    }
                                    lines[index] = '';
                                    index++;
                                }
                            } else {
                                while (index < lines.length) {
                                    if (lines[index] === '%else') {
                                        lines[index] = '';
                                        break;
                                    }
                                    lines[index] = '';
                                    index++;
                                }
                                while (index < lines.length) {
                                    if (lines[index] === '%end') {
                                        lines[index] = '';
                                        break;
                                    }
                                    index++;
                                }
                            }
                            break;
                    }
                }

                return result;
            };
        })
    );
})();
