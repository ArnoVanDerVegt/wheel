var assert = require('assert');

var wheel             = require('../public/js/utils/base.js').wheel;
var compilerTestUtils = require('./compilerTestUtils.js');

describe(
    'Test number',
    function() {
        describe(
            'Declare global and local number variables',
            function () {
                it('Should compile a number', function() {
                    var testData = compilerTestUtils.setup();
                    var compiler = testData.compiler;
                    var includes = compilerTestUtils.createIncludes([
                            'number a',
                            'proc main()',
                            'endp'
                        ]);

                    assert.doesNotThrow(
                        function() {
                            compiler.compile(includes);
                        },
                        Error
                    );
                });
                it('Global offset should be 7 (registers+1)', function() {
                    var testData = compilerTestUtils.setup();
                    var compiler = testData.compiler;
                    var includes = compilerTestUtils.createIncludes([
                            'number a',
                            'proc main()',
                            'endp'
                        ]);

                    compiler.compile(includes);
                    assert.equal(compiler.getCompilerData().getGlobalOffset(), 7);
                });
                it('Global offset should be 8 (registers+2)', function() {
                    var testData = compilerTestUtils.setup();
                    var compiler = testData.compiler;
                    var vm       = testData.vm;
                    var includes = compilerTestUtils.createIncludes([
                            'number a',
                            'number b',
                            'proc main()',
                            'endp'
                        ]);

                    var outputCommands = compiler.compile(includes);
                    var compilerData   = compiler.getCompilerData();
                    assert.equal(compilerData.getGlobalOffset(), 8);
                });
                it('Should set memory', function() {
                    var testData = compilerTestUtils.setup();
                    var compiler = testData.compiler;
                    var vm       = testData.vm;
                    var includes = compilerTestUtils.createIncludes([
                            'number a',
                            'proc main()',
                            '    set a, 1',
                            'endp'
                        ]);

                    var outputCommands = compiler.compile(includes);
                    var compilerData   = compiler.getCompilerData();
                    var vmData         = vm.getVMData();

                    vm.runAll(
                        outputCommands,
                        compilerData.getStringList(),
                        compilerData.getGlobalConstants(),
                        compilerData.getGlobalOffset(),
                        null
                    );
                });
                it('Should set memory values', function() {
                    var testData = compilerTestUtils.compileAndRun([
                            'number a',
                            'proc main()',
                            '    set a, 71',
                            '    number b',
                            '    set b, 2',
                            'endp'
                        ]).testData;

                    /**
                     * offset | value | description
                     * -------+-------+------------------------------
                     *      0 |     7 | REG_OFFSET_STACK
                     *      1 |     0 | REG_OFFSET_SRC
                     *      2 | 65535 | REG_OFFSET_DEST
                     *      3 |     4 | REG_OFFSET_CODE
                     *      4 |     0 | REG_RETURN
                     *      5 |     0 | REG_FLAGS
                     *      6 |    71 | number a - start of globals
                     *      7 |     7 | number b - local
                     *      8 | 65535 | return execution offset
                     *      9 |     2 | return stack pointer
                    **/
                    assert.deepStrictEqual(
                        testData.vm.getVMData().getData(),
                        [7, 0, 65535, 4, 0, 0, 71, 7, 65535, 2]
                    );
                });
                it('Should set memory', function() {
                    var testData = compilerTestUtils.compileAndRun([
                            'number a',
                            'proc main()',
                            '    set a, 71',
                            '    number b',
                            '    set b, 2',
                            'endp'
                        ]).testData;

                    /**
                     * offset | value | description
                     * -------+-------+------------------------------
                     *      0 |     7 | REG_OFFSET_STACK
                     *      1 |     0 | REG_OFFSET_SRC
                     *      2 | 65535 | REG_OFFSET_DEST
                     *      3 |     4 | REG_OFFSET_CODE
                     *      4 |     0 | REG_RETURN
                     *      5 |     0 | REG_FLAGS
                     *      6 |    71 | number a - start of globals
                     *      7 |     7 | number b - local
                     *      8 | 65535 | return execution offset
                     *      9 |     2 | return stack pointer
                    **/
                    assert.deepStrictEqual(
                        testData.vm.getVMData().getData(),
                        [7, 0, 65535, 4, 0, 0, 71, 7, 65535, 2]
                    );
                });
            }
        );
    }
);