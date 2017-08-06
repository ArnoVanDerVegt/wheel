var assert            = require('assert');
var wheel             = require('../js/utils/base.js').wheel;
var compilerTestUtils = require('./compilerTestUtils.js');

describe(
    'Test optimizer',
    function() {
        describe(
            'Test set',
            function() {
                it('Should remove add, set', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'proc main()',
                            '    number n',
                            '',
                            '    n = 77',
                            '    n += 78',
                            '    n += 79',
                            '',
                            '    printN(n)',
                            'endp'
                        ])).testData;

                    assert.deepEqual(testData.messages, [234]);
                });
            }
        );

        describe(
            'Test mul',
            function() {
                it('Should remove mul', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'proc main()',
                            '    number n',
                            '',
                            '    n = 77',
                            '    n *= 2',
                            '    n *= 3',
                            '',
                            '    printN(n)',
                            'endp'
                        ])).testData;

                    assert.deepEqual(testData.messages, [462]);
                });
            }
        );
    }
);