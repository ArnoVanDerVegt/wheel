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
            'Test basic object',
            () => {
                testLogs(
                    it,
                    'Should declare a simple object',
                    [
                        'object Point',
                        '    number x, y',
                        'end',
                        'Point p',
                        'proc main()',
                        '    p.x = 397',
                        '    p.y = 39',
                        '    addr p.y',
                        '    mod 0, 1',
                        '    addr p.x',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        39, 397
                    ]
                );
                testLogs(
                    it,
                    'Should declare a simple object with a method',
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
                        'Point p',
                        'proc main()',
                        '    p.x = 4397',
                        '    p.y = 539',
                        '    p.log()',
                        'end'
                    ],
                    [
                        4397,
                        539
                    ]
                );
            }
        );
    }
);
