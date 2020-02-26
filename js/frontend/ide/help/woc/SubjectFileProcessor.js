/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const FileProcessor = require('./FileProcessor').FileProcessor;

exports.SubjectFileProcessor = class extends FileProcessor {
    addText(section, text) {
        while (text.length && (text[0].trim() === '')) {
            text.shift();
        }
        while (text.length && (text[text.length - 1].trim() === '')) {
            text.pop();
        }
        if (!text.length) {
            return this;
        }
        let lines = [];
        for (let i = 0; i < text.length; i++) {
            lines.push(this.getItalicWords(text[i]));
        }
        section.content.push({
            type: 'text',
            text: lines
        });
        text.length = 0;
        return this;
    }

    addTextAndSection(section, text) {
        return this
            .addText(section, text)
            .addSection(section);
    }

    addErrorOrExample(section, line) {
        let text = [];
        while (this._index < this._lines.length) {
            let line = this.readLine();
            if (line === '@end') {
                break;
            }
            text.push(line);
        }
        this.addTypedText(section, (line.indexOf('@example') === 0) ? 'example' : 'error', text);
    }

    addList(section, line) {
        let list = [line.substr(1 - line.length).trim()];
        while ((this._index < this._lines.length) &&
                (this._lines[this._index].substr(0, 1) === '*')) {
            line = this.readLine();
            list.push(line.substr(1 - line.length).trim());
        }
        this.addTypedText(section, 'list', list);
    }

    addTable(section, line) {
        let removeSides = function(line) {
                line = line.trim();
                return line.substr(1, line.length - 2);
            };
        let lines = this._lines;
        let table = {
                head: [],
                body: []
            };
        if (lines[this._index + 1].substr(0, 2) === '+-') {
            line       = removeSides(this.readLine());
            table.head = line.split('|');
            this.readLine();
        }
        while ((this._index < lines.length) && (lines[this._index].substr(0, 2) !== '+-')) {
            line = removeSides(this.readLine());
            let cells = line.split('|');
            for (let i = 0; i < cells.length; i++) {
                cells[i] = cells[i].trim();
                if (cells[i].indexOf('@image') === 0) {
                    let img = cells[i].substr(6 - cells[i].length).trim();
                    cells[i] = '<span class="image-loader">' + img + '</span>';
                }
            }
            table.body.push(cells);
        }
        this.readLine();
        this.addTypedText(section, 'table', table);
    }

    addLoad(section, line) {
        let loadItems = line.substr(5, line.length - 5).trim().split('|'); // Expect: "title|filename"
        this.addTypedText(section, 'load', loadItems);
    }

    addSee(section, line) {
        let see = line.substr(4, line.length - 4).trim().split(','); // Expect: "subject,title|subject"
        this.addTypedText(section, 'see', see);
    }

    addImage(section, line) {
        this.addTypedText(section, 'image', line.substr(6, line.length - 6).trim());
    }

    addKeywords(section, line) {
        let keywords = line.substr(8, line.length - 8).trim().split(',');
        for (let i = 0; i < keywords.length; i++) {
            let keyword = keywords[i].trim();
            if (keyword !== '') {
                this.addKeyword(keyword, section);
            }
        }
    }

    createNewSection(line) {
        return {id: this.getNextId(), content: [], title: line.substr(8, line.length - 8).trim()};
    }

    process(wocByName) {
        let section      = {id: this.getNextId(), title: '', content: []};
        let text         = [];
        let lines        = this._lines;
        let line         = this.readLine();
        let subjectTitle = line.substr(8, line.length - 8).trim(); // @subject
        let device       = false;
        while (this._index < lines.length) {
            line = this.readLine();
            if (line.indexOf('@device') === 0) {
                device = line.substr(7, line.length - 7).trim();
            } else if (line.indexOf('@section') === 0) {
                section = this
                    .addTextAndSection(section, text)
                    .createNewSection(line);
            } else if (line.indexOf('@keyword') === 0) {
                this
                    .addKeywords(section, line);
            }  else if (line.indexOf('@load') === 0) {
                this
                    .addText(section, text)
                    .addLoad(section, line);
            }  else if (line.indexOf('@see') === 0) {
                this
                    .addText(section, text)
                    .addSee(section, line);
            }  else if (line.indexOf('@image') === 0) {
                this
                    .addText(section, text)
                    .addImage(section, line);
            } else if ((line.indexOf('@example') === 0) || (line.indexOf('@error') === 0)) {
                this
                    .addText(section, text)
                    .addErrorOrExample(section, line);
            } else if (line.substr(0, 1) === '*') {
                this
                    .addText(section, text)
                    .addList(section, line);
            } else if (line.substr(0, 2) === '+-') {
                this
                    .addText(section, text)
                    .addTable(section, line);
            } else {
                text.push(line);
            }
        }
        this
            .addText(section, text)
            .addSection(section);
        this._help.files.push({
            subject:  subjectTitle,
            sections: this._sections,
            device:   device
        });
    }
};
