/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const testLogs = require('../../utils').testLogs;

describe(
    'Test elseif',
    function() {
        describe(
            'Test elseif without parenthesis',
            function() {
                testLogs(
                    it,
                    'Should evaluate if',
                    [
                        'proc main()',
                        '    number i = 2',
                        '    number j = 0',
                        '    if i == 2',
                        '        j = 100',
                        '    elseif i == 3',
                        '        j = 200',
                        '    else',
                        '        j = 300',
                        '    end',
                        '    addr j',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        100
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
                        '        j = 14',
                        '    elseif i == 3',
                        '        j = 24',
                        '    else',
                        '        j = 34',
                        '    end',
                        '    addr j',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        24
                    ]
                );
                testLogs(
                    it,
                    'Should evaluate if..elseif..elseif',
                    [
                        'proc main()',
                        '    number i = 4',
                        '    number j = 0',
                        '    if i == 2',
                        '        j = 19',
                        '    elseif i == 3',
                        '        j = 27',
                        '    elseif i == 4',
                        '        j = 25',
                        '    else',
                        '        j = 356',
                        '    end',
                        '    addr j',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        25
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
        describe(
            'Test elseif with parenthesis',
            function() {
                testLogs(
                    it,
                    'Should evaluate if',
                    [
                        'proc main()',
                        '    number i = 2',
                        '    number j = 0',
                        '    if (i == 2)',
                        '        j = 100',
                        '    elseif (i == 3)',
                        '        j = 200',
                        '    else',
                        '        j = 300',
                        '    end',
                        '    addr j',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        100
                    ]
                );
                testLogs(
                    it,
                    'Should evaluate if..elseif',
                    [
                        'proc main()',
                        '    number i = 3',
                        '    number j = 0',
                        '    if (i == 2)',
                        '        j = 114',
                        '    elseif (i == 3)',
                        '        j = 124',
                        '    else',
                        '        j = 134',
                        '    end',
                        '    addr j',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        124
                    ]
                );
                testLogs(
                    it,
                    'Should evaluate if..elseif..elseif',
                    [
                        'proc main()',
                        '    number i = 4',
                        '    number j = 0',
                        '    if (i == 2)',
                        '        j = 19',
                        '    elseif (i == 3)',
                        '        j = 27',
                        '    elseif (i == 4)',
                        '        j = 25',
                        '    else',
                        '        j = 356',
                        '    end',
                        '    addr j',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        25
                    ]
                );
                testLogs(
                    it,
                    'Should evaluate if..elseif..else',
                    [
                        'proc main()',
                        '    number i = 4',
                        '    number j = 0',
                        '    if (i == 2)',
                        '        j = 111',
                        '    elseif (i == 3)',
                        '        j = 112',
                        '    else',
                        '        j = 113',
                        '    end',
                        '    addr j',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        113
                    ]
                );
            }
        );
        describe(
            'Test elseif with not',
            function() {
                testLogs(
                    it,
                    'Should evaluate if',
                    [
                        'proc main()',
                        '    number i = 5',
                        '    number j = 0',
                        '    if (i == 2)',
                        '        j = 100',
                        '    elseif not (i == 3)',
                        '        j = 200',
                        '    end',
                        '    addr j',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        200
                    ]
                );
            }
        );
    }
);
