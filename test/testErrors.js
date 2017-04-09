var assert = require('assert');

var wheel             = require('../js/utils/base.js').wheel;
var compilerTestUtils = require('./compilerTestUtils.js');

describe(
    'Test error',
    function() {
        describe(
            'Syntax error',
            function() {
                it('Should throw SYNTAX_ERROR_INVALID_PROC_CHAR', function() {
                    assert.throws(
                        function() {
                            compilerTestUtils.compile([
                                'proc main()',
                                    '~wrong()',
                                'endp'
                            ]);
                        },
                        function(error) {
                            return (error.toString() === 'Error: #' + wheel.compiler.error.SYNTAX_ERROR_INVALID_PROC_CHAR + ' Syntax error.');
                        }
                    );
                });

                it('Should throw SYNTAX_ERROR_PARAM_EXPECTED for declaration', function() {
                    assert.throws(
                        function() {
                            compilerTestUtils.compile([
                                'proc test(number n,)',
                                'endp',
                                'proc main()',
                                'endp'
                            ]);
                        },
                        function(error) {
                            return (error.toString() === 'Error: #' + wheel.compiler.error.SYNTAX_ERROR_PARAM_EXPECTED + ' Syntax error parameter expected.');
                        }
                    );
                });
                it('Should throw SYNTAX_ERROR_PARAM_EXPECTED for call', function() {
                    assert.throws(
                        function() {
                            compilerTestUtils.compile([
                                'proc test(number a, number b)',
                                'endp',
                                'proc main()',
                                '   test(1,)',
                                'endp'
                            ]);
                        },
                        function(error) {
                            return (error.toString() === 'Error: #' + wheel.compiler.error.SYNTAX_ERROR_PARAM_EXPECTED + ' Syntax error parameter expected.');
                        }
                    );
                });

                it('Should throw SYNTAX_ERROR_INVALID_PROC_PARAM', function() {
                    assert.throws(
                        function() {
                            compilerTestUtils.compile([
                                'proc error(wrong)',
                                'endp',
                                'proc main()',
                                'endp'
                            ]);
                        },
                        function(error) {
                            return (error.toString() === 'Error: #' + wheel.compiler.error.SYNTAX_ERROR_INVALID_PROC_PARAM + ' Syntax error in procedure parameter "wrong".');
                        }
                    );
                });
                it('Should throw syntax SYNTAX_ERROR_INVALID_STRUCS_CHAR', function() {
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
                            return (error.toString() === 'Error: #' + wheel.compiler.error.SYNTAX_ERROR_INVALID_STRUCS_CHAR + ' Syntax error.');
                        }
                    );
                });
                it('Should throw SYNTAX_ERROR_INVALID_CHAR', function() {
                    assert.throws(
                        function() {
                            compilerTestUtils.compile([
                                'number n[3] = [1, 2, 3}',
                                'proc main()',
                                'endp'
                            ]);
                        },
                        function(error) {
                            return (error.toString() === 'Error: #' + wheel.compiler.error.SYNTAX_ERROR_INVALID_CHAR + ' Syntax error.');
                        }
                    );
                });
                it('Should throw SYNTAX_ERROR_ARRAY_CLOSE_EXPECTED', function() {
                    assert.throws(
                        function() {
                            compilerTestUtils.compile([
                                'number a[1)',
                            ]);
                        },
                        function(error) {
                            return (error.toString() === 'Error: #' + wheel.compiler.error.SYNTAX_ERROR_ARRAY_CLOSE_EXPECTED + ' "]" expected.');
                        }
                    );
                });
            }
        );

        describe(
            'String expected error',
            function() {
                it('Should throw STRING_EXPECTED_IN_CONSTANT', function() {
                    assert.throws(
                        function() {
                            compilerTestUtils.compile([
                                'proc main()',
                                '    string s = 1',
                                'endp'
                            ]);
                        },
                        function(error) {
                            return (error.toString() === 'Error: #' + wheel.compiler.error.STRING_EXPECTED_IN_CONSTANT + ' String expected, found "1".');
                        }
                    );
                });
                it('Should throw STRING_EXPECTED_FOUND_NUMBER', function() {
                    assert.throws(
                        function() {
                            compilerTestUtils.compile([
                                'string s = 1',
                                'proc main()',
                                'endp'
                            ]);
                        },
                        function(error) {
                            return (error.toString() === 'Error: #' + wheel.compiler.error.STRING_EXPECTED_FOUND_NUMBER + ' String expected, found "1".');
                        }
                    );
                });
            }
        );

        describe(
            'Array expected error',
            function() {
                it('Should throw STRING_ARRAY_EXPECTED', function() {
                    assert.throws(
                        function() {
                            compilerTestUtils.compile([
                                'string s[2] = 1',
                                'proc main()',
                                'endp'
                            ]);
                        },
                        function(error) {
                            return (error.toString() === 'Error: #' + wheel.compiler.error.STRING_ARRAY_EXPECTED + ' String array expected, found "1".');
                        }
                    );
                });
            }
        );

        describe(
            'Type error',
            function() {
                it('Should throw TYPE_MISMATCH', function() {
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
                            return (error.toString() === 'Error: #' + wheel.compiler.error.TYPE_MISMATCH + ' Type mismatch "1".');
                        }
                    );
                });
                it('Should throw TYPE_ERROR_STRUCT_EXPECTED', function() {
                    assert.throws(
                        function() {
                            compilerTestUtils.compile([
                                'number n',
                                'proc main()',
                                '    n.a = 1',
                                'endp'
                            ]);
                        },
                        function(error) {
                            return (error.toString() === 'Error: #' + wheel.compiler.error.TYPE_ERROR_STRUCT_EXPECTED + ' Type error.');
                        }
                    );
                });
                it('Should throw TYPE_ERROR_NUMBER_EXPECTED', function() {
                    assert.throws(
                        function() {
                            compilerTestUtils.compile([
                                'number a[3] = [1, \'x\', 3]',
                                'proc main()',
                                'endp'
                            ]);
                        },
                        function(error) {
                            return (error.toString() === 'Error: #' + wheel.compiler.error.TYPE_ERROR_NUMBER_EXPECTED + ' Number expected, found " \'x\'".');
                        }
                    );
                });
                it('Should throw TYPE_ERROR_CAN_NOT_CALL_LOCAL', function() {
                    assert.throws(
                        function() {
                            compilerTestUtils.compile([
                                'proc main()',
                                '    number l',
                                '    l()',
                                'endp'
                            ]);
                        },
                        function(error) {
                            return (error.toString() === 'Error: #' + wheel.compiler.error.TYPE_ERROR_CAN_NOT_CALL_LOCAL + ' Type error, can not call "l".');
                        }
                    );
                });
                it('Should throw TYPE_ERROR_CAN_NOT_CALL_GLOBAL', function() {
                    assert.throws(
                        function() {
                            compilerTestUtils.compile([
                                'number g',
                                'proc main()',
                                '    g()',
                                'endp'
                            ]);
                        },
                        function(error) {
                            return (error.toString() === 'Error: #' + wheel.compiler.error.TYPE_ERROR_CAN_NOT_CALL_GLOBAL + ' Type error, can not call "g".');
                        }
                    );
                });
                it('Should throw TYPE_ERROR_UNKNOWN_PARAM_TYPE', function() {
                    assert.throws(
                        function() {
                            compilerTestUtils.compile([
                                'proc error(Wrong w)',
                                'endp',
                                'proc main()',
                                'endp'
                            ]);
                        },
                        function(error) {
                            return (error.toString() === 'Error: #' + wheel.compiler.error.TYPE_ERROR_UNKNOWN_PARAM_TYPE + ' Unknown type "Wrong".');
                        }
                    );
                });
            }
        );

        describe(
            'Undefined identifier',
            function() {
                it('Should throw UNDEFINED_IDENTIFIER', function() {
                    assert.throws(
                        function() {
                            compilerTestUtils.compile([
                                'proc main()',
                                '    set n, 1',
                                'endp'
                            ]);
                        },
                        function(error) {
                            return (error.toString() === 'Error: #' + wheel.compiler.error.UNDEFINED_IDENTIFIER + ' Undefined identifier "n".');
                        }
                    );
                });
            }
        );

        describe(
            'Duplicate identifier',
            function() {
                it('Should throw DUPLICATE_IDENTIFIER_LABEL', function() {
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
                            return (error.toString() === 'Error: #' + wheel.compiler.error.DUPLICATE_IDENTIFIER_LABEL + ' Duplicate label "label:".');
                        }
                    );
                });
                it('Should throw DUPLICATE_IDENTIFIER', function() {
                    assert.throws(
                        function() {
                            compilerTestUtils.compile([
                                'number a',
                                'number a'
                            ]);
                        },
                        function(error) {
                            return (error.toString() === 'Error: #' + wheel.compiler.error.DUPLICATE_IDENTIFIER + ' Duplicate identifier "a".');
                        }
                    );
                });
            }
        );

        describe(
            'Number expected',
            function() {
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
                            return (error.toString() === 'Error: #' + wheel.compiler.error.NUMBER_LOCAL_CONSTANT_EXPECTED + ' Number expected, found "\'x\'".');
                        }
                    );
                });
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
                            return (error.toString() === 'Error: #' + wheel.compiler.error.NUMBER_GLOBAL_CONSTANT_EXPECTED + ' Number expected, found "\'y\'".');
                        }
                    );
                });
            }
        );

        describe(
            'No main procedure',
            function() {
                it('Should throw NO_MAIN_PROCEDURE', function() {
                    assert.throws(
                        function() {
                            compilerTestUtils.compile([
                                'proc noMain()',
                                'endp'
                            ]);
                        },
                        function(error) {
                            return (error.toString() === 'Error: #' + wheel.compiler.error.NO_MAIN_PROCEDURE + ' No main procedure found.');
                        }
                    );
                });
            }
        );

        describe(
            'Unknown',
            function() {
                it('Should throw UNKNOWN_COMMAND', function() {
                    assert.throws(
                        function() {
                            compilerTestUtils.compile([
                                'wrong',
                            ]);
                        },
                        function(error) {
                            return (error.toString() === 'Error: #' + wheel.compiler.error.UNKNOWN_COMMAND + ' Unknown command "wrong".');
                        }
                    );
                });
                it('Should throw UNKNOWN_PROCEDURE', function() {
                    assert.throws(
                        function() {
                            compilerTestUtils.compile([
                                'proc main()',
                                '    wrong()',
                                'endp'
                            ]);
                        },
                        function(error) {
                            return (error.toString() === 'Error: #' + wheel.compiler.error.UNKNOWN_PROCEDURE + ' Unknown procedure "wrong".');
                        }
                    );
                });
            }
        );

        describe(
            'Undefined field',
            function() {
                it('Should throw UNDEFINED_FIELD', function() {
                    assert.throws(
                        function() {
                            compilerTestUtils.compile([
                                'struct S',
                                '   number n',
                                'ends',
                                'S s',
                                'proc main()',
                                '   set s.wrong, 1',
                                'endp'
                            ]);
                        },
                        function(error) {
                            return (error.toString() === 'Error: #' + wheel.compiler.error.UNDEFINED_FIELD + ' Undefined field "wrong".');
                        }
                    );
                });
            }
        );

        describe(
            'Invalid',
            function() {
                it('Should throw INVALID_CONSTANT', function() {
                    assert.throws(
                        function() {
                            compilerTestUtils.compile([
                                'proc p = 1',
                                'proc main()',
                                'endp'
                            ]);
                        },
                        function(error) {
                            return (error.toString() === 'Error: #' + wheel.compiler.error.INVALID_CONSTANT + ' Invalid constant value "1".');
                        }
                    );
                });
                it('Should throw INVALID_POINTER', function() {
                    assert.throws(
                        function() {
                            compilerTestUtils.compile([
                                'proc test(number n)',
                                'endp',
                                'proc main()',
                                '    number *x',
                                '    test(*x)',
                                'endp'
                            ]);
                        },
                        function(error) {
                            return (error.toString() === 'Error: #' + wheel.compiler.error.INVALID_POINTER + ' Invalid pointer "*x".');
                        }
                    );
                });
                it('Should throw INVALID_OPERATION_WITH_STRING', function() {
                    assert.throws(
                        function() {
                            compilerTestUtils.compile([
                                'proc main()',
                                    'number n',
                                    'mul n, "a"',
                                'endp'
                            ]);
                        },
                        function(error) {
                            return (error.toString() === 'Error: #' + wheel.compiler.error.INVALID_OPERATION_WITH_STRING + ' Invalid operation ""a"".');
                        }
                    );
                });
                it('Should throw INVALID_OPERATION', function() {
                    assert.throws(
                        function() {
                            compilerTestUtils.compile([
                                'proc main()',
                                    'number n',
                                    'number *pn',
                                    'mul n, &n',
                                'endp'
                            ]);
                        },
                        function(error) {
                            return (error.toString() === 'Error: #' + wheel.compiler.error.INVALID_OPERATION + ' Invalid operation "&n".');
                        }
                    );
                });
                it('Should throw INVALID_OPERATION', function() {
                    assert.throws(
                        function() {
                            compilerTestUtils.compile([
                                'proc main()',
                                '    number n',
                                '    number *pn',
                                '    add pn, &n',
                               'endp'
                            ]);
                        },
                        function(error) {
                            return (error.toString() === 'Error: #' + wheel.compiler.error.INVALID_OPERATION + ' Invalid operation "pn".');
                        }
                    );
                });
                it('Should throw INVALID_OPERATION_WITH_STRING', function() {
                    assert.throws(
                        function() {
                            compilerTestUtils.compile([
                                'proc main()',
                                    'string s',
                                    'number n',
                                    'mul s, n',
                                'endp'
                            ]);
                        },
                        function(error) {
                            return (error.toString() === 'Error: #' + wheel.compiler.error.INVALID_OPERATION_WITH_STRING + ' Invalid operation "s".');
                        }
                    );
                });
                it('Should throw INVALID_OPERATION_WITH_STRING', function() {
                    assert.throws(
                        function() {
                            compilerTestUtils.compile([
                                'proc main()',
                                '    string s1',
                                '    string s2',
                                '    sub s1, s2',
                                'endp'
                            ]);
                        },
                        function(error) {
                            return (error.toString() === 'Error: #' + wheel.compiler.error.INVALID_OPERATION_WITH_STRING + ' Invalid operation "s1".');
                        }
                    );
                });
            }
        );

        describe(
            'Unknown procedure',
            function() {
                it('Should throw INVALID_BLOCK_CLOSE', function() {
                    assert.throws(
                        function() {
                            compilerTestUtils.compile([
                                'struct S',
                                '   number n',
                                'endp',
                                'proc main()',
                                'endp'
                            ]);
                        },
                        function(error) {
                            return (error.toString() === 'Error: #' + wheel.compiler.error.INVALID_BLOCK_CLOSE + ' Invalid command "endp".');
                        }
                    );
                });
            }
        );
    }
);