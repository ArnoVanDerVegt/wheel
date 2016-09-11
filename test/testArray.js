var assert = require('assert');

var wheel             = require('../public/js/utils/base.js').wheel;
var compilerTestUtils = require('./compilerTestUtils.js');

var standardLines = [
        'proc printN(number n)',
        '    struct PrintNumber',
        '        number n',
        '    ends',
        '    PrintNumber printNumber',
        '    set      printNumber.n,n',
        '    addr     printNumber',
        '    module   0,0',
        'endp',
        'proc printS(string s)',
        '    struct PrintString',
        '        string s',
        '    ends',
        '    PrintString printString',
        '    set      printString.s,s',
        '    addr     printString',
        '    module   0,1',
        'endp'
    ];

describe(
    'Test array',
    function() {
        describe(
            'Declare global array variable',
            function () {
                it('Should declare a global array', function() {
                    var testData = compilerTestUtils.compileAndRun([
                            'number a[3]',
                            'proc main()',
                            'endp'
                        ]).testData;

                    assert.deepStrictEqual(
                        testData.vm.getVMData().getData(),
                        [
                            9,      // REG_OFFSET_STACK
                            0,      // REG_OFFSET_SRC
                            65535,  // REG_OFFSET_DEST
                            2,      // REG_OFFSET_CODE
                            0,      // REG_RETURN
                            0,      // REG_FLAGS
                            0,      // number a[0] - start of globals
                            0,      // number a[1] - start of globals
                            0,      // number a[2] - start of globals
                            9,      // stack pointer
                            65535,  // return code offset
                        ]
                    );
                });

                it('Should write a value in a global array', function() {
                    var testData = compilerTestUtils.compileAndRun([
                            'number a[3]',
                            'proc main()',
                            '    arrayw  a, 1, 37',
                            'endp'
                        ]).testData;

                    assert.deepStrictEqual(
                        testData.vm.getVMData().getData(),
                        [
                            9,      // REG_OFFSET_STACK
                            11,     // REG_OFFSET_SRC
                            65535,  // REG_OFFSET_DEST
                            8,      // REG_OFFSET_CODE
                            0,      // REG_RETURN
                            0,      // REG_FLAGS
                            0,      // number a[0] - start of globals
                            37,     // number a[1]
                            0,      // number a[2]
                            9,      // stack pointer
                            65535,  // return code offset
                            37      // local temp variable
                        ]
                    );
                });

                it('Should write and read a value in a global array', function() {
                    var testData = compilerTestUtils.compileAndRun([
                            'number i',
                            'number a[3]',
                            'proc main()',
                            '    arrayw  a, 1, 41',
                            '    arrayr  i, a, 1',
                            'endp'
                        ]).testData;

                    assert.deepStrictEqual(
                        testData.vm.getVMData().getData(),
                        [
                            10,     // REG_OFFSET_STACK
                            8,      // REG_OFFSET_SRC
                            65535,  // REG_OFFSET_DEST
                            12,     // REG_OFFSET_CODE
                            0,      // REG_RETURN
                            0,      // REG_FLAGS
                            41,     // number i - start of globals
                            0,      // number a[0]
                            41,     // number a[1]
                            0,      // number a[2]
                            10,     // stack pointer
                            65535,  // return code offset
                            41      // local temp variable
                        ]
                    );
                });

                it('Should declare a global array constant', function() {
                    var testData = compilerTestUtils.compileAndRun([
                            'number a[4] = [45,46,47,48]',
                            'proc main()',
                            'endp'
                        ]).testData;

                    assert.deepStrictEqual(
                        testData.vm.getVMData().getData(),
                        [
                            10,     // REG_OFFSET_STACK
                            0,      // REG_OFFSET_SRC
                            65535,  // REG_OFFSET_DEST
                            2,      // REG_OFFSET_CODE
                            0,      // REG_RETURN
                            0,      // REG_FLAGS
                            45,     // number a[0] - start of globals
                            46,     // number a[1]
                            47,     // number a[2]
                            48,     // number a[3]
                            10,     // stack pointer
                            65535   // return code offset
                        ]
                    );
                });

                it('Should declare a procedure with an array parameter', function() {
                    var testData = compilerTestUtils.compileAndRun([
                            'proc test(number a[3])',
                            'endp',
                            'proc main()',
                            'endp'
                        ]).testData;

                    assert.deepStrictEqual(
                        testData.vm.getVMData().getData(),
                        [
                            6,      // REG_OFFSET_STACK
                            0,      // REG_OFFSET_SRC
                            65535,  // REG_OFFSET_DEST
                            5,      // REG_OFFSET_CODE
                            0,      // REG_RETURN
                            0,      // REG_FLAGS
                            6,      // stack pointer
                            65535   // return code offset
                        ]
                    );
                });

                it('Should call with constant array parameter', function() {
                    var testData = compilerTestUtils.compileAndRun([
                            'proc test(number a[3])',
                            'endp',
                            'proc main()',
                            '    test([34,35,36])',
                            'endp'
                        ]).testData;

                    assert.deepStrictEqual(
                        testData.vm.getVMData().getData(),
                        [
                            9,      // REG_OFFSET_STACK
                            9,      // REG_OFFSET_SRC
                            65535,  // REG_OFFSET_DEST
                            16,     // REG_OFFSET_CODE
                            0,      // REG_RETURN
                            0,      // REG_FLAGS
                            34,     // global constant [0]
                            35,     // global constant [1]
                            36,     // global constant [2]
                            9,      // stack pointer
                            65535,  // return code offset
                            9,
                            13,
                            34,     // param [0]
                            35,     // param [1]
                            36      // param [2]
                        ]
                    );
                });
            }
        );
        describe(
            'Write and read arrays',
            function () {
                it('Should write and read 5 numbers', function() {
                    var testData = compilerTestUtils.compileAndRun(standardLines.concat([
                            'struct Item',
                            '    number list[5]',
                            'ends',
                            '',
                            'Item item',
                            '',
                            'proc main()',
                            '    number   value',
                            '',
                            '    number   counter = 0',
                            'writeLoop:',
                            '    set      value, counter',
                            '    mul      value, 2',
                            '    arrayw   item.list, counter, value',
                            '    inc      counter',
                            '    cmp      counter, 5',
                            '    jl       writeLoop',
                            '    set      counter, 0',
                            'readLoop:',
                            '    arrayr   value, item.list, counter',
                            '    printN(value)',
                            '    inc      counter',
                            '    cmp      counter, 5',
                            '    jl       readLoop',
                            'endp'
                        ])).testData;

                    assert.deepStrictEqual(testData.messages, [0, 2, 4, 6, 8]);
                });

                it('Should write and read 5 numbers', function() {
                    var testData = compilerTestUtils.compileAndRun(standardLines.concat([
                            'struct Point',
                            '    number x, y, z',
                            'ends',
                            '',
                            'Point srcPoint',
                            'Point points[3]',
                            'Point destPoint',
                            '',
                            'proc main()',
                            '    set srcPoint.x, 4',
                            '    set srcPoint.y, 7',
                            '    set srcPoint.z, -10',
                            '    arrayw points, 1, srcPoint',
                            '',
                            '    arrayr destPoint, points, 1',
                            '    printN(destPoint.x)',
                            '    printN(destPoint.y)',
                            '    printN(destPoint.z)',
                            'endp'
                        ])).testData;

                    assert.deepStrictEqual(testData.messages, [4, 7, -10]);
                });

                it('Should declare and print local constant array', function() {
                    var testData = compilerTestUtils.compileAndRun(standardLines.concat([
                            'proc main()',
                            '    number l = 7',
                            '    printN(l)',
                            '    number localArray[3] = [99, 100, 101]',
                            '',
                            '    number counter',
                            '    number value',
                            '    set counter, 2',
                            'loop:',
                            '    arrayr   value, localArray, counter',
                            '    printN(value)',
                            '    sub      counter, 1',
                            '    cmp      counter, 0',
                            '    jge      loop',
                            'endp'
                        ])).testData;

                    assert.deepStrictEqual(testData.messages, [7, 101, 100, 99]);
                });

                it('Should declare and print global constant array', function() {
                    var testData = compilerTestUtils.compileAndRun(standardLines.concat([
                            'number g = 437',
                            'number globalArray[4] = [457, 345, 72, 348]',
                            '',
                            'proc main()',
                            '    printN(g)',
                            '',
                            '    number counter',
                            '    number value',
                            '    set counter, 3',
                            'loop:',
                            '    arrayr   value, globalArray, counter',
                            '    printN(value)',
                            '    sub      counter, 1',
                            '    cmp      counter, 0',
                            '    jge      loop',
                            'endp'
                        ])).testData;

                    assert.deepStrictEqual(testData.messages, [437, 348, 72, 345, 457]);
                });
            }
        );
    }
);