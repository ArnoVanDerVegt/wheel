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

    generateUpdatedSource(opts) {
        let defines     = this._lastDefines;
        let lines       = opts.source.split('\n');
        let firstDefine = -1;
        let i           = 0;
        // First, remove all the existing #defines...
        if (!defines) {
            defines = this.generateDefinesFromData(opts.data);
        }
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
        // Get the updated defines...
        return lines.join('\n');
    }

    /**
     * Add a new component uid to the defines in the source...
    **/
    addComponent(opts) {
        return this.generateUpdatedSource(opts);
    }
};
