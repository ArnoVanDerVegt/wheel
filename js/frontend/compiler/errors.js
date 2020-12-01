/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
exports.errors = {
    FILE_NOT_FOUND:                           1,
    FILENAME_EXPECTED:                        2,
    RGF_EXTENSION_EXPECTED:                   3,
    DATA_EXPECTED:                            4,
    DATA_STRING_EXPECTED:                     5,
    DATA_STRING_EMPTY:                        6,
    DATA_STRING_INVALID_CHARACTER:            7,
    DATA_STRING_LENGTH_MISMATCH:              8,
    RTF_EXTENSION_EXPECTED:                   9,
    LINE_EXPECTED:                           10,
    LINE_STRING_EXPECTED:                    11,
    UNDEFINED_META_COMMAND:                  12,
    ON_OR_OFF_EXPECTED:                      13,
    NUMBER_FLOAT_OR_INT_EXPECTED:            14,
    SYNTAX_ERROR:                            15,
    SYNTAX_ERROR_DOT_EXPECTED:               16,
    SYNTAX_ERROR_BRACKET_OPEN_EXPECTED:      17,
    SYNTAX_ERROR_BRACKET_CLOSE_EXPECTED:     18,
    SYNTAX_ERROR_NUMBER_CONSTANT_EXPECTED:   19,
    SYNTAX_ERROR_STRING_CONSTANT_EXPECTED:   20,
    SYNTAX_ERROR_MAIN_PROC_PARAMS:           21,
    UNDEFINED_IDENTIFIER:                    22,
    UNDEFINED_FIELD:                         23,
    UNEXPECTED_END_OF_FILE:                  24,
    UNEXPECTED_CODE_AFTER_META:              25,
    DUPLICATE_IDENTIFIER:                    26,
    TYPE_MISMATCH:                           27,
    RECORD_TYPE_EXPECTED:                    28,
    UNION_SIZE_MISMATCH:                     29,
    ARRAY_TYPE_EXPECTED:                     30,
    ARRAY_SIZE_MISMATCH:                     31,
    ARRAY_INDEX_OUT_OF_RANGE:                32,
    STRING_CONSTANT_EXPECTED:                33,
    NUMBER_OR_STRING_CONSTANT_EXPECTED:      34,
    NUMBER_CONSTANT_EXPECTED:                35,
    NUMBER_TYPE_EXPECTED:                    36,
    POINTER_TYPE_EXPECTED:                   37,
    IDENTIFIER_EXPECTED:                     38,
    BREAK_WITHOUT_LOOP:                      39,
    MISSING_MAIN_PROC:                       40,
    MAIN_PROC_ALREADY_DEFINED:               41,
    NO_LOCAL_PROC_SUPPORTED:                 42,
    PARAM_COUNT_MISMATCH:                    43,
    PARAM_TYPE_MISMATCH:                     44,
    ITEM_COUNT_MISMATCH:                     45,
    INVALID_CONSTANT:                        46,
    INVALID_ARRAY_SIZE:                      47,
    INVALID_ARRAY_INDEX:                     48,
    INVALID_OPERATION:                       49,
    INVALID_STATEMENT_IN_SCOPE:              50,
    INVALID_CONSTANT_IN_SCOPE:               51,
    INVALID_RESOURCE:                        52,
    INVALID_STRING_LENGTH:                   53,
    INVALID_STRING_COUNT:                    54,
    DEFAULT_ALREADY_DEFINED:                 55,
    DEFAULT_LAST_EXPECTED:                   56,
    DUPLICATE_RESOURCE:                      57,
    OBJECT_TYPE_EXPECTED:                    58,
    PROC_DOES_NOT_MATCH_SUPER_PROC:          59,
    NO_SUPER_PROC_FOUND:                     60,
    RECORD_OR_OBJECT_TYPE_EXPECTED:          61
};

exports.createError = function(num, token, message) {
    let error = new Error('#' + num + ' ' + message.split('~').join('.'));
    error.num   = num;
    error.token = token;
    return error;
};
