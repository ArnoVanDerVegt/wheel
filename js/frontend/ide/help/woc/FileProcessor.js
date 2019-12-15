/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
let id = 0;

exports.FileProcessor = class {
    constructor(help, filename, lines) {
        this._help     = help;
        this._filename = filename;
        this._index    = 0;
        this._lines    = lines;
        this._sections = [];
    }

    addKeyword(keyword, value) {
        keyword = this.getCleanName(keyword.trim());
        if (!keyword.length) {
            return;
        }
        if (!(keyword in this._help.keywords)) {
            this._help.keywords[keyword] = [];
        }
        if (this._help.keywords[keyword].indexOf(value.id) === -1) {
            this._help.keywords[keyword].push(value.id);
        }
    }

    addTypedText(section, type, text) {
        section.content.push({type: type, text: text});
    }

    addSection(section) {
        if (section.content.length && (section.title !== '')) {
            this._sections.push(section);
            this.addKeyword(section.title, section);
        }
        return this;
    }

    getCleanName(s) {
        let valid  = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_';
        let result = '';
        for (let i = 0; i < s.length; i++) {
            if (valid.indexOf(s[i]) !== -1) {
                result += s[i];
            }
        }
        return result.toLowerCase();
    }

    getNextId() {
        return id++;
    }

    getItalicWords(line) {
        let s    = '';
        let i    = 0;
        let open = false;
        while (i < line.length) {
            if (line[i] === '`') {
                if (open) {
                    open = false;
                    s += '</i>';
                } else {
                    open = true;
                    s += '<i>';
                }
            } else {
                s += line[i];
            }
            i++;
        }
        return s;
    }

    readLine(trim) {
        let line = this._lines[this._index++] || '';
        return trim ? line.trim() : line;
    }

    peekLine(trim) {
        let line = this._lines[this._index] || '';
        return trim ? line.trim() : line;
    }
};
