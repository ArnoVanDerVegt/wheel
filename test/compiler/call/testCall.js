/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const testLogs          = require('../../utils').testLogs;
const testCodeAndMemory = require('../../utils').testCodeAndMemory;

describe(
    'Test call',
    () => {
        describe(
            'Test call empty procedure',
            () => {
                testCodeAndMemory(
                    it,
                    'Should generate code for empty procedure',
                    [
                        'proc test()',
                        'end',
                        'proc main()',
                        '    test()',
                        'end'
                    ],
                    [
                        '0000|0000 ret     0',
                        '0001|0001 call    0000,           2'
                    ],
                    [
                        9, 0, 0, 0, 2, 0, 0, 0, 0, 9, 1
                    ]
                );
                testLogs(
                    it,
                    'Should call empty procedure without parameters',
                    [
                        'proc test()',
                        'end',
                        'proc main()',
                        '    number n = 41',
                        '    test()',
                        '    addr n',
                        '    mod  0, 1',
                        'end'
                    ],
                    [
                        41
                    ]
                );
                testLogs(
                    it,
                    'Should call empty procedure without parameters',
                    [
                        'proc test(number n)',
                        'end',
                        'proc main()',
                        '    number n = 55',
                        '    test(13)',
                        '    addr n',
                        '    mod  0, 1',
                        'end'
                    ],
                    [
                        55
                    ]
                );
            }
        );
        describe(
            'Test call without parameters',
            () => {
                testLogs(
                    it,
                    'Should call without parameters',
                    [
                        'proc test()',
                        '    number n',
                        '    n = 1235',
                        '    addr n',
                        '    mod 0, 1',
                        'end',
                        'proc main()',
                        '    test()',
                        'end'
                    ],
                    [
                        1235
                    ]
                );
                testLogs(
                    it,
                    'Should call without parameters with a global number declared',
                    [
                        'number g',
                        'proc test()',
                        '    number n',
                        '    n = 1238',
                        '    addr n',
                        '    mod 0, 1',
                        'end',
                        'proc main()',
                        '    g = 1899',
                        '    test()',
                        '    addr g',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        1238, 1899
                    ]
                );
            }
        );
        describe(
            'Test call with number parameters',
            () => {
                testLogs(
                    it,
                    'Should call with a single number parameter',
                    [
                        'proc test(number n)',
                        '    addr n',
                        '    mod 0, 1',
                        'end',
                        'proc main()',
                        '    test(4549)',
                        'end'
                    ],
                    [
                        4549
                    ]
                );
                testLogs(
                    it,
                    'Should call with two parameters',
                    [
                        'proc test(number p1, number p2)',
                        '    addr p1',
                        '    mod 0, 1',
                        '    addr p2',
                        '    mod 0, 1',
                        'end',
                        'proc main()',
                        '    test(892, 149)',
                        'end'
                    ],
                    [
                        892, 149
                    ]
                );
                testLogs(
                    it,
                    'Should call with a parmeter and local number',
                    [
                        'proc test(number n)',
                        '    addr n',
                        '    mod 0, 1',
                        'end',
                        'proc main()',
                        '    number n',
                        '    n = 5011',
                        '    test(195)',
                        '    addr n',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        195, 5011
                    ]
                );
                testLogs(
                    it,
                    'Should call with two parmeters and local number',
                    [
                        'proc test(number p1, number p2)',
                        '    addr p1',
                        '    mod 0, 1',
                        '    addr p2',
                        '    mod 0, 1',
                        'end',
                        'proc main()',
                        '    number n',
                        '    n = 9841',
                        '    test(9123, 3478)',
                        '    addr n',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        9123, 3478, 9841
                    ]
                );
                testLogs(
                    it,
                    'Should call with three parmeters and local number',
                    [
                        'proc test(number p1, number p2, number p3)',
                        '    addr p1',
                        '    mod 0, 1',
                        '    addr p2',
                        '    mod 0, 1',
                        '    addr p3',
                        '    mod 0, 1',
                        'end',
                        'proc main()',
                        '    number n',
                        '    n = 9841',
                        '    test(9123, 3478, 545)',
                        '    addr n',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        9123, 3478, 545, 9841
                    ]
                );
                testLogs(
                    it,
                    'Should call with four parmeters and local numbers',
                    [
                        'proc test(number p1, number p2, number p3, number p4)',
                        '    number x',
                        '    addr p1',
                        '    mod 0, 1',
                        '    addr p2',
                        '    mod 0, 1',
                        '    addr p3',
                        '    mod 0, 1',
                        '    addr p4',
                        '    mod 0, 1',
                        'end',
                        'proc main()',
                        '    number n',
                        '    n = 9841',
                        '    test(9123, 3478, 545, 31)',
                        '    addr n',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        9123, 3478, 545, 31, 9841
                    ]
                );
            }
        );
        describe(
            'Test call from proc',
            () => {
                testLogs(
                    it,
                    'Should call from proc',
                    [
                        'proc test1(number n)',
                        '    addr n',
                        '    mod 0, 1',
                        'end',
                        'proc test2(number n)',
                        '    test1(n)',
                        'end',
                        'proc main()',
                        '    test2(4567)',
                        'end'
                    ],
                    [
                        4567
                    ]
                );
                testLogs(
                    it,
                    'Should call from proc with local number',
                    [
                        'proc test1(number n)',
                        '    addr n',
                        '    mod 0, 1',
                        'end',
                        'proc test2(number n)',
                        '    number l',
                        '    l = 34666',
                        '    test1(n)',
                        '    addr l',
                        '    mod 0, 1',
                        'end',
                        'proc main()',
                        '    test2(46882)',
                        'end'
                    ],
                    [
                        46882, 34666
                    ]
                );
                testLogs(
                    it,
                    'Should call from proc with local number and global',
                    [
                        'number g',
                        'proc test1(number n)',
                        '    addr n',
                        '    mod 0, 1',
                        '    g = 4681',
                        'end',
                        'proc test2(number n)',
                        '    number l',
                        '    l = 9331',
                        '    test1(n)',
                        '    addr l',
                        '    mod 0, 1',
                        'end',
                        'proc main()',
                        '    test2(67)',
                        '    addr g',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        67, 9331, 4681
                    ]
                );
            }
        );
        describe(
            'Test return value',
            () => {
                testCodeAndMemory(
                    it,
                    'Should return a value',
                    [
                        'proc test()',
                        '    ret 15',
                        'end',
                        'proc main()',
                        '    number n',
                        '    n = test()',
                        '    addr n',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        '0000|0000 ret     15',
                        '0001|0001 ret     0',
                        '0002|0002 call    0000,           4',
                        '0003|0002 set     [stack],        return',
                        '0004|0003 set     src,            0',
                        '0005|0003 add     src,            stack',
                        '0006|0004 mod     0,              1'
                    ],
                    [
                        9, 9, 0, 0, 7, 15, 0, 0, 0, 15, 0, 9, 2
                    ]
                );
                testLogs(
                    it,
                    'Should return a value - log',
                    [
                        'proc test()',
                        '    ret 15',
                        'end',
                        'proc main()',
                        '    number n',
                        '    n = test()',
                        '    addr n',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        15
                    ]
                );
                testLogs(
                    it,
                    'Should return a value and multiply with constant - log',
                    [
                        'proc test()',
                        '    ret 15',
                        'end',
                        'proc main()',
                        '    number n',
                        '    n = test() * 4',
                        '    addr n',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        60
                    ]
                );
                testLogs(
                    it,
                    'Should add a return a value to a constant constant - log',
                    [
                        'proc test()',
                        '    ret 15',
                        'end',
                        'proc main()',
                        '    number n',
                        '    n = 37 + test()',
                        '    addr n',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        52
                    ]
                );
                testLogs(
                    it,
                    'Should add a return a value which is returned - log',
                    [
                        'proc test1()',
                        '    ret 78',
                        'end',
                        'proc test2()',
                        '    ret test1()',
                        'end',
                        'proc main()',
                        '    number n',
                        '    n = test2()',
                        '    addr n',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        78
                    ]
                );
                testLogs(
                    it,
                    'Sould return the value of an expression - log',
                    [
                        'proc test()',
                        '    ret 29 * 2',
                        'end',
                        'proc main()',
                        '    number n',
                        '    n = test()',
                        '    addr n',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        58
                    ]
                );
                testLogs(
                    it,
                    'Sould return the value of an expression with a global - log',
                    [
                        'number g',
                        'proc test()',
                        '    ret 15 * g',
                        'end',
                        'proc main()',
                        '    g = 3',
                        '    number n',
                        '    n = test()',
                        '    addr n',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        45
                    ]
                );
                testLogs(
                    it,
                    'Sould return the value of an expression based on a given parameter - log',
                    [
                        'proc test(number p)',
                        '    ret 11 * p',
                        'end',
                        'proc main()',
                        '    number n',
                        '    n = test(5)',
                        '    addr n',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        55
                    ]
                );
                testLogs(
                    it,
                    'Sould return the value of an expression returned based on a given parameter - log',
                    [
                        'proc test1(number p)',
                        '    ret 13 * p',
                        'end',
                        'proc test2(number p)',
                        '    ret 2 + test1(p)',
                        'end',
                        'proc main()',
                        '    number n',
                        '    n = test2(3)',
                        '    addr n',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        41
                    ]
                );
            }
        );
        describe(
            'Test output with paramters',
            () => {
                testCodeAndMemory(
                    it,
                    'Should generate code for procedure with paramter',
                    [
                        'proc test(number p1, number p2)',
                        'end',
                        'proc main()',
                        '    test(26, 78)',
                        'end'
                    ],
                    [
                        '0000|0000 ret     0',
                        '0001|0001 set     [stack + 4],    26',
                        '0002|0002 set     [stack + 5],    78',
                        '0003|0002 call    0000,           2'
                    ],
                    [
                        9, 0, 0, 0, 4, 0, 0, 0, 0, 9, 3, 0, 0, 26, 78
                    ]
                );
                testCodeAndMemory(
                    it,
                    'Should generate code for procedure with paramter and log',
                    [
                        'proc test(number p1, number p2)',
                        '    addr p1',
                        '    mod  0, 1',
                        '    addr p2',
                        '    mod  0, 1',
                        'end',
                        'proc main()',
                        '    test(26, 78)',
                        'end'
                    ],
                    [
                        '0000|0000 set     src,            2',
                        '0001|0000 add     src,            stack',
                        '0002|0001 mod     0,              1',
                        '0003|0002 set     src,            3',
                        '0004|0002 add     src,            stack',
                        '0005|0003 mod     0,              1',
                        '0006|0004 ret     0',
                        '0007|0005 set     [stack + 4],    26',
                        '0008|0006 set     [stack + 5],    78',
                        '0009|0006 call    0000,           2'
                    ],
                    [
                        9, 14,  0, 0, 10, 0, 0, 0, 0, 9, 9, 0, 0, 26, 78
                    ]
                );
                testLogs(
                    it,
                    'Should generate code for procedure with paramter and log - log',
                    [
                        'proc test(number p1, number p2)',
                        '    addr p1',
                        '    mod  0, 1',
                        '    addr p2',
                        '    mod  0, 1',
                        'end',
                        'proc main()',
                        '    test(26, 78)',
                        'end'
                    ],
                    [
                        26, 78
                    ]
                );
            }
        );
        describe(
            'Test expression',
            () => {
                testLogs(
                    it,
                    'Sould calculate expression with two proc calls - log',
                    [
                        'proc test1(number p)',
                        '    ret 7 * p',
                        'end',
                        'proc test2(number p)',
                        '    ret 2 + test1(p)',
                        'end',
                        'proc main()',
                        '    number n',
                        '    n = test2(3) + test1(2)',
                        '    addr n',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        37
                    ]
                );
                testLogs(
                    it,
                    'Sould calculate with return values and parameters - log',
                    [
                        'proc test1(number p)',
                        '    ret 2 * p',
                        'end',
                        'proc test2(number p1, number p2)',
                        '    ret p1 + test1(p2) + p2',
                        'end',
                        'proc main()',
                        '    number n',
                        '    n = test2(3, 5)',
                        '    addr n',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        18
                    ]
                );
            }
        );
        describe(
            'Test record parameter',
            () => {
                testLogs(
                    it,
                    'Sould call with record parameter',
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
                        'Point p',
                        'proc main()',
                        '    p.x = 6821',
                        '    p.y = 1567',
                        '    test(p)',
                        'end'
                    ],
                    [
                        6821, 1567
                    ]
                );
                testLogs(
                    it,
                    'Sould call with constant record parameter',
                    [
                        'record Point',
                        '    number x, y',
                        'end',
                        'proc test(Point p)',
                        '    addr p.y',
                        '    mod 0, 1',
                        '    addr p.x',
                        '    mod 0, 1',
                        'end',
                        'proc main()',
                        '    test({34, 834})',
                        'end'
                    ],
                    [
                        834, 34
                    ]
                );
                testLogs(
                    it,
                    'Sould call with constant nested record parameter',
                    [
                        'record Point',
                        '    number x, y',
                        'end',
                        'record Line',
                        '    Point p1, p2',
                        'end',
                        'proc test(Line l)',
                        '    addr l.p1.y',
                        '    mod 0, 1',
                        '    addr l.p1.x',
                        '    mod 0, 1',
                        '    addr l.p2.y',
                        '    mod 0, 1',
                        '    addr l.p2.x',
                        '    mod 0, 1',
                        'end',
                        'proc main()',
                        '    test({{47, 68}, {67, 56}})',
                        'end'
                    ],
                    [
                        68, 47, 56, 67
                    ]
                );
                testLogs(
                    it,
                    'Sould call with constant record and array field parameter',
                    [
                        'record Point',
                        '    number x, y',
                        'end',
                        'record Line',
                        '    Point p[2]',
                        'end',
                        'proc test(Line l)',
                        '    addr l.p[1].y',
                        '    mod 0, 1',
                        '    addr l.p[1].x',
                        '    mod 0, 1',
                        '    addr l.p[0].y',
                        '    mod 0, 1',
                        '    addr l.p[0].x',
                        '    mod 0, 1',
                        'end',
                        'proc main()',
                        '    test({[{58, 37}, {583, 67}]})',
                        'end'
                    ],
                    [
                        67, 583, 37, 58
                    ]
                );
            }
        );
        describe(
            'Test array parameter',
            () => {
                testLogs(
                    it,
                    'Sould call with array parameter',
                    [
                        'proc test(number n[3])',
                        '    number i',
                        '    for i = 0 to 2',
                        '        number j',
                        '        j = n[i]',
                        '        addr j',
                        '        mod 0, 1',
                        '    end',
                        'end',
                        'proc main()',
                        '    number a[3] = [4, 5, 6]',
                        '    test(a)',
                        'end'
                    ],
                    [
                        4, 5, 6
                    ]
                );
                testLogs(
                    it,
                    'Sould call with array index parameter value',
                    [
                        'proc test(number x)',
                        '    addr x',
                        '    mod 0, 1',
                        'end',
                        'proc main()',
                        '    number n[3] = [6, 7, 8]',
                        '    test(n[1])',
                        'end'
                    ],
                    [
                        7
                    ]
                );
                testLogs(
                    it,
                    'Sould call with record array index parameter value',
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
                        '    Point p[3]',
                        '    p[1].x = 15',
                        '    p[1].y = 78',
                        '    test(p[1])',
                        'end'
                    ],
                    [
                        15,
                        78
                    ]
                );
                testLogs(
                    it,
                    'Sould call with array of record constant parameter',
                    [
                        'record Point',
                        '    number x, y',
                        'end',
                        'proc test(Point p[2])',
                        '    addr p[1].y',
                        '    mod 0, 1',
                        '    addr p[1].x',
                        '    mod 0, 1',
                        '    addr p[0].y',
                        '    mod 0, 1',
                        '    addr p[0].x',
                        '    mod 0, 1',
                        'end',
                        'proc main()',
                        '    test([{79, 38}, {234, 877}])',
                        'end'
                    ],
                    [
                        877, 234, 38, 79
                    ]
                );
            }
        );
        describe(
            'Test call with string parameter',
            () => {
                testLogs(
                    it,
                    'Sould call with constant string parameter',
                    [
                        'proc test(string s)',
                        '    addr s',
                        '    mod  0, 2',
                        'end',
                        'proc main()',
                        '    test("Hello world")',
                        'end'
                    ],
                    [
                        'Hello world'
                    ]
                );
            }
        );
        describe(
            'Test call in declaration',
            () => {
                testLogs(
                    it,
                    'Sould declare and call for value',
                    [
                        'proc test()',
                        '    ret 87',
                        'end',
                        'proc main()',
                        '    number i = test()',
                        '    addr i',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        87
                    ]
                );
                testLogs(
                    it,
                    'Sould declare and call with parameter for value',
                    [
                        'proc test(number n)',
                        '    ret 10 + n',
                        'end',
                        'proc main()',
                        '    number i = test(5)',
                        '    addr i',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        15
                    ]
                );
                testLogs(
                    it,
                    'Sould declare and call with parameters for value',
                    [
                        'proc test(number i, number j)',
                        '    ret i + j',
                        'end',
                        'proc main()',
                        '    number i = test(5, 7)',
                        '    addr i',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        12
                    ]
                );
                testLogs(
                    it,
                    'Sould declare and call with parameters and proc expression for value',
                    [
                        'proc test1(number i)',
                        '    ret i * 2',
                        'end',
                        'proc test2(number i, number j)',
                        '    ret i + j',
                        'end',
                        'proc main()',
                        '    number i = test2(8, test1(4 * 2))',
                        '    addr i',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        24
                    ]
                );
                testLogs(
                    it,
                    'Sould declare and call with parameter with parenthesis',
                    [
                        'proc test(number i)',
                        '    ret i * 2',
                        'end',
                        'proc main()',
                        '    number i = test((2 + 3) * 4)',
                        '    addr i',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        40
                    ]
                );
            }
        );
        describe(
            'Test call with local number in proc',
            () => {
                testLogs(
                    it,
                    'Should call with local',
                    [
                        'proc test1(number n1, number n2)',
                        '    number x',
                        '    addr n1',
                        '    mod 0, 1',
                        '    addr n2',
                        '    mod 0, 1',
                        'end',
                        'proc test2(number n)',
                        '    test1(n, n + 1)',
                        'end',
                        'proc main()',
                        '    number n',
                        '    n = 10',
                        '    test2(n)',
                        'end'
                    ],
                    [
                        10, 11
                    ]
                );
                testLogs(
                    it,
                    'Should call without local',
                    [
                        'proc test1(number n1, number n2)',
                        '    addr n1',
                        '    mod 0, 1',
                        '    addr n2',
                        '    mod 0, 1',
                        'end',
                        'proc test2(number n)',
                        '    test1(n, n + 1)',
                        'end',
                        'proc main()',
                        '    number n',
                        '    n = 10',
                        '    test2(n)',
                        'end'
                    ],
                    [
                        10, 11
                    ]
                );
            }
        );
        describe(
            'Test call with math expression parameter',
            () => {
                testLogs(
                    it,
                    'Should call with first constant expression parameter',
                    [
                        'proc test(number n1, number n2)',
                        '    addr n1',
                        '    mod 0, 1',
                        '    addr n2',
                        '    mod 0, 1',
                        'end',
                        'proc main()',
                        '    number n',
                        '    n = 189',
                        '    test(2 * 3, n)',
                        'end'
                    ],
                    [
                        6, 189
                    ]
                );
                testLogs(
                    it,
                    'Should call with first expression parameter',
                    [
                        'proc test(number n1, number n2)',
                        '    addr n1',
                        '    mod 0, 1',
                        '    addr n2',
                        '    mod 0, 1',
                        'end',
                        'proc main()',
                        '    number n',
                        '    n = 0',
                        '    test(n + 1, n)',
                        'end'
                    ],
                    [
                        1, 0
                    ]
                );
                testLogs(
                    it,
                    'Should call with second expression parameter',
                    [
                        'proc test(number n1, number n2)',
                        '    addr n1',
                        '    mod 0, 1',
                        '    addr n2',
                        '    mod 0, 1',
                        'end',
                        'proc main()',
                        '    number n',
                        '    n = 0',
                        '    test(n, n + 1)',
                        'end'
                    ],
                    [
                        0, 1
                    ]
                );
                testLogs(
                    it,
                    'Should call with two expression parameters',
                    [
                        'proc test(number n1, number n2)',
                        '    addr n1',
                        '    mod 0, 1',
                        '    addr n2',
                        '    mod 0, 1',
                        'end',
                        'proc main()',
                        '    number n',
                        '    n = 1',
                        '    test(n + 2, n + 3)',
                        'end'
                    ],
                    [
                        3, 4
                    ]
                );

                testLogs(
                    it,
                    'Should call string array parameter',
                    [
                        'string s[2] = ["a", "b"]',
                        'proc test(string s)',
                        '    addr s',
                        '    mod 0, 2',
                        'end',
                        'proc main()',
                        '    number i, j',
                        '    i = 0',
                        '    j = 0',
                        '    test(s[i * 2 + j])',
                        'end'
                    ],
                    [
                        'a'
                    ]
                );
            }
        );
    }
);
