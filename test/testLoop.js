var assert = require('assert');

var wheel             = require('../js/utils/base.js').wheel;
var compilerTestUtils = require('./compilerTestUtils.js');

describe(
    'Test loop',
    function() {
        describe(
            'Output messages',
            function() {
                it('Should output 3 constant numbers', function() {
                    var testData = compilerTestUtils.compileAndRun([
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
                            'endp',
                            '',
                            'proc main()',
                            '   number a',
                            '   a = 0',
                            '   asm',
                            'loop:',
                            '   end',
                            '   printN(1)',
                            '   a += 1',
                            '   asm',
                            '       cmp a, 3',
                            '       jl loop',
                            '   end',
                            'endp'
                        ]).testData;

                    assert.deepEqual(testData.messages, [1, 1, 1]);
                });

                it('Should output 3 locals', function() {
                    var testData = compilerTestUtils.compileAndRun([
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
                            'endp',
                            '',
                            'proc main()',
                            '    number a',
                            '    a = 7',
                            '    asm',
                            'loop:',
                            '    end',
                            '    a += 1',
                            '    printN(a)',
                            '    asm',
                            '        cmp a, 10',
                            '        jl loop',
                            '    end',
                            'endp'
                        ]).testData;

                    assert.deepEqual(testData.messages, [8, 9, 10]);
                });
            }
        );
    }
);