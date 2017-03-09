(function() {
    var wheel = require('../utils/base.js').wheel;

    wheel(
        'compiler.CompilerOutput',
        wheel.Class(function() {
            this.init = function(opts) {
                this._buffer       = [];
                this._mainIndex    = 0;
                this._globalOffset = 0;
                this._stringList   = [];
            };

            this.add = function(outputCommand) {
                if (!outputCommand.params) {
                    outputCommand.params = [];
                }
                while (outputCommand.params.length < 2) {
                    outputCommand.params.push({type: '', value: 0});
                }
                this._buffer.push(outputCommand);
            };

            this.a = function(code, params, p2) {
                (p2 === undefined) ?
                    this.add({code: code, params: params}) :
                    this.add({code: code, params: [params, p2]});
            };

            this.reset = function() {
                this._buffer.length = 0;
                this._mainIndex     = 0;
            };

            this.getBuffer = function() {
                return this._buffer;
            };

            this.getLength = function() {
                return this._buffer.length;
            };

            this.getMainIndex = function() {
                return this._mainIndex;
            };

            this.setMainIndex = function(mainIndex) {
                this._mainIndex = mainIndex;
            };

            this.getStringList = function(stringList) {
                return this._stringList;
            };

            this.setStringList = function(stringList) {
                this._stringList = stringList;
            };

            this.getGlobalOffset = function() {
                return this._globalOffset;
            };

            this.setGlobalOffset = function(globalOffset) {
                this._globalOffset = globalOffset;
            };

            this.getLines = function() {
                var singleParam = [
                        'log',
                        'call',
                        'copy',
                        'loop'
                    ];
                var leadingZero = function(value) {
                        value += '';
                        while (value.length < 4) {
                            value = '0' + value;
                        }
                        return value;
                    };
                var paramToString = function(command, param) {
                        var result = '';
                        switch (param.type) {
                            case wheel.compiler.command.T_NUM_C:
                                result = param.value;
                                break;

                            case wheel.compiler.command.T_NUM_L:
                                result = '[stack+' + leadingZero(param.value) + ']';
                                break;

                            case wheel.compiler.command.T_NUM_G:
                                switch (param.value) {
                                    case wheel.compiler.command.REG_STACK:
                                        result = 'stack';
                                        break;

                                    case wheel.compiler.command.REG_SRC:
                                        result = 'src';
                                        break;

                                    case wheel.compiler.command.REG_DEST:
                                        result = 'dest';
                                        break;

                                    case wheel.compiler.command.REG_CODE:
                                        result = 'code';
                                        break;

                                    case wheel.compiler.command.REG_RETURN:
                                        result = 'return';
                                        break;

                                    case wheel.compiler.command.REG_FLAGS:
                                        result = 'flags';
                                        break;

                                    default:
                                        result = '[' + leadingZero(param.value) + ']';
                                        break;
                                }
                                break;

                            case wheel.compiler.command.T_LABEL:
                                result = leadingZero(param.value + 1);
                                break;

                            default:
                                result = 'Unsup. type ' + param.type + ' ' + command;
                                console.error('Unsupported type:', param.type, 'command:', command);
                                break;
                        }
                        return result;
                    }.bind(this);
                var buffer = this._buffer;

                var cmd = [
                        'copy',
                        'jmpc',
                        'cmp',
                        'module',
                        'set',
                        'add',
                        'sub',
                        'mul',
                        'div',
                        'mod',
                        'and',
                        'or',
                        'xor'
                    ];
                var lines = [];
                for (var i = 0; i < buffer.length; i++) {
                    var command = buffer[i];
                    var line    = leadingZero(i) + '  ' + (cmd[command.code] || command.code);

                    while (line.length < 13) {
                        line += ' ';
                    }

                    if (command.code <= wheel.compiler.command.NO_PARAM_COMMANDS) {
                        // No parameters...
                    } else {
                        line += paramToString(command, command.params[0]);
                        if (command.code <= wheel.compiler.command.SINGLE_PARAM_COMMANDS) {
                            // Single parameter...
                        } else {
                            line += ',';
                            while (line.length < 28) {
                                line += ' ';
                            }
                            line += paramToString(command, command.params[1]);
                        }
                    }
                    lines.push(line);
                }
                return lines;
            };

            this.optimizeTypes = function() {
                var buffer = this._buffer;
                for (var i = 0; i < buffer.length; i++) {
                    var outputCommand = buffer[i];
                    var params        = outputCommand.params;
                    for (var j = 0; j < params.length; j++) {
                        switch (params[j].type) {
                            case wheel.compiler.command.T_PROC:
                                params[j].type = wheel.compiler.command.T_NUM_C;
                                break;

                            case wheel.compiler.command.T_PROC_G:
                                params[j].type = wheel.compiler.command.T_NUM_G;
                                break;

                            case wheel.compiler.command.T_PROC_G_ARRAY:
                                console.error(params);
                                //    params[j].type = wheel.compiler.command.T_NUM_G_ARRAY;
                                break;

                            case wheel.compiler.command.T_PROC_L:
                                params[j].type = wheel.compiler.command.T_NUM_L;
                                break;

                            case wheel.compiler.command.T_PROC_L_ARRAY:
                                console.error(params);
                                //    params[j].type = wheel.compiler.command.T_NUM_L_ARRAY;
                                break;
                        }
                    }
                }
            };

            this.logLines = function() {
                var lines = this.getLines();
                for (var i = 0; i < lines.length; i++) {
                    console.log('            ' + lines[i]);
                }
            };

            this.logCommands = function() {
                var colorReset = "\x1b[0m"
                var colorBright = "\x1b[1m"
                var colorDim = "\x1b[2m"
                var colorUnderscore = "\x1b[4m"
                var colorBlink = "\x1b[5m"
                var colorReverse = "\x1b[7m"
                var colorHidden = "\x1b[8m"

                var colorFgBlack = "\x1b[30m"
                var colorFgRed = "\x1b[31m"
                var colorFgGreen = "\x1b[32m"
                var colorFgYellow = "\x1b[33m"
                var colorFgBlue = "\x1b[34m"
                var colorFgMagenta = "\x1b[35m"
                var colorFgCyan = "\x1b[36m"
                var colorFgWhite = "\x1b[37m"

                var colorBgBlack = "\x1b[40m"
                var colorBgRed = "\x1b[41m"
                var colorBgGreen = "\x1b[42m"
                var colorBgYellow = "\x1b[43m"
                var colorBgBlue = "\x1b[44m"
                var colorBgMagenta = "\x1b[45m"
                var colorBgCyan = "\x1b[46m"
                var colorBgWhite = "\x1b[47m"

                function log(line, color) {
                    color || (color = colorReset);
                    console.log('            ' + line);
                    //console.log('\x1b[36m%s\x1b[0m', 'hhjkh');  //cyan
                    //console.log('\x1b[33m%s\x1b[0m: ', 'jgjgjgh');  //yellow
                    //console.log('\x1b[36m%s' + color, '            ' + line);
                }
                var buffer = this._buffer;

                log('#STRINGS');
                log(this._stringList.length);
                this._stringList.forEach(function(s) { log('"' + s + '"'); });

                log('#HEAP_SIZE');
                log(1024);
                log('#REG_CODE');
                log(this.getMainIndex());
                log('#REG_STACK');
                log(this.getGlobalOffset());
                log('#COMMANDS_SIZE');
                log(buffer.length * 5);

                log('#COMMANDS');
                for (var i = 0; i < buffer.length; i++) {
                    var command = buffer[i];
                    var line    = command.code + ' ' +
                            command.params[0].type + ' ' + command.params[0].value + ' ' +
                            command.params[1].type + ' ' + command.params[1].value;
                    log(line);
                }
            };

            this.outputCommands = function() {
                var buffer     = this._buffer;
                var result     = '';
                var separator  = String.fromCharCode(13);
                var stringList = this._stringList;

                result += '#STRINGS' + separator;

                result += this._stringList.length + separator;
                result += this._stringList.join(separator) + separator;

                result += '#HEAP_SIZE'           + separator;
                result += 1024                   + separator;
                result += '#REG_CODE'            + separator;
                result += this.getMainIndex()    + separator;
                result += '#REG_STACK'           + separator;
                result += this.getGlobalOffset() + separator;
                result += '#COMMANDS_SIZE'       + separator;
                result += (buffer.length * 5)    + separator;
                result += '#COMMANDS'            + separator;

                for (var i = 0; i < buffer.length; i++) {
                    var command = buffer[i];
                    result += command.code + separator;
                    result += command.params[0].type  + separator;
                    result += command.params[0].value + separator;
                    result += command.params[1].type  + separator;
                    result += command.params[1].value + separator;
                }

                return result;
            };
        })
    );
})();