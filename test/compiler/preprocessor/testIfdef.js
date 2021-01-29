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
const createMocks   = require('../../utils').createMocks;
const assert        = require('assert');

let preProcessor;

const createOnFinished = (expectedLog) => {
        return () => {
            dispatcher.reset();
            let tokens  = preProcessor.getDefinedConcatTokens();
            let program = new compiler.Compiler({preProcessor: preProcessor}).buildTokens(tokens).getProgram();
            let vm      = new VM({
                    entryPoint: program.getEntryPoint(),
                    globalSize: program.getGlobalSize(),
                    constants:  program.getConstants(),
                    stringList: program.getStringList()
                });
            let modules = createModules(vm, createMocks());
            modules[0].on(
                'Console.Log',
                this,
                function(opts) {
                    assert.equal(opts.message, expectedLog);
                }
            );
            vm
                .setModules(modules)
                .setCommands(program.getCommands()).run();
        };
    };

describe(
    'Test #ifdef',
    () => {
        it(
            'Should compile conditional with #ifdef',
            () => {
                let onGetFileData = function(filename, token, callback) {
                        callback([
                            '#define TEST "Test is defined"',
                            'proc main()',
                            '    number n',
                            '    n = 100',
                            '#ifdef TEST',
                            '    n = 300',
                            '#end',
                            '    addr n',
                            '    mod  0, 1',
                            'end'
                        ].join('\n'));
                    };
                preProcessor = new PreProcessor({onGetFileData: onGetFileData, onFinished: createOnFinished(300)});
                preProcessor.processFile({filename: 'main.whl', token: null});
            }
        );
        it(
            'Should compile conditional with nested #ifdef',
            () => {
                let onGetFileData = function(filename, token, callback) {
                        callback([
                            '#define TEST1 "Test1 is defined"',
                            '#define TEST2 "Test2 is defined"',
                            'proc main()',
                            '    number n',
                            '    n = 100',
                            '#ifdef TEST1',
                            '    #ifdef TEST2',
                            '    n = 400',
                            '    #end',
                            '#end',
                            '    addr n',
                            '    mod  0, 1',
                            'end'
                        ].join('\n'));
                    };
                preProcessor = new PreProcessor({onGetFileData: onGetFileData, onFinished: createOnFinished(400)});
                preProcessor.processFile({filename: 'main.whl', token: null});
            }
        );
        it(
            'Should not compile conditional with #ifdef',
            () => {
                let onGetFileData = function(filename, token, callback) {
                        callback([
                            'proc main()',
                            '    number n',
                            '    n = 100',
                            '#ifdef TEST',
                            '    n = 300',
                            '#end',
                            '    addr n',
                            '    mod  0, 1',
                            'end'
                        ].join('\n'));
                    };
                preProcessor = new PreProcessor({onGetFileData: onGetFileData, onFinished: createOnFinished(100)});
                preProcessor.processFile({filename: 'main.whl', token: null});
            }
        );
        it(
            'Should not compile conditional with nested #ifdef',
            () => {
                let onGetFileData = function(filename, token, callback) {
                        callback([
                            '#define TEST1 "Test1 is defined"',
                            'proc main()',
                            '    number n',
                            '    n = 100',
                            '#ifdef TEST1',
                            '    #ifdef TEST2',
                            '    n = 400',
                            '    #end',
                            '#end',
                            '    addr n',
                            '    mod  0, 1',
                            'end'
                        ].join('\n'));
                    };
                preProcessor = new PreProcessor({onGetFileData: onGetFileData, onFinished: createOnFinished(100)});
                preProcessor.processFile({filename: 'main.whl', token: null});
            }
        );
    }
);
