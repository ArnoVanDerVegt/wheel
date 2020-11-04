/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const testLogs = require('../../utils').testLogs;

describe(
    'Test with',
    () => {
        describe(
            'Test simple record with',
            () => {
                testLogs(
                    it,
                    'Should compile with',
                    [
                        'record Point',
                        '   number x, y',
                        'end',
                        'proc main()',
                        '    Point p',
                        '    with p',
                        '        x = 1367',
                        '        y = 5678',
                        '    end',
                        '    addr p.y',
                        '    mod 0, 1',
                        '    addr p.x',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        5678,
                        1367
                    ]
                );
                testLogs(
                    it,
                    'Should compile with with array',
                    [
                        'record Point',
                        '   number x, y',
                        'end',
                        'proc main()',
                        '    Point p[3]',
                        '    with p[1]',
                        '        x = 5655',
                        '        y = 9512',
                        '    end',
                        '    addr p[1].y',
                        '    mod 0, 1',
                        '    addr p[1].x',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        9512,
                        5655
                    ]
                );
                testLogs(
                    it,
                    'Should compile with with pointer',
                    [
                        'record Point',
                        '   number x, y',
                        'end',
                        'proc main()',
                        '    Point p',
                        '    Point ^pp',
                        '    pp = @p',
                        '    with pp',
                        '        x = 4646',
                        '        y = 9245',
                        '    end',
                        '    addr p.y',
                        '    mod 0, 1',
                        '    addr p.x',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        9245,
                        4646
                    ]
                );
                testLogs(
                    it,
                    'Should compile with with pointer to array',
                    [
                        'record Point',
                        '   number x, y',
                        'end',
                        'proc main()',
                        '    Point p',
                        '    Point ^pp[3]',
                        '    pp[1] = @p',
                        '    with pp[1]',
                        '        x = 4872',
                        '        y = 1835',
                        '    end',
                        '    addr p.y',
                        '    mod 0, 1',
                        '    addr p.x',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        1835,
                        4872
                    ]
                );
            }
        );
        describe(
            'Test nested record with',
            () => {
                testLogs(
                    it,
                    'Should use with record field',
                    [
                        'record Point',
                        '   number x, y',
                        'end',
                        'record Line',
                        '   Point p1, p2',
                        'end',
                        'proc main()',
                        '    Line l',
                        '    with l.p1',
                        '        x = 8341',
                        '        y = 8244',
                        '    end',
                        '    with l.p2',
                        '        x = 4821',
                        '        y = 8414',
                        '    end',
                        '    addr l.p1.y',
                        '    mod 0, 1',
                        '    addr l.p1.x',
                        '    mod 0, 1',
                        '    addr l.p2.y',
                        '    mod 0, 1',
                        '    addr l.p2.x',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        8244,
                        8341,
                        8414,
                        4821
                    ]
                );
                testLogs(
                    it,
                    'Should copy value to with field',
                    [
                        'record Point',
                        '   number x, y',
                        'end',
                        'record Line',
                        '   Point p1, p2',
                        'end',
                        'proc main()',
                        '    Line l',
                        '    Point pp',
                        '    pp.x = 3454',
                        '    pp.y = 8413',
                        '    with l',
                        '        p1 = pp',
                        '        p2 = pp',
                        '    end',
                        '    addr l.p1.y',
                        '    mod 0, 1',
                        '    addr l.p1.x',
                        '    mod 0, 1',
                        '    addr l.p2.y',
                        '    mod 0, 1',
                        '    addr l.p2.x',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        8413,
                        3454,
                        8413,
                        3454
                    ]
                );
                testLogs(
                    it,
                    'Should copy value from with field',
                    [
                        'record Point',
                        '   number x, y',
                        'end',
                        'record Line',
                        '   Point p1, p2',
                        'end',
                        'proc main()',
                        '    Line l',
                        '    Point pp1, pp2',
                        '    l.p1.x = 3454',
                        '    l.p1.y = 8413',
                        '    l.p2.x = 3231',
                        '    l.p2.y = 1571',
                        '    with l',
                        '        pp1 = p1',
                        '        pp2 = p2',
                        '    end',
                        '    addr pp1.y',
                        '    mod 0, 1',
                        '    addr pp1.x',
                        '    mod 0, 1',
                        '    addr pp2.y',
                        '    mod 0, 1',
                        '    addr pp2.x',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        8413,
                        3454,
                        1571,
                        3231
                    ]
                );
                testLogs(
                    it,
                    'Should use with nested with',
                    [
                        'record Point',
                        '   number x, y',
                        'end',
                        'record Line',
                        '   Point p1, p2',
                        'end',
                        'proc main()',
                        '    Line l',
                        '    with l',
                        '        with p1',
                        '            x = 3341',
                        '            y = 4244',
                        '        end',
                        '        with p2',
                        '            x = 5821',
                        '            y = 1414',
                        '        end',
                        '    end',
                        '    addr l.p1.y',
                        '    mod 0, 1',
                        '    addr l.p1.x',
                        '    mod 0, 1',
                        '    addr l.p2.y',
                        '    mod 0, 1',
                        '    addr l.p2.x',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        4244,
                        3341,
                        1414,
                        5821
                    ]
                );
                testLogs(
                    it,
                    'Should assign constant record',
                    [
                        'record Point',
                        '   number x, y',
                        'end',
                        'record Line',
                        '   Point p1, p2',
                        'end',
                        'proc main()',
                        '    Line l',
                        '    with l',
                        '        p1 = {1341, 2244}',
                        '        p2 = {3821, 4414}',
                        '    end',
                        '    addr l.p1.y',
                        '    mod 0, 1',
                        '    addr l.p1.x',
                        '    mod 0, 1',
                        '    addr l.p2.y',
                        '    mod 0, 1',
                        '    addr l.p2.x',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        2244,
                        1341,
                        4414,
                        3821
                    ]
                );
                testLogs(
                    it,
                    'Should compile with pointer',
                    [
                        'record Point',
                        '   number x, y',
                        'end',
                        'record Line',
                        '   Point ^p1, ^p2',
                        'end',
                        'proc main()',
                        '    Point pp1, pp2',
                        '    Line l',
                        '    with l',
                        '        p1 = @pp1',
                        '        p2 = @pp2',
                        '    end',
                        '    pp1.x = 1234',
                        '    pp1.y = 2855',
                        '    pp2.x = 4862',
                        '    pp2.y = 9924',
                        '    addr l.p1.y',
                        '    mod 0, 1',
                        '    addr l.p1.x',
                        '    mod 0, 1',
                        '    addr l.p2.y',
                        '    mod 0, 1',
                        '    addr l.p2.x',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        2855,
                        1234,
                        9924,
                        4862
                    ]
                );
            }
        );
        describe(
            'Test with with parameters',
            () => {
                testLogs(
                    it,
                    'Should call with record parameter',
                    [
                        'record Point',
                        '   number x, y',
                        'end',
                        'record Line',
                        '   Point p1, p2',
                        'end',
                        'proc test(Point p)',
                        '    addr p.y',
                        '    mod 0, 1',
                        '    addr p.x',
                        '    mod 0, 1',
                        'end',
                        'proc main()',
                        '    Line l',
                        '    l.p1.x = 3434',
                        '    l.p1.y = 5661',
                        '    l.p2.x = 2551',
                        '    l.p2.y = 6713',
                        '    with l',
                        '        test(p1)',
                        '        test(p2)',
                        '    end',
                        'end'
                    ],
                    [
                        5661,
                        3434,
                        6713,
                        2551
                    ]
                );
                testLogs(
                    it,
                    'Should call with record pointer parameter and dereference pointer',
                    [
                        'record Point',
                        '   number x, y',
                        'end',
                        'record Line',
                        '   Point ^p1, ^p2',
                        'end',
                        'proc test(Point p)',
                        '    addr p.y',
                        '    mod 0, 1',
                        '    addr p.x',
                        '    mod 0, 1',
                        'end',
                        'proc main()',
                        '    Line l',
                        '    Point pp1, pp2',
                        '    pp1.x = 8434',
                        '    pp1.y = 8661',
                        '    pp2.x = 8551',
                        '    pp2.y = 8713',
                        '    l.p1 = @pp1',
                        '    l.p2 = @pp2',
                        '    with l',
                        '        test(p1)',
                        '        test(p2)',
                        '    end',
                        'end'
                    ],
                    [
                        8661,
                        8434,
                        8713,
                        8551
                    ]
                );
                testLogs(
                    it,
                    'Should call with record pointer parameter',
                    [
                        'record Point',
                        '   number x, y',
                        'end',
                        'record Line',
                        '   Point ^pp1, ^pp2',
                        'end',
                        'proc test(Point ^p)', // Passed as a pointer, values should be changed after calling this!
                        '    p.y = p.y + 1',
                        '    p.x = p.x + 1',
                        'end',
                        'proc main()',
                        '    Line l',
                        '    Point p1, p2',
                        '    p1.x = 8434',
                        '    p1.y = 8661',
                        '    p2.x = 8551',
                        '    p2.y = 8713',
                        '    l.pp1 = @p1',
                        '    l.pp2 = @p2',
                        '    with l',
                        '        test(pp1)',
                        '        test(pp2)',
                        '    end',
                        '    addr l.pp1.y',
                        '    mod 0, 1',
                        '    addr l.pp1.x',
                        '    mod 0, 1',
                        '    addr l.pp2.y',
                        '    mod 0, 1',
                        '    addr l.pp2.x',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        8662,
                        8435,
                        8714,
                        8552
                    ]
                );
                testLogs(
                    it,
                    'Should call with record pointer parameter and dereference pointer and not change fields in proc',
                    [
                        'record Point',
                        '   number x, y',
                        'end',
                        'record Line',
                        '   Point ^pp1, ^pp2',
                        'end',
                        'proc test(Point p)', // Not passed as pointer so values should not be changed after calling this...
                        '    p.y = p.y + 1',
                        '    p.x = p.x + 1',
                        'end',
                        'proc main()',
                        '    Line l',
                        '    Point p1, p2',
                        '    p1.x = 8434',
                        '    p1.y = 8661',
                        '    p2.x = 8551',
                        '    p2.y = 8713',
                        '    l.pp1 = @p1',
                        '    l.pp2 = @p2',
                        '    with l',
                        '        test(pp1)',
                        '        test(pp2)',
                        '    end',
                        '    addr l.pp1.y',
                        '    mod 0, 1',
                        '    addr l.pp1.x',
                        '    mod 0, 1',
                        '    addr l.pp2.y',
                        '    mod 0, 1',
                        '    addr l.pp2.x',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        8661,
                        8434,
                        8713,
                        8551
                    ]
                );
            }
        );
        describe(
            'Test with with addr',
            () => {
                testLogs(
                    it,
                    'Should use addr with number fields',
                    [
                        'record Point',
                        '   number x, y',
                        'end',
                        'proc main()',
                        '    Point p',
                        '    p.x = 5581',
                        '    p.y = 5916',
                        '    with p',
                        '        addr x',
                        '        mod  0, 1',
                        '        addr y',
                        '        mod  0, 1',
                        '    end',
                        'end'
                    ],
                    [
                        5581,
                        5916
                    ]
                );
                testLogs(
                    it,
                    'Should use addr with nested record number fields',
                    [
                        'record Point',
                        '   number x, y',
                        'end',
                        'record Line',
                        '   Point p1, p2',
                        'end',
                        'proc main()',
                        '    Line l',
                        '    l.p1.x = 1581',
                        '    l.p1.y = 1916',
                        '    l.p2.x = 2581',
                        '    l.p2.y = 2916',
                        '    with l',
                        '        addr p1.x',
                        '        mod  0, 1',
                        '        addr p1.y',
                        '        mod  0, 1',
                        '        addr p2.x',
                        '        mod  0, 1',
                        '        addr p2.y',
                        '        mod  0, 1',
                        '    end',
                        'end'
                    ],
                    [
                        1581,
                        1916,
                        2581,
                        2916
                    ]
                );
                testLogs(
                    it,
                    'Should use addr with nested pointer record number fields',
                    [
                        'record Point',
                        '   number x, y',
                        'end',
                        'record Line',
                        '   Point ^p1, ^p2',
                        'end',
                        'proc main()',
                        '    Line l',
                        '    Point pp1, pp2',
                        '    pp1.x = 3581',
                        '    pp1.y = 3916',
                        '    pp2.x = 4581',
                        '    pp2.y = 4916',
                        '    l.p1 = @pp1',
                        '    l.p2 = @pp2',
                        '    with l',
                        '        addr p1.x',
                        '        mod  0, 1',
                        '        addr p1.y',
                        '        mod  0, 1',
                        '        addr p2.x',
                        '        mod  0, 1',
                        '        addr p2.y',
                        '        mod  0, 1',
                        '    end',
                        'end'
                    ],
                    [
                        3581,
                        3916,
                        4581,
                        4916
                    ]
                );
            }
        );
        describe(
            'Test with with arrays',
            () => {
                testLogs(
                    it,
                    'Should use array of records',
                    [
                        'record Point',
                        '   number x, y',
                        'end',
                        'record Line',
                        '   Point p[2]',
                        'end',
                        'proc test(Point p)',
                        '    addr p.y',
                        '    mod 0, 1',
                        '    addr p.x',
                        '    mod 0, 1',
                        'end',
                        'proc main()',
                        '    Line l',
                        '    with l.p[0]',
                        '        x = 4434',
                        '        y = 4661',
                        '    end',
                        '    with l.p[1]',
                        '        x = 5551',
                        '        y = 5713',
                        '    end',
                        '    with l',
                        '        test(p[0])',
                        '        test(p[1])',
                        '    end',
                        'end'
                    ],
                    [
                        4661,
                        4434,
                        5713,
                        5551
                    ]
                );
                testLogs(
                    it,
                    'Should use array of records with array',
                    [
                        'record Point',
                        '   number n[2]',
                        'end',
                        'record Line',
                        '   Point p[2]',
                        'end',
                        'proc test(Point p)',
                        '    addr p.n[1]',
                        '    mod 0, 1',
                        '    addr p.n[0]',
                        '    mod 0, 1',
                        'end',
                        'proc main()',
                        '    Line l',
                        '    with l.p[0]',
                        '        n[0] = 6434',
                        '        n[1] = 6661',
                        '    end',
                        '    with l.p[1]',
                        '        n[0] = 7551',
                        '        n[1] = 7713',
                        '    end',
                        '    with l',
                        '        test(p[0])',
                        '        test(p[1])',
                        '    end',
                        'end'
                    ],
                    [
                        6661,
                        6434,
                        7713,
                        7551
                    ]
                );
                testLogs(
                    it,
                    'Should use multidimensional array field',
                    [
                        'record Line',
                        '   number p[2][2]',
                        'end',
                        'proc main()',
                        '    Line l',
                        '    with l',
                        '        p[0][0] = 9434',
                        '        p[0][1] = 9661',
                        '        p[1][0] = 8551',
                        '        p[1][1] = 8713',
                        '    end',
                        '    number j, i',
                        '    for i = 0 to 1',
                        '        for j = 0 to 1',
                        '            addr l.p[i][j]',
                        '            mod  0, 1',
                        '        end',
                        '    end',
                        'end'
                    ],
                    [
                        9434,
                        9661,
                        8551,
                        8713
                    ]
                );
                /*testLogs(
                    it,
                    'Should use pointer to multidimensional array field',
                    [
                        'record Line',
                        '   number ^p[2][2]',
                        'end',
                        'proc main()',
                        '    Line l',
                        '    number pp[2][2]',
                        '    pp[0][0] = 1434',
                        '    pp[0][1] = 1661',
                        '    pp[1][0] = 2551',
                        '    pp[1][1] = 2713',
                        '    number j, i',
                        '    with l',
                        '        p = @pp',
                        '        for i = 0 to 1',
                        '            for j = 0 to 1',
                        '                addr l.p[i][j]',
                        '                mod  0, 1',
                        '            end',
                        '        end',
                        '    end',
                        'end'
                    ],
                    [
                        1434,
                        1661,
                        2551,
                        2713
                    ]
                );*/
            }
        );
    }
);
