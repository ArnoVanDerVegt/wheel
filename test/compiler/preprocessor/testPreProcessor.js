/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher    = require('../../../js/frontend/lib/dispatcher').dispatcher;
const PreProcessor  = require('../../../js/frontend/compiler/preprocessor/PreProcessor').PreProcessor;
const compiler      = require('../../../js/frontend/compiler/Compiler');
const Text          = require('../../../js/frontend/program/output/Text').Text;
const VM            = require('../../../js/frontend/vm/VM').VM;
const createModules = require('../../utils').createModules;
const assert        = require('assert');

const testDefineNumber = function(defineValue, callback) {
        let getFileData = function(filename, token, callback) {
                callback([
                    '#define TEST ' + defineValue,
                    'proc main()',
                    '    number n',
                    '    n = TEST',
                    '    addr n',
                    '    mod 0, 1',
                    'end'
                ].join('\n'));
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
                dispatcher.on('Console.Log', this, callback);
                vm.setCommands(program.getCommands()).run();
            };
        preProcessor.processFile({filename: 'main.whl', token: null}, 0, 0, preProcessed);
    };

describe(
    'Test PreProcessor',
    function() {
        it(
            'Should define integer',
            function() {
                testDefineNumber(
                    355,
                    function(message) {
                        assert.equal(message, 355);
                    }
                );
            }
        );
        it(
            'Should define float',
            function() {
                testDefineNumber(
                    0.5,
                    function(message) {
                        assert.equal(Math.round(message * 1000), 500);
                    }
                );
            }
        );
        it(
            'Should define string',
            function() {
                let getFileData = function(filename, token, callback) {
                        callback([
                            '#define TEST "Hello world"',
                            'proc main()',
                            '    string s',
                            '    s = TEST',
                            '    addr s',
                            '    mod  0, 2',
                            'end'
                        ].join('\n'));
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
                        dispatcher.on(
                            'Log',
                            this,
                            function(message) {
                                assert.equal(message, 'Hello world');
                            }
                        );
                        assert.equal(preProcessor.getLineCount(), 7);
                        vm.setModules(createModules(vm));
                        vm.setCommands(program.getCommands()).run();
                    };
                preProcessor.processFile({filename: 'main.whl', token: null}, 0, 0, preProcessed);
            }
        );
        it(
            'Should include',
            function() {
                let getFileData = function(filename, token, callback) {
                        setTimeout(
                            function() {
                                switch (filename) {
                                    case 'test.whl':
                                        callback([
                                            '#define TEST 456',
                                            'proc test()',
                                            'end'
                                        ].join('\n'));
                                        break;
                                    case 'main.whl':
                                        callback([
                                            '#include "test.whl"',
                                            'proc main()',
                                            '    number n',
                                            '    n = TEST',
                                            '    addr n',
                                            '    mod 0, 1',
                                            'end'
                                        ].join('\n'));
                                        break;
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
                        assert.notEqual(preProcessor.getDefines(), null);
                        assert.notEqual(preProcessor.getTokens(),  null);
                        dispatcher.on(
                            'Log',
                            this,
                            function(message) {
                                assert.equal(message, 456);
                            }
                        );
                        vm.setModules(createModules(vm));
                        vm.setCommands(program.getCommands()).run();
                    };
                preProcessor.processFile({filename: 'main.whl', token: null}, 0, 0, preProcessed);
            }
        );
        it(
            'Should include, strip comments',
            function() {
                let getFileData = function(filename, token, callback) {
                        setTimeout(
                            function() {
                                switch (filename) {
                                    case 'test.whl':
                                        callback([
                                            '#define TEST 456 ; Comment after meta',
                                            'proc test() ; Comment after proc',
                                            ';Comment on empty line',
                                            'end ; Comment after keyword'
                                        ].join('\n'));
                                        break;
                                    case 'main.whl':
                                        callback([
                                            '#include "test.whl"',
                                            '; Comment line',
                                            'proc main()',
                                            '    number n ; Comment after number',
                                            '    n = TEST',
                                            '    addr n',
                                            ';',
                                            '    mod 0, 1;',
                                            'end'
                                        ].join('\n'));
                                        break;
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
                        assert.notEqual(preProcessor.getDefines(), null);
                        assert.notEqual(preProcessor.getTokens(),  null);
                        dispatcher.on(
                            'Log',
                            this,
                            function(message) {
                                assert.equal(message, 456);
                            }
                        );
                        vm.setModules(createModules(vm));
                        vm.setCommands(program.getCommands()).run();
                    };
                preProcessor.processFile({filename: 'main.whl', token: null}, 0, 0, preProcessed);
            }
        );
        it(
            'Should include',
            function(done) {
                let getFileData = function(filename, token, callback) {
                        setTimeout(
                            function() {
                                switch (filename) {
                                    case 'test1.whl':
                                        callback([
                                            '#define TEST1 456',
                                            'proc test1()',
                                            'end'
                                        ].join('\n'));
                                        break;
                                    case 'test2.whl':
                                        callback([
                                            '#include "test1.whl"',
                                            '#define TEST2 789',
                                            'proc test2()',
                                            'end'
                                        ].join('\n'));
                                        break;
                                    case 'main.whl':
                                        callback([
                                            '#include "test1.whl"',
                                            '#include "test2.whl"',
                                            'proc main()',
                                            '    number n',
                                            '    n = TEST1',
                                            '    addr n',
                                            '    mod 0, 1',
                                            '    n = TEST2',
                                            '    addr n',
                                            '    mod 0, 1',
                                            'end'
                                        ].join('\n'));
                                        break;
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
                        assert.notEqual(preProcessor.getDefines(), null);
                        assert.notEqual(preProcessor.getTokens(),  null);
                        let sortedFiles = preProcessor.getSortedFiles();
                        let files       = [];
                        sortedFiles.forEach(function(sortedFile) {
                            files.push(sortedFile.filename);
                        });
                        assert.deepEqual(files, ['/test1.whl', '/test2.whl', '/main.whl']);
                        let logs    = [];
                        let modules = createModules(vm);
                        vm.setModules(modules);
                        modules[0].on(
                            'Console.Log',
                            this,
                            function(opts) {
                                logs.push(opts.message);
                            }
                        );
                        vm.setCommands(program.getCommands()).run();
                        console.log('logs:', logs);
                        assert.deepEqual(logs, [456, 789]);
                        done();
                    };
                preProcessor.processFile({filename: 'main.whl', token: null}, 0, 0, preProcessed);
            }
        );
        it(
            'Should create image',
            function(done) {
                let getFileData = function(filename, token, callback) {
                        callback([
                            '#image "image.rgf"',
                            '#data "010101"',
                            '#data "101010"',
                            '#data "010101"',
                            'proc main()',
                            'end'
                        ].join('\n'));
                    };
                let setImage = function(image) {
                        assert.deepEqual(
                            image,
                            {
                                filename: 'image.rgf',
                                data: [
                                    [0, 1, 0, 1, 0, 1],
                                    [1, 0, 1, 0, 1, 0],
                                    [0, 1, 0, 1, 0, 1]
                                ]
                            }
                        );
                    };
                let preProcessor = new PreProcessor({getFileData: getFileData, setImage: setImage});
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
                        vm.setCommands(program.getCommands()).run();
                        done();
                    };
                preProcessor.processFile({filename: 'main.whl', token: null}, 0, 0, preProcessed);
            }
        );
    }
);
