var assert            = require('assert');
var wheel             = require('../utils/base.js').wheel;
var compilerTestUtils = require('./compilerTestUtils.js');

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

                    assert.deepEqual(
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

                    assert.deepEqual(
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

                    assert.deepEqual(
                        testData.vm.getVMData().getData(),
                        [
                            10,     // REG_OFFSET_STACK
                            41,      // REG_OFFSET_SRC
                            65535,  // REG_OFFSET_DEST
                            15,     // REG_OFFSET_CODE
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

                    assert.deepEqual(
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

                    assert.deepEqual(
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

                    assert.deepEqual(
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
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
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

                    assert.deepEqual(testData.messages, [0, 2, 4, 6, 8]);
                });

                it('Should write and read a struct', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
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

                    assert.deepEqual(testData.messages, [4, 7, -10]);
                });

                it('Should declare and print local constant array', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
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

                    assert.deepEqual(testData.messages, [7, 101, 100, 99]);
                });

                it('Should declare and print global constant array', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
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

                    assert.deepEqual(testData.messages, [437, 348, 72, 345, 457]);
                });

                it('Should pass a global and constant array to a procedure', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'number items[3]',
                            '',
                            'proc testProcedure(number list[3])',
                            '    number   counter',
                            '    set      counter,                0',
                            'readLoop:',
                            '    number   value',
                            '    arrayr   value,                  list, counter',
                            '    printN(value)',
                            '    add      counter,                1',
                            '    cmp      counter,                3',
                            '    jl       readLoop',
                            'endp',
                            '',
                            'proc main()',
                            '    number   counter',
                            '    set      counter,                0',
                            'writeLoop:',
                            '    number   value',
                            '    set      value,                  counter',
                            '    mul      value,                  3',
                            '    arrayw   items,                  counter, value',
                            '    add      counter,                1',
                            '    cmp      counter,                3',
                            '    jl       writeLoop',
                            '',
                            '    testProcedure(items)',
                            '',
                            '    printS("----")',
                            '',
                            '    testProcedure([5, 9, -2])',
                            'endp'
                        ])).testData;

                    assert.deepEqual(testData.messages, [0, 3, 6, '----', 5, 9, -2]);
                });

                it('Should pass a local and constant array to a procedure', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'proc testProcedure(number list[4])',
                            '    number   counter',
                            '    set      counter,                0',
                            'readLoop:',
                            '    number   value',
                            '    arrayr   value,                  list, counter',
                            '    printN(value)',
                            '    add      counter,                1',
                            '    cmp      counter,                4',
                            '    jl       readLoop',
                            'endp',
                            '',
                            'proc main()',
                            '    number items[4]',
                            '',
                            '    number   counter',
                            '    set      counter,                0',
                            'writeLoop:',
                            '    number   value',
                            '    set      value,                  counter',
                            '    mul      value,                  2',
                            '    arrayw   items,                  counter, value',
                            '    add      counter,                1',
                            '    cmp      counter,                4',
                            '    jl       writeLoop',
                            '',
                            '    testProcedure(items)',
                            '',
                            '    printS("----")',
                            '',
                            '    testProcedure([-45, 921, -5, 467])',
                            'endp'
                        ])).testData;

                    assert.deepEqual(testData.messages, [0, 2, 4, 6, '----', -45, 921, -5, 467]);
                });

                it('Should write and read a global array of structs with an array', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'struct Test',
                            '    number n[4]',
                            'ends',
                            '',
                            'Test test[3]',
                            '',
                            'proc main()',
                            '    Test t',
                            '    arrayw t.n, 0, 234',
                            '    arrayw t.n, 1, 9',
                            '    arrayw t.n, 2, 3664',
                            '    arrayw t.n, 3, 46',
                            '',
                            '    arrayw test, 0, t',
                            '    arrayw test, 2, t',
                            '',
                            '    arrayw t.n, 0, 98',
                            '    arrayw t.n, 1, 23',
                            '    arrayw t.n, 2, 98',
                            '    arrayw t.n, 3, 458',
                            '',
                            '    arrayw test, 1, t',
                            '',
                            '    number i = 0',
                            'loop1:',
                            '    arrayr t, test, i',
                            '    inc i',
                            '    number j = 0',
                            'loop2:',
                            '    number n',
                            '    arrayr n, t.n, j',
                            '    printN(n)',
                            '    inc j',
                            '    cmp j, 4',
                            '    jl  loop2',
                            '    cmp i, 3',
                            '    jl loop1',
                            'endp'
                        ])).testData;

                    assert.deepEqual(testData.messages, [234, 9, 3664, 46, 98, 23, 98, 458, 234, 9, 3664, 46]);
                });
            }
        );

        describe(
            'Arrays and pointers',
            function () {
                it('Should pass a pointer to a procedure and set values', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'proc testArray(number *n[3])',
                            '    arrayw  *n, 0, 586',
                            '    arrayw  *n, 1, -3232',
                            '    arrayw  *n, 2, 90',
                            'endp',
                            '',
                            'proc main()',
                            '    number x[3]',
                            '',
                            '    testArray(&x)',
                            '',
                            '    number a',
                            '',
                            '    arrayr  a, x, 0',
                            '    printN(a)',
                            '    arrayr  a, x, 1',
                            '    printN(a)',
                            '    arrayr  a, x, 2',
                            '    printN(a)',
                            'endp'
                        ])).testData;

                    assert.deepEqual(testData.messages, [586, -3232, 90]);
                });

                it('Should call a procedure with a pointer to array parameter', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'struct Point',
                            '    number x',
                            '    number y',
                            'ends',
                            '',
                            'Point pp[10]',
                            'Point *points[0]',
                            '',
                            'proc testPointer()',
                            '    Point point',
                            '    arrayr point, *points, 1',
                            '    printN(point.x)',
                            '    printN(point.y)',
                            'endp',
                            '',
                            'proc main()',
                            '    Point p',
                            '    set p.x, 984',
                            '    set p.y, 157',
                            '    arrayw   pp, 1, p',
                            '    set points, &pp',
                            '',
                            '    testPointer()',
                            'endp'
                        ])).testData;

                    assert.deepEqual(testData.messages, [984, 157]);
                });

                it('Should read from pointer array to global pointer struct', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'struct Point',
                            '    number x',
                            '    number y',
                            'ends',
                            '',
                            'Point point',
                            'Point *points[0]',
                            'Point *p',
                            'Point pp[10]',
                            '',
                            'proc testPointer()',
                            '    arrayr p, *points, 1',
                            '    printN(point.x)',
                            '    printN(point.y)',
                            'endp',
                            '',
                            'proc main()',
                            '    Point local',
                            '    set local.x, 3489',
                            '    set local.y, 309',
                            '    arrayw   pp, 1, local',
                            '    set points, &pp',
                            '    set p, &point',
                            '',
                            '    testPointer()',
                            'endp'
                        ])).testData;

                    assert.deepEqual(testData.messages, [3489, 309]);
                });

                it('Should read from pointer array to local pointer struct', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'struct Point',
                            '    number x',
                            '    number y',
                            'ends',
                            '',
                            'Point point',
                            'Point *points[0]',
                            'Point pp[10]',
                            '',
                            'proc testPointer()',
                            '    Point *p',
                            '    set p, &point',
                            '    arrayr p, *points, 1',
                            '    printN(point.x)',
                            '    printN(point.y)',
                            'endp',
                            '',
                            'proc main()',
                            '    Point local',
                            '    set local.x, 3489',
                            '    set local.y, 309',
                            '    arrayw   pp, 1, local',
                            '    set points, &pp',
                            '',
                            '    testPointer()',
                            'endp'
                        ])).testData;

                    assert.deepEqual(testData.messages, [3489, 309]);
                });
            }
        );
    }
);