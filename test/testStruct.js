var assert = require('assert');

var wheel             = require('../js/utils/base.js').wheel;
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

                    assert.deepEqual(
                        testData.vm.getVMData().getData(),
                        [
                            9,      // REG_OFFSET_STACK
                            0,      // REG_OFFSET_SRC
                            65535,  // REG_OFFSET_DEST
                            65536,  // REG_OFFSET_CODE
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

                    assert.deepEqual(
                        testData.vm.getVMData().getData(),
                        [
                            9,      // REG_OFFSET_STACK
                            0,      // REG_OFFSET_SRC
                            65535,  // REG_OFFSET_DEST
                            65536,  // REG_OFFSET_CODE
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

                    assert.deepEqual(
                        testData.vm.getVMData().getData(),
                        [
                            6,      // REG_OFFSET_STACK
                            0,      // REG_OFFSET_SRC
                            65535,  // REG_OFFSET_DEST
                            65536,  // REG_OFFSET_CODE
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

                    assert.deepEqual(
                        testData.vm.getVMData().getData(),
                        [
                            6,      // REG_OFFSET_STACK
                            0,      // REG_OFFSET_SRC
                            65535,  // REG_OFFSET_DEST
                            65536,  // REG_OFFSET_CODE
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

                    assert.deepEqual(testData.messages, [-472, 58]);
                });

                it('Should get derefferenced local/local struct pointer values', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'struct Point',
                            '    number x',
                            '    number y',
                            'ends',
                            '',
                            'proc main()',
                                'Point p1',
                                'set p1.x, -678',
                                'set p1.y, 37',
                                'Point *p2',
                                'set p2, &p1',
                                '',
                                'number n',
                                'set n, *p2.y',
                                'printN(n)',
                                'set n, *p2.x',
                                'printN(n)',
                            'endp'
                        ])).testData;

                    assert.deepEqual(testData.messages, [37, -678]);
                });

                it('Should get derefferenced local/global struct pointer values', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'struct Point',
                            '    number x',
                            '    number y',
                            'ends',
                            '',
                            'Point *p2',
                            '',
                            'proc main()',
                                'Point p1',
                                'set p1.x, -678',
                                'set p1.y, 37',
                                'set p2, &p1',
                                '',
                                'number n',
                                'set n, *p2.y',
                                'printN(n)',
                                'set n, *p2.x',
                                'printN(n)',
                            'endp'
                        ])).testData;

                    assert.deepEqual(testData.messages, [37, -678]);
                });

                it('Should get derefferenced global/global struct pointer values', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'struct Point',
                            '    number x',
                            '    number y',
                            'ends',
                            '',
                            'Point *p2',
                            'Point p1',
                            '',
                            'proc main()',
                                'set p1.x, -678',
                                'set p1.y, 37',
                                'set p2, &p1',
                                '',
                                'number n',
                                'set n, *p2.y',
                                'printN(n)',
                                'set n, *p2.x',
                                'printN(n)',
                            'endp'
                        ])).testData;

                    assert.deepEqual(testData.messages, [37, -678]);
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

                    assert.deepEqual(testData.messages, [38934, -2978]);
                });
            }
        );

        describe(
            'Nested structs',
            function () {
                it('Should nest a struct', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'struct Point',
                            '    number x',
                            '    number y',
                            'ends',
                            '',
                            'struct Triangle',
                            '    Point p1',
                            '    Point p2',
                            '    Point p3',
                            'ends',
                            '',
                            'proc main()',
                            '    Triangle t',
                            '    set t.p1.x, 5',
                            '    set t.p1.y, 2234',
                            '    set t.p2.x, 45',
                            '    set t.p2.y, 667',
                            '',
                            '    number n',
                            '',
                            '    set n, t.p1.x',
                            '    printN(n)',
                            '    set n, t.p1.y',
                            '    printN(n)',
                            '    set n, t.p2.x',
                            '    printN(n)',
                            '    set n, t.p2.y',
                            '    printN(n)',
                            'endp'
                        ])).testData;

                    assert.deepEqual(testData.messages, [5, 2234, 45, 667]);
                });

                it('Should nest an array struct', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'struct Point',
                            '    number x',
                            '    number y',
                            'ends',
                            '',
                            'struct Triangle',
                            '    Point points[3]',
                            'ends',
                            '',
                            'proc main()',
                            '    Triangle t',
                            '',
                            '    Point p',
                            '',
                            '    set p.x, 233',
                            '    set p.y, 768',
                            '    arrayw t.points, 0, p',
                            '',
                            '    set p.x, 78',
                            '    set p.y, 268',
                            '    arrayw t.points, 1, p',
                            '',
                            '    Point pp',
                            '',
                            '    arrayr pp, t.points, 0',
                            '',
                            '    number n',
                            '',
                            '    set n, pp.x',
                            '    printN(n)',
                            '    set n, pp.y',
                            '    printN(n)',
                            '',
                            '    arrayr pp, t.points, 1',
                            '',
                            '    set n, pp.x',
                            '    printN(n)',
                            '    set n, pp.y',
                            '    printN(n)',
                            'endp'
                        ])).testData;

                    assert.deepEqual(testData.messages, [233, 768, 78, 268]);
                });
            }
        );
    }
);