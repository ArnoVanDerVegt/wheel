/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
exports.T_NUM_C             =  0; // Constant
exports.T_NUM_G             =  1; // Global
exports.T_NUM_L             =  2; // Local
exports.T_NUM_P             =  3; // Pointer

exports.CMD_CALL            =  0;
exports.CMD_RET             =  1;
exports.CMD_COPY            =  2;
exports.CMD_JMPC            =  3;
exports.CMD_MOD             =  4;
exports.CMD_SET             =  5;
exports.CMD_ADD             =  6;
exports.CMD_SUB             =  7;
exports.CMD_MUL             =  8;
exports.CMD_DIV             =  9;
exports.CMD_AND             = 10;
exports.CMD_OR              = 11;
exports.CMD_CMP             = 12;
exports.CMD_SETF            = 13;
exports.CMD_SETS            = 14;
exports.CMD_ADDS            = 15;

exports.CMD_TO_STR = [
    'call',
    'ret',
    'copy',
    'jmpc',
    'mod',
    'set',
    'add',
    'sub',
    'mul',
    'div',
    'and',
    'or',
    'cmp',
    'setf',
    'sets',
    'adds'
];

exports.REG_STACK           =  0;
exports.REG_SRC             =  1;
exports.REG_DEST            =  2;
exports.REG_PTR             =  3;
exports.REG_CODE            =  4;
exports.REG_RET             =  5;
exports.REG_FLAGS           =  6;
exports.REG_RANGE0          =  7;
exports.REG_RANGE1          =  8;

exports.FLAG_EQUAL          =  1;
exports.FLAG_NOT_EQUAL      =  2;
exports.FLAG_LESS           =  4;
exports.FLAG_LESS_EQUAL     =  8;
exports.FLAG_GREATER        = 16;
exports.FLAG_GREATER_EQUAL  = 32;

exports.REG_TO_STR = [
    'stack',
    'src',
    'dest',
    'ptr',
    'code',
    'return',
    'flags',
    'range1',
    'range2'
];

exports.FLAG_TO_STR = {
     1: 'eq',
     2: 'neq',
     4: 'l',
     8: 'le',
    16: 'g',
    32: 'ge'
};
