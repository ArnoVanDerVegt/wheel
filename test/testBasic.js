var assert = require('assert');

var wheel             = require('../public/js/utils/base.js').wheel;
var compilerTestUtils = require('./compilerTestUtils.js');

describe(
    'Test basic',
    function() {
        describe(
            'Test for',
            function () {
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

                    assert.deepStrictEqual(testData.messages, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
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

                    assert.deepStrictEqual(testData.messages, [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]);
                });
            }
        );

        describe(
            'Test if',
            function () {
                it('Should print half of list', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'proc main()',
                            '    number n',
                            '',
                            '    for n = 1 to 10',
                            '        if n <= 5',
                            '            printN(n)',
                            '        end',
                            '    end',
                            'end'
                        ])).testData;

                    assert.deepStrictEqual(testData.messages, [1, 2, 3, 4, 5]);
                });

                it('Should print half two half lists', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'proc main()',
                            '    number n',
                            '',
                            '    for n = 1 to 10',
                            '        if n <= 5',
                            '            printS("-")',
                            '        else',
                            '            printN(n)',
                            '        end',
                            '    end',
                            'end'
                        ])).testData;

                    assert.deepStrictEqual(testData.messages, ['-', '-', '-', '-', '-', 6, 7, 8, 9, 10]);
                });

                it('Should print nest conditions', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'proc main()',
                            '    number n',
                            '',
                            '    for n = 1 to 10',
                            '        if n <= 5',
                            '            if n <= 2',
                            '                printS("-")',
                            '            else',
                            '                printS("/")',
                            '            end',
                            '        else',
                            '            printN(n)',
                            '        end',
                            '    end',
                            'end'
                        ])).testData;

                    assert.deepStrictEqual(testData.messages, ['-', '-', '/', '/', '/', 6, 7, 8, 9, 10]);
                });
            }
        );

        describe(
            'Test operator',
            function () {
                it('Should assign', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'proc main()',
                            '    number n',
                            '',
                            '    n = 13',
                            '',
                            '    printN(n)',
                            'end'
                        ])).testData;

                    assert.deepStrictEqual(testData.messages, [13]);
                });

                it('Should assign, add', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'proc main()',
                            '    number n',
                            '',
                            '    n = 234',
                            '    n += 5',
                            '',
                            '    printN(n)',
                            'end'
                        ])).testData;

                    assert.deepStrictEqual(testData.messages, [239]);
                });

                it('Should assign, subtract', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'proc main()',
                            '    number n',
                            '',
                            '    n = 68',
                            '    n -= 3',
                            '',
                            '    printN(n)',
                            'end'
                        ])).testData;

                    assert.deepStrictEqual(testData.messages, [65]);
                });

                it('Should assign, multiply', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'proc main()',
                            '    number n',
                            '',
                            '    n = 41',
                            '    n *= 5',
                            '',
                            '    printN(n)',
                            'end'
                        ])).testData;

                    assert.deepStrictEqual(testData.messages, [205]);
                });
            }
        );

        describe(
            'Test array',
            function () {
                it('Should write array', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'proc main()',
                            '    number n[3]',
                            '    number i',
                            '',
                            '    n[0] = 74',
                            '    n[1] = 234',
                            '    n[2] = 67',
                            '',
                            '    arrayr i, n, 1',
                            '    printN(i)',
                            '',
                            '    arrayr i, n, 0',
                            '    printN(i)',
                            '',
                            '    arrayr i, n, 2',
                            '    printN(i)',
                            '',
                            'end'
                        ])).testData;

                    assert.deepStrictEqual(testData.messages, [234, 74, 67]);
                });

                it('Should read array', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'proc main()',
                            '    number n[3]',
                            '    number i',
                            '',
                            '    arrayw n, 0, 3454',
                            '    arrayw n, 1, 89',
                            '    arrayw n, 2, 40',
                            '',
                            '    i = n[2]',
                            '    printN(i)',
                            '',
                            '    i = n[0]',
                            '    printN(i)',
                            '',
                            '    i = n[1]',
                            '    printN(i)',
                            '',
                            'end'
                        ])).testData;

                    assert.deepStrictEqual(testData.messages, [40, 3454, 89]);
                });
            }
        );

        describe(
            'Test case',
            function () {
                it('Should select one', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'proc main()',
                            '    number n',
                            '',
                            '    n = 1',
                            '',
                            '    select n',
                            '        case 1:',
                            '            printS("one")',
                            '',
                            '        case 2:',
                            '            printS("two")',
                            '',
                            '        case 3:',
                            '            printS("three")',
                            '',
                            '    end',
                            'end'
                        ])).testData;

                    assert.deepStrictEqual(testData.messages, ['one']);
                });

                it('Should select two', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'proc main()',
                            '    number n',
                            '',
                            '    n = 2',
                            '',
                            '    select n',
                            '        case 1:',
                            '            printS("one")',
                            '',
                            '        case 2:',
                            '            printS("two")',
                            '',
                            '        case 3:',
                            '            printS("three")',
                            '',
                            '    end',
                            'end'
                        ])).testData;

                    assert.deepStrictEqual(testData.messages, ['two']);
                });

                it('Should select three', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'proc main()',
                            '    number n',
                            '',
                            '    n = 3',
                            '',
                            '    select n',
                            '        case 1:',
                            '            printS("one")',
                            '',
                            '        case 2:',
                            '            printS("two")',
                            '',
                            '        case 3:',
                            '            printS("three")',
                            '',
                            '    end',
                            'end'
                        ])).testData;

                    assert.deepStrictEqual(testData.messages, ['three']);
                });

                it('Should nest select', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'proc main()',
                            '    number i',
                            '    number j',
                            '',
                            '    i = 2',
                            '    j = 4',
                            '',
                            '    select i',
                            '        case 1:',
                            '            printS("one")',
                            '',
                            '        case 2:',
                            '            printS("i is two")',
                            '            select j',
                            '                case 4:',
                            '                    printS("j is four")',
                            '',
                            '                case 5:',
                            '                    printS("j is five")',
                            '',
                            '            end',
                            '',
                            '        case 3:',
                            '            printS("three")',
                            '',
                            '    end',
                            'end'
                        ])).testData;

                    assert.deepStrictEqual(testData.messages, ['i is two', 'j is four']);
                });
            }
        );
    }
);