/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const testLogs = require('../../utils').testLogs;

describe(
    'Test while',
    () => {
        describe(
            'Test with local variable in condition',
            () => {
                testLogs(
                    it,
                    'Should repeat five times',
                    [
                        'proc main()',
                        '    number i',
                        '    i = 0',
                        '    while i < 5',
                        '        i += 1',
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
                    'Should repeat while i > 0',
                    [
                        'proc main()',
                        '    number i',
                        '    i = 5',
                        '    while i > 0',
                        '        i--',
                        '        addr i',
                        '        mod 0, 1',
                        '    end',
                        'end'
                    ],
                    [
                        4, 3, 2, 1, 0
                    ]
                );
                testLogs(
                    it,
                    'Should repeat while not i',
                    [
                        'proc main()',
                        '    number i',
                        '    i = 0',
                        '    while not i',
                        '        i++',
                        '        addr i',
                        '        mod 0, 1',
                        '    end',
                        'end'
                    ],
                    [
                        1
                    ]
                );
            }
        );
        describe(
            'Test with proc result in condition',
            () => {
                testLogs(
                    it,
                    'Should repeat while proc result is not 0',
                    [
                        'number g = 5',
                        'proc test()',
                        '    addr g',
                        '    mod 0, 1',
                        '    g--',
                        '    ret g',
                        'end',
                        'proc main()',
                        '    while test()',
                        '    end',
                        'end'
                    ],
                    [
                        5, 4, 3, 2, 1
                    ]
                );
                testLogs(
                    it,
                    'Should repeat while proc result is 0',
                    [
                        'number g = -1',
                        'proc test()',
                        '    addr g',
                        '    mod 0, 1',
                        '    g++',
                        '    ret g',
                        'end',
                        'proc main()',
                        '    while test() == 0',
                        '    end',
                        'end'
                    ],
                    [
                        -1,
                        0
                    ]
                );
                testLogs(
                    it,
                    'Should repeat while proc result is not true',
                    [
                        'number g = -1',
                        'proc test()',
                        '    addr g',
                        '    mod 0, 1',
                        '    g++',
                        '    ret g',
                        'end',
                        'proc main()',
                        '    while not test()',
                        '    end',
                        'end'
                    ],
                    [
                        -1,
                        0
                    ]
                );
            }
        );
    }
);
