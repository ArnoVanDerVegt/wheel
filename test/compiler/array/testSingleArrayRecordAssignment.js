
/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const testCodeAndMemory = require('../../utils').testCodeAndMemory;
const testLogs          = require('../../utils').testLogs;

describe(
    'Test single dimensional record arrays assignments',
    function() {
        describe(
            'Test record array copy assignments',
            function() {
                testLogs(
                    it,
                    'Should assign array value to record, index 0',
                    [
                        'record Point',
                        '    number x',
                        '    number y',
                        'end',
                        'Point pp[8]',
                        'Point p',
                        'proc main()',
                        '   pp[0].x = 45',
                        '   pp[0].y = 51',
                        '   p = pp[0]',
                        '   addr p.x',
                        '   mod 0, 1',
                        '   addr p.y',
                        '   mod 0, 1',
                        'end'
                    ],
                    [
                        45,
                        51
                    ]
                );
                testLogs(
                    it,
                    'Should assign array value to record, index 2',
                    [
                        'record Point',
                        '    number x',
                        '    number y',
                        'end',
                        'Point pp[8]',
                        'Point p',
                        'proc main()',
                        '   pp[2].x = 56',
                        '   pp[2].y = 89',
                        '   p = pp[2]',
                        '   addr p.x',
                        '   mod 0, 1',
                        '   addr p.y',
                        '   mod 0, 1',
                        'end'
                    ],
                    [
                        56,
                        89
                    ]
                );
                testLogs(
                    it,
                    'Should assign array value to record, number index',
                    [
                        'record Point',
                        '    number x',
                        '    number y',
                        'end',
                        'Point pp[8]',
                        'Point p',
                        'proc main()',
                        '   number i = 2',
                        '   pp[i].x = 256',
                        '   pp[i].y = 289',
                        '   p = pp[i]',
                        '   addr p.x',
                        '   mod 0, 1',
                        '   addr p.y',
                        '   mod 0, 1',
                        'end'
                    ],
                    [
                        256,
                        289
                    ]
                );
                testLogs(
                    it,
                    'Should assign record to array value, index 0',
                    [
                        'record Point',
                        '    number x',
                        '    number y',
                        'end',
                        'Point pp[8]',
                        'Point p',
                        'proc main()',
                        '   p.x = 68',
                        '   p.y = 178',
                        '   pp[0] = p',
                        '   addr pp[0].x',
                        '   mod 0, 1',
                        '   addr pp[0].y',
                        '   mod 0, 1',
                        'end'
                    ],
                    [
                        68,
                        178
                    ]
                );
                testLogs(
                    it,
                    'Should assign record to array value, index 2',
                    [
                        'record Point',
                        '    number x',
                        '    number y',
                        'end',
                        'Point pp[8]',
                        'Point p',
                        'proc main()',
                        '   p.x = 29',
                        '   p.y = 37',
                        '   pp[2] = p',
                        '   addr pp[2].x',
                        '   mod 0, 1',
                        '   addr pp[2].y',
                        '   mod 0, 1',
                        'end'
                    ],
                    [
                        29,
                        37
                    ]
                );
                testLogs(
                    it,
                    'Should assign record to array value, number index',
                    [
                        'record Point',
                        '    number x',
                        '    number y',
                        'end',
                        'Point pp[8]',
                        'Point p',
                        'proc main()',
                        '   p.x = 129',
                        '   p.y = 137',
                        '   number i = 2',
                        '   pp[i] = p',
                        '   addr pp[i].x',
                        '   mod 0, 1',
                        '   addr pp[i].y',
                        '   mod 0, 1',
                        'end'
                    ],
                    [
                        129,
                        137
                    ]
                );
                testLogs(
                    it,
                    'Should assign record to field array value, index 0',
                    [
                        'record Point',
                        '    number x',
                        '    number y',
                        'end',
                        'record Line',
                        '    Point points[2]',
                        'end',
                        'Line line',
                        'Point p',
                        'proc main()',
                        '   p.x = 71',
                        '   p.y = 562',
                        '   line.points[0] = p',
                        '   addr line.points[0].x',
                        '   mod 0, 1',
                        '   addr line.points[0].y',
                        '   mod 0, 1',
                        'end'
                    ],
                    [
                        71,
                        562
                    ]
                );
                testLogs(
                    it,
                    'Should assign record to field array value, index 1',
                    [
                        'record Point',
                        '    number x',
                        '    number y',
                        'end',
                        'record Line',
                        '    Point points[2]',
                        'end',
                        'Line line',
                        'Point p',
                        'proc main()',
                        '   p.x = 48',
                        '   p.y = 17',
                        '   line.points[1] = p',
                        '   addr line.points[1].x',
                        '   mod 0, 1',
                        '   addr line.points[1].y',
                        '   mod 0, 1',
                        'end'
                    ],
                    [
                        48,
                        17
                    ]
                );
                testLogs(
                    it,
                    'Should assign record to field array value, number index',
                    [
                        'record Point',
                        '    number x',
                        '    number y',
                        'end',
                        'record Line',
                        '    Point points[2]',
                        'end',
                        'Line line',
                        'Point p',
                        'proc main()',
                        '   p.x = 348',
                        '   p.y = 317',
                        '   number i = 1',
                        '   line.points[i] = p',
                        '   addr line.points[i].x',
                        '   mod 0, 1',
                        '   addr line.points[i].y',
                        '   mod 0, 1',
                        'end'
                    ],
                    [
                        348,
                        317
                    ]
                );
                testLogs(
                    it,
                    'Should assign field array value to record, index 0',
                    [
                        'record Point',
                        '    number x',
                        '    number y',
                        'end',
                        'record Line',
                        '    Point points[2]',
                        'end',
                        'Line line',
                        'Point p',
                        'proc main()',
                        '   line.points[0].x = 42',
                        '   line.points[0].y = 92',
                        '   p = line.points[0]',
                        '   addr p.x',
                        '   mod 0, 1',
                        '   addr p.y',
                        '   mod 0, 1',
                        'end'
                    ],
                    [
                        42,
                        92
                    ]
                );
                testLogs(
                    it,
                    'Should assign field array value to record, index 0',
                    [
                        'record Point',
                        '    number x',
                        '    number y',
                        'end',
                        'record Line',
                        '    Point points[2]',
                        'end',
                        'Line line',
                        'Point p',
                        'proc main()',
                        '   line.points[1].x = 68',
                        '   line.points[1].y = 74',
                        '   p = line.points[1]',
                        '   addr p.x',
                        '   mod 0, 1',
                        '   addr p.y',
                        '   mod 0, 1',
                        'end'
                    ],
                    [
                        68,
                        74
                    ]
                );
                testLogs(
                    it,
                    'Should assign field array value to record, number index',
                    [
                        'record Point',
                        '    number x',
                        '    number y',
                        'end',
                        'record Line',
                        '    Point points[2]',
                        'end',
                        'Line line',
                        'Point p',
                        'proc main()',
                        '   number i = 1',
                        '   line.points[i].x = 468',
                        '   line.points[i].y = 474',
                        '   p = line.points[i]',
                        '   addr p.x',
                        '   mod 0, 1',
                        '   addr p.y',
                        '   mod 0, 1',
                        'end'
                    ],
                    [
                        468,
                        474
                    ]
                );
            }
        );
        describe(
            'Test record array field - array copy assignments',
            function() {
                testLogs(
                    it,
                    'Should assign array value to record array field',
                    [
                        'record Point',
                        '    number x',
                        '    number y',
                        'end',
                        'record Line',
                        '    Point points[2]',
                        'end',
                        'Line line',
                        'Point p[2]',
                        'proc main()',
                        '   p[0].x = 68',
                        '   p[0].y = 345',
                        '   p[1].x = 178',
                        '   p[1].y = 723',
                        '   line.points = p',
                        '   addr line.points[0].x',
                        '   mod 0, 1',
                        '   addr line.points[0].y',
                        '   mod 0, 1',
                        '   addr line.points[1].x',
                        '   mod 0, 1',
                        '   addr line.points[1].y',
                        '   mod 0, 1',
                        'end'
                    ],
                    [
                        68,
                        345,
                        178,
                        723
                    ]
                );
            }
        );
    }
);
