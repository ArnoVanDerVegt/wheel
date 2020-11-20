/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const testCodeAndMemory = require('../../utils').testCodeAndMemory;
const testLogs          = require('../../utils').testLogs;

describe(
    'Test vars',
    () => {
        describe(
            'Test number',
            () => {
                testCodeAndMemory(
                    it,
                    'Declares and assigns global number',
                    [
                        'number g',
                        'proc main()',
                        '    g = 12',
                        'end'
                    ],
                    [
                        '0000|0000 set     [9],            12'
                    ],
                    [
                        10, 0, 0, 0, 1, 0, 0, 0, 0, 12
                    ]
                );
                testCodeAndMemory(
                    it,
                    'Declares and assigns local number',
                    [
                        'proc main()',
                        '    number l',
                        '    l = 13',
                        'end'
                    ],
                    [
                        '0000|0000 set     [stack],        13'
                    ],
                    [
                        9, 0, 0, 0, 1, 0, 0, 0, 0, 13
                    ]
                );
                testCodeAndMemory(
                    it,
                    'Assigns global number to global number',
                    [
                        'number g1',
                        'number g2',
                        'proc main()',
                        '    g1 = g2',
                        'end'
                    ],
                    [
                        '0000|0000 set     [9],            [10]'
                    ],
                    false
                );
                testCodeAndMemory(
                    it,
                    'Assigns local number to global number',
                    [
                        'number g',
                        'proc main()',
                        '    number l',
                        '    g = l',
                        'end'
                    ],
                    [
                        '0000|0000 set     [9],            [stack]'
                    ],
                    false
                );
                testCodeAndMemory(
                    it,
                    'Assigns global number to local number',
                    [
                        'number g',
                        'proc main()',
                        '    number l',
                        '    l = g',
                        'end'
                    ],
                    [
                        '0000|0000 set     [stack],        [9]'
                    ],
                    false
                );
                testLogs(
                    it,
                    'Declares a binary number',
                    [
                        'proc main()',
                        '    number n = 0b11',
                        '    addr n',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        3
                    ]
                );
                testLogs(
                    it,
                    'Declares a hexadecimal number',
                    [
                        'proc main()',
                        '    number n = 0x88',
                        '    addr n',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        136
                    ]
                );
            }
        );
        describe(
            'Test expression in declaration',
            () => {
                testLogs(
                    it,
                    'Declares and assigns expression',
                    [
                        'proc main()',
                        '    number i = 10',
                        '    number j = i * 3 + 5',
                        '    addr j',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        35
                    ]
                );
                testLogs(
                    it,
                    'Declares and assigns expression with proc call',
                    [
                        'proc test()',
                        '    ret 42',
                        'end',
                        'proc main()',
                        '    number i = 8',
                        '    number j = i * 4 + test()',
                        '    addr j',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        74
                    ]
                );
            }
        );
    }
);
