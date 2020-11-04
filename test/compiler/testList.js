/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const testLogs          = require('../utils').testLogs;
const testCodeAndMemory = require('../utils').testCodeAndMemory;

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
                '    with shape',
                '        with points[count]',
                '            x = xx',
                '            y = yy',
                '        end',
                '    end',
                'end',
                'proc main()',
                '    Shape shape',
                '    shapeReset(@shape)',
                '    shapeAddPoint(@shape, 4234, 4667)',
                '    addr shape.points[0].x',
                '    mod  0, 1',
                '    addr shape.points[0].y',
                '    mod  0, 1',
                'end'
            ],
            [
                4234,
                4667
            ]
        );
        testLogs(
            it,
            'Should log list item',
            [
                'record Point',
                '   number x, y',
                'end',
                'record Shape',
                '   number padding', // Force count to a non-zero offset...
                '   number count',
                '   Point points[5]',
                'end',
                'proc shapeReset(Shape ^shape)',
                '    shape.count = 0',
                'end',
                'proc shapeAddPoint(Shape ^shape, number xx, number yy)',
                '    with shape',
                '        with points[count]',
                '            x = xx',
                '            y = yy',
                '        end',
                '        count++',
                '    end',
                'end',
                'proc shapeLogPoint1(Shape ^shape, number index)',
                '    with shape.points[index]',
                '        addr x',
                '        mod  0, 1',
                '        addr y',
                '        mod  0, 1',
                '    end',
                'end',
                'proc shapeLogPoint2(Shape ^shape, number index)',
                '    with shape',
                '        with points[index]',
                '            addr x',
                '            mod  0, 1',
                '            addr y',
                '            mod  0, 1',
                '        end',
                '    end',
                'end',
                'proc main()',
                '    Shape shape',
                '    shapeReset(@shape)',
                '    shapeAddPoint(@shape, 1234, 1667)',
                '    shapeAddPoint(@shape, 6234, 6667)',
                '    shapeLogPoint1(@shape, 0)',
                '    shapeLogPoint2(@shape, 1)',
                'end'
            ],
            [
                1234,
                1667,
                6234,
                6667
            ]
        );
    }
);
