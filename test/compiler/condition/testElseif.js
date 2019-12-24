/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const testLogs = require('../../utils').testLogs;

describe(
    'Test elseif',
    function() {
        testLogs(
            it,
            'Should evaluate if',
            [
                'proc main()',
                '    number i = 2',
                '    number j = 0',
                '    if i == 2',
                '        j = 1',
                '    elseif i == 3',
                '        j = 2',
                '    else',
                '        j = 3',
                '    end',
                '    addr j',
                '    mod 0, 1',
                'end'
            ],
            [
                1
            ]
        );
        testLogs(
            it,
            'Should evaluate if..elseif',
            [
                'proc main()',
                '    number i = 3',
                '    number j = 0',
                '    if i == 2',
                '        j = 1',
                '    elseif i == 3',
                '        j = 2',
                '    else',
                '        j = 3',
                '    end',
                '    addr j',
                '    mod 0, 1',
                'end'
            ],
            [
                2
            ]
        );
        testLogs(
            it,
            'Should evaluate if..elseif..else',
            [
                'proc main()',
                '    number i = 4',
                '    number j = 0',
                '    if i == 2',
                '        j = 1',
                '    elseif i == 3',
                '        j = 2',
                '    else',
                '        j = 3',
                '    end',
                '    addr j',
                '    mod 0, 1',
                'end'
            ],
            [
                3
            ]
        );
    }
);
