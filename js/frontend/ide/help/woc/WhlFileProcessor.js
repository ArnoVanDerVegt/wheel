/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const FileProcessor        = require('./FileProcessor').FileProcessor;
const SubjectFileProcessor = require('./SubjectFileProcessor');

exports.WhlFileProcessor = class extends FileProcessor {
    getComment(line) {
        if (line[0] === ';') {
            return line.substr(1, line.length - 1).trim();
        }
        return '';
    }

    getTextComment(line) {
        let textComment = this.getComment(line);
        return (textComment !== '') && (textComment.substr(0, 1) !== '@');
    }

    addConst(section, line) {
        let nextLine = this.peekLine().trim();
        let constant = {
                id:          this.getNextId(),
                description: line,
                values:      []
            };
        while (nextLine.indexOf('#define') === 0) {
            let constLine = this.readLine();
            constLine = constLine.substr(7, constLine.length - 7).trim();
            let i     = constLine.indexOf(' ');
            let key   = constLine.substr(0, i).trim();
            let value = constLine.substr(i, constLine.length - i).trim();
            constant.values.push({key: key, value: value});
            nextLine = this.peekLine(true);
            this.addKeyword(this.getCleanName(key), constant);
        }
        return this.addTypedText(section, 'const', constant);
    }

    processProc(section, wocByName, line) {
        let nextLine           = this.peekLine().trim();
        let descriptionByParam = {};
        let proc               = {
                id:          this.getNextId(),
                name:        '',
                description: line,
                params:      [],
                device:      ''
            };
        while (this.getTextComment(nextLine)) {
            this.readLine(true);
            proc.description += '\n' + nextLine;
            nextLine = this.peekLine().trim();
        }
        if (this.getComment(nextLine).indexOf('@device') === 0) {
            proc.device = this.getComment(nextLine).substr(7, nextLine.length - 7).trim();
            this.readLine(true);
            nextLine = this.peekLine().trim();
        }
        while (this.getComment(nextLine).indexOf('@param') === 0) {
            let paramLine = this.getComment(this.readLine()).trim();
            paramLine = paramLine.substr(6, paramLine.length - 6).trim();
            let i           = paramLine.indexOf(' ');
            let param       = paramLine.substr(0, i).trim();
            let description = paramLine.substr(i, paramLine.length - i).trim();
            nextLine = this.peekLine().trim();
            while (this.getTextComment(nextLine)) {
                this.readLine(true);
                description += '\n' + nextLine;
                nextLine = this.peekLine().trim();
            }
            descriptionByParam[this.getCleanName(param)] = description;
        }
        nextLine = this.readLine(true);
        if (this.getComment(nextLine).indexOf('@return') === 0) {
            let returnLine  = nextLine.substr(7, nextLine.length - 7).trim();
            let j           = returnLine.indexOf(' ');
            let description = returnLine.substr(j, returnLine.length - j).trim();
            nextLine = this.peekLine().trim();
            while (this.getTextComment(nextLine)) {
                this.readLine(true);
                description += '\n' + nextLine;
                nextLine = this.peekLine().trim();
            }
            proc.ret = description;
            nextLine = this.readLine(true);
        }
        nextLine = nextLine.substr(4, nextLine.length - 4).trim();
        let i          = nextLine.indexOf('(');
        let procName   = nextLine.substr(0, i);
        let procParams = nextLine.substr(i + 1, nextLine.length - i - 2).trim();
        if (procParams.length) {
            procParams.split(',').forEach(
                function(procParam) {
                    procParam = procParam.trim();
                    let j     = procParam.indexOf(' ');
                    let type  = procParam.substr(0, j).trim();
                    let param = procParam.substr(j, procParam.length - j).trim();
                    let s     = descriptionByParam[this.getCleanName(param)] || '';
                    proc.params.push({
                        name:        param,
                        type:        type,
                        description: this.getItalicWords(s)
                    });
                    this.addKeyword(param, proc);
                },
                this
            );
        }
        this.addKeyword(this.getCleanName(procName), proc);
        proc.name = procName;
        if (procName in wocByName) {
            let woc = wocByName[procName];
            if (woc.example.length) {
                proc.example = woc.example;
            }
            if (woc.text.length) {
                proc.text = woc.text;
            }
        }
        return this.addTypedText(section, 'proc', proc);
    }

    process(wocByName) {
        let device           = false;
        let mod              = false;
        let constantsSection = {id: this.getNextId(), title: 'Constants',  content: []};
        let procSection      = {id: this.getNextId(), title: 'Procedures', content: []};
        while (this._index < this._lines.length) {
            let line = this.readLine();
            if (line[0] === ';') {
                line = line.substr(1, line.length - 1).trim();
                let j = line.indexOf(' ');
                if (j !== -1) {
                    let keyword = line.substr(0, j);
                    switch (keyword) {
                        case '@module':
                            mod = line.substr(j, line.length - j).trim();
                            break;
                        case '@device':
                            device = line.substr(j, line.length - j).trim();
                            break;
                        case '@const':
                            this.addConst(constantsSection, line.substr(j, line.length - j).trim());
                            break;
                        case '@proc':
                            try {
                                this.processProc(procSection, wocByName, line.substr(j, line.length - j).trim());
                            } catch (error) {
                                console.error(error);
                            }
                            break;
                    }
                }
            }
        }
        if (constantsSection.content.length) {
            this.addSection(constantsSection);
        }
        if (procSection.content.length) {
            this.addSection(procSection);
        }
        if (mod && (this._sections.length)) {
            this.addKeyword(mod, this._sections[0].content[0].text);
            this._help.files.push({
                subject:  'Module:' + mod,
                sections: this._sections,
                device:   device
            });
        }
    }
};
