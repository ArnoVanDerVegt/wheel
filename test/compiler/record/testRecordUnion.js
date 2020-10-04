/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const testCodeAndMemory = require('../../utils').testCodeAndMemory;
const testLogs          = require('../../utils').testLogs;

describe(
    'Test record unions',
    () => {
        describe(
            'Test single union',
            () => {
                testLogs(
                    it,
                    'Should declare a union record',
                    [
                        'record Point',
                        '    number x',
                        '    number y',
                        'union',
                        '    number values[2]',
                        'end',
                        'proc main()',
                        '    Point p',
                        'end'
                    ],
                    [
                    ]
                );
                testLogs(
                    it,
                    'Should assign a union record, test first array index and field - write array',
                    [
                        'record Point',
                        '    number x',
                        '    number y',
                        'union',
                        '    number values[2]',
                        'end',
                        'proc main()',
                        '    Point p',
                        '    p.values[0] = 456',
                        '    addr p.x',
                        '    mod  0, 1',
                        'end'
                    ],
                    [
                        456
                    ]
                );
                testLogs(
                    it,
                    'Should assign a union record, test last array index and field - write array',
                    [
                        'record Point',
                        '    number x',
                        '    number y',
                        'union',
                        '    number values[2]',
                        'end',
                        'proc main()',
                        '    Point p',
                        '    p.values[1] = 123',
                        '    addr p.y',
                        '    mod  0, 1',
                        'end'
                    ],
                    [
                        123
                    ]
                );
                testLogs(
                    it,
                    'Should assign a union record, test first and last array index and field - write array',
                    [
                        'record Point',
                        '    number x',
                        '    number y',
                        'union',
                        '    number values[2]',
                        'end',
                        'proc main()',
                        '    Point p',
                        '    p.values[0] = 8516',
                        '    p.values[1] = 9843',
                        '    addr p.x',
                        '    mod  0, 1',
                        '    addr p.y',
                        '    mod  0, 1',
                        'end'
                    ],
                    [
                        8516, 9843
                    ]
                );
                testLogs(
                    it,
                    'Should assign a union record, test first array index and field - write field',
                    [
                        'record Point',
                        '    number x',
                        '    number y',
                        'union',
                        '    number values[2]',
                        'end',
                        'proc main()',
                        '    Point p',
                        '    p.x = 456',
                        '    addr p.values[0]',
                        '    mod  0, 1',
                        'end'
                    ],
                    [
                        456
                    ]
                );
                testLogs(
                    it,
                    'Should assign a union record, test last array index and field - write field',
                    [
                        'record Point',
                        '    number x',
                        '    number y',
                        'union',
                        '    number values[2]',
                        'end',
                        'proc main()',
                        '    Point p',
                        '    p.y = 123',
                        '    addr p.values[1]',
                        '    mod  0, 1',
                        'end'
                    ],
                    [
                        123
                    ]
                );
                testLogs(
                    it,
                    'Should assign a union record, test first and last array index and field - write field',
                    [
                        'record Point',
                        '    number x',
                        '    number y',
                        'union',
                        '    number values[2]',
                        'end',
                        'proc main()',
                        '    Point p',
                        '    p.x = 8516',
                        '    p.y = 9843',
                        '    addr p.values[0]',
                        '    mod  0, 1',
                        '    addr p.values[1]',
                        '    mod  0, 1',
                        'end'
                    ],
                    [
                        8516, 9843
                    ]
                );
            }
        );
        describe(
            'Test double union',
            () => {
                testLogs(
                    it,
                    'Should declare a double union record',
                    [
                        'record SwappedPoint',
                        '    number y',
                        '    number x',
                        'end',
                        'record Point',
                        '    number x',
                        '    number y',
                        'union',
                        '    number values[2]',
                        'union',
                        '    SwappedPoint swapped',
                        'end',
                        'proc main()',
                        '    Point p',
                        'end'
                    ],
                    [
                    ]
                );
                testLogs(
                    it,
                    'Should assign fields and read as record fields',
                    [
                        'record SwappedPoint',
                        '    number y',
                        '    number x',
                        'end',
                        'record Point',
                        '    number x',
                        '    number y',
                        'union',
                        '    number values[2]',
                        'union',
                        '    SwappedPoint swapped',
                        'end',
                        'proc main()',
                        '    Point p',
                        '    p.x = 4646',
                        '    p.y = 7782',
                        '    addr p.swapped.x',
                        '    mod  0, 1',
                        '    addr p.swapped.y',
                        '    mod  0, 1',
                        'end'
                    ],
                    [
                        7782, 4646
                    ]
                );
                testLogs(
                    it,
                    'Should assign array index and read as record fields',
                    [
                        'record SwappedPoint',
                        '    number y',
                        '    number x',
                        'end',
                        'record Point',
                        '    number x',
                        '    number y',
                        'union',
                        '    number values[2]',
                        'union',
                        '    SwappedPoint swapped',
                        'end',
                        'proc main()',
                        '    Point p',
                        '    p.values[0] = 5223',
                        '    p.values[1] = 1237',
                        '    addr p.swapped.x',
                        '    mod  0, 1',
                        '    addr p.swapped.y',
                        '    mod  0, 1',
                        'end'
                    ],
                    [
                        1237, 5223
                    ]
                );
            }
        );
        describe(
            'Test nested union',
            () => {
                testLogs(
                    it,
                    'Should assign a nested union record - test first array index and field - write array',
                    [
                        'record Point',
                        '    number x',
                        '    number y',
                        'union',
                        '    number values[2]',
                        'end',
                        'record Line',
                        '    Point p1, p2',
                        'union',
                        '    Point points[2]',
                        'end',
                        'proc main()',
                        '    Line line',
                        '    line.points[0].values[0] = 343',
                        '    addr line.p1.x',
                        '    mod  0, 1',
                        'end'
                    ],
                    [
                        343
                    ]
                );
                testLogs(
                    it,
                    'Should assign a nested union record - test last array index and field - write array',
                    [
                        'record Point',
                        '    number x',
                        '    number y',
                        'union',
                        '    number values[2]',
                        'end',
                        'record Line',
                        '    Point p1, p2',
                        'union',
                        '    Point points[2]',
                        'end',
                        'proc main()',
                        '    Line line',
                        '    line.points[1].values[1] = 488',
                        '    addr line.p2.y',
                        '    mod  0, 1',
                        'end'
                    ],
                    [
                        488
                    ]
                );
                testLogs(
                    it,
                    'Should assign a nested union record - test all fields - write array',
                    [
                        'record Point',
                        '    number x',
                        '    number y',
                        'union',
                        '    number values[2]',
                        'end',
                        'record Line',
                        '    Point p1, p2',
                        'union',
                        '    Point points[2]',
                        'end',
                        'proc main()',
                        '    Line line',
                        '    line.points[0].values[0] = 836',
                        '    line.points[0].values[1] = 241',
                        '    line.points[1].values[0] = 383',
                        '    line.points[1].values[1] = 246',
                        '    addr line.p1.x',
                        '    mod  0, 1',
                        '    addr line.p1.y',
                        '    mod  0, 1',
                        '    addr line.p2.x',
                        '    mod  0, 1',
                        '    addr line.p2.y',
                        '    mod  0, 1',
                        'end'
                    ],
                    [
                        836, 241, 383, 246
                    ]
                );
                testLogs(
                    it,
                    'Should assign a nested union record - test first array index and field - write field',
                    [
                        'record Point',
                        '    number x',
                        '    number y',
                        'union',
                        '    number values[2]',
                        'end',
                        'record Line',
                        '    Point p1, p2',
                        'union',
                        '    Point points[2]',
                        'end',
                        'proc main()',
                        '    Line line',
                        '    line.p1.x = 343',
                        '    addr line.points[0].values[0]',
                        '    mod  0, 1',
                        'end'
                    ],
                    [
                        343
                    ]
                );
                testLogs(
                    it,
                    'Should assign a nested union record - test last array index and field - write field',
                    [
                        'record Point',
                        '    number x',
                        '    number y',
                        'union',
                        '    number values[2]',
                        'end',
                        'record Line',
                        '    Point p1, p2',
                        'union',
                        '    Point points[2]',
                        'end',
                        'proc main()',
                        '    Line line',
                        '    line.p2.y = 488',
                        '    addr line.points[1].values[1]',
                        '    mod  0, 1',
                        'end'
                    ],
                    [
                        488
                    ]
                );
                testLogs(
                    it,
                    'Should assign a nested union record - test all fields - write field',
                    [
                        'record Point',
                        '    number x',
                        '    number y',
                        'union',
                        '    number values[2]',
                        'end',
                        'record Line',
                        '    Point p1, p2',
                        'union',
                        '    Point points[2]',
                        'end',
                        'proc main()',
                        '    Line line',
                        '    line.p1.x = 836',
                        '    line.p1.y = 241',
                        '    line.p2.x = 383',
                        '    line.p2.y = 246',
                        '    addr line.points[0].values[0]',
                        '    mod  0, 1',
                        '    addr line.points[0].values[1]',
                        '    mod  0, 1',
                        '    addr line.points[1].values[0]',
                        '    mod  0, 1',
                        '    addr line.points[1].values[1]',
                        '    mod  0, 1',
                        'end'
                    ],
                    [
                        836, 241, 383, 246
                    ]
                );
            }
        );
    }
);
