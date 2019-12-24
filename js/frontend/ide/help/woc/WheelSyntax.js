/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const keywords = [
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
        'struct',
        'or',
        'and',
        'call'
    ];

const registers = [
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

const types = [
        'number',
        'string',
        'record'
    ];

const sign = [
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

const meta = [
        '#project',
        '#define',
        '#include',
        '#heap',
        '#optimizer',
        '#rangecheck',
        '#image',
        '#break',
        '#data',
        '#heap',
        '#display',
        '#resource',
        '#text',
        '#line',
        '#stringlength',
        '#stringcount'
    ];

const proc = [
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

const defines = [
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

exports.WheelSyntax = class {
    constructor() {
        this._defines = [];
        this._records = [];
    }

    parseLine(line) {
        let result  = '';
        let word    = '';
        let comment = '';
        let i       = line.indexOf(';');
        if (i !== -1) {
            comment = line.substr(i - line.length);
            line    = line.substr(0, i);
        }
        i = 0;
        let addWord = (function(w) {
                w = w || word;
                let grabNextWord = function() {
                        let j = i;
                        while ((j < line.length) && (line[j] === ' ')) {
                            j++;
                        }
                        while ((j < line.length) && (line[j] !== ' ')) {
                            j++;
                        }
                        return line.substr(i, j - i).trim();
                    };
                if (isNaN(w)) {
                    if (registers.indexOf(w) !== -1) {
                        result += '<span class="register">' + w + '</span>';
                    } else if (proc.indexOf(w) !== -1) {
                        result += '<span class="proc">' + w + '</span>';
                    } else if ((this._defines.indexOf(w) !== -1) || (defines.indexOf(w) !== -1)) {
                        result += '<span class="define">' + w + '</span>';
                    } else if (this._records.indexOf(w) !== -1) {
                        result += '<span class="record">' + w + '</span>';
                    } else if (keywords.indexOf(w) !== -1) {
                        if (w === 'record') {
                            let nextWord = grabNextWord();
                            (nextWord === '') || this._records.push(nextWord);
                        }
                        result += '<span class="keyword">' + w + '</span>';
                    } else if (sign.indexOf(w) !== -1) {
                        result += '<span class="operator">' + w + '</span>';
                    } else if (types.indexOf(w) !== -1) {
                        result += '<span class="type">' + w + '</span>';
                    } else if (meta.indexOf(w) !== -1) {
                        if (w === '#define') {
                            let nextWord = grabNextWord();
                            (nextWord === '') || this._defines.push(nextWord);
                        }
                        result += '<span class="meta">' + w + '</span>';
                    } else {
                        result += '<span class="variable">' + w + '</span>';
                    }
                } else {
                    result += '<span class="number">' + w + '</span>';
                }
                word = '';
            }).bind(this);
        while (i < line.length) {
            let c = line[i];
            switch (c) {
                case ' ':
                    (word === '') || addWord(word);
                    result += ' ';
                    break;
                case '"':
                    let s = c;
                    i++;
                    while ((i < line.length) && (line[i] !== '"')) {
                        s += line[i++];
                    }
                    s += c;
                    result += '<span class="string">' + s + '</span>';
                    break;
                case '^':
                case '@':
                case ',':
                case '=':
                case '(':
                case ')':
                case '[':
                case ']':
                case ':':
                case '+':
                case '-':
                case '*':
                case '/':
                case '%':
                    (word === '') || addWord(word);
                    addWord(c);
                    break;
                default:
                    word += c;
                    break;
            }
            i++;
        }
        (word === '') || addWord(word);
        if (comment !== '') {
            result += '<span class="comment">' + comment + '</span>';
        }
        return result;
    }

    parseLines(lines) {
        let result = '';
        while (lines.length && (lines[lines.length - 1].trim() === '')) {
            lines.pop();
        }
        lines.forEach(
            function(line, index) {
                if (!((index === lines.length - 1) && (line.trim() === ''))) {
                    result += this.parseLine(line) + '\n';
                } else {
                    result += '\n';
                }
            },
            this
        );
        return result;
    }
};
