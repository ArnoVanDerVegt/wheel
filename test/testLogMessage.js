var assert = require('assert');

var wheel             = require('../js/utils/base.js').wheel;
var compilerTestUtils = require('./compilerTestUtils.js');

describe(
    'Test log message',
    function() {
        describe(
            'Output a message',
            function () {
                it('Should output a number message', function() {
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
                            '   printN(17)',
                            'endp'
                        ]).testData;

                    assert.deepEqual(testData.messages, [17]);
                });

                it('Should output a string message', function() {
                    var testData = compilerTestUtils.compileAndRun([
                            'proc printS(string s)',
                            '    struct PrintString',
                            '        string s',
                            '    ends',
                            '    PrintString printString',
                            '    set      printString.s,s',
                            '    addr     printString',
                            '    module   0,1',
                            'endp',
                            '',
                            'proc main()',
                            '   printS("Hello world")',
                            'endp'
                        ]).testData;

                    assert.deepEqual(testData.messages, ['Hello world']);
                });
            }
        );
    }
);