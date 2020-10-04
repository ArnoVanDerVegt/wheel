/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const testError = require('../../utils').testError;
const errors    = require('../../../js/frontend/compiler/errors').errors;

describe(
    'Test namespace error',
    () => {
        testError(
            it,
            'Should throw UNDEFINED_IDENTIFIER',
            [
                'namespace test',
                'proc myProc()',
                'end',
                'proc main()',
                '    test.myProcWrong()',
                'end'
            ],
            'Error: #' + errors.UNDEFINED_IDENTIFIER + ' Undefined identifier "test.myProcWrong".'
        );
        testError(
            it,
            'Should throw UNDEFINED_IDENTIFIER',
            [
                'namespace test',
                'record Point',
                '   number x, y',
                'end',
                'proc main()',
                '    test.Point1 p',
                'end'
            ],
            'Error: #' + errors.UNDEFINED_IDENTIFIER + ' Undefined identifier "test.Point1".'
        );
    }
);
