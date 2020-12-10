/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
exports.keywords = [
        'namespace',
        'proc',
        'for',
        'repeat',
        'while',
        'break',
        'to',
        'downto',
        'step',
        'end',
        'add',
        'adds',
        'sub',
        'mul',
        'div',
        'inc',
        'dec',
        'ret',
        'set',
        'sets',
        'mod',
        'addr',
        'ret',
        'jmp',
        'if',
        'not',
        'select',
        'case',
        'default',
        'cmp',
        'jmpc',
        'copy',
        'else',
        'elseif',
        'record',
        'object',
        'self',
        'union',
        'or',
        'and',
        'call',
        'with',
        'as'
    ];

exports.registers = [
        'stack',
        'src',
        'dest',
        'code',
        'ptr',
        'REG_STACK',
        'REG_SRC',
        'REG_DEST',
        'REG_CODE',
        'REG_RET',
        'REG_FLAGS'
    ];

exports.types = [
        'number',
        'string',
        'record',
        'object'
    ];

exports.sign = [
        '!',
        '=',
        '(',
        ')',
        ',',
        '+',
        '-',
        '*',
        '/',
        '%',
        '[',
        '|',
        ']',
        '{',
        '}',
        ':',
        '@',
        '^',
        '.'
    ];

exports.meta = [
        'format',
        'noformat',
        '#project',
        '#define',
        '#include',
        '#heap',
        '#datatype',
        '#optimizer',
        '#rangecheck',
        '#image',
        '#break',
        '#data',
        '#display',
        '#resource',
        '#text',
        '#line',
        '#stringlength',
        '#stringcount'
    ];

exports.proc = [
        // Screen...
        'setFill',
        'setFillColor',
        'setTextSize',
        'drawLine',
        'drawRect',
        'drawCircle',
        'drawPixel',
        'drawNumber',
        'drawText',
        // Standard...
        'clearConsole',
        'numToStr',
        'sleep',
        'stopProgram',
        'stopVM',
        'resetTime',
        'getTime',
        'halt',
        'printS',
        'printN',
        // Button...
        'button',
        // File...
        'fileOpen',
        'fileClose',
        'fileDelete',
        'fileReadNumber',
        'fileReadString',
        'fileWriteNumber',
        'fileWriteString',
        // Light...
        'light',
        // Math...
        'neg',
        'abs',
        'sin',
        'cos',
        'random',
        'ceil',
        'floor',
        'round'
    ];

exports.defines = [
        // Screen...
        'BLACK',
        'WHITE',
        // Standard...
        'TRUE',
        'FALSE',
        // Light...
        'LIGHT_OFF',
        'LIGHT_RED',
        'LIGHT_GREEN',
        'LIGHT_ORANGE',
        'LIGHT_FLASH_ON',
        'LIGHT_FLASH_OFF'
    ];
