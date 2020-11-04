/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const testLogs = require('../../utils').testLogs;
const testCodeAndMemory = require('../../utils').testCodeAndMemory;

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
                    'Should compile with record field',
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
                    'Should compile with nested with',
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
                    'Should call with record pointer parameter',
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
                        '    Point p1, p2',
                        '    p1.x = 8434',
                        '    p1.y = 8661',
                        '    p2.x = 8551',
                        '    p2.y = 8713',
                        '    l.p1 = @p1',
                        '    l.p2 = @p2',
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
            }
        );
    }
);
