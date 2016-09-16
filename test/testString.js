var assert = require('assert');

var wheel             = require('../public/js/utils/base.js').wheel;
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
            }
        );
    }
);

