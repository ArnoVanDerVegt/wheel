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
    'Test proc',
    function() {
        describe(
            'Call a procedure',
            function () {
                it('Should call a procedure', function() {
                    var testData = compilerTestUtils.compileAndRun(standardLines.concat([
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
                    var testData = compilerTestUtils.compileAndRun(standardLines.concat([
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
                    var testData = compilerTestUtils.compileAndRun(standardLines.concat([
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
                    var testData = compilerTestUtils.compileAndRun(standardLines.concat([
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
                    var testData = compilerTestUtils.compileAndRun(standardLines.concat([
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
                    var testData = compilerTestUtils.compileAndRun(standardLines.concat([
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
                    var testData = compilerTestUtils.compileAndRun(standardLines.concat([
                            'struct Point',
                            '    number x',
                            '    number y',
                            '    number z',
                            'ends',
                            '',
                            'Point point',
                            '',
                            'proc printPoint(Point point)',
                            '    printS("Point:")',
                            '    printN(point.x)',
                            '    printN(point.y)',
                            '    printN(point.z)',
                            'endp',
                            '',
                            'proc main()',
                            '    set point.x, 1656',
                            '    set point.y, 98',
                            '    set point.z, 75',
                            '    printPoint(point)',
                            'endp'
                        ])).testData;

                    assert.deepStrictEqual(testData.messages, ['Point:', 1656, 98, 75]);
                });
            }
        );
    }
);