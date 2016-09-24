var assert = require('assert');

var wheel             = require('../public/js/utils/base.js').wheel;
var compilerTestUtils = require('./compilerTestUtils.js');

describe(
    'Test proc',
    function() {
        describe(
            'Call a procedure',
            function () {
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

                    assert.deepStrictEqual(testData.messages, [89]);
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
                            '   set ptr, test',
                            '   ptr()',
                            'endp'
                        ])).testData;

                    assert.deepStrictEqual(testData.messages, [12]);
                });

                it('Should call a local procedure pointer', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'proc test()',
                            '    printN(12)',
                            'endp',
                            '',
                            'proc main()',
                            '   proc ptr',
                            '   set ptr, test',
                            '   ptr()',
                            'endp'
                        ])).testData;

                    assert.deepStrictEqual(testData.messages, [12]);
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
                            '   set testStruct.p, test',
                            '   testStruct.p()',
                            'endp'
                        ])).testData;

                    assert.deepStrictEqual(testData.messages, [59]);
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
                            '   set testStruct.p, test',
                            '   testStruct.p()',
                            'endp'
                        ])).testData;

                    assert.deepStrictEqual(testData.messages, [97]);
                });
            }
        );

        describe(
            'Call a with parameters',
            function () {
                it('Should call a procedure with number parameters', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'proc printPoint(number x, number y, number z)',
                            '    printS("Point:")',
                            '    printN(x)',
                            '    printN(y)',
                            '    printN(z)',
                            'endp',
                            '',
                            'proc main()',
                            '    printPoint(561, 520, 974)',
                            'endp',
                        ])).testData;

                    assert.deepStrictEqual(testData.messages, ['Point:', 561, 520, 974]);
                });

                it('Should call a procedure with a struct parameter', function() {
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
                            '    set p.x, 1656',
                            '    set p.y, 98',
                            '    set p.z, 75',
                            '    printPoint(p)',
                            'endp'
                        ])).testData;

                    assert.deepStrictEqual(testData.messages, ['Point:', 1656, 98, 75]);
                });

                it('Should call a procedure with an array parameter, read local', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'number p[3]',
                            '',
                            'proc printPoint(number point[3])',
                            '    printS("Point:")',
                            '',
                            '    number n',
                            '',
                            '    arrayr n, point, 0',
                            '    printN(n)',
                            '    arrayr n, point, 1',
                            '    printN(n)',
                            '    arrayr n, point, 2',
                            '    printN(n)',
                            'endp',
                            '',
                            'proc main()',
                            '    arrayw  p, 0, 3975',
                            '    arrayw  p, 1, 296',
                            '    arrayw  p, 2, 7013',
                            '    printPoint(p)',
                            'endp'
                        ])).testData;

                    assert.deepStrictEqual(testData.messages, ['Point:', 3975, 296, 7013]);
                });

                it('Should call a procedure with an array parameter, read global', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'number p[3]',
                            'number n',
                            '',
                            'proc printPoint(number point[3])',
                            '    printS("Point:")',
                            '',
                            '    arrayr n, point, 0',
                            '    printN(n)',
                            '    arrayr n, point, 1',
                            '    printN(n)',
                            '    arrayr n, point, 2',
                            '    printN(n)',
                            'endp',
                            '',
                            'proc main()',
                            '    arrayw  p, 0, 3975',
                            '    arrayw  p, 1, 296',
                            '    arrayw  p, 2, 7013',
                            '    printPoint(p)',
                            'endp'
                        ])).testData;

                    assert.deepStrictEqual(testData.messages, ['Point:', 3975, 296, 7013]);
                });

                it('Should call a procedure with a pointer to array parameter', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'struct Point',
                            '    number x',
                            '    number y',
                            'ends',
                            '',
                            'Point pp[10]',
                            '',
                            'proc testPointer(Point *points[0])',
                            '    Point point',
                            '    arrayr point, points, 1',
                            '    printN(point.x)',
                            '    printN(point.y)',
                            'endp',
                            '',
                            'proc main()',
                            '    Point p',
                            '    set p.x, 32342',
                            '    set p.y, 6757',
                            '    arrayw   pp, 1, p',
                            '',
                            '    testPointer(&pp)',
                            'endp'
                        ])).testData;

                    assert.deepStrictEqual(testData.messages, [32342, 6757]);
                });

                it('Should call a procedure and write to a pointer of to global array', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'struct Point',
                            '    number x',
                            '    number y',
                            'ends',
                            '',
                            'Point points[10]',
                            '',
                            'proc testPointer(Point *points[0])',
                            '    Point p',
                            '    set p.x, 678',
                            '    set p.y, 534',
                            '    arrayw *points, 1, &p',
                            'endp',
                            '',
                            'proc main()',
                            '    testPointer(&points)',
                            '',
                            '    Point point',
                            '    arrayr point, points, 1',
                            '    printN(point.x)',
                            '    printN(point.y)',
                            'endp'
                        ])).testData;

                    assert.deepStrictEqual(testData.messages, [678, 534]);
                });

                it('Should call a procedure and write to a pointer of to local array', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'struct Point',
                            '    number x',
                            '    number y',
                            'ends',
                            '',
                            'proc testPointer(Point *points[0])',
                            '    Point p',
                            '    set p.x, 6852',
                            '    set p.y, -93',
                            '    arrayw *points, 1, p',
                            'endp',
                            '',
                            'proc main()',
                            '    Point points[10]',
                            '',
                            '    testPointer(&points)',
                            '',
                            '    Point point',
                            '    arrayr point, points, 1',
                            '    printN(point.x)',
                            '    printN(point.y)',
                            'endp'
                        ])).testData;

                    assert.deepStrictEqual(testData.messages, [6852, -93]);
                });

                it('Should call a procedure with a dereferenced local pointer struct parameter', function() {
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
                            '    set point.x, -5',
                            '    set point.y, 9',
                            '    set point.z, -3',
                            '    Point *p',
                            '    set p, &point',
                            '    printPoint(*p)',
                            'endp'
                        ])).testData;

                    assert.deepStrictEqual(testData.messages, [-5, 9, -3]);
                });

                it('Should call a procedure with a dereferenced global pointer struct parameter', function() {
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
                            '    set point.x, 338',
                            '    set point.y, -782',
                            '    set point.z, 24',
                            '    set p, &point',
                            '    printPoint(*p)',
                            'endp'
                        ])).testData;

                    assert.deepStrictEqual(testData.messages, [338, -782, 24]);
                });

                it('Should call a procedure with a local address parameter', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'proc testParam(number *n)',
                            '    set *n, 13',
                            'endp',
                            '',
                            'proc main()',
                            '    number l',
                            '    testParam(&l)',
                            '    printN(l)',
                            'endp'
                        ])).testData;

                    assert.deepStrictEqual(testData.messages, [13]);
                });
            }
        );

        describe(
            'Return values',
            function () {
                it('Should return a constant number', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'proc one()',
                            '    return 1',
                            'endp',
                            '',
                            'proc main()',
                            '    number x',
                            '    set x, one()',
                            '',
                            '    printN(x)',
                            'endp'
                        ])).testData;

                    assert.deepStrictEqual(testData.messages, [1]);
                });

                it('Should return a multiplied parameter number', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'proc timesTwo(number n)',
                            '    mul n, 2',
                            '    return n',
                            'endp',
                            '',
                            'proc main()',
                            '    number x',
                            '    set x, timesTwo(13)',
                            '',
                            '    printN(x)',
                            'endp'
                        ])).testData;

                    assert.deepStrictEqual(testData.messages, [26]);
                });

                it('Should call multiple functions, check local stack after return', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'proc plusThree(number n)',
                            '    add n, 3',
                            '    return n',
                            'endp',
                            '',
                            'proc timesTwoPlusThree(number n)',
                            '    mul n, 2',
                            '    set n, plusThree(n)',
                            '    return n',
                            'endp',
                            '',
                            'proc main()',
                            '    number x',
                            '    number y',
                            '    set y, 371',
                            '    set x, timesTwoPlusThree(6)',
                            '',
                            '    printN(x)',
                            '    printN(y)',
                            'endp'
                        ])).testData;

                    assert.deepStrictEqual(testData.messages, [15, 371]);
                });
            }
        );

        describe(
            'Call procedure with expression parameter',
            function () {
                it('Should call with expression param', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'proc main()',
                            '    number x = 2',
                            '',
                            '    printN(x * 3)',
                            'endp'
                        ])).testData;

                    assert.deepStrictEqual(testData.messages, [6]);
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

                    assert.deepStrictEqual(testData.messages, [2366]);
                });

                it('Should call with to array index params', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'proc test(number x, number y)',
                            '    printN(x)',
                            '    printN(y)',
                            'endp',
                            '',
                            'proc main()',
                            '    number x[4]',
                            '',
                            '    x[2] = 89',
                            '    x[1] = 569',
                            '',
                            '    test(x[1], x[2])',
                            'endp'
                        ])).testData;

                    assert.deepStrictEqual(testData.messages, [569, 89]);
                });
            }
        );
    }
);

