var assert = require('assert');

var wheel             = require('../utils/base.js').wheel;
var compilerTestUtils = require('./compilerTestUtils.js');

describe(
    'Test error',
    function() {
        describe(
            'Syntax error',
            function() {
                // 1
                it('Should throw syntax error on invalid procedure name', function() {
                    assert.throws(
                        function() {
                            compilerTestUtils.compile([
                                'proc main()',
                                    '~wrong()',
                                'endp'
                            ]);
                        },
                        function(error) {
                            return (error.toString() === 'Error: #1 Syntax error.');
                        }
                    );
                });

                // 2
                it('Should throw syntax error on invalid struct name', function() {
                    assert.throws(
                        function() {
                            compilerTestUtils.compile([
                                'struct ~bad',
                                'ends',
                                'proc main()',
                                'endp'
                            ]);
                        },
                        function(error) {
                            return (error.toString() === 'Error: #2 Syntax error.');
                        }
                    );
                });

                // 3
                it('Should throw syntax error on invalid number array', function() {
                    assert.throws(
                        function() {
                            compilerTestUtils.compile([
                                'number n[3] = [1, 2, 3}',
                                'proc main()',
                                'endp'
                            ]);
                        },
                        function(error) {
                            return (error.toString() === 'Error: #3 Syntax error.');
                        }
                    );
                });
            }
        );

        describe(
            'Type mismatch',
            function() {
                // 16
                it('Should throw type mismatch', function() {
                    assert.throws(
                        function() {
                            compilerTestUtils.compile([
                                'proc main()',
                                '    number n',
                                '    set 1, n',
                                'endp'
                            ]);
                        },
                        function(error) {
                            return (error.toString() === 'Error: #16 Type mismatch "1".');
                        }
                    );
                });
            }
        );

        describe(
            'Undefined identifier',
            function () {
                // 17
                it('Should throw undefined identifier', function() {
                    assert.throws(
                        function() {
                            compilerTestUtils.compile([
                                'proc main()',
                                '    set n, 1',
                                'endp'
                            ]);
                        },
                        function(error) {
                            return (error.toString() === 'Error: #17 Undefined identifier "n".');
                        }
                    );
                });
            }
        );

        // 19
        describe(
            'Duplicate label',
            function () {
                it('Should throw type mismatch', function() {
                    assert.throws(
                        function() {
                            compilerTestUtils.compile([
                                'label:',
                                'label:',
                                'proc main()',
                                'endp'
                            ]);
                        },
                        function(error) {
                            return (error.toString() === 'Error: #19 Duplicate label "label:".');
                        }
                    );
                });
            }
        );

        describe(
            'Number expected',
            function() {
                // 20
                it('Should throw (local) number expected', function() {
                    assert.throws(
                        function() {
                            compilerTestUtils.compile([
                                'proc main()',
                                '   number n = \'x\'',
                                'endp'
                            ]);
                        },
                        function(error) {
                            return (error.toString() === 'Error: #20 Number expected, found "\'x\'".');
                        }
                    );
                });

                // 21
                it('Should throw (global) number expected', function() {
                    assert.throws(
                        function() {
                            compilerTestUtils.compile([
                                'number n = \'y\'',
                                'proc main()',
                                'endp'
                            ]);
                        },
                        function(error) {
                            return (error.toString() === 'Error: #21 Number expected, found "\'y\'".');
                        }
                    );
                });
            }
        );

        describe(
            'Type error',
            function() {
                // 29
                it('Should throw type error', function() {
                    assert.throws(
                        function() {
                            compilerTestUtils.compile([
                                'number a[3] = [1, \'x\', 3]',
                                'proc main()',
                                'endp'
                            ]);
                        },
                        function(error) {
                            return (error.toString() === 'Error: #29 Number expected, found " \'x\'".');
                        }
                    );
                });
            }
        );
    }
);