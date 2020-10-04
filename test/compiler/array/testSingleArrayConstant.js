/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const testCodeAndMemory = require('../../utils').testCodeAndMemory;
const testLogs          = require('../../utils').testLogs;

describe(
    'Test single dimensional constant arrays',
    () => {
        testLogs(
            it,
            'Should declare global constant array',
            [
                'number a[5] = [724, 3565, 9269, 3514, 3382]',
                'proc main()',
                '    number i, j',
                '    for i = 0 to 4',
                '        j = a[i]',
                '        addr j',
                '        mod 0, 1',
                '    end',
                'end'
            ],
            [
                724, 3565, 9269, 3514, 3382
            ]
        );
        testLogs(
            it,
            'Should declare global constant arrays',
            [
                'number i[2] = [2, 7], j[3] = [1, 0, 56]',
                'proc main()',
                '    addr i[0]',
                '    mod 0, 1',
                '    addr i[1]',
                '    mod 0, 1',
                '    addr j[0]',
                '    mod 0, 1',
                '    addr j[1]',
                '    mod 0, 1',
                '    addr j[2]',
                '    mod 0, 1',
                'end'
            ],
            [
                2, 7, 1, 0, 56
            ]
        );
        testLogs(
            it,
            'Should declare local constant array',
            [
                'proc main()',
                '    number a[5] = [100, 56, 439, 5491, 9512]',
                '    number i, j',
                '    for i = 0 to 4',
                '        j = a[i]',
                '        addr j',
                '        mod 0, 1',
                '    end',
                'end'
            ],
            [
                100, 56, 439, 5491, 9512
            ]
        );
        testLogs(
            it,
            'Should declare local constant arrays',
            [
                'proc main()',
                '    number i[2] = [56, 89], j[3] = [276, 12, 89]',
                '    addr i[0]',
                '    mod 0, 1',
                '    addr i[1]',
                '    mod 0, 1',
                '    addr j[0]',
                '    mod 0, 1',
                '    addr j[1]',
                '    mod 0, 1',
                '    addr j[2]',
                '    mod 0, 1',
                'end'
            ],
            [
                56, 89, 276, 12, 89
            ]
        );
    }
);
