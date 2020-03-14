/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher      = require('../../lib/dispatcher').dispatcher;
const path            = require('../../lib/path');
const DOMUtils        = require('../../lib/dom').DOMUtils;
const getDataProvider = require('../../lib/dataprovider/dataProvider').getDataProvider;
const getImage        = require('../data/images').getImage;
const Editors         = require('./Editors').Editors;

exports.Editor = class extends DOMUtils {
    constructor(opts) {
        super(opts);
        this._ui                           = opts.ui;
        this._settings                     = opts.settings;
        this._breakpoint                   = null;
        this._preProcessor                 = null;
        this._editorsState                 = opts.editorsState;
        this._editors                      = new Editors({
            ui:           this._ui,
            editorsState: this._editorsState,
            settings:     opts.settings,
            ev3:          opts.ev3,
            poweredUp:    opts.poweredUp
        });
        this._selectProjectCompileCallback = null; // Which project should be compiled?
        this._projectNewFileOptions        = [];   // List of projects where a new file can be added
        this._ui.addEventListener('Global.Window.Focus', this, this.onGlobalWindowFocus);
        dispatcher
            .on('FileDrop.Open',                    this, this.onLoadFile)
            .on('Dialog.List.SelectProjectCompile', this, this.onSelectProjectCompile)
            .on('Dialog.Replace.Replace',           this, this.onReplace);
        // Image...
        dispatcher.on('ResizeImage', this, this._resize);
        // Editor calls...
        dispatcher
            .on('Editor.CloseFile', this, this._closeFile)
            .on('Editor.Undo',      this, this.callActiveEditor.bind(this, 'onUndo'))
            .on('Editor.Copy',      this, this.callActiveEditor.bind(this, 'onCopy'))
            .on('Editor.Paste',     this, this.callActiveEditor.bind(this, 'onPaste'))
            .on('Editor.Save',      this, this.callActiveEditor.bind(this, 'save'))
            .on('Editor.Crop',      this, this.callActiveEditor.bind(this, 'crop'));
        // Dialog calls...
        dispatcher
            .on('Dialog.File.Open',   this, this._loadFile)
            .on('Dialog.File.SaveAs', this, this._saveAs);
        // Create calls...
        dispatcher
            .on('Create.Project', this, this._addProjectFile)
            .on('Create.File',    this, this._addFile)
            .on('Create.Image',   this, this._addImageFile);
    }

    add(opts) {
        this._editors.add(opts);
    }

    _addFile(filename, includeFiles) {
        let pathAndFilename = path.getPathAndFilename(filename);
        let file            = [];
        for (let i = 0; i < includeFiles.length; i++) {
            file.push('#include "' + includeFiles[i] + '"');
        }
        file.push('');
        this._editors.add({
            value:    file.join('\n'),
            path:     pathAndFilename.path,
            filename: pathAndFilename.filename,
            changed:  true
        });
    }

    _addProjectFile(filename, desciption, includeFiles) {
        let file = [
                '#project "' + desciption + '"',
                ''
            ];
        for (let i = 0; i < includeFiles.length; i++) {
            file.push('#include "' + includeFiles[i] + '"');
        }
        file.push(
            '',
            'proc main()',
            'end'
        );
        let pathAndFilename = path.getPathAndFilename(filename);
        this._editors.add({
            value:    file.join('\n'),
            path:     pathAndFilename.path,
            filename: pathAndFilename.filename,
            changed:  true
        });
    }

    _addImageFile(filename, width, height) {
        let callback = (function() {
                let image = [];
                for (let y = 0; y < height; y++) {
                    let line = [];
                    for (let x = 0; x < width; x++) {
                        line.push(0);
                    }
                    image.push(line);
                }
                let value = {
                        width:  width,
                        height: height,
                        image:  image
                    };
                let pathAndFilename = path.getPathAndFilename(filename);
                this._editors.add({
                    value:    value,
                    path:     pathAndFilename.path,
                    filename: pathAndFilename.filename,
                    changed:  true
                });
            }).bind(this);
        callback();
    }

    hideBreakpoint() {
        let breakpoint = this._breakpoint;
        if (breakpoint) {
            dispatcher.dispatch('Button.Continue.Change', {disabled: true});
            breakpoint.wheelEditor.hideBreakpoint(breakpoint.breakpoint.lineNum - 1);
            this._breakpoint = null;
        }
    }

    onBreakpoint(breakpoint) {
        let sortedFiles = this._preProcessor.getSortedFiles();
        if (!sortedFiles[breakpoint.fileIndex]) {
            return;
        }
        dispatcher
            .dispatch('Editor.Breakpoint',      breakpoint)
            .dispatch('Button.Continue.Change', {disabled: false, hidden: false});
        let pathAndFilename = path.getPathAndFilename(sortedFiles[breakpoint.fileIndex].filename);
        let wheelEditor     = this._editors.showEditorByPathAndFilename(pathAndFilename.path, pathAndFilename.filename);
        if (wheelEditor) {
            this._breakpoint = {
                breakpoint:  breakpoint,
                wheelEditor: wheelEditor
            };
            wheelEditor.showBreakpoint(breakpoint.lineNum - 1);
        }
    }

    onLoadFile(filename, data, type, cursorPosition) {
        if (type === 'json') {
            try {
                data = JSON.parse(data).data;
            } catch (error) {
                return;
            }
        }
        let pathAndFilename = path.getPathAndFilename(filename);
        this._editors.add({
            value:          data,
            filename:       pathAndFilename.filename,
            path:           pathAndFilename.path,
            cursorPosition: cursorPosition
        });
    }

    onSelectProjectCompile(index) {
        let editor = this._editorsState.getProjectEditors()[index];
        editor && this._selectProjectCompileCallback({
            filename: path.join(editor.getPath(), editor.getFilename()),
            source:   editor.getValue()
        });
    }

    onReplace(replace, w) {
        let activeEditor = this.getActiveEditor();
        activeEditor && activeEditor.replace && activeEditor.replace(replace, w);
    }

    onGlobalWindowFocus() {
        let activeEditor = this.getActiveEditor();
        activeEditor && activeEditor.restoreCursor && activeEditor.restoreCursor();
    }

    getValue(callback, activeEditor) {
        let editors;
        let editor;
        if (activeEditor) { // Compile in the background, return the active source...
            editor = this._editors.getActiveEditor();
            if (!editor) {
                return;
            }
            let filename = editor.getFilename();
            if (path.getExtension(filename) !== '.whlp') {
                return;
            }
            callback({
                filename: path.join(editor.getPath(), filename),
                source:   editor.getValue()
            });
            return;
        }
        editors = this._editorsState.getProjectEditors();
        switch (editors.length) {
            case 0:
                dispatcher.dispatch(
                    'Dialog.Alert.Show',
                    {
                        title: 'No project found',
                        lines: ['You have no open project files.']
                    }
                );
                break;
            case 1:
                editor = editors[0];
                callback({
                    filename: path.join(editor.getPath(), editor.getFilename()),
                    source:   editor.getValue()
                });
                break;
            default:
                this._selectProjectCompileCallback = callback;
                dispatcher.dispatch(
                    'Dialog.List.Show',
                    {
                        list:           this.getLocalEditorPathNames(editors),
                        title:          'Select a project to compile',
                        applyTitle:     'Compile',
                        dispatchApply:  'Dialog.List.SelectProjectCompile',
                        dispatchCancel: 'Dialog.List.CancelCompile'
                    }
                );
                break;
        }
    }

    getLocalEditorPathNames(editors) {
        let documentPath = this._settings.getDocumentPath();
        let list         = [];
        for (let i = 0; i < editors.length; i++) {
            let editor = editors[i];
            let p      = path.join(editor.getPath(), editor.getFilename());
            if (p.indexOf(documentPath) === 0) {
                p = p.substr(documentPath.length - p.length);
            }
            list.push(p);
        }
        return list;
    }

    setPreProcessor(preProcessor) {
        this._preProcessor = preProcessor;
    }

    getBreakpoints() {
        let sortedFiles           = this._preProcessor.getSortedFiles();
        let fileIndexBySortedFile = {};
        sortedFiles.forEach(function(sortedFile, index) {
            fileIndexBySortedFile[sortedFile.filename] = index;
        });
        let breakpoints       = [];
        let editorBreakpoints = this._editorsState.getBreakpoints();
        for (let filename in editorBreakpoints) {
            let fileIndex = fileIndexBySortedFile[filename];
            editorBreakpoints[filename].forEach(function(breakpoint) {
                breakpoint.fileIndex = fileIndex;
                breakpoints.push(breakpoint);
            });
        }
        return breakpoints;
    }

    clearAllBreakpoints() {
        this._editorsState.callEditors('clearAllBreakpoints');
    }

    disableBreakpoints() {
        this._editorsState.callEditors('disableBreakpoints');
    }

    enableBreakpoints() {
        this._editorsState.callEditors('enableBreakpoints');
    }

    getActiveEditor() {
        return this._editors.getActiveEditor();
    }

    _activateFile(filename, cursorPosition) {
        let opts = path.getPathAndFilename(filename);
        opts.cursorPosition = cursorPosition;
        return this._editors.activateFile(opts);
    }

    _loadFile(filename, cursorPosition) {
        if (this._activateFile(filename, cursorPosition)) {
            return;
        }
        let type;
        let extension = path.getExtension(filename);
        switch (extension) {
            case '.mp3':
            case '.wav':
            case '.ogg':
                type = 'arrayBuffer';
                break;
            case '.bmp':
            case '.png':
            case '.jpg':
            case '.jpeg':
            case '.gif':
                type = 'base64';
                break;
            default:
                type = 'json';
                break;
        }
        getDataProvider().getData(
            'post',
            'ide/file',
            {filename: filename, arrayBuffer: (type === 'arrayBuffer')},
            (function(data) {
                this.onLoadFile(filename, data, type, cursorPosition);
                if (extension === '.whlp') {
                    dispatcher
                        .dispatch('Settings.Set.RecentProject', filename)
                        .dispatch('Compile.Silent');
                }
            }).bind(this)
        );
    }

    _saveAs(filename) {
        let pathAndFilename = path.getPathAndFilename(filename);
        // Check if there's already a file open with the same path and filename...
        let existingEditor = this._editorsState.findByPathAndFilename(pathAndFilename.path, pathAndFilename.filename);
        if (existingEditor) {
            this._editors.close(pathAndFilename);
        }
        let editor = this._editors.getActiveEditor();
        if (editor) {
            editor.saveAs(filename);
        }
    }

    _resize(width, height) {
        let activeEditor = this.getActiveEditor();
        activeEditor && activeEditor.resize && activeEditor.resize(width, height);
    }

    _closeFile() {
        let activeEditor = this.getActiveEditor();
        activeEditor && activeEditor.onEditorClose(activeEditor.getPathAndFilename());
    }

    callActiveEditor(func) {
        let activeEditor = this.getActiveEditor();
        activeEditor && activeEditor[func] && activeEditor[func]();
    }
};
