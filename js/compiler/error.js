(function() {
    var wheel = require('../utils/base.js').wheel;

    wheel(
        'compiler.error',
        {
            SYNTAX_ERROR_INVALID_PROC_CHAR:    1,
            SYNTAX_ERROR_INVALID_PROC_PARAM:   2,
            SYNTAX_ERROR_INVALID_STRUCS_CHAR:  3,
            SYNTAX_ERROR_INVALID_CHAR:         4,
            SYNTAX_ERROR_ARRAY_CLOSE_EXPECTED: 5,
            STRING_EXPECTED_IN_CONSTANT:       6,
            STRING_EXPECTED_FOUND_NUMBER:      7,
            STRING_ARRAY_EXPECTED:             8,
            TYPE_MISMATCH:                     9,
            TYPE_ERROR_STRUCT_EXPECTED:        10,
            TYPE_ERROR_NUMBER_EXPECTED:        11,
            TYPE_ERROR_CAN_NOT_CALL_LOCAL:     12,
            TYPE_ERROR_CAN_NOT_CALL_GLOBAL:    13,
            TYPE_ERROR_UNKNOWN_PARAM_TYPE:     14,
            UNDEFINED_IDENTIFIER:              15,
            DUPLICATE_IDENTIFIER:              16,
            DUPLICATE_IDENTIFIER_LABEL:        17,
            NUMBER_LOCAL_CONSTANT_EXPECTED:    18,
            NUMBER_GLOBAL_CONSTANT_EXPECTED:   19,
            NO_MAIN_PROCEDURE:                 20,
            UNKNOWN_COMMAND:                   21,
            UNKNOWN_PROCEDURE:                 22,
            UNDEFINED_FIELD:                   23,
            INVALID_CONSTANT:                  24,
            INVALID_BLOCK_CLOSE:               25,
            INVALID_OPERATION:                 26,
            INVALID_OPERATION_WITH_STRING:     27
        }
    );
})();