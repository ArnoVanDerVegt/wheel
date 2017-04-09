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
            SYNTAX_ERROR_PARAM_EXPECTED:       6,
            STRING_EXPECTED_IN_CONSTANT:       7,
            STRING_EXPECTED_FOUND_NUMBER:      8,
            STRING_ARRAY_EXPECTED:             9,
            TYPE_MISMATCH:                     10,
            TYPE_ERROR_STRUCT_EXPECTED:        11,
            TYPE_ERROR_NUMBER_EXPECTED:        12,
            TYPE_ERROR_CAN_NOT_CALL_LOCAL:     13,
            TYPE_ERROR_CAN_NOT_CALL_GLOBAL:    14,
            TYPE_ERROR_UNKNOWN_PARAM_TYPE:     15,
            UNDEFINED_IDENTIFIER:              16,
            DUPLICATE_IDENTIFIER:              17,
            DUPLICATE_IDENTIFIER_LABEL:        18,
            NUMBER_LOCAL_CONSTANT_EXPECTED:    19,
            NUMBER_GLOBAL_CONSTANT_EXPECTED:   20,
            NO_MAIN_PROCEDURE:                 21,
            UNKNOWN_COMMAND:                   22,
            UNKNOWN_PROCEDURE:                 23,
            UNDEFINED_FIELD:                   24,
            INVALID_CONSTANT:                  25,
            INVALID_POINTER:                   26,
            INVALID_BLOCK_CLOSE:               27,
            INVALID_OPERATION:                 28,
            INVALID_OPERATION_WITH_STRING:     29
        }
    );
})();