/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const path = require('../../../../lib/path');

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
            define.line = '#define ' + (define.name + space).substr(0, maxLength) + ' ' + define.uid;
        }
        return defines;
    }

    generateIncludes() {
        return [
            '#include "lib/components/button.whl"',
            '#include "lib/components/selectButton.whl"',
            '#include "lib/components/label.whl"',
            '#include "lib/components/checkbox.whl"',
            '#include "lib/components/tabs.whl"'
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

    generateEventsFromData(data, lines) {
        let procedures = [];
        lines.forEach(function(line) {
            let s = line.trim();
            if (s.indexOf('proc') === 0) {
                s = s.substr(4, s.length - 4).trim();
                let j = s.indexOf('(');
                procedures.push(s.substr(0, j).trim());
            }
        });
        for (let i = 0; i < data.length; i++) {
            let component = data[i];
            for (let j in component) {
                let value = component[j];
                if ((j.substr(0, 2) === 'on') && value) {
                    if (procedures.indexOf(value) === -1) {
                        procedures.push(value);
                        lines.push(
                            'proc ' + value + '()',
                            'end',
                            ''
                        );
                    }
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
        let firstDefine = this.updateLinesWithDefines(lines, defines);
        // Then insert the new sorted and formated #define list...
        defines           = this.generateDefinesFromData(opts.data);
        this._lastDefines = defines;
        if (firstDefine === -1) {
            defines.forEach(function(define) {
                lines.push(define.line);
            });
        } else {
            defines.reverse();
            defines.forEach(function(define) {
                lines.splice(firstDefine, 0, define.line);
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

    /**
     * Add a new component uid to the defines in the source...
    **/
    addComponent(opts) {
        return this.generateUpdatedSource(opts);
    }
};
