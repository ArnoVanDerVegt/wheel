var assert = require('assert');

var wheel             = require('../utils/base.js').wheel;
var compilerTestUtils = require('./compilerTestUtils.js');

describe(
    'Test error',
    function() {
        describe(
            'Syntax error',
            function() {
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
                it('Should throw parameter error', function() {
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
                            return (error.toString() === 'Error: #4 Syntax error in procedure parameter "wrong".');
                        }
                    );
                });
            }
        );


        describe(
            'String expected error',
            function() {
                it('Should throw string expected error', function() {
                    assert.throws(
                        function() {
                            compilerTestUtils.compile([
                                'proc main()',
                                '    string s = 1',
                                'endp'
                            ]);
                        },
                        function(error) {
                            return (error.toString() === 'Error: #5 String expected, found "1".');
                        }
                    );
                });
                it('Should throw string expected error', function() {
                    assert.throws(
                        function() {
                            compilerTestUtils.compile([
                                'string s = 1',
                                'proc main()',
                                'endp'
                            ]);
                        },
                        function(error) {
                            return (error.toString() === 'Error: #6 String expected, found "1".');
                        }
                    );
                });
                it('Should throw string array expected error', function() {
                    assert.throws(
                        function() {
                            compilerTestUtils.compile([
                                'string s[2] = 1',
                                'proc main()',
                                'endp'
                            ]);
                        },
                        function(error) {
                            return (error.toString() === 'Error: #7 String array expected, found "1".');
                        }
                    );
                });
            }
        );

        describe(
            'Type error',
            function() {
                it('Should throw type error', function() {
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
                            return (error.toString() === 'Error: #8 Type error.');
                        }
                    );
                });
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
                            return (error.toString() === 'Error: #9 Type mismatch "1".');
                        }
                    );
                });
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
                            return (error.toString() === 'Error: #10 Number expected, found " \'x\'".');
                        }
                    );
                });
                it('Should throw type error', function() {
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
                            return (error.toString() === 'Error: #11 Type error, can not call "l".');
                        }
                    );
                });
                it('Should throw type error', function() {
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
                            return (error.toString() === 'Error: #12 Type error, can not call "g".');
                        }
                    );
                });
                it('Should throw unknown type', function() {
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
                            return (error.toString() === 'Error: #13 Unknown type "Wrong".');
                        }
                    );
                });
            }
        );

        describe(
            'Undefined identifier',
            function () {
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
                            return (error.toString() === 'Error: #14 Undefined identifier "n".');
                        }
                    );
                });
                it('Should throw undefined identifier', function() {
                    assert.throws(
                        function() {
                            compilerTestUtils.compile([
                                '@typeof(s)',
                                'proc main()',
                                'endp'
                            ]);
                        },
                        function(error) {
                            return (error.toString() === 'Error: #15 Undefined identifier "s".');
                        }
                    );
                });
            }
        );

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
                            return (error.toString() === 'Error: #16 Duplicate label "label:".');
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
                            return (error.toString() === 'Error: #17 Number expected, found "\'x\'".');
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
                            return (error.toString() === 'Error: #18 Number expected, found "\'y\'".');
                        }
                    );
                });
            }
        );

        describe(
            'No main procedure',
            function() {
                it('Should throw (local) number expected', function() {
                    assert.throws(
                        function() {
                            compilerTestUtils.compile([
                                'proc noMain()',
                                'endp'
                            ]);
                        },
                        function(error) {
                            return (error.toString() === 'Error: #19 No main procedure found.');
                        }
                    );
                });
            }
        );

        describe(
            'Unknown command',
            function() {
                it('Should throw (local) number expected', function() {
                    assert.throws(
                        function() {
                            compilerTestUtils.compile([
                                'wrong',
                            ]);
                        },
                        function(error) {
                            return (error.toString() === 'Error: #20 Unknown command "wrong".');
                        }
                    );
                });
            }
        );

        describe(
            'Unknown command',
            function() {
                it('Should throw (local) number expected', function() {
                    assert.throws(
                        function() {
                            compilerTestUtils.compile([
                                'number a[1)',
                            ]);
                        },
                        function(error) {
                            return (error.toString() === 'Error: #21 "]" expected.');
                        }
                    );
                });
            }
        );

        describe(
            'Unknown command',
            function() {
                it('Should throw undefined field', function() {
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
                            return (error.toString() === 'Error: #22 Undefined field "wrong".');
                        }
                    );
                });
            }
        );    }
);