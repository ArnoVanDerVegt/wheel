/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const testLogs    = require('../../utils').testLogs;
const testCompile = require('../../utils').testCompile;
const testCodeAndMemory = require('../../utils').testCodeAndMemory;
const assert      = require('assert');

describe(
    'Test proc namespace',
    function() {
        describe(
            'Test namespace declarations',
            function() {
                it(
                    'Should declare a namespace',
                    function() {
                        let info = testCompile(
                                [
                                    'namespace test',
                                    'proc main()',
                                    'end'
                                ]
                            );
                        assert.equal(info.compiler.getNamespace().getCurrentNamespace(), 'test~');
                    }
                );
                it(
                    'Should declare a namespace with a dot',
                    function() {
                        let info = testCompile(
                                [
                                    'namespace test.abc',
                                    'proc main()',
                                    'end'
                                ]
                            );
                        assert.equal(info.compiler.getNamespace().getCurrentNamespace(), 'test~abc~');
                    }
                );
                it(
                    'Should declare a namespace with two dots',
                    function() {
                        let info = testCompile(
                                [
                                    'namespace test.abc.def',
                                    'proc main()',
                                    'end'
                                ]
                            );
                        assert.equal(info.compiler.getNamespace().getCurrentNamespace(), 'test~abc~def~');
                    }
                );
            }
        );
        describe(
            'Test call local procedure in namespace',
            function() {
                testLogs(
                    it,
                    'Should call in namespace',
                    [
                        'namespace test',
                        'proc myProc()',
                        '    number n = 156',
                        '    addr n',
                        '    mod  0, 1',
                        'end',
                        'proc main()',
                        '    myProc()',
                        'end'
                    ],
                    [
                        156
                    ]
                );
                testLogs(
                    it,
                    'Should call in namespace with two dots',
                    [
                        'namespace abc.def',
                        'proc myProc()',
                        '    number n = 956',
                        '    addr n',
                        '    mod  0, 1',
                        'end',
                        'proc main()',
                        '    myProc()',
                        'end'
                    ],
                    [
                        956
                    ]
                );
            }
        );
        describe(
            'Test call procedure in namespace',
            function() {
                testLogs(
                    it,
                    'Should call in namespace',
                    [
                        'namespace test',
                        'proc myProc()',
                        '    number n = 156',
                        '    addr n',
                        '    mod  0, 1',
                        'end',
                        'proc main()',
                        '    test.myProc()',
                        'end'
                    ],
                    [
                        156
                    ]
                );
                testLogs(
                    it,
                    'Should call in namespace with two dots',
                    [
                        'namespace abc.def',
                        'proc myProc()',
                        '    number n = 956',
                        '    addr n',
                        '    mod  0, 1',
                        'end',
                        'proc main()',
                        '    abc.def.myProc()',
                        'end'
                    ],
                    [
                        956
                    ]
                );
            }
        );
        describe(
            'Test call function in namespace',
            function() {
                testLogs(
                    it,
                    'Should call function in namespace',
                    [
                        'namespace test',
                        'proc myProc()',
                        '    ret 1289',
                        'end',
                        'proc main()',
                        '    number n = test.myProc()',
                        '    addr n',
                        '    mod  0, 1',
                        'end'
                    ],
                    [
                        1289
                    ]
                );
                testLogs(
                    it,
                    'Should call in namespace function with two dots',
                    [
                        'namespace abc.def',
                        'proc myProc()',
                        '    ret 1567',
                        'end',
                        'proc main()',
                        '    number n = abc.def.myProc()',
                        '    addr n',
                        '    mod  0, 1',
                        'end'
                    ],
                    [
                        1567
                    ]
                );
                testLogs(
                    it,
                    'Should call in namespace function with three dots',
                    [
                        'namespace abc.def.ghi',
                        'proc myProc()',
                        '    ret 1567',
                        'end',
                        'proc main()',
                        '    number n = abc.def.ghi.myProc()',
                        '    addr n',
                        '    mod  0, 1',
                        'end'
                    ],
                    [
                        1567
                    ]
                );
            }
        );
        describe(
            'Test call function in local namespace',
            function() {
                testLogs(
                    it,
                    'Should call function in namespace',
                    [
                        'namespace test',
                        'proc myProc()',
                        '    ret 2289',
                        'end',
                        'proc main()',
                        '    number n = myProc()',
                        '    addr n',
                        '    mod  0, 1',
                        'end'
                    ],
                    [
                        2289
                    ]
                );
                testLogs(
                    it,
                    'Should call in namespace function with two dots',
                    [
                        'namespace abc.def',
                        'proc myProc()',
                        '    ret 2567',
                        'end',
                        'proc main()',
                        '    number n = myProc()',
                        '    addr n',
                        '    mod  0, 1',
                        'end'
                    ],
                    [
                        2567
                    ]
                );
                testLogs(
                    it,
                    'Should call in namespace function with three dots',
                    [
                        'namespace abc.def.ghi',
                        'proc myProc()',
                        '    ret 2567',
                        'end',
                        'proc main()',
                        '    number n = myProc()',
                        '    addr n',
                        '    mod  0, 1',
                        'end'
                    ],
                    [
                        2567
                    ]
                );
            }
        );
    }
);
