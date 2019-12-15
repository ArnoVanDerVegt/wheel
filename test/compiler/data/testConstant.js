/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const testLogs = require('../../utils').testLogs;

describe(
    'Test constant',
    function() {
        describe(
            'Test number',
            function() {
                testLogs(
                    it,
                    'Should declare global constant number',
                    [
                        'number a = 29',
                        'proc main()',
                        '    addr a',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        29
                    ]
                );
                testLogs(
                    it,
                    'Should declare global constant numbers',
                    [
                        'number a = 45',
                        'number b = 197',
                        'proc main()',
                        '    addr a',
                        '    mod 0, 1',
                        '    addr b',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        45, 197
                    ]
                );
                testLogs(
                    it,
                    'Should declare global constant numbers',
                    [
                        'number a = 566, b = 4644',
                        'proc main()',
                        '    addr a',
                        '    mod 0, 1',
                        '    addr b',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        566, 4644
                    ]
                );
                testLogs(
                    it,
                    'Should declare local constant number',
                    [
                        'proc main()',
                        '    number a = 991',
                        '    addr a',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        991
                    ]
                );
                testLogs(
                    it,
                    'Should declare local constant number',
                    [
                        'proc main()',
                        '    number a = 289',
                        '    number b = 2133',
                        '    addr a',
                        '    mod 0, 1',
                        '    addr b',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        289, 2133
                    ]
                );
            }
        );
    }
);
