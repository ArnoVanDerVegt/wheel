/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const testCodeAndMemory = require('../../utils').testCodeAndMemory;
const testLogs          = require('../../utils').testLogs;

describe(
    'Test records',
    () => {
        describe(
            'Test global record',
            () => {
                testCodeAndMemory(
                    it,
                    'Declares global record, assigns first field',
                    [
                        'record Point',
                        '    number x',
                        '    number y',
                        'end',
                        'Point point',
                        'proc main()',
                        '    point.x = 23',
                        'end'
                    ],
                    [
                        '0000|0000 set     [9],            23'
                    ],
                    [
                        11, 0, 0, 0, 1, 0, 0, 0, 0, 23
                    ]
                );
                testCodeAndMemory(
                    it,
                    'Declares global record, assigns second field',
                    [
                        'record Point',
                        '    number x',
                        '    number y',
                        'end',
                        'Point point',
                        'proc main()',
                        '    point.y = 24',
                        'end'
                    ],
                    [
                        '0000|0000 set     [10],           24'
                    ],
                    [
                        11, 0, 0, 0, 1, 0, 0, 0, 0, 0, 24
                    ]
                );
                testCodeAndMemory(
                    it,
                    'Declares global record, assigns first and second field',
                    [
                        'record Point',
                        '    number x',
                        '    number y',
                        'end',
                        'Point point',
                        'proc main()',
                        '    point.x = 31',
                        '    point.y = 32',
                        'end'
                    ],
                    [
                        '0000|0000 set     [9],            31',
                        '0001|0001 set     [10],           32'
                    ],
                    [
                        11, 0, 0, 0, 2, 0, 0, 0, 0, 31, 32
                    ]
                );
                testCodeAndMemory(
                    it,
                    'Declares global record, assigns global number to first field',
                    [
                        'record Point',
                        '    number x',
                        '    number y',
                        'end',
                        'number n',
                        'Point point',
                        'proc main()',
                        '    point.x = n',
                        'end'
                    ],
                    [
                        '0000|0000 set     [10],           [9]'
                    ],
                    false
                );
                testCodeAndMemory(
                    it,
                    'Declares global record, assigns local number to first field',
                    [
                        'record Point',
                        '    number x, y',
                        'end',
                        'Point point',
                        'proc main()',
                        '    number n',
                        '    point.x = n',
                        'end'
                    ],
                    [
                        '0000|0000 set     [9],            [stack + 0]'
                    ],
                    false
                );
                testCodeAndMemory(
                    it,
                    'Declares global record, assigns global number to second field',
                    [
                        'record Point',
                        '    number x',
                        '    number y',
                        'end',
                        'number n',
                        'Point point',
                        'proc main()',
                        '    point.y = n',
                        'end'
                    ],
                    [
                        '0000|0000 set     [11],           [9]'
                    ],
                    false
                );
                testCodeAndMemory(
                    it,
                    'Declares global record, assigns local number to second field',
                    [
                        'record Point',
                        '    number x',
                        '    number y',
                        'end',
                        'Point point',
                        'proc main()',
                        '    number n',
                        '    point.y = n',
                        'end'
                    ],
                    [
                        '0000|0000 set     [10],           [stack + 0]'
                    ],
                    false
                );
            }
        );
        describe(
            'Test local record',
            () => {
                testCodeAndMemory(
                    it,
                    'Declares local record, assigns first field',
                    [
                        'proc main()',
                        '    record Point',
                        '        number x',
                        '        number y',
                        '    end',
                        '    Point point',
                        '    point.x = 23',
                        'end'
                    ],
                    [
                        '0000|0000 set     [stack + 0],    23'
                    ],
                    [
                        9, 0, 0, 0, 1, 0, 0, 0, 0, 23
                    ]
                );
                testCodeAndMemory(
                    it,
                    'Declares local record, assigns second field',
                    [
                        'proc main()',
                        '    record Point',
                        '        number x, y',
                        '    end',
                        '    Point point',
                        '    point.y = 24',
                        'end'
                    ],
                    [
                        '0000|0000 set     [stack + 1],    24'
                    ],
                    [
                        9, 0, 0, 0, 1, 0, 0, 0, 0, 0, 24
                    ]
                );
                testCodeAndMemory(
                    it,
                    'Declares local record, assigns first and second field',
                    [
                        'proc main()',
                        '    record Point',
                        '        number x',
                        '        number y',
                        '    end',
                        '    Point point',
                        '    point.x = 31',
                        '    point.y = 32',
                        'end'
                    ],
                    [
                        '0000|0000 set     [stack + 0],    31',
                        '0001|0001 set     [stack + 1],    32'
                    ],
                    [
                        9, 0, 0, 0, 2, 0, 0, 0, 0, 31, 32
                    ]
                );
                testCodeAndMemory(
                    it,
                    'Declares local record, assigns global number to first field',
                    [
                        'number n',
                        'proc main()',
                        '    record Point',
                        '        number x',
                        '        number y',
                        '    end',
                        '    Point point',
                        '    point.x = n',
                        'end'
                    ],
                    [
                        '0000|0000 set     [stack + 0],    [9]'
                    ],
                    false
                );
                testCodeAndMemory(
                    it,
                    'Declares local record, assigns local number to first field',
                    [
                        'proc main()',
                        '    record Point',
                        '        number x, y',
                        '    end',
                        '    Point point',
                        '    number n',
                        '    point.x = n',
                        'end'
                    ],
                    [
                        '0000|0000 set     [stack + 0],    [stack + 2]'
                    ],
                    false
                );
                testCodeAndMemory(
                    it,
                    'Declares local record, assigns global number to second field',
                    [
                        'number n',
                        'proc main()',
                        '    record Point',
                        '        number x',
                        '        number y',
                        '    end',
                        '    Point point',
                        '    point.y = n',
                        'end'
                    ],
                    [
                        '0000|0000 set     [stack + 1],    [9]'
                    ],
                    false
                );
                testCodeAndMemory(
                    it,
                    'Declares local record, assigns local number to second field',
                    [
                        'proc main()',
                        '    record Point',
                        '        number x',
                        '        number y',
                        '    end',
                        '    Point point',
                        '    number n',
                        '    point.y = n',
                        'end'
                    ],
                    [
                        '0000|0000 set     [stack + 1],    [stack + 2]'
                    ],
                    false
                );
            }
        );
        describe(
            'Test nested record',
            () => {
                testCodeAndMemory(
                    it,
                    'Declares nested record, assigns first/first field',
                    [
                        'record Point',
                        '    number x',
                        '    number y',
                        'end',
                        'record Line',
                        '     Point a',
                        '     Point b',
                        'end',
                        'Line line',
                        'proc main()',
                        '    line.a.x = 13',
                        'end'
                    ],
                    [
                        '0000|0000 set     [9],            13'
                    ],
                    [
                        13, 0, 0, 0, 1, 0, 0, 0, 0, 13
                    ]
                );
                testCodeAndMemory(
                    it,
                    'Declares nested record, assigns first/second field',
                    [
                        'record Point',
                        '    number x',
                        '    number y',
                        'end',
                        'record Line',
                        '     Point a',
                        '     Point b',
                        'end',
                        'Line line',
                        'proc main()',
                        '    line.a.y = 14',
                        'end'
                    ],
                    [
                        '0000|0000 set     [10],           14'
                    ],
                    [
                        13, 0, 0, 0, 1, 0, 0, 0, 0, 0, 14
                    ]
                );
                testCodeAndMemory(
                    it,
                    'Declares nested record, assigns second/first field',
                    [
                        'record Point',
                        '    number x',
                        '    number y',
                        'end',
                        'record Line',
                        '     Point a',
                        '     Point b',
                        'end',
                        'Line line',
                        'proc main()',
                        '    line.b.x = 21',
                        'end'
                    ],
                    [
                        '0000|0000 set     [11],           21'
                    ],
                    [
                        13, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 21
                    ]
                );
                testCodeAndMemory(
                    it,
                    'Declares nested record, assigns second/second field',
                    [
                        'record Point',
                        '    number x',
                        '    number y',
                        'end',
                        'record Line',
                        '     Point a',
                        '     Point b',
                        'end',
                        'Line line',
                        'proc main()',
                        '    line.b.y = 57',
                        'end'
                    ],
                    [
                        '0000|0000 set     [12],           57'
                    ],
                    [
                        13, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 57
                    ]
                );
                testCodeAndMemory(
                    it,
                    'Declares nested record, assigns first/first field to local number',
                    [
                        'record Point',
                        '    number x',
                        '    number y',
                        'end',
                        'record Line',
                        '     Point a',
                        '     Point b',
                        'end',
                        'Line line',
                        'proc main()',
                        '    number n',
                        '    n = line.a.x',
                        'end'
                    ],
                    [
                        '0000|0000 set     [stack + 0],    [9]'
                    ],
                    false
                );
                testCodeAndMemory(
                    it,
                    'Declares nested record, assigns first/second field to local number',
                    [
                        'record Point',
                        '    number x',
                        '    number y',
                        'end',
                        'record Line',
                        '     Point a',
                        '     Point b',
                        'end',
                        'Line line',
                        'proc main()',
                        '    number n',
                        '    n = line.a.y',
                        'end'
                    ],
                    [
                        '0000|0000 set     [stack + 0],    [10]'
                    ],
                    false
                );
                testCodeAndMemory(
                    it,
                    'Declares nested record, assigns second/first field to local number',
                    [
                        'record Point',
                        '    number x',
                        '    number y',
                        'end',
                        'record Line',
                        '     Point a',
                        '     Point b',
                        'end',
                        'Line line',
                        'proc main()',
                        '    number n',
                        '    n = line.b.x',
                        'end'
                    ],
                    [
                        '0000|0000 set     [stack + 0],    [11]'
                    ],
                    false
                );
                testCodeAndMemory(
                    it,
                    'Declares nested record, assigns second/second field to local number',
                    [
                        'record Point',
                        '    number x',
                        '    number y',
                        'end',
                        'record Line',
                        '     Point a',
                        '     Point b',
                        'end',
                        'Line line',
                        'proc main()',
                        '    number n',
                        '    n = line.b.y',
                        'end'
                    ],
                    [
                        '0000|0000 set     [stack + 0],    [12]'
                    ],
                    false
                );
            }
        );
        describe(
            'Test global array/record',
            () => {
                testCodeAndMemory(
                    it,
                    'Declares global array and global record, assigns array with constant zero index to first record field',
                    [
                        'number n[10]',
                        'record Point',
                        '    number x',
                        '    number y',
                        'end',
                        'Point point',
                        'proc main()',
                        '    point.x = n[0]',
                        'end'
                    ],
                    [
                        '0000|0000 set     [19],           [9]'
                    ],
                    false
                );
                testCodeAndMemory(
                    it,
                    'Declares global array and global record, assigns array with constant non zero index to first record field',
                    [
                        'number n[10]',
                        'record Point',
                        '    number x',
                        '    number y',
                        'end',
                        'Point point',
                        'proc main()',
                        '    point.x = n[2]',
                        'end'
                    ],
                    [
                        '0000|0000 set     [19],           [11]'
                    ],
                    false
                );
                testCodeAndMemory(
                    it,
                    'Declares global array and global record, assigns array with global number to first record field',
                    [
                        'number n[10]',
                        'record Point',
                        '    number x',
                        '    number y',
                        'end',
                        'Point point',
                        'number a',
                        'proc main()',
                        '    point.x = n[a]',
                        'end'
                    ],
                    [
                        '0000|0000 set     ptr,            9',
                        '0001|0000 set     range1,         10',
                        '0002|0000 set     range2,         [21]',
                        '0003|0000 mod     0,              0',
                        '0004|0000 add     ptr,            [21]',
                        '0005|0000 set     [19],           [ptr + 0]'
                    ],
                    false
                );
                testCodeAndMemory(
                    it,
                    'Declares global array and global record, assigns array with constant zero index to second record field',
                    [
                        'number n[10]',
                        'record Point',
                        '    number x',
                        '    number y',
                        'end',
                        'Point point',
                        'number a',
                        'proc main()',
                        '    point.y = n[a]',
                        'end'
                    ],
                    [
                        '0000|0000 set     ptr,            9',
                        '0001|0000 set     range1,         10',
                        '0002|0000 set     range2,         [21]',
                        '0003|0000 mod     0,              0',
                        '0004|0000 add     ptr,            [21]',
                        '0005|0000 set     [20],           [ptr + 0]'
                    ],
                    false
                );
                testCodeAndMemory(
                    it,
                    'Declares global array and global record, assigns array with constant non zero index to second record field',
                    [
                        'number n[10]',
                        'record Point',
                        '    number x',
                        '    number y',
                        'end',
                        'Point point',
                        'proc main()',
                        '    point.y = n[2]',
                        'end'
                    ],
                    [
                        '0000|0000 set     [20],           [11]'
                    ],
                    false
                );
                testCodeAndMemory(
                    it,
                    'Declares global array and global record, assigns array with global number to second record field',
                    [
                        'number n[10]',
                        'record Point',
                        '    number x',
                        '    number y',
                        'end',
                        'Point point',
                        'number a',
                        'proc main()',
                        '    point.y = n[a]',
                        'end'
                    ],
                    [
                        '0000|0000 set     ptr,            9',
                        '0001|0000 set     range1,         10',
                        '0002|0000 set     range2,         [21]',
                        '0003|0000 mod     0,              0',
                        '0004|0000 add     ptr,            [21]',
                        '0005|0000 set     [20],           [ptr + 0]'
                    ],
                    false
                );
                testCodeAndMemory(
                    it,
                    'Declares global array and global record, assigns first record field to constant zero array index',
                    [
                        'number n[10]',
                        'record Point',
                        '    number x',
                        '    number y',
                        'end',
                        'Point point',
                        'proc main()',
                        '    n[0] = point.x',
                        'end'
                    ],
                    [
                        '0000|0000 set     [9],            [19]'
                    ],
                    false
                );
                testCodeAndMemory(
                    it,
                    'Declares global array and global record, assigns first record field to constant non zero array index',
                    [
                        'number n[10]',
                        'record Point',
                        '    number x',
                        '    number y',
                        'end',
                        'Point point',
                        'proc main()',
                        '    n[1] = point.x',
                        'end'
                    ],
                    [
                        '0000|0000 set     [10],           [19]'
                    ],
                    false
                );
                testCodeAndMemory(
                    it,
                    'Declares global array and global record, assigns second record field to constant zero array index',
                    [
                        'number n[10]',
                        'record Point',
                        '    number x',
                        '    number y',
                        'end',
                        'Point point',
                        'proc main()',
                        '    n[0] = point.y',
                        'end'
                    ],
                    [
                        '0000|0000 set     [9],            [20]'
                    ],
                    false
                );
                testCodeAndMemory(
                    it,
                    'Declares global array and global record, assigns second record field to constant non zero array index',
                    [
                        'number n[10]',
                        'record Point',
                        '    number x',
                        '    number y',
                        'end',
                        'Point point',
                        'proc main()',
                        '    n[1] = point.y',
                        'end'
                    ],
                    [
                        '0000|0000 set     [10],           [20]'
                    ],
                    false
                );
            }
        );
        describe(
            'Test local array/record',
            () => {
                testCodeAndMemory(
                    it,
                    'Declares local array and local record, assigns array with constant zero index to first record field',
                    [
                        'proc main()',
                        '    number n[5]',
                        '    record Point',
                        '        number x',
                        '        number y',
                        '    end',
                        '    Point point',
                        '    point.x = n[0]',
                        'end'
                    ],
                    [
                        '0000|0000 set     [stack + 5],    [stack + 0]'
                    ],
                    false
                );
                testCodeAndMemory(
                    it,
                    'Declares local array and local record, assigns array with constant non zero index to first record field',
                    [
                        'proc main()',
                        '    number n[9]',
                        '    record Point',
                        '        number x',
                        '        number y',
                        '    end',
                        '    Point point',
                        '    point.x = n[2]',
                        'end'
                    ],
                    [
                        '0000|0000 set     [stack + 9],    [stack + 2]'
                    ],
                    false
                );
                testCodeAndMemory(
                    it,
                    'Declares local array and local record, assigns array with local number to first record field',
                    [
                        'proc main()',
                        '    number n[6]',
                        '    record Point',
                        '        number x',
                        '        number y',
                        '    end',
                        '    Point point',
                        '    number a',
                        '    point.x = n[a]',
                        'end'
                    ],
                    [
                        '0000|0000 set     ptr,            stack',
                        '0001|0000 set     range1,         6',
                        '0002|0000 set     range2,         [stack + 8]',
                        '0003|0000 mod     0,              0',
                        '0004|0000 add     ptr,            [stack + 8]',
                        '0005|0000 set     [stack + 6],    [ptr + 0]'
                    ],
                    false
                );
                testCodeAndMemory(
                    it,
                    'Declares local array and local record, assigns array with constant zero index to second record field',
                    [
                        'proc main()',
                        '    number n[3]',
                        '    record Point',
                        '        number x',
                        '        number y',
                        '    end',
                        '    Point point',
                        '    number a',
                        '    point.y = n[a]',
                        'end'
                    ],
                    [
                        '0000|0000 set     ptr,            stack',
                        '0001|0000 set     range1,         3',
                        '0002|0000 set     range2,         [stack + 5]',
                        '0003|0000 mod     0,              0',
                        '0004|0000 add     ptr,            [stack + 5]',
                        '0005|0000 set     [stack + 4],    [ptr + 0]'
                    ],
                    false
                );
                testCodeAndMemory(
                    it,
                    'Declares local array and local record, assigns array with constant non zero index to second record field',
                    [
                        'proc main()',
                        '    number n[9]',
                        '    record Point',
                        '        number x',
                        '        number y',
                        '    end',
                        '    Point point',
                        '    point.y = n[2]',
                        'end'
                    ],
                    [
                        '0000|0000 set     [stack + 10],   [stack + 2]'
                    ],
                    false
                );
                testCodeAndMemory(
                    it,
                    'Declares local array and local record, assigns array with local number to second record field',
                    [
                        'proc main()',
                        '    number n[4]',
                        '    record Point',
                        '        number x',
                        '        number y',
                        '    end',
                        '    Point point',
                        '    number a',
                        '    point.y = n[a]',
                        'end'
                    ],
                    [
                        '0000|0000 set     ptr,            stack',
                        '0001|0000 set     range1,         4',
                        '0002|0000 set     range2,         [stack + 6]',
                        '0003|0000 mod     0,              0',
                        '0004|0000 add     ptr,            [stack + 6]',
                        '0005|0000 set     [stack + 5],    [ptr + 0]'
                    ],
                    false
                );
                testCodeAndMemory(
                    it,
                    'Declares local array and local record, assigns first record field to constant zero array index',
                    [
                        'proc main()',
                        '    number n[10]',
                        '    record Point',
                        '        number x',
                        '        number y',
                        '    end',
                        '    Point point',
                        '    n[0] = point.x',
                        'end'
                    ],
                    [
                        '0000|0000 set     [stack + 0],    [stack + 10]'
                    ],
                    false
                );
                testCodeAndMemory(
                    it,
                    'Declares local array and local record, assigns second record field to constant zero array index',
                    [
                        'proc main()',
                        '    number n[5]',
                        '    record Point',
                        '        number x',
                        '        number y',
                        '    end',
                        '    Point point',
                        '    n[0] = point.y',
                        'end'
                    ],
                    [
                        '0000|0000 set     [stack + 0],    [stack + 6]'
                    ],
                    false
                );
                testCodeAndMemory(
                    it,
                    'Declares local array and local record, assigns second record field to constant non zero array index',
                    [
                        'proc main()',
                        '    number n[5]',
                        '    record Point',
                        '        number x',
                        '        number y',
                        '    end',
                        '    Point point',
                        '    n[1] = point.y',
                        'end'
                    ],
                    [
                        '0000|0000 set     [stack + 1],    [stack + 6]'
                    ],
                    false
                );
            }
        );
        describe(
            'Test number array field',
            () => {
                testCodeAndMemory(
                    it,
                    'Declares record with array of number as first field, assigns first index',
                    [
                        'record Rec',
                        '    number a[3]',
                        'end',
                        'Rec r',
                        'proc main()',
                        '    r.a[0] = 21',
                        'end'
                    ],
                    [
                        '0000|0000 set     [9],            21'
                    ],
                    [
                        12, 0, 0, 0, 1, 0, 0, 0, 0, 21
                    ]
                );
                testCodeAndMemory(
                    it,
                    'Declares record with array of number as first field, assigns second index',
                    [
                        'record Rec',
                        '    number a[7]',
                        'end',
                        'Rec r',
                        'proc main()',
                        '    r.a[1] = 25',
                        'end'
                    ],
                    [
                        '0000|0000 set     [10],           25'
                    ],
                    [
                        16, 0, 0, 0, 1, 0, 0, 0, 0, 0, 25
                    ]
                );
                testCodeAndMemory(
                    it,
                    'Declares record with array of number as second field, assigns first index',
                    [
                        'record Rec',
                        '    number a',
                        '    number b[10]',
                        'end',
                        'Rec r',
                        'proc main()',
                        '    r.b[0] = 45',
                        'end'
                    ],
                    [
                        '0000|0000 set     [10],           45'
                    ],
                    [
                        20, 0, 0, 0, 1, 0, 0, 0, 0, 0, 45
                    ]
                );
                testCodeAndMemory(
                    it,
                    'Declares record with array of number as second field, assigns second index',
                    [
                        'record Rec',
                        '    number a',
                        '    number b[5]',
                        'end',
                        'Rec r',
                        'proc main()',
                        '    r.b[1] = 13',
                        'end'
                    ],
                    [
                        '0000|0000 set     [11],           13'
                    ],
                    [
                        15, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 13
                    ]
                );
            }
        );
        describe(
            'Test record array field',
            () => {
                testCodeAndMemory(
                    it,
                    'Declares record and record with array of record field, assigns first field number value with zero constant index',
                    [
                        'record Rec',
                        '    number a',
                        'end',
                        'record Recs',
                        '    Rec a[10]',
                        'end',
                        'Recs r',
                        'proc main()',
                        '    r.a[0].a = 23',
                        'end'
                    ],
                    [
                        '0000|0000 set     [9],            23'
                    ],
                    [
                        19, 0, 0, 0, 1, 0, 0, 0, 0, 23
                    ]
                );
                testCodeAndMemory(
                    it,
                    'Declares record and record with array of record field, assigns first field number value with non zero constant index',
                    [
                        'record Rec',
                        '    number a',
                        'end',
                        'record Recs',
                        '    Rec a[10]',
                        'end',
                        'Recs r',
                        'proc main()',
                        '    r.a[1].a = 78',
                        'end'
                    ],
                    [
                        '0000|0000 set     [10],           78'
                    ],
                    [
                        19, 0, 0, 0, 1, 0, 0, 0, 0, 0, 78
                    ]
                );
                testCodeAndMemory(
                    it,
                    'Declares record and record with array of record field, assigns first field number value with number index',
                    [
                        'record Rec',
                        '    number a',
                        'end',
                        'record Recs',
                        '    Rec a[10]',
                        'end',
                        'Recs r',
                        'number i',
                        'proc main()',
                        '    r.a[i].a = 91',
                        'end'
                    ],
                    [
                        '0000|0000 set     [stack + 0],    91',
                        '0001|0000 set     ptr,            9',
                        '0002|0000 set     range1,         10',
                        '0003|0000 set     range2,         [19]',
                        '0004|0000 mod     0,              0',
                        '0005|0000 add     ptr,            [19]',
                        '0006|0000 set     [ptr + 0],      [stack + 0]'
                    ],
                    false
                );
                testCodeAndMemory(
                    it,
                    'Declares record and record with array of record with two fields, assigns first field number value with zero constant index',
                    [
                        'record Rec',
                        '    number a',
                        '    number b',
                        'end',
                        'record Recs',
                        '    Rec a[10]',
                        'end',
                        'Recs r',
                        'proc main()',
                        '    r.a[0].a = 23',
                        'end'
                    ],
                    [
                        '0000|0000 set     [9],            23'
                    ],
                    [
                        29, 0, 0, 0, 1, 0, 0, 0, 0, 23
                    ]
                );
                testCodeAndMemory(
                    it,
                    'Declares record and record with array of record with two fields, assigns first field number value with non zero constant index',
                    [
                        'record Rec',
                        '    number a',
                        '    number b',
                        'end',
                        'record Recs',
                        '    Rec a[10]',
                        'end',
                        'Recs r',
                        'proc main()',
                        '    r.a[1].a = 17',
                        'end'
                    ],
                    [
                        '0000|0000 set     [11],           17'
                    ],
                    [
                        29, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 17
                    ]
                );
                testCodeAndMemory(
                    it,
                    'Declares record and record with array of record field, assigns first field number value with number index',
                    [
                        'record Rec',
                        '    number a',
                        '    number b',
                        'end',
                        'record Recs',
                        '    Rec a[10]',
                        'end',
                        'Recs r',
                        'number i',
                        'proc main()',
                        '    r.a[i].a = 61',
                        'end'
                    ],
                    [
                        '0000|0000 set     [stack + 0],    61',
                        '0001|0000 set     ptr,            9',
                        '0002|0000 set     range1,         10',
                        '0003|0000 set     range2,         [29]',
                        '0004|0000 mod     0,              0',
                        '0005|0000 set     [stack + 1],    [29]',
                        '0006|0000 mul     [stack + 1],    2',
                        '0007|0000 add     ptr,            [stack + 1]',
                        '0008|0000 set     [ptr + 0],      [stack + 0]'
                    ],
                    false
                );
                testCodeAndMemory(
                    it,
                    'Declares record and record with array of record with two fields, assigns second field number value with zero constant index',
                    [
                        'record Rec',
                        '    number a',
                        '    number b',
                        'end',
                        'record Recs',
                        '    Rec a[10]',
                        'end',
                        'Recs r',
                        'proc main()',
                        '    r.a[0].b = 99',
                        'end'
                    ],
                    [
                        '0000|0000 set     [10],           99'
                    ],
                    [
                        29, 0, 0, 0, 1, 0, 0, 0, 0, 0, 99
                    ]
                );
                testCodeAndMemory(
                    it,
                    'Declares record and record with array of record with two fields, assigns first field number value with non zero constant index',
                    [
                        'record Rec',
                        '    number a',
                        '    number b',
                        'end',
                        'record Recs',
                        '    Rec a[10]',
                        'end',
                        'Recs r',
                        'proc main()',
                        '    r.a[1].b = 48',
                        'end'
                    ],
                    [
                        '0000|0000 set     [12],           48'
                    ],
                    [
                        29, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 48
                    ]
                );
                testCodeAndMemory(
                    it,
                    'Declares record and record with array of record field, assigns first field number value with number index',
                    [
                        'record Rec',
                        '    number a',
                        '    number b',
                        'end',
                        'record Recs',
                        '    Rec a[10]',
                        'end',
                        'Recs r',
                        'number i',
                        'proc main()',
                        '    r.a[i].a = 78',
                        'end'
                    ],
                    [
                        '0000|0000 set     [stack + 0],    78',
                        '0001|0000 set     ptr,            9',
                        '0002|0000 set     range1,         10',
                        '0003|0000 set     range2,         [29]',
                        '0004|0000 mod     0,              0',
                        '0005|0000 set     [stack + 1],    [29]',
                        '0006|0000 mul     [stack + 1],    2',
                        '0007|0000 add     ptr,            [stack + 1]',
                        '0008|0000 set     [ptr + 0],      [stack + 0]'
                    ],
                    false
                );
            }
        );
        describe(
            'Test local record constant',
            () => {
                testLogs(
                    it,
                    'Should declare constant',
                    [
                        'record Point',
                        '    number x, y',
                        'end',
                        'proc main()',
                        '    Point p = {56, 91}',
                        '    addr p.y',
                        '    mod 0, 1',
                        '    addr p.x',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        91, 56
                    ]
                );
                testLogs(
                    it,
                    'Should declare nested constant',
                    [
                        'record Point',
                        '    number x, y',
                        'end',
                        'record Line',
                        '    Point p1, p2',
                        'end',
                        'proc main()',
                        '    Line line = {{23, 92}, {56, 12}}',
                        '    addr line.p2.y',
                        '    mod 0, 1',
                        '    addr line.p2.x',
                        '    mod 0, 1',
                        '    addr line.p1.y',
                        '    mod 0, 1',
                        '    addr line.p1.x',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        12, 56, 92, 23
                    ]
                );
                testLogs(
                    it,
                    'Should declare constant with array fields',
                    [
                        'record Line',
                        '    number p1[2], p2[2]',
                        'end',
                        'proc main()',
                        '    Line line = {[72, 50], [31, 58]}',
                        '    addr line.p2[1]',
                        '    mod 0, 1',
                        '    addr line.p2[0]',
                        '    mod 0, 1',
                        '    addr line.p1[1]',
                        '    mod 0, 1',
                        '    addr line.p1[0]',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        58, 31, 50, 72
                    ]
                );
                testLogs(
                    it,
                    'Should declare constant with record array fields',
                    [
                        'record Point',
                        '    number x, y',
                        'end',
                        'record Line',
                        '    Point p[2]',
                        'end',
                        'proc main()',
                        '    Line l = {[{58, 37}, {583, 67}]}',
                        '    addr l.p[1].y',
                        '    mod 0, 1',
                        '    addr l.p[1].x',
                        '    mod 0, 1',
                        '    addr l.p[0].y',
                        '    mod 0, 1',
                        '    addr l.p[0].x',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        67, 583, 37, 58
                    ]
                );
            }
        );
        describe(
            'Test global record constant',
            () => {
                testLogs(
                    it,
                    'Should declare constant',
                    [
                        'record Point',
                        '    number x, y',
                        'end',
                        'Point p = {524, 23}',
                        'proc main()',
                        '    addr p.y',
                        '    mod 0, 1',
                        '    addr p.x',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        23, 524
                    ]
                );
                testLogs(
                    it,
                    'Should declare nested constant',
                    [
                        'record Point',
                        '    number x, y',
                        'end',
                        'record Line',
                        '    Point p1, p2',
                        'end',
                        'Line line = {{67, 94}, {27, 19}}',
                        'proc main()',
                        '    addr line.p2.y',
                        '    mod 0, 1',
                        '    addr line.p2.x',
                        '    mod 0, 1',
                        '    addr line.p1.y',
                        '    mod 0, 1',
                        '    addr line.p1.x',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        19, 27, 94, 67
                    ]
                );
                testLogs(
                    it,
                    'Should declare constant with array fields',
                    [
                        'record Line',
                        '    number p1[2], p2[2]',
                        'end',
                        'Line line = {[589, 591], [283, 325]}',
                        'proc main()',
                        '    addr line.p2[1]',
                        '    mod 0, 1',
                        '    addr line.p2[0]',
                        '    mod 0, 1',
                        '    addr line.p1[1]',
                        '    mod 0, 1',
                        '    addr line.p1[0]',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        325, 283, 591, 589
                    ]
                );
                testLogs(
                    it,
                    'Should declare constant with record array fields',
                    [
                        'record Point',
                        '    number x, y',
                        'end',
                        'record Line',
                        '    Point p[2]',
                        'end',
                        'Line l = {[{58, 37}, {583, 67}]}',
                        'proc main()',
                        '    addr l.p[1].y',
                        '    mod 0, 1',
                        '    addr l.p[1].x',
                        '    mod 0, 1',
                        '    addr l.p[0].y',
                        '    mod 0, 1',
                        '    addr l.p[0].x',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        67, 583, 37, 58
                    ]
                );
            }
        );
        describe(
            'Test record constant assignments',
            () => {
                testLogs(
                    it,
                    'Should assign to local record',
                    [
                        'record Point',
                        '    number x, y',
                        'end',
                        'proc main()',
                        '    Point p',
                        '    p = {378, 15}',
                        '    addr p.y',
                        '    mod 0, 1',
                        '    addr p.x',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        15, 378
                    ]
                );
                testLogs(
                    it,
                    'Should assign to global record',
                    [
                        'record Point',
                        '    number x, y',
                        'end',
                        'Point p',
                        'proc main()',
                        '    p = {397, 39}',
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
            }
        );
    }
);
