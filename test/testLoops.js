var assert = require('assert');

var wheel             = require('../js/utils/base.js').wheel;
var compilerTestUtils = require('./compilerTestUtils.js');

describe(
    'Test loops',
    function() {
        describe(
            'Test for',
            function() {
                it('Should loop up', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'proc main()',
                            '    number n',
                            '',
                            '    for n = 1 to 10',
                            '        printN(n)',
                            '    end',
                            'end'
                        ])).testData;

                    assert.deepEqual(testData.messages, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
                });

                it('Should loop down', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'proc main()',
                            '    number n',
                            '',
                            '    for n = 10 downto 1',
                            '        printN(n)',
                            '    end',
                            'end'
                        ])).testData;

                    assert.deepEqual(testData.messages, [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]);
                });
/*
                it('Should loop with expression', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'proc main()',
                            '    number a',
                            '    number b = 5',
                            '',
                            '    for n = 5 to b * 2',
                            '        printN(n)',
                            '    end',
                            'end'
                        ])).testData;

                    assert.deepEqual(testData.messages, [5, 6, 7, 8, 9, 10]);
                });
*/
            }
        );

        describe(
            'Test while',
            function() {
                it('Should repeat while not 0', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'proc main()',
                            '    number n = 10',
                            '',
                            '    while n != 0',
                            '        printN(n)',
                            '        n -= 1',
                            '    end',
                            'end'
                        ])).testData;

                    assert.deepEqual(testData.messages, [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]);
                });

                it('Should repeat with boolean evaluation', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'proc main()',
                            '    number n = 6',
                            '',
                            '    while n',
                            '        printN(n)',
                            '        n -= 2',
                            '    end',
                            'end'
                        ])).testData;

                    assert.deepEqual(testData.messages, [6, 4, 2]);
                });

                it('Should break', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'proc main()',
                            '    number n = 10',
                            '',
                            '    while n',
                            '        printN(n)',
                            '        n -= 1',
                            '        if n < 5',
                            '            break',
                            '        end',
                            '    end',
                            'end'
                        ])).testData;

                    assert.deepEqual(testData.messages, [10, 9, 8, 7, 6, 5]);
                });

                it('Should repeat while (a > 5) and (b > 4)', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'proc main()',
                            '    number a = 15',
                            '    number b = 10',
                            '',
                            '    while (a > 5) and (b > 4)',
                            '        printN(a)',
                            '        printN(b)',
                            '        a -= 2',
                            '        b -= 1',
                            '    end',
                            'end'
                        ])).testData;

                    assert.deepEqual(testData.messages, [15, 10, 13, 9, 11, 8, 9, 7, 7, 6]);
                });
            }
        );

        describe(
            'Test break',
            function() {
                it('Should break for', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'proc main()',
                            '    number n',
                            '',
                            '    for n = 1 to 10',
                            '        if n > 5',
                            '            break',
                            '        end',
                            '        printN(n)',
                            '    end',
                            'end'
                        ])).testData;

                    assert.deepEqual(testData.messages, [1, 2, 3, 4, 5]);
                });

                it('Should break repeat', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'proc main()',
                            '    number n = 0',
                            '',
                            '    repeat',
                            '        if n > 5',
                            '            break',
                            '        end',
                            '        printN(n)',
                            '        n += 1',
                            '    end',
                            'end'
                        ])).testData;

                    assert.deepEqual(testData.messages, [0, 1, 2, 3, 4, 5]);
                });

                it('Should break for', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'proc main()',
                            '    number x, y',
                            '',
                            '    for x = 1 to 10',
                            '        for y = 1 to 10',
                            '            if y > 3',
                            '                break',
                            '            end',
                            '            printN(y)',
                            '        end',
                            '        if x > 3',
                            '            break',
                            '        end',
                            '    end',
                            'end'
                        ])).testData;

                    assert.deepEqual(testData.messages, [1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3]);
                });
            }
        );
    }
);