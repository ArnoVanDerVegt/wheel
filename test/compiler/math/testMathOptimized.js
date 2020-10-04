/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const testCodeAndMemory = require('../../utils').testCodeAndMemory;
const testLogs          = require('../../utils').testLogs;

describe(
    'Test optimize math',
    () => {
        describe(
            'Test single operator',
            () => {
                testCodeAndMemory(
                    it,
                    'Replaces two added number constants with a single constant',
                    [
                        'number a',
                        'proc main()',
                        '    a = 5 + 10',
                        'end'
                    ],
                    [
                        '0000|0000 set     [9],            15'
                    ],
                    false
                );
                testCodeAndMemory(
                    it,
                    'Replaces two subtracted number constants with a single constant',
                    [
                        'number a',
                        'proc main()',
                        '    a = 10 - 5',
                        'end'
                    ],
                    [
                        '0000|0000 set     [9],            5'
                    ],
                    false
                );
                testCodeAndMemory(
                    it,
                    'Replaces two multiplied number constants with a single constant',
                    [
                        'number a',
                        'proc main()',
                        '    a = 5 * 10',
                        'end'
                    ],
                    [
                        '0000|0000 set     [9],            50'
                    ],
                    false
                );
                testCodeAndMemory(
                    it,
                    'Replaces two divided number constants with a single constant',
                    [
                        'number a',
                        'proc main()',
                        '    a = 10 / 5',
                        'end'
                    ],
                    [
                        '0000|0000 set     [9],            2'
                    ],
                    false
                );
            }
        );
        describe(
            'Test two operators',
            () => {
                testCodeAndMemory(
                    it,
                    'Replaces three added number constants with a single constant',
                    [
                        'number a',
                        'proc main()',
                        '    a = 5 + 10 + 7',
                        'end'
                    ],
                    [
                        '0000|0000 set     [9],            22'
                    ],
                    false
                );
                testCodeAndMemory(
                    it,
                    'Replaces three subtracted number constants with a single constant',
                    [
                        'number a',
                        'proc main()',
                        '    a = 25 - 10 - 7',
                        'end'
                    ],
                    [
                       '0000|0000 set     [9],            8'
                    ],
                    false
                );
                testCodeAndMemory(
                    it,
                    'Replaces three divided number constants with a single constant',
                    [
                        'number a',
                        'proc main()',
                        '    a = 30 / 3 / 2',
                        'end'
                    ],
                    [
                       '0000|0000 set     [9],            5'
                    ],
                    false
                );
                testCodeAndMemory(
                    it,
                    'Replaces three multiplied number constants with a single constant',
                    [
                        'number a',
                        'proc main()',
                        '    a = 30 * 3 * 2',
                        'end'
                    ],
                    [
                       '0000|0000 set     [9],            180'
                    ],
                    false
                );
            }
        );
        describe(
            'Test operator precedence',
            () => {
                testCodeAndMemory(
                    it,
                    'Replaces three number constants with a single constant using subtract and add',
                    [
                        'number a',
                        'proc main()',
                        '    a = 30 - 10 + 2',
                        'end'
                    ],
                    [
                        '0000|0000 set     [9],            22'
                    ],
                    false
                );
                testCodeAndMemory(
                   it,
                   'Replaces three number constants with a single constant using add and subtract',
                   [
                       'number a',
                       'proc main()',
                       '    a = 30 + 10 - 2',
                       'end'
                   ],
                   [
                       '0000|0000 set     [9],            38'
                   ],
                   false
                );
                testCodeAndMemory(
                    it,
                    'Replaces three number constants with a single constant using multiply and subtract',
                    [
                        'number a',
                        'proc main()',
                        '    a = 30 - 10 * 2',
                        'end'
                    ],
                    [
                        '0000|0000 set     [9],            10'
                    ],
                    false
                );
            }
        );
    }
);
