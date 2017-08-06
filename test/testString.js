var assert            = require('assert');
var wheel             = require('../js/utils/base.js').wheel;
var compilerTestUtils = require('./compilerTestUtils.js');

describe(
    'Test string',
    function() {
        describe(
            'Declarations',
            function() {
                it('Should declare a global string', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'string s = "Hello world"',
                            '',
                            'proc main()',
                            '    printS(s)',
                            'endp'
                        ])).testData;

                    assert.deepEqual(testData.messages, ['Hello world']);
                });

                it('Should declare a global string array', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'string s[2] = ["Hello", "world"]',
                            '',
                            'proc main()',
                            '    string l',
                            '    l = s[1]',
                            '    printS(l)',
                            '    l = s[0]',
                            '    printS(l)',
                            'endp'
                        ])).testData;

                    assert.deepEqual(testData.messages, ['world', 'Hello']);
                });

                it('Should declare a local string', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'proc main()',
                            '    string s = "Local string"',
                            '    printS(s)',
                            'endp'
                        ])).testData;

                    assert.deepEqual(testData.messages, ['Local string']);
                });

                it('Should declare a local string array', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'proc main()',
                            '    string la[2] = ["Local", "array"]',
                            '    string l',
                            '    l = la[1]',
                            '    printS(l)',
                            '    l = la[0]',
                            '    printS(l)',
                            'endp'
                        ])).testData;

                    assert.deepEqual(testData.messages, ['array', 'Local']);
                });
            }
        );

        describe(
            'Set global string',
            function() {
                it('Should set a global string', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'string s',
                            '',
                            'proc main()',
                            '    s = "Hello world!!"',
                            '    printS(s)',
                            'endp'
                        ])).testData;

                    assert.deepEqual(testData.messages, ['Hello world!!']);
                });
                it('Should set a global string, use constant once', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'string s1',
                            'string s2',
                            '',
                            'proc main()',
                            '    s1 = "Same"',
                            '    s2 = "Same"',
                            '    printS(s1)',
                            '    printS(s2)',
                            'endp'
                        ]));

                    assert.deepEqual(testData.testData.messages, ['Same', 'Same']);
                    assert.deepEqual(testData.compilerData.getStringList(), ['Same']);
                });
            }
        );
    }
);

