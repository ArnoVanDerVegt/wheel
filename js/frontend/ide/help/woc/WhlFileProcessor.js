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

    getVarInfoFromLine(line) {
        let lineNumber = this._index;
        let i          = line.indexOf(' ');
        let varName    = line.substr(i, line.length - i).trim();
        let varType    = line.substr(0, i).trim();
        let arraySize  = false;
        let result     = [];
        i = varName.indexOf('[');
        if (i !== -1) {
            let parts = varName.split('[');
            arraySize = [];
            for (i = 1; i < parts.length; i++) {
                let part = parts[i].trim();
                arraySize.push(part.substr(0, part.length - 1));
            }
        }
        let vars = varName.split(',');
        for (i = 0; i < vars.length; i++) {
            result.push({
                name:       vars[i].trim(),
                filename:   this._filename,
                lineNumber: lineNumber,
                type:       varType,
                arraySize:  arraySize
            });
        }
        return result;
    }

    processVar(section, line) {
        let varLine = this.readLine(true);
        let varInfo = this.getVarInfoFromLine(varLine)[0];
        varInfo.description = this.getItalicWords(line);
        this.addTypedText(section, 'var', varInfo);
    }

    processRecord(section, line) {
        let lineNumber = this._index;
        let recordLine = this.readLine(true);
        let record     = {
                description: this.getItalicWords(line),
                name:        recordLine.substr(6, recordLine.length - 6).trim(),
                filename:    this._filename,
                lineNumber:  lineNumber + 1,
                fields:      []
            };
        let nextLine   = this.peekLine(true);
        while (nextLine.indexOf('end') !== 0) {
            nextLine = this.readLine(true);
            if (nextLine.substr(0, 5) === 'union') {
                record.fields.push('union');
            } else {
                let fieldCommentLine = '';
                if (this.getComment(nextLine).indexOf('@field') === 0) {
                    nextLine         = this.getComment(nextLine);
                    fieldCommentLine = nextLine.substr(6, nextLine.length - 6).trim();
                    nextLine         = this.readLine(true);
                }
                let fields = this.getVarInfoFromLine(nextLine);
                if (fieldCommentLine !== '') {
                    fields.forEach((field) => {
                        field.description = fieldCommentLine;
                    });
                }
                record.fields = record.fields.concat(fields);
            }
            nextLine = this.peekLine(true);
        }
        this.addTypedText(section, 'record', record);
    }

    processConst(section, line) {
        let nextLine = this.peekLine().trim();
        let constant = {
                id:          this.getNextId(),
                filename:    this._filename,
                lineNumber:  this._index + 1,
                description: this.getItalicWords(line),
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

    processEvent(section, line) {
        let event       = {
                id:          this.getNextId(),
                name:        '',
                description: '',
                params:      []
            };
        let description = '';
        let i           = line.indexOf(' ');
        if (i !== -1) {
            event.name        = line.substr(0, i).trim();
            event.description = line.substr(i - line.length).trim();
        } else {
            event.name        = line;
        }
        let nextLine = this.peekLine().trim();
        while (this.getComment(nextLine).indexOf('@param') === 0) {
            let paramLine = this.getComment(this.readLine()).trim();
            paramLine = paramLine.substr(6, paramLine.length - 6).trim();
            let i           = paramLine.indexOf(' ');
            let param       = paramLine.substr(0, i);
            let j           = i + 1;
            while ((j < paramLine.length) && (paramLine[j] === ' ')) {
                j++;
            }
            j = paramLine.indexOf(' ', j);
            let paramType   = paramLine.substr(i, j - i).trim();
            let description = paramLine.substr(j, paramLine.length - j).trim();
            nextLine = this.peekLine().trim();
            while (this.getTextComment(nextLine)) {
                this.readLine(true);
                description += '\n' + nextLine.substr(1 - nextLine.length);
                nextLine = this.peekLine().trim();
            }
            event.params.push({
                name:        param.trim(),
                type:        paramType.trim(),
                description: description.trim()
            });
        }
        this.readLine(true);
        return this.addTypedText(section, 'event', event);
    }

    processProperties(section, line) {
        let properties = {
                id:          this.getNextId(),
                name:        '',
                description: '',
                properties:  []
            };
        let nextLine = line;
        while (this.getComment(nextLine).indexOf('@property') === 0) {
            let propertyLine = this.getComment(nextLine).trim();
            let i            = propertyLine.indexOf(' ');
            propertyLine = propertyLine.substr(i, propertyLine.length - i).trim();
            i            = propertyLine.indexOf(' ');
            let property = propertyLine.substr(0, i);
            propertyLine = propertyLine.substr(i, propertyLine.length - i).trim();
            i            = propertyLine.indexOf(' ');
            let type     = propertyLine.substr(0, i);
            properties.properties.push({
                name:        property,
                type:        type,
                description: this.getItalicWords(propertyLine.substr(i, propertyLine.length - i).trim())
            });
            this.readLine();
            nextLine = this.peekLine().trim();
        }
        this.readLine(true);
        return this.addTypedText(section, 'properties', properties);
    }

    processProc(section, wocByName, line) {
        let nextLine           = this.peekLine().trim();
        let descriptionByParam = {};
        let proc               = {
                id:          this.getNextId(),
                name:        '',
                filename:    this._filename,
                lineNumber:  this._index + 1,
                description: line,
                params:      [],
                device:      ''
            };
        while (this.getTextComment(nextLine)) {
            this.readLine(true);
            proc.description += '\n' + nextLine.substr(1 - nextLine.length);
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
                description += '\n' + nextLine.substr(1 - nextLine.length);
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
                description += '\n' + nextLine.substr(1 - nextLine.length);
                nextLine = this.peekLine().trim();
            }
            proc.ret = this.getItalicWords(description);
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
        let device            = false;
        let mod               = false;
        let namespace         = false;
        let constantsSection  = {id: this.getNextId(), title: 'Constants',  content: []};
        let varSection        = {id: this.getNextId(), title: 'Variables',  content: []};
        let recordSection     = {id: this.getNextId(), title: 'Records',    content: []};
        let eventSection      = {id: this.getNextId(), title: 'Events',     content: []};
        let propertiesSection = {id: this.getNextId(), title: 'Properties', content: []};
        let procSection       = {id: this.getNextId(), title: 'Procedures', content: []};
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
                            this.processConst(constantsSection, line.substr(j, line.length - j).trim());
                            break;
                        case '@var':
                            this.processVar(varSection, line.substr(j, line.length - j).trim());
                            break;
                        case '@record':
                            this.processRecord(recordSection, line.substr(j, line.length - j).trim());
                            break;
                        case '@event':
                            this.processEvent(eventSection, line.substr(j, line.length - j).trim());
                            break;
                        case '@property':
                            this.processProperties(propertiesSection, ';' + line);
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
            } else if (line.indexOf('namespace') === 0) {
                line = line.substr(10 - line.length).trim();
                let i = line.indexOf(' ');
                namespace = (i === -1) ? line : line.substr(0, i);
            }
        }
        if (constantsSection.content.length) {
            this.addSection(constantsSection);
        }
        if (recordSection.content.length) {
            this.addSection(recordSection);
        }
        if (varSection.content.length) {
            this.addSection(varSection);
        }
        if (propertiesSection.content.length) {
            this.addSection(propertiesSection);
        }
        if (eventSection.content.length) {
            this.addSection(eventSection);
        }
        if (procSection.content.length) {
            this.addSection(procSection);
        }
        if (mod && (this._sections.length)) {
            this.addKeyword(mod, this._sections[0].content[0].text);
            this._help.files.push({
                subject:   'Module:' + mod,
                namespace: namespace,
                device:    device,
                sections:  this._sections
            });
        }
    }
};
