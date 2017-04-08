var assert = require('assert');

var wheel             = require('../js/utils/base.js').wheel;
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
        exists: function(path, filename) {
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
    'Math module',
    function() {
        it('Should round', function() {
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
                        '#define MODULE_MATH 4',
                        '#define MATH_ROUND 0',
                        '',
                        'proc main()',
                        '    number n',
                        '    set n, 6.3',
                        '    number *pn',
                        '    addr n',
                        '    module   MODULE_MATH, MATH_ROUND',
                        '    printN(n)',
                        'endp'
                    ]
                );
            var testData = compilerTestUtils.setup();
            var preProcessor = new wheel.compiler.PreProcessor({files: files});

            preProcessor.process(
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

                    assert.deepEqual(testData.messages, [6]);
                }
            );
        });

        it('Should floor', function() {
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
                        '#define MODULE_MATH 4',
                        '#define MATH_FLOOR 1',
                        '',
                        'proc main()',
                        '    number n',
                        '    set n, 21.49',
                        '    number *pn',
                        '    addr n',
                        '    module   MODULE_MATH, MATH_FLOOR',
                        '    printN(n)',
                        'endp'
                    ]
                );
            var testData = compilerTestUtils.setup();
            var preProcessor = new wheel.compiler.PreProcessor({files: files});

            preProcessor.process(
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

                    assert.deepEqual(testData.messages, [21]);
                }
            );
        });

        it('Should ceil', function() {
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
                        '#define MODULE_MATH 4',
                        '#define MATH_CEIL 2',
                        '',
                        'proc main()',
                        '    number n',
                        '    set n, 5.14',
                        '    number *pn',
                        '    addr n',
                        '    module   MODULE_MATH, MATH_CEIL',
                        '    printN(n)',
                        'endp'
                    ]
                );
            var testData = compilerTestUtils.setup();
            var preProcessor = new wheel.compiler.PreProcessor({files: files});

            preProcessor.process(
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

                    assert.deepEqual(testData.messages, [6]);
                }
            );
        });

        it('Should abs', function() {
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
                        '#define MODULE_MATH 4',
                        '#define MATH_ABS 3',
                        '',
                        'proc main()',
                        '    number n',
                        '    set n, -15',
                        '    number *pn',
                        '    addr n',
                        '    module   MODULE_MATH, MATH_ABS',
                        '    printN(n)',
                        'endp'
                    ]
                );
            var testData = compilerTestUtils.setup();
            var preProcessor = new wheel.compiler.PreProcessor({files: files});

            preProcessor.process(
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

                    assert.deepEqual(testData.messages, [15]);
                }
            );
        });

        it('Should neg', function() {
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
                        '#define MODULE_MATH 4',
                        '#define MATH_NEG 4',
                        '',
                        'proc main()',
                        '    number n',
                        '    set n, 257',
                        '    number *pn',
                        '    addr n',
                        '    module   MODULE_MATH, MATH_NEG',
                        '    printN(n)',
                        'endp'
                    ]
                );
            var testData = compilerTestUtils.setup();
            var preProcessor = new wheel.compiler.PreProcessor({files: files});

            preProcessor.process(
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

                    assert.deepEqual(testData.messages, [-257]);
                }
            );
        });
    }
);
