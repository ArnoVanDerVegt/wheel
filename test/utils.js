/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const assert                               = require('assert');
const dispatcher                           = require('../js/frontend/lib/dispatcher').dispatcher;
const PreProcessor                         = require('../js/frontend/compiler/preprocessor/PreProcessor').PreProcessor;
const compiler                             = require('../js/frontend/compiler/Compiler');
const Text                                 = require('../js/frontend/program/output/Text').Text;
const VM                                   = require('../js/frontend/vm/VM').VM;
// Modules...
const standardModuleConstants              = require('../js/shared/vm/modules/standardModuleConstants');
const mathModuleConstants                  = require('../js/shared/vm/modules/mathModuleConstants');
const screenModuleConstants                = require('../js/shared/vm/modules/screenModuleConstants');
const lightModuleConstants                 = require('../js/shared/vm/modules/lightModuleConstants');
const buttonModuleConstants                = require('../js/shared/vm/modules/buttonModuleConstants');
const soundModuleConstants                 = require('../js/shared/vm/modules/soundModuleConstants');
const motorModuleConstants                 = require('../js/shared/vm/modules/motorModuleConstants');
const sensorModuleConstants                = require('../js/shared/vm/modules/sensorModuleConstants');
const fileModuleConstants                  = require('../js/shared/vm/modules/fileModuleConstants');
const systemModuleConstants                = require('../js/shared/vm/modules/systemModuleConstants');
const stringModuleConstants                = require('../js/shared/vm/modules/stringModuleConstants');
const bitModuleConstants                   = require('../js/shared/vm/modules/bitModuleConstants');
const deviceModuleConstants                = require('../js/shared/vm/modules/deviceModuleConstants');
const poweredUpModuleConstants             = require('../js/shared/vm/modules/poweredUpModuleConstants');
// Form component...
const componentFormModuleConstants         = require('../js/shared/vm/modules/components/componentFormModuleConstants');
// Input components...
const componentButtonModuleConstants       = require('../js/shared/vm/modules/components/componentButtonModuleConstants');
const componentSelectButtonModuleConstants = require('../js/shared/vm/modules/components/componentSelectButtonModuleConstants');
const componentCheckboxModuleConstants     = require('../js/shared/vm/modules/components/componentCheckboxModuleConstants');
const componentRadioModuleConstants        = require('../js/shared/vm/modules/components/componentRadioModuleConstants');
const componentDropdownModuleConstants     = require('../js/shared/vm/modules/components/componentDropdownModuleConstants');
const componentTextInputModuleConstants    = require('../js/shared/vm/modules/components/componentTextInputModuleConstants');
const componentSliderModuleConstants       = require('../js/shared/vm/modules/components/componentSliderModuleConstants');
// Text components...
const componentLabelModuleConstants        = require('../js/shared/vm/modules/components/componentLabelModuleConstants');
const componentTitleModuleConstants        = require('../js/shared/vm/modules/components/componentTitleModuleConstants');
const componentTextModuleConstants         = require('../js/shared/vm/modules/components/componentTextModuleConstants');
const componentListItemsModuleConstants    = require('../js/shared/vm/modules/components/componentListItemsModuleConstants');
// Panel components...
const componentPanelModuleConstants        = require('../js/shared/vm/modules/components/componentPanelModuleConstants');
const componentTabsModuleConstants         = require('../js/shared/vm/modules/components/componentTabsModuleConstants');
// Graphics components...
const componentRectangleModuleConstants    = require('../js/shared/vm/modules/components/componentRectangleModuleConstants');
const componentCircleModuleConstants       = require('../js/shared/vm/modules/components/componentCircleModuleConstants');
const componentImageModuleConstants        = require('../js/shared/vm/modules/components/componentImageModuleConstants');
// Status components...
const componentStatusLightModuleConstants  = require('../js/shared/vm/modules/components/componentStatusLightModuleConstants');
const componentProgressBarModuleConstants  = require('../js/shared/vm/modules/components/componentProgressBarModuleConstants');
const componentLoadingDotsModuleConstants  = require('../js/shared/vm/modules/components/componentLoadingDotsModuleConstants');
// IO Display components...
const componentPUDeviceModuleConstants     = require('../js/shared/vm/modules/components/componentPUDeviceModuleConstants');
const componentEV3MotorModuleConstants     = require('../js/shared/vm/modules/components/componentEV3MotorModuleConstants');
const componentEV3SensorModuleConstants    = require('../js/shared/vm/modules/components/componentEV3SensorModuleConstants');
// Modules...
const LocalStandardModule                  = require('../js/frontend/vm/modules/local/StandardModule'                        ).StandardModule;
const LocalScreenModule                    = require('../js/frontend/vm/modules/local/ScreenModule'                          ).ScreenModule;
const LocalMotorModule                     = require('../js/frontend/vm/modules/local/MotorModule'                           ).MotorModule;
const LocalSensorModule                    = require('../js/frontend/vm/modules/local/SensorModule'                          ).SensorModule;
const LocalMathModule                      = require('../js/frontend/vm/modules/local/MathModule'                            ).MathModule;
const LocalLightModule                     = require('../js/frontend/vm/modules/local/LightModule'                           ).LightModule;
const LocalButtonModule                    = require('../js/frontend/vm/modules/local/ButtonModule'                          ).ButtonModule;
const LocalSoundModule                     = require('../js/frontend/vm/modules/local/SoundModule'                           ).SoundModule;
const LocalFileModule                      = require('../js/frontend/vm/modules/local/FileModule'                            ).FileModule;
const LocalSystemModule                    = require('../js/frontend/vm/modules/local/SystemModule'                          ).SystemModule;
const LocalStringModule                    = require('../js/frontend/vm/modules/local/StringModule'                          ).StringModule;
const LocalBitModule                       = require('../js/frontend/vm/modules/local/BitModule'                             ).BitModule;
// Form component...
const LocalComponentFormModule             = require('../js/frontend/vm/modules/local/components/ComponentFormModule'        ).ComponentFormModule;
// Input components...
const LocalComponentButtonModule           = require('../js/frontend/vm/modules/local/components/ComponentButtonModule'      ).ComponentButtonModule;
const LocalComponentSelectButtonModule     = require('../js/frontend/vm/modules/local/components/ComponentSelectButtonModule').ComponentSelectButtonModule;
const LocalComponentCheckboxModule         = require('../js/frontend/vm/modules/local/components/ComponentCheckboxModule'    ).ComponentCheckboxModule;
const LocalComponentRadioModule            = require('../js/frontend/vm/modules/local/components/ComponentRadioModule'       ).ComponentRadioModule;
const LocalComponentDropdownModule         = require('../js/frontend/vm/modules/local/components/ComponentDropdownModule'    ).ComponentDropdownModule;
const LocalComponentTextInputModule        = require('../js/frontend/vm/modules/local/components/ComponentTextInputModule'   ).ComponentTextInputModule;
const LocalComponentSliderModule           = require('../js/frontend/vm/modules/local/components/ComponentSliderModule'      ).ComponentSliderModule;
// Text components...
const LocalComponentLabelModule            = require('../js/frontend/vm/modules/local/components/ComponentLabelModule'       ).ComponentLabelModule;
const LocalComponentTitleModule            = require('../js/frontend/vm/modules/local/components/ComponentTitleModule'       ).ComponentTitleModule;
const LocalComponentTextModule             = require('../js/frontend/vm/modules/local/components/ComponentTextModule'        ).ComponentTextModule;
const LocalComponentListItemsModule        = require('../js/frontend/vm/modules/local/components/ComponentListItemsModule'   ).ComponentListItemsModule;
// Panel components...
const LocalComponentPanelModule            = require('../js/frontend/vm/modules/local/components/ComponentPanelModule'       ).ComponentPanelModule;
const LocalComponentTabsModule             = require('../js/frontend/vm/modules/local/components/ComponentTabsModule'        ).ComponentTabsModule;
// Graphics components...
const LocalComponentRectangleModule        = require('../js/frontend/vm/modules/local/components/ComponentRectangleModule'   ).ComponentRectangleModule;
const LocalComponentCircleModule           = require('../js/frontend/vm/modules/local/components/ComponentCircleModule'      ).ComponentCircleModule;
const LocalComponentImageModule            = require('../js/frontend/vm/modules/local/components/ComponentImageModule'       ).ComponentImageModule;
// Status components...
const LocalComponentStatusLightModule      = require('../js/frontend/vm/modules/local/components/ComponentStatusLightModule' ).ComponentStatusLightModule;
const LocalComponentProgressBarModule      = require('../js/frontend/vm/modules/local/components/ComponentProgressBarModule' ).ComponentProgressBarModule;
const LocalComponentLoadingDotsModule      = require('../js/frontend/vm/modules/local/components/ComponentLoadingDotsModule' ).ComponentLoadingDotsModule;
// IO Display components...
const LocalComponentPUDeviceModule         = require('../js/frontend/vm/modules/local/components/ComponentPUDeviceModule'    ).ComponentPUDeviceModule;
const LocalComponentEV3MotorModule         = require('../js/frontend/vm/modules/local/components/ComponentEV3MotorModule'    ).ComponentEV3MotorModule;
const LocalComponentEV3SensorModule        = require('../js/frontend/vm/modules/local/components/ComponentEV3SensorModule'   ).ComponentEV3SensorModule;
// Mocks...
const MockFileSystem                       = require('./mock/MockFileSystem').MockFileSystem;
const MockDataProvider                     = require('./mock/MockDataProvider').MockDataProvider;
const MockIDE                              = require('./mock/MockIDE').MockIDE;
const fs                                   = require('fs');

const createMocks = () => {
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
        return {
            mockIDE:          mockIDE,
            mockDataProvider: mockDataProvider,
            mockFileSystem:   mockFileSystem
        };
    };

const createModules = (vm, mocks) => {
        const mockIDE        = mocks.mockIDE;
        const mockFileSystem = mocks.mockFileSystem;
        const getDataProvider = function() { return mocks.mockDataProvider; };
        let modules = [];
        modules[standardModuleConstants             .MODULE_STANDARD     ] = new LocalStandardModule              ({vm: vm});
        modules[mathModuleConstants                 .MODULE_MATH         ] = new LocalMathModule                  ({vm: vm});
        modules[screenModuleConstants               .MODULE_SCREEN       ] = new LocalScreenModule                ({vm: vm});
        modules[lightModuleConstants                .MODULE_LIGHT        ] = new LocalLightModule                 ({vm: vm});
        modules[buttonModuleConstants               .MODULE_BUTTON       ] = new LocalButtonModule                ({vm: vm});
        modules[soundModuleConstants                .MODULE_SOUND        ] = new LocalSoundModule                 ({vm: vm});
        modules[motorModuleConstants                .MODULE_MOTOR        ] = new LocalMotorModule                 ({vm: vm});
        modules[sensorModuleConstants               .MODULE_SENSOR       ] = new LocalSensorModule                ({vm: vm});
        modules[fileModuleConstants                 .MODULE_FILE         ] = new LocalFileModule                  ({vm: vm, fileSystem: mockFileSystem});
        modules[systemModuleConstants               .MODULE_SYSTEM       ] = new LocalSystemModule                ({vm: vm});
        modules[stringModuleConstants               .MODULE_STRING       ] = new LocalStringModule                ({vm: vm});
        modules[bitModuleConstants                  .MODULE_BIT          ] = new LocalBitModule                   ({vm: vm});
        // Components....
        modules[componentFormModuleConstants.MODULE_FORM                 ] = new LocalComponentFormModule         ({vm: vm, ide: mockIDE, getDataProvider: getDataProvider});
        // Input components...
        modules[componentButtonModuleConstants      .MODULE_BUTTON       ] = new LocalComponentButtonModule       ({vm: vm, ide: mockIDE, getDataProvider: getDataProvider});
        modules[componentSelectButtonModuleConstants.MODULE_SELECT_BUTTON] = new LocalComponentSelectButtonModule ({vm: vm, ide: mockIDE, getDataProvider: getDataProvider});
        modules[componentCheckboxModuleConstants    .MODULE_CHECKBOX     ] = new LocalComponentCheckboxModule     ({vm: vm, ide: mockIDE, getDataProvider: getDataProvider});
        modules[componentRadioModuleConstants       .MODULE_RADIO        ] = new LocalComponentRadioModule        ({vm: vm, ide: mockIDE, getDataProvider: getDataProvider});
        modules[componentDropdownModuleConstants    .MODULE_DROPDOWN     ] = new LocalComponentDropdownModule     ({vm: vm, ide: mockIDE, getDataProvider: getDataProvider});
        modules[componentTextInputModuleConstants   .MODULE_TEXT_INPUT   ] = new LocalComponentTextInputModule    ({vm: vm, ide: mockIDE, getDataProvider: getDataProvider});
        modules[componentSliderModuleConstants      .MODULE_SLIDER       ] = new LocalComponentSliderModule       ({vm: vm, ide: mockIDE, getDataProvider: getDataProvider});
        // Text components...
        modules[componentLabelModuleConstants       .MODULE_LABEL        ] = new LocalComponentLabelModule        ({vm: vm, ide: mockIDE, getDataProvider: getDataProvider});
        modules[componentTitleModuleConstants       .MODULE_TITLE        ] = new LocalComponentTitleModule        ({vm: vm, ide: mockIDE, getDataProvider: getDataProvider});
        modules[componentTextModuleConstants        .MODULE_TEXT         ] = new LocalComponentTextModule         ({vm: vm, ide: mockIDE, getDataProvider: getDataProvider});
        modules[componentListItemsModuleConstants   .MODULE_LIST_ITEMS   ] = new LocalComponentListItemsModule    ({vm: vm, ide: mockIDE, getDataProvider: getDataProvider});
        // Panel components...
        modules[componentPanelModuleConstants       .MODULE_PANEL        ] = new LocalComponentPanelModule        ({vm: vm, ide: mockIDE, getDataProvider: getDataProvider});
        modules[componentTabsModuleConstants        .MODULE_TABS         ] = new LocalComponentTabsModule         ({vm: vm, ide: mockIDE, getDataProvider: getDataProvider});
        // Graphics components...
        modules[componentRectangleModuleConstants   .MODULE_RECTANGLE    ] = new LocalComponentRectangleModule    ({vm: vm, ide: mockIDE, getDataProvider: getDataProvider});
        modules[componentCircleModuleConstants      .MODULE_CIRCLE       ] = new LocalComponentCircleModule       ({vm: vm, ide: mockIDE, getDataProvider: getDataProvider});
        modules[componentImageModuleConstants       .MODULE_IMAGE        ] = new LocalComponentImageModule        ({vm: vm, ide: mockIDE, getDataProvider: getDataProvider});
        // Status components...
        modules[componentStatusLightModuleConstants .MODULE_STATUS_LIGHT ] = new LocalComponentStatusLightModule  ({vm: vm, ide: mockIDE, getDataProvider: getDataProvider});
        modules[componentProgressBarModuleConstants .MODULE_PROGRESS_BAR ] = new LocalComponentProgressBarModule  ({vm: vm, ide: mockIDE, getDataProvider: getDataProvider});
        modules[componentLoadingDotsModuleConstants .MODULE_LOADING_DOTS ] = new LocalComponentLoadingDotsModule  ({vm: vm, ide: mockIDE, getDataProvider: getDataProvider});
        // Simulator components...
        modules[componentPUDeviceModuleConstants    .MODULE_PU_DEVICE    ] = new LocalComponentPUDeviceModule     ({vm: vm, ide: mockIDE, getDataProvider: getDataProvider});
        modules[componentEV3MotorModuleConstants    .MODULE_EV3_MOTOR    ] = new LocalComponentEV3MotorModule     ({vm: vm, ide: mockIDE, getDataProvider: getDataProvider});
        modules[componentEV3SensorModuleConstants   .MODULE_EV3_SENSOR   ] = new LocalComponentEV3SensorModule    ({vm: vm, ide: mockIDE, getDataProvider: getDataProvider});
        return modules;
    };

exports.createMocks   = createMocks;
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
            vm.setModules(createModules(vm, createMocks()));
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
            let modules      = createModules(vm, createMocks());
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
            let modules = createModules(vm, createMocks());
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
    let modules = createModules(vm, createMocks());
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

const getGetFileDataCallback = function(moduleFile, procName, win, component, value, type) {
        return function(filename, token, callback) {
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
                            case 'getNumber':
                                callback([
                                    '#include "lib.whl"',
                                    'proc main()',
                                    '    number n',
                                    '    n = ' + procName + '(' + win + ',' + component + ')',
                                    '    addr n',
                                    '    mod  0, 1',
                                    'end'
                                ].join('\n'));
                                break;
                            case 'getString':
                                callback([
                                    '#include "lib.whl"',
                                    'proc main()',
                                    '    string s',
                                    '    ' + procName + '(' + win + ',' + component + ',s)',
                                    '    addr s',
                                    '    mod  0, 2',
                                    'end'
                                ].join('\n'));
                                break;
                        }
                    }
                },
                1
            );
        };
    };

exports.testComponentCall = function(it, message, moduleFile, procName, property, type) {
    it(
        message,
        function(done) {
            let win         = ~~(Math.random() * 100000);
            let component   = ~~(Math.random() * 100000);
            let value       = ~~(Math.random() * 100000);
            switch (type) {
                case 'rgb':
                    value = {
                        red: ~~(Math.random() * 256),
                        grn: ~~(Math.random() * 256),
                        blu: ~~(Math.random() * 256),
                    };
                    break;
                case 'getString':
                    value += '';
                    break;
            }
            let getFileData  = getGetFileDataCallback(moduleFile, procName, win, component, value, type);
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
                    let mocks   = createMocks();
                    let modules = createModules(vm, mocks);
                    vm.setModules(modules);
                    mocks.mockIDE.setTestValue(value);
                    // Start listening to the dispatcher:
                    let result = null;
                    dispatcher.on(
                        win + '_' + component,
                        this,
                        function(data) {
                            result = data;
                        }
                    );
                    // getNumber and getString tests log their results...
                    let logsReceived = [];
                    modules[0].on('Console.Log', this, function(opts) {
                        logsReceived.push(opts.message);
                    });
                    vm.setCommands(program.getCommands()).run();
                    if (type === 'getNumber') {
                        assert.equal(logsReceived.length,             1);
                        assert.equal(typeof logsReceived[0],          'number');
                        assert.equal(logsReceived[0],                 value);
                        assert.equal(mocks.mockIDE.getWindowHandle(), win);
                        assert.equal(mocks.mockIDE.getComponentId(),  component);
                    } else if (type === 'getString') {
                        assert.equal(logsReceived.length,             1);
                        assert.equal(typeof logsReceived[0],          'string');
                        assert.equal(logsReceived[0],                 value);
                        assert.equal(mocks.mockIDE.getWindowHandle(), win);
                        assert.equal(mocks.mockIDE.getComponentId(),  component);
                    } else {
                        // Check if the dispatcher received the message...
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
