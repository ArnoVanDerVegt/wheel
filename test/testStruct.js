var assert = require('assert');

var wheel             = require('../js/utils/base.js').wheel;
var compilerTestUtils = require('./compilerTestUtils.js');

describe(
    'Test struct',
    function() {
        describe(
            'Declare struct',
            function() {
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
                    var ints     = compilerTestUtils.randomInts(3);
                    var testData = compilerTestUtils.compileAndRun([
                            'struct S',
                            '    number x, y, z',
                            'ends',
                            'S s',
                            'proc main()',
                            '    s.x = ' + ints[0],
                            '    s.y = ' + ints[1],
                            '    s.z = ' + ints[2],
                            'endp'
                        ]).testData;

                    assert.deepEqual(
                        testData.vm.getVMData().getData(),
                        [
                            9,       // REG_OFFSET_STACK
                            9,       // REG_OFFSET_SRC
                            65535,   // REG_OFFSET_DEST
                            65536,   // REG_OFFSET_CODE
                            0,       // REG_RETURN
                            0,       // REG_FLAGS
                            ints[0], // global struct offset
                            ints[1],
                            ints[2],
                            9,       // stack pointer
                            65535,   // return code offset
                            6,
                            7,
                            8
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
                    var ints     = compilerTestUtils.randomInts(3);
                    var testData = compilerTestUtils.compileAndRun([
                            'struct S',
                            '    number x, y, z',
                            'ends',
                            'proc main()',
                            '   S s',
                            '   s.x = ' + ints[0],
                            '   s.y = ' + ints[1],
                            '   s.z = ' + ints[2],
                            'endp'
                        ]).testData;

                    assert.deepEqual(
                        testData.vm.getVMData().getData(),
                        [
                            6,      // REG_OFFSET_STACK
                            6,      // REG_OFFSET_SRC
                            65535,  // REG_OFFSET_DEST
                            65536,  // REG_OFFSET_CODE
                            0,      // REG_RETURN
                            0,      // REG_FLAGS
                            6,      // stack pointer
                            65535,  // return code offset
                            ints[0],
                            ints[1],
                            ints[2],
                            8,
                            9,
                            10
                        ]
                    );
                });
            }
        );

        describe(
            'Structs and pointers',
            function() {
                it('Should set values of a struct pointer', function() {
                    var ints     = compilerTestUtils.randomInts(2);
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
                            '    pp.x = ' + ints[0],
                            '    pp.y = ' + ints[1],
                            '',
                            '    printN(p.x)',
                            '    printN(p.y)',
                            'endp'
                        ])).testData;

                    assert.deepEqual(testData.messages, ints);
                });

                it('Should get derefferenced local/local struct pointer values', function() {
                    var ints     = compilerTestUtils.randomInts(2);
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'struct Point',
                            '    number x',
                            '    number y',
                            'ends',
                            '',
                            'proc main()',
                                'Point p1',
                                'p1.x = ' + ints[1],
                                'p1.y = ' + ints[0],
                                'Point *p2',
                                'set p2, &p1',
                                '',
                                'number n',
                                'n = p2.y',
                                'printN(n)',
                                'n = p2.x',
                                'printN(n)',
                            'endp'
                        ])).testData;

                    assert.deepEqual(testData.messages, ints);
                });

                it('Should get derefferenced local/global struct pointer values', function() {
                    var ints     = compilerTestUtils.randomInts(2);
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
                                'set p1.x, ' + ints[1],
                                'set p1.y, ' + ints[0],
                                'set p2, &p1',
                                '',
                                'number n',
                                'set n, *p2.y',
                                'printN(n)',
                                'set n, *p2.x',
                                'printN(n)',
                            'endp'
                        ])).testData;

                    assert.deepEqual(testData.messages, ints);
                });

                it('Should get derefferenced global/global struct pointer values', function() {
                    var ints     = compilerTestUtils.randomInts(2);
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
                                'set p1.x, ' + ints[1],
                                'set p1.y, ' + ints[0],
                                'set p2, &p1',
                                '',
                                'number n',
                                'set n, *p2.y',
                                'printN(n)',
                                'set n, *p2.x',
                                'printN(n)',
                            'endp'
                        ])).testData;

                    assert.deepEqual(testData.messages, ints);
                });

                it('Should pass a struct pointer to a procedure', function() {
                    var ints     = compilerTestUtils.randomInts(2);
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'struct Point',
                            '    number x',
                            '    number y',
                            'ends',
                            '',
                            'proc testPointer(Point *p)',
                            '    set *p.x, ' + ints[0],
                            '    set *p.y, ' + ints[1],
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

                    assert.deepEqual(testData.messages, ints);
                });
            }
        );

        describe(
            'Nested structs',
            function() {
                it('Should nest a struct', function() {
                    var ints     = compilerTestUtils.randomInts(4);
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
                            '    t.p1.x = ' + ints[0],
                            '    t.p1.y = ' + ints[1],
                            '    t.p2.x = ' + ints[2],
                            '    t.p2.y = ' + ints[3],
                            '',
                            '    number n',
                            '',
                            '    n = t.p1.x',
                            '    printN(n)',
                            '    n = t.p1.y',
                            '    printN(n)',
                            '    n = t.p2.x',
                            '    printN(n)',
                            '    n = t.p2.y',
                            '    printN(n)',
                            'endp'
                        ])).testData;

                    assert.deepEqual(testData.messages, ints);
                });
            }
        );

        describe(
            'Struct assignment',
            function() {
                it('Should assign a local struct to a local struct', function() {
                    var ints     = compilerTestUtils.randomInts(2);
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'struct A',
                            '    number x',
                            '    number y',
                            'end',
                            '',
                            'proc main()',
                            '    A b',
                            '    A c',
                            '    c.x = ' + ints[0],
                            '    c.y = ' + ints[1],
                            '    b = c',
                            '    printN(b.x)',
                            '    printN(b.y)',
                            'endp'
                        ])).testData;

                    assert.deepEqual(testData.messages, ints);
                });

                it('Should assign a local struct with array field to a local struct', function() {
                    var ints     = compilerTestUtils.randomInts(3);
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'struct A',
                            '    number x',
                            '    number y[2]',
                            'end',
                            '',
                            'proc main()',
                            '    A b',
                            '    A c',
                            '    c.x = ' + ints[0],
                            '    c.y[0] = ' + ints[2],
                            '    c.y[1] = ' + ints[1],
                            '    b = c',
                            '    printN(b.x)',
                            '    printN(b.y[1])',
                            '    printN(b.y[0])',
                            'endp'
                        ])).testData;

                    assert.deepEqual(testData.messages, ints);
                });

                it('Should assign local array struct fields', function() {
                    var ints     = compilerTestUtils.randomInts(4);
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'struct A',
                            '    number x',
                            '    number y',
                            'end',
                            '',
                            'proc main()',
                            '    A c[2]',
                            '    c[0].x = ' + ints[0],
                            '    c[0].y = ' + ints[1],
                            '    c[1].x = ' + ints[2],
                            '    c[1].y = ' + ints[3],
                            '',
                            '    number n',
                            '    n = c[0].x',
                            '    printN(n)',
                            '    n = c[0].y',
                            '    printN(n)',
                            '    n = c[1].x',
                            '    printN(n)',
                            '    n = c[1].y',
                            '    printN(n)',
                            'endp'
                        ])).testData;

                    assert.deepEqual(testData.messages, ints);
                });

                it('Should use local array struct field params', function() {
                    var ints     = compilerTestUtils.randomInts(4);
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'struct A',
                            '    number x',
                            '    number y',
                            'end',
                            '',
                            'proc main()',
                            '    A c[2]',
                            '    c[0].x = ' + ints[0],
                            '    c[0].y = ' + ints[1],
                            '    c[1].x = ' + ints[2],
                            '    c[1].y = ' + ints[3],
                            '    printN(c[0].x)',
                            '    printN(c[0].y)',
                            '    printN(c[1].x)',
                            '    printN(c[1].y)',
                            'endp'
                        ])).testData;

                    assert.deepEqual(testData.messages, ints);
                });

                it('Should assign local array struct with array fields', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'struct A',
                            '    number x[2]',
                            '    number y[2]',
                            'end',
                            '',
                            'proc main()',
                            '    A c[2]',
                            '    c[0].x[0] = 67',
                            '    c[0].y[1] = 678',
                            '    c[1].x[1] = 43',
                            '    c[1].y[0] = 1614',
                            '',
                            '    number n',
                            '    n = c[0].x[0]',
                            '    printN(n)',
                            '    n = c[0].y[1]',
                            '    printN(n)',
                            '    n = c[1].x[1]',
                            '    printN(n)',
                            '    n = c[1].y[0]',
                            '    printN(n)',
                            'endp'
                        ])).testData;

                    assert.deepEqual(testData.messages, [67, 678, 43, 1614]);
                });

                it('Should assign local array struct with array field params', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'struct A',
                            '    number x[2]',
                            '    number y[2]',
                            'end',
                            '',
                            'proc main()',
                            '    A c[2]',
                            '    c[0].x[0] = 78',
                            '    c[0].y[1] = 219',
                            '    c[1].x[1] = 494',
                            '    c[1].y[0] = 2232',
                            '',
                            '    printN(c[0].x[0])',
                            '    printN(c[0].y[1])',
                            '    printN(c[1].x[1])',
                            '    printN(c[1].y[0])',
                            'endp'
                        ])).testData;

                    assert.deepEqual(testData.messages, [78, 219, 494, 2232]);
                });

                it('Should assign local array struct with array, array fields', function() {
                    var ints     = compilerTestUtils.randomInts(4);
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'struct A',
                            '    number x',
                            '    number y',
                            'end',
                            '',
                            'struct B',
                            '    A a[2]',
                            'end',
                            '',
                            'proc main()',
                            '    B c[2]',
                            '    c[0].a[0].x = ' + ints[2],
                            '    c[0].a[0].y = ' + ints[3],
                            '    c[1].a[1].x = ' + ints[0],
                            '    c[1].a[1].y = ' + ints[1],
                            '',
                            '    printN(c[1].a[1].x)',
                            '    printN(c[1].a[1].y)',
                            '    printN(c[0].a[0].x)',
                            '    printN(c[0].a[0].y)',
                            'endp'
                        ])).testData;

                    assert.deepEqual(testData.messages, ints);
                });
            }
        );

        describe(
            'Composite struct pointers',
            function() {
                it('Should print pointer struct fields', function() {
                    var ints     = compilerTestUtils.randomInts(2);
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'struct A',
                            '    number x',
                            '    number y',
                            'end',
                            '',
                            'proc main()',
                            '    A *ptr',
                            '    A a',
                            '    ptr = &a',
                            '    a.x = ' + ints[0],
                            '    a.y = ' + ints[1],
                            '    printN(ptr.x)',
                            '    printN(ptr.y)',
                            'endp'
                        ])).testData;

                    assert.deepEqual(testData.messages, ints);
                });

                it('Should assign a local struct to a local struct', function() {
                    var ints     = compilerTestUtils.randomInts(2);
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'struct A',
                            '    number x',
                            '    number y',
                            'end',
                            '',
                            'struct B',
                            '    A *a',
                            'end',
                            '',
                            'proc main()',
                            '    A a',
                            '    B b',
                            '    b.a = &a',
                            '    a.x = ' + ints[0],
                            '    a.y = ' + ints[1],
                            '    printN(b.a.x)',
                            '    printN(b.a.y)',
                            'endp'
                        ])).testData;

                    assert.deepEqual(testData.messages, ints);
                });
            }
        );
    }
);