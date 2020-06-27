/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const assert                           = require('assert');
const dispatcher                       = require('../js/frontend/lib/dispatcher').dispatcher;
const PreProcessor                     = require('../js/frontend/compiler/preprocessor/PreProcessor').PreProcessor;
const compiler                         = require('../js/frontend/compiler/Compiler');
const Text                             = require('../js/frontend/program/output/Text').Text;
const VM                               = require('../js/frontend/vm/VM').VM;
const LocalStandardModule              = require('../js/frontend/vm/modules/local/StandardModule' ).StandardModule;
const LocalScreenModule                = require('../js/frontend/vm/modules/local/ScreenModule'   ).ScreenModule;
const LocalMotorModule                 = require('../js/frontend/vm/modules/local/MotorModule'    ).MotorModule;
const LocalSensorModule                = require('../js/frontend/vm/modules/local/SensorModule'   ).SensorModule;
const LocalMathModule                  = require('../js/frontend/vm/modules/local/MathModule'     ).MathModule;
const LocalLightModule                 = require('../js/frontend/vm/modules/local/LightModule'    ).LightModule;
const LocalButtonModule                = require('../js/frontend/vm/modules/local/ButtonModule'   ).ButtonModule;
const LocalSoundModule                 = require('../js/frontend/vm/modules/local/SoundModule'    ).SoundModule;
const LocalFileModule                  = require('../js/frontend/vm/modules/local/FileModule'     ).FileModule;
const LocalSystemModule                = require('../js/frontend/vm/modules/local/SystemModule'   ).SystemModule;
const LocalStringModule                = require('../js/frontend/vm/modules/local/StringModule'   ).StringModule;
const LocalBitModule                   = require('../js/frontend/vm/modules/local/BitModule'                             ).BitModule;
const LocalComponentFormModule         = require('../js/frontend/vm/modules/local/components/ComponentFormModule'        ).ComponentFormModule;
const LocalComponentButtonModule       = require('../js/frontend/vm/modules/local/components/ComponentButtonModule'      ).ComponentButtonModule;
const LocalComponentSelectButtonModule = require('../js/frontend/vm/modules/local/components/ComponentSelectButtonModule').ComponentSelectButtonModule;
const LocalComponentLabelModule        = require('../js/frontend/vm/modules/local/components/ComponentLabelModule'       ).ComponentLabelModule;
const LocalComponentCheckboxModule     = require('../js/frontend/vm/modules/local/components/ComponentCheckboxModule'    ).ComponentCheckboxModule;
const LocalComponentStatusLightModule  = require('../js/frontend/vm/modules/local/components/ComponentStatusLightModule' ).ComponentStatusLightModule;
const LocalComponentPanelModule        = require('../js/frontend/vm/modules/local/components/ComponentPanelModule'       ).ComponentPanelModule;
const LocalComponentTabsModule         = require('../js/frontend/vm/modules/local/components/ComponentTabsModule'        ).ComponentTabsModule;
const MockFileSystem                   = require('./mock/MockFileSystem').MockFileSystem;
const MockDataProvider                 = require('./mock/MockDataProvider').MockDataProvider;
const MockIDE                          = require('./mock/MockIDE').MockIDE;
const fs                               = require('fs');

const createModules = function(vm) {
        let modules          = [];
        let mockIDE          = new MockIDE();
        let mockDataProvider = new MockDataProvider();
        let mockFileSystem   = new MockFileSystem();
        let handle           = mockFileSystem.open('test.rtf');
        mockFileSystem
           .writeNumber(handle, 45)
           .writeNumber(handle, 99)
           .writeString(handle, 'Hello world')
           .writeNumber(handle, 15)
           .close(handle);
        modules[ 0] = new LocalStandardModule             ({vm: vm});
        modules[ 1] = new LocalMathModule                 ({vm: vm});
        modules[ 2] = new LocalScreenModule               ({vm: vm});
        modules[ 3] = new LocalLightModule                ({vm: vm});
        modules[ 4] = new LocalButtonModule               ({vm: vm});
        modules[ 5] = new LocalSoundModule                ({vm: vm});
        modules[ 6] = new LocalMotorModule                ({vm: vm});
        modules[ 7] = new LocalSensorModule               ({vm: vm});
        modules[ 8] = new LocalFileModule                 ({vm: vm, fileSystem: mockFileSystem});
        modules[ 9] = new LocalSystemModule               ({vm: vm});
        modules[10] = new LocalStringModule               ({vm: vm});
        modules[11] = new LocalBitModule                  ({vm: vm});
        modules[64] = new LocalComponentFormModule        ({vm: vm, ide: mockIDE, getDataProvider: function() { return mockDataProvider; }});
        modules[65] = new LocalComponentButtonModule      ({vm: vm, ide: mockIDE, getDataProvider: function() { return mockDataProvider; }});
        modules[66] = new LocalComponentSelectButtonModule({vm: vm, ide: mockIDE, getDataProvider: function() { return mockDataProvider; }});
        modules[67] = new LocalComponentLabelModule       ({vm: vm, ide: mockIDE, getDataProvider: function() { return mockDataProvider; }});
        modules[68] = new LocalComponentCheckboxModule    ({vm: vm, ide: mockIDE, getDataProvider: function() { return mockDataProvider; }});
        modules[69] = new LocalComponentStatusLightModule ({vm: vm, ide: mockIDE, getDataProvider: function() { return mockDataProvider; }});
        modules[70] = new LocalComponentPanelModule       ({vm: vm, ide: mockIDE, getDataProvider: function() { return mockDataProvider; }});
        modules[71] = new LocalComponentTabsModule        ({vm: vm, ide: mockIDE, getDataProvider: function() { return mockDataProvider; }});
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
                preProcessor.processFile({filename: '<main>', token: null}, 0, 0, preProcessed);
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
    preProcessor.processFile({filename: '<main>', token: null}, 0, 0, preProcessed);
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

exports.testComponentCall = function(it, message, moduleFile, procName, property, type) {
    it(
        message,
        function(done) {
            let win         = ~~(Math.random() * 100000);
            let component   = ~~(Math.random() * 100000);
            let value       = ~~(Math.random() * 100000);
            if (type === 'rgb') {
                value = {
                    red: ~~(Math.random() * 256),
                    grn: ~~(Math.random() * 256),
                    blu: ~~(Math.random() * 256),
                };
            }
            let getFileData = function(filename, token, callback) {
                    setTimeout(
                        function() {
                            if (filename === 'lib.whl') {
                                callback(fs.readFileSync(moduleFile).toString());
                            } else {
                                switch (type) {
                                    case 'number':
                                        callback([
                                            '#include "lib.whl"',
                                            'proc main()',
                                            '   ' + procName + '(' + win + ',' + component + ',' + value + ')',
                                            'end'
                                        ].join('\n'));
                                        break;
                                    case 'string':
                                        callback([
                                            '#include "lib.whl"',
                                            'proc main()',
                                            '   ' + procName + '(' + win + ',' + component + ',"' + value + '")',
                                            'end'
                                        ].join('\n'));
                                        break;
                                    case 'rgb':
                                        callback([
                                            '#include "lib.whl"',
                                            'proc main()',
                                            '   ' + procName + '(' + win + ',' + component + ',' + value.red + ',' + value.grn + ',' + value.blu + ')',
                                            'end'
                                        ].join('\n'));
                                        break;
                                }
                            }
                        },
                        1
                    );
                };
            let preProcessor = new PreProcessor({getFileData: getFileData});
            let preProcessed = function() {
                    dispatcher.reset();
                    let tokens  = preProcessor.getDefinedConcatTokens();
                    let program = new compiler.Compiler({preProcessor: preProcessor}).buildTokens(tokens).getProgram();
                    let vm      = new VM({
                            entryPoint: program.getEntryPoint(),
                            globalSize: program.getGlobalSize(),
                            constants:  program.getConstants(),
                            stringList: program.getStringList()
                        });
                    vm.setModules(createModules(vm));
                    // Start listening to the dispatcher:
                    let result = null;
                    dispatcher.on(
                        win + '_' + component,
                        this,
                        function(data) {
                            // if (type === 'string') {
                            //     data[property] = vm.getVMData().getStringList()[data[property]];
                            // }
                            result = data;
                        }
                    );
                    vm.setCommands(program.getCommands()).run();
                    // Check if the dispatcher received the message...
                    if (type === 'rgb') {
                        assert.deepEqual(result, value);
                    } else {
                        let opts = {};
                        opts[property] = value;
                        assert.deepEqual(result, opts);
                    }
                    done();
                };
            preProcessor.processFile({filename: 'main.whl', token: null}, 0, 0, preProcessed);
        }
    );
};
