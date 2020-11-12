/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const keywords  = require('./wheelSyntaxTokens').keywords;
const registers = require('./wheelSyntaxTokens').registers;
const types     = require('./wheelSyntaxTokens').types;
const sign      = require('./wheelSyntaxTokens').sign;
const meta      = require('./wheelSyntaxTokens').meta;
const proc      = require('./wheelSyntaxTokens').proc;
const defines   = require('./wheelSyntaxTokens').defines;

class SyntaxLineOutputHTML {
    constructor(opts) {
        this._syntaxOtutput = opts.syntaxOtutput;
        this._defines       = opts.defines;
        this._records       = opts.records;
        this._output        = '';
        this._word          = '';
        this._comment       = '';
    }

    grabNextWord(line, i) {
        let j = i;
        while ((j < line.length) && (line[j] === ' ')) {
            j++;
        }
        while ((j < line.length) && (line[j] !== ' ')) {
            j++;
        }
        return line.substr(i, j - i).trim();
    };

    addWord(line, i, w) {
        w = w || this._word;
        if (isNaN(w)) {
            if (registers.indexOf(w) !== -1) {
                this._output += '<span class="register">' + w + '</span>';
            } else if (proc.indexOf(w) !== -1) {
                this._output += '<span class="proc">' + w + '</span>';
            } else if ((this._defines.indexOf(w) !== -1) || (defines.indexOf(w) !== -1)) {
                this._output += '<span class="define">' + w + '</span>';
            } else if (this._records.indexOf(w) !== -1) {
                this._output += '<span class="record">' + w + '</span>';
            } else if (keywords.indexOf(w) !== -1) {
                if ((w === 'record') || (w === 'object')) {
                    let nextWord = this.grabNextWord(line, i);
                    (nextWord === '') || this._records.push(nextWord);
                }
                this._output += '<span class="keyword">' + w + '</span>';
            } else if (sign.indexOf(w) !== -1) {
                this._output += '<span class="operator">' + w + '</span>';
            } else if (types.indexOf(w) !== -1) {
                this._output += '<span class="type">' + w + '</span>';
            } else if (meta.indexOf(w) !== -1) {
                if (w === '#define') {
                    let nextWord = this.grabNextWord(line, i);
                    (nextWord === '') || this._defines.push(nextWord);
                }
                this._output += '<span class="meta">' + w + '</span>';
            } else {
                this._output += '<span class="variable">' + w + '</span>';
            }
        } else {
            this._output += '<span class="number">' + w + '</span>';
        }
        this._word = '';
    }

    getWord() {
        return this._word;
    }

    addToWord(c) {
        this._word += c;
    }

    getOutput() {
        return this._output;
    }

    addToOutput(output) {
        this._output += output;
    }

    addString(s) {
        this._output += '<span class="string">' + s + '</span>';
    }

    addComment() {
        if (this._comment !== '') {
            this._output += '<span class="comment">' + this._comment + '</span>';
        }
    }

    addSpace() {
        this._output += ' ';
    }

    setComment(comment) {
        this._comment = comment;
    }

    finishLine() {
        this._syntaxOtutput.addOutput(this._output);
    }
}

exports.SyntaxOutputHTML = class {
    constructor() {
        this._output = '';
    }

    getLineOutput(opts) {
        return new SyntaxLineOutputHTML(opts);
    }

    getOutput() {
        return this._output;
    }

    addOutput(output) {
        this._output += output + '\n';
    }
};
