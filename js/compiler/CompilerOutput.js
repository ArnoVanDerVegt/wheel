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

                                    default:
                                        result = '[' + leadingZero(param.value) + ']';
                                        break;
                                }
                                break;

                            case wheel.compiler.command.T_LABEL:
                                result = leadingZero(param.value + 1);
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
                        'mod'
                    ];
                var lines = [];
                for (var i = 0; i < buffer.length; i++) {
                    var command = buffer[i];
                    var line    = leadingZero(i) + '  ' + cmd[command.code];

                    while (line.length < 13) {
                        line += ' ';
                    }

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
                    lines.push(line);
                }
                return lines;
            };

            this.optimizeTypes = function() {
                var buffer       = this._buffer;
                var convertTypes = {};

                convertTypes[wheel.compiler.command.T_PROC]   = wheel.compiler.command.T_NUM_C;
                convertTypes[wheel.compiler.command.T_PROC_G] = wheel.compiler.command.T_NUM_G;
                convertTypes[wheel.compiler.command.T_PROC_L] = wheel.compiler.command.T_NUM_L;

                for (var i = 0; i < buffer.length; i++) {
                    var outputCommand = buffer[i];
                    var params        = outputCommand.params;
                    for (var j = 0; j < params.length; j++) {
                        var type = params[j].type;
                        (type in convertTypes) && (params[j].type = convertTypes[type]);
                    }
                }
            };

            this.outputCommands = function() {
                var buffer     = this._buffer;
                var result     = '';
                var separator  = String.fromCharCode(13);
                var stringList = this._stringList;

                result += '#STRINGS' + separator;

                result += stringList.length + separator;
                result += stringList.join(separator) + separator;

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