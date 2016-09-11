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

                it('Should set global memory', function() {
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

                it('Should set memory global and local', function() {
                    var testData = compilerTestUtils.compileAndRun([
                            'number a',
                            'proc main()',
                            '    set a, 71',
                            '    number b',
                            '    set b, 2',
                            'endp'
                        ]).testData;

                    assert.deepStrictEqual(
                        testData.vm.getVMData().getData(),
                        [
                            7,      // REG_OFFSET_STACK
                            0,      // REG_OFFSET_SRC
                            65535,  // REG_OFFSET_DEST
                            4,      // REG_OFFSET_CODE
                            0,      // REG_RETURN
                            0,      // REG_FLAGS
                            71,     // number a - start of globals
                            7,      // stack pointer
                            65535,  // return code offset
                            2       // number b - local
                        ]
                    );
                });
            }
        );

        describe(
            'Pointers to numbers',
            function () {
                it('Should set a pointer number', function() {
                    var n = 10 + ~~(Math.random() * 100);
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'proc main()',
                                'number n',
                                'number *pn',
                                '',
                                'set pn, &n',
                                'set *pn, ' + n,
                                '',
                                'printN(n)',
                            'endp'
                        ])).testData;

                    assert.deepStrictEqual(testData.messages, [n]);
                });
            }
        );
    }
);