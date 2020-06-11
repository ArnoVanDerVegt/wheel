/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
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
            '; @proc Show the form',
            '; @ret  The handle to the form.',
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
        this._lastDefines = null;
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

    generateDefinesFromData(data) {
        let form = data[0];
        let i    = form.name.indexOf('.');
        if (i !== -1) {
            form.name = form.name.substr(0, i);
        }
        let maxLength = 0;
        let toString  = function() {
                /* eslint-disable no-invalid-this */
                maxLength = Math.max(maxLength, this.name.length);
                /* eslint-disable no-invalid-this */
                return this.name;
            };
        let defines   = [];
        let addDefine = function(name, uid) {
                defines.push({
                    name:     name,
                    uid:      uid,
                    line:     '',
                    toString: toString
                });
            };
        let formName = this.getConstantFromName(form.name);
        addDefine(formName + '_FORM', form.uid);
        for (i = 1; i < data.length; i++) {
            let component = data[i];
            addDefine(formName + '_' + this.getConstantFromName(component.name), component.uid);
        }
        defines.sort();
        let space = '                                                                      ';
        for (i = 0; i < defines.length; i++) {
            let define = defines[i];
            define.line = '#define ' + (define.name + space).substr(0, Math.max(maxLength, define.name.length)) + ' ' + define.uid;
        }
        return defines;
    }

    generateIncludes() {
        return [
            '#include "lib/components/button.whl"',
            '#include "lib/components/selectButton.whl"',
            '#include "lib/components/label.whl"',
            '#include "lib/components/checkbox.whl"',
            '#include "lib/components/statusLight.whl"',
            '#include "lib/components/tabs.whl"',
            '#include "lib/components/panel.whl"'
        ].join('\n');
    }

    generateSourceFromFormData(data) {
        let result  = '; Component includes...\n' + this.generateIncludes() + '\n\n';
        let defines = this.generateDefinesFromData(data);
        result += '; Component uid defines...\n';
        defines.forEach(function(define) {
            result += define.line + '\n';
        });
        this._lastDefines = defines;
        return result;
    }

    generateEventProc(componentType, eventType, procName) {
        let events = formEditorConstants.EVENTS_BY_TYPE[componentType.toUpperCase()] || [];
        let event  = null;
        for (let i = 0; i < events.length; i++) {
            if (events[i].name === eventType) {
                event = events[i];
                break;
            }
        }
        if (!event) {
            return [];
        }
        let proc = 'proc ' + procName + '(';
        event.params.forEach(function(param) {
            proc += 'number ' + param + ', ';
        });
        proc = proc.substr(0, proc.length - 2) + ')';
        return [proc, 'end', ''];
    }

    generateEventsFromData(data, lines) {
        let procedures = [];
        const findProcedures = function() {
                lines.forEach(function(line, index) {
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
                        procLines.forEach(function(procLine) {
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
        for (let i = 0; i < data.length; i++) {
            let component = data[i];
            for (let j in component) {
                let value = component[j];
                if ((j.substr(0, 2) === 'on') && value && !findProc(value)) {
                    insertProc(value, this.generateEventProc(component.type, j, value));
                }
            }
        }
    }

    generateUpdatedSource(opts) {
        let defines = this._lastDefines;
        let lines   = opts.source.split('\n');
        let i       = 0;
        // First, remove all the existing #defines...
        if (!defines) {
            defines = this.generateDefinesFromData(opts.data);
        }
        let firstDefine    = this.updateLinesWithDefines(lines, defines);
        let insertPosition = -1;
        if (firstDefine === -1) {
            insertPosition = this.getLastInclude(lines);
            if (insertPosition !== -1) {
                insertPosition++;
                lines.splice(insertPosition, 0, '');
                insertPosition++;
            }
        } else {
            insertPosition = firstDefine;
        }

        // Then insert the new sorted and formated #define list...
        defines           = this.generateDefinesFromData(opts.data);
        this._lastDefines = defines;
        if (insertPosition === -1) {
            defines.forEach(function(define) {
                lines.push(define.line);
            });
        } else {
            defines.reverse();
            defines.forEach(function(define) {
                lines.splice(insertPosition, 0, define.line);
            });
        }
        // Add the event procedures...
        this.generateEventsFromData(opts.data, lines);
        // Get the updated defines...
        return lines.join('\n');
    }

    updateLinesWithDefines(lines, defines) {
        let firstDefine = -1;
        let i           = 0;
        while (i < lines.length) {
            let line = lines[i].trim();
            if (line.indexOf('#define') === 0) {
                let found = false;
                for (let j = 0; j < defines.length; j++) {
                    let define = defines[j];
                    if ((line.substr(-define.uid.length) === define.uid) && (line.indexOf(' ' + define.name + ' ') !== -1)) {
                        if (firstDefine === -1) {
                            firstDefine = i;
                        }
                        lines.splice(i, 1);
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    i++;
                }
            } else {
                i++;
            }
        }
        return firstDefine;
    }

    updateEventNames(opts) {
        let eventsByOldName = {};
        opts.renameEvents.forEach(function(renameEvent) {
            eventsByOldName[renameEvent.oldName] = renameEvent;
        });
        let lines = opts.source.split('\n');
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
        return lines.join('\n');
    }

    updateFormName(opts) {
        let lines   = opts.source.split('\n');
        let oldName = getShowProcNameFromFormName(opts.oldName);
        let newName = getShowProcNameFromFormName(opts.newName);
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i].trim();
            if ((line.indexOf('proc') === 0) && (line.indexOf(' ' + oldName) !== -1)) {
                line = lines[i];
                let j = line.indexOf(oldName);
                lines[i] = line.substr(0, j) + newName + line.substr(j + oldName.length, line.length - j - oldName.length);
                break;
            }
        }
        return lines.join('\n');
    }

    /**
     * Add a new component uid to the defines in the source...
    **/
    addComponent(opts) {
        return this.generateUpdatedSource(opts);
    }
};
