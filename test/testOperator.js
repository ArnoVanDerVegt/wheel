var assert = require('assert');

var wheel             = require('../public/js/utils/base.js').wheel;
var compilerTestUtils = require('./compilerTestUtils.js');

describe(
    'Test operator',
    function() {
        describe(
            'Test operators',
            function () {
                var operators = ['set', 'add', 'sub', 'mul', 'div'];
                for (var i = 0; i < operators.length; i++) {
                    var operator = operators[i];
                    it('Should ' + operator + ' a constant value', function() {
                        var valueA = Math.round(Math.random() * 100);
                        var valueB = Math.round(Math.random() * 10);

                        var testData = compilerTestUtils.compileAndRun([
                                'number a',
                                'proc main()',
                                '    set a, ' + valueA,
                                '    ' + operator + ' a, ' + valueB,
                                'endp'
                            ]).testData;

                        var result = {
                                set: valueB,
                                add: valueA + valueB,
                                sub: valueA - valueB,
                                mul: valueA * valueB,
                                div: valueA / valueB
                            }[operator];

                        assert.deepStrictEqual(
                            testData.vm.getVMData().getData(),
                            [
                                7,      // REG_OFFSET_STACK
                                0,      // REG_OFFSET_SRC
                                65535,  // REG_OFFSET_DEST
                                4,      // REG_OFFSET_CODE
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
                    it('Should ' + operator + ' a global value', function() {
                        var valueA = Math.round(Math.random() * 100);
                        var valueB = Math.round(Math.random() * 10);

                        var testData = compilerTestUtils.compileAndRun([
                                'number a',
                                'number b',
                                'proc main()',
                                '    set a, ' + valueA,
                                '    set b, ' + valueB,
                                '    ' + operator + ' a, b',
                                'endp'
                            ]).testData;

                        var result = {
                                set: valueB,
                                add: valueA + valueB,
                                sub: valueA - valueB,
                                mul: valueA * valueB,
                                div: valueA / valueB
                            }[operator];

                        assert.deepStrictEqual(
                            testData.vm.getVMData().getData(),
                            [
                                8,      // REG_OFFSET_STACK
                                0,      // REG_OFFSET_SRC
                                65535,  // REG_OFFSET_DEST
                                5,      // REG_OFFSET_CODE
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
                    it('Should ' + operator + ' a local value', function() {
                        var valueB = 1 + Math.round(Math.random() * 10);
                        var valueA = (1 + Math.round(Math.random() * 100)) * valueB;

                        var testData = compilerTestUtils.compileAndRun([
                                'number a',
                                'proc main()',
                                    'number b',
                                '    set a, ' + valueA,
                                '    set b, ' + valueB,
                                '    ' + operator + ' a, b',
                                'endp'
                            ]).testData;

                        var result = {
                                set: valueB,
                                add: valueA + valueB,
                                sub: valueA - valueB,
                                mul: valueA * valueB,
                                div: valueA / valueB
                            }[operator];

                        assert.deepStrictEqual(
                            testData.vm.getVMData().getData(),
                            [
                                7,      // REG_OFFSET_STACK
                                0,      // REG_OFFSET_SRC
                                65535,  // REG_OFFSET_DEST
                                5,      // REG_OFFSET_CODE
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
        );
    }
);