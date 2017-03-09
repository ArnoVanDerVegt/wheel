var assert = require('assert');

var wheel             = require('../utils/base.js').wheel;
var compilerTestUtils = require('./compilerTestUtils.js');

describe(
    'Test error',
    function() {
        describe(
            'Unknown identifier',
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
                        Error,
                        'Undefined identifier "n".'
                    );
                });
            }
        );

        describe(
            'Type mismatch',
            function () {
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
                        Error,
                        'Undefined identifier "n".'
                    );
                });
            }
        );
    }
);