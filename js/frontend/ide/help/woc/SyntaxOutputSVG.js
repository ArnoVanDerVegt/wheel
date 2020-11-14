/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const keywords  = require('./wheelSyntaxTokens').keywords;
const registers = require('./wheelSyntaxTokens').registers;
const types     = require('./wheelSyntaxTokens').types;
const sign      = require('./wheelSyntaxTokens').sign;
const meta      = require('./wheelSyntaxTokens').meta;
const proc      = require('./wheelSyntaxTokens').proc;
const defines   = require('./wheelSyntaxTokens').defines;

const CHAR_WIDTH  = 8.4;
const LINE_HEIGHT = 22;

class SyntaxLineOutputSVG {
    constructor(opts) {
        this._syntaxOtutput = opts.syntaxOtutput;
        this._defines       = opts.defines;
        this._records       = opts.records;
        this._output        = '';
        this._line          = '';
        this._word          = '';
        this._comment       = '';
        this._x             = 16;
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
    }

    addOutputText(className, text) {
        let s = text.split('"').join('&#34;');
        let y = this._syntaxOtutput.getY();
        this._output += '<text x="' + this._x + '" y="' + y + '" class="' + className + '">' + s + '</text>\n';
        this._line   += text;
        this._x += text.length * CHAR_WIDTH;
    }

    addWord(line, i, w) {
        w = w || this._word;
        if (isNaN(w)) {
            if (registers.indexOf(w) !== -1) {
                this.addOutputText('register', w);
            } else if (proc.indexOf(w) !== -1) {
                this.addOutputText('proc', w);
            } else if ((this._defines.indexOf(w) !== -1) || (defines.indexOf(w) !== -1)) {
                this.addOutputText('define', w);
            } else if (this._records.indexOf(w) !== -1) {
                this.addOutputText('record', w);
            } else if (keywords.indexOf(w) !== -1) {
                if ((w === 'record') || (w === 'object')) {
                    let nextWord = this.grabNextWord(line, i);
                    (nextWord === '') || this._records.push(nextWord);
                }
                this.addOutputText('keyword', w);
            } else if (sign.indexOf(w) !== -1) {
                this.addOutputText('operator', w);
            } else if (types.indexOf(w) !== -1) {
                this.addOutputText('type', w);
            } else if (meta.indexOf(w) !== -1) {
                if (w === '#define') {
                    let nextWord = this.grabNextWord(line, i);
                    (nextWord === '') || this._defines.push(nextWord);
                }
                this.addOutputText('meta', w);
            } else {
                this.addOutputText('variable', w);
            }
        } else {
            this.addOutputText('number', w);
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
        this._line += s;
        this.addOutputText('string', s);
    }

    addComment() {
        if (this._comment !== '') {
            let x     = this._x - 10;
            let y     = this._syntaxOtutput.getY() - 14;
            let width = this._comment.length * CHAR_WIDTH + 20;
            this._output += '<rect x="' + x + '" y="' + y + '" width="' + width + '" height="' + 20 + '" rx="10" style="fill:#F0F0F0;" />\n';
            this.addOutputText('comment', this._comment);
            this._comment = '';
        }
    }

    addSpace() {
        this._x += CHAR_WIDTH;
        this._line += ' ';
    }

    setComment(comment) {
        this._comment = comment;
    }

    finishLine() {
        this._syntaxOtutput.addOutput(this._output, this._line);
    }
}

exports.SyntaxOutputSVG = class {
    constructor() {
        this.clear();
    }

    clear() {
        this._output   = '';
        this._y        = LINE_HEIGHT;
        this._maxWidth = 0;
    }

    getLineOutput(opts) {
        return new SyntaxLineOutputSVG(opts);
    }

    getOutput() {
        let width  = Math.max(this._maxWidth + 32, 480);
        let height = this._y - 10;
        return '<svg ' +
                'viewBox="0 0 ' + width + ' ' + height + '" ' +
                'width="' + width + '" ' +
                'height="' + height + '" ' +
                'xmlns="http://www.w3.org/2000/svg">' +
            '<style>\n' +
            '.register { font: 14px Monospace; fill: #9B59B6; }\n' +
            '.proc { font: italic 14px Monospace; fill: #0097E6; }\n' +
            '.define { font: bold 14px Monospace; fill: #C0392B; }\n' +
            '.record { font: italic 14px Monospace; fill: #4CD137; }\n' +
            '.keyword { font: bold 14px Monospace; fill: #E67E22; }\n' +
            '.operator { font: 14px Monospace; fill: #383838; }\n' +
            '.type { font: bold 14px Monospace; fill: #9B59B6; }\n' +
            '.meta { font: italic 14px Monospace; fill: #C0392B; }\n' +
            '.variable { font: 14px Monospace; fill: #0097E6;}\n' +
            '.number { font: 14px Monospace; fill: #1ABC9C; }\n' +
            '.string { font: italic 14px Monospace; fill: #5758BB; }\n' +
            '.comment { font: 14px Monospace; fill: #383838; }\n' +
            '</style>' +
            '<rect x="0" y="0" r2="2" ry="2" width="' + width + '" height="' + height + '" style="fill:#FAFBFC;stroke:#CAD5E0;"/>' +
            this._output +
        '</svg>';
    }

    addOutput(output, line) {
        this._output += output;
        this._y      += LINE_HEIGHT;
        this._maxWidth = Math.max(this._maxWidth, line.length * CHAR_WIDTH);
    }

    getY() {
        return this._y;
    }
};
