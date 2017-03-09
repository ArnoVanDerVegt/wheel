var assert = require('assert');

var wheel             = require('../utils/base.js').wheel;
var compilerTestUtils = require('./compilerTestUtils.js');

describe(
    'Test string',
    function() {
        describe(
            'Declarations',
            function () {
                it('Should declare a global string', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'string s = "Hello world"',
                            '',
                            'proc main()',
                            '    printS(s)',
                            'endp'
                        ])).testData;

                    assert.deepStrictEqual(testData.messages, ['Hello world']);
                });

                it('Should declare a global string array', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'string s[2] = ["Hello", "world"]',
                            '',
                            'proc main()',
                            '    string l',
                            '    arrayr l, s, 1',
                            '    printS(l)',
                            '    arrayr l, s, 0',
                            '    printS(l)',
                            'endp'
                        ])).testData;

                    assert.deepStrictEqual(testData.messages, ['world', 'Hello']);
                });

                it('Should declare a local string', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'proc main()',
                            '    string s = "Local string"',
                            '    printS(s)',
                            'endp'
                        ])).testData;

                    assert.deepStrictEqual(testData.messages, ['Local string']);
                });

                it('Should declare a local string array', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'proc main()',
                            '    string la[2] = ["Local", "array"]',
                            '    string l',
                            '    arrayr l, la, 1',
                            '    printS(l)',
                            '    arrayr l, la, 0',
                            '    printS(l)',
                            'endp'
                        ])).testData;

                    assert.deepStrictEqual(testData.messages, ['array', 'Local']);
                });
            }
        );
    }
);

