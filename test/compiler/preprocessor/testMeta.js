/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const errors            = require('../../../js/frontend/compiler/errors').errors;
const testError         = require('../../utils').testError;
const testCompile       = require('../../utils').testCompile;
const testPreProcessor  = require('../../utils').testPreProcessor;
const testCodeAndMemory = require('../../utils').testCodeAndMemory;
const assert            = require('assert');

describe(
    'Test Meta',
    () => {
        describe(
            'Test settings',
            () => {
                it(
                    'Should turn optimizer off',
                    () => {
                        let source = [
                                '#optimizer "off"',
                                'proc main()',
                                'end'
                            ];
                        let info = testCompile(source);
                        info.vm.setCommands(info.commands).run();
                        assert.equal(info.program.getOptimize(), false);
                    }
                );
                it(
                    'Should set heap',
                    () => {
                        let source = [
                                '#heap 123',
                                'proc main()',
                                'end'
                            ];
                        let info = testCompile(source);
                        info.vm.setCommands(info.commands).run();
                        assert.equal(info.program.getHeap(), 123);
                    }
                );
                it(
                    'Should set project name',
                    () => {
                        let source = [
                                '#project "My wheel project"',
                                'proc main()',
                                'end'
                            ];
                        let info = testCompile(source);
                        assert.equal(info.program.getTitle(), 'My wheel project');
                    }
                );
            }
        );
        describe(
            'Test #include errors',
            () => {
                testError(
                    it,
                    'Should throw FILE_NOT_FOUND',
                    [
                        '#include "notfound.whl"',
                        'proc main()',
                        'end'
                    ],
                    'Error: #' + errors.FILE_NOT_FOUND + ' File not found: "notfound.whl".'
                );
                testError(
                    it,
                    'Should throw FILENAME_EXPECTED',
                    [
                        '#include',
                        'proc main()',
                        'end'
                    ],
                    'Error: #' + errors.FILENAME_EXPECTED + ' Filename expected.'
                );
                testError(
                    it,
                    'Should throw FILENAME_EXPECTED',
                    [
                        '#include',
                        'proc main()',
                        'end'
                    ],
                    'Error: #' + errors.FILENAME_EXPECTED + ' Filename expected.'
                );
                testError(
                    it,
                    'Should throw FILENAME_EXPECTED',
                    [
                        '#include 1',
                        'proc main()',
                        'end'
                    ],
                    'Error: #' + errors.FILENAME_EXPECTED + ' Filename expected.'
                );
                testError(
                    it,
                    'Should throw UNEXPECTED_CODE_AFTER_META',
                    [
                        '#include "standard.whl" Wrong',
                        'proc main()',
                        'end'
                    ],
                    'Error: #' + errors.UNEXPECTED_CODE_AFTER_META + ' Unexpected code after "#include".'
                );
            }
        );
        describe(
            'Test #optimizer errors',
            () => {
                testError(
                    it,
                    'Should throw ON_OR_OFF_EXPECTED',
                    [
                        '#optimizer "wrong"',
                        'proc main()',
                        'end'
                    ],
                    'Error: #' + errors.ON_OR_OFF_EXPECTED + ' "on" or "off" expected.'
                );
                testError(
                    it,
                    'Should throw STRING_CONSTANT_EXPECTED',
                    [
                        '#optimizer 1',
                        'proc main()',
                        'end'
                    ],
                    'Error: #' + errors.STRING_CONSTANT_EXPECTED + ' String constant expected.'
                );
                testError(
                    it,
                    'Should throw UNEXPECTED_CODE_AFTER_META',
                    [
                        '#optimizer "on", 1',
                        'proc main()',
                        'end'
                    ],
                    'Error: #' + errors.UNEXPECTED_CODE_AFTER_META + ' Unexpected code after "#optimizer".'
                );
            }
        );
        describe(
            'Test #heap errors',
            () => {
                testError(
                    it,
                    'Should throw NUMBER_CONSTANT_EXPECTED',
                    [
                        '#heap "off"',
                        'proc main()',
                        'end'
                    ],
                    'Error: #' + errors.NUMBER_CONSTANT_EXPECTED + ' Number constant expected.'
                );
                testError(
                    it,
                    'Should throw UNEXPECTED_CODE_AFTER_META',
                    [
                        '#heap 456, 1',
                        'proc main()',
                        'end'
                    ],
                    'Error: #' + errors.UNEXPECTED_CODE_AFTER_META + ' Unexpected code after "#heap".'
                );
            }
        );
        describe(
            'Test #datatype errors',
            () => {
                testError(
                    it,
                    'Should throw NUMBER_FLOAT_OR_INT_EXPECTED',
                    [
                        '#datatype "wrong"',
                        'proc main()',
                        'end'
                    ],
                    'Error: #' + errors.NUMBER_FLOAT_OR_INT_EXPECTED + ' "number", "float" or "int" expected.'
                );
                testError(
                    it,
                    'Should throw STRING_CONSTANT_EXPECTED',
                    [
                        '#datatype 1',
                        'proc main()',
                        'end'
                    ],
                    'Error: #' + errors.STRING_CONSTANT_EXPECTED + ' String constant expected.'
                );
                testError(
                    it,
                    'Should throw UNEXPECTED_CODE_AFTER_META',
                    [
                        '#datatype "number", 1',
                        'proc main()',
                        'end'
                    ],
                    'Error: #' + errors.UNEXPECTED_CODE_AFTER_META + ' Unexpected code after "#datatype".'
                );
            }
        );
        describe(
            'Test #project error',
            () => {
                testError(
                    it,
                    'Should throw STRING_CONSTANT_EXPECTED',
                    [
                        '#project 1',
                        'proc main()',
                        'end'
                    ],
                    'Error: #' + errors.STRING_CONSTANT_EXPECTED + ' String constant expected.'
                );
            }
        );
        describe(
            'Test #define errors',
            () => {
                testError(
                    it,
                    'Should throw IDENTIFIER_EXPECTED',
                    [
                        '#define end 0',
                        'proc main()',
                        'end'
                    ],
                    'Error: #' + errors.IDENTIFIER_EXPECTED + ' Identifier expected.'
                );
                testError(
                    it,
                    'Should throw NUMBER_OR_STRING_CONSTANT_EXPECTED',
                    [
                        '#define CONST end',
                        'proc main()',
                        'end'
                    ],
                    'Error: #' + errors.NUMBER_OR_STRING_CONSTANT_EXPECTED + ' Number or string constant expected.'
                );
                testError(
                    it,
                    'Should throw UNEXPECTED_CODE_AFTER_META',
                    [
                        '#define CONST 1 Wrong',
                        'proc main()',
                        'end'
                    ],
                    'Error: #' + errors.UNEXPECTED_CODE_AFTER_META + ' Unexpected code after "#define".'
                );
            }
        );
        describe(
            'Test #image',
            () => {
                testError(
                    it,
                    'Should throw FILENAME_EXPECTED',
                    [
                        '#image',
                        'proc main()',
                        'end'
                    ],
                    'Error: #' + errors.FILENAME_EXPECTED + ' Filename expected.'
                );
                testError(
                    it,
                    'Should throw RGF_EXTENSION_EXPECTED',
                    [
                        '#image "test.bmp"',
                        'proc main()',
                        'end'
                    ],
                    'Error: #' + errors.RGF_EXTENSION_EXPECTED + ' ".rgf" Extension expected.'
                );
                testError(
                    it,
                    'Should throw DATA_EXPECTED',
                    [
                        '#image "test.rgf"',
                        'proc main()',
                        'end'
                    ],
                    'Error: #' + errors.DATA_EXPECTED + ' "#data" Expected.'
                );
                testError(
                    it,
                    'Should throw DATA_STRING_EXPECTED',
                    [
                        '#image "test.rgf"',
                        '#data',
                        'proc main()',
                        'end'
                    ],
                    'Error: #' + errors.DATA_STRING_EXPECTED + ' Data string expected.'
                );
                testError(
                    it,
                    'Should throw DATA_STRING_EMPTY',
                    [
                        '#image "test.rgf"',
                        '#data ""',
                        'proc main()',
                        'end'
                    ],
                    'Error: #' + errors.DATA_STRING_EMPTY + ' Data string is empty.'
                );
                testError(
                    it,
                    'Should throw DATA_STRING_INVALID_CHARACTER',
                    [
                        '#image "test.rgf"',
                        '#data "020"',
                        'proc main()',
                        'end'
                    ],
                    'Error: #' + errors.DATA_STRING_INVALID_CHARACTER + ' Data string can only contain "0" or "1".'
                );
                testError(
                    it,
                    'Should throw DATA_STRING_LENGTH_MISMATCH',
                    [
                        '#image "test.rgf"',
                        '#data "010"',
                        '#data "0100"',
                        'proc main()',
                        'end'
                    ],
                    'Error: #' + errors.DATA_STRING_LENGTH_MISMATCH + ' Data string length mismatch.'
                );
                it(
                    'Should create image',
                    function(done) {
                        testPreProcessor(
                            [
                                '#image "test.rgf"',
                                '#data "0100"',
                                '#data "0110"',
                                'proc main()',
                                'end'
                            ],
                            function(preProcessor) {
                                let resources = preProcessor.getResources();
                                let resource  = resources.get('test.rgf');
                                assert.notEqual(resource, null);
                                assert.equal(resources.get('notFound.rgf'), null);
                                resource.getData(function(data) {
                                    assert.deepEqual(data, [[0, 1, 0, 0], [0, 1, 1, 0 ]]);
                                    done();
                                });
                            }
                        );
                    }
                );
            }
        );
        describe(
            'Test #text',
            () => {
                testError(
                    it,
                    'Should throw FILENAME_EXPECTED',
                    [
                        '#text',
                        'proc main()',
                        'end'
                    ],
                    'Error: #' + errors.FILENAME_EXPECTED + ' Filename expected.'
                );
                testError(
                    it,
                    'Should throw RTF_EXTENSION_EXPECTED',
                    [
                        '#text "test.txt"',
                        'proc main()',
                        'end'
                    ],
                    'Error: #' + errors.RTF_EXTENSION_EXPECTED + ' ".rtf" Extension expected.'
                );
                testError(
                    it,
                    'Should throw LINE_EXPECTED',
                    [
                        '#text "test.rtf"',
                        'proc main()',
                        'end'
                    ],
                    'Error: #' + errors.LINE_EXPECTED + ' "#line" Expected.'
                );
                testError(
                    it,
                    'Should throw LINE_STRING_EXPECTED',
                    [
                        '#text "test.rtf"',
                        '#line',
                        'proc main()',
                        'end'
                    ],
                    'Error: #' + errors.LINE_STRING_EXPECTED + ' Line string expected.'
                );
                it(
                    'Should create text',
                    function(done) {
                        testPreProcessor(
                            [
                                '#text "test.rtf"',
                                '#line "The quick"',
                                '#line "brown"',
                                '#line "fox jumped..."',
                                'proc main()',
                                'end'
                            ],
                            function(preProcessor) {
                                let resources = preProcessor.getResources();
                                let resource  = resources.get('test.rtf');
                                assert.notEqual(resource, null);
                                assert.equal(resources.get('notFound.rgf'), null);
                                resource.getData(function(data) {
                                    assert.equal(data, 'The quick' + String.fromCharCode(0x0D) + 'brown' + String.fromCharCode(0x0D) + 'fox jumped...');
                                    done();
                                });
                            }
                        );
                    }
                );
            }
        );
        describe(
            'Test #rangecheck',
            () => {
                testCodeAndMemory(
                    it,
                    'Should apply range checking',
                    [
                        '#rangecheck "on"',
                        'number a[2][2]',
                        'proc main()',
                        '    number i = 0',
                        '    a[i][i] = 56',
                        'end'
                    ],
                    [
                        '0000|0000 set     [stack],        0',
                        '0001|0001 set     [stack + 1],    56',
                        '0002|0001 set     ptr,            9',
                        '0003|0001 set     [stack + 2],    [stack]',
                        '0004|0001 set     range1,         2',
                        '0005|0001 set     range2,         [stack + 2]',
                        '0006|0001 mod     0,              0',
                        '0007|0001 mul     [stack + 2],    2',
                        '0008|0001 add     ptr,            [stack + 2]',
                        '0009|0001 set     range1,         2',
                        '0010|0001 set     range2,         [stack]',
                        '0011|0001 mod     0,              0',
                        '0012|0001 add     ptr,            [stack]',
                        '0013|0001 set     [ptr],          [stack + 1]'
                    ],
                    false
                );
                testCodeAndMemory(
                    it,
                    'Should turn off range checking',
                    [
                        '#rangecheck "off"',
                        'number a[2][2]',
                        'proc main()',
                        '    number i = 0',
                        '    a[i][i] = 56',
                        'end'
                    ],
                    [
                        '0000|0000 set     [stack],        0',
                        '0001|0001 set     [stack + 1],    56',
                        '0002|0001 set     ptr,            9',
                        '0003|0001 set     [stack + 2],    [stack]',
                        '0004|0001 mul     [stack + 2],    2',
                        '0005|0001 add     ptr,            [stack + 2]',
                        '0006|0001 add     ptr,            [stack]',
                        '0007|0001 set     [ptr],          [stack + 1]'
                    ],
                    false
                );
            }
        );
        describe(
            'Test #stringlength',
            () => {
                testError(
                    it,
                    'Should throw NUMBER_CONSTANT_EXPECTED',
                    [
                        '#stringlength "A"',
                        'proc main()',
                        'end'
                    ],
                    'Error: #' + errors.NUMBER_CONSTANT_EXPECTED + ' Number constant expected.'
                );
                testError(
                    it,
                    'Should throw INVALID_STRING_LENGTH',
                    [
                        '#stringlength -1',
                        'proc main()',
                        'end'
                    ],
                    'Error: #' + errors.INVALID_STRING_LENGTH + ' Invalid string length.'
                );
                testError(
                    it,
                    'Should throw INVALID_STRING_LENGTH',
                    [
                        '#stringlength 128',
                        'proc main()',
                        'end'
                    ],
                    'Error: #' + errors.INVALID_STRING_LENGTH + ' Invalid string length.'
                );
            }
        );
        describe(
            'Test #stringcount',
            () => {
                testError(
                    it,
                    'Should throw NUMBER_CONSTANT_EXPECTED',
                    [
                        '#stringcount "A"',
                        'proc main()',
                        'end'
                    ],
                    'Error: #' + errors.NUMBER_CONSTANT_EXPECTED + ' Number constant expected.'
                );
                testError(
                    it,
                    'Should throw INVALID_STRING_COUNT',
                    [
                        '#stringcount -1',
                        'proc main()',
                        'end'
                    ],
                    'Error: #' + errors.INVALID_STRING_COUNT + ' Invalid string count.'
                );
            }
        );
    }
);
