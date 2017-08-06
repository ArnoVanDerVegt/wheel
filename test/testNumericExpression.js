var assert            = require('assert');
var wheel             = require('../js/utils/base.js').wheel;
var compilerTestUtils = require('./compilerTestUtils.js');
var printN            = [
        'proc printN(number n)',
        '    record PrintNumber',
        '        number n',
        '    endr',
        '    PrintNumber printNumber',
        '    printNumber.n = n',
        '    asm',
        '        addr     printNumber',
        '        module   0,0',
        '    end',
        'endp'
    ];

describe(
    'Test numeric expression parser',
    function() {
        it('Should use one operator', function() {
            var testData = compilerTestUtils.compileAndRun(
                    printN.concat([
                        'proc main()',
                        '    number a',
                        '    number b',
                        '',
                        '    a = 2',
                        '    b = a * 4',
                        '',
                        '    printN(b)',
                        'endp'
                    ])
                ).testData;

            assert.deepEqual(testData.messages, [8]);
        });

        it('Should use two operators', function() {
            var testData = compilerTestUtils.compileAndRun(
                    printN.concat([
                        'proc main()',
                        '    number a',
                        '    number b',
                        '',
                        '    a = 2',
                        '    b = a * 4 + 3',
                        '',
                        '    printN(b)',
                        'endp'
                    ])
                ).testData;

            assert.deepEqual(testData.messages, [11]);
        });

        it('Should use two operators with parentheses', function() {
            var testData = compilerTestUtils.compileAndRun(
                    printN.concat([
                        'proc main()',
                        '    number a',
                        '    number b',
                        '',
                        '    a = 2',
                        '    b = a * (4 + 3)',
                        '',
                        '    printN(b)',
                        'endp'
                    ])
                ).testData;

            assert.deepEqual(testData.messages, [14]);
        });

        it('Should use two parentheses blocks', function() {
            var testData = compilerTestUtils.compileAndRun(
                    printN.concat([
                        'proc main()',
                        '    number a',
                        '    number b',
                        '',
                        '    a = 2',
                        '    b = (a * 6) * (4 + 3)',
                        '',
                        '    printN(b)',
                        'endp'
                    ])
                ).testData;

            assert.deepEqual(testData.messages, [84]);
        });
    }
);
