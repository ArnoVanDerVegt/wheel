/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher  = require('../../../js/frontend/lib/dispatcher').dispatcher;
const testLogs    = require('../../utils').testLogs;
const testCompile = require('../../utils').testCompile;
const assert      = require('assert');

describe(
    'Test VM',
    function() {
        describe(
            'Test Log',
            function() {
                testLogs(
                    it,
                    'Should log number',
                    [
                        'number n',
                        'proc main()',
                        '    addr n',
                        '    n = 21',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        21
                    ]
                );
                it(
                    'Should assert getters',
                    function() {
                        let source = [
                                'number n',
                                'proc main()',
                                '    addr n',
                                '    n = 22',
                                '    mod 0, 1',
                                'end'
                            ];
                        let info = testCompile(source);
                        dispatcher.on('Console.Log', this, function(opts) {
                            assert.equal(opts.message, 22);
                        });
                        info.vm.setCommands(info.commands);
                        assert.equal(info.vm.getModules().length, 12);
                        assert.equal(info.vm.getBreakpoint(),     false);
                    }
                );
                it(
                    'Should stop',
                    function(done) {
                        let source = [
                                'proc main()',
                                '    repeat',
                                '    end',
                                'end'
                            ];
                        let info = testCompile(source);
                        dispatcher.on('Console.Log', this, function(opts) {
                            assert.equal(opts.message, 22);
                        });
                        info.vm.setCommands(info.commands).startRunInterval(function() {});
                        setTimeout(
                            function() {
                                assert.equal(info.vm.running(), true);
                                info.vm.stop();
                                assert.equal(info.vm.running(), false);
                                done();
                            },
                            15
                        );
                    }
                );
                it(
                    'Should finish',
                    function(done) {
                        let source = [
                                'number n',
                                'proc main()',
                                '    n = 1',
                                'end'
                            ];
                        let info   = testCompile(source);
                        let called = false;
                        info.vm.setCommands(info.commands).startRunInterval(function() { called = true; });
                        setTimeout(
                            function() {
                                assert.equal(called, true);
                                done();
                            },
                            10
                        );
                    }
                );
                it(
                    'Should sleep',
                    function(done) {
                        let source = [
                                'proc main()',
                                '    repeat',
                                '    end',
                                'end'
                            ];
                        let info = testCompile(source);
                        info.vm.setCommands(info.commands).startRunInterval(function() {});
                        info.vm.sleep(5);
                        setTimeout(
                            function() {
                                info.vm.stop();
                                assert.equal(info.vm.running(), false);
                                done();
                            },
                            15
                        );
                    }
                );
                it(
                    'Should sleep with module call',
                    function(done) {
                        let source = [
                                'proc main()',
                                '    number time = 50',
                                '    addr time',
                                '    mod  0, 4',
                                '    repeat',
                                '    end',
                                'end'
                            ];
                        let info = testCompile(source);
                        info.vm.setCommands(info.commands).startRunInterval(function() {});
                        setTimeout(
                            function() {
                                assert.equal(info.vm.sleeping(), true);
                                info.vm.stop();
                                assert.equal(info.vm.running(), false);
                                done();
                            },
                            10
                        );
                    }
                );
                it(
                    'Should break',
                    function(done) {
                        let source = [
                                'proc main()',
                                '    number n',
                                '    n = 55',
                                '    addr n',
                                '    mod 0, 1',
                                'end'
                            ];
                        let info = testCompile(source);
                        let m    = false;
                        info.modules[0].on('Console.Log', this, function(opts) {
                            m = opts.message;
                        });
                        dispatcher.on('VM.Breakpoint', this, function(vm, breakpoint) {
                            assert.equal(breakpoint.test, true);
                            info.vm.continueAfterBreakpoint(breakpoint);
                        });
                        info.commands[1].setBreakpoint({test: true});
                        info.vm.setCommands(info.commands).startRunInterval(function() {});
                        setTimeout(
                            function() {
                                info.vm.stop();
                                assert.equal(info.vm.running(), false);
                                done();
                                assert.equal(m, 55);
                            },
                            15
                        );
                    }
                );
                it(
                    'Should ingore missing break',
                    function(done) {
                        let source = [
                                'proc main()',
                                '    repeat',
                                '    end',
                                'end'
                            ];
                        let info = testCompile(source);
                        info.vm.setCommands(info.commands).startRunInterval(function() {});
                        setTimeout(
                            function() {
                                info.vm.continueAfterBreakpoint(false);
                                info.vm.stop();
                                assert.equal(info.vm.running(), false);
                                done();
                            },
                            15
                        );
                    }
                );
                it(
                    'Should throw unknown module',
                    function() {
                        assert.throws(
                            function() {
                                let source = [
                                        'number n',
                                        'proc main()',
                                        '    mod 101, 0',
                                        'end'
                                    ];
                                let info = testCompile(source);
                                info.vm.setCommands(info.commands).run();
                            },
                            function(error) {
                                return (error.toString() === 'Error: Unknown module "101"');
                            }
                        );
                    }
                );
                it(
                    'Should stop vm',
                    function() {
                        let source = [
                                'proc main()',
                                '    repeat',
                                '        mod 0, 7',
                                '    end',
                                'end'
                            ];
                        let info = testCompile(source);
                        info.vm.setCommands(info.commands).startRunInterval(function() {});
                        assert.equal(info.vm.running(), true);
                    }
                );
                it(
                    'Should stop program',
                    function() {
                        let source = [
                                'proc main()',
                                '    repeat',
                                '        mod 0, 8',
                                '    end',
                                'end'
                            ];
                        let info = testCompile(source);
                        info.vm.setCommands(info.commands).startRunInterval(function() {});
                        assert.equal(info.vm.running(), true);
                    }
                );
            }
        );
    }
);
