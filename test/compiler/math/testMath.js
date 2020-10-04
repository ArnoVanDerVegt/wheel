/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const testCodeAndMemory = require('../../utils').testCodeAndMemory;
const testLogs          = require('../../utils').testLogs;
const LocalMathModule   = require('../../../js/frontend/vm/modules/local/MathModule');

describe(
    'Test math',
    () => {
        describe(
            'Test single operator',
            () => {
                testCodeAndMemory(
                    it,
                    'Multiplies a global number with a constant',
                    [
                        'number a',
                        'number b',
                        'proc main()',
                        '    a = b * 59',
                        'end'
                    ],
                    [
                        '0000|0000 set     [stack + 0],    59',
                        '0001|0001 mul     [stack + 0],    [10]',
                        '0002|0001 set     [9],            [stack + 0]'
                    ],
                    false
                );
                testCodeAndMemory(
                    it,
                    'Divides a global number with a constant',
                    [
                        'number a',
                        'number b',
                        'proc main()',
                        '    a = b / 47',
                        'end'
                    ],
                    [
                        '0000|0000 set     [stack + 0],    47',
                        '0001|0001 set     [stack + 1],    [10]',
                        '0002|0001 div     [stack + 1],    [stack + 0]',
                        '0003|0001 set     [9],            [stack + 1]'
                    ],
                    false
                );
                testCodeAndMemory(
                    it,
                    'Multiplies a global number with a global number',
                    [
                        'number a',
                        'number b',
                        'number c',
                        'proc main()',
                        '    a = b * c',
                        'end'
                    ],
                    [
                        '0000|0000 set     [stack + 0],    [11]',
                        '0001|0001 mul     [stack + 0],    [10]',
                        '0002|0001 set     [9],            [stack + 0]'
                    ],
                    false
                );
                testCodeAndMemory(
                    it,
                    'Adds two constants',
                    [
                        'number a',
                        'proc main()',
                        '    a = 9 + 23',
                        'end'
                    ],
                    [
                        '0000|0000 set     [9],            32'
                    ],
                    [
                        10, 0, 0, 0, 1, 0, 0, 0, 0, 32
                    ]
                );
                testCodeAndMemory(
                    it,
                    'Subtracts two constants',
                    [
                        'number a',
                        'proc main()',
                        '    a = 47 - 11',
                        'end'
                    ],
                    [
                        '0000|0000 set     [9],            36'
                    ],
                    [
                        10, 0, 0, 0, 1, 0, 0, 0, 0, 36
                    ]
                );
            }
        );
        describe(
            'Test two operators',
            () => {
                testCodeAndMemory(
                    it,
                    'Multiplies a global number with a constant and adds a constant',
                    [
                        'number a',
                        'number b',
                        'proc main()',
                        '    a = b * 56 + 13',
                        'end'
                    ],
                    [
                        '0000|0000 set     [stack + 0],    13',
                        '0001|0001 set     [stack + 1],    56',
                        '0002|0002 mul     [stack + 1],    [10]',
                        '0003|0002 add     [stack + 0],    [stack + 1]',
                        '0004|0002 set     [9],            [stack + 0]'
                    ],
                    false
                );
                testCodeAndMemory(
                    it,
                    'Multiplies a global number with a constant and adds a number',
                    [
                        'number a',
                        'number b',
                        'number c',
                        'proc main()',
                        '    a = b * 85 + c',
                        'end'
                    ],
                    [
                        '0000|0000 set     [stack + 0],    [11]',
                        '0001|0001 set     [stack + 1],    85',
                        '0002|0002 mul     [stack + 1],    [10]',
                        '0003|0002 add     [stack + 0],    [stack + 1]',
                        '0004|0002 set     [9],            [stack + 0]'
                    ],
                    false
                );
            }
        );
        describe(
            'Test parenthesis',
            () => {
                testCodeAndMemory(
                    it,
                    'Adds two constants and multiplies with a constant',
                    [
                        'number a',
                        'proc main()',
                        '    a = (5 + 3) * 21',
                        'end'
                    ],
                    [
                        '0000|0000 set     [9],            168'
                    ],
                    [
                        10, 0, 0, 0, 1, 0, 0, 0, 0, 168
                    ]
                );
                testCodeAndMemory(
                    it,
                    'Sustracts two constants and multiplies with a constant',
                    [
                        'number a',
                        'proc main()',
                        '    a = (94 - 15) * 7',
                        'end'
                    ],
                    [
                        '0000|0000 set     [9],            553'
                    ],
                    [
                        10, 0, 0, 0, 1, 0, 0, 0, 0, 553
                    ]
                );
            }
        );
        describe(
            'Test math expression as index',
            () => {
                testCodeAndMemory(
                    it,
                    'Multiplies two constant numbers as index',
                    [
                        'number a[15]',
                        'proc main()',
                        '    a[2 * 3] = 7',
                        'end'
                    ],
                    [
                        '0000|0000 set     [stack + 0],    7',
                        '0001|0000 set     ptr,            9',
                        '0002|0001 set     [stack + 2],    6',
                        '0003|0001 set     range1,         15',
                        '0004|0001 set     range2,         [stack + 2]',
                        '0005|0001 mod     0,              0',
                        '0006|0001 add     ptr,            [stack + 2]',
                        '0007|0001 set     [ptr + 0],      [stack + 0]'
                    ],
                    [
                        24, 0, 0, 15, 8, 0, 0, 15, 6, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 6
                    ]
                );
            }
        );
        testLogs(
            it,
            'Should ignore redundant parenthesis',
            [
                'proc main()',
                '    number n1, n2',
                '    n1 = 79',
                '    n2 = ((n1 * 2))',
                '    addr n2',
                '    mod 0, 1',
                'end'
            ],
            [
                158
            ]
        );
        testLogs(
            it,
            'Should multiply and add',
            [
                'proc main()',
                '    number n',
                '    number angle',
                '    n = 1',
                '    angle = n * 360 / 10',
                '    addr angle',
                '    mod 0, 1',
                'end'
            ],
            [
                36
            ]
        );
        describe(
            'Test sine list',
            () => {
                let logs = [];
                for (let n = 0; n < 32; n++) {
                    let angle1 = n * Math.PI / 32;
                    logs.push(79 + Math.sin(angle1) * 20);
                    logs.push(64 + Math.cos(angle1) * 20);
                    let angle2 = (n + 1) * Math.PI / 32;
                    logs.push(79 + Math.sin(angle2) * 20);
                    logs.push(64 + Math.cos(angle2) * 20);
                }
                testLogs(
                    it,
                    'Should multiply and add',
                    [
                        'proc sin(number angle)',
                        '    addr angle',
                        '    mod  1, 6',
                        '    ret  angle',
                        'end',
                        'proc cos(number angle)',
                        '    addr angle',
                        '    mod  1, 7',
                        '    ret  angle',
                        'end',
                        'proc main()',
                        '    number n',
                        '    number angle1, angle2',
                        '    number x1, y1',
                        '    number x2, y2',
                        '    for n = 0 to 31',
                        '        angle1 = n * ' + Math.PI + ' / 32',
                        '        x1     = 79 + sin(angle1) * 20',
                        '        y1     = 64 + cos(angle1) * 20',
                        '        angle2 = (n + 1) * ' + Math.PI + ' / 32',
                        '        x2     = 79 + sin(angle2) * 20',
                        '        y2     = 64 + cos(angle2) * 20',
                        '        addr x1',
                        '        mod 0, 1',
                        '        addr y1',
                        '        mod 0, 1',
                        '        addr x2',
                        '        mod 0, 1',
                        '        addr y2',
                        '        mod 0, 1',
                        '    end',
                        'end'
                    ],
                    logs
                );
            }
        );
    }
);
