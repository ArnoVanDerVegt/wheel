/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const testCodeAndMemory = require('../../utils').testCodeAndMemory;
const testLogs          = require('../../utils').testLogs;

describe(
    'Test single dimensional record arrays',
    function() {
        describe(
            'Test array of record',
            function() {
                testLogs(
                    it,
                    'Should assign global field values',
                    [
                        'record Point',
                        '    number x',
                        '    number y',
                        'end',
                        'Point p[4]',
                        'proc main()',
                        '    p[1].x = 353',
                        '    p[1].y = 256',
                        '    addr p[1].x',
                        '    mod 0, 1',
                        '    addr p[1].y',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        353, 256
                    ]
                );
                testLogs(
                    it,
                    'Should assign local field values',
                    [
                        'record Point',
                        '    number x',
                        '    number y',
                        'end',
                        'proc main()',
                        '    Point p[4]',
                        '    p[1].x = 43',
                        '    p[1].y = 884',
                        '    addr p[1].x',
                        '    mod 0, 1',
                        '    addr p[1].y',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        43, 884
                    ]
                );
                testLogs(
                    it,
                    'Should assign values of record array field in global record',
                    [
                        'record Point',
                        '    number x',
                        '    number y',
                        'end',
                        'record Line',
                        '    Point p[2]',
                        'end',
                        'Line line',
                        'proc main()',
                        '    line.p[1].y = 454',
                        '    line.p[0].x = 6782',
                        '    addr line.p[0].x',
                        '    mod 0, 1',
                        '    addr line.p[1].y',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        6782, 454
                    ]
                );
                testLogs(
                    it,
                    'Should assign calculation to global field values',
                    [
                        'record Point',
                        '    number x',
                        '    number y',
                        'end',
                        'Point p[4]',
                        'proc main()',
                        '    number n = 5',
                        '    p[1].x = 3 * n',
                        '    p[1].y = 7 + n',
                        '    addr p[1].x',
                        '    mod 0, 1',
                        '    addr p[1].y',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        15, 12
                    ]
                );
            }
        );
        describe(
            'Test complex array index',
            function() {
                testLogs(
                    it,
                    'Should assign array index with record index',
                    [
                        'record Point',
                        '    number x',
                        '    number y',
                        'end',
                        'number a[4]',
                        'Point p',
                        'proc main()',
                        '    p.y = 2',
                        '    a[p.y] = 488',
                        '    addr p.y',
                        '    mod 0, 1',
                        '    addr a[2]',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        2, 488
                    ]
                );
                testLogs(
                    it,
                    'Should assign array index with calculation with record field',
                    [
                        'record Point',
                        '    number x',
                        '    number y',
                        'end',
                        'number a[8]',
                        'Point p',
                        'proc main()',
                        '    p.y = 2',
                        '    a[p.y * 3] = 9134',
                        '    addr p.y',
                        '    mod 0, 1',
                        '    addr a[6]',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        2, 9134
                    ]
                );
            }
        );
    }
);
