/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const testLogs          = require('../../utils').testLogs;
const testCodeAndMemory = require('../../utils').testCodeAndMemory;
const testError         = require('../../utils').testError;
const errors            = require('../../../js/frontend/compiler/errors').errors;

describe(
    'Test call var',
    function() {
        describe(
            'Test proc variable',
            function() {
                testLogs(
                    it,
                    'Sould call proc variable',
                    [
                        'proc test1()',
                        '    number i = 55',
                        '    addr i',
                        '    mod 0, 1',
                        'end',
                        'proc test2()',
                        '    number i = 65',
                        '    addr i',
                        '    mod 0, 1',
                        'end',
                        'proc main()',
                        '    proc t',
                        '    t = test1',
                        '    t()',
                        '    t = test2',
                        '    t()',
                        'end'
                    ],
                    [
                        55, 65
                    ]
                );
                testLogs(
                    it,
                    'Sould call proc variable with two number parameters',
                    [
                        'proc test(number a, number b)',
                        '    addr a',
                        '    mod 0, 1',
                        '    addr b',
                        '    mod 0, 1',
                        'end',
                        'proc main()',
                        '    proc t',
                        '    t = test',
                        '    t(767, 23)',
                        'end'
                    ],
                    [
                        767, 23
                    ]
                );
                testLogs(
                    it,
                    'Sould call proc variable with record parameter',
                    [
                        'record Point',
                        '    number x, y',
                        'end',
                        'proc test(Point p)',
                        '    addr p.x',
                        '    mod 0, 1',
                        '    addr p.y',
                        '    mod 0, 1',
                        'end',
                        'proc main()',
                        '    Point point1',
                        '    point1.x = 477',
                        '    point1.y = 2344',
                        '    proc t',
                        '    t = test',
                        '    t(point1)',
                        'end'
                    ],
                    [
                        477, 2344
                    ]
                );
                testLogs(
                    it,
                    'Sould call proc variable with two record parameters',
                    [
                        'record Point',
                        '    number x, y',
                        'end',
                        'proc test(Point p1, Point p2)',
                        '    addr p1.x',
                        '    mod 0, 1',
                        '    addr p1.y',
                        '    mod 0, 1',
                        '    addr p2.x',
                        '    mod 0, 1',
                        '    addr p2.y',
                        '    mod 0, 1',
                        'end',
                        'proc main()',
                        '    proc t',
                        '    Point point1',
                        '    Point point2',
                        '    point1.x = 446',
                        '    point1.y = 990',
                        '    point2.x = 5454',
                        '    point2.y = 472',
                        '    t = test',
                        '    t(point1, point2)',
                        'end'
                    ],
                    [
                        446, 990, 5454, 472
                    ]
                );
                testLogs(
                    it,
                    'Sould call proc variable with array parameters',
                    [
                        'proc test(number a[3], number b[4])',
                        '    number i',
                        '    for i = 0 to 2',
                        '        addr a[i]',
                        '        mod 0, 1',
                        '    end',
                        '    for i = 0 to 3',
                        '        addr b[i]',
                        '        mod 0, 1',
                        '    end',
                        'end',
                        'proc main()',
                        '    proc t',
                        '    t = test',
                        '    t([2, 3, 4], [3, 4, 5, 6])',
                        'end'
                    ],
                    [
                        2, 3, 4, 3, 4, 5, 6
                    ]
                );
                testLogs(
                    it,
                    'Sould call proc with a proc as parameter',
                    [
                        'proc test1(number n)',
                        '    addr n',
                        '    mod 0, 1',
                        'end',
                        'proc test2(proc p, number x)',
                        '    p(5)',
                        '    addr x',
                        '    mod 0, 1',
                        'end',
                        'proc main()',
                        '    test2(test1, 45)',
                        'end'
                    ],
                    [
                        5, 45
                    ]
                );
                testLogs(
                    it,
                    'Sould call proc stored in a field',
                    [
                        'proc test(number n)',
                        '    addr n',
                        '    mod 0, 1',
                        'end',
                        'record R',
                        '    proc p',
                        'end',
                        'proc main()',
                        '    R r',
                        '    r.p = test',
                        '    r.p(446)',
                        'end'
                    ],
                    [
                        446
                    ]
                );
            }
        );
        describe(
            'Test proc type errors',
            function() {
                testError(
                    it,
                    'Should throw PARAM_COUNT_MISMATCH',
                    [
                        'proc test1(number n)',
                        'end',
                        'proc test2(number a, number b)',
                        'end',
                        'proc main()',
                        '    proc t',
                        '    t = test1',
                        '    t = test2',
                        'end'
                    ],
                    'Error: #' + errors.PARAM_COUNT_MISMATCH + ' Parameter count mismatch, "test1" and "test2" have different parameter counts.'
                );
                testError(
                    it,
                    'Should throw TYPE_MISMATCH - Parameter types',
                    [
                        'record R',
                        '    number f',
                        'end',
                        'proc test1(R r)',
                        'end',
                        'proc test2(number a)',
                        'end',
                        'proc main()',
                        '    proc t',
                        '    t = test1',
                        '    t = test2',
                        'end'
                    ],
                    'Error: #' + errors.TYPE_MISMATCH + ' Type mismatch, parameter types of "r" and "a" do not match.'
                );
                testError(
                    it,
                    'Should throw TYPE_MISMATCH - Parameter sizes',
                    [
                        'record R',
                        '    number f',
                        'end',
                        'proc test1(number n[2])',
                        'end',
                        'proc test2(number n[3])',
                        'end',
                        'proc main()',
                        '    proc t',
                        '    t = test1',
                        '    t = test2',
                        'end'
                    ],
                    'Error: #' + errors.TYPE_MISMATCH + ' Type mismatch, parameter sizes of "n" and "n" do not match.'
                );
                testError(
                    it,
                    'Should throw PARAM_TYPE_MISMATCH - record, number',
                    [
                        'record R',
                        '    number f',
                        'end',
                        'proc test(R r)',
                        'end',
                        'proc main()',
                        '    proc t',
                        '    t = test',
                        '    t(1)',
                        'end'
                    ],
                    'Error: #' + errors.PARAM_TYPE_MISMATCH + ' Parameter type mismatch.'
                );
                testError(
                    it,
                    'Should throw ARRAY_TYPE_EXPECTED - array, number',
                    [
                        'proc test(number n[2])',
                        'end',
                        'proc main()',
                        '    proc t',
                        '    t = test',
                        '    t(1)',
                        'end'
                    ],
                    'Error: #' + errors.ARRAY_TYPE_EXPECTED + ' Array type expected.'
                );
            }
        );
    }
);
