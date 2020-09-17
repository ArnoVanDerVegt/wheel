/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const path                = require('../../lib/path');
const formEditorConstants = require('../editor/editors/form/formEditorConstants');

exports.getShowProcNameFromFilename = (filename) => {
    let result = '';
    filename = path.replaceExtension(filename, '');
    for (let i = 0; i < filename.length; i++) {
        let c = filename[i];
        if ('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.indexOf(c) !== -1) {
            result += c;
        }
    }
    if (result.length === 1) {
        return result.toUpperCase() + 'Form';
    }
    return result.substr(0, 1).toUpperCase() + result.substr(1 - result.length) + 'Form';
};

exports.getShowProcNameFromFormName = (formName) => {
    if (formName.length === 1) {
        formName = formName.toUpperCase();
    } else {
        formName = formName.substr(0, 1).toUpperCase() + formName.substr(1 - formName.length);
    }
    return 'show' + formName + 'Form';
};

exports.getFormCode = (filename) => {
    let pathAndFilename = path.getPathAndFilename(filename);
    return [
        '',
        '#resource "' + path.replaceExtension(pathAndFilename.filename, '.wfrm') + '"',
        '',
        '; @proc                   Show the form.',
        '; @ret                    The handle to the form.',
        'proc show' + exports.getShowProcNameFromFilename(filename) + '()',
        '    ret components.form.show("' + filename + '")',
        'end',
        ''
    ];
};

exports.getConstantFromName = (name) => {
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
};

exports.getFormNameFromComponents = (components) => {
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
};

exports.getDefineInfo = (line) => {
    let i = line.indexOf('#define');
    if (i !== -1) {
        let s = line.substr(7, line.length - 7).trim();
        i = s.indexOf(' ');
        if (i !== -1) {
            return {key: s.substr(0, i).trim(), value: s.substr(i, s.length - i).trim()};
        }
    }
    return null;
};

exports.generateIncludesFromComponents = (components) => {
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
};

exports.updateLinesWithIncludes = (lines, opts) => {
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
    let includes = exports.generateIncludesFromComponents(opts.components);
    includes.forEach((include) => {
        if (currentIncludes.indexOf(include) === -1) {
            lines.splice(lastIndex + 1, 0, '#include "' + include + '"');
        }
    });
};

const addIncludes = (lines, includeFiles) => {
        for (let i = 0; i < includeFiles.length; i++) {
            lines.push('#include "' + includeFiles[i] + '"');
        }
    };

exports.removeDuplicateEmptyLines = (lines) => {
    let result = [];
    let empty  = false;
    let i      = 0;
    while (i < lines.length) {
        let line = lines[i++];
        if (line.trim() === '') {
            if (!empty) {
                result.push('');
            }
            empty = true;
        } else {
            result.push(line);
            empty = false;
        }
    }
    return result;
};

exports.createProjectFile = (opts) => {
    let lines           = ['#project "' + opts.description + '"', ''];
    let pathAndFilename = path.getPathAndFilename(opts.filename);
    let includeFiles    = opts.includeFiles;
    let formFilename;
    let formName;
    if (opts.createForm) {
        formFilename = path.replaceExtension(path.getPathAndFilename(opts.filename).filename, '.wfrm');
        formName     = path.replaceExtension(formFilename, '');
        if (includeFiles.indexOf('lib/standard.whl') === -1) {
            includeFiles.push('lib/standard.whl');
        }
        if (includeFiles.indexOf('lib/components/component.whl') === -1) {
            includeFiles.push('lib/components/component.whl');
        }
        if (includeFiles.indexOf('lib/components/form.whl') === -1) {
            includeFiles.push('lib/components/form.whl');
        }
    }
    addIncludes(lines, includeFiles);
    if (opts.createForm) {
        lines.push.apply(lines, exports.getFormCode(formFilename));
        lines.push(
            'proc main()',
            '    ' + exports.getShowProcNameFromFormName(formName) + '()',
            '    halt()',
            'end'
        );
    } else {
        if (includeFiles.length) {
            lines.push('');
        }
        lines.push(
            'proc main()',
            'end'
        );
    }
    return exports.removeDuplicateEmptyLines(lines);
};
