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
    SYNTAX_ERROR:                            14,
    SYNTAX_ERROR_DOT_EXPECTED:               15,
    SYNTAX_ERROR_BRACKET_OPEN_EXPECTED:      16,
    SYNTAX_ERROR_BRACKET_CLOSE_EXPECTED:     17,
    SYNTAX_ERROR_NUMBER_CONSTANT_EXPECTED:   18,
    SYNTAX_ERROR_STRING_CONSTANT_EXPECTED:   19,
    SYNTAX_ERROR_MAIN_PROC_PARAMS:           20,
    UNDEFINED_IDENTIFIER:                    21,
    UNDEFINED_FIELD:                         22,
    UNEXPECTED_END_OF_FILE:                  23,
    UNEXPECTED_CODE_AFTER_META:              24,
    DUPLICATE_IDENTIFIER:                    25,
    TYPE_MISMATCH:                           26,
    RECORD_TYPE_EXPECTED:                    27,
    ARRAY_TYPE_EXPECTED:                     28,
    ARRAY_SIZE_MISMATCH:                     29,
    ARRAY_INDEX_OUT_OF_RANGE:                30,
    STRING_CONSTANT_EXPECTED:                31,
    NUMBER_OR_STRING_CONSTANT_EXPECTED:      32,
    NUMBER_CONSTANT_EXPECTED:                33,
    NUMBER_TYPE_EXPECTED:                    34,
    POINTER_TYPE_EXPECTED:                   35,
    IDENTIFIER_EXPECTED:                     36,
    BREAK_WITHOUT_LOOP:                      37,
    MISSING_MAIN_PROC:                       38,
    MAIN_PROC_ALREADY_DEFINED:               39,
    NO_LOCAL_PROC_SUPPORTED:                 40,
    PARAM_COUNT_MISMATCH:                    41,
    PARAM_TYPE_MISMATCH:                     42,
    ITEM_COUNT_MISMATCH:                     43,
    INVALID_CONSTANT:                        44,
    INVALID_ARRAY_SIZE:                      45,
    INVALID_ARRAY_INDEX:                     46,
    INVALID_OPERATION:                       47,
    INVALID_STATEMENT_IN_SCOPE:              48,
    INVALID_CONSTANT_IN_SCOPE:               49,
    INVALID_RESOURCE:                        50,
    INVALID_STRING_LENGTH:                   51,
    INVALID_STRING_COUNT:                    52,
    DEFAULT_ALREADY_DEFINED:                 53,
    DEFAULT_LAST_EXPECTED:                   54,
    DUPLICATE_RESOURCE:                      55
};

exports.createError = function(num, token, message) {
    let error = new Error('#' + num + ' ' + message);
    error.num   = num;
    error.token = token;
    return error;
};
