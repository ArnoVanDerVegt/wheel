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
            SYNTAX_ERROR_PARAM_COUNT_MISMATCH: 6,
            SYNTAX_ERROR_PARAM_EXPECTED:       7,
            STRING_EXPECTED_IN_CONSTANT:       8,
            STRING_EXPECTED_FOUND_NUMBER:      9,
            STRING_ARRAY_EXPECTED:             10,
            TYPE_MISMATCH:                     11,
            TYPE_ERROR_NUMBER_EXPECTED:        12,
            TYPE_ERROR_ARRAY_EXPECTED:         13,
            TYPE_ERROR_STRUCT_EXPECTED:        14,
            TYPE_ERROR_CAN_NOT_CALL_LOCAL:     15,
            TYPE_ERROR_CAN_NOT_CALL_GLOBAL:    16,
            TYPE_ERROR_UNKNOWN_PARAM_TYPE:     17,
            UNDEFINED_IDENTIFIER:              18,
            DUPLICATE_IDENTIFIER:              19,
            DUPLICATE_IDENTIFIER_LABEL:        20,
            NUMBER_LOCAL_CONSTANT_EXPECTED:    21,
            NUMBER_GLOBAL_CONSTANT_EXPECTED:   22,
            NO_MAIN_PROCEDURE:                 23,
            UNKNOWN_COMMAND:                   24,
            UNKNOWN_PROCEDURE:                 25,
            UNDEFINED_FIELD:                   26,
            INVALID_ASM_COMMAND:               27,
            INVALID_SCRIPT_COMMAND:            28,
            INVALID_CONSTANT:                  29,
            INVALID_POINTER:                   30,
            INVALID_BLOCK_CLOSE:               31,
            INVALID_OPERATION:                 32,
            INVALID_OPERATION_WITH_STRING:     33,
            BREAK_WITHOUT_LOOP:                34
        }
    );
})();