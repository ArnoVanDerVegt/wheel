/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const testLogs = require('../../utils').testLogs;

describe(
    'Test select',
    () => {
        describe(
            'Test select number',
            () => {
                testLogs(
                    it,
                    'Should select first case',
                    [
                        'proc main()',
                        '    number i, j',
                        '    i = 1',
                        '    select i',
                        '        case 1:',
                        '            j = 34',
                        '        case 2:',
                        '            j = 48',
                        '    end',
                        '    addr j',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        34
                    ]
                );
                testLogs(
                    it,
                    'Should select second case',
                    [
                        'proc main()',
                        '    number i, j',
                        '    i = 2',
                        '    select i',
                        '        case 1:',
                        '            j = 34',
                        '        case 2:',
                        '            j = 48',
                        '    end',
                        '    addr j',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        48
                    ]
                );
                testLogs(
                    it,
                    'Should select no case',
                    [
                        'proc main()',
                        '    number i, j',
                        '    i = 3',
                        '    j = 255',
                        '    select i',
                        '        case 1:',
                        '            j = 34',
                        '        case 2:',
                        '            j = 48',
                        '    end',
                        '    addr j',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        255
                    ]
                );
            }
        );
        describe(
            'Test select expression',
            () => {
                testLogs(
                    it,
                    'Should select expression',
                    [
                        'proc main()',
                        '    number i, j',
                        '    i = 3',
                        '    select i * 2',
                        '        case 6:',
                        '            j = 55',
                        '    end',
                        '    addr j',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        55
                    ]
                );
                testLogs(
                    it,
                    'Should not select expression',
                    [
                        'proc main()',
                        '    number i, j',
                        '    i = 3',
                        '    j = 255',
                        '    select i * 2',
                        '        case 5:',
                        '            j = 55',
                        '    end',
                        '    addr j',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        255
                    ]
                );
            }
        );
        describe(
            'Test select with default',
            () => {
                testLogs(
                    it,
                    'Should select first case',
                    [
                        'proc main()',
                        '    number i = 1',
                        '    number j',
                        '    select i',
                        '        case 1:',
                        '            j = 77',
                        '        default:',
                        '            j = 255',
                        '    end',
                        '    addr j',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        77
                    ]
                );
                testLogs(
                    it,
                    'Should select default case',
                    [
                        'proc main()',
                        '    number i = 2',
                        '    number j',
                        '    select i',
                        '        case 1:',
                        '            j = 77',
                        '        default:',
                        '            j = 255',
                        '    end',
                        '    addr j',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        255
                    ]
                );
            }
        );
    }
);
