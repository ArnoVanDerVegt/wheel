var assert            = require('assert');
var wheel             = require('../js/utils/base.js').wheel;
var compilerTestUtils = require('./compilerTestUtils.js');

describe(
    'Directive',
    function() {
        it('Should set ret directive off', function() {
            var testData = compilerTestUtils.compileAndRun(
                    [
                        '#directive ret=off',
                        'proc main()',
                        'endp'
                    ],
                    true
                ).testData;

            assert.strictEqual(testData.compiler.getDirective().getRet(), false);
        });

        it('Should set ret directive on', function() {
            var testData = compilerTestUtils.compileAndRun(
                    [
                        '#directive ret=on',
                        'proc main()',
                        'endp'
                    ],
                    false
                ).testData;

            assert.strictEqual(testData.compiler.getDirective().getRet(), true);
        });

        it('Should set call directive off', function() {
            var testData = compilerTestUtils.compileAndRun(
                    [
                        '#directive call=off',
                        'proc main()',
                        'endp'
                    ],
                    true,
                    true
                ).testData;

            assert.strictEqual(testData.compiler.getDirective().getCall(), false);
        });

        it('Should set call directive on', function() {
            var testData = compilerTestUtils.compileAndRun(
                    [
                        '#directive call=on',
                        'proc main()',
                        'endp'
                    ],
                    true,
                    false
                ).testData;

            assert.strictEqual(testData.compiler.getDirective().getCall(), true);
        });

        it('Should set optimize directive off', function() {
            var testData = compilerTestUtils.compileAndRun(
                    [
                        '#directive optimize=off',
                        'proc main()',
                        'endp'
                    ],
                    true,
                    true,
                    true
                ).testData;

            assert.strictEqual(testData.compiler.getDirective().getOptimize(), false);
        });

        it('Should set optimize directive on', function() {
            var testData = compilerTestUtils.compileAndRun(
                    [
                        '#directive optimize=on',
                        'proc main()',
                        'endp'
                    ],
                    true,
                    true,
                    false
                ).testData;

            assert.strictEqual(testData.compiler.getDirective().getOptimize(), true);
        });
    }
);
