/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const testCodeAndMemory = require('../../utils').testCodeAndMemory;
const testLogs          = require('../../utils').testLogs;

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
        testCodeAndMemory(
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
            true,
            false
        );
    }
);
