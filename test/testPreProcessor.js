var assert = require('assert');

var wheel             = require('../utils/base.js').wheel;
var compilerTestUtils = require('./compilerTestUtils.js');

function createFiles(content1, content2, content3, content4) {

    function createFile(lines) {
        return {
            getData: function(callback) {
                var data = lines.join('\n');
                callback && callback(data);
                return data;
            },
            getMeta: function() {
                return {};
            }
        };
    }

    return {
        _list: [0, 1, 2],
        _files: {
            'main.whl':       0,
            'include.whl':    1,
            'test/test1.whl': 2,
            'test/test2.whl': 3
        },
        exists: function(path, filename) {
            var files = this._files;
            if (filename in files) {
                return files[filename];
            }
            var f = path + filename;
            if (f in files) {
                return files[f];
            }
            return false;
        },
        getFile: function(index) {
            switch (index) {
                case 0: return createFile(content1);
                case 1: return createFile(content2);
                case 2: return createFile(content3);
                case 3: return createFile(content4);
            }
        }
    };
}

describe(
    'PreProcessor',
    function() {
        it('Should create basic program', function() {
            var files = createFiles(
                    [
                        'proc main()',
                        'endp'
                    ],
                    [
                        'proc incld()',
                        'endp'
                    ]
                );
            var compiler     = new wheel.compiler.Compiler({});
            var preProcessor = new wheel.compiler.PreProcessor({files: files});

            preProcessor.process(
                '',
                'main.whl',
                function(includes) {
                    var outputCommands = compiler.compile(includes);

                    assert.deepEqual(
                        outputCommands.outputCommands().split('\r'),
                        [
                            '#STRINGS',
                            '0',
                            '',
                            '#HEAP_SIZE',
                            '1024',
                            '#REG_CODE',
                            '0',
                            '#REG_STACK',
                            '6',
                            '#COMMANDS_SIZE',
                            '15',
                            '#COMMANDS',
                            '4', '1', '2', '2', '1',
                            '4', '1', '0', '2', '0',
                            '4', '1', '3', '1', '2',
                            ''
                        ]
                    );
                }
            );
        });

        it('Should create basic program with include file', function() {
            var files = createFiles(
                    [
                        '#include "include.whl"',
                        '',
                        'proc main()',
                        'endp'
                    ],
                    [
                        'proc incld()',
                        'endp'
                    ]
                );
            var compiler     = new wheel.compiler.Compiler({});
            var preProcessor = new wheel.compiler.PreProcessor({files: files});

            preProcessor.process(
                '',
                'main.whl',
                function(includes) {
                    var outputCommands = compiler.compile(includes);

                    assert.deepEqual(
                        outputCommands.outputCommands().split('\r'),
                        [
                            '#STRINGS',
                            '0',
                            '',
                            '#HEAP_SIZE',
                            '1024',
                            '#REG_CODE',
                            '3',
                            '#REG_STACK',
                            '6',
                            '#COMMANDS_SIZE',
                            '30',
                            '#COMMANDS',
                            '4', '1', '2', '2', '1',
                            '4', '1', '0', '2', '0',
                            '4', '1', '3', '1', '2',
                            '4', '1', '2', '2', '1',
                            '4', '1', '0', '2', '0',
                            '4', '1', '3', '1', '2',
                            ''
                        ]
                    );
                }
            );
        });

        it('Should add ends', function() {
            var files = createFiles(
                    [
                        'struct S',
                        '    number n',
                        'end',
                        '',
                        'proc main()',
                        'endp'
                    ]
                );
            var compiler     = new wheel.compiler.Compiler({});
            var preProcessor = new wheel.compiler.PreProcessor({files: files});

            preProcessor.process(
                '',
                'main.whl',
                function(includes) {
                    var outputCommands = compiler.compile(includes);

                    assert.deepEqual(
                        outputCommands.outputCommands().split('\r'),
                            [
                            '#STRINGS',
                            '0',
                            '',
                            '#HEAP_SIZE',
                            '1024',
                            '#REG_CODE',
                            '0',
                            '#REG_STACK',
                            '6',
                            '#COMMANDS_SIZE',
                            '15',
                            '#COMMANDS',
                            '4', '1', '2', '2', '1',
                            '4', '1', '0', '2', '0',
                            '4', '1', '3', '1', '2',
                            ''
                        ]
                    );
                }
            );
        });

        it('Should create a file with test function', function() {
            var files = createFiles(
                    [
                        'proc printN(number n)',
                        '    struct PrintNumber',
                        '        number n',
                        '    ends',
                        '    PrintNumber printNumber',
                        '    set      printNumber.n,n',
                        '    addr     printNumber',
                        '    module   0,0',
                        'endp',
                        'proc main()',
                        '    printN(163)',
                        'endp'
                    ]
                );
            var testData = compilerTestUtils.setup();
            var preProcessor = new wheel.compiler.PreProcessor({files: files});

            preProcessor.process(
                '',
                'main.whl',
                function(includes) {
                    var outputCommands = testData.compiler.compile(includes);
                    var compilerData   = testData.compiler.getCompilerData();
                    var vmData         = testData.vm.getVMData();

                    testData.vm.runAll(
                        outputCommands,
                        compilerData.getStringList(),
                        compilerData.getGlobalConstants(),
                        compilerData.getGlobalOffset()
                    );

                    assert.deepEqual(testData.messages, [163]);
                }
            );
        });

        it('Should create an include file with test function', function() {
            var files = createFiles(
                    [
                        '#include "include.whl"',
                        '',
                        'proc main()',
                        '    printN(3223)',
                        'endp'
                    ],
                    [
                        'proc printN(number n)',
                        '    struct PrintNumber',
                        '        number n',
                        '    ends',
                        '    PrintNumber printNumber',
                        '    set      printNumber.n,n',
                        '    addr     printNumber',
                        '    module   0,0',
                        'endp'
                    ]
                );
            var testData = compilerTestUtils.setup();
            var preProcessor = new wheel.compiler.PreProcessor({files: files});

            preProcessor.process(
                '',
                'main.whl',
                function(includes) {
                    var outputCommands = testData.compiler.compile(includes);
                    var compilerData   = testData.compiler.getCompilerData();
                    var vmData         = testData.vm.getVMData();

                    testData.vm.runAll(
                        outputCommands,
                        compilerData.getStringList(),
                        compilerData.getGlobalConstants(),
                        compilerData.getGlobalOffset()
                    );

                    assert.deepEqual(testData.messages, [3223]);
                }
            );
        });

        it('Should create two include files with test functions', function() {
            var files = createFiles(
                    [
                        '#include "test1.whl"',
                        '',
                        'proc main()',
                        '    testInclude()',
                        '    printN(354)',
                        'endp'
                    ],
                    [ // include.whl
                        'proc printN(number n)',
                        '    struct PrintNumber',
                        '        number n',
                        '    ends',
                        '    PrintNumber printNumber',
                        '    set      printNumber.n,n',
                        '    addr     printNumber',
                        '    module   0,0',
                        'endp'
                    ],
                    [ // test/test.whl
                        '#include "include.whl"',
                        '',
                        'proc testInclude()',
                        '    printN(687)',
                        'endp'
                    ]
                );
            var testData = compilerTestUtils.setup();
            var preProcessor = new wheel.compiler.PreProcessor({files: files});

            preProcessor.process(
                'test/',
                'main.whl',
                function(includes) {
                    var outputCommands = testData.compiler.compile(includes);
                    var compilerData   = testData.compiler.getCompilerData();
                    var vmData         = testData.vm.getVMData();

                    testData.vm.runAll(
                        outputCommands,
                        compilerData.getStringList(),
                        compilerData.getGlobalConstants(),
                        compilerData.getGlobalOffset()
                    );

                    assert.deepEqual(testData.messages, [687, 354]);
                }
            );
        });

        it('Should create three include files with test functions', function() {
            var files = createFiles(
                    [
                        '#include "test1.whl"',
                        '',
                        'proc main()',
                        '    testInclude1()',
                        '    printN(354)',
                        'endp'
                    ],
                    [ // include.whl
                        'proc printN(number n)',
                        '    struct PrintNumber',
                        '        number n',
                        '    ends',
                        '    PrintNumber printNumber',
                        '    set      printNumber.n,n',
                        '    addr     printNumber',
                        '    module   0,0',
                        'endp'
                    ],
                    [ // test/test1.whl
                        '#include "include.whl"',
                        '#include "test2.whl"',
                        '',
                        'proc testInclude1()',
                        '    testInclude2()',
                        '    printN(687)',
                        'endp'
                    ],
                    [ // test/test2.whl
                        '#include "include.whl"',
                        '',
                        'proc testInclude2()',
                        '    printN(9897)',
                        'endp'
                    ]
                );
            var testData = compilerTestUtils.setup();
            var preProcessor = new wheel.compiler.PreProcessor({files: files});

            preProcessor.process(
                'test/',
                'main.whl',
                function(includes) {
                    var outputCommands = testData.compiler.compile(includes);
                    var compilerData   = testData.compiler.getCompilerData();
                    var vmData         = testData.vm.getVMData();

                    testData.vm.runAll(
                        outputCommands,
                        compilerData.getStringList(),
                        compilerData.getGlobalConstants(),
                        compilerData.getGlobalOffset()
                    );

                    assert.deepEqual(testData.messages, [9897, 687, 354]);
                }
            );
        });

        it('Should replace defines', function() {
            var files = createFiles(
                    [
                        '#define TEST_DEFINITION 989834',
                        '',
                        'proc printN(number n)',
                        '    struct PrintNumber',
                        '        number n',
                        '    ends',
                        '    PrintNumber printNumber',
                        '    set      printNumber.n,n',
                        '    addr     printNumber',
                        '    module   0,0',
                        'endp',
                        '',
                        'proc main()',
                        '    printN(TEST_DEFINITION)',
                        'endp'
                    ]
                );
            var testData = compilerTestUtils.setup();
            var preProcessor = new wheel.compiler.PreProcessor({files: files});

            preProcessor.process(
                '',
                'main.whl',
                function(includes) {
                    var outputCommands = testData.compiler.compile(includes);
                    var compilerData   = testData.compiler.getCompilerData();
                    var vmData         = testData.vm.getVMData();

                    testData.vm.runAll(
                        outputCommands,
                        compilerData.getStringList(),
                        compilerData.getGlobalConstants(),
                        compilerData.getGlobalOffset()
                    );

                    assert.deepEqual(testData.messages, [989834]);
                }
            );
        });

        it('Should replace multiple defines', function() {
            var files = createFiles(
                    [
                        '#define TEST_DEFINITION1 873',
                        '#define TEST_DEFINITION2 129',
                        '',
                        'proc printN(number n)',
                        '    struct PrintNumber',
                        '        number n',
                        '    ends',
                        '    PrintNumber printNumber',
                        '    set      printNumber.n,n',
                        '    addr     printNumber',
                        '    module   0,0',
                        'endp',
                        '',
                        'proc main()',
                        '    printN(TEST_DEFINITION1)',
                        '    printN(TEST_DEFINITION2)',
                        'endp'
                    ]
                );
            var testData = compilerTestUtils.setup();
            var preProcessor = new wheel.compiler.PreProcessor({files: files});

            preProcessor.process(
                '',
                'main.whl',
                function(includes) {
                    var outputCommands = testData.compiler.compile(includes);
                    var compilerData   = testData.compiler.getCompilerData();
                    var vmData         = testData.vm.getVMData();

                    testData.vm.runAll(
                        outputCommands,
                        compilerData.getStringList(),
                        compilerData.getGlobalConstants(),
                        compilerData.getGlobalOffset()
                    );

                    assert.deepEqual(testData.messages, [873, 129]);
                }
            );
        });

        it('Should replace multiple defines', function() {
            var files = createFiles(
                    [
                        '#define TEST_DEFINITION printN(123)',
                        '',
                        'proc printN(number n)',
                        '    struct PrintNumber',
                        '        number n',
                        '    ends',
                        '    PrintNumber printNumber',
                        '    set      printNumber.n,n',
                        '    addr     printNumber',
                        '    module   0,0',
                        'endp',
                        '',
                        'proc main()',
                        '    TEST_DEFINITION',
                        'endp'
                    ]
                );
            var testData = compilerTestUtils.setup();
            var preProcessor = new wheel.compiler.PreProcessor({files: files});

            preProcessor.process(
                '',
                'main.whl',
                function(includes) {
                    var outputCommands = testData.compiler.compile(includes);
                    var compilerData   = testData.compiler.getCompilerData();
                    var vmData         = testData.vm.getVMData();

                    testData.vm.runAll(
                        outputCommands,
                        compilerData.getStringList(),
                        compilerData.getGlobalConstants(),
                        compilerData.getGlobalOffset()
                    );

                    assert.deepEqual(testData.messages, [123]);
                }
            );
        });

        it('Should remove remarks', function() {
            var files = createFiles(
                    [
                        'proc printN(number n)',
                        '    struct PrintNumber',
                        '        number n',
                        '    ends ; This should be no problem.',
                        '    PrintNumber printNumber',
                        '    set      printNumber.n,n',
                        '    addr     printNumber',
                        '    module   0,0',
                        'endp',
                        '',
                        'proc main()',
                        '    printN(8993) ; This should be no problem.',
                        'endp'
                    ]
                );
            var testData = compilerTestUtils.setup();
            var preProcessor = new wheel.compiler.PreProcessor({files: files});

            preProcessor.process(
                '',
                'main.whl',
                function(includes) {
                    var outputCommands = testData.compiler.compile(includes);
                    var compilerData   = testData.compiler.getCompilerData();
                    var vmData         = testData.vm.getVMData();

                    testData.vm.runAll(
                        outputCommands,
                        compilerData.getStringList(),
                        compilerData.getGlobalConstants(),
                        compilerData.getGlobalOffset()
                    );

                    assert.deepEqual(testData.messages, [8993]);
                }
            );
        });

        assert.throws(
            function() {
                var files = createFiles(
                        [
                            'struct S',
                            '    number n',
                            'end',
                            'end',
                            '',
                            'proc main()',
                            'endp'
                        ]
                    );
                var compiler     = new wheel.compiler.Compiler({});
                var preProcessor = new wheel.compiler.PreProcessor({files: files});

                preProcessor.process(
                    '',
                    'main.whl',
                    function(includes) {
                        compiler.compile(includes);
                    }
                );
            },
            function(error) {
                return (error.toString() === 'Error: End without begin.');
            }
        );
    }
);
