/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const testCodeAndMemory = require('../../utils').testCodeAndMemory;
const testLogs          = require('../../utils').testLogs;

describe(
    'Test multi dimensional record arrays',
    function() {
        describe(
            'Test declare global multi dimensional record array',
            function() {
                testLogs(
                    it,
                    'Should declare global array of records',
                    [
                        'record Point',
                        '    number x, y',
                        'end',
                        'Point p[2][2]',
                        'proc main()',
                        'end'
                    ],
                    [
                    ]
                );
                testLogs(
                    it,
                    'Should assign global array of records',
                    [
                        'record Point',
                        '    number x, y',
                        'end',
                        'Point p[2][2]',
                        'proc main()',
                        '    p[0][0].x = 5',
                        'end'
                    ],
                    [
                    ]
                );
                testLogs(
                    it,
                    'Should assign and log global array of records',
                    [
                        'record Point',
                        '    number x, y',
                        'end',
                        'Point p[3][2]',
                        'proc main()',
                        '    p[0][0].x = 1577',
                        '    p[1][0].y = 5671',
                        '    p[1][1].y = 3361',
                        '    addr p[0][0].x',
                        '    mod 0, 1',
                        '    addr p[1][0].y',
                        '    mod 0, 1',
                        '    addr p[1][1].y',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        1577, 5671, 3361
                    ]
                );
            }
        );
        describe(
            'Test declare global record with multi dimensional field array',
            function() {
                testLogs(
                    it,
                    'Should declare global record with array of array',
                    [
                        'record Test',
                        '    number f[3][2]',
                        'end',
                        'proc main()',
                        'end'
                    ],
                    [
                    ]
                );
                testLogs(
                    it,
                    'Should assign global record with array of array?????',
                    [
                        'record Test',
                        '    number f[3][2]',
                        'end',
                        'Test t',
                        'proc main()',
                        '    t.f[0][0] = 578',
                        '    addr t.f[0][0]',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        578
                    ]
                );
                testLogs(
                    it,
                    'Should assign global record with array of array with number index',
                    [
                        'record Test',
                        '    number f[3][2]',
                        'end',
                        'Test t',
                        'proc main()',
                        '    number n = 2',
                        '    t.f[n][0] = 217',
                        '    addr t.f[n][0]',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        217
                    ]
                );
                testLogs(
                    it,
                    'Should assign global record with array of array with number indices',
                    [
                        'record Test',
                        '    number f[2][3]',
                        'end',
                        'Test t',
                        'proc main()',
                        '    number i = 1',
                        '    number j = 2',
                        '    t.f[i][j] = 721',
                        '    addr t.f[i][j]',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        721
                    ]
                );
            }
        );
        describe(
            'Test declare global array of array of record with multi dimensional field array',
            function() {
                testLogs(
                    it,
                    'Should assign global record with array of array with constant indices',
                    [
                        'record Test',
                        '    number f[2][3]',
                        'end',
                        'Test t[3][2]',
                        'proc main()',
                        '    t[0][0].f[0][0] = 283',
                        '    addr t[0][0].f[0][0]',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        283
                    ]
                );
                testLogs(
                    it,
                    'Should assign global record with array of array with number indices',
                    [
                        'record Test',
                        '    number f[2][3]',
                        'end',
                        'Test t[3][2]',
                        'proc main()',
                        '    number i = 1',
                        '    number j = 2',
                        '    t[j][i].f[i][j] = 2419',
                        '    addr t[j][i].f[i][j]',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        2419
                    ]
                );
                testLogs(
                    it,
                    'Should assign global record with array of array with math expression indices',
                    [
                        'record Test',
                        '    number f[10][10]',
                        'end',
                        'Test t[10][10]',
                        'proc main()',
                        '    number i = 1',
                        '    number j = 2',
                        '    t[j * 3][i + 5].f[i + 2][j * 2] = 231',
                        '    addr t[j * 3][i + 5].f[i + 2][j * 2]',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        231
                    ]
                );
            }
        );
    }
);
