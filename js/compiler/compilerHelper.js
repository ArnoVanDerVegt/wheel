(function() {
    var wheel = require('../utils/base.js').wheel;

    wheel(
        'compiler.compilerHelper',
        {
            getWrappedInChars: function(s, open, close) {
                return (s.length >= 2) && (s[0] === open) && (s.substr(-1) === close);
            },

            checkWrapChars: function(compiler, s, open, close) {
                if (s.length && ((s.length < 2) || ((s[0] === open) && (s[s.length - 1] !== close)))) {
                    throw compiler.createError(wheel.compiler.error.SYNTAX_ERROR_INVALID_CHAR, 'Syntax error.');
                }
                return s.substr(1, s.length - 2);
            },

            checkDuplicateIdentifier: function(compiler, name, list) {
                if ('filter' in list) {
                    var vr = list.filter(function(item) { return (item.name === name); })[0];
                    if (vr) {
                        throw compiler.createError(wheel.compiler.error.DUPLICATE_IDENTIFIER, 'Duplicate identifier "' + name + '".');
                    }
                } else if (name in list) {
                    throw compiler.createError(wheel.compiler.error.DUPLICATE_IDENTIFIER, 'Duplicate identifier "' + name + '".');
                }
            },

            checkInvalidConstant: function(compiler, vr, allowConstant) {
                if ((vr.value !== null) && !allowConstant) {
                    throw compiler.createError(wheel.compiler.error.INVALID_CONSTANT, 'Invalid constant value "' + vr.value + '".');
                }
            },

            checkNumber: function(compiler, number, string, error) {
                if (isNaN(number)) {
                    throw compiler.createError(error, 'Number expected, found "' + string + '".');
                }
            },

            validateString: function(s, valid) {
                valid || (valid = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_');
                for (var i = 0; i < s.length; i++) {
                    if (valid.indexOf(s[i]) === -1) {
                        return false;
                    }
                }
                return true;
            },

            parseDataArray: function(value, compiler, callback) {
                var values = this.checkWrapChars(compiler, value.trim(), '[', ']').split(',');
                var data   = [];

                values.forEach(
                    function(v) {
                        data.push(callback.call(this, v.trim()));
                    },
                    this
                );

                return data;
            },

            parseNumberArray: function(value, compiler) {
                return this.parseDataArray(
                    value,
                    compiler,
                    function(v) {
                        var value = parseFloat(v);
                        this.checkNumber(compiler, value, v.trim(), wheel.compiler.error.TYPE_ERROR_NUMBER_EXPECTED);
                        return value;
                    }
                );
            },

            parseStringArray: function(value, compiler, compilerData) {
                return this.parseDataArray(
                    value,
                    compiler,
                    function(v) {
                        return compilerData.declareString(this.checkWrapChars(compiler, v, '"', '"'));
                    }
                );
            },

            splitParams: function(compiler, params) {
                var result = [];
                var param  = '';
                var i      = 0;

                var findEndChar = function(endChar) {
                        while (i < params.length) {
                            var c = params[i++];
                            param += c;
                            if (c === endChar) {
                                break;
                            }
                        }
                    };

                var expectParam = false;
                while (i < params.length) {
                    var c = params[i];
                    switch (c) {
                        case ',':
                            param = param.trim();
                            (param !== '') && result.push(param);
                            expectParam = true;
                            param       = '';
                            break;

                        case '[':
                            findEndChar(']');
                            break;

                        case '"':
                            i++;
                            param += '"';
                            findEndChar('"');
                            break;

                        default:
                            param += c;
                            break;
                    }
                    i++;
                }
                param = param.trim();
                if (param === '') {
                    if (expectParam) {
                        throw compiler.createError(wheel.compiler.error.SYNTAX_ERROR_PARAM_EXPECTED, 'Syntax error parameter expected.');
                    }
                } else {
                    result.push(param);
                }

                return result;
            }
        }
    );
})();