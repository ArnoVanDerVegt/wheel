/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const assert               = require('assert');
const dispatcher           = require('../js/frontend/lib/dispatcher').dispatcher;
const PreProcessor         = require('../js/frontend/compiler/preprocessor/PreProcessor').PreProcessor;
const compiler             = require('../js/frontend/compiler/Compiler');
const Text                 = require('../js/frontend/program/output/Text').Text;
const VM                   = require('../js/frontend/vm/VM').VM;
const LocalStandardModule  = require('../js/frontend/vm/modules/local/StandardModule' ).StandardModule;
const LocalScreenModule    = require('../js/frontend/vm/modules/local/ScreenModule'   ).ScreenModule;
const LocalMotorModule     = require('../js/frontend/vm/modules/local/MotorModule'    ).MotorModule;
const LocalSensorModule    = require('../js/frontend/vm/modules/local/SensorModule'   ).SensorModule;
const LocalMathModule      = require('../js/frontend/vm/modules/local/MathModule'     ).MathModule;
const LocalLightModule     = require('../js/frontend/vm/modules/local/LightModule'    ).LightModule;
const LocalButtonModule    = require('../js/frontend/vm/modules/local/ButtonModule'   ).ButtonModule;
const LocalSoundModule     = require('../js/frontend/vm/modules/local/SoundModule'    ).SoundModule;
const LocalFileModule      = require('../js/frontend/vm/modules/local/FileModule'     ).FileModule;
const LocalSystemModule    = require('../js/frontend/vm/modules/local/SystemModule'   ).SystemModule;
const LocalStringModule    = require('../js/frontend/vm/modules/local/StringModule'   ).StringModule;
const LocalBitModule       = require('../js/frontend/vm/modules/local/BitModule'      ).BitModule;
const MockFileSystem       = require('./compiler/modules/MockFileSystem').MockFileSystem;

const createModules = function(vm) {
        let mockFileSystem = new MockFileSystem();
        let handle = mockFileSystem.open('test.rtf');
        mockFileSystem
           .writeNumber(handle, 45)
           .writeNumber(handle, 99)
           .writeString(handle, 'Hello world')
           .writeNumber(handle, 15)
           .close(handle);

        let modules = [];
        modules[ 0] = new LocalStandardModule({vm: vm});
        modules[ 1] = new LocalMathModule    ({vm: vm});
        modules[ 2] = new LocalScreenModule  ({vm: vm});
        modules[ 3] = new LocalLightModule   ({vm: vm});
        modules[ 4] = new LocalButtonModule  ({vm: vm});
        modules[ 5] = new LocalSoundModule   ({vm: vm});
        modules[ 6] = new LocalMotorModule   ({vm: vm});
        modules[ 7] = new LocalSensorModule  ({vm: vm});
        modules[ 8] = new LocalFileModule    ({vm: vm, fileSystem: mockFileSystem});
        modules[ 9] = new LocalSystemModule  ({vm: vm});
        modules[10] = new LocalStringModule  ({vm: vm});
        modules[11] = new LocalBitModule     ({vm: vm});
        return modules;
    };

exports.createModules = createModules;

exports.testCodeAndMemory = function(it, message, source, code, memory) {
    it(
        message,
        function() {
            let preProcessor = new PreProcessor({});
            let program      = new compiler.Compiler({preProcessor: preProcessor}).build(source.join('\n')).getProgram();
            let text         = new Text(program, true).getOutput();
            if (code === true) {
                console.log(text);
            } else {
                code.push('');
                assert.equal(text, code.join('\n'));
            }
        }
    );
    if (memory === false) {
        return;
    }
    it(
        message + ' - memory',
        function() {
            dispatcher.reset();
            let preProcessor = new PreProcessor({});
            let program      = new compiler.Compiler({preProcessor: preProcessor}).build(source.join('\n')).getProgram();
            let vm           = new VM({
                    entryPoint: program.getEntryPoint(),
                    globalSize: program.getGlobalSize(),
                    constants:  program.getConstants(),
                    stringList: program.getStringList()
                });
            vm.setModules(createModules(vm));
            vm.setCommands(program.getCommands()).run();
            let data = vm.getVMData().getData();
            for (let i = 0; i < data.length; i++) {
                if (!data[i]) {
                    data[i] = 0;
                }
            }
            if (memory === true) {
                console.log(data);
            } else {
                assert.deepEqual(data, memory);
            }
        }
    );
};

exports.testLogs = function(it, message, source, logs, callback) {
    it(
        message,
        function() {
            dispatcher.reset();
            let preProcessor = new PreProcessor({});
            let program      = new compiler.Compiler({preProcessor: preProcessor}).build(source.join('\n')).getProgram();
            let vm           = new VM({
                    entryPoint: program.getEntryPoint(),
                    globalSize: program.getGlobalSize(),
                    constants:  program.getConstants(),
                    stringList: program.getStringList()
                });
            let logsReceived = [];
            let modules      = createModules(vm);
            modules[0].on('Console.Log', this, function(opts) {
                logsReceived.push(opts.message);
            });
            vm.setModules(modules);
            vm.setCommands(program.getCommands()).run();
            assert.deepEqual(logsReceived, logs);
            callback && callback(vm);
        }
    );
};

exports.testError = function(it, message, source, err) {
    it(message, function() {
        assert.throws(
            function() {
                dispatcher.reset();
                let getFileData = function(filename, token, callback) {
                        if (filename === '<main>') {
                            callback(source.join('\n'));
                            return;
                        }
                        const errors = require('../js/frontend/compiler/errors');
                        const err    = require('../js/frontend/compiler/errors').errors;
                        throw errors.createError(err.FILE_NOT_FOUND, token, 'File not found: "' + filename + '".');
                    };
                let preProcessor = new PreProcessor({getFileData: getFileData});
                let preProcessed = function() {
                        let tokens  = preProcessor.getDefinedConcatTokens();
                        new compiler.Compiler({preProcessor: preProcessor}).buildTokens(tokens).getProgram();
                    };
                preProcessor.processFile({filename: '<main>', token: null}, 0, preProcessed);
            },
            function(error) {
                return (error.toString() === err);
            }
        );
    });
};

exports.testModuleCall = function(it, message, source, module, event, params) {
    it(
        message,
        function() {
            dispatcher.reset();
            let called       = false;
            let preProcessor = new PreProcessor({});
            let program      = new compiler.Compiler({preProcessor: preProcessor}).build(source.join('\n')).getProgram();
            let vm           = new VM({
                    entryPoint: program.getEntryPoint(),
                    globalSize: program.getGlobalSize(),
                    constants:  program.getConstants(),
                    stringList: program.getStringList()
                });
            let modules = createModules(vm);
            modules[module].on(event, this, function(message) {
                called = true;
                for (let p in params) {
                    assert.equal(message[p], params[p]);
                }
            });
            vm.setModules(modules);
            vm.setCommands(program.getCommands()).run();
            assert.equal(called, true);
        }
    );
};

exports.testCompile = function(source, linter) {
    dispatcher.reset();
    let preProcessor = new PreProcessor({linter: linter});
    let cc           = new compiler.Compiler({preProcessor: preProcessor, linter: linter});
    let program      = cc.build(source.join('\n')).getProgram();
    let vm           = new VM({
            entryPoint: program.getEntryPoint(),
            globalSize: program.getGlobalSize(),
            constants:  program.getConstants(),
            stringList: program.getStringList()
        });
    let modules = createModules(vm);
    vm.setModules(modules);
    vm.getVMData().setHeap(program.getHeap());
    return {
        vm:       vm,
        modules:  modules,
        commands: program.getCommands(),
        program:  program,
        compiler: cc
    };
};

exports.testPreProcessor = function(source, callback) {
    dispatcher.reset();
    let getFileData = function(filename, token, callback) {
            if (filename === '<main>') {
                callback(source.join('\n'));
                return;
            }
            const errors = require('../js/frontend/compiler/errors');
            const err    = require('../js/frontend/compiler/errors').errors;
            throw errors.createError(err.FILE_NOT_FOUND, token, 'File not found: "' + filename + '".');
        };
    let preProcessor = new PreProcessor({getFileData: getFileData});
    let preProcessed = function() {
            callback(preProcessor);
        };
    preProcessor.processFile({filename: '<main>', token: null}, 0, preProcessed);
};

exports.testRangeCheckError = function(it, message, source) {
    it(
        message,
        function() {
            let info   = exports.testCompile(source);
            let called = false;
            dispatcher.reset();
            dispatcher.on(
                'VM.Error.Range',
                this,
                function() {
                    called = true;
                }
            );
            info.vm.setCommands(info.commands).run();
            assert.equal(called, true);
        }
    );
};
