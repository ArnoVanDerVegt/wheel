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
    'Test String module',
    function() {
        testLogs(
            it,
            'Should convert a number to a string',
            [
                'proc numberToString(number n, string ps)',
                '    record NumberToString',
                '        number n',
                '        string fs',
                '    end',
                '    NumberToString numberToString',
                '    numberToString.n = n',
                '    numberToString.fs = ps',
                '    addr numberToString',
                '    mod  10, 3',
                'end',
                'proc main()',
                '    string s',
                '    numberToString(39, s)',
                '    addr s',
                '    mod  0, 2',
                'end'
            ],
            [
                39
            ]
        );
        testLogs(
            it,
            'Should convert a string to a number',
            [
                'proc stringToNumber(string s)',
                '    record StringToNumber',
                '        string s',
                '        number n',
                '    end',
                '    StringToNumber stringToNumber',
                '    stringToNumber.s = s',
                '    addr stringToNumber',
                '    mod  10, 4',
                '    ret  stringToNumber.n',
                'end',
                'proc main()',
                '    string s = "148"',
                '    number n',
                '    n = stringToNumber(s)',
                '    addr n',
                '    mod  0, 1',
                'end'
            ],
            [
                148
            ]
        );
        testLogs(
            it,
            'Should get the indexOf at start',
            [
                'proc indexOf(string s1, string s2, number startIndex)',
                '    addr s1',
                '    mod  10, 5',
                'end',
                'proc main()',
                '    string s1 = "Hello string index!"',
                '    string s2 = "Hello"',
                '    number i = indexOf(s1, s2, 0)',
                '    addr i',
                '    mod  0, 1',
                'end'
            ],
            [
                0
            ]
        );
        testLogs(
            it,
            'Should get the indexOf at middle',
            [
                'proc indexOf(string s1, string s2, number startIndex)',
                '    addr s1',
                '    mod  10, 5',
                'end',
                'proc main()',
                '    string s1 = "Hello string index!"',
                '    string s2 = "string"',
                '    number i = indexOf(s1, s2, 0)',
                '    addr i',
                '    mod  0, 1',
                'end'
            ],
            [
                6
            ]
        );
        testLogs(
            it,
            'Should get the indexOf not found',
            [
                'proc indexOf(string s1, string s2, number startIndex)',
                '    addr s1',
                '    mod  10, 5',
                'end',
                'proc main()',
                '    string s1 = "Hello string index!"',
                '    string s2 = "not found"',
                '    number i = indexOf(s1, s2, 0)',
                '    addr i',
                '    mod  0, 1',
                'end'
            ],
            [
                -1
            ]
        );
        testLogs(
            it,
            'Should get the indexOf not found, startIndex after needle',
            [
                'proc indexOf(string s1, string s2, number startIndex)',
                '    addr s1',
                '    mod  10, 5',
                'end',
                'proc main()',
                '    string s1 = "Hello string index!"',
                '    string s2 = "Hello"',
                '    number i = indexOf(s1, s2, 1)',
                '    addr i',
                '    mod  0, 1',
                'end'
            ],
            [
                -1
            ]
        );
        testLogs(
            it,
            'Should get the indexOf find, startIndex after needle',
            [
                'proc indexOf(string s1, string s2, number startIndex)',
                '    addr s1',
                '    mod  10, 5',
                'end',
                'proc main()',
                '    string s1 = "Hello string index!"',
                '    string s2 = "string"',
                '    number i = indexOf(s1, s2, 6)',
                '    addr i',
                '    mod  0, 1',
                'end'
            ],
            [
                6
            ]
        );
        testLogs(
            it,
            'Should get the sub string',
            [
                'proc main()',
                '    string s = "Hello sub string"',
                '    string result = ""',
                '    record SubString',
                '        string s',
                '        number start',
                '        number length',
                '        string result',
                '    end',
                '    SubString subString',
                '    subString.s = s',
                '    subString.start = 6',
                '    subString.length = 3',
                '    subString.result = result',
                '    addr subString',
                '    mod  10, 6',
                '    addr subString.result',
                '    mod  0, 2',
                'end'
            ],
            [
                'sub'
            ]
        );
        testLogs(
            it,
            'Should get the string length',
            [
                'proc length(string s)',
                '    addr s',
                '    mod  10, 7',
                'end',
                'proc main()',
                '    string s = "Hello string length!"',
                '    number n = length(s)',
                '    addr n',
                '    mod  0, 1',
                'end'
            ],
            [
                20
            ]
        );
        testLogs(
            it,
            'Should check if strings are equal',
            [
                'proc equal(string s1, string s2)',
                '    addr s1',
                '    mod  10, 8',
                'end',
                'proc main()',
                '    string s1 = "Hello"',
                '    string s2 = "Hello"',
                '    number n = equal(s1, s2)',
                '    addr n',
                '    mod  0, 1',
                '    s2 = "Hello!"',
                '    n = equal(s1, s2)',
                '    addr n',
                '    mod  0, 1',
                'end'
            ],
            [
                1,
                0
            ]
        );
        testLogs(
            it,
            'Should uppercase string',
            [
                'proc main()',
                '    string s1 = "Hello world"',
                '    addr s1',
                '    mod  10, 9',
                '    addr s1',
                '    mod  0, 2',
                'end'
            ],
            [
                'HELLO WORLD'
            ]
        );
        testLogs(
            it,
            'Should lowercase string',
            [
                'proc main()',
                '    string s1 = "HELLO WORLD"',
                '    addr s1',
                '    mod  10, 10',
                '    addr s1',
                '    mod  0, 2',
                'end'
            ],
            [
                'hello world'
            ]
        );
        testLogs(
            it,
            'Should get char code at',
            [
                'proc charCodeAt(string s, number index)',
                '    addr s',
                '    mod  10, 11',
                'end',
                'proc main()',
                '    string s = "ABCD"',
                '    number i, j',
                '    for i = 0 to 3',
                '        j = charCodeAt(s, i)',
                '        addr j',
                '        mod  0, 1',
                '    end',
                'end'
            ],
            [
                65, 66, 67, 68
            ]
        );
        testLogs(
            it,
            'Should set char code at',
            [
                'proc charCodeAt(string s, number index, number charCode)',
                '    addr s',
                '    mod  10, 12',
                'end',
                'proc main()',
                '    string s = "ABCD"',
                '    number i, j',
                '    for i = 0 to 3',
                '        j = charCodeAt(s, i, 66 + i)',
                '    end',
                '    addr s',
                '    mod  0, 2',
                'end'
            ],
            [
                'BCDE'
            ]
        );
    }
);
