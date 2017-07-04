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
    'VM',
    function() {
        it('Should throw unknown module', function() {
            assert.throws(
                function() {
                    var files = createFiles(
                            [
                                'proc main()',
                                '    asm',
                                '        module 255,0',
                                '    end',
                                'endp'
                            ]
                        );
                    var testData = compilerTestUtils.setup();
                    var preProcessor = new wheel.compiler.preprocessor.PreProcessor({files: files});

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
                        }
                    );
                },
                function(error) {
                    return (error.toString() === 'Error: Unknown module "255"');
                }
            );
        });

        it('Should run in loop', function(done) {
            var files = createFiles(
                    [
                        'proc main()',
                        'label:',
                        '    jmp label',
                        'endp'
                    ]
                );
            var testData = compilerTestUtils.setup();
            var preProcessor = new wheel.compiler.preprocessor.PreProcessor({files: files});
            var vm;

            preProcessor.process(
                'main.whl',
                function(includes) {
                    var outputCommands = testData.compiler.compile(includes);
                    var compilerData   = testData.compiler.getCompilerData();
                    var vmData         = testData.vm.getVMData();

                    vm = testData.vm;
                    vm.run(
                        outputCommands,
                        compilerData.getStringList(),
                        compilerData.getGlobalConstants(),
                        compilerData.getGlobalOffset()
                    );
                    assert.equal(vm.getRunning(), true);
                    vm.stop();
                    assert.equal(vm.getRunning(), false);

                    done();
                }
            );
        });

        it('Should run in repeat loop', function(done) {
            var files = createFiles(
                    [
                        'proc main()',
                        '    repeat',
                        '    end',
                        'endp'
                    ]
                );
            var testData = compilerTestUtils.setup();
            var preProcessor = new wheel.compiler.preprocessor.PreProcessor({files: files});
            var vm;

            preProcessor.process(
                'main.whl',
                function(includes) {
                    var outputCommands = testData.compiler.compile(includes);
                    var compilerData   = testData.compiler.getCompilerData();
                    var vmData         = testData.vm.getVMData();

                    vm = testData.vm;
                    vm.run(
                        outputCommands,
                        compilerData.getStringList(),
                        compilerData.getGlobalConstants(),
                        compilerData.getGlobalOffset()
                    );
                    assert.equal(vm.getRunning(), true);
                    vm.stop();
                    assert.equal(vm.getRunning(), false);

                    done();
                }
            );
        });

        it('Should run and stop after 50ms', function(done) {
            var files = createFiles(
                    [
                        'proc main()',
                        'label:',
                        '    jmp label',
                        'endp'
                    ]
                );
            var testData = compilerTestUtils.setup();
            var preProcessor = new wheel.compiler.preprocessor.PreProcessor({files: files});
            var vm;

            preProcessor.process(
                'main.whl',
                function(includes) {
                    var outputCommands = testData.compiler.compile(includes);
                    var compilerData   = testData.compiler.getCompilerData();
                    var vmData         = testData.vm.getVMData();

                    vm = testData.vm;
                    vm.run(
                        outputCommands,
                        compilerData.getStringList(),
                        compilerData.getGlobalConstants(),
                        compilerData.getGlobalOffset(),
                        function() {
                            done();
                        }
                    );
                }
            );
            setTimeout(
                function() {
                    assert.equal(vm.getPaused(),  false);
                    assert.equal(vm.getRunning(), true);
                    vm.stop();
                    assert.equal(vm.getRunning(), false);
                },
                50
            );
        });

        it('Should run, pause and stop after 50ms', function(done) {
            var files = createFiles(
                    [
                        'proc main()',
                        'label:',
                        '    jmp label',
                        'endp'
                    ]
                );
            var testData = compilerTestUtils.setup();
            var preProcessor = new wheel.compiler.preprocessor.PreProcessor({files: files});
            var vm;

            preProcessor.process(
                'main.whl',
                function(includes) {
                    var outputCommands = testData.compiler.compile(includes);
                    var compilerData   = testData.compiler.getCompilerData();
                    var vmData         = testData.vm.getVMData();

                    vm = testData.vm;
                    vm.run(
                        outputCommands,
                        compilerData.getStringList(),
                        compilerData.getGlobalConstants(),
                        compilerData.getGlobalOffset()
                    );
                    vm.pause();
                    assert.equal(vm.getPaused(), true);
                }
            );
            setTimeout(
                function() {
                    assert.equal(vm.getPaused(),  true);
                    vm.resume();
                    assert.equal(vm.getPaused(),  false);
                    assert.equal(vm.getRunning(), true);
                    vm.stop();
                    assert.equal(vm.getRunning(), false);
                    done();
                },
                50
            );
        });

        it('Should run', function() {
            var files = createFiles(
                    [
                        'proc main()',
                        '    number n = 1',
                        'endp'
                    ]
                );
            var testData = compilerTestUtils.setup();
            var preProcessor = new wheel.compiler.preprocessor.PreProcessor({files: files});
            var vm;

            preProcessor.process(
                'main.whl',
                function(includes) {
                    var outputCommands = testData.compiler.compile(includes);
                    var compilerData   = testData.compiler.getCompilerData();
                    var vmData         = testData.vm.getVMData();

                    vm = testData.vm;
                    vm.run(
                        outputCommands,
                        compilerData.getStringList(),
                        compilerData.getGlobalConstants(),
                        compilerData.getGlobalOffset()
                    );
                    assert.equal(vm.getRunning(), true);
                }
            );
        });

        it('Should run and finish', function(done) {
            var files = createFiles(
                    [
                        'proc main()',
                        '    number n = 1',
                        'endp'
                    ]
                );
            var testData = compilerTestUtils.setup();
            var preProcessor = new wheel.compiler.preprocessor.PreProcessor({files: files});
            var vm;

            preProcessor.process(
                'main.whl',
                function(includes) {
                    var outputCommands = testData.compiler.compile(includes);
                    var compilerData   = testData.compiler.getCompilerData();
                    var vmData         = testData.vm.getVMData();

                    vm = testData.vm;
                    vm.run(
                        outputCommands,
                        compilerData.getStringList(),
                        compilerData.getGlobalConstants(),
                        compilerData.getGlobalOffset(),
                        function() {
                            assert.equal(vm.getRunning(), false);
                            done();
                        }
                    );
                }
            );
        });
    }
);
