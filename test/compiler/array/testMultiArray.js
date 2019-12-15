/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const testCodeAndMemory = require('../../utils').testCodeAndMemory;
const testLogs          = require('../../utils').testLogs;

describe(
    'Test multi dimensional array',
    function() {
        describe(
            'Test global multi dimensional array',
            function() {
                testLogs(
                    it,
                    'Should declare simple global multi dimensional array',
                    [
                        'number a[2][2]',
                        'proc main()',
                        'end'
                    ],
                    [
                    ]
                );
                testCodeAndMemory(
                    it,
                    'Should set simple global multi dimensional array',
                    [
                        'number a[2][2]',
                        'proc main()',
                        '    a[0][0] = 56',
                        '    a[0][1] = 57',
                        '    a[1][0] = 58',
                        '    a[1][1] = 59',
                        'end'
                    ],
                    [
                        '0000|0000 set     [9],            56',
                        '0001|0001 set     [10],           57',
                        '0002|0002 set     [11],           58',
                        '0003|0003 set     [12],           59'
                    ],
                    [
                        13, 0, 0, 0, 4, 0, 0, 0, 0, 56, 57, 58, 59
                    ]
                );
                testLogs(
                    it,
                    'Should assign global constant array or records',
                    [
                        'number a[3][2]',
                        'proc main()',
                        '    a[0][0] = 256',
                        '    a[0][1] = 257',
                        '    a[1][0] = 258',
                        '    a[1][1] = 259',
                        '    addr a[0][0]',
                        '    mod 0, 1',
                        '    addr a[0][1]',
                        '    mod 0, 1',
                        '    addr a[1][0]',
                        '    mod 0, 1',
                        '    addr a[1][1]',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        256, 257, 258, 259
                    ]
                );
                testLogs(
                    it,
                    'Should declare simple global multi dimensional array and set index with simple number var',
                    [
                        'number a[2][3]',
                        'proc main()',
                        '    number n = 1',
                        '    a[n][0] = 56',
                        '    addr a[1][0]',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        56
                    ]
                );
                testLogs(
                    it,
                    'Should declare simple global multi dimensional array and set indices with simple number var',
                    [
                        'number a[2][2]',
                        'proc main()',
                        '    number i = 1',
                        '    number j = 1',
                        '    a[i][j] = 516',
                        '    addr a[1][1]',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        516
                    ]
                );
                testLogs(
                    it,
                    'Should declare simple global multi dimensional array and read indices with simple number var',
                    [
                        'number a[3][2]',
                        'proc main()',
                        '    number i = 1',
                        '    number j = 1',
                        '    a[1][1] = 613',
                        '    addr a[i][j]',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        613
                    ]
                );
                testLogs(
                    it,
                    'Should assign three dimensional array',
                    [
                        'proc main()',
                        '    number a[3][4][5]',
                        '    a[2][3][4] = 567',
                        '    a[1][2][3] = 144',
                        '    addr a[2][3][4]',
                        '    mod 0, 1',
                        '    addr a[1][2][3]',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        567, 144
                    ]
                );
                testLogs(
                    it,
                    'Should declare simple global multi dimensional array and set index with math expression',
                    [
                        'number a[7][5]',
                        'proc main()',
                        '    number n = 2',
                        '    a[2][n * 2] = 613',
                        '    addr a[2][4]',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        613
                    ]
                );
                testLogs(
                    it,
                    'Should declare simple global multi dimensional array and set indices with math expression',
                    [
                        'number a[7][9]',
                        'proc main()',
                        '    number i = 2',
                        '    number j = 3',
                        '    a[i * 2][j * 2] = 378',
                        '    addr a[4][6]',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        378
                    ]
                );
                testLogs(
                    it,
                    'Should declare simple global multi dimensional array and read indices with math expression',
                    [
                        'number a[9][7]',
                        'proc main()',
                        '    number i = 2',
                        '    number j = 3',
                        '    a[4][6] = 167',
                        '    addr a[i * 2][j * 2]',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        167
                    ]
                );
            }
        );
        describe(
            'Test local multi dimensional array',
            function() {
                testLogs(
                    it,
                    'Should declare simple local multi dimensional array',
                    [
                        'proc main()',
                        '    number a[2][2]',
                        'end'
                    ],
                    [
                    ]
                );
                testLogs(
                    it,
                    'Should assign local constant array or records',
                    [
                        'proc main()',
                        '    number a[2][2]',
                        '    a[0][0] = 356',
                        '    a[0][1] = 357',
                        '    a[1][0] = 358',
                        '    a[1][1] = 359',
                        '    addr a[0][0]',
                        '    mod 0, 1',
                        '    addr a[0][1]',
                        '    mod 0, 1',
                        '    addr a[1][0]',
                        '    mod 0, 1',
                        '    addr a[1][1]',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        356, 357, 358, 359
                    ]
                );
            }
        );
        describe(
            'Test local multi dimensional array',
            function() {
                testLogs(
                    it,
                    'Should use simple parameter multi dimensional array with constant index',
                    [
                        'proc test(number a[2][3])',
                        '    addr a[1][1]',
                        '    mod 0, 1',
                        'end',
                        'proc main()',
                        '    number a[2][3]',
                        '    a[1][1] = 478',
                        '    test(a)',
                        'end'
                    ],
                    [
                        478
                    ]
                );
                testLogs(
                    it,
                    'Should use simple parameters multi dimensional array with constant index',
                    [
                        'proc test(number a[3][2], number b[3][2])',
                        '    addr a[1][1]',
                        '    mod 0, 1',
                        '    addr b[0][0]',
                        '    mod 0, 1',
                        'end',
                        'proc main()',
                        '    number a[3][2]',
                        '    a[1][1] = 353',
                        '    number b[3][2]',
                        '    b[0][0] = 5756',
                        '    test(a, b)',
                        'end'
                    ],
                    [
                        353, 5756
                    ]
                );
            }
        );
    }
);
