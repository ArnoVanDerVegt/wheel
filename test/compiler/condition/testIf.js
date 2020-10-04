/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const testLogs = require('../../utils').testLogs;

describe(
    'Test if',
    () => {
        describe(
            'Test conditions',
            () => {
                testLogs(
                    it,
                    'Should evaluate equal true',
                    [
                        'number a',
                        'proc main()',
                        '    a = 99',
                        '    if a == 99',
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
                    'Should evaluate equal false',
                    [
                        'number a',
                        'proc main()',
                        '    a = 5',
                        '    if a == 99',
                        '        addr a',
                        '        mod 0, 1',
                        '    end',
                        'end'
                    ],
                    [
                    ]
                );
                testLogs(
                    it,
                    'Should evaluate not equal true',
                    [
                        'number a',
                        'proc main()',
                        '    a = 46',
                        '    if a != 45',
                        '        addr a',
                        '        mod 0, 1',
                        '    end',
                        'end'
                    ],
                    [
                        46
                    ]
                );
                testLogs(
                    it,
                    'Should evaluate not equal false',
                    [
                        'number a',
                        'proc main()',
                        '    a = 71',
                        '    if a != 71',
                        '        addr a',
                        '        mod 0, 1',
                        '    end',
                        'end'
                    ],
                    [
                    ]
                );
                testLogs(
                    it,
                    'Should evaluate less true',
                    [
                        'number a',
                        'proc main()',
                        '    a = 82',
                        '    if a < 100',
                        '        addr a',
                        '        mod 0, 1',
                        '    end',
                        'end'
                    ],
                    [
                        82
                    ]
                );
                testLogs(
                    it,
                    'Should evaluate less false',
                    [
                        'number a',
                        'proc main()',
                        '    a = 82',
                        '    if a < 23',
                        '        addr a',
                        '        mod 0, 1',
                        '    end',
                        'end'
                    ],
                    [
                    ]
                );
                testLogs(
                    it,
                    'Should evaluate less or equal true',
                    [
                        'number a',
                        'proc main()',
                        '    a = 17',
                        '    if a <= 34',
                        '        addr a',
                        '        mod 0, 1',
                        '    end',
                        'end'
                    ],
                    [
                        17
                    ]
                );
                testLogs(
                    it,
                    'Should evaluate less or equal true',
                    [
                        'number a',
                        'proc main()',
                        '    a = 99',
                        '    if a <= 99',
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
                    'Should evaluate less or equal false',
                    [
                        'number a',
                        'proc main()',
                        '    a = 101',
                        '    if a <= 99',
                        '        addr a',
                        '        mod 0, 1',
                        '    end',
                        'end'
                    ],
                    [
                    ]
                );
                testLogs(
                    it,
                    'Should evaluate greater true',
                    [
                        'number a',
                        'proc main()',
                        '    a = 50',
                        '    if a > 41',
                        '        addr a',
                        '        mod 0, 1',
                        '    end',
                        'end'
                    ],
                    [
                        50
                    ]
                );
                testLogs(
                    it,
                    'Should evaluate greater false',
                    [
                        'number a',
                        'proc main()',
                        '    a = 10',
                        '    if a > 30',
                        '        addr a',
                        '        mod 0, 1',
                        '    end',
                        'end'
                    ],
                    [
                    ]
                );
                testLogs(
                    it,
                    'Should evaluate greater equal true',
                    [
                        'number a',
                        'proc main()',
                        '    a = 78',
                        '    if a >= 61',
                        '        addr a',
                        '        mod 0, 1',
                        '    end',
                        'end'
                    ],
                    [
                        78
                    ]
                );
                testLogs(
                    it,
                    'Should evaluate greater equal true',
                    [
                        'number a',
                        'proc main()',
                        '    a = 34',
                        '    if a >= 34',
                        '        addr a',
                        '        mod 0, 1',
                        '    end',
                        'end'
                    ],
                    [
                        34
                    ]
                );
                testLogs(
                    it,
                    'Should evaluate greater equal false',
                    [
                        'number a',
                        'proc main()',
                        '    a = 9',
                        '    if a >= 34',
                        '        addr a',
                        '        mod 0, 1',
                        '    end',
                        'end'
                    ],
                    [
                    ]
                );
                testLogs(
                    it,
                    'Should evaluate array value',
                    [
                        'number a',
                        'proc main()',
                        '    number test[4] = [0, 1, 2, 3]',
                        '    a = 2',
                        '    if a != test[1]',
                        '        addr a',
                        '        mod 0, 1',
                        '    end',
                        'end'
                    ],
                    [
                        2
                    ]
                );
                testLogs(
                    it,
                    'Should evaluate array value with identifier index',
                    [
                        'number a, b',
                        'proc main()',
                        '    number test[4] = [0, 1, 2, 3]',
                        '    a = 2',
                        '    b = 1',
                        '    if a != test[b]',
                        '        addr a',
                        '        mod 0, 1',
                        '    end',
                        'end'
                    ],
                    [
                        2
                    ]
                );
            }
        );
        describe(
            'Test without condition operator',
            () => {
                testLogs(
                    it,
                    'Should evaluate true',
                    [
                        'number a',
                        'proc main()',
                        '    a = 13',
                        '    if a',
                        '        addr a',
                        '        mod 0, 1',
                        '    end',
                        'end'
                    ],
                    [
                        13
                    ]
                );
                testLogs(
                    it,
                    'Should evaluate false',
                    [
                        'number a',
                        'proc main()',
                        '    a = 0',
                        '    if a',
                        '        addr a',
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
                        '    a = 13',
                        '    b = 7',
                        '    if a and b',
                        '        addr b',
                        '        mod 0, 1',
                        '    end',
                        'end'
                    ],
                    [
                        7
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
                        '    if a and b',
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
                    'Should evaluate or true',
                    [
                        'number a',
                        'number b',
                        'proc main()',
                        '    a = 0',
                        '    b = 18',
                        '    if a or b',
                        '        addr b',
                        '        mod 0, 1',
                        '    end',
                        'end'
                    ],
                    [
                        18
                    ]
                );
                testLogs(
                    it,
                    'Should evaluate or false',
                    [
                        'number a',
                        'number b',
                        'proc main()',
                        '    a = 0',
                        '    b = 0',
                        '    if a or b',
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
        describe(
            'Test single condition',
            () => {
                testLogs(
                    it,
                    'Should evaluate true - if a == 1',
                    [
                        'number a',
                        'proc main()',
                        '    a = 1',
                        '    if a == 1',
                        '        addr a',
                        '        mod 0, 1',
                        '    end',
                        'end'
                    ],
                    [
                        1
                    ]
                );
                testLogs(
                    it,
                    'Should evaluate false - if a == 1',
                    [
                        'number a',
                        'proc main()',
                        '    a = 0',
                        '    if a == 1',
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
            'Test and',
            () => {
                testLogs(
                    it,
                    'Should evaluate true - if a == 4 and b == 5',
                    [
                        'number a',
                        'number b',
                        'proc main()',
                        '    a = 4',
                        '    b = 5',
                        '    if a == 4 and b == 5',
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
                    'Should evaluate false - if a == 4 and b == 5',
                    [
                        'number a',
                        'number b',
                        'proc main()',
                        '    a = 4',
                        '    b = 0',
                        '    if a == 4 and b == 5',
                        '        addr a',
                        '        mod 0, 1',
                        '    end',
                        'end'
                    ],
                    [
                    ]
                );
                testLogs(
                    it,
                    'Should evaluate false - if a == 4 and b == 5',
                    [
                        'number a',
                        'number b',
                        'proc main()',
                        '    a = 0',
                        '    b = 5',
                        '    if a == 4 and b == 5',
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
            'Test or',
            () => {
                testLogs(
                    it,
                    'Should evaluate true - if a == 3 or b == 0',
                    [
                        'number a',
                        'number b',
                        'proc main()',
                        '    a = 3',
                        '    b = 0',
                        '    if a == 3 or b == 0',
                        '        addr a',
                        '        mod 0, 1',
                        '    end',
                        'end'
                    ],
                    [
                        3
                    ]
                );
                testLogs(
                    it,
                    'Should evaluate true - if a == 3 or b == 9',
                    [
                        'number a',
                        'number b',
                        'proc main()',
                        '    a = 0',
                        '    b = 9',
                        '    if a == 3 or b == 9',
                        '        addr b',
                        '        mod 0, 1',
                        '    end',
                        'end'
                    ],
                    [
                        9
                    ]
                );
                testLogs(
                    it,
                    'Should evaluate false - if a == 4 or b == 19',
                    [
                        'number a',
                        'number b',
                        'proc main()',
                        '    a = 1',
                        '    b = 18',
                        '    if a == 4 or b == 19',
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
        describe(
            'Test and/or',
            () => {
                testLogs(
                    it,
                    'Should evaluate true - if a == 3 and b == 6 or c == 10',
                    [
                        'number a',
                        'number b',
                        'number c',
                        'proc main()',
                        '    a = 0',
                        '    b = 0',
                        '    c = 10',
                        '    if a == 3 and b == 6 or c == 10',
                        '        addr c',
                        '        mod 0, 1',
                        '    end',
                        'end'
                    ],
                    [
                        10
                    ]
                );
                testLogs(
                    it,
                    'Should evaluate true - if a == 3 and b == 6 or c == 10',
                    [
                        'number a',
                        'number b',
                        'number c',
                        'proc main()',
                        '    a = 3',
                        '    b = 6',
                        '    c = 0',
                        '    if a == 3 and b == 6 or c == 10',
                        '        addr b',
                        '        mod 0, 1',
                        '    end',
                        'end'
                    ],
                    [
                        6
                    ]
                );
                testLogs(
                    it,
                    'Should evaluate false - if a == 3 and b == 6 or c == 10',
                    [
                        'number a',
                        'number b',
                        'number c',
                        'proc main()',
                        '    a = 3',
                        '    b = 0',
                        '    c = 0',
                        '    if a == 3 and b == 6 or c == 10',
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
                    'Should evaluate false - if a == 3 and b == 6 or c == 10',
                    [
                        'number a',
                        'number b',
                        'number c',
                        'proc main()',
                        '    a = 0',
                        '    b = 6',
                        '    c = 0',
                        '    if a == 3 and b == 6 or c == 10',
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
        describe(
            'Test (or)/and/(or)',
            () => {
                testLogs(
                    it,
                    'Should evaluate true - if (a == 3 or b == 6) and (c == 10 or d == 1)',
                    [
                        'number a',
                        'number b',
                        'number c',
                        'number d',
                        'proc main()',
                        '    a = 3',
                        '    b = 0',
                        '    c = 10',
                        '    d = 0',
                        '    if (a == 3 or b == 6) and (c == 10 or d == 1)',
                        '        addr c',
                        '        mod 0, 1',
                        '    end',
                        'end'
                    ],
                    [
                        10
                    ]
                );
                testLogs(
                    it,
                    'Should evaluate true - if (a == 3 or b == 6) and (c == 10 or d == 1)',
                    [
                        'number a',
                        'number b',
                        'number c',
                        'number d',
                        'proc main()',
                        '    a = 0',
                        '    b = 6',
                        '    c = 0',
                        '    d = 1',
                        '    if (a == 3 or b == 6) and (c == 10 or d == 1)',
                        '        addr b',
                        '        mod 0, 1',
                        '    end',
                        'end'
                    ],
                    [
                        6
                    ]
                );
                testLogs(
                    it,
                    'Should evaluate false - if (a == 3 or b == 6) and (c == 10 or d == 1)',
                    [
                        'number a',
                        'number b',
                        'number c',
                        'number d',
                        'proc main()',
                        '    a = 0',
                        '    b = 0',
                        '    c = 10',
                        '    d = 1',
                        '    if (a == 3 or b == 6) and (c == 10 or d == 1)',
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
                    'Should evaluate false - if (a == 3 or b == 6) and (c == 10 or d == 1)',
                    [
                        'number a',
                        'number b',
                        'number c',
                        'number d',
                        'proc main()',
                        '    a = 3',
                        '    b = 6',
                        '    c = 0',
                        '    d = 0',
                        '    if (a == 3 or b == 6) and (c == 10 or d == 1)',
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
        describe(
            'Test if with proc result',
            () => {
                testLogs(
                    it,
                    'Should evaluate result as false',
                    [
                        'proc test()',
                        '    ret 0',
                        'end',
                        'proc main()',
                        '    if test()',
                        '        number n',
                        '        n = 5',
                        '        addr n',
                        '        mod 0, 1',
                        '    end',
                        'end'
                    ],
                    [
                    ]
                );
                testLogs(
                    it,
                    'Should evaluate result as true',
                    [
                        'proc test()',
                        '    ret 1',
                        'end',
                        'proc main()',
                        '    if test()',
                        '        number n',
                        '        n = 5',
                        '        addr n',
                        '        mod 0, 1',
                        '    end',
                        'end'
                    ],
                    [
                        5
                    ]
                );
            }
        );
        describe(
            'Test else',
            () => {
                testLogs(
                    it,
                    'Should evaluate if',
                    [
                        'proc main()',
                        '    number i = 1',
                        '    number j',
                        '    if i',
                        '        j = 40',
                        '    else',
                        '        j = 50',
                        '    end',
                        '    addr j',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        40
                    ]
                );
                testLogs(
                    it,
                    'Should evaluate else',
                    [
                        'proc main()',
                        '    number i = 0',
                        '    number j',
                        '    if i',
                        '        j = 40',
                        '    else',
                        '        j = 50',
                        '    end',
                        '    addr j',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        50
                    ]
                );
                testLogs(
                    it,
                    'Should evaluate nested if/else',
                    [
                        'proc main()',
                        '    number i = 0',
                        '    number j = 0',
                        '    number k',
                        '    if i',
                        '        if j',
                        '            k = 40',
                        '        else',
                        '            k = 80',
                        '        end',
                        '    else',
                        '        if j',
                        '            k = 50',
                        '        else',
                        '            k = 70',
                        '        end',
                        '    end',
                        '    addr k',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        70
                    ]
                );
                testLogs(
                    it,
                    'Should evaluate nested if/else',
                    [
                        'proc main()',
                        '    number i = 1',
                        '    number j = 0',
                        '    number k',
                        '    if i',
                        '        if j',
                        '            k = 40',
                        '        else',
                        '            k = 80',
                        '        end',
                        '    else',
                        '        if j',
                        '            k = 50',
                        '        else',
                        '            k = 70',
                        '        end',
                        '    end',
                        '    addr k',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        80
                    ]
                );
                testLogs(
                    it,
                    'Should evaluate nested if/else',
                    [
                        'proc main()',
                        '    number i = 1',
                        '    number j = 1',
                        '    number k',
                        '    if i',
                        '        if j',
                        '            k = 40',
                        '        else',
                        '            k = 80',
                        '        end',
                        '    else',
                        '        if j',
                        '            k = 50',
                        '        else',
                        '            k = 70',
                        '        end',
                        '    end',
                        '    addr k',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        40
                    ]
                );
                testLogs(
                    it,
                    'Should evaluate nested if/else',
                    [
                        'proc main()',
                        '    number i = 0',
                        '    number j = 1',
                        '    number k',
                        '    if i',
                        '        if j',
                        '            k = 40',
                        '        else',
                        '            k = 80',
                        '        end',
                        '    else',
                        '        if j',
                        '            k = 50',
                        '        else',
                        '            k = 70',
                        '        end',
                        '    end',
                        '    addr k',
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
            'Test if condition with expression',
            () => {
                testLogs(
                    it,
                    'Should evaluate single argument as true',
                    [
                        'proc main()',
                        '    number i = 2',
                        '    number j = 0',
                        '    if i * 2 == 4',
                        '        j = 40',
                        '    end',
                        '    addr j',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        40
                    ]
                );
                testLogs(
                    it,
                    'Should evaluate single argument as false',
                    [
                        'proc main()',
                        '    number i = 2',
                        '    number j = 0',
                        '    if i * 2 == 5',
                        '        j = 40',
                        '    end',
                        '    addr j',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        0
                    ]
                );
                testLogs(
                    it,
                    'Should evaluate double argument as true',
                    [
                        'proc main()',
                        '    number i = 2',
                        '    number j = 0',
                        '    if i * 2 == i + 2',
                        '        j = 50',
                        '    end',
                        '    addr j',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        50
                    ]
                );
                testLogs(
                    it,
                    'Should evaluate double argument as false',
                    [
                        'proc main()',
                        '    number i = 2',
                        '    number j = 0',
                        '    if i * 2 == i + 3',
                        '        j = 50',
                        '    end',
                        '    addr j',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        0
                    ]
                );
                testLogs(
                    it,
                    'Should evaluate double argument with and as true',
                    [
                        'proc main()',
                        '    number i = 2',
                        '    number j = 0',
                        '    if i * 2 == i + 2 and i + 5 == 7',
                        '        j = 78',
                        '    end',
                        '    addr j',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        78
                    ]
                );
                testLogs(
                    it,
                    'Should evaluate double argument with and as false',
                    [
                        'proc main()',
                        '    number i = 2',
                        '    number j = 0',
                        '    if i * 2 == i + 1 and i + 5 == 7',
                        '        j = 78',
                        '    end',
                        '    addr j',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        0
                    ]
                );
                testLogs(
                    it,
                    'Should evaluate double argument with and as true',
                    [
                        'proc main()',
                        '    number i = 2',
                        '    number j = 0',
                        '    if i * 2 == i + 2 and i + 4 == 7',
                        '        j = 78',
                        '    end',
                        '    addr j',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        0
                    ]
                );
            }
        );
        describe(
            'Test if condition in function removed by optimizer',
            () => {
                testLogs(
                    it,
                    'Should compile removed if...else',
                    [
                        'proc test(number motor)',
                        '    if motor == 2',
                        '        motor = 1',
                        '    else',
                        '        motor = 3',
                        '    end',
                        'end',
                        'proc main()',
                        'end'
                    ],
                    [
                    ]
                );
            }
        );
    }
);
