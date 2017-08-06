var assert            = require('assert');
var wheel             = require('../js/utils/base.js').wheel;
var compilerTestUtils = require('./compilerTestUtils.js');

describe(
    'Test boolean expression',
    function() {
        describe(
            'Test if',
            function() {
                it('Should use jump equal', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'proc main()',
                            '    number n = 4',
                            '',
                            '    if n != 5',
                            '        printN(n)',
                            '    end',
                            'end'
                        ])).testData;

                    assert.deepEqual(testData.messages, [4]);
                });

                it('Should use jump equal, with ()', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'proc main()',
                            '    number n = 10',
                            '',
                            '    if (n != 5)',
                            '        printN(n)',
                            '    end',
                            'end'
                        ])).testData;

                    assert.deepEqual(testData.messages, [10]);
                });

                it('Should use jump equal, with ((()))', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'proc main()',
                            '    number n = 10',
                            '',
                            '    if (((n != 5)))',
                            '        printN(n)',
                            '    end',
                            'end'
                        ])).testData;

                    assert.deepEqual(testData.messages, [10]);
                });

                it('Should use jump equal with expression compare', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'proc main()',
                            '    number n = 7',
                            '',
                            '    number a',
                            '    a = n * 3',
                            '    if a == n * 3',
                            '        printN(n * 2)',
                            '    end',
                            'end'
                        ])).testData;

                    assert.deepEqual(testData.messages, [14]);
                });

                it('Should use jump equal with double expression compare', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'proc main()',
                            '    number a',
                            '    number b',
                            '    a = 4',
                            '    b = 6',
                            '    if b * 2 == a * 3',
                            '        printN(a * b * 2)',
                            '    end',
                            'end'
                        ])).testData;

                    assert.deepEqual(testData.messages, [48]);
                });

                it('Should use boolean evaluation', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'proc main()',
                            '    number n = 3',
                            '',
                            '    if n',
                            '        printN(n)',
                            '    end',
                            '    n = 0',
                            '    if ((n))',
                            '        printN(n)',
                            '    else',
                            '        printN(9)',
                            '    end',
                            'end'
                        ])).testData;

                    assert.deepEqual(testData.messages, [3, 9]);
                });

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

                    assert.deepEqual(testData.messages, [1, 2, 3, 4, 5]);
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

                    assert.deepEqual(testData.messages, ['-', '-', '-', '-', '-', 6, 7, 8, 9, 10]);
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

                    assert.deepEqual(testData.messages, ['-', '-', '/', '/', '/', 6, 7, 8, 9, 10]);
                });
            }
        );

        describe(
            'Test if and',
            function() {
                for (var a = 0; a < 2; a++) {
                    for (var b = 0; b < 2; b++) {
                        it('Should evaluate if a and b -> a=' + a + ', b=' + b, function() {
                            var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                                    'proc main()',
                                    '    number a = ' + a,
                                    '    number b = ' + b,
                                    '',
                                    '    if a and b',
                                    '        printS("true")',
                                    '    end',
                                    'end'
                                ])).testData;

                            assert.deepEqual(testData.messages, eval(a + '&&' + b) ? ['true'] : []);
                        });
                    }
                }
            }
        );

        describe(
            'Test if and/or',
            function() {
                for (var a = 0; a < 2; a++) {
                    for (var b = 0; b < 2; b++) {
                        for (var c = 0; c < 2; c++) {
                            it('Should evaluate if a and b or c -> a=' + a + ', b=' + b + ', c=' + c, function() {
                                var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                                        'proc main()',
                                        '    number a = ' + a,
                                        '    number b = ' + b,
                                        '    number c = ' + c,
                                        '',
                                        '    if a and b or c',
                                        '        printS("true")',
                                        '    end',
                                        'end'
                                    ])).testData;

                                assert.deepEqual(testData.messages, eval(a + '&&' + b + '||' + c) ? ['true'] : []);
                            });
                        }
                    }
                }
            }
        );

        describe(
            'Test if or',
            function() {
                for (var a = 0; a < 2; a++) {
                    for (var b = 0; b < 2; b++) {
                        it('Should evaluate if a or b -> a=' + a + ', b=' + b, function() {
                            var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                                    'proc main()',
                                    '    number a = ' + a,
                                    '    number b = ' + b,
                                    '',
                                    '    if a or b',
                                    '        printS("true")',
                                    '    end',
                                    'end'
                                ])).testData;

                            assert.deepEqual(testData.messages, eval(a + '||' + b) ? ['true'] : []);
                        });
                    }
                }
            }
        );

        describe(
            'Test if or/and',
            function() {
                for (var a = 0; a < 2; a++) {
                    for (var b = 0; b < 2; b++) {
                        for (var c = 0; c < 2; c++) {
                            it('Should evaluate if a and b or c -> a=' + a + ', b=' + b + ', c=' + c, function() {
                                var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                                        'proc main()',
                                        '    number a = ' + a,
                                        '    number b = ' + b,
                                        '    number c = ' + c,
                                        '',
                                        '    if a or b and c',
                                        '        printS("true")',
                                        '    end',
                                        'end'
                                    ])).testData;

                                assert.deepEqual(testData.messages, eval(a + '&&' + b + '||' + c) ? ['true'] : []);
                            });
                        }
                    }
                }
            }
        );

        describe(
            'Test if and/or/and',
            function() {
                for (var a = 0; a < 2; a++) {
                    for (var b = 0; b < 2; b++) {
                        for (var c = 0; c < 2; c++) {
                            for (var d = 0; d < 2; d++) {
                                it('Should evaluate if a and b or c and d -> a=' + a + ', b=' + b + ', c=' + c + ', d=' + d, function() {
                                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                                            'proc main()',
                                            '    number a = ' + a,
                                            '    number b = ' + b,
                                            '    number c = ' + c,
                                            '    number d = ' + d,
                                            '',
                                            '    if a and b or c and d',
                                            '        printS("true")',
                                            '    end',
                                            'end'
                                        ])).testData;

                                    assert.deepEqual(testData.messages, eval(a + '&&' + b + '||' + c + '&&' + d) ? ['true'] : []);
                                });
                            }
                        }
                    }
                }
            }
        );

        describe(
            'Test if and/and/and',
            function() {
                for (var a = 0; a < 2; a++) {
                    for (var b = 0; b < 2; b++) {
                        for (var c = 0; c < 2; c++) {
                            for (var d = 0; d < 2; d++) {
                                it('Should evaluate if a and b or c and d -> a=' + a + ', b=' + b + ', c=' + c + ', d=' + d, function() {
                                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                                            'proc main()',
                                            '    number a = ' + a,
                                            '    number b = ' + b,
                                            '    number c = ' + c,
                                            '    number d = ' + d,
                                            '',
                                            '    if a and b and c and d',
                                            '        printS("true")',
                                            '    end',
                                            'end'
                                        ])).testData;

                                    assert.deepEqual(testData.messages, eval(a + '&&' + b + '&&' + c + '&&' + d) ? ['true'] : []);
                                });
                            }
                        }
                    }
                }
            }
        );

        describe(
            'Test if or/and/or',
            function() {
                for (var a = 0; a < 2; a++) {
                    for (var b = 0; b < 2; b++) {
                        for (var c = 0; c < 2; c++) {
                            for (var d = 0; d < 2; d++) {
                                it('Should evaluate if a or b and c or d -> a=' + a + ', b=' + b + ', c=' + c + ', d=' + d, function() {
                                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                                            'proc main()',
                                            '    number a = ' + a,
                                            '    number b = ' + b,
                                            '    number c = ' + c,
                                            '    number d = ' + d,
                                            '',
                                            '    if a or b and c or d',
                                            '        printS("true")',
                                            '    end',
                                            'end'
                                        ])).testData;

                                    assert.deepEqual(testData.messages, eval(a + '||' + b + '&&' + c + '||' + d) ? ['true'] : []);
                                });
                            }
                        }
                    }
                }
            }
        );

        describe(
            'Test if or/and/and/or',
            function() {
                for (var a = 0; a < 2; a++) {
                    for (var b = 0; b < 2; b++) {
                        for (var c = 0; c < 2; c++) {
                            for (var d = 0; d < 2; d++) {
                                for (var e = 0; e < 2; e++) {
                                    it('Should evaluate if a or b and c and d or e -> a=' + a + ', b=' + b + ', c=' + c + ', d=' + d + ', e=' + e, function() {
                                        var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                                                'proc main()',
                                                '    number a = ' + a + ', b = ' + b + ', c = ' + c,
                                                '    number d = ' + d + ',e = ' + e,
                                                '',
                                                '    if a or b and c and d or e',
                                                '        printS("true")',
                                                '    end',
                                                'end'
                                            ])).testData;

                                        assert.deepEqual(testData.messages, eval(a + '||' + b + '&&' + c + '&&' + d + '||' + e) ? ['true'] : []);
                                    });
                                }
                            }
                        }
                    }
                }
            }
        );

        describe(
            'Test if and/and/and/or/and/and/and',
            function() {
                for (var a = 0; a < 2; a++) {
                    for (var b = 0; b < 2; b++) {
                        for (var c = 0; c < 2; c++) {
                            for (var d = 0; d < 2; d++) {
                                for (var e = 0; e < 2; e++) {
                                    for (var f = 0; f < 2; f++) {
                                        for (var g = 0; g < 2; g++) {
                                            for (var h = 0; h < 2; h++) {
                                                it('Should evaluate if a and b and c and d or e and f and g and h -> a=' + a + ', b=' + b + ', c=' + c + ', d=' + d + ', e=' + e + ', f=' + f + ', g=' + g + ', h=' + h, function() {
                                                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                                                            'proc main()',
                                                            '    number a = ' + a,
                                                            '    number b = ' + b,
                                                            '    number c = ' + c,
                                                            '    number d = ' + d,
                                                            '    number e = ' + e,
                                                            '    number f = ' + f,
                                                            '    number g = ' + g,
                                                            '    number h = ' + h,
                                                            '',
                                                            '    if a and b and c and d or e and f and g and h',
                                                            '        printS("true")',
                                                            '    end',
                                                            'end'
                                                        ])).testData;

                                                    assert.deepEqual(testData.messages, eval(a + '&&' + b + '&&' + c + '&&' + d + '||' + e + '&&' + f + '&&' + g + '&&' + h) ? ['true'] : []);
                                                });
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        );

        describe(
            'Test if (or)/and',
            function() {
                for (var a = 0; a < 2; a++) {
                    for (var b = 0; b < 2; b++) {
                        for (var c = 0; c < 2; c++) {
                            it('Should evaluate if (a or b) and c -> a=' + a + ', b=' + b + ', c=' + c, function() {
                                var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                                        'proc main()',
                                        '    number a = ' + a,
                                        '    number b = ' + b,
                                        '    number c = ' + c,
                                        '',
                                        '    if (a or b) and c',
                                        '        printS("true")',
                                        '    end',
                                        'end'
                                    ])).testData;

                                assert.deepEqual(testData.messages, eval('(' + a + '||' + b + ')&&' + c) ? ['true'] : []);
                            });
                        }
                    }
                }
            }
        );

        describe(
            'Test if and/(or)',
            function() {
                for (var a = 0; a < 2; a++) {
                    for (var b = 0; b < 2; b++) {
                        for (var c = 0; c < 2; c++) {
                            it('Should evaluate if c and (a or b) -> a=' + a + ', b=' + b + ', c=' + c, function() {
                                var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                                        'proc main()',
                                        '    number a = ' + a,
                                        '    number b = ' + b,
                                        '    number c = ' + c,
                                        '',
                                        '    if c and (a or b)',
                                        '        printS("true")',
                                        '    end',
                                        'end'
                                    ])).testData;

                                assert.deepEqual(testData.messages, eval(c + '&&(' + a + '||' + b + ')') ? ['true'] : []);
                            });
                        }
                    }
                }
            }
        );

        describe(
            'Test if (or)/and/(or)',
            function() {
                for (var a = 0; a < 2; a++) {
                    for (var b = 0; b < 2; b++) {
                        for (var c = 0; c < 2; c++) {
                            for (var d = 0; d < 2; d++) {
                                it('Should evaluate if (a or b) and (c or d) -> a=' + a + ', b=' + b + ', c=' + c + ', d=' + d, function() {
                                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                                            'proc main()',
                                            '    number a = ' + a,
                                            '    number b = ' + b,
                                            '    number c = ' + c,
                                            '    number d = ' + d,
                                            '',
                                            '    if (a or b) and (c or d)',
                                            '        printS("true")',
                                            '    end',
                                            'end'
                                        ])).testData;

                                    assert.deepEqual(testData.messages, eval('(' + a + '||' + b + ')&&(' + c + '||' + d + ')') ? ['true'] : []);
                                });
                            }
                        }
                    }
                }
            }
        );

        describe(
            'Test if or/and/(or)',
            function() {
                for (var a = 0; a < 2; a++) {
                    for (var b = 0; b < 2; b++) {
                        for (var c = 0; c < 2; c++) {
                            for (var d = 0; d < 2; d++) {
                                it('Should evaluate if a or b and (c or d) -> a=' + a + ', b=' + b + ', c=' + c + ', d=' + d, function() {
                                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                                            'proc main()',
                                            '    number a = ' + a,
                                            '    number b = ' + b,
                                            '    number c = ' + c,
                                            '    number d = ' + d,
                                            '',
                                            '    if a or b and (c or d)',
                                            '        printS("true")',
                                            '    end',
                                            'end'
                                        ])).testData;

                                    assert.deepEqual(testData.messages, eval(a + '||' + b + '&&(' + c + '||' + d + ')') ? ['true'] : []);
                                });
                            }
                        }
                    }
                }
            }
        );

        describe(
            'Test if (or)/and/or',
            function() {
                for (var a = 0; a < 2; a++) {
                    for (var b = 0; b < 2; b++) {
                        for (var c = 0; c < 2; c++) {
                            for (var d = 0; d < 2; d++) {
                                it('Should evaluate if a or b and (c or d) -> a=' + a + ', b=' + b + ', c=' + c + ', d=' + d, function() {
                                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                                            'proc main()',
                                            '    number a = ' + a,
                                            '    number b = ' + b,
                                            '    number c = ' + c,
                                            '    number d = ' + d,
                                            '',
                                            '    if (a or b) and c or d',
                                            '        printS("true")',
                                            '    end',
                                            'end'
                                        ])).testData;

                                    assert.deepEqual(testData.messages, eval('(' + a + '||' + b + ')&&' + c + '||' + d) ? ['true'] : []);
                                });
                            }
                        }
                    }
                }
            }
        );

        describe(
            'Test if and/(or)/or',
            function() {
                for (var a = 0; a < 2; a++) {
                    for (var b = 0; b < 2; b++) {
                        for (var c = 0; c < 2; c++) {
                            for (var d = 0; d < 2; d++) {
                                it('Should evaluate if a and (b or c) or d -> a=' + a + ', b=' + b + ', c=' + c + ', d=' + d, function() {
                                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                                            'proc main()',
                                            '    number a = ' + a,
                                            '    number b = ' + b,
                                            '    number c = ' + c,
                                            '    number d = ' + d,
                                            '',
                                            '    if a and (b or c) or d',
                                            '        printS("true")',
                                            '    end',
                                            'end'
                                        ])).testData;

                                    assert.deepEqual(testData.messages, eval(a + '&&(' + b + '||' + c + ')||' + d) ? ['true'] : []);
                                });
                            }
                        }
                    }
                }
            }
        );

        describe(
            'Test if (or)/and/(or)/or',
            function() {
                for (var a = 0; a < 2; a++) {
                    for (var b = 0; b < 2; b++) {
                        for (var c = 0; c < 2; c++) {
                            for (var d = 0; d < 2; d++) {
                                for (var e = 0; e < 2; e++) {
                                    it('Should evaluate if (a or b) and (c or d) or e -> a=' + a + ', b=' + b + ', c=' + c + ', d=' + d + ', e=' + e, function() {
                                        var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                                                'proc main()',
                                                '    number a = ' + a,
                                                '    number b = ' + b,
                                                '    number c = ' + c,
                                                '    number d = ' + d,
                                                '    number e = ' + e,
                                                '',
                                                '    if (a or b) and (c or d) or e',
                                                '        printS("true")',
                                                '    end',
                                                'end'
                                            ])).testData;

                                        assert.deepEqual(testData.messages, eval('(' + a + '||' + b + ')&&(' + c + '||' + d + ')||' + e) ? ['true'] : []);
                                    });
                                }
                            }
                        }
                    }
                }
            }
        );
    }
);