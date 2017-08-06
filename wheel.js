require('./js/WheelClass.js');

require('./js/compiler/helpers/compilerHelper.js');
require('./js/compiler/helpers/expressionHelper.js');
require('./js/compiler/helpers/compilerMetaHelper.js');
require('./js/compiler/helpers/scriptHelper.js');

require('./js/compiler/preprocessor/ReplaceTree.js');
require('./js/compiler/preprocessor/FileProcessor.js');
require('./js/compiler/preprocessor/PreProcessor.js');

require('./js/compiler/command.js');
require('./js/compiler/commands/BasicCommand.js');
require('./js/compiler/commands/Declaration.js');
require('./js/compiler/commands/StringDeclaration.js');
require('./js/compiler/commands/NumberDeclaration.js');
require('./js/compiler/commands/NumberChange.js');
require('./js/compiler/commands/NumberInc.js');
require('./js/compiler/commands/NumberDec.js');
require('./js/compiler/commands/NumberOperator.js');
require('./js/compiler/commands/ProcedureDeclaration.js');
require('./js/compiler/commands/Set.js');
require('./js/compiler/commands/Call.js');
require('./js/compiler/commands/CallFunction.js');
require('./js/compiler/commands/CallReturn.js');
require('./js/compiler/commands/Ret.js');
require('./js/compiler/commands/Label.js');
require('./js/compiler/commands/Addr.js');
require('./js/compiler/commands/JmpC.js');

require('./js/compiler/error.js');

require('./js/compiler/CompilerOutput.js');
require('./js/compiler/CompilerList.js');
require('./js/compiler/CompilerRecord.js');
require('./js/compiler/CompilerData.js');
require('./js/compiler/CompilerMeta.js');

require('./js/compiler/script/NumericExpressionCompiler.js');
require('./js/compiler/script/boolean/BooleanNode.js');
require('./js/compiler/script/boolean/BooleanOrNode.js');
require('./js/compiler/script/boolean/BooleanAndNode.js');
require('./js/compiler/script/boolean/BooleanOrValueNode.js');
require('./js/compiler/script/boolean/BooleanAndValueNode.js');
require('./js/compiler/script/boolean/BooleanRootNode.js');
require('./js/compiler/script/BooleanExpressionCompiler.js');

require('./js/compiler/script/statements/Statement.js');
require('./js/compiler/script/statements/ScriptAsm.js');
require('./js/compiler/script/statements/ScriptRecord.js');
require('./js/compiler/script/statements/ScriptProc.js');
require('./js/compiler/script/statements/ScriptIf.js');
require('./js/compiler/script/statements/ScriptElse.js');
require('./js/compiler/script/statements/ScriptSelect.js');
require('./js/compiler/script/statements/ScriptCase.js');
require('./js/compiler/script/statements/ScriptFor.js');
require('./js/compiler/script/statements/ScriptWhile.js');
require('./js/compiler/script/statements/ScriptRepeat.js');
require('./js/compiler/script/statements/ScriptBreak.js');
require('./js/compiler/script/statements/ScriptEnd.js');

require('./js/compiler/script/ScriptCompiler.js');

require('./js/compiler/optimizer/BasicOptimizer.js');
require('./js/compiler/optimizer/OptimizeSet.js');
require('./js/compiler/optimizer/OptimizeAdd.js');
require('./js/compiler/optimizer/OptimizeMul.js');

require('./js/compiler/CompilerOptimizer.js');
require('./js/compiler/CompilerDirective.js');
require('./js/compiler/Compiler.js');

var fs    = require('fs');
var path  = require('path');
var wheel = require('./js/utils/base.js').wheel;
var files = {
        _list: [0],
        _files: {},
        exists: function(p, filename) {
            var f     = filename;
            var found = false;

            // Try to find the file in one of the paths...
            p.forEach(function(p) {
                if (!found) {
                    f = path.join(p, filename);
                    if (fs.existsSync(f)) {
                        found = true;
                    }
                }
            });

            if (!found) {
                return false;
            }

            // Check if the file was already found...
            if (f in this._files) {
                return this._files[f];
            }

            var result = this._list.length;
            this._files[f] = result;
            this._list.push(f);

            return result;
        },
        getFile: function(index) {
            if (index in this._list) {
                var data = fs.readFileSync(this._list[index]).toString();
                return {
                    getData: function(callback) {
                        callback && callback(data);
                        return data;
                    },
                    getMeta: function() {
                        return {};
                    }
                };
            }
            return null;
        }
    };

function loadConfig(argv) {
    var config;
    var startConfig;

    var defaultConfig = {
            path: [],
            directives: {
                ret:      'on',
                call:     'on',
                optimize: 'on'
            },
            log: false
        };

    var update = function(src, dest) {
            if (typeof src == 'object') {
                for (var i in src) {
                    var value = src[i];
                    if (!(i in dest)) {
                        if (typeof value === 'object') {
                            if (!('forEach' in value)) {
                                dest[i] = {};
                                update(value, {});
                            }
                        } else {
                            dest[i] = value;
                        }
                    }
                }
            }
        };

    try {
        var data = fs.readFileSync('wheel.json').toString();
        startConfig = JSON.parse(data);
        config      = JSON.parse(data);
    } catch (error) {
        config = {
            path: []
        };
    }

    update(defaultConfig, config);

    // Apply the config options...
    for (var i = 3; i < argv.length; i++) {
        switch (argv[i]) {
            case '--log':
                config.log = true;
                break;

        }
    }
    // Check if the config has to be shown...
    for (var i = 3; i < argv.length; i++) {
        switch (argv[i]) {
            case '--startconfig':
                console.log('Wheel start configuration, loaded from wheel.json:');
                console.log(JSON.stringify(startConfig, null, '    '));
                break;

            case '--config':
                console.log('Wheel configuration:');
                console.log(JSON.stringify(config, null, '    '));
                break;
        }
    }

    return config;
}

function logOutputCommands(outputCommands) {
    function leadingChar(s, c, length) {
        s += '';
        while (s.length < length) {
            s = c + s;
        }
        return s;
    }

    var items = outputCommands.outputCommands().split('\r');
    var lines = outputCommands.getLines();

    var i = 0;
    while (i < items.length) {
        var line = items[i++];
        if (line === '#COMMANDS') {
            var offset = 0;
            while (i + 1 < items.length) {
                var ret = ((items[i] === '4') && (items[i + 1] === '1') && (items[i + 2] === '3'));

                line = leadingChar(items[i++] || '', '0', 2) + ' ';
                for (var j = 0; j < 4; j++) {
                    line += leadingChar(items[i++] || '', ' ', 3) + ' ';
                }
                console.log(line + '    |    ' + lines[offset++]);

                if (ret) {
                    console.log('----------------------+---------------------------------------------');
                }
            }
        }
    }
}

function compile(filename, config) {
    var compiler = new wheel.compiler.Compiler({config: config});

    try {
        preProcessor.process(
            filename,
            function(includes) {
                var outputCommands;
                try {
                    outputCommands = compiler.compile(includes);
                } catch (error) {
                    outputCommands = null;
                    console.error(error.toString());
                    if (error.location) {
                        var location = error.location;
                        console.log(location.filename + ':' + location.lineNumber);
                        console.log(location.line);
                    }
                }

                if (outputCommands) {
                    var outputFilename = path.basename(filename, '.whl');
                    if (config.log) {
                        console.log('Input: ',  filename);
                        console.log('Output:', outputFilename + '.rtf');
                        logOutputCommands(outputCommands);
                    }
                    fs.writeFileSync(outputFilename + '.rtf', outputCommands.outputCommands());
                }
            }
        );
    } catch (error) {
        console.error(error.toString());
    }
}

if (process.argv.length < 3) {
    console.log('usage: ./wheel filename.whl');
} else {
    var argv     = process.argv;
    var filename = argv[1];

    if (fs.existsSync(filename)) {
        var config       = loadConfig(argv);
        var preProcessor = new wheel.compiler.preprocessor.PreProcessor({
                basePath: path.dirname(filename),
                config:   config,
                files:    files
            });

        compile(process.argv[2], config);
    } else {
        console.error('File not found.');
    }
}

