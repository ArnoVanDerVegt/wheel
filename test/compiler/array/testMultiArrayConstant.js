/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const testCodeAndMemory = require('../../utils').testCodeAndMemory;
const testLogs          = require('../../utils').testLogs;

describe(
    'Test multi dimensional constant record arrays',
    () => {
        describe(
            'Test constant array declaration',
            () => {
                testLogs(
                    it,
                    'Should declare local array of numbers with one number',
                    [
                        'proc main()',
                        '    number p[1][1] = [[456]]',
                        '    addr p[0][0]',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        456
                    ]
                );
                testLogs(
                    it,
                    'Should declare local array of numbers with one number - multi line',
                    [
                        'proc main()',
                        '    number p[1][1] = [',
                        '               [456]',
                        '           ]',
                        '    addr p[0][0]',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        456
                    ]
                );
                testLogs(
                    it,
                    'Should declare local array of numbers with multiple numbers',
                    [
                        'proc main()',
                        '    number p[1][3] = [[771, 361, 671]]',
                        '    addr p[0][2]',
                        '    mod 0, 1',
                        '    addr p[0][1]',
                        '    mod 0, 1',
                        '    addr p[0][0]',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        671, 361, 771
                    ]
                );
                testLogs(
                    it,
                    'Should declare local array of numbers with multiple numbers - multi line',
                    [
                        'proc main()',
                        '    number p[1][3] = [',
                        '               [771, 361, 671]',
                        '           ]',
                        '    addr p[0][2]',
                        '    mod 0, 1',
                        '    addr p[0][1]',
                        '    mod 0, 1',
                        '    addr p[0][0]',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        671, 361, 771
                    ]
                );
                testLogs(
                    it,
                    'Should declare local array of array of numbers with multiple numbers',
                    [
                        'proc main()',
                        '    number p[2][3] = [[90, 100, 110], [220, 230, 240]]',
                        '    addr p[0][2]',
                        '    mod 0, 1',
                        '    addr p[0][1]',
                        '    mod 0, 1',
                        '    addr p[0][0]',
                        '    mod 0, 1',
                        '    addr p[1][2]',
                        '    mod 0, 1',
                        '    addr p[1][1]',
                        '    mod 0, 1',
                        '    addr p[1][0]',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        110, 100, 90, 240, 230, 220
                    ]
                );
                testLogs(
                    it,
                    'Should declare local array of array of numbers with multiple numbers - multi line',
                    [
                        'proc main()',
                        '    number p[2][3] = [',
                        '               [90, 100, 110],',
                        '               [220, 230, 240]',
                        '           ]',
                        '    addr p[0][2]',
                        '    mod 0, 1',
                        '    addr p[0][1]',
                        '    mod 0, 1',
                        '    addr p[0][0]',
                        '    mod 0, 1',
                        '    addr p[1][2]',
                        '    mod 0, 1',
                        '    addr p[1][1]',
                        '    mod 0, 1',
                        '    addr p[1][0]',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        110, 100, 90, 240, 230, 220
                    ]
                );
            }
        );
        describe(
            'Test constant record array declaration, one record',
            () => {
                testLogs(
                    it,
                    'Should declare local array of record with one field',
                    [
                        'record Point',
                        '    number x',
                        'end',
                        'proc main()',
                        '    Point p[1][1] = [[{134}]]',
                        '    addr p[0][0].x',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        134
                    ]
                );
                testLogs(
                    it,
                    'Should declare local array of record with two fields',
                    [
                        'record Point',
                        '    number x',
                        '    number y',
                        'end',
                        'proc main()',
                        '    Point p[1][1] = [[{2534, 3536}]]',
                        '    addr p[0][0].y',
                        '    mod 0, 1',
                        '    addr p[0][0].x',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        3536,
                        2534
                    ]
                );
            }
        );
        describe(
            'Test constant record array declaration, multiple records',
            () => {
                testLogs(
                    it,
                    'Should declare local array of array of record with two fields',
                    [
                        'record Point',
                        '    number x',
                        '    number y',
                        'end',
                        'proc main()',
                        '    Point p[2][1] = [[{456, 267}], [{34, 314}]]',
                        '    addr p[1][0].y',
                        '    mod 0, 1',
                        '    addr p[1][0].x',
                        '    mod 0, 1',
                        '    addr p[0][0].y',
                        '    mod 0, 1',
                        '    addr p[0][0].x',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        314,
                        34,
                        267,
                        456
                    ]
                );
                testLogs(
                    it,
                    'Should declare local array of array of record with two fields - multi line',
                    [
                        'record Point',
                        '    number x',
                        '    number y',
                        'end',
                        'proc main()',
                        '    Point p[2][1] = [',
                        '              [',
                        '                  {456, 267}',
                        '              ],',
                        '              [',
                        '                  {34, 314}',
                        '              ]',
                        '          ]',
                        '    addr p[1][0].y',
                        '    mod 0, 1',
                        '    addr p[1][0].x',
                        '    mod 0, 1',
                        '    addr p[0][0].y',
                        '    mod 0, 1',
                        '    addr p[0][0].x',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        314,
                        34,
                        267,
                        456
                    ]
                );
                testLogs(
                    it,
                    'Should declare local array of array of record with two fields',
                    [
                        'record Point',
                        '    number x',
                        '    number y',
                        'end',
                        'proc main()',
                        '    Point p[2][2] = [[{110, 120}, {130, 140}], [{210, 220}, {230, 240}]]',
                        '    number i, j',
                        '    for i = 0 to 1',
                        '        for j = 0 to 1',
                        '            addr p[i][j].x',
                        '            mod 0, 1',
                        '            addr p[i][j].y',
                        '            mod 0, 1',
                        '        end',
                        '    end',
                        'end'
                    ],
                    [
                        110, 120, 130, 140, 210, 220, 230, 240
                    ]
                );
            }
        );
        describe(
            'Test constant record array as paramer',
            () => {
                testLogs(
                    it,
                    'Should use constant array with record with single field as parameter',
                    [
                        'record Point',
                        '    number x',
                        'end',
                        'proc test(Point p[1][2])',
                        '    addr p[0][0].x',
                        '    mod 0, 1',
                        '    addr p[0][1].x',
                        '    mod 0, 1',
                        'end',
                        'proc main()',
                        '    test([[{200}, {210}]])',
                        'end'
                    ],
                    [
                        200, 210
                    ]
                );
                testLogs(
                    it,
                    'Should use constant array[1][2] with record with two fields as parameter',
                    [
                        'record Point',
                        '    number x',
                        '    number y',
                        'end',
                        'proc test(Point p[1][2])',
                        '    addr p[0][0].x',
                        '    mod 0, 1',
                        '    addr p[0][0].y',
                        '    mod 0, 1',
                        '    addr p[0][1].x',
                        '    mod 0, 1',
                        '    addr p[0][1].y',
                        '    mod 0, 1',
                        'end',
                        'proc main()',
                        '    test([[{200, 205}, {210, 215}]])',
                        'end'
                    ],
                    [
                        200, 205, 210, 215
                    ]
                );
                testLogs(
                    it,
                    'Should use constant array[2][1] with record with two fields as parameter',
                    [
                        'record Point',
                        '    number x',
                        '    number y',
                        'end',
                        'proc test(Point p[2][1])',
                        '    addr p[0][0].x',
                        '    mod 0, 1',
                        '    addr p[0][0].y',
                        '    mod 0, 1',
                        '    addr p[1][0].x',
                        '    mod 0, 1',
                        '    addr p[1][0].y',
                        '    mod 0, 1',
                        'end',
                        'proc main()',
                        '    test([[{200, 205}], [{210, 215}]])',
                        'end'
                    ],
                    [
                        200, 205, 210, 215
                    ]
                );
            }
        );
    }
);
