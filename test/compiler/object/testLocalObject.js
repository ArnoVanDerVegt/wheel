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
    }
);
