/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const SyntaxOutputSVG  = require('./SyntaxOutputSVG').SyntaxOutputSVG;
const SyntaxOutputHTML = require('./SyntaxOutputHTML').SyntaxOutputHTML;

exports.WheelSyntax = class {
    constructor(type) {
        this._defines       = [];
        this._records       = [];
        this._output        = '';
        this._syntaxOtutput = (type === 'svg') ? (new SyntaxOutputSVG()) : (new SyntaxOutputHTML());
    }

    getLineOutput() {
        return this._syntaxOtutput.getLineOutput({
            syntaxOtutput: this._syntaxOtutput,
            defines:       this._defines,
            records:       this._records
        });
    }

    parseLine(line) {
        let lineOutput = this.getLineOutput();
        let i          = line.indexOf(';');
        if (i !== -1) {
            lineOutput.setComment(line.substr(i - line.length));
            line = line.substr(0, i);
        }
        i = 0;
        while (i < line.length) {
            let c = line[i];
            switch (c) {
                case ' ':
                    (lineOutput.getWord() === '') || lineOutput.addWord(line, i, lineOutput.getWord());
                    lineOutput.addSpace();
                    break;
                case '"':
                    let s = c;
                    i++;
                    while ((i < line.length) && (line[i] !== '"')) {
                        s += line[i++];
                    }
                    s += c;
                    lineOutput.addString(s);
                    break;
                case '^':
                case '@':
                case ',':
                case '=':
                case '(':
                case ')':
                case '[':
                case ']':
                case '{':
                case '}':
                case ':':
                case '+':
                case '-':
                case '*':
                case '/':
                case '%':
                case '|':
                    (lineOutput.getWord() === '') || lineOutput.addWord(line, i, lineOutput.getWord());
                    lineOutput.addWord(line, i, c);
                    break;
                default:
                    lineOutput.addToWord(c);
                    break;
            }
            i++;
        }
        (lineOutput.getWord() === '') || lineOutput.addWord(line, i, lineOutput.getWord());
        lineOutput.addComment();
        lineOutput.finishLine();
    }

    addEmptyLine() {
        let lineOutput = this.getLineOutput();
        lineOutput.finishLine();
    }

    parseLines(lines) {
        while (lines.length && (lines[lines.length - 1].trim() === '')) {
            lines.pop();
        }
        lines.forEach((line, index) => {
            if (!((index === lines.length - 1) && (line.trim() === ''))) {
                this.parseLine(line);
            } else {
                this.addEmptyLine();
            }
        });
        return this._syntaxOtutput.getOutput();
    }
};
