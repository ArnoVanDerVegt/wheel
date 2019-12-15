/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher     = require('../../../js/frontend/lib/dispatcher').dispatcher;
const testModuleCall = require('../../utils').testModuleCall;
const testLogs       = require('../../utils').testLogs;
const testCompile    = require('../../utils').testCompile;
const assert         = require('assert');

describe(
    'Test Bit module',
    function() {
        testLogs(
            it,
            'Should get a bitwise or',
            [
                'proc bitOr(number i, number j)',
                '    addr i',
                '    mod  11, 0',
                'end',
                'proc main()',
                '    number n = bitOr(1, 2)',
                '    addr n',
                '    mod  0, 1',
                'end'
            ],
            [
                3
            ]
        );
        testLogs(
            it,
            'Should get a bitwise and',
            [
                'proc bitAnd(number i, number j)',
                '    addr i',
                '    mod  11, 1',
                'end',
                'proc main()',
                '    number n = bitAnd(3, 2)',
                '    addr n',
                '    mod  0, 1',
                'end'
            ],
            [
                2
            ]
        );
        testLogs(
            it,
            'Should get a bit value',
            [
                'proc bitValue(number i)',
                '    addr i',
                '    mod  11, 2',
                'end',
                'proc main()',
                '    number n = bitValue(3)',
                '    addr n',
                '    mod  0, 1',
                'end'
            ],
            [
                1
            ]
        );
        testLogs(
            it,
            'Should get a bit value from float',
            [
                'proc bitValue(number i)',
                '    addr i',
                '    mod  11, 2',
                'end',
                'proc main()',
                '    number n = bitValue(1.3)',
                '    addr n',
                '    mod  0, 1',
                'end'
            ],
            [
                1
            ]
        );
        testLogs(
            it,
            'Should get a bit value from 0',
            [
                'proc bitValue(number i)',
                '    addr i',
                '    mod  11, 2',
                'end',
                'proc main()',
                '    number n = bitValue(0)',
                '    addr n',
                '    mod  0, 1',
                'end'
            ],
            [
                0
            ]
        );
        testLogs(
            it,
            'Should get a not bit value',
            [
                'proc bitValue(number i)',
                '    addr i',
                '    mod  11, 3',
                'end',
                'proc main()',
                '    number n = bitValue(5)',
                '    addr n',
                '    mod  0, 1',
                'end'
            ],
            [
                0
            ]
        );
        testLogs(
            it,
            'Should get a not bit value from 0',
            [
                'proc bitValue(number i)',
                '    addr i',
                '    mod  11, 3',
                'end',
                'proc main()',
                '    number n = bitValue(0)',
                '    addr n',
                '    mod  0, 1',
                'end'
            ],
            [
                1
            ]
        );
        testLogs(
            it,
            'Should shift left',
            [
                'proc shl(number value, number shift)',
                '    addr value',
                '    mod  11, 4',
                'end',
                'proc main()',
                '    number n = shl(1, 2)',
                '    addr n',
                '    mod  0, 1',
                'end'
            ],
            [
                4
            ]
        );
        testLogs(
            it,
            'Should shift right',
            [
                'proc shr(number value, number shift)',
                '    addr value',
                '    mod  11, 5',
                'end',
                'proc main()',
                '    number n = shr(4, 2)',
                '    addr n',
                '    mod  0, 1',
                'end'
            ],
            [
                1
            ]
        );
    }
);
