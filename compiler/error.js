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
            UNDEFINED_IDENTIFIER_IN_TYPEOF:    16,
            DUPLICATE_IDENTIFIER:              17,
            DUPLICATE_IDENTIFIER_LABEL:        18,
            NUMBER_LOCAL_CONSTANT_EXPECTED:    19,
            NUMBER_GLOBAL_CONSTANT_EXPECTED:   20,
            NO_MAIN_PROCEDURE:                 21,
            UNKNOWN_COMMAND:                   22,
            UNKNOWN_PROCEDURE:                 23,
            UNDEFINED_FIELD:                   24,
            INVALID_CONSTANT:                  25,
            INVALID_BLOCK_CLOSE:               26,
            INVALID_OPERATION:                 27,
            INVALID_OPERATION_WITH_STRING:     28
        }
    );
})();