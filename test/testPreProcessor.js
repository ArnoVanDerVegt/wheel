var assert = require('assert');

var wheel             = require('../utils/base.js').wheel;
var compilerTestUtils = require('./compilerTestUtils.js');

function createFiles(content1, content2) {

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
        _list: [0, 1],
        _files: {
            'main.whl': 0,
            'include.whl': 1
        },
        exists: function(filename) {
            return this._files[filename];
        },
        getFile: function(index) {
            switch (index) {
                case 0:
                    return createFile(content1);

                case 1:
                    return createFile(content2);
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
                console.log('-->', error.toString());
                return (error.toString() === 'Error: End without begin.');
            }
        );

    }
);
