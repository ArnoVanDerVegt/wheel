(function() {
    var wheel = require('../utils/base.js').wheel;
    var $;

    wheel(
        'compiler.Compiler',
        wheel.Class(function() {
            this.init = function(opts) {
                $ = wheel.compiler.command;

                this._data           = new wheel.compiler.CompilerData({compiler: this});
                this._meta           = new wheel.compiler.CompilerMeta({compiler: this, compilerData: this._data});
                this._output         = new wheel.compiler.CompilerOutput({compiler: this});
                this._directive      = new wheel.compiler.CompilerDirective({compiler: this});
                this._mainIndex      = -1;
                this._filename       = '';
                this._includes       = null;
                this._procStartIndex = -1;
                this._activeRecord   = null;

                var compilerOpts = {
                        compiler:     this,
                        compilerData: this._data
                    };
                var conrecordors = [
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
                        'Addr',
                        'JmpC'
                    ];
                var compilers = {};

                for (var i = 0; i < conrecordors.length; i++) {
                    compilers[conrecordors[i]] = new wheel.compiler.commands[conrecordors[i]](compilerOpts); // Needs namespace!
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

            this.createError = function(errorNumber, message, location) {
                location || (location = this._location || {});

                var error    = new Error('#' + errorNumber + ' ' + message);
                var includes = this._includes;
                var filename = location.filename;
                var line     = '';

                for (var i = 0; i < includes.length; i++) {
                    var include = includes[i];
                    if (include.filename === filename) {
                        line = include.lines[location.lineNumber];
                        break;
                    }
                }

                error.location = {
                    filename:   location.filename,
                    lineNumber: location.lineNumber,
                    line:       line
                };
                return error;
            };

            this.createCommand = function(command, params) {
                var args = wheel.compiler.command[command].args;
                var code = wheel.compiler.command[command].code;

                for (var i = 0; i < params.length; i++) {
                    var param = params[i];

                    for (var j = 0; j < args.length; j++) {
                        var matchType = false;

                        // Check the primitive types...
                        if (param.type === args[j].type) {
                            //if (argsMetaType) {
                            //    if (param.metaType === argsMetaType) {
                            //        matchType = true;
                            //    } else if (param.vr && (param.vr.metaType === argsMetaType)) {
                            //        matchType = true;
                            //    }
                            //} else {
                                matchType = true;
                            //}
                        // Check the var types...
                        //} else if (param.vr && param.vr.field && (param.vr.field.type === args[j].type)) {
                        //    matchType = true;
                        }

                        if (matchType) {
                            args = ('args' in args[j]) ? args[j].args : args[j];
                            break;
                        }
                    }
                    //if (!found) {
                    //    throw this.createError(wheel.compiler.error.TYPE_MISMATCH, 'Type mismatch "' + param.param + '".');
                    //}
                }
                return {
                    code:   code,
                    params: params,
                    location: {
                        filename:   this._location.filename,
                        lineNumber: this._location.lineNumber
                    }
                };
            };

            this.validateCommand = function(command, params) {
                if (!(command in wheel.compiler.command)) {
                    return false;
                }

                for (var i = 0; i < params.length; i++) {
                    params[i] = this._data.paramInfo(params[i]);
                }
                return this.createCommand(command, params);
            };

            this.compileLine = function(line, location) {
                var compilerByCommand = this._compilerByCommand;
                var compilerData      = this._data;
                var output            = this._output;

                if (line.trim().indexOf('#directive') === 0) {
                    this._directive.compile(line);
                } else {
                    line = this._meta.compileParams(line);

                    if ((line.indexOf('proc ') === -1) && (line.indexOf('(') !== -1)) {
                        var spacePos = line.indexOf(' ');
                        var command  = line.substr(0, spacePos).trim();
                        if (['set', 'add', 'sub', 'mul', 'div', 'mod', 'cmp'].indexOf(command) === -1) {
                            this._compilers.Call.compile(line);
                        } else {
                            this._compilers.CallFunction.compile(line);
                        }
                    } else if (this._compilers.Label.hasLabel(line)) {
                        compilerData.findLabel(line.substr(0, line.length - 1)).index = output.getLength() - 1;
                    } else {
                        var commandAndParams = this.getCommandAndParams(line);
                        var splitParams      = wheel.compiler.helpers.compilerHelper.splitParams(this, commandAndParams.params);
                        var validatedCommand = this.validateCommand(commandAndParams.command, splitParams);
                        validatedCommand && (validatedCommand.command = commandAndParams.command);
                        switch (commandAndParams.command) {
                            case 'endp':
                                if (this._activeRecord !== null) {
                                    throw this.createError(wheel.compiler.error.INVALID_BLOCK_CLOSE, 'Invalid command "endp".');
                                }
                                this._compilers.Ret.compile(this.getOutput(), null);

                                output.getBuffer()[this._procStartIndex].localCount = compilerData.getLocalOffset();
                                this._procStartIndex = -1;
                                compilerData.resetLocal();
                                compilerData.removeLocalRecords();
                                break;

                            case 'record':
                                this._activeRecord = compilerData.declareRecord(commandAndParams.params, commandAndParams.command, location);
                                break;

                            case 'endr':
                                this._activeRecord = null;
                                break;

                            default:
                                if (commandAndParams.command in compilerByCommand) {
                                    compilerByCommand[commandAndParams.command].compile(this.getOutput(), validatedCommand, splitParams, commandAndParams.params);
                                } else if (validatedCommand === false) {
                                    var record = compilerData.findRecord(commandAndParams.command);
                                    if (record === null) {
                                        throw this.createError(wheel.compiler.error.UNKNOWN_COMMAND, 'Unknown command "' + commandAndParams.command + '".');
                                    } else if (this._activeRecord !== null) {
                                        for (var j = 0; j < splitParams.length; j++) {
                                            compilerData.declareRecordField(splitParams[j], $.T_STRUCT_G, $.T_STRUCT_G_ARRAY, record.size, record);
                                        }
                                    } else {
                                        var inProc = this.getInProc();
                                        var index  = inProc ? 'L' : 'G' ;
                                        var method = inProc ? 'declareLocal' : 'declareGlobal';

                                        for (var j = 0; j < splitParams.length; j++) {
                                            compilerData[method](splitParams[j], $['T_STRUCT_' + index], $['T_STRUCT_' + index + '_ARRAY'], record);
                                        }
                                    }
                                } else {
                                    this.getOutput().add(validatedCommand);
                                }
                                break;
                        }
                    }
                }
            };

            this.compileLines = function(lines) {
                var sourceMap = lines.sourceMap;
                var output    = this._output;

                this._procStartIndex = -1;
                this._activeRecord   = null;
                for (var i = 0; i < lines.output.length; i++) {
                    var line = this._meta.compile(lines.output, lines.output[i].trim(), i);
                    //(line === '') || console.log(i, line);
                    this._location = sourceMap[i];
                    if (line !== '') {
                        this.compileLine(line);
                    }
                }
                return output.getBuffer();
            };

            this.compile = function(includes) {
                var compilerData = this._data;
                var output       = this._output;

                compilerData.reset();
                output.reset();
                this._mainIndex = -1;
                this._includes  = includes;

                var scriptCompiler = new wheel.compiler.script.ScriptCompiler({});
                var i              = includes.length;
                while (i) {
                    i--;
                    var filename = includes[i].filename;
                    var lines    = scriptCompiler.compile(filename, includes[i].lines);
                    this._filename = filename;

                    this._compilers.Label.compile(lines);
                    this.compileLines(lines);
                    this._compilers.Label.updateLabels();
                }

                if (this._mainIndex === -1) {
                    throw this.createError(wheel.compiler.error.NO_MAIN_PROCEDURE, 'No main procedure found.');
                }

                output.optimizeTypes();
                output.setGlobalOffset(compilerData.getGlobalOffset());
                output.setMainIndex(this._mainIndex);
                output.getLines();

                return output;
            };

            this.getDirective = function() {
                return this._directive;
            };

            this.getOutput = function() {
                return this._output;
            };

            this.getCompilerData = function() {
                return this._data;
            };

            this.setProcStartIndex = function(procStartIndex) {
                this._procStartIndex = procStartIndex;
            };

            this.getActiveRecord = function() {
                return this._activeRecord;
            };

            this.setMainIndex = function(mainIndex) {
                this._mainIndex = mainIndex;
            };

            this.getInProc = function() {
                return (this._procStartIndex !== -1);
            };

            this.getCommandAndParams = function(line) {
                var command = line;
                var params  = '';
                var i       = line.indexOf(' ');

                if (i !== -1) {
                    command = line.substr(0, i),
                    params  = line.substr(i - line.length + 1).trim();
                }
                return {
                    command: command,
                    params:  params
                };
            };
        })
    );
})();