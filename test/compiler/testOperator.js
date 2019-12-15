/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const testLogs = require('../utils').testLogs;

describe(
    'Test operator',
    function() {
        describe(
            'Test precedence',
            function() {
                testLogs(
                    it,
                    'Should divide and multiply',
                    [
                        'proc main()',
                        '    number i, j',
                        '    i = 10',
                        '    j = i / 2 * 3',
                        '    addr j',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        15
                    ]
                );
                testLogs(
                    it,
                    'Should multiply and add',
                    [
                        'proc main()',
                        '    number i, j',
                        '    i = 5',
                        '    j = i * 12 + 3',
                        '    addr j',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        63
                    ]
                );
                testLogs(
                    it,
                    'Should multiply and add',
                    [
                        'proc main()',
                        '    number i, j',
                        '    i = 4',
                        '    j = 7 + i * 10',
                        '    addr j',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        47
                    ]
                );
            }
        );
        describe(
            'Test with constant',
            function() {
                testLogs(
                    it,
                    'Should add a number',
                    [
                        'number n',
                        'proc main()',
                        '    n = 12',
                        '    n += 3',
                        '    addr n',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        15
                    ]
                );
                testLogs(
                    it,
                    'Should subtract a number',
                    [
                        'number n',
                        'proc main()',
                        '    n = 120',
                        '    n -= 3',
                        '    addr n',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        117
                    ]
                );
                testLogs(
                    it,
                    'Should multiply a number',
                    [
                        'number n',
                        'proc main()',
                        '    n = 17',
                        '    n *= 5',
                        '    addr n',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        85
                    ]
                );
                testLogs(
                    it,
                    'Should divide a number',
                    [
                        'number n',
                        'proc main()',
                        '    n = 70',
                        '    n /= 7',
                        '    addr n',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        10
                    ]
                );
            }
        );
        describe(
            'Test with negative constant',
            function() {
                testLogs(
                    it,
                    'Should add a number',
                    [
                        'number n',
                        'proc main()',
                        '    n = 120',
                        '    n += -3',
                        '    addr n',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        117
                    ]
                );
                testLogs(
                    it,
                    'Should subtract a number',
                    [
                        'number n',
                        'proc main()',
                        '    n = 120',
                        '    n -= -3',
                        '    addr n',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        123
                    ]
                );
                testLogs(
                    it,
                    'Should multiply a number',
                    [
                        'number n',
                        'proc main()',
                        '    n = 17',
                        '    n *= -5',
                        '    addr n',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        -85
                    ]
                );
                testLogs(
                    it,
                    'Should divide a number',
                    [
                        'number n',
                        'proc main()',
                        '    n = 70',
                        '    n /= -7',
                        '    addr n',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        -10
                    ]
                );
            }
        );
        describe(
            'Test with variable',
            function() {
                testLogs(
                    it,
                    'Should add a number',
                    [
                        'number i',
                        'number j',
                        'proc main()',
                        '    i = 12',
                        '    j = 3',
                        '    i += j',
                        '    addr i',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        15
                    ]
                );
                testLogs(
                    it,
                    'Should subtract a number',
                    [
                        'number i',
                        'number j',
                        'proc main()',
                        '    i = 120',
                        '    j = 3',
                        '    i -= j',
                        '    addr i',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        117
                    ]
                );
                testLogs(
                    it,
                    'Should multiply a number',
                    [
                        'number i',
                        'number j',
                        'proc main()',
                        '    i = 17',
                        '    j = 5',
                        '    i *= j',
                        '    addr i',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        85
                    ]
                );
                testLogs(
                    it,
                    'Should divide a number',
                    [
                        'number i',
                        'number j',
                        'proc main()',
                        '    i = 70',
                        '    j = 7',
                        '    i /= j',
                        '    addr i',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        10
                    ]
                );
            }
        );
        describe(
            'Test with minus sign',
            function() {
                testLogs(
                    it,
                    'Should neg',
                    [
                        'proc main()',
                        '    number i, j',
                        '    i = 5',
                        '    j = -i * 9',
                        '    addr j',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        -45
                    ]
                );
                testLogs(
                    it,
                    'Should neg two values',
                    [
                        'proc main()',
                        '    number i, j',
                        '    i = -5',
                        '    j = -10',
                        '    j = -i * -j',
                        '    addr j',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        50
                    ]
                );
            }
        );
        describe(
            'Test inc/dec operator',
            function() {
                testLogs(
                    it,
                    'Should inc local',
                    [
                        'proc main()',
                        '    number i = 10',
                        '    i++',
                        '    addr i',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        11
                    ]
                );
                testLogs(
                    it,
                    'Should dec local',
                    [
                        'proc main()',
                        '    number i = 10',
                        '    i--',
                        '    addr i',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        9
                    ]
                );
                testLogs(
                    it,
                    'Should inc global',
                    [
                        'number i = 10',
                        'proc main()',
                        '    i++',
                        '    addr i',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        11
                    ]
                );
                testLogs(
                    it,
                    'Should dec global',
                    [
                        'number i = 10',
                        'proc main()',
                        '    i--',
                        '    addr i',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        9
                    ]
                );
            }
        );
    }
);
