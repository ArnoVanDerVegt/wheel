/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const testLogs = require('../../utils').testLogs;

describe(
    'Test while',
    function() {
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
