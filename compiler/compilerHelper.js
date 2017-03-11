(function() {
    var wheel = require('../utils/base.js').wheel;

    wheel(
        'compiler.compilerHelper',
        {
            getWrappedInChars: function(s, open, close) {
                return (s.length > 2) && (s[0] === open) && (s.substr(-1) === close);
            },

            checkWrapChars: function(s, open, close) {
                if (s.length && (s[0] === open) && (s[s.length - 1] !== close)) {
                    throw compiler.createError('Syntax error.');
                }
                return s.substr(1, s.length - 2);
            },

            checkDuplicateIdentifier: function(compiler, name, list) {
                if (name in list) {
                    throw compiler.createError('Duplicate int identifier "' + name + '".');
                }
            },

            checkInvalidConstant: function(compiler, vr, allowConstant) {
                if ((vr.value !== null) && !allowConstant) {
                    throw compiler.createError('Invalid constant value "' + vr.value + '".');
                }
            },

            validateString: function(s, valid) {
                if (!valid) {
                    valid = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_';
                }
                for (var i = 0; i < s.length; i++) {
                    if (valid.indexOf(s[i]) === -1) {
                        return false;
                    }
                }
                return true;
            },

            parseNumberArray: function(value, compiler) {
                var value  = this.checkWrapChars(value.trim(), '[', ']');
                var values = value.split(',');
                var data   = [];
                for (var j = 0; j < values.length; j++) {
                    var v = parseFloat(values[j].trim());
                    if (isNaN(v)) {
                        throw compiler.createError('Number expected, found "' + values[j] + '".');
                    }
                    data.push(v);
                }
                return data;
            },

            parseStringArray: function(value, compiler, compilerData) {
                var value  = this.checkWrapChars(value.trim(), '[', ']');
                var values = value.split(',');
                var data   = [];
                for (var j = 0; j < values.length; j++) {
                    data.push(compilerData.declareString(this.checkWrapChars(values[j].trim(), '"', '"')));
                }
                return data;
            },

            splitParams: function(params) {
                var result     = [],
                    param     = '',
                    j         = 0;

                while (j < params.length) {
                    var c = params[j];
                    switch (c) {
                        case ',':
                            param = param.trim();
                            (param !== '') && result.push(param);
                            param = '';
                            break;

                        case '[':
                            while (j < params.length) {
                                var c = params[j++];
                                param += c;
                                if (c === ']') {
                                    break;
                                }
                            }
                            break;

                        case '"':
                            j++;
                            param += '"';
                            while (j < params.length) {
                                var c = params[j++];
                                param += c;
                                if (c === '"') {
                                    break;
                                }
                            }
                            break;

                        default:
                            param += c;
                            break;
                    }
                    j++;
                }
                param = param.trim();
                (param !== '') && result.push(param);

                return result;
            }
        }
    );
})();