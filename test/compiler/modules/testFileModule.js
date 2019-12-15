/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher     = require('../../../js/frontend/lib/dispatcher').dispatcher;
const testModuleCall = require('../../utils').testModuleCall;
const testLogs       = require('../../utils').testLogs;
const testCompile    = require('../../utils').testCompile;
const assert         = require('assert');

describe(
    'Test File module',
    function() {
        it(
            'Should open',
            function() {
                let source = [
                        'proc fileOpen(string filename)',
                        '    addr filename',
                        '    mod  8, 1',
                        'end',
                        'proc main()',
                        '    number handle',
                        '    string filename = "test.rtf"',
                        '    handle = fileOpen(filename)',
                        'end'
                    ];
                let info = testCompile(source);
                info.modules[0].on('Console.Log', this, function(opts) {
                    assert.equal(opts.message, 0);
                });
                info.vm.setCommands(info.commands).run();
            }
        );
        it(
            'Should ingore writing to unopened file',
            function() {
                let source = [
                        'proc fileWriteNumber(number handle, number n)',
                        '    addr handle',
                        '    mod  8, 4',
                        'end',
                        'proc main()',
                        '    fileWriteNumber(100, 5)',
                        'end'
                    ];
                let info = testCompile(source);
                info.modules[0].on('Console.Log', this, function(opts) {
                    assert.equal(opts.message, 0);
                });
                info.vm.setCommands(info.commands).run();
            }
        );
        it(
            'Should ingore removing with invalid handle',
            function() {
                let source = [
                        'proc fileDelete(number handle)',
                        '    addr handle',
                        '    mod  8, 7',
                        'end',
                        'proc main()',
                        '    fileDelete(100)',
                        'end'
                    ];
                let info = testCompile(source);
                info.vm.setCommands(info.commands).run();
            }
        );
        it(
            'Should ingore closing with invalid handle',
            function() {
                let source = [
                        'proc fileClose(number handle)',
                        '    addr handle',
                        '    mod  8, 6',
                        'end',
                        'proc main()',
                        '    fileClose(100)',
                        'end'
                    ];
                let info = testCompile(source);
                info.vm.setCommands(info.commands).run();
            }
        );
        it(
            'Should return empty string when reading from unopened file',
            function() {
                let source = [
                        'proc fileReadString(number handle, string result)',
                        '    addr handle',
                        '    mod  8, 4',
                        'end',
                        'proc main()',
                        '    string s',
                        '    fileReadString(100, s)',
                        '    addr s',
                        '    mod  0, 2',
                        'end'
                    ];
                let info = testCompile(source);
                info.modules[0].on('Console.Log', this, function(opts) {
                    assert.equal(opts.message, '');
                });
                info.vm.setCommands(info.commands).run();
            }
        );
        it(
            'Should read',
            function() {
                let source = [
                        'proc fileOpen(string filename)',
                        '    addr filename',
                        '    mod  8, 1', // FILE_OPEN_READ
                        'end',
                        'proc fileReadNumber(number handle)',
                        '    addr handle',
                        '    mod  8, 3', // FILE_READ_NUMBER
                        'end',
                        'proc fileReadString(number handle, string result)',
                        '    addr handle',
                        '    mod  8, 4', // FILE_READ_STRING
                        'end',
                        'proc main()',
                        '    number handle',
                        '    string filename = "test.rtf"',
                        '    handle = fileOpen(filename)',
                        '    number n',
                        '    n = fileReadNumber(handle))',
                        '    addr n',
                        '    mod  0, 1',
                        '    n = fileReadNumber(handle))',
                        '    addr n',
                        '    mod  0, 1',
                        '    string s',
                        '    fileReadString(handle, s)',
                        '    addr s',
                        '    mod  0, 2',
                        '    n = fileReadNumber(handle))',
                        '    addr n',
                        '    mod  0, 1',
                        'end'
                    ];
                let info = testCompile(source);
                let logs = [];
                info.modules[0].on('Console.Log', this, function(opts) {
                    logs.push(opts.message);
                });
                info.vm.setCommands(info.commands).run();
                assert.deepEqual(logs, [45, 99, 'Hello world', 15]);
            }
        );
        it(
            'Should write and read',
            function() {
                let source = [
                        'proc fileOpen(string filename)',
                        '    addr filename',
                        '    mod  8, 1', // FILE_OPEN_READ
                        'end',
                        'proc fileReadNumber(number handle)',
                        '    addr handle',
                        '    mod  8, 3', // FILE_READ_NUMBER
                        'end',
                        'proc fileWriteNumber(number handle, number n)',
                        '    addr handle',
                        '    mod  8, 5',
                        'end',
                        'proc fileClose(number handle)',
                        '    addr handle',
                        '    mod  8, 7', // FILE_CLOSE
                        'end',
                        'proc fileDelete(string filename)',
                        '    addr filename',
                        '    mod  8, 8', // FILE_DELETE
                        'end',
                        'proc main()',
                        '    number handle',
                        '    string filename = "new.rtf"',
                        '    handle = fileOpen(filename)',
                        '    fileWriteNumber(handle, 1546)',
                        '    fileWriteNumber(handle, 94)',
                        '    fileClose(handle)',
                        '    handle = fileOpen(filename)',
                        '    number n',
                        '    n = fileReadNumber(handle)',
                        '    addr n',
                        '    mod  0, 1',
                        '    n = fileReadNumber(handle)',
                        '    addr n',
                        '    mod  0, 1',
                        '    fileDelete("new.rtf")',
                        'end'
                    ];
                let info = testCompile(source);
                let logs = [];
                info.modules[0].on('Console.Log', this, function(opts) {
                    logs.push(opts.message);
                });
                info.vm.setCommands(info.commands).run();
                assert.deepEqual(logs, [1546, 94]);
            }
        );
        testLogs(
            it,
            'Should get the file size',
            [
                'proc fileSize(string filename)',
                '    addr filename',
                '    mod  8, 9',
                'end',
                'proc main()',
                '    number size = fileSize("test.rtf")',
                '    addr size',
                '    mod  0, 1',
                'end'
            ],
            [
                20
            ]
        );
    }
);
