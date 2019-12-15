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
            'Test assign array',
            function() {
                testLogs(
                    it,
                    'Should assign array to multi dimensional array part',
                    [
                        'proc main()',
                        '    number a[2][2]',
                        '    number b[2]',
                        '    b[0] = 46',
                        '    b[1] = 95',
                        '    a[0] = b',
                        '    addr a[0][0]',
                        '    mod 0, 1',
                        '    addr a[0][1]',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        46, 95
                    ]
                );
                testLogs(
                    it,
                    'Should assign array to three dimensional array part',
                    [
                        'proc main()',
                        '    number a[3][4][5]',
                        '    number b[4][5]',
                        '    b[0][2] = 246',
                        '    b[0][3] = 295',
                        '    a[1] = b',
                        '    addr a[1][0][2]',
                        '    mod 0, 1',
                        '    addr a[1][0][3]',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        246, 295
                    ]
                );
                testLogs(
                    it,
                    'Should assign multi dimensional array part to array',
                    [
                        'proc main()',
                        '    number a[2][2]',
                        '    number b[2]',
                        '    a[1][0] = 146',
                        '    a[1][1] = 195',
                        '    b = a[1]',
                        '    addr b[0]',
                        '    mod 0, 1',
                        '    addr b[1]',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        146, 195
                    ]
                );
            }
        );
        describe(
            'Test parameter array',
            function() {
                testLogs(
                    it,
                    'Should call with var parameter',
                    [
                        'proc test(number a[2][3][4])',
                        '    addr a[0][0][0]',
                        '    mod 0, 1',
                        '    addr a[1][2][3]',
                        '    mod 0, 1',
                        'end',
                        'proc main()',
                        '    number a[2][3][4]',
                        '    a[0][0][0] = 406', // Min index
                        '    a[1][2][3] = 295', // Max index
                        '    test(a)',
                        'end'
                    ],
                    [
                        406, 295
                    ]
                );
                testLogs(
                    it,
                    'Should call with constant parameter',
                    [
                        'proc test(number a[2][3][4])',
                        '    addr a[0][0][0]',
                        '    mod 0, 1',
                        '    addr a[1][2][3]',
                        '    mod 0, 1',
                        'end',
                        'proc main()',
                        '    test([[[10, 20, 30, 40], [30, 40, 50, 60], [60, 70, 80, 90]], [[5, 6, 7, 8], [7, 8, 9, 10], [8, 9, 10, 99]]])',
                        'end'
                    ],
                    [
                        10, 99
                    ]
                );
            }
        );
        describe(
            'Test condition',
            function() {
                testLogs(
                    it,
                    'Should use if condition result true',
                    [
                        'proc main()',
                        '    number a[2][3][4]',
                        '    number i',
                        '    a[1][2][3] = 2195',
                        '    if (a[1][2][3] == 2195)',
                        '        i = 1',
                        '    else',
                        '        i = 0',
                        '    end',
                        '    addr i',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        1
                    ]
                );
                testLogs(
                    it,
                    'Should use if condition result false',
                    [
                        'proc main()',
                        '    number a[2][3][4]',
                        '    number i',
                        '    a[1][2][3] = 3444',
                        '    if (a[1][2][3] == 2195)',
                        '        i = 1',
                        '    else',
                        '        i = 0',
                        '    end',
                        '    addr i',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        0
                    ]
                );
            }
        );
        describe(
            'Test loop',
            function() {
                testLogs(
                    it,
                    'Should use repeat loop',
                    [
                        'proc main()',
                        '    number a[2][3][4]',
                        '    a[1][2][3] = 5',
                        '    number i = 0',
                        '    while a[1][2][3] > 0',
                        '        a[1][2][3]--',
                        '        i++',
                        '        addr i',
                        '        mod 0, 1',
                        '    end',
                        'end'
                    ],
                    [
                        1, 2, 3, 4, 5
                    ]
                );
                testLogs(
                    it,
                    'Should use for loop counter',
                    [
                        'proc main()',
                        '    number a[2][3][4]',
                        '    a[1][2][3] = 5',
                        '    number i = 0',
                        '    for a[1][2][3] = 0 to 4',
                        '        i++',
                        '        addr i',
                        '        mod 0, 1',
                        '    end',
                        'end'
                    ],
                    [
                        1, 2, 3, 4, 5
                    ]
                );
                testLogs(
                    it,
                    'Should use for loop start value',
                    [
                        'proc main()',
                        '    number a[2][3][4]',
                        '    number i',
                        '    a[1][2][3] = 1000',
                        '    for i = a[1][2][3] to 1004',
                        '        addr i',
                        '        mod 0, 1',
                        '    end',
                        'end'
                    ],
                    [
                        1000, 1001, 1002, 1003, 1004
                    ]
                );
                testLogs(
                    it,
                    'Should use for loop end value',
                    [
                        'proc main()',
                        '    number a[2][3][4]',
                        '    number i',
                        '    a[1][2][3] = 2004',
                        '    for i = 2000 to a[1][2][3]',
                        '        addr i',
                        '        mod 0, 1',
                        '    end',
                        'end'
                    ],
                    [
                        2000, 2001, 2002, 2003, 2004
                    ]
                );
            }
        );
    }
);
