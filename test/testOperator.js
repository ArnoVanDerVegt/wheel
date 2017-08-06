var assert            = require('assert');
var wheel             = require('../js/utils/base.js').wheel;
var compilerTestUtils = require('./compilerTestUtils.js');

describe(
    'Test operator',
    function() {
        describe(
            'Test operators',
            function() {
                for (directive = 0; directive < 2; directive++) {
                    var operators = ['set', 'add', 'sub', 'mul', 'div'];
                    for (var i = 0; i < operators.length; i++) {
                        var operator = operators[i];
                        it('Should ' + operator + ' a constant value' + (directive ? ' - ret' : ''), function() {
                            var valueA = Math.round(Math.random() * 100);
                            var valueB = Math.round(Math.random() * 10);

                            var testData = compilerTestUtils.compileAndRun(
                                    [
                                        'number a',
                                        'proc main()',
                                        '    a = ' + valueA,
                                        '    asm',
                                        '        ' + operator + ' a, ' + valueB,
                                        '    end',
                                        'endp'
                                    ],
                                    directive
                                ).testData;

                            var result = {
                                    set: valueB,
                                    add: valueA + valueB,
                                    sub: valueA - valueB,
                                    mul: valueA * valueB,
                                    div: valueA / valueB
                                }[operator];

                            assert.deepEqual(
                                testData.vm.getVMData().getData(),
                                [
                                    7,      // REG_OFFSET_STACK
                                    0,      // REG_OFFSET_SRC
                                    directive ? 0 : 65535,  // REG_OFFSET_DEST
                                    65536,  // REG_OFFSET_CODE
                                    0,      // REG_RETURN
                                    0,      // REG_FLAGS
                                    result, // number a - start of globals
                                    7,      // stack pointer
                                    65535   // return code offset
                                ]
                            );
                        });
                    }

                    for (var i = 0; i < operators.length; i++) {
                        var operator = operators[i];
                        it('Should ' + operator + ' a global value' + (directive ? ' - ret' : ''), function() {
                            var valueA = Math.round(Math.random() * 100);
                            var valueB = Math.round(Math.random() * 10);

                            var testData = compilerTestUtils.compileAndRun(
                                    [
                                        'number a',
                                        'number b',
                                        'proc main()',
                                        '    a = ' + valueA,
                                        '    b = ' + valueB,
                                        '    asm',
                                        '       ' + operator + ' a, b',
                                        '    end',
                                        'endp'
                                    ],
                                    directive
                                ).testData;

                            var result = {
                                    set: valueB,
                                    add: valueA + valueB,
                                    sub: valueA - valueB,
                                    mul: valueA * valueB,
                                    div: valueA / valueB
                                }[operator];

                            assert.deepEqual(
                                testData.vm.getVMData().getData(),
                                [
                                    8,      // REG_OFFSET_STACK
                                    0,      // REG_OFFSET_SRC
                                    directive ? 0 : 65535,  // REG_OFFSET_DEST
                                    65536,  // REG_OFFSET_CODE
                                    0,      // REG_RETURN
                                    0,      // REG_FLAGS
                                    result, // valueA [set|add|sub|mul|div] valueB; number a - start of globals
                                    valueB, // number b - global
                                    8,      // stack pointer
                                    65535   // return code offset
                                ]
                            );
                        });
                    }

                    for (var i = 0; i < operators.length; i++) {
                        var operator = operators[i];
                        it('Should ' + operator + ' a local value' + (directive ? ' - ret' : ''), function() {
                            var valueB = 1 + Math.round(Math.random() * 10);
                            var valueA = (1 + Math.round(Math.random() * 100)) * valueB;

                            var testData = compilerTestUtils.compileAndRun(
                                    [
                                        'number a',
                                        'proc main()',
                                            'number b',
                                        '    a = ' + valueA,
                                        '    b = ' + valueB,
                                        '    asm',
                                        '        ' + operator + ' a, b',
                                        '    end',
                                        'endp'
                                    ],
                                    directive
                                ).testData;

                            var result = {
                                    set: valueB,
                                    add: valueA + valueB,
                                    sub: valueA - valueB,
                                    mul: valueA * valueB,
                                    div: valueA / valueB
                                }[operator];

                            assert.deepEqual(
                                testData.vm.getVMData().getData(),
                                [
                                    7,      // REG_OFFSET_STACK
                                    0,      // REG_OFFSET_SRC
                                    directive ? 0 : 65535,  // REG_OFFSET_DEST
                                    65536,  // REG_OFFSET_CODE
                                    0,      // REG_RETURN
                                    0,      // REG_FLAGS
                                    result, // valueA [set|add|sub|mul|div] valueB; number a - start of globals
                                    7,      // stack pointer
                                    65535,  // return code offset
                                    valueB  // number b - global
                                ]
                            );
                        });
                    }
                }
            }
        );

        describe(
            'Inc, dec',
            function() {
                it('Increase a global', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'number n',
                            '',
                            'proc main()',
                            '    n = 17',
                            '    asm',
                            '        inc n',
                            '    end',
                            '',
                            '    printN(n)',
                            'endp'
                        ])).testData;

                    assert.deepEqual(testData.messages, [18]);
                });

                it('Decrease a global', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'number n',
                            '',
                            'proc main()',
                            '    n = 19305',
                            '    asm',
                            '        dec n',
                            '    end',
                            '',
                            '    printN(n)',
                            'endp'
                        ])).testData;

                    assert.deepEqual(testData.messages, [19304]);
                });

                it('Increase a local', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'proc main()',
                            '    number n',
                            '',
                            '    n = 1467',
                            '    asm',
                            '        inc n',
                            '    end',
                            '',
                            '    printN(n)',
                            'endp'
                        ])).testData;

                    assert.deepEqual(testData.messages, [1468]);
                });

                it('Decrease a local', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'proc main()',
                            '    number n',
                            '',
                            '    n = 2305',
                            '    asm',
                            '        dec n',
                            '    end',
                            '',
                            '    printN(n)',
                            'endp'
                        ])).testData;

                    assert.deepEqual(testData.messages, [2304]);
                });
            }
        );
    }
);