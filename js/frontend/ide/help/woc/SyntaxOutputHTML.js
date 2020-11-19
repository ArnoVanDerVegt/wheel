/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const keywords     = require('./wheelSyntaxTokens').keywords;
const registers    = require('./wheelSyntaxTokens').registers;
const types        = require('./wheelSyntaxTokens').types;
const sign         = require('./wheelSyntaxTokens').sign;
const meta         = require('./wheelSyntaxTokens').meta;
const proc         = require('./wheelSyntaxTokens').proc;
const defines      = require('./wheelSyntaxTokens').defines;
const SyntaxOutput = require('./SyntaxOutput');

class SyntaxLineOutputHTML extends SyntaxOutput.SyntaxLineOutput {
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

    finishLine() {
        this._syntaxOtutput.addOutput(this._output);
    }
}

exports.SyntaxOutputHTML = class extends SyntaxOutput.SyntaxOutput {
    getLineOutput(opts) {
        return new SyntaxLineOutputHTML(opts);
    }
};
