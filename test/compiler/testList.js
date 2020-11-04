/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const testLogs          = require('../utils').testLogs;
const testCodeAndMemory = require('../utils').testCodeAndMemory;

describe(
    'Test with',
    () => {
        describe(
            'Test list',
            () => {
                testLogs(
                    it,
                    'Should reset list length',
                    [
                        'record Point',
                        '   number x, y',
                        'end',
                        'record Shape',
                        '   number count',
                        '   Point points[5]',
                        'end',
                        'proc shapeReset(Shape ^shape)',
                        '    shape.count = 0',
                        'end',
                        'proc main()',
                        '    Shape shape',
                        '    shapeReset(@shape)',
                        '    addr shape.count',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        0
                    ]
                );
                testLogs(
                    it,
                    'Should add list item',
                    [
                        'record Point',
                        '   number x, y',
                        'end',
                        'record Shape',
                        '   number count',
                        '   Point points[5]',
                        'end',
                        'proc shapeReset(Shape ^shape)',
                        '    shape.count = 0',
                        'end',
                        'proc shapeAddPoint(Shape ^shape, number xx, number yy)',
                        // '    with shape',
                        // '        with points[count]',
                        // '            x = xx',
                        // '            y = yy',
                        // '        end',
                        // '    end',
                        '    with shape.points[0]',
                        '        x = xx',
                        '        y = yy',
                        '    end',
                        'end',
                        'proc main()',
                        '    Shape shape',
                        '    shapeReset(@shape)',
                        '    shapeAddPoint(@shape, 234, 667)',
                        '    addr shape.points[0].x',
                        '    mod  0, 1',
                        '    addr shape.points[0].y',
                        '    mod  0, 1',
                        'end'
                    ],
                    [
                        234,
                        667
                    ]
                );
            }
        );
    }
);
