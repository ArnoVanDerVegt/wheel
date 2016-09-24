(function() {
    var wheel = require('../utils/base.js').wheel;
    var $;

    wheel(
        'compiler.Compiler',
        wheel.Class(function() {
            this.init = function(opts) {
                $ = wheel.compiler.command;

                this._compilerData   = new wheel.compiler.CompilerData({compiler: this});
                this._output         = new wheel.compiler.CompilerOutput({compiler: this});
                this._mainIndex      = -1;
                this._filename       = '';
                this._lineNumber     = 0;
                this._includes       = null;
                this._procStartIndex = -1;
                this._activeStruct   = null;

                var compilerOpts = {
                        compiler:     this,
                        compilerData: this._compilerData
                    };
                var constructors = [
                        'NumberDeclaration',
                        'NumberInc',
                        'NumberDec',
                        'NumberOperator',
                        'StringDeclaration',
                        'ProcedureDeclaration',
                        'Set',
                        'Call',
                        'CallFunction',
                        'CallReturn',
                        'Ret',
                        'Label',
                        'ArrayR',
                        'ArrayW',
                        'Addr',
                        'JmpC'
                    ];
                var compilers = {};

                for (var i = 0; i < constructors.length; i++) {
                    compilers[constructors[i]] = new wheel.compiler.commands[constructors[i]](compilerOpts); // Needs namespace!
                }
                this._compilers = compilers;

                compilers.CallFunction.setCallCompiler(compilers.Call);
                compilers.CallFunction.setSetCompiler(compilers.Set);
                compilers.CallFunction.setNumberOperatorCompiler(compilers.NumberOperator);

                compilers.CallReturn.setSetCompiler(compilers.Set);
                compilers.CallReturn.setRetCompiler(compilers.Ret);

                this._compilerByCommand = {
                    je:         compilers.JmpC,
                    jne:        compilers.JmpC,
                    jl:         compilers.JmpC,
                    jle:        compilers.JmpC,
                    jg:         compilers.JmpC,
                    jge:        compilers.JmpC,
                    set:        compilers.Set,
                    addr:       compilers.Addr,
                    arrayr:     compilers.ArrayR,
                    arrayw:     compilers.ArrayW,
                    number:     compilers.NumberDeclaration,
                    inc:        compilers.NumberInc,
                    dec:        compilers.NumberDec,
                    add:        compilers.NumberOperator,
                    sub:        compilers.NumberOperator,
                    mul:        compilers.NumberOperator,
                    div:        compilers.NumberOperator,
                    and:        compilers.NumberOperator,
                    or:         compilers.NumberOperator,
                    xor:        compilers.NumberOperator,
                    cmp:        compilers.NumberOperator,
                    mod:        compilers.NumberOperator,
                    string:     compilers.StringDeclaration,
                    proc:       compilers.ProcedureDeclaration,
                    ret:        compilers.Ret,
                    'return':   compilers.CallReturn
                };
            };

            this.createError = function(message) {
                var error = new Error(message);
                error.location = {
                    filename:   this._filename,
                    lineNumber: this._lineNumber
                };
                return error;
            };

            this.createCommand = function(command, params) {
                var args = wheel.compiler.command[command].args;
                var code = wheel.compiler.command[command].code;

                if (params.length) {
                    for (var i = 0; i < params.length; i++) {
                        var param = params[i];
                        var found = false;

                        for (var j = 0; j < args.length; j++) {
                            var argsType     = args[j].type;
                            var argsMetaType = args[j].metaType || false;
                            var matchType    = false;

                            // Check the primitive types...
                            if (param.type === args[j].type) {
                                if (argsMetaType) {
                                    if (param.metaType === argsMetaType) {
                                        matchType = true;
                                    } else if (param.vr && (param.vr.metaType === argsMetaType)) {
                                        matchType = true;
                                    }
                                } else {
                                    matchType = true;
                                }
                            // Check the var types...
                            } else if (param.vr && param.vr.field && (param.vr.field.type === args[j].type)) {
                                matchType = true;
                            }

                            if (matchType) {
                                args  = ('args' in args[j]) ? args[j].args : args[j];
                                found = true;
                                break;
                            }
                        }
                        if (!found) {
                            throw this.createError('Type mismatch "' + param.param + '".');
                        }
                    }
                    return {
                        code:   code,
                        params: params,
                        location: {
                            filename:   this._filename,
                            lineNumber: this._lineNumber
                        }
                    };
                }
            };

            this.validateCommand = function(command, params) {
                if (!(command in wheel.compiler.command)) {
                    return false;
                }

                for (var i = 0; i < params.length; i++) {
                    params[i] = this._compilerData.paramInfo(params[i]);
                }
                return this.createCommand(command, params);
            };

            this.compileLine = function(line, location) {
                var compilerByCommand = this._compilerByCommand;
                var compilerData      = this._compilerData;
                var output            = this._output;
                var command;

                if ((line.indexOf('proc ') === -1) && (line.indexOf('(') !== -1)) {
                    var spacePos = line.indexOf(' ');
                    command = line.substr(0, spacePos).trim();
                    if (['set', 'add', 'sub', 'mul', 'div', 'mod', 'and', 'or', 'cmp'].indexOf(command) === -1) {
                        this._compilers.Call.compile(line);
                    } else {
                        this._compilers.CallFunction.compile(line);
                    }
                } else if (this._compilers.Label.hasLabel(line)) {
                    compilerData.findLabel(line.substr(0, line.length - 1)).index = output.getLength() - 1;
                } else {
                    var spacePos = line.indexOf(' ');
                    if (spacePos === -1) {
                        command = line;
                        params  = '';
                    } else {
                        command = line.substr(0, spacePos),
                        params  = line.substr(spacePos - line.length + 1).trim();
                    }
                    var splitParams      = wheel.compiler.compilerHelper.splitParams(params);
                    var validatedCommand = this.validateCommand(command, splitParams);
                    validatedCommand && (validatedCommand.command = command);
                    switch (command) {
                        case 'endp':
                            if (this._activeStruct !== null) {
                                throw this.createError('Invalid command "endp".');
                            }
                            this._compilers.Ret.compile(null);

                            output.getBuffer()[this._procStartIndex].localCount = compilerData.getLocalOffset();
                            this._procStartIndex = -1;
                            compilerData.resetLocal();
                            compilerData.removeLocalStructs();
                            break;

                        case 'struct':
                            this._activeStruct = compilerData.declareStruct(params, command, location);
                            break;

                        case 'ends':
                            this._activeStruct = null;
                            break;

                        default:
                            if (command in compilerByCommand) {
                                compilerByCommand[command].compile(validatedCommand, splitParams, params, location);
                            } else if (validatedCommand === false) {
                                var struct = compilerData.findStruct(command);
                                if (struct === null) {
                                    throw this.createError('Unknown command "' + command + '".');
                                } else if (this._activeStruct !== null) {
                                    for (var j = 0; j < splitParams.length; j++) {
                                        compilerData.declareStructField(splitParams[j], $.T_STRUCT_G, $.T_STRUCT_G_ARRAY, struct.size, struct);
                                    }
                                } else if (this.getInProc()) {
                                    for (var j = 0; j < splitParams.length; j++) {
                                        compilerData.declareLocal(splitParams[j], $.T_STRUCT_L, $.T_STRUCT_L_ARRAY, struct);
                                    }
                                } else {
                                    for (var j = 0; j < splitParams.length; j++) {
                                        compilerData.declareGlobal(splitParams[j], $.T_STRUCT_G, $.T_STRUCT_G_ARRAY, struct, location);
                                    }
                                }
                            } else {
                                this.getOutput().add(validatedCommand);
                            }
                            break;
                    }
                }
            };

            this.compileTypeof = function(line) {
                var i = line.indexOf('@typeof(');
                if (i === -1) {
                    return line;
                }
                var j            = line.indexOf(')');
                var vr           = line.substr(i + 8, j - 8 - i).trim();
                var compilerData = this._compilerData;

                var local = compilerData.findLocal(vr);
                if (local === null) {
                    var global = compilerData.findLocal(vr);
                    if (global === null) {
                        // throw error...
                    } else if (global.type === $.T_NUM_G_ARRAY) {
                        line = 'number ' + line.substr(j + 1 - line.length).trim();
                    } else if (global.struct) {
                        line = global.struct.name + ' ' + line.substr(j + 1 - line.length).trim();
                    }
                } else if (local.type === $.T_NUM_L_ARRAY) {
                    line = 'number ' + line.substr(j + 1 - line.length).trim();
                } else if (local.struct) {
                    line = local.struct.name + ' ' + line.substr(j + 1 - line.length).trim();
                }

                return line;
            };

            this.compileLines = function(lines) {
                var output   = this._output;
                var location = {
                        filename:   this._filename,
                        lineNumber: 0
                    };

                this._procStartIndex = -1;
                this._activeStruct   = null;
                for (var i = 0; i < lines.length; i++) {
                    var line = lines[i].trim();
                    if (line === '') {
                        continue;
                    }

                    this._lineNumber    = i;
                    location.lineNumber = i;

                    this.compileLine(this.compileTypeof(line), location);
                }

                return output.getBuffer();
            };

            this.compile = function(includes) {
                var compilerData = this._compilerData;
                var output       = this._output;

                compilerData.reset();
                output.reset();
                this._mainIndex = -1;
                this._includes  = includes;

                var scriptCompiler = new wheel.compiler.script.ScriptCompiler({});
                var i              = includes.length;
                while (i) {
                    i--;
                    this._filename = includes[i].filename;
                    var lines = scriptCompiler.compile(includes[i].lines);

                    this._compilers.Label.compile(lines);
                    this.compileLines(lines);
                    this._compilers.Label.updateLabels();
                }

                if (this._mainIndex === -1) {
                    throw this.createError('No main procedure found.');
                }

                output.optimizeTypes();
                output.setGlobalOffset(compilerData.getGlobalOffset());
                output.setMainIndex(this._mainIndex);
                output.getLines();

                return output;
            };

            this.getIncludes = function() {
                return this._includes;
            };

            this.getOutput = function() {
                return this._output;
            };

            this.getCompilerData = function() {
                return this._compilerData;
            };

            this.getProcStartIndex = function() {
                return this._procStartIndex;
            };

            this.setProcStartIndex = function(procStartIndex) {
                this._procStartIndex = procStartIndex;
            };

            this.getActiveStruct = function() {
                return this._activeStruct;
            };

            this.setMainIndex = function(mainIndex) {
                this._mainIndex = mainIndex;
            };

            this.getInProc = function() {
                return (this._procStartIndex !== -1);
            };
        })
    );
})();