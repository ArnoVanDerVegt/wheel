/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher          = require('../../../../lib/dispatcher').dispatcher;
const path                = require('../../../../lib/path');
const formEditorConstants = require('./formEditorConstants');

const getShowProcNameFromFilename = function(filename) {
        let result = '';
        filename = path.replaceExtension(filename, '');
        for (let i = 0; i < filename.length; i++) {
            let c = filename[i];
            if ('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.indexOf(c) !== -1) {
                result += c;
            }
        }
        return result.substr(0, 1).toUpperCase() + result.substr(1 - result.length) + 'Form';
    };

const getShowProcNameFromFormName = function(formName) {
        return 'show' + formName.substr(0, 1).toUpperCase() + formName.substr(1 - formName.length) + 'Form';
    };

const getFormCode = function(filename) {
        let pathAndFilename = path.getPathAndFilename(filename);
        return [
            '#resource "' + path.replaceExtension(pathAndFilename.filename, '.wfrm') + '"',
            '',
            '; @proc                   Show the form.',
            '; @ret                    The handle to the form.',
            'proc show' + getShowProcNameFromFilename(filename) + '()',
            '    ret components.form.show("' + filename + '")',
            'end',
            ''
        ];
    };

exports.getFormCode                 = getFormCode;
exports.getShowProcNameFromFormName = getShowProcNameFromFormName;

exports.SourceBuilder = class {
    constructor(opts) {
        this._settings = opts.settings;
        this._lines    = [];
        this._database = null;
        this._events   = [
            dispatcher.on('Compiler.Database', this, this.onCompilerDatabase)
        ];
    }

    remove() {
        while (this._events.length) {
            this._events.pop()();
        }
    }

    setSource(source) {
        this._lines = source.split('\n');
        return this;
    }

    getSource() {
        return this._lines.join('\n');
    }

    getConstantFromName(name) {
        if (name.toUpperCase() === name) {
            return name;
        }
        let result = name.substr(0, 1).toUpperCase();
        let j      = name.length - 1;
        for (let i = 1; i <= j; i++) {
            let c = name.substr(i, 1).toUpperCase();
            if (i < j) {
                if ('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.indexOf(name.substr(i + 1, 1)) === -1) {
                    result += c;
                } else {
                    result += c + '_';
                }
            } else {
                result += c;
            }
        }
        return result;
    }

    getLastInclude(lines) {
        let i = lines.length - 1;
        while (i >= 0) {
            let line = lines[i].trim();
            if (line.indexOf('#include') === 0) {
                return i;
            }
            i--;
        }
        return -1;
    }

    getDefineInfo(line) {
        let i = line.indexOf('#define');
        if (i !== -1) {
            let s = line.substr(7, line.length - 7).trim();
            i = s.indexOf(' ');
            if (i !== -1) {
                return {key: s.substr(0, i).trim(), value: s.substr(i, s.length - i).trim()};
            }
        }
        return null;
    }

    getFormNameFromComponents(components) {
        let formName = '';
        for (let i = 0; i < components.length; i++) {
            let component = components[i];
            if (component.type === 'form') {
                formName = component.name;
                let j = formName.indexOf('.');
                if (j !== -1) {
                    formName = formName.substr(0, j);
                }
                break;
            }
        }
        return formName;
    }

    generateIncludesFromComponents(components) {
        let includes         = [];
        let propertiesByType = formEditorConstants.PROPERTIES_BY_TYPE;
        components.forEach((component) => {
            if (component.type.toUpperCase() in propertiesByType) {
                let include = propertiesByType[component.type.toUpperCase()].include;
                if (includes.indexOf(include) === -1) {
                    includes.push(include);
                }
            }
        });
        includes.sort();
        return includes;
    }

    generateDefinesFromComponents(formName, components) {
        let maxLength = 0;
        let toString  = function() {
                /* eslint-disable no-invalid-this */
                maxLength = Math.max(maxLength, this.name.length);
                /* eslint-disable no-invalid-this */
                return this.name;
            };
        let defines       = [];
        let definesByName = {};
        let addDefine     = function(name, uid) {
                definesByName[name] = uid;
                defines.push({
                    line:     '',
                    name:     name,
                    uid:      uid,
                    toString: toString
                });
            };
        formName = this.getConstantFromName(formName);
        components.forEach(
            function(component) {
                if (component.type !== 'form') {
                    addDefine(formName + '_' + this.getConstantFromName(component.name), component.uid);
                }
            },
            this
        );
        defines.sort();
        let space = '                                                                      ';
        defines.forEach((define) => {
            define.line = '#define ' + (define.name + space).substr(0, Math.max(maxLength, define.name.length)) + ' ' + define.uid;
        });
        return {
            definesByName: definesByName,
            list:          defines
        };
    }

    generateSourceFromFormData(data) {
        this._lines = [];
        let components = data.components;
        let lines      = this._lines;
        let includes   = this.generateIncludesFromComponents(components);
        let formName   = this.getFormNameFromComponents(components);
        if (data.project) {
            lines.push(
                '#project "' + formName + '"',
                '',
                '#include "lib/standard.whl"'
            );
        }
        includes.forEach((include) => {
            lines.push('#include "' + include + '"');
        });
        let defines = this.generateDefinesFromComponents(formName, components);
        lines.push('');
        defines.list.forEach((define) => {
            lines.push(define.line);
        });
        lines.push(
            '',
            '#resource "' + formName + '.wfrm"'
        );
        if (formName) {
            lines.push('');
            if (this._settings.getCreateEventComments()) {
                lines.push(
                    '; @proc                   Show the form.',
                    '; @ret                    The handle to the form.'
                );
            }
            lines.push(
                'proc show' + getShowProcNameFromFilename(formName) + '()',
                '    ret components.form.show("' + formName + '.wfrm")',
                'end'
            );
        }
        if (data.project) {
            lines.push(
                '',
                'proc main()',
                '    show' + getShowProcNameFromFilename(formName) + '()',
                '    halt()',
                'end'
            );
        }
        return this;
    }

    generateEventProc(componentName, componentType, eventType, procName) {
        let lines  = [];
        let events = formEditorConstants.PROPERTIES_BY_TYPE[componentType.toUpperCase()].events || [];
        let event  = null;
        for (let i = 0; i < events.length; i++) {
            if (events[i].name === eventType) {
                event = events[i];
                break;
            }
        }
        if (!event || (this._database && this._database.findProc(procName))) {
            return [];
        }
        let addComments = this._settings.getCreateEventComments();
        let proc        = 'proc ' + procName + '(';
        if (addComments) {
            lines.push('; @proc                   ' +
                componentType.substr(0, 1).toUpperCase() + componentType.substr(1, componentType.length - 1) +
                ' ' + eventType + ' event.');
        }
        event.params.forEach((param) => {
            proc += param.type + ' ' + param.name + ', ';
            if (addComments) {
                lines.push('; @param ' + (param.name + '                ').substr(0, 16) + ' ' + (param.comment || ''));
            }
        });
        proc = proc.substr(0, proc.length - 2) + ')';
        lines.push(proc);
        if (event.code) {
            event.code.forEach((code) => {
                lines.push(code.replace('{name}', componentName));
            });
        }
        lines.push('end', '');
        return lines;
    }

    generateEventsFromData(lines, data) {
        let procedures = [];
        const findProcedures = function() {
                lines.forEach((line, index) => {
                    let s = line.trim();
                    if (s.indexOf('proc') === 0) {
                        s = s.substr(4, s.length - 4).trim();
                        let j = s.indexOf('(');
                        procedures.push({
                            name:  s.substr(0, j).trim(),
                            index: index
                        });
                    }
                });
            };
        const findProc = function(proc) {
                for (let i = 0; i < procedures.length; i++) {
                    if (procedures[i].name === proc) {
                        return proc;
                    }
                }
                return null;
            };
        const insertProc = function(proc, procLines) {
                let found = false;
                for (let i = 0; i < procedures.length; i++) {
                    // Try to insert in alpha order...
                    if (proc < procedures[i].name) {
                        let index = procedures[i].index;
                        // Insert before the comments of the proc...
                        while ((index > 0) && (lines[index - 1].trim().substr(0, 1) === ';')) {
                            index--;
                        }
                        procLines.reverse();
                        procLines.forEach((procLine) => {
                            lines.splice(index, 0, procLine);
                        });
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    procLines.pop();
                    procLines.unshift('');
                    lines.push.apply(lines, procLines);
                }
                findProcedures();
            };
        findProcedures();
        let found = false;
        for (let i = 0; i < data.length; i++) {
            let component = data[i];
            for (let j in component) {
                let value = component[j];
                if ((j.substr(0, 2) === 'on') && value && !findProc(value)) {
                    found = true;
                    insertProc(value, this.generateEventProc(component.name, component.type, j, value));
                }
            }
        }
    }

    generateUpdatedSource(opts) {
        let lines = this._lines;
        this
            .updateLinesWithIncludes(lines, opts)
            .generateEventsFromData(lines, opts.components);
        let formName       = this.getFormNameFromComponents(opts.components);
        let defines        = this.generateDefinesFromComponents(formName, opts.components);
        let insertPosition = -1;
        let i              = 0;
        while (i < lines.length) {
            let defineInfo = this.getDefineInfo(lines[i]);
            if (defineInfo && (defineInfo.key in defines.definesByName)) {
                lines.splice(i, 1);
                insertPosition = i;
            } else {
                i++;
            }
        }
        if (insertPosition === -1) {
            i = 0;
            while (i < lines.length) {
                if (lines[i].trim().indexOf('#include') === 0) {
                    insertPosition = i;
                }
                i++;
            }
            if (insertPosition !== -1) {
                insertPosition += 2;
            }
        }
        if (insertPosition === -1) {
            defines.list.forEach((define) => {
                lines.push(define.line);
            });
        } else {
            defines.list.reverse();
            defines.list.forEach((define) => {
                lines.splice(insertPosition, 0, define.line);
            });
        }
        i = insertPosition + defines.list.length;
        if ((i < lines.length) && (lines[i].trim() !== '')) {
            lines.splice(i, 0, '');
        }
        return this;
    }

    deleteComponent(opts) {
        let lines  = this._lines;
        const deleteComponent = (name) => {
                let define = this.getConstantFromName(opts.formName) + '_' + this.getConstantFromName(name);
                let i      = 0;
                while (i < lines.length) {
                    let defineInfo = this.getDefineInfo(lines[i]);
                    if (defineInfo && (defineInfo.key === define)) {
                        lines.splice(i, 1);
                        break;
                    } else {
                        i++;
                    }
                }
            };
        opts.components.forEach((item) => {
            deleteComponent(item.name);
        });
        return this;
    }

    updateLinesWithIncludes(lines, opts) {
        let currentIncludes = [];
        let lastIndex       = 0;
        lines.forEach((line, index) => {
            line = line.trim();
            if (line.indexOf('#include ') === 0) {
                let i = line.indexOf('"');
                let j = line.indexOf('"', i + 1);
                if ((i !== -1) && (j !== -1)) {
                    currentIncludes.push(line.substr(i + 1, j - i - 1));
                }
                lastIndex = index;
            }
        });
        let includes = this.generateIncludesFromComponents(opts.components);
        includes.forEach((include) => {
            if (currentIncludes.indexOf(include) === -1) {
                lines.splice(lastIndex + 1, 0, '#include "' + include + '"');
            }
        });
        return this;
    }

    updateEventNames(opts) {
        if (!opts.renameEvents.length) {
            return this;
        }
        let eventsByOldName = {};
        opts.renameEvents.forEach((renameEvent) => {
            eventsByOldName[renameEvent.oldName] = renameEvent;
        });
        let lines = this._lines;
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            if (line.trim().indexOf('proc') === 0) {
                line = line.trim();
                let j = line.indexOf('(');
                if (j !== -1) {
                    let procName = line.substr(5, j - 5).trim();
                    if (procName in eventsByOldName) {
                        lines[i] = 'proc ' + eventsByOldName[procName].newName + line.substr(j - line.length).trim();
                        delete eventsByOldName[procName];
                    }
                }
            }
        }
        return this;
    }

    updateFormNameAndRemoveDefines(opts) {
        let lines   = this._lines;
        let oldName = getShowProcNameFromFormName(opts.oldName);
        let newName = getShowProcNameFromFormName(opts.newName);
        if (newName === '') {
            return this;
        }
        let defines = this.generateDefinesFromComponents(opts.oldName, opts.components);
        let i       = 0;
        while (i < lines.length) {
            let line       = lines[i].trim();
            let defineInfo = this.getDefineInfo(line);
            if (defineInfo && (defineInfo.key in defines.definesByName)) {
               lines.splice(i, 1);
            } else {
                if ((line.indexOf('proc') === 0) && (line.indexOf(' ' + oldName) !== -1)) {
                    let j = line.indexOf(oldName);
                    lines[i] = line.substr(0, j) + newName + line.substr(j + oldName.length, line.length - j - oldName.length);
                    break;
                }
                i++;
            }
        }
        return this;
    }

    updateComponentName(opts) {
        let oldName = this.getConstantFromName(opts.formName) + '_' + this.getConstantFromName(opts.oldName);
        let newName = this.getConstantFromName(opts.formName) + '_' + this.getConstantFromName(opts.newName);
        if (oldName === newName) {
            return this;
        }
        // Scan all lines for existing defines and get the maximum key length...
        let lines     = this._lines;
        let maxLength = newName.length;
        for (let i = 0; i < lines.length; i++) {
            let line       = lines[i].trim();
            let defineInfo = this.getDefineInfo(line);
            if (defineInfo) {
                maxLength = Math.max(maxLength, defineInfo.key.length);
            }
        }
        let space = '';
        while (space.length < maxLength) {
            space += ' ';
        }
        // Update all defines with the new alignment and rename the define key...
        let defines = {};
        let i       = 0;
        while (i < lines.length) {
            let line       = lines[i].trim();
            let defineInfo = this.getDefineInfo(line);
            if (defineInfo) {
                if (defineInfo.key in defines) {
                    lines.splice(i, 1); // Remove duplicate define...
                } else {
                    if (defineInfo.key === oldName) {
                        defineInfo.key = newName;
                    }
                    lines[i] = '#define ' + (defineInfo.key + space).substr(0, maxLength) + ' ' + defineInfo.value;
                    defines[defineInfo.key] = true;
                    i++;
                }
            } else {
                i++;
            }
        }
        return this;
    }

    /**
     * Add a new component uid to the defines in the source...
    **/
    updateComponents(opts) {
        return this.generateUpdatedSource(opts);
    }

    onCompilerDatabase(database) {
        this._database = database;
    }
};
