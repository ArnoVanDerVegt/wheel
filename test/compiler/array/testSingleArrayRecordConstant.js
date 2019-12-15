/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const testCodeAndMemory = require('../../utils').testCodeAndMemory;
const testLogs          = require('../../utils').testLogs;

describe(
    'Test single dimensional constant record arrays',
    function() {
        describe(
            'Test constant record array declaration',
            function() {
                testLogs(
                    it,
                    'Should declare local array of records',
                    [
                        'record Point',
                        '    number x, y',
                        'end',
                        'proc main()',
                        '    Point p[2] = [{34, 834}, {45, 167}]',
                        '    addr p[0].y',
                        '    mod 0, 1',
                        '    addr p[0].x',
                        '    mod 0, 1',
                        '    addr p[1].y',
                        '    mod 0, 1',
                        '    addr p[1].x',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        834, 34, 167, 45
                    ]
                );
                testLogs(
                    it,
                    'Should declare global array of records',
                    [
                        'record Point',
                        '    number x, y',
                        'end',
                        'Point p[2] = [{435, 23}, {57, 787}]',
                        'proc main()',
                        '    addr p[0].y',
                        '    mod 0, 1',
                        '    addr p[0].x',
                        '    mod 0, 1',
                        '    addr p[1].y',
                        '    mod 0, 1',
                        '    addr p[1].x',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        23, 435, 787, 57
                    ]
                );
                testLogs(
                    it,
                    'Should assign local constant array or records',
                    [
                        'record Point',
                        '    number x, y',
                        'end',
                        'proc main()',
                        '    Point p[2]',
                        '    p = [{456, 35}, {47, 464}]',
                        '    addr p[0].y',
                        '    mod 0, 1',
                        '    addr p[0].x',
                        '    mod 0, 1',
                        '    addr p[1].y',
                        '    mod 0, 1',
                        '    addr p[1].x',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        35, 456, 464, 47
                    ]
                );
                testLogs(
                    it,
                    'Should assign global constant array or records',
                    [
                        'record Point',
                        '    number x, y',
                        'end',
                        'Point p[2]',
                        'proc main()',
                        '    p = [{656, 13}, {67, 464}]',
                        '    addr p[0].y',
                        '    mod 0, 1',
                        '    addr p[0].x',
                        '    mod 0, 1',
                        '    addr p[1].y',
                        '    mod 0, 1',
                        '    addr p[1].x',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        13, 656, 464, 67
                    ]
                );
            }
        );
    }
);
