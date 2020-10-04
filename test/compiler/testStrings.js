/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const assert   = require('assert');
const testLogs = require('../utils').testLogs;

describe(
    'Test Strings',
    () => {
        describe(
            'Test Log',
            () => {
                testLogs(
                    it,
                    'Should declare a global string with initial value',
                    [
                        'string s = "Jumped over the lazy dog"',
                        'proc main()',
                        '    addr s',
                        '    mod  0, 2',
                        'end'
                    ],
                    [
                        'Jumped over the lazy dog'
                    ]
                );
                testLogs(
                    it,
                    'Should allocate and log local string',
                    [
                        'proc test()',
                        '    string s',
                        '    s = "Hello world"',
                        '    addr s',
                        '    mod  0, 2',
                        'end',
                        'proc main()',
                        '    test()',
                        'end'
                    ],
                    [
                        'Hello world'
                    ]
                );
                testLogs(
                    it,
                    'Should allocate and log local string, free the local string',
                    [
                        'proc test1()',
                        '    string s',
                        '    s = "Hello world1"',
                        '    addr s',
                        '    mod  0, 2',
                        'end',
                        'proc test2()',
                        '    string s',
                        '    s = "Hello world2"',
                        '    addr s',
                        '    mod  0, 2',
                        'end',
                        'proc main()',
                        '    test1()',
                        '    test2()',
                        'end'
                    ],
                    [
                        'Hello world1',
                        'Hello world2'
                    ]
                );
                testLogs(
                    it,
                    'Should allocate and log two local strings',
                    [
                        'proc test()',
                        '    string s1, s2',
                        '    s1 = "Hello world"',
                        '    addr s1',
                        '    mod  0, 2',
                        'end',
                        'proc main()',
                        '    test()',
                        'end'
                    ],
                    [
                        'Hello world'
                    ]
                );
                testLogs(
                    it,
                    'Should allocate and log a string in a record',
                    [
                        'record Rec',
                        '    number i',
                        '    string s',
                        'end',
                        'proc test()',
                        '    Rec r',
                        '    r.s = "Hello world"',
                        '    addr r.s',
                        '    mod  0, 2',
                        'end',
                        'proc main()',
                        '    test()',
                        'end'
                    ],
                    [
                        'Hello world'
                    ]
                );
                testLogs(
                    it,
                    'Should allocate and log a two string in a nested record',
                    [
                        'record Rec1',
                        '    number i',
                        '    string s',
                        'end',
                        'record Rec2',
                        '    number i',
                        '    string s',
                        '    Rec1   r',
                        'end',
                        'proc test()',
                        '    Rec2 r',
                        '    r.s = "Hello"',
                        '    r.r.s = "world"',
                        '    addr r.s',
                        '    mod  0, 2',
                        '    addr r.r.s',
                        '    mod  0, 2',
                        'end',
                        'proc main()',
                        '    test()',
                        'end'
                    ],
                    [
                        'Hello',
                        'world'
                    ]
                );
                testLogs(
                    it,
                    'Should add two strings',
                    [
                        'proc main()',
                        '    string s1, s2',
                        '    s1 = "Hello"',
                        '    s2 = " world"',
                        '    s1 = s1 + s2',
                        '    addr s1',
                        '    mod  0, 2',
                        'end'
                    ],
                    [
                        'Hello world'
                    ]
                );
                testLogs(
                    it,
                    'Should add two strings',
                    [
                        'proc main()',
                        '    string s1, s2',
                        '    s1 = "Hello"',
                        '    s2 = " world"',
                        '    s1 += s2',
                        '    addr s1',
                        '    mod  0, 2',
                        'end'
                    ],
                    [
                        'Hello world'
                    ]
                );
                testLogs(
                    it,
                    'Should add three strings',
                    [
                        'proc main()',
                        '    string s1, s2, s3',
                        '    s1 = "Hello"',
                        '    s2 = " world"',
                        '    s3 = "!"',
                        '    s1 = s1 + s2 + s3',
                        '    addr s1',
                        '    mod  0, 2',
                        'end'
                    ],
                    [
                        'Hello world!'
                    ]
                );
                testLogs(
                    it,
                    'Should add three strings',
                    [
                        'proc main()',
                        '    string s1, s2, s3',
                        '    s1 = "Hello"',
                        '    s2 = " world"',
                        '    s3 = "!"',
                        '    s1 += s2 + s3',
                        '    addr s1',
                        '    mod  0, 2',
                        'end'
                    ],
                    [
                        'Hello world!'
                    ]
                );
                testLogs(
                    it,
                    'Should declare a string with initial value',
                    [
                        'proc main()',
                        '    string s = "The quick brown fox"',
                        '    addr s',
                        '    mod  0, 2',
                        'end'
                    ],
                    [
                        'The quick brown fox'
                    ]
                );
                testLogs(
                    it,
                    'Should use a string parameter',
                    [
                        'proc test(string s)',
                        '    addr s',
                        '    mod  0, 2',
                        'end',
                        'proc main()',
                        '    string s',
                        '    s = "Hello param"',
                        '    test(s)',
                        'end'
                    ],
                    [
                        'Hello param'
                    ]
                );
            }
        );
        describe(
            'Test Array',
            () => {
                testLogs(
                    it,
                    'Should output a string array',
                    [
                        'string s[8] = ["none", "black", "blue", "green", "yellow", "red", "white", "brown"]',
                        'proc main()',
                        '    string d',
                        '    number i',
                        '    for i = 0 to 7',
                        '        d = s[i]',
                        '        addr d',
                        '        mod  0, 2',
                        '    end',
                        'end'
                    ],
                    [
                        'none', 'black', 'blue', 'green', 'yellow', 'red', 'white', 'brown'
                    ]
                );
                testLogs(
                    it,
                    'Should output a string array - multiline declaration',
                    [
                        'string s[8] = [',
                        '    "none",',
                        '    "black",',
                        '    "blue",',
                        '    "green",',
                        '    "yellow",',
                        '    "red",',
                        '    "white",',
                        '    "brown"',
                        ']',
                        'proc main()',
                        '    string d',
                        '    number i',
                        '    for i = 0 to 7',
                        '        d = s[i]',
                        '        addr d',
                        '        mod  0, 2',
                        '    end',
                        'end'
                    ],
                    [
                        'none', 'black', 'blue', 'green', 'yellow', 'red', 'white', 'brown'
                    ]
                );
                testLogs(
                    it,
                    'Should output a string array with parameter',
                    [
                        'string s[8] = ["none", "black", "blue", "green", "yellow", "red", "white", "brown"]',
                        'proc printStr(string s)',
                        '    addr s',
                        '    mod  0, 2',
                        'end',
                        'proc main()',
                        '    number i',
                        '    for i = 0 to 7',
                        '        printStr(s[i])',
                        '    end',
                        'end'
                    ],
                    [
                        'none', 'black', 'blue', 'green', 'yellow', 'red', 'white', 'brown'
                    ]
                );
                testLogs(
                    it,
                    'Should output a local string array',
                    [
                        'proc main()',
                        '    string s[8] = ["none", "black", "blue", "green", "yellow", "red", "white", "brown"]',
                        '    string d',
                        '    number i',
                        '    for i = 0 to 7',
                        '        d = s[i]',
                        '        addr d',
                        '        mod  0, 2',
                        '    end',
                        'end'
                    ],
                    [
                        'none', 'black', 'blue', 'green', 'yellow', 'red', 'white', 'brown'
                    ]
                );
                testLogs(
                    it,
                    'Should output a local string array with parameter',
                    [
                        'proc printStr(string s)',
                        '    addr s',
                        '    mod  0, 2',
                        'end',
                        'proc main()',
                        '    string s[8] = ["none", "black", "blue", "green", "yellow", "red", "white", "brown"]',
                        '    string d',
                        '    number i',
                        '    for i = 0 to 7',
                        '        printStr(s[i])',
                        '    end',
                        'end'
                    ],
                    [
                        'none', 'black', 'blue', 'green', 'yellow', 'red', 'white', 'brown'
                    ]
                );
            }
        );
    }
);
