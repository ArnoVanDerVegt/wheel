/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const testCodeAndMemory = require('../../utils').testCodeAndMemory;
const testLogs          = require('../../utils').testLogs;

describe(
'Test single dimensional array',
        () => {
        describe(
            'Test number array',
            () => {
                testCodeAndMemory(
                    it,
                    'Declares global array, assigns constant to first index',
                    [
                        'number a[10]',
                        'proc main()',
                        '    a[0] = 77',
                        'end'
                    ],
                    [
                        '0000|0000 set     [9],            77'
                    ],
                    [
                        19, 0, 0, 0, 1, 0, 0, 0, 0, 77
                    ]
                );
                testCodeAndMemory(
                    it,
                    'Declares global array, assigns constant to second index',
                    [
                        'number a[10]',
                        'proc main()',
                        '    a[1] = 88',
                        'end'
                    ],
                    [
                        '0000|0000 set     [10],           88'
                    ],
                    [
                        19, 0, 0, 0, 1, 0, 0, 0, 0, 0, 88
                    ]
                );
                testCodeAndMemory(
                    it,
                    'Declares global array, assigns constant to global number index',
                    [
                        'number a[10]',
                        'number n',
                        'proc main()',
                        '    a[n] = 37',
                        'end'
                    ],
                    [
                        '0000|0000 set     [stack + 0],    37',
                        '0001|0000 set     ptr,            9',
                        '0002|0000 set     range1,         10',
                        '0003|0000 set     range2,         [19]',
                        '0004|0000 mod     0,              0',
                        '0005|0000 add     ptr,            [19]',
                        '0006|0000 set     [ptr + 0],      [stack + 0]'
                    ],
                    false
                );
                testCodeAndMemory(
                    it,
                    'Declares global array, assigns array value with constant index to global number',
                    [
                        'number n[10]',
                        'number a',
                        'proc main()',
                        '    a = n[1]',
                        'end'
                    ],
                    [
                        '0000|0000 set     [19],           [10]'
                    ],
                    false
                );
                testCodeAndMemory(
                    it,
                    'Declares global array, assigns array value with global number index to global number',
                    [
                        'number n[10]',
                        'number a',
                        'number b',
                        'proc main()',
                        '    a = n[b]',
                        'end'
                    ],
                    [
                        '0000|0000 set     ptr,            9',
                        '0001|0000 set     range1,         10',
                        '0002|0000 set     range2,         [20]',
                        '0003|0000 mod     0,              0',
                        '0004|0000 add     ptr,            [20]',
                        '0005|0000 set     [19],           [ptr + 0]'
                    ],
                    false
                );
                testLogs(
                    it,
                    'Should assign array',
                    [
                        'number a[3], b[3]',
                        'proc main()',
                        '    number i',
                        '    number j',
                        '    for i = 0 to 2',
                        '        b[i] = i',
                        '    end',
                        '    a = b',
                        '    for i = 0 to 2',
                        '        j = b[i]',
                        '        addr j',
                        '        mod 0, 1',
                        '    end',
                        'end'
                    ],
                    [
                        0, 1, 2
                    ]
                );
            }
        );
        describe(
            'Test constant array',
            () => {
                testLogs(
                    it,
                    'Should assign local constant array',
                    [
                        'proc main()',
                        '    number n[3]',
                        '    n = [6, 14, 78]',
                        '    addr n[2]',
                        '    mod 0, 1',
                        '    addr n[1]',
                        '    mod 0, 1',
                        '    addr n[0]',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        78, 14, 6
                    ]
                );
                testLogs(
                    it,
                    'Should assign global constant array',
                    [
                        'number n[3]',
                        'proc main()',
                        '    n = [972, 27, 42]',
                        '    addr n[2]',
                        '    mod 0, 1',
                        '    addr n[1]',
                        '    mod 0, 1',
                        '    addr n[0]',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        42, 27, 972
                    ]
                );
            }
        );
        describe(
            'Test complex array index',
            () => {
                testLogs(
                    it,
                    'Should assign array index with array value',
                    [
                        'number a[2]',
                        'number b[3]',
                        'proc main()',
                        '    a[1] = 2',
                        '    b[a[1]] = 5',
                        '    addr a[1]',
                        '    mod 0, 1',
                        '    addr b[2]',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        2, 5
                    ]
                );
            }
        );
    }
);
