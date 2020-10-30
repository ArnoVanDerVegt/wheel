/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const testCodeAndMemory = require('../../utils').testCodeAndMemory;
const testLogs          = require('../../utils').testLogs;

describe(
    'Test pointers',
    () => {
        describe(
            'Test number',
            () => {
                testLogs(
                    it,
                    'Should assign number pointer',
                    [
                        'proc main()',
                        '    number ^n',
                        '    number n1, n2',
                        '    n1 = 719',
                        '    n = @n1',
                        '    n2 = n',
                        '    addr n2',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        719
                    ]
                );
                testLogs(
                    it,
                    'Should assign number parameter pointer',
                    [
                        'proc test(number ^n)',
                        '    n = 37',
                        'end',
                        'proc main()',
                        '    number ^i',
                        '    test(i)',
                        '    number j',
                        '    j = i',
                        '    addr j',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        37
                    ]
                );
                testLogs(
                    it,
                    'Should assign number pointer',
                    [
                        'proc main()',
                        '    number ^n',
                        '    number n1, n2',
                        '    n1 = 79',
                        '    n = @n1',
                        '    n2 = n',
                        '    addr n2',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        79
                    ]
                );
            }
        );
        describe(
            'Test strings',
            () => {
                testLogs(
                    it,
                    'Should use a string pointer parameter',
                    [
                        'proc test(string ^s)',
                        '    addr s',
                        '    mod  0, 2',
                        'end',
                        'proc main()',
                        '    string s = "Hello pointer!"',
                        '    test(@s)',
                        'end'
                    ],
                    [
                        'Hello pointer!'
                    ]
                );
                testLogs(
                    it,
                    'Should use a string pointer parameter',
                    [
                        'proc test(string ^s)',
                        '    s = "New value"',
                        'end',
                        'proc main()',
                        '    string s = "Old value"',
                        '    addr s',
                        '    mod  0, 2',
                        '    test(@s)',
                        '    addr s',
                        '    mod  0, 2',
                        'end'
                    ],
                    [
                        'Old value',
                        'New value'
                    ]
                );
                testLogs(
                    it,
                    'Should use a string pointer parameter',
                    [
                        'proc stringToNum(string ^s)',
                        '    addr s',
                        '    mod  0, 2',
                        'end',
                        'proc main()',
                        '    string s = "Hello pointer!"',
                        '    stringToNum(@s)',
                        'end'
                    ],
                    [
                        'Hello pointer!'
                    ]
                );
            }
        );
        describe(
            'Test records',
            () => {
                testLogs(
                    it,
                    'Should use a record pointer parameter',
                    [
                        'record Point',
                        '    number x, y',
                        'end',
                        'proc test(Point ^point)',
                        '    point.x = 55',
                        'end',
                        'proc main()',
                        '    Point p',
                        '    p.x = 67',
                        '    addr p.x',
                        '    mod 0, 1',
                        '    test(@p)',
                        '    addr p.x',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        67,
                        55
                    ]
                );
                testLogs(
                    it,
                    'Should use a record pointer parameter passed as parameter',
                    [
                        'record Point',
                        '    number x, y',
                        'end',
                        'proc test1(Point ^point)',
                        '    point.x = 259',
                        'end',
                        'proc test2(Point ^point)',
                        '    test1(point)',
                        'end',
                        'proc main()',
                        '    Point p',
                        '    p.x = 463',
                        '    addr p.x',
                        '    mod 0, 1',
                        '    test1(@p)',
                        '    addr p.x',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        463,
                        259
                    ]
                );
                testLogs(
                    it,
                    'Should use a record with a record field pointer parameter',
                    [
                        'record Point',
                        '    number x, y',
                        'end',
                        'record Test',
                        '    Point p',
                        'end',
                        'proc test(Test ^test)',
                        '    test.p.x = 1276',
                        'end',
                        'proc main()',
                        '    Test t',
                        '    t.p.x = 454',
                        '    addr t.p.x',
                        '    mod 0, 1',
                        '    test(@t)',
                        '    addr t.p.x',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        454,
                        1276
                    ]
                );
                testLogs(
                    it,
                    'Should use assign and read a record pointer',
                    [
                        'proc main()',
                        '    record Point',
                        '        number x, y',
                        '    end',
                        '    Point p',
                        '    record Line',
                        '        Point p1, ^p2',
                        '    end',
                        '    Line l',
                        '    p.x = 377',
                        '    p.y = 567',
                        '    l.p2 = @p',
                        '    addr l.p2.x',
                        '    mod 0, 1',
                        '    addr l.p2.y',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        377,
                        567
                    ]
                );
                testLogs(
                    it,
                    'Should use assign and read a record pointer to pointer',
                    [
                        'proc main()',
                        '    record Point',
                        '        number x, y',
                        '    end',
                        '    Point p',
                        '    record Line',
                        '        Point p1, ^p2',
                        '    end',
                        '    Line l, ^lp',
                        '    p.x = 534',
                        '    p.y = 799',
                        '    l.p2 = @p',
                        '    lp = @l',
                        '    addr lp.p2.x',
                        '    mod 0, 1',
                        '    addr lp.p2.y',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        534,
                        799
                    ]
                );
                testLogs(
                    it,
                    'Should use assign and read a record pointer to pointer to number pointer',
                    [
                        'proc main()',
                        '    record Point',
                        '        number x, ^y',
                        '    end',
                        '    Point p',
                        '    record Line',
                        '        Point p1, ^p2',
                        '    end',
                        '    Line l, ^lp',
                        '    p.x = 3487',
                        '    number n = 6789',
                        '    p.y = @n',
                        '    l.p2 = @p',
                        '    lp = @l',
                        '    addr lp.p2.x',
                        '    mod 0, 1',
                        '    addr lp.p2.y',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        3487,
                        6789
                    ]
                );
                testLogs(
                    it,
                    'Should use assign the address to a pointer to pointer',
                    [
                        'proc main()',
                        '    record Point',
                        '        number x, ^y',
                        '    end',
                        '    Point p',
                        '    record Line',
                        '        Point p1, ^p2',
                        '    end',
                        '    Line l, ^lp',
                        '    p.x = 244',
                        '    number n = 926',
                        '    l.p2 = @p',
                        '    lp = @l',
                        '    lp.p2.y = @n',
                        '    addr lp.p2.x',
                        '    mod 0, 1',
                        '    addr lp.p2.y',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        244,
                        926
                    ]
                );
                testLogs(
                    it,
                    'Should assign and read pointer to array of records',
                    [
                        'record Point',
                        '    number x, y',
                        'end',
                        'proc main()',
                        '    Point point',
                        '    Point ^p[4]',
                        '    p[3] = @point',
                        '    p[3].y = 59',
                        '    addr point.y',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        59
                    ]
                );
                testLogs(
                    it,
                    'Should call with a pointer to a record in an array',
                    [
                        'record Point',
                        '    number x, y',
                        'end',
                        'proc test(Point ^point)',
                        '    addr point.y',
                        '    mod 0, 1',
                        'end',
                        'proc main()',
                        '    Point point',
                        '    Point ^p[4]',
                        '    p[3] = @point',
                        '    p[3].y = 354',
                        '    test(p[3])',
                        'end'
                    ],
                    [
                        354
                    ]
                );
                testLogs(
                    it,
                    'Should call with a pointer to a record in an array and set by reference',
                    [
                        'record Point',
                        '    number x, y',
                        'end',
                        'proc test(Point ^point)',
                        '    point.y = 492',
                        'end',
                        'proc main()',
                        '    Point point',
                        '    Point ^p[4]',
                        '    p[3] = @point',
                        '    test(p[3])',
                        '    addr point.y',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        492
                    ]
                );
                testLogs(
                    it,
                    'Should use a record pointer with an array of records as parameter',
                    [
                        'record Point',
                        '    number x, y',
                        'end',
                        'record Test',
                        '    Point p[2]',
                        'end',
                        'proc test(Test ^test)',
                        '    test.p[0].x = 1276',
                        '    test.p[1].x = 457',
                        'end',
                        'proc main()',
                        '    Test t',
                        '    t.p[0].x = 454',
                        '    addr t.p[0].x',
                        '    mod 0, 1',
                        '    t.p[1].x = 1454',
                        '    addr t.p[1].x',
                        '    mod 0, 1',
                        '    test(@t)',
                        '    addr t.p[0].x',
                        '    mod 0, 1',
                        '    addr t.p[1].x',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        454,
                        1454,
                        1276,
                        457
                    ]
                );
                testLogs(
                    it,
                    'Should use a record pointer with various assignments',
                    [
                        'record Point',
                        '    number x, y',
                        'end',
                        'record Test',
                        '    Point p[2]',
                        'end',
                        'proc test(Test ^test)',
                        '    addr test.p[0].x',
                        '    mod 0, 1',
                        '    addr test.p[0].y',
                        '    mod 0, 1',
                        '    addr test.p[1].x',
                        '    mod 0, 1',
                        '    test.p[0] = {4566, 179}',
                        '    test.p[1] = {1285, 12}',
                        'end',
                        'proc main()',
                        '    Test t',
                        '    t.p[0].x = 454',
                        '    t.p[0].y = 2345',
                        '    addr t.p[0].x',
                        '    mod 0, 1',
                        '    t.p[1].x = 1454',
                        '    addr t.p[1].x',
                        '    mod 0, 1',
                        '    test(@t)',
                        '    addr t.p[0].x',
                        '    mod 0, 1',
                        '    addr t.p[1].x',
                        '    mod 0, 1',
                        '    addr t.p[0].y',
                        '    mod 0, 1',
                        '    addr t.p[1].y',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        454,
                        1454,
                        454,
                        2345,
                        1454,
                        4566,
                        1285,
                        179,
                        12
                    ]
                );
            }
        );
        describe(
            'Test pointer parameter',
            () => {
                testLogs(
                    it,
                    'Should use a pointer to record parameter',
                    [
                        'record Point',
                        '    number x, y',
                        'end',
                        'proc test(Point ^p)',
                        '    addr p.x',
                        '    mod 0, 1',
                        '    addr p.y',
                        '    mod 0, 1',
                        'end',
                        'proc main()',
                        '    Point p',
                        '    p.x = 38',
                        '    p.y = 125',
                        '    record Line',
                        '        Point ^p1',
                        '    end',
                        '    Line l',
                        '    l.p1 = @p',
                        '    test(l.p1)',
                        'end'
                    ],
                    [
                        38,
                        125
                    ]
                );
                testLogs(
                    it,
                    'Should use a pointer to record parameter with two pointers',
                    [
                        'record Point',
                        '    number ^x, ^y',
                        'end',
                        'proc test(Point ^p)',
                        '    addr p.x',
                        '    mod 0, 1',
                        '    addr p.y',
                        '    mod 0, 1',
                        'end',
                        'proc main()',
                        '    Point p',
                        '    number x, y',
                        '    x = 138',
                        '    y = 25',
                        '    p.x = @x',
                        '    p.y = @y',
                        '    record Line',
                        '        Point ^p1',
                        '    end',
                        '    Line l',
                        '    l.p1 = @p',
                        '    test(l.p1)',
                        'end'
                    ],
                    [
                        138,
                        25
                    ]
                );
                testLogs(
                    it,
                    'Should use a pointer array parameter with zero index',
                    [
                        'proc test(number ^p[4])',
                        '    p[0] = 45',
                        'end',
                        'proc main()',
                        '    number n[4]',
                        '    test(@n)',
                        '    addr n[0]',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        45
                    ]
                );
                testLogs(
                    it,
                    'Should use a pointer array parameter with non zero index',
                    [
                        'proc test(number ^p[4])',
                        '    p[1] = 825',
                        'end',
                        'proc main()',
                        '    number n[4]',
                        '    test(@n)',
                        '    addr n[1]',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        825
                    ]
                );
            }
        );
    }
);
