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
            },

            updateConditionalLines: function(lines, index, conditionTrue) {
                    var commandFromLine = function(line) {
                            var i = line.indexOf(' ');
                            return (i === -1) ? line : line.substr(0, i);
                        };
                    var updateLines = function(endCommand, clear) {
                            var clearLine = function(index) {
                                    lines[index] = '';
                                };

                            var count    = 1;
                            var done     = false;
                            var commands = ['%if_size_1', '%if_global', '%if_record', '%if_pointer'];
                            while (!done && (index < lines.length)) {
                                var command = commandFromLine(lines[index].trim());
                                if (commands.indexOf(command) === -1) {
                                    if (command === endCommand) {
                                        count--;
                                        done = !count;
                                        done && clearLine(index);
                                    }
                                } else {
                                    count++;
                                }
                                if (!done) {
                                    clear && clearLine(index);
                                    index++;
                                }
                            }
                        };

                updateLines('%else', !conditionTrue);
                updateLines('%end',  conditionTrue);
            }
        }
    );
})();