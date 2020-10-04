/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const testCodeAndMemory = require('../../utils').testCodeAndMemory;
const testLogs          = require('../../utils').testLogs;

describe(
    'Test record assignments',
    () => {
        describe(
            'Test record copy assignments',
            () => {
                testLogs(
                    it,
                    'Should copy a global record',
                    [
                        'record Point',
                        '    number x',
                        '    number y',
                        'end',
                        'Point p1, p2',
                        'proc main()',
                        '    p1.x = 456',
                        '    p1.y = 567',
                        '    p2 = p1',
                        '    addr p2.x',
                        '    mod 0, 1',
                        '    addr p2.y',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        456, 567
                    ]
                );
                testLogs(
                    it,
                    'Should copy a local record',
                    [
                        'record Point',
                        '    number x',
                        '    number y',
                        'end',
                        'proc main()',
                        '    Point p1, p2',
                        '    p1.x = 4565',
                        '    p1.y = 2134',
                        '    p2 = p1',
                        '    addr p2.x',
                        '    mod 0, 1',
                        '    addr p2.y',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        4565, 2134
                    ]
                );
                testLogs(
                    it,
                    'Should copy a global to local record',
                    [
                        'record Point',
                        '    number x',
                        '    number y',
                        'end',
                        'Point p1',
                        'proc main()',
                        '    Point p2',
                        '    p1.x = 56',
                        '    p1.y = 576',
                        '    p2 = p1',
                        '    addr p2.x',
                        '    mod 0, 1',
                        '    addr p2.y',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        56, 576
                    ]
                );
                testLogs(
                    it,
                    'Should copy a local to global record',
                    [
                        'record Point',
                        '    number x',
                        '    number y',
                        'end',
                        'Point p2',
                        'proc main()',
                        '    Point p1',
                        '    p1.x = 467',
                        '    p1.y = 238',
                        '    p2 = p1',
                        '    addr p2.x',
                        '    mod 0, 1',
                        '    addr p2.y',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        467, 238
                    ]
                );
                testLogs(
                    it,
                    'Should copy a global record field to record field',
                    [
                        'record Point',
                        '    number x',
                        '    number y',
                        'end',
                        'record Line',
                        '    Point p1',
                        '    Point p2',
                        'end',
                        'Line line',
                        'proc main()',
                        '    line.p1.x = 46',
                        '    line.p1.y = 9233',
                        '    line.p2 = line.p1',
                        '    addr line.p2.x',
                        '    mod 0, 1',
                        '    addr line.p2.y',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        46, 9233
                    ]
                );
                testLogs(
                    it,
                    'Should copy a local record field to record field',
                    [
                        'record Point',
                        '    number x',
                        '    number y',
                        'end',
                        'record Line',
                        '    Point p1',
                        '    Point p2',
                        'end',
                        'proc main()',
                        '    Line line',
                        '    line.p1.x = 125',
                        '    line.p1.y = 992',
                        '    line.p2 = line.p1',
                        '    addr line.p2.x',
                        '    mod 0, 1',
                        '    addr line.p2.y',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        125, 992
                    ]
                );
                testLogs(
                    it,
                    'Should copy a global record field to global record',
                    [
                        'record Point',
                        '    number x',
                        '    number y',
                        'end',
                        'record Line',
                        '    Point p1',
                        '    Point p2',
                        'end',
                        'Line line',
                        'Point p',
                        'proc main()',
                        '    line.p1.x = 6787',
                        '    line.p1.y = 51',
                        '    p = line.p1',
                        '    addr p.x',
                        '    mod 0, 1',
                        '    addr p.y',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        6787, 51
                    ]
                );
                testLogs(
                    it,
                    'Should copy a local record to global record field',
                    [
                        'record Point',
                        '    number x',
                        '    number y',
                        'end',
                        'record Line',
                        '    Point p1',
                        '    Point p2',
                        'end',
                        'Line line',
                        'proc main()',
                        '    Point p',
                        '    p.x = 3434',
                        '    p.y = 788',
                        '    line.p2 = p',
                        '    addr line.p2.x',
                        '    mod 0, 1',
                        '    addr line.p2.y',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        3434, 788
                    ]
                );
            }
        );
    }
);
