var assert = require('assert');

var wheel             = require('../utils/base.js').wheel;
var compilerTestUtils = require('./compilerTestUtils.js');

describe(
    'Setup',
    function() {
        describe(
            'No main proc',
            function () {
                it('Should throw no main', function() {
                    var testData = compilerTestUtils.setup();
                    var includes = compilerTestUtils.createIncludes([
                            'number a'
                        ]);

                    assert.throws(
                        function() {
                            testData.compiler.compile(includes);
                        },
                        Error
                    );
                });

                it('Should not throw anything', function() {
                    var testData = compilerTestUtils.setup();
                    var includes = compilerTestUtils.createIncludes([
                            'proc main()',
                            'endp'
                        ]);

                    assert.doesNotThrow(
                        function() {
                            var compiler = testData.compiler;
                            compiler.compile(includes);
                        },
                        Error
                    );
                });
            }
        );
    }
);