var assert = require('assert');

var wheel             = require('../js/utils/base.js').wheel;
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

                    vm.runAll(
                        outputCommands,
                        compilerData.getStringList(),
                        compilerData.getGlobalConstants(),
                        compilerData.getGlobalOffset()
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

                    assert.deepEqual(
                        testData.vm.getVMData().getData(),
                        [
                            7,      // REG_OFFSET_STACK
                            0,      // REG_OFFSET_SRC
                            65535,  // REG_OFFSET_DEST
                            65536,  // REG_OFFSET_CODE
                            0,      // REG_RETURN
                            0,      // REG_FLAGS
                            71,     // number a - start of globals
                            7,      // stack pointer
                            65535,  // return code offset
                            2       // number b - local
                        ]
                    );
                });

                it('Should mod a number', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'number n',
                            '',
                            'proc main()',
                            '    set n, 10',
                            '    mod n, 7, ',
                            '    printN(n)',
                            'endp'
                        ])).testData;

                    assert.deepEqual(testData.messages, [3]);
                });
            }
        );

        describe(
            'Declarations',
            function () {
                it('Should declare a global constant number', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'number n = 2347',
                            '',
                            'proc main()',
                            '    printN(n)',
                            'endp'
                        ])).testData;

                    assert.deepEqual(testData.messages, [2347]);
                });

                it('Should declare a global contant number array', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'number a[2] = [356, 257]',
                            '',
                            'proc main()',
                            '    number l',
                            '    arrayr l, a, 1',
                            '    printN(l)',
                            '    arrayr l, a, 0',
                            '    printN(l)',
                            'endp'
                        ])).testData;

                    assert.deepEqual(testData.messages, [257, 356]);
                });

                it('Should declare a local number contant', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'proc main()',
                            '    number n = 244',
                            '    printN(n)',
                            'endp'
                        ])).testData;

                    assert.deepEqual(testData.messages, [244]);
                });

                it('Should declare a local number array', function() {
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'proc main()',
                            '    number la[2] = [6576, 6576]',
                            '    number l',
                            '    arrayr l, la, 1',
                            '    printN(l)',
                            '    arrayr l, la, 0',
                            '    printN(l)',
                            'endp'
                        ])).testData;

                    assert.deepEqual(testData.messages, [6576, 6576]);
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

                    assert.deepEqual(testData.messages, [n]);
                });
                it('Should mul a pointer number', function() {
                    var n = 10 + ~~(Math.random() * 100);
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'proc main()',
                                'number n',
                                'number *pn',
                                '',
                                'set n, 11',
                                'set pn, &n',
                                'mul *pn, ' + n,
                                '',
                                'printN(n)',
                            'endp'
                        ])).testData;

                    assert.deepEqual(testData.messages, [n * 11]);
                });
                it('Should mul a pointer number', function() {
                    var n = 10 + ~~(Math.random() * 100);
                    var testData = compilerTestUtils.compileAndRun(compilerTestUtils.standardLines.concat([
                            'proc main()',
                                'number n',
                                'number *pn',
                                '',
                                'set n, 13',
                                'set pn, &n',
                                'mul n, *pn',
                                '',
                                'printN(n)',
                            'endp'
                        ])).testData;

                    assert.deepEqual(testData.messages, [13 * 13]);
                });
            }
        );
    }
);