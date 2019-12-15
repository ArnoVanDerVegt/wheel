/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher          = require('../../../js/frontend/lib/dispatcher').dispatcher;
const testRangeCheckError = require('../../utils').testRangeCheckError;
const testCompile         = require('../../utils').testCompile;
const assert              = require('assert');

describe(
    'Test runtime errors',
    function() {
        describe(
            'Test number array range check',
            function() {
                testRangeCheckError(
                    it,
                    'Should check range of a numeric array',
                    [
                        'number i',
                        'proc main()',
                        '    number b[2]',
                        '    i = 4',
                        '    i = b[i]',
                        'end'
                    ]
                );
                testRangeCheckError(
                    it,
                    'Should check range of a numeric array with a negative range',
                    [
                        'number i',
                        'proc main()',
                        '    number b[2]',
                        '    i = -2',
                        '    i = b[i]',
                        'end'
                    ]
                );
                testRangeCheckError(
                    it,
                    'Should check range of a numeric array with an expression index',
                    [
                        'number i',
                        'proc main()',
                        '    number b[2]',
                        '    i = 4',
                        '    i = b[i * 4]',
                        'end'
                    ]
                );
                testRangeCheckError(
                    it,
                    'Should check range of two dimensional number array, first array index',
                    [
                        'number i',
                        'proc main()',
                        '    number n[3][4]',
                        '    i = 6',
                        '    i = n[i][1]',
                        'end'
                    ]
                );
                testRangeCheckError(
                    it,
                    'Should check range of two dimensional number array, second array index',
                    [
                        'number i',
                        'proc main()',
                        '    number n[3][4]',
                        '    i = 6',
                        '    i = n[2][i]',
                        'end'
                    ]
                );
            }
        );
        describe(
            'Test record array range check',
            function() {
                testRangeCheckError(
                    it,
                    'Should check range of a record array',
                    [
                        'record Point',
                        '    number x, y',
                        'end',
                        'number i',
                        'Point points[3]',
                        'proc main()',
                        '    number n = 5',
                        '    points[n] = {1, 2}',
                        'end'
                    ]
                );
                testRangeCheckError(
                    it,
                    'Should check range of a field array index',
                    [
                        'number i',
                        'record R',
                        '    number points[8]',
                        'end',
                        'proc main()',
                        '    R r',
                        '    i = 16',
                        '    r.points[i] = 1',
                        'end'
                    ]
                );
                testRangeCheckError(
                    it,
                    'Should check range of a multi dimensional field array index, first index',
                    [
                        'number i',
                        'record R',
                        '    number points[8][4]',
                        'end',
                        'proc main()',
                        '    R r',
                        '    i = 16',
                        '    r.points[i][1] = 1',
                        'end'
                    ]
                );
                testRangeCheckError(
                    it,
                    'Should check range of a multi dimensional field array index, second index',
                    [
                        'number i',
                        'record R',
                        '    number points[8][4]',
                        'end',
                        'proc main()',
                        '    R r',
                        '    i = 16',
                        '    r.points[2][i] = 1',
                        'end'
                    ]
                );
            }
        );
        describe(
            'Test division by zero',
            function() {
                it(
                    'Should detect division by zero with constant',
                    function() {
                        let called = false;
                        let info   = testCompile([
                                'proc main()',
                                '    number n = 5',
                                '    n /= 0',
                                'end'
                            ]);
                        dispatcher.reset();
                        dispatcher.on(
                            'VM.Error.DivisionByZero',
                            this,
                            function() {
                                called = true;
                            }
                        );
                        info.vm.setCommands(info.commands).run();
                        assert.equal(called, true);
                    }
                );
                it(
                    'Should detect division by zero with variable',
                    function() {
                        let called = false;
                        let info   = testCompile([
                                'proc main()',
                                '    number i = 5',
                                '    number j = 0',
                                '    i /= j',
                                'end'
                            ]);
                        dispatcher.reset();
                        dispatcher.on(
                            'VM.Error.DivisionByZero',
                            this,
                            function() {
                                called = true;
                            }
                        );
                        info.vm.setCommands(info.commands).run();
                        assert.equal(called, true);
                    }
                );
            }
        );
        describe(
            'Test heap overflow',
            function() {
                it(
                    'Should detect heap overflow',
                    function() {
                        let called = false;
                        let info   = testCompile([
                                '#heap 20',
                                'proc main()',
                                '    number n[20]',
                                '    n[19] = 1',
                                'end'
                            ]);
                        dispatcher.reset();
                        dispatcher.on(
                            'VM.Error.HeapOverflow',
                            this,
                            function() {
                                called = true;
                            }
                        );
                        info.vm.setCommands(info.commands).run();
                        assert.equal(called, true);
                    }
                );
            }
        );
    }
);
