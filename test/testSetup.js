var assert = require('assert');

var wheel             = require('../public/js/utils/base.js').wheel;
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
            }
        );

        describe(
            'Main proc',
            function () {
                it('Should not throw anything', function() {
                    var testData = compilerTestUtils.setup();
                    var includes = compilerTestUtils.createIncludes([
                            'proc main()',
                            'endp'
                        ]);

                    testData.compiler.compile(includes);
                });
            }
        );
    }
);