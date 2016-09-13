(function() {
    var wheel = require('../utils/base.js').wheel;

    wheel(
        'compiler.CompilerOutput',
        wheel.Class(function() {
            this.init = function(opts) {
                this._buffer       = [];
                this._mainIndex    = 0;
                this._globalOffset = 0;
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

            this.a = function(code, params) {
                this.add({code: code, params: params});
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
                                //result = '[[000' + wheel.compiler.command.REG_STACK + ']+' + leadingZero(param.value) + ']';
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
        })
    );
})();