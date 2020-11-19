/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/

exports.SyntaxLineOutput = class {
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

    setComment(comment) {
        this._comment = comment;
    }
};

exports.SyntaxOutput = class {
    constructor() {
        this.clear();
    }

    clear() {
        this._output = '';
    }

    getOutput() {
        return this._output;
    }

    addOutput(output) {
        this._output += output + '\n';
    }
};
