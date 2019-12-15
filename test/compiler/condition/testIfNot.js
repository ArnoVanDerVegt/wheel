/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const testLogs = require('../../utils').testLogs;
const testCodeAndMemory = require('../../utils').testCodeAndMemory;

describe(
    'Test if not',
    function() {
        describe(
            'Test conditions',
            function() {
                testLogs(
                    it,
                    'Should evaluate equal true',
                    [
                        'number a',
                        'proc main()',
                        '    a = 99',
                        '    if not a == 10',
                        '        addr a',
                        '        mod 0, 1',
                        '    end',
                        'end'
                    ],
                    [
                        99
                    ]
                );
                testLogs(
                    it,
                    'Should evaluate not equal true',
                    [
                        'number a',
                        'proc main()',
                        '    a = 99',
                        '    if not a == 99',
                        '        addr a',
                        '        mod 0, 1',
                        '    end',
                        'end'
                    ],
                    [
                    ]
                );
            }
        );
        describe(
            'Test without condition operator',
            function() {
                testLogs(
                    it,
                    'Should evaluate true',
                    [
                        'number a',
                        'proc main()',
                        '    a = 0',
                        '    if not a',
                        '        addr a',
                        '        mod 0, 1',
                        '    end',
                        'end'
                    ],
                    [
                        0
                    ]
                );
                testLogs(
                    it,
                    'Should evaluate and false',
                    [
                        'number a',
                        'number b',
                        'proc main()',
                        '    a = 0',
                        '    b = 9',
                        '    if not a and not b',
                        '        addr b',
                        '        mod 0, 1',
                        '    end',
                        'end'
                    ],
                    [
                    ]
                );
                testLogs(
                    it,
                    'Should evaluate and true',
                    [
                        'number a',
                        'number b',
                        'proc main()',
                        '    a = 0',
                        '    b = 0',
                        '    if not a and not b',
                        '        addr b',
                        '        mod 0, 1',
                        '    end',
                        'end'
                    ],
                    [
                        0
                    ]
                );
            }
        );
        describe(
            'Test and not',
            function() {
                testLogs(
                    it,
                    'Should evaluate true - if a == 4 and not b == 5',
                    [
                        'number a',
                        'number b',
                        'proc main()',
                        '    a = 4',
                        '    b = 6',
                        '    if a == 4 and not b == 5',
                        '        addr a',
                        '        mod 0, 1',
                        '    end',
                        'end'
                    ],
                    [
                        4
                    ]
                );
                testLogs(
                    it,
                    'Should evaluate true - if not a == 4 and b == 5',
                    [
                        'number a',
                        'number b',
                        'proc main()',
                        '    a = 5',
                        '    b = 5',
                        '    if not a == 4 and b == 5',
                        '        addr b',
                        '        mod 0, 1',
                        '    end',
                        'end'
                    ],
                    [
                        5
                    ]
                );
                testLogs(
                    it,
                    'Should evaluate true - if not a == 4 and not b == 5',
                    [
                        'number a',
                        'number b',
                        'proc main()',
                        '    a = 4',
                        '    b = 5',
                        '    if not a == 4 and not b == 5',
                        '        addr b',
                        '        mod 0, 1',
                        '    end',
                        'end'
                    ],
                    [
                    ]
                );
            }
        );
    }
);
