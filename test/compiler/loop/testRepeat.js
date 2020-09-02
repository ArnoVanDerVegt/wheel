/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const testLogs = require('../../utils').testLogs;

describe(
    'Test repeat',
    () => {
        testLogs(
            it,
            'Should repeat ten times',
            [
                'proc main()',
                '    number i',
                '    i = 0',
                '    repeat',
                '        addr i',
                '        mod 0, 1',
                '        i += 1',
                '        if i > 9',
                '            break',
                '        end',
                '    end',
                'end'
            ],
            [
                0, 1, 2, 3, 4, 5, 6, 7, 8, 9
            ]
        );
        testLogs(
            it,
            'Should break to outer loop',
            [
                'proc main()',
                '    number x = 0',
                '    repeat loop',
                '        x += 1',
                '        repeat',
                '            x += 1',
                '            if (x > 10)',
                '                break loop',
                '            end',
                '            addr x',
                '            mod 0, 1',
                '        end',
                '    end',
                'end'
            ],
            [
                2, 3, 4, 5, 6, 7, 8, 9, 10
            ]
        );
    }
);
