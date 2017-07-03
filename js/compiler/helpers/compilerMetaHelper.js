(function() {
    var wheel = require('../../utils/base.js').wheel;

    wheel(
        'compiler.helpers.compilerMetaHelper',
        {
            cleanIdentifier: function(identifier) {
                var s = '';
                var i = 0;

                while (i < identifier.length) {
                    var c = identifier[i++];
                    switch (c) {
                        case '[':
                            var open = 1;
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
            },

            findMetaParam: function(line, param) {
                param = param + '(';
                var i = line.indexOf(param);
                if (i === -1) {
                    return false;
                }

                var j = line.indexOf(')', i);
                var k = param.length;

                return line.substr(i + k, j - i - k);
            },

            replaceMetaParam: function(line, param, value) {
                param = param + '(';
                var i = line.indexOf(param);
                var j = line.indexOf(')', i);

                return line.substr(0, i) + value + line.substr(j, j - line.length);
            }
        }
    );
})();