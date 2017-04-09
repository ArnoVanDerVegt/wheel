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
                            '    struct PrintNumber',
                            '        number n',
                            '    ends',
                            '    PrintNumber printNumber',
                            '    set      printNumber.n,n',
                            '    addr     printNumber',
                            '    module   0,0',
                            'endp',
                            '',
                            'proc main()',
                            '   number a',
                            '   set a, 0',
                            'loop:',
                            '   printN(1)',
                            '   add a, 1',
                            '   cmp a, 3',
                            '   jl loop',
                            'endp'
                        ]).testData;

                    assert.deepEqual(testData.messages, [1, 1, 1]);
                });

                it('Should output 3 locals', function() {
                    var testData = compilerTestUtils.compileAndRun([
                            'proc printN(number n)',
                            '    struct PrintNumber',
                            '        number n',
                            '    ends',
                            '    PrintNumber printNumber',
                            '    set      printNumber.n,n',
                            '    addr     printNumber',
                            '    module   0,0',
                            'endp',
                            '',
                            'proc main()',
                            '   number a',
                            '   set a, 7',
                            'loop:',
                            '   add a, 1',
                            '   printN(a)',
                            '   cmp a, 10',
                            '   jl loop',
                            'endp'
                        ]).testData;

                    assert.deepEqual(testData.messages, [8, 9, 10]);
                });
            }
        );
    }
);