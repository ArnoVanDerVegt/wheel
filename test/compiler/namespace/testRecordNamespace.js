/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const testLogs    = require('../../utils').testLogs;
const testCompile = require('../../utils').testCompile;
const testCodeAndMemory = require('../../utils').testCodeAndMemory;
const assert      = require('assert');

describe(
    'Test record namespace',
    () => {
        describe(
            'Test namespace declarations',
            () => {
                it(
                    'Should declare a namespace',
                    () => {
                        let info = testCompile(
                                [
                                    'namespace test',
                                    'record Point',
                                    '   number x, y',
                                    'end',
                                    'proc main()',
                                    '    Point p',
                                    'end'
                                ]
                            );
                        assert.equal(info.compiler.getNamespace().getCurrentNamespace(), 'test~');
                    }
                );
                testLogs(
                    it,
                    'Should assign to a record in a namespace',
                    [
                        'namespace test',
                        'record Point',
                        '   number x, y',
                        'end',
                        'proc main()',
                        '    Point p',
                        '    p.x = 55',
                        '    p.y = 146',
                        '    addr p.y',
                        '    mod  0, 1',
                        '    addr p.x',
                        '    mod  0, 1',
                        'end'
                    ],
                    [
                        146,
                        55
                    ]
                );
                testLogs(
                    it,
                    'Should assign to a record in a namespace with namespace prefix',
                    [
                        'namespace test',
                        'record Point',
                        '   number x, y',
                        'end',
                        'proc main()',
                        '    test.Point p',
                        '    p.x = 688',
                        '    p.y = 136',
                        '    addr p.y',
                        '    mod  0, 1',
                        '    addr p.x',
                        '    mod  0, 1',
                        'end'
                    ],
                    [
                        136,
                        688
                    ]
                );
            }
        );
    }
);
