/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const testCodeAndMemory = require('../../utils').testCodeAndMemory;
const testLogs          = require('../../utils').testLogs;

describe(
    'Test local object',
    () => {
        describe(
            'Test basic object',
            () => {
                testLogs(
                    it,
                    'Should declare a simple object',
                    [
                        'object Point',
                        '    number x, y',
                        'end',
                        'proc main()',
                        '    Point p',
                        '    p.x = 391',
                        '    p.y = 439',
                        '    addr p.y',
                        '    mod 0, 1',
                        '    addr p.x',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        439,
                        391
                    ]
                );
                testLogs(
                    it,
                    'Should declare an object with one method',
                    [
                        'object Point',
                        '    number x, y',
                        'end',
                        'proc Point.log()',
                        '    addr x',
                        '    mod 0, 1',
                        '    addr y',
                        '    mod 0, 1',
                        'end',
                        'proc main()',
                        '    Point p',
                        '    p.x = 1397',
                        '    p.y = 2539',
                        '    p.log()',
                        'end'
                    ],
                    [
                        1397,
                        2539
                    ]
                );
                testLogs(
                    it,
                    'Should declare an object with two methods',
                    [
                        'object Point',
                        '    number x, y',
                        'end',
                        'proc Point.setXY()',
                        '    x = 14397',
                        '    y = 26539',
                        'end',
                        'proc Point.log()',
                        '    addr x',
                        '    mod 0, 1',
                        '    addr y',
                        '    mod 0, 1',
                        'end',
                        'proc main()',
                        '    Point p',
                        '    p.setXY()',
                        '    p.log()',
                        'end'
                    ],
                    [
                        14397,
                        26539
                    ]
                );
                testLogs(
                    it,
                    'Should declare an object with two methods with parameter',
                    [
                        'object Point',
                        '    number x, y',
                        'end',
                        'proc Point.setXY(number xx, number yy)',
                        '    x = xx',
                        '    y = yy',
                        'end',
                        'proc Point.log()',
                        '    addr x',
                        '    mod 0, 1',
                        '    addr y',
                        '    mod 0, 1',
                        'end',
                        'proc main()',
                        '    Point p',
                        '    p.setXY(1462, 3831)',
                        '    p.log()',
                        'end'
                    ],
                    [
                        1462,
                        3831
                    ]
                );
                testLogs(
                    it,
                    'Should declare an object with two methods and a local var',
                    [
                        'object Point',
                        '    number x, y',
                        'end',
                        'proc Point.setXY(number xx, number yy)',
                        '    number i = 10',
                        '    x = xx + i',
                        '    y = yy + i',
                        'end',
                        'proc Point.log()',
                        '    addr x',
                        '    mod 0, 1',
                        '    addr y',
                        '    mod 0, 1',
                        'end',
                        'proc main()',
                        '    Point p',
                        '    p.setXY(23462, 31831)',
                        '    p.log()',
                        'end'
                    ],
                    [
                        23472,
                        31841
                    ]
                );
                testLogs(
                    it,
                    'Should declare a simple object and call methods from a method',
                    [
                        'object Point',
                        '    number x, y',
                        'end',
                        'proc Point.setXY(number xx, number yy)',
                        '    number i = 10',
                        '    x = xx + i',
                        '    y = yy + i',
                        'end',
                        'proc Point.log()',
                        '    addr x',
                        '    mod 0, 1',
                        '    addr y',
                        '    mod 0, 1',
                        'end',
                        'proc Point.test()',
                        '    setXY(3469, 1839)',
                        '    log()',
                        'end',
                        'proc main()',
                        '    Point p',
                        '    p.test()',
                        'end'
                    ],
                    [
                        3479,
                        1849
                    ]
                );
                testLogs(
                    it,
                    'Should declare a simple object and call methods from a method',
                    [
                        'object Point',
                        '    number x, y',
                        'end',
                        'proc Point.log()',
                        '    addr x',
                        '    mod 0, 1',
                        'end',
                        'proc Point.test()',
                        '    log()',
                        'end',
                        'proc main()',
                        '    Point p',
                        '    p.x = 3479',
                        '    p.test()',
                        'end'
                    ],
                    [
                        3479
                    ]
                );
            }
        );
        describe(
            'Test object with record field',
            () => {
                testLogs(
                    it,
                    'Should declare a simple object with a record field',
                    [
                        'record Point',
                        '    number x, y',
                        'end',
                        'object Test',
                        '    Point p',
                        'end',
                        'proc main()',
                        '    Test test',
                        '    test.p.x = 97',
                        '    test.p.y = 439',
                        '    addr test.p.y',
                        '    mod 0, 1',
                        '    addr test.p.x',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        439,
                        97
                    ]
                );
                testLogs(
                    it,
                    'Should declare a simple object with a method and a record field',
                    [
                        'record Point',
                        '    number x, y',
                        'end',
                        'object Test',
                        '    Point p',
                        'end',
                        'proc Test.log()',
                        '    with p',
                        '        addr x',
                        '        mod 0, 1',
                        '        addr y',
                        '        mod 0, 1',
                        '    end',
                        'end',
                        'proc main()',
                        '    Test test',
                        '    test.p.x = 9439',
                        '    test.p.y = 9531',
                        '    test.log()',
                        'end'
                    ],
                    [
                        9439,
                        9531
                    ]
                );
                testLogs(
                    it,
                    'Should declare a simple object with two methods',
                    [
                        'record Point',
                        '    number x, y',
                        'end',
                        'object Test',
                        '    Point p',
                        'end',
                        'proc Test.setXY()',
                        '    with p',
                        '        x = 15439',
                        '        y = 16539',
                        '    end',
                        'end',
                        'proc Test.log()',
                        '    with p',
                        '        addr x',
                        '        mod 0, 1',
                        '        addr y',
                        '        mod 0, 1',
                        '    end',
                        'end',
                        'proc main()',
                        '    Test test',
                        '    test.setXY()',
                        '    test.log()',
                        'end'
                    ],
                    [
                        15439,
                        16539
                    ]
                );
            }
        );
        describe(
            'Test object with an object field',
            () => {
                testLogs(
                    it,
                    'Should declare an object with object field',
                    [
                        'object Point',
                        '    number x, y',
                        'end',
                        'object Line',
                        '    Point p1',
                        'end',
                        'proc main()',
                        '    Line l',
                        '    l.p1.x = 5397',
                        '    l.p1.y = 5639',
                        '    addr l.p1.y',
                        '    mod 0, 1',
                        '    addr l.p1.x',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        5639,
                        5397
                    ]
                );
                testLogs(
                    it,
                    'Should declare an object with object field and a single method',
                    [
                        'object Point',
                        '    number x, y',
                        'end',
                        'object Line',
                        '    Point p1',
                        'end',
                        'proc Line.setPoint1()',
                        '    with p1',
                        '        x = 2397',
                        '        y = 3639',
                        '    end',
                        'end',
                        'proc main()',
                        '    Line l',
                        '    l.setPoint1()',
                        '    addr l.p1.y',
                        '    mod 0, 1',
                        '    addr l.p1.x',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        3639,
                        2397
                    ]
                );
                testLogs(
                    it,
                    'Should declare an object with object field and and call method',
                    [
                        'object Point',
                        '    number x, y',
                        'end',
                        'proc Point.setXY()',
                        '    x = 4397',
                        '    y = 5639',
                        'end',
                        'object Line',
                        '    Point p1',
                        'end',
                        'proc Line.setPoint1()',
                        '    p1.setXY()',
                        'end',
                        'proc main()',
                        '    Line l',
                        '    l.setPoint1()',
                        '    addr l.p1.y',
                        '    mod 0, 1',
                        '    addr l.p1.x',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        5639,
                        4397
                    ]
                );
                testLogs(
                    it,
                    'Should declare an object with object field and and call method with parameters',
                    [
                        'object Point',
                        '    number x, y',
                        'end',
                        'proc Point.setXY(number xx, number yy)',
                        '    x = xx',
                        '    y = yy',
                        'end',
                        'object Line',
                        '    Point p1',
                        'end',
                        'proc Line.setPoint1(number xx, number yy)',
                        '    p1.setXY(xx, yy)',
                        'end',
                        'proc main()',
                        '    Line l',
                        '    l.setPoint1(8127, 1773)',
                        '    addr l.p1.y',
                        '    mod 0, 1',
                        '    addr l.p1.x',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        1773,
                        8127
                    ]
                );
                testLogs(
                    it,
                    'Should declare an object with object fields and and call methods with parameters',
                    [
                        'object Point',
                        '    number x, y',
                        'end',
                        'proc Point.setXY(number xx, number yy)',
                        '    x = xx',
                        '    y = yy',
                        'end',
                        'object Line',
                        '    Point p1, p2',
                        'end',
                        'proc Line.setPoints(number x1, number y1, number x2, number y2)',
                        '    p1.setXY(x1, y1)',
                        '    p2.setXY(x2, y2)',
                        'end',
                        'proc main()',
                        '    Line l',
                        '    l.setPoints(3857, 8151, 2861, 8413)',
                        '    addr l.p1.x',
                        '    mod 0, 1',
                        '    addr l.p1.y',
                        '    mod 0, 1',
                        '    addr l.p2.x',
                        '    mod 0, 1',
                        '    addr l.p2.y',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        3857,
                        8151,
                        2861,
                        8413
                    ]
                );
                testLogs(
                    it,
                    'Should declare an object with object fields and and call methods with parameters',
                    [
                        'object Point',
                        '    number x, y',
                        'end',
                        'proc Point.setXY(number xx, number yy)',
                        '    x = xx',
                        '    y = yy',
                        'end',
                        'object Line',
                        '    Point p1, p2',
                        'end',
                        'proc Line.setPoints(number x1, number y1, number x2, number y2)',
                        '    p1.setXY(x1, y1)',
                        '    p2.setXY(x2, y2)',
                        'end',
                        'proc Line.log()',
                        '    with p1',
                        '        addr x',
                        '        mod 0, 1',
                        '        addr y',
                        '        mod 0, 1',
                        '    end',
                        '    with p2',
                        '        addr x',
                        '        mod 0, 1',
                        '        addr y',
                        '        mod 0, 1',
                        '    end',
                        'end',
                        'proc main()',
                        '    Line l',
                        '    l.setPoints(1857, 2151, 3861, 4413)',
                        '    l.log()',
                        'end'
                    ],
                    [
                        1857,
                        2151,
                        3861,
                        4413
                    ]
                );
            }
        );
        describe(
            'Test array of object',
            () => {
                testLogs(
                    it,
                    'Should declare an array of simple objects',
                    [
                        'object Point',
                        '    number x, y',
                        'end',
                        'proc main()',
                        '    Point p[3]',
                        '    p[0].x = 1397',
                        '    p[0].y = 1939',
                        '    p[1].x = 2397',
                        '    p[1].y = 2939',
                        '    p[2].x = 6397',
                        '    p[2].y = 6939',
                        '    addr p[0].x',
                        '    mod 0, 1',
                        '    addr p[0].y',
                        '    mod 0, 1',
                        '    addr p[1].x',
                        '    mod 0, 1',
                        '    addr p[1].y',
                        '    mod 0, 1',
                        '    addr p[2].x',
                        '    mod 0, 1',
                        '    addr p[2].y',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        1397,
                        1939,
                        2397,
                        2939,
                        6397,
                        6939
                    ]
                );
                testLogs(
                    it,
                    'Should declare an array of simple objects and call methods',
                    [
                        'object Point',
                        '    number x, y',
                        'end',
                        'proc Point.log()',
                        '    addr x',
                        '    mod 0, 1',
                        '    addr y',
                        '    mod 0, 1',
                        'end',
                        'proc main()',
                        '    Point p[3]',
                        '    p[0].x = 41397',
                        '    p[0].y = 41939',
                        '    p[1].x = 52397',
                        '    p[1].y = 52939',
                        '    p[2].x = 66397',
                        '    p[2].y = 66939',
                        '    number i',
                        '    for i = 0 to 2',
                        '        p[i].log()',
                        '    end',
                        'end'
                    ],
                    [
                        41397,
                        41939,
                        52397,
                        52939,
                        66397,
                        66939
                    ]
                );
            }
        );
        describe(
            'Test object field in record',
            () => {
                testLogs(
                    it,
                    'Should declare a record with two object fields',
                    [
                        'object Point',
                        '    number x, y',
                        'end',
                        'record Line',
                        '    Point p1, p2',
                        'end',
                        'proc main()',
                        '    Line l',
                        '    l.p1.x = 8551',
                        '    l.p1.y = 3501',
                        '    l.p2.x = 9314',
                        '    l.p2.y = 3851',
                        '    addr l.p1.x',
                        '    mod 0, 1',
                        '    addr l.p1.y',
                        '    mod 0, 1',
                        '    addr l.p2.x',
                        '    mod 0, 1',
                        '    addr l.p2.y',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        8551,
                        3501,
                        9314,
                        3851
                    ]
                );
                /*
                todo:
                testLogs(
                    it,
                    'Should declare a record with two object fields and call a method in the objects',
                    [
                        'object Point',
                        '    number x, y',
                        'end',
                        'proc Point.log()',
                        '    addr x',
                        '    mod 0, 1',
                        '    addr y',
                        '    mod 0, 1',
                        'end',
                        'record Line',
                        '    Point p1, p2',
                        'end',
                        'proc main()',
                        '    Line l',
                        '    l.p1.x = 1551',
                        '    l.p1.y = 2501',
                        '    l.p2.x = 3314',
                        '    l.p2.y = 4851',
                        '    with l',
                        '        p1.log()',
                        '        p2.log()',
                        '    end',
                        'end'
                    ],
                    [
                        1551,
                        2501,
                        3314,
                        4851
                    ]
                );
                testLogs(
                    it,
                    'Should declare a record with a record field with two object fields and call a method in the objects',
                    [
                        'object Point',
                        '    number x, y',
                        'end',
                        'proc Point.log()',
                        '    addr x',
                        '    mod 0, 1',
                        '    addr y',
                        '    mod 0, 1',
                        'end',
                        'record Line',
                        '    Point p1, p2',
                        'end',
                        'record Shape',
                        '    Line l1, l2',
                        'end',
                        'proc main()',
                        '    Shape s',
                        '    s.l2.p1.x = 7551',
                        '    s.l2.p1.y = 6501',
                        '    s.l2.p2.x = 5314',
                        '    s.l2.p2.y = 4851',
                        '    with s.l2',
                        '        p1.log()',
                        '        p2.log()',
                        '    end',
                        'end'
                    ],
                    [
                        7551,
                        6501,
                        5314,
                        4851
                    ]
                );
                testLogs(
                    it,
                    'Should declare a record with a record field with and array of object fields and call a method in the objects',
                    [
                        'object Point',
                        '    number x, y',
                        'end',
                        'proc Point.log()',
                        '    addr x',
                        '    mod 0, 1',
                        '    addr y',
                        '    mod 0, 1',
                        'end',
                        'record Line',
                        '    Point p[2]',
                        'end',
                        'record Shape',
                        '    Line l1, l2',
                        'end',
                        'proc main()',
                        '    Shape s',
                        '    s.l2.p[0].x = 1551',
                        '    s.l2.p[0].y = 2501',
                        '    s.l2.p[1].x = 3314',
                        '    s.l2.p[1].y = 4851',
                        '    with s.l2',
                        '        p[0].log()',
                        '        p[1].log()',
                        '    end',
                        'end'
                    ],
                    [
                        1551,
                        2501,
                        3314,
                        4851
                    ]
                );
                */
            }
        );
        describe(
            'Test object as parameter',
            () => {
                testLogs(
                    it,
                    'Should use object as parameter',
                    [
                        'object Point',
                        '    number x, y',
                        'end',
                        'proc test(Point p)',
                        '    addr p.y',
                        '    mod 0, 1',
                        '    addr p.x',
                        '    mod 0, 1',
                        'end',
                        'proc main()',
                        '    Point p',
                        '    p.x = 1397',
                        '    p.y = 2391',
                        '    test(p)',
                        'end'
                    ],
                    [
                        2391,
                        1397
                    ]
                );
                testLogs(
                    it,
                    'Should use object with a method as parameter',
                    [
                        'object Point',
                        '    number x, y',
                        'end',
                        'proc Point.log()',
                        '    addr y',
                        '    mod 0, 1',
                        '    addr x',
                        '    mod 0, 1',
                        'end',
                        'proc test(Point p)',
                        '    p.log()',
                        'end',
                        'proc main()',
                        '    Point p',
                        '    p.x = 2397',
                        '    p.y = 3391',
                        '    test(p)',
                        'end'
                    ],
                    [
                        3391,
                        2397
                    ]
                );
                testLogs(
                    it,
                    'Should use object pointer with a method as parameter',
                    [
                        'object Point',
                        '    number x, y',
                        'end',
                        'proc Point.setXY(number xx, number yy)',
                        '    x = xx',
                        '    y = yy',
                        'end',
                        'proc Point.log()',
                        '    addr y',
                        '    mod 0, 1',
                        '    addr x',
                        '    mod 0, 1',
                        'end',
                        'proc test(Point ^p)',
                        '    p.setXY(1246, 2356)',
                        'end',
                        'proc main()',
                        '    Point p',
                        '    p.x = 2397',
                        '    p.y = 3391',
                        '    test(@p)',
                        '    p.log()',
                        'end'
                    ],
                    [
                        2356,
                        1246
                    ]
                );
            }
        );
    }
);
