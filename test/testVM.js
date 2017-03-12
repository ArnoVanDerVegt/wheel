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
    'VM',
    function() {
        it('Should remove remarks', function() {
            var files = createFiles(
                    [
                        'proc main()',
                        '    module 255,0',
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
                }
            );
        });
    }
);
