require('./js/compiler/PreProcessor.js');
require('./js/compiler/commands/CommandCompiler.js');
require('./js/compiler/commands/Declaration.js');
require('./js/compiler/commands/NumberDeclaration.js');
require('./js/compiler/commands/NumberChange.js');
require('./js/compiler/commands/NumberInc.js');
require('./js/compiler/commands/NumberDec.js');
require('./js/compiler/commands/NumberOperator.js');
require('./js/compiler/commands/StringDeclaration.js');
require('./js/compiler/commands/ProcedureDeclaration.js');
require('./js/compiler/commands/Set.js');
require('./js/compiler/commands/Call.js');
require('./js/compiler/commands/CallFunction.js');
require('./js/compiler/commands/CallReturn.js');
require('./js/compiler/commands/Ret.js');
require('./js/compiler/commands/Label.js');
require('./js/compiler/commands/Addr.js');
require('./js/compiler/commands/JmpC.js');
require('./js/compiler/command.js');
require('./js/compiler/error.js');
require('./js/compiler/helpers/compilerHelper.js');
require('./js/compiler/helpers/compilerMetaHelper.js');
require('./js/compiler/CompilerOutput.js');
require('./js/compiler/CompilerList.js');
require('./js/compiler/CompilerRecord.js');
require('./js/compiler/CompilerData.js');
require('./js/compiler/CompilerMeta.js');
require('./js/compiler/script/ExpressionCompiler.js');
require('./js/compiler/script/ScriptCompiler.js');
require('./js/compiler/Compiler.js');

var fs       = require('fs');
var path     = require('path');
var wheel    = require('./js/utils/base.js').wheel;

var compiler = new wheel.compiler.Compiler({});
var files    = {
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

function loadConfig() {
    var config;

    try {
        var data = fs.readFileSync('wheel.json').toString();
        config = JSON.parse(data);
    } catch (error) {
        config = {
            path: []
        };
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

                line = (items[i++] || '') + ' ';
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

function compile(filename) {
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
                    logOutputCommands(outputCommands);
                    var outputFilename = path.basename(filename, '.whl');
                    fs.writeFileSync(outputFilename + '.rtf', outputCommands.outputCommands());
                }
            }
        );
    } catch (error) {
        console.error(error.toString());
    }
}

if (process.argv.length === 3) {
    var config       = loadConfig();
    var preProcessor = new wheel.compiler.PreProcessor({
            basePath: path.dirname(process.argv[1] || './'),
            config:   config,
            files:    files
        });

    compile(process.argv[2]);
}

