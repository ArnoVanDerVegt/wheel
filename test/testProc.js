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
                            'proc test()',
                            '    printN(89)',
                            'endp',
                            '',
                            'proc main()',
                            '   test()',
                            'endp'
                        ]).testData;

                    assert.deepStrictEqual(testData.messages, [89]);
                });

                it('Should call a global procedure pointer', function() {
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
                        ]).testData;

                    assert.deepStrictEqual(testData.messages, [12]);
                });

                it('Should call a local procedure pointer', function() {
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
                            'proc test()',
                            '    printN(12)',
                            'endp',
                            '',
                            'proc main()',
                            '   proc ptr',
                            '   set ptr, test',
                            '   ptr()',
                            'endp'
                        ]).testData;

                    assert.deepStrictEqual(testData.messages, [12]);
                });
            }
        );
    }
);