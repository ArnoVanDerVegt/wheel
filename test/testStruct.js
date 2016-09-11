var assert = require('assert');

var wheel             = require('../public/js/utils/base.js').wheel;
var compilerTestUtils = require('./compilerTestUtils.js');

describe(
    'Test struct',
    function() {
        describe(
            'Declare struct',
            function () {
                it('Should declare global a struct', function() {
                    var testData = compilerTestUtils.compileAndRun([
                            'struct S',
                            '    number x, y, z',
                            'ends',
                            'S s',
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
                            0,      // global struct offset
                            0,
                            0,
                            9,      // stack pointer
                            65535,  // return code offset
                        ]
                    );
                });

                it('Should set global struct fields', function() {
                    var testData = compilerTestUtils.compileAndRun([
                            'struct S',
                            '    number x, y, z',
                            'ends',
                            'S s',
                            'proc main()',
                            '    set s.x, 7',
                            '    set s.y, 13',
                            '    set s.z, 19',
                            'endp'
                        ]).testData;

                    assert.deepStrictEqual(
                        testData.vm.getVMData().getData(),
                        [
                            9,      // REG_OFFSET_STACK
                            0,      // REG_OFFSET_SRC
                            65535,  // REG_OFFSET_DEST
                            5,      // REG_OFFSET_CODE
                            0,      // REG_RETURN
                            0,      // REG_FLAGS
                            7,      // global struct offset
                            13,
                            19,
                            9,      // stack pointer
                            65535,  // return code offset
                        ]
                    );
                });

                it('Should declare local a struct', function() {
                    var testData = compilerTestUtils.compileAndRun([
                            'struct S',
                            '    number x, y, z',
                            'ends',
                            'proc main()',
                            '   S s',
                            'endp'
                        ]).testData;

                    assert.deepStrictEqual(
                        testData.vm.getVMData().getData(),
                        [
                            6,      // REG_OFFSET_STACK
                            0,      // REG_OFFSET_SRC
                            65535,  // REG_OFFSET_DEST
                            2,      // REG_OFFSET_CODE
                            0,      // REG_RETURN
                            0,      // REG_FLAGS
                            6,      // stack pointer
                            65535   // return code offset
                        ]
                    );
                });

                it('Should set local struct fields', function() {
                    var testData = compilerTestUtils.compileAndRun([
                            'struct S',
                            '    number x, y, z',
                            'ends',
                            'proc main()',
                            '   S s',
                            '   set s.x, 56',
                            '   set s.y, 90',
                            '   set s.z, 45',
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
                            65535,  // return code offset
                            56,
                            90,
                            45
                        ]
                    );
                });
            }
        );

        describe(
            'Structs and pointers',
            function () {
                it('Should set values of a struct pointer', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'struct Point',
                            '    number x',
                            '    number y',
                            'ends',
                            '',
                            'proc main()',
                            '    Point p',
                            '',
                            '    Point *pp',
                            '    set pp, &p',
                            '',
                            '    set *pp.x, -472',
                            '    set *pp.y, 58',
                            '',
                            '    printN(p.x)',
                            '    printN(p.y)',
                            'endp'
                        ])).testData;

                    assert.deepStrictEqual(testData.messages, [-472, 58]);
                });

                it('Should pass a struct pointer to a procedure', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'struct Point',
                            '    number x',
                            '    number y',
                            'ends',
                            '',
                            'proc testPointer(Point *p)',
                            '    set *p.x, 38934',
                            '    set *p.y, -2978',
                            'endp',
                            '',
                            'proc main()',
                            '    Point p',
                            '    testPointer(&p)',
                            '',
                            '    printN(p.x)',
                            '    printN(p.y)',
                            'endp'
                        ])).testData;

                    assert.deepStrictEqual(testData.messages, [38934, -2978]);
                });
            }
        );
    }
);