var assert = require('assert');

var wheel             = require('../public/js/utils/base.js').wheel;
var compilerTestUtils = require('./compilerTestUtils.js');

describe(
    'Test operator',
    function() {
        describe(
            'Test operators - numbers',
            function () {
                it('Should add a constant value', function() {
                    var testData = compilerTestUtils.compileAndRun([
                            'number a',
                            'proc main()',
                            '    set a, 57',
                            '    add a, 2',
                            'endp'
                        ]).testData;

                    /**
                     * offset | value | description
                     * -------+-------+------------------------------
                     *      0 |     7 | REG_OFFSET_STACK
                     *      1 |     0 | REG_OFFSET_SRC
                     *      2 | 65535 | REG_OFFSET_DEST
                     *      3 |     4 | REG_OFFSET_CODE
                     *      4 |     0 | REG_RETURN
                     *      5 |     0 | REG_FLAGS
                     *      6 |    59 | number a - start of globals
                     *      7 |     7 | number b - local
                     *      8 | 65535 | return execution offset
                    **/
                    assert.deepStrictEqual(
                        testData.vm.getVMData().getData(),
                        [7, 0, 65535, 4, 0, 0, 59, 7, 65535]
                    );
                });
                it('Should subtract a constant value', function() {
                    var testData = compilerTestUtils.compileAndRun([
                            'number a',
                            'proc main()',
                            '    set a, 23',
                            '    sub a, 11',
                            'endp'
                        ]).testData;

                    /**
                     * offset | value | description
                     * -------+-------+------------------------------
                     *      0 |     7 | REG_OFFSET_STACK
                     *      1 |     0 | REG_OFFSET_SRC
                     *      2 | 65535 | REG_OFFSET_DEST
                     *      3 |     4 | REG_OFFSET_CODE
                     *      4 |     0 | REG_RETURN
                     *      5 |     0 | REG_FLAGS
                     *      6 |    12 | number a - start of globals
                     *      7 |     7 | number b - local
                     *      8 | 65535 | return execution offset
                    **/
                    assert.deepStrictEqual(
                        testData.vm.getVMData().getData(),
                        [7, 0, 65535, 4, 0, 0, 12, 7, 65535]
                    );
                });
                it('Should multiply two globals', function() {
                    var testData = compilerTestUtils.compileAndRun([
                            'number a',
                            'number b',
                            'proc main()',
                            '    set a, 11',
                            '    set b, 5',
                            '    mul a, b',
                            'endp'
                        ]).testData;

                    /**
                     * offset | value | description
                     * -------+-------+------------------------------
                     *      0 |     8 | REG_OFFSET_STACK
                     *      1 |     0 | REG_OFFSET_SRC
                     *      2 | 65535 | REG_OFFSET_DEST
                     *      3 |     5 | REG_OFFSET_CODE
                     *      4 |     0 | REG_RETURN
                     *      5 |     0 | REG_FLAGS
                     *      6 |    55 | number a - start of globals
                     *      7 |     5 | number b - global
                     *      8 |     8 |
                     *      9 | 65535 |
                    **/
                    assert.deepStrictEqual(
                        testData.vm.getVMData().getData(),
                        [8, 0, 65535, 5, 0, 0, 55, 5, 8, 65535]
                    );
                });
                it('Should divide global by local', function() {
                    var testData = compilerTestUtils.compileAndRun([
                            'number a',
                            'proc main()',
                            '    number b',
                            '    set a, 27',
                            '    set b, 3',
                            '    div a, b',
                            'endp'
                        ]).testData;

                    /**
                     * offset | value | description
                     * -------+-------+------------------------------
                     *      0 |     7 | REG_OFFSET_STACK
                     *      1 |     0 | REG_OFFSET_SRC
                     *      2 | 65535 | REG_OFFSET_DEST
                     *      3 |     5 | REG_OFFSET_CODE
                     *      4 |     0 | REG_RETURN
                     *      5 |     0 | REG_FLAGS
                     *      6 |     9 | number a - start of globals
                     *      7 |     7 |
                     *      8 | 65535 |
                     *      9 |     3 | number b - local
                    **/
                    assert.deepStrictEqual(
                        testData.vm.getVMData().getData(),
                        [7, 0, 65535, 5, 0, 0, 9, 7, 65535, 3]
                    );
                });
                it('Should multiply local with global', function() {
                    var testData = compilerTestUtils.compileAndRun([
                            'number a',
                            'proc main()',
                            '    number b',
                            '    set a, 13',
                            '    set b, 3',
                            '    mul b, a',
                            'endp'
                        ]).testData;

                    /**
                     * offset | value | description
                     * -------+-------+------------------------------
                     *      0 |     7 | REG_OFFSET_STACK
                     *      1 |     0 | REG_OFFSET_SRC
                     *      2 | 65535 | REG_OFFSET_DEST
                     *      3 |     5 | REG_OFFSET_CODE
                     *      4 |     0 | REG_RETURN
                     *      5 |     0 | REG_FLAGS
                     *      6 |    13 | number a - start of globals
                     *      7 |     7 |
                     *      8 | 65535 |
                     *      9 |    39 | number b - local
                    **/
                    assert.deepStrictEqual(
                        testData.vm.getVMData().getData(),
                        [7, 0, 65535, 5, 0, 0, 13, 7, 65535, 39]
                    );
                    //console.log(testData.vm.getVMData().getData());
                });
            }
        );
    }
);