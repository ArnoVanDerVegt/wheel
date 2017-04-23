var assert = require('assert');

var wheel             = require('../js/utils/base.js').wheel;
var compilerTestUtils = require('./compilerTestUtils.js');

describe(
    'Test proc',
    function() {
        describe(
            'Call a procedure',
            function() {
                it('Should call a procedure', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'proc test()',
                            '    printN(89)',
                            'endp',
                            '',
                            'proc main()',
                            '   test()',
                            'endp'
                        ])).testData;

                    assert.deepEqual(testData.messages, [89]);
                });

                it('Should call a global procedure pointer', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'proc ptr',
                            '',
                            'proc test()',
                            '    printN(12)',
                            'endp',
                            '',
                            'proc main()',
                            '   ptr = test',
                            '   ptr()',
                            'endp'
                        ])).testData;

                    assert.deepEqual(testData.messages, [12]);
                });

                it('Should call a local procedure pointer', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'proc test()',
                            '    printN(12)',
                            'endp',
                            '',
                            'proc main()',
                            '   proc ptr',
                            '   ptr = test',
                            '   ptr()',
                            'endp'
                        ])).testData;

                    assert.deepEqual(testData.messages, [12]);
                });

                it('Should call a struct procedure pointer', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'proc test()',
                            '    printN(59)',
                            'endp',
                            '',
                            'struct TestStruct',
                            '    proc p',
                            'ends',
                            '',
                            'TestStruct testStruct',
                            '',
                            'proc main()',
                            '   testStruct.p = test',
                            '   testStruct.p()',
                            'endp'
                        ])).testData;

                    assert.deepEqual(testData.messages, [59]);
                });

                it('Should call a struct procedure pointer with offset', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'proc test()',
                            '    printN(97)',
                            'endp',
                            '',
                            'struct TestStruct',
                            '    number n',
                            '    proc p',
                            'ends',
                            '',
                            'TestStruct testStruct',
                            '',
                            'proc main()',
                            '   testStruct.p = test',
                            '   testStruct.p()',
                            'endp'
                        ])).testData;

                    assert.deepEqual(testData.messages, [97]);
                });
            }
        );

        describe(
            'Call a with parameters',
            function() {
                it('Should call a procedure with number parameters', function() {
                    var ints     = compilerTestUtils.randomInts(3);
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'proc printPoint(number x, number y, number z)',
                            '    printS("Point:")',
                            '    printN(x)',
                            '    printN(y)',
                            '    printN(z)',
                            'endp',
                            '',
                            'proc main()',
                            '    printPoint(' + ints.join(',') + ')',
                            'endp',
                        ])).testData;

                    assert.deepEqual(testData.messages, ['Point:', ints[0], ints[1], ints[2]]);
                });

                it('Should call a procedure with a struct parameter', function() {
                    var ints     = compilerTestUtils.randomInts(3);
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'struct Point',
                            '    number x',
                            '    number y',
                            '    number z',
                            'ends',
                            '',
                            'Point p',
                            '',
                            'proc printPoint(Point point)',
                            '    printS("Point:")',
                            '    printN(point.x)',
                            '    printN(point.y)',
                            '    printN(point.z)',
                            'endp',
                            '',
                            'proc main()',
                            '    p.x = ' + ints[0],
                            '    p.y = ' + ints[1],
                            '    p.z = ' + ints[2],
                            '    printPoint(p)',
                            'endp'
                        ])).testData;

                    assert.deepEqual(testData.messages, ['Point:', ints[0], ints[1], ints[2]]);
                });

                it('Should call a procedure with a dereferenced local pointer struct parameter', function() {
                    var ints     = compilerTestUtils.randomInts(3);
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'struct Point',
                            '    number x, y, z',
                            'ends',
                            '',
                            'Point point',
                            '',
                            'proc printPoint(Point pt)',
                            '    printN(pt.x)',
                            '    printN(pt.y)',
                            '    printN(pt.z)',
                            'endp',
                            '',
                            'proc main()',
                            '    point.x = ' + ints[0],
                            '    point.y = ' + ints[1],
                            '    point.z = ' + ints[2],
                            '    Point *p',
                            '    p = &point',
                            '    printPoint(*p)',
                            'endp'
                        ])).testData;

                    assert.deepEqual(testData.messages, ints);
                });

                it('Should call a procedure with a dereferenced global pointer struct parameter', function() {
                    var ints     = compilerTestUtils.randomInts(3);
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'struct Point',
                            '    number x, y, z',
                            'ends',
                            '',
                            'Point point',
                            'Point *p',
                            '',
                            'proc printPoint(Point pt)',
                            '    printN(pt.x)',
                            '    printN(pt.y)',
                            '    printN(pt.z)',
                            'endp',
                            '',
                            'proc main()',
                            '    point.x = ' + ints[0],
                            '    point.y = ' + ints[1],
                            '    point.z = ' + ints[2],
                            '    p = &point',
                            '    printPoint(*p)',
                            'endp'
                        ])).testData;

                    assert.deepEqual(testData.messages, ints);
                });

                it('Should call a procedure with a local address parameter', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'proc testParam(number *n)',
                            '    n = 13',
                            'endp',
                            '',
                            'proc main()',
                            '    number l',
                            '    testParam(&l)',
                            '    printN(l)',
                            'endp'
                        ])).testData;

                    assert.deepEqual(testData.messages, [13]);
                });
            }
        );

        describe(
            'Return values',
            function() {
                it('Should return a constant number', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'proc one()',
                            '    return 1',
                            'endp',
                            '',
                            'proc main()',
                            '    number x',
                            '    x = one()',
                            '',
                            '    printN(x)',
                            'endp'
                        ])).testData;

                    assert.deepEqual(testData.messages, [1]);
                });

                it('Should return a multiplied parameter number', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'proc timesTwo(number n)',
                            '    n *= 2',
                            '    return n',
                            'endp',
                            '',
                            'proc main()',
                            '    number x',
                            '    x = timesTwo(13)',
                            '',
                            '    printN(x)',
                            'endp'
                        ])).testData;

                    assert.deepEqual(testData.messages, [26]);
                });

                it('Should call multiple functions, check local stack after return', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'proc plusThree(number n)',
                            '    n += 3',
                            '    return n',
                            'endp',
                            '',
                            'proc timesTwoPlusThree(number n)',
                            '    n *= 2',
                            '    n = plusThree(n)',
                            '    return n',
                            'endp',
                            '',
                            'proc main()',
                            '    number x',
                            '    number y',
                            '    y = 371',
                            '    x = timesTwoPlusThree(6)',
                            '',
                            '    printN(x)',
                            '    printN(y)',
                            'endp'
                        ])).testData;

                    assert.deepEqual(testData.messages, [15, 371]);
                });

                it('Should multiply with return value', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'proc five()',
                            '    return 5',
                            'endp',
                            '',
                            'proc main()',
                            '    number x',
                            '    x = 3',
                            '    x *= five()',
                            '',
                            '    printN(x)',
                            'endp'
                        ])).testData;

                    assert.deepEqual(testData.messages, [15]);
                });
            }
        );

        describe(
            'Call procedure with expression parameter',
            function() {
                it('Should call with expression param', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'proc main()',
                            '    number x = 2',
                            '',
                            '    printN(x * 3)',
                            'endp'
                        ])).testData;

                    assert.deepEqual(testData.messages, [6]);
                });

                it('Should call with array index param', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'proc main()',
                            '    number x[4]',
                            '',
                            '    x[1] = 2366',
                            '',
                            '    printN(x[1])',
                            'endp'
                        ])).testData;

                    assert.deepEqual(testData.messages, [2366]);
                });

                it('Should call with two array index params', function() {
                    var ints     = compilerTestUtils.randomInts(2);
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'proc test(number x, number y)',
                            '    printN(x)',
                            '    printN(y)',
                            'endp',
                            '',
                            'proc main()',
                            '    number x[4]',
                            '',
                            '    x[2] = ' + ints[1],
                            '    x[1] = ' + ints[0],
                            '',
                            '    test(x[1], x[2])',
                            'endp'
                        ])).testData;

                    assert.deepEqual(testData.messages, ints);
                });

                it('Should call with array and expression', function() {
                    var ints     = compilerTestUtils.randomInts(2);
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'proc test(number x, number y)',
                            '    printN(x)',
                            '    printN(y)',
                            'endp',
                            '',
                            'proc main()',
                            '    number x[4]',
                            '',
                            '    x[2] = ' + ints[1],
                            '    x[1] = ' + ints[0],
                            '',
                            '    test(x[1], x[2] * 3)',
                            'endp'
                        ])).testData;

                    assert.deepEqual(testData.messages, [ints[0], ints[1] * 3]);
                });
            }
        );

        describe(
            'Call procedure with pointer param',
            function() {
                it('Should call with global pointer param', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'number *x',
                            'number n',
                            '',
                            'proc main()',
                            '    x = &n',
                            '    x = 23',
                            '    printN(x)',
                            'endp'
                        ])).testData;

                    assert.deepEqual(testData.messages, [23]);
                });

                it('Should call with local pointer param', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'proc main()',
                            '    number *x',
                            '    number n',
                            '    x = &n',
                            '    x = 13',
                            '',
                            '    printN(x)',
                            'endp'
                        ])).testData;

                    assert.deepEqual(testData.messages, [13]);
                });
            }
        );
    }
);

