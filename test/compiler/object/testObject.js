/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const testCodeAndMemory = require('../../utils').testCodeAndMemory;
const testLogs          = require('../../utils').testLogs;

describe(
    'Test object',
    () => {
        describe(
            'Test self',
            () => {
                testLogs(
                    it,
                    'Should declare an object and set value with self',
                    [
                        'object Point',
                        '    number x, y',
                        'end',
                        'proc Point.setX(number x)',
                        '    self.x = x',
                        'end',
                        'proc Point.setY(number y)',
                        '    self.y = y',
                        'end',
                        'proc Point.log()',
                        '    addr self.x',
                        '    mod 0, 1',
                        '    addr self.y',
                        '    mod 0, 1',
                        'end',
                        'Point p',
                        'proc main()',
                        '    p.setX(1345)',
                        '    p.setY(9345)',
                        '    p.log()',
                        'end'
                    ],
                    [
                        1345,
                        9345
                    ]
                );
                testLogs(
                    it,
                    'Should use self as a parameter',
                    [
                        'object Point',
                        'end',
                        'object TestPoint',
                        '    number x, y',
                        '    Point p',
                        'end',
                        'proc TestPoint.log()',
                        '    addr self.x',
                        '    mod 0, 1',
                        '    addr self.y',
                        '    mod 0, 1',
                        'end',
                        'proc Point.testPoint(TestPoint ^testPoint)',
                        '    testPoint.log()',
                        'end',
                        'proc TestPoint.testTestPoint()',
                        '    p.testPoint(self)',
                        'end',
                        'TestPoint tp',
                        'proc main()',
                        '    tp.x = 4961',
                        '    tp.y = 3851',
                        '    tp.testTestPoint()',
                        'end'
                    ],
                    [
                        4961,
                        3851
                    ]
                );
                testLogs(
                    it,
                    'Should call an object from an extended object',
                    [
                        'object Test',
                        'end',
                        'proc Test.log()',
                        '    number i = 1234',
                        '    addr i',
                        '    mod 0, 1',
                        'end',
                        'object BaseObject',
                        '    Test test',
                        'end',
                        'proc BaseObject.testTest()',
                        '    test.log()',
                        'end',
                        'object ExtendedObject extends BaseObject',
                        'end',
                        'ExtendedObject eo',
                        'proc main()',
                        '    eo.testTest()',
                        'end'
                    ],
                    [
                        1234
                    ]
                );
                testLogs(
                    it,
                    'Should call an object method in a with statement',
                    [
                        'object Test',
                        'end',
                        'proc Test.log()',
                        '    number i = 3851',
                        '    addr i',
                        '    mod 0, 1',
                        '    ret 8314',
                        'end',
                        'object BaseObject',
                        '    Test test',
                        'end',
                        'proc BaseObject.testTest()',
                        '    number i',
                        '    with test',
                        '        i = log()',
                        '        addr i',
                        '        mod 0, 1',
                        '    end',
                        'end',
                        'object ExtendedObject extends BaseObject',
                        'end',
                        'ExtendedObject eo',
                        'proc main()',
                        '    eo.testTest()',
                        'end'
                    ],
                    [
                        3851,
                        8314
                    ]
                );
            }
        );
        describe(
            'Test return value',
            () => {
                testLogs(
                    it,
                    'Should return a field value',
                    [
                        'object Point',
                        '    number x, y',
                        'end',
                        'proc Point.setY(number y)',
                        '    self.y = y',
                        'end',
                        'proc Point.getY()',
                        '    ret self.y',
                        'end',
                        'Point p',
                        'proc main()',
                        '    p.setY(8244)',
                        '    number n',
                        '    n = p.getY()',
                        '    addr n',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        8244
                    ]
                );
                testLogs(
                    it,
                    'Should return a value of an object which is a field in a record',
                    [
                        'object Point',
                        '    number x, y',
                        'end',
                        'record Test',
                        '    Point point',
                        'end',
                        'proc Point.setY(number y)',
                        '    self.y = y',
                        'end',
                        'proc Point.getY()',
                        '    ret self.y',
                        'end',
                        'Test t',
                        'proc main()',
                        '    t.point.setY(2845)',
                        '    number n',
                        '    n = t.point.getY()',
                        '    addr n',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        2845
                    ]
                );
                testLogs(
                    it,
                    'Should return a value of an object which is in an array',
                    [
                        'object Point',
                        '    number x, y',
                        'end',
                        'proc Point.setY(number y)',
                        '    self.y = y',
                        'end',
                        'proc Point.getY()',
                        '    ret self.y',
                        'end',
                        'Point points[2]',
                        'proc main()',
                        '    points[0].setY(1281)',
                        '    points[1].setY(9551)',
                        '    number n',
                        '    n = points[1].getY()',
                        '    addr n',
                        '    mod 0, 1',
                        '    n = points[0].getY()',
                        '    addr n',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        9551,
                        1281
                    ]
                );
            }
        );
        describe(
            'Test an object with an object property',
            () => {
                testLogs(
                    it,
                    'Should set the value in an object property',
                    [
                        'object Point',
                        '    number x, y',
                        'end',
                        'proc Point.setY(number y)',
                        '    self.y = y',
                        'end',
                        'object Shape',
                        '    Point point',
                        'end',
                        'proc Shape.init()',
                        '    point.setY(5345)',
                        'end',
                        'Shape shape',
                        'proc main()',
                        '    shape.init()',
                        '    number n',
                        '    n = shape.point.y',
                        '    addr n',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        5345
                    ]
                );
                testLogs(
                    it,
                    'Should set the values in an extended object property',
                    [
                        'object Point2D',
                        '    number x, y',
                        'end',
                        'proc Point2D.setY(number y)',
                        '    self.y = y',
                        'end',
                        'object Point3D extends Point2D',
                        '    number z',
                        'end',
                        'proc Point3D.setZ(number z)',
                        '    self.z = z',
                        'end',
                        'object Shape',
                        '    Point3D point',
                        'end',
                        'proc Shape.init()',
                        '    point.setY(8153)',
                        '    point.setZ(3851)',
                        'end',
                        'Shape shape',
                        'proc main()',
                        '    shape.init()',
                        '    number n',
                        '    n = shape.point.y',
                        '    addr n',
                        '    mod 0, 1',
                        '    n = shape.point.z',
                        '    addr n',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        8153,
                        3851
                    ]
                );
            }
        );
    }
);
