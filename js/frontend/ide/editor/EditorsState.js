/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const Emitter = require('../../lib/Emitter').Emitter;
const path    = require('../../lib/path');

exports.EditorsState = class extends Emitter {
    constructor() {
        super();
        this._editors = [];
    }

    hasCompilableFile() {
        let editors = this._editors;
        for (let i = 0; i < editors.length; i++) {
            let editor = editors[i];
            if (path.getExtension(editor.getFilename()) === '.whlp') {
                return true;
            }
        }
        return false;
    }

    showEditorByPathAndFilename(path, filename) {
        let activeEditor = null;
        let editors      = this._editors;
        let result       = null;
        for (let i = 0; i < editors.length; i++) {
            let editor = editors[i];
            if (editor.pathAndFilenameEqual(path, filename)) {
                editor.show();
                activeEditor = editor;
                result       = editor;
            } else {
                editor.hide();
            }
        }
        return activeEditor;
    }

    close(opts) {
        let editors    = this._editors;
        let lastEditor = null;
        for (let i = 0; i < editors.length; i++) {
            let editor = editors[i];
            if (editor.pathAndFilenameEqual(opts.path, opts.filename)) {
                editor.remove();
                editors.splice(i, 1);
                break;
            }
            lastEditor = editor;
        }
        if (!lastEditor) {
            lastEditor = editors[0];
        }
        return lastEditor;
    }

    add(editor) {
        this._editors.push(editor);
    }

    callEditors(f) {
        let editors = this._editors;
        for (let i = 0; i < editors.length; i++) {
            editors[i][f]();
        }
    }

    getBreakpoints() {
        let breakpoints = {};
        let editors     = this._editors;
        for (let i = 0; i < editors.length; i++) {
            let editor   = editors[i];
            let filename = path.join(editor.getPath(), editor.getFilename());
            breakpoints[filename] = editor.getBreakpoints();
        }
        return breakpoints;
    }

    getProjectEditors() {
        let result  = [];
        let editors = this._editors;
        for (let i = 0; i < editors.length; i++) {
            let editor = editors[i];
            if (path.getExtension(editor.getFilename()) === '.whlp') {
                result.push(editor);
            }
        }
        return result;
    }

    getLength() {
        return this._editors.length;
    }

    findByPathAndFilename(path, filename) {
        let editors = this._editors;
        for (let i = 0; i < editors.length; i++) {
            let editor = editors[i];
            if (editor.pathAndFilenameEqual(path, filename)) {
                return editor;
            }
        }
        return null;
    }
};
