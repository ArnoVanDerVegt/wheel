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

            parseNumberArray: function(value, compiler) {
                var value  = this.checkWrapChars(compiler, value.trim(), '[', ']');
                var values = value.split(',');
                var data   = [];
                for (var j = 0; j < values.length; j++) {
                    var v = parseFloat(values[j].trim());
                    this.checkNumber(compiler, v, values[j], wheel.compiler.error.TYPE_ERROR_NUMBER_EXPECTED);
                    //if (isNaN(v)) {
                    //    throw compiler.createError(wheel.compiler.error.TYPE_ERROR_NUMBER_EXPECTED, 'Number expected, found "' + values[j] + '".');
                    //}
                    data.push(v);
                }
                return data;
            },

            parseStringArray: function(value, compiler, compilerData) {
                var value  = this.checkWrapChars(compiler, value.trim(), '[', ']');
                var values = value.split(',');
                var data   = [];
                for (var j = 0; j < values.length; j++) {
                    data.push(compilerData.declareString(this.checkWrapChars(compiler, values[j].trim(), '"', '"')));
                }
                return data;
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