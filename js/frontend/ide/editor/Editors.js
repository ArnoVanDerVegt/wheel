/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher  = require('../../lib/dispatcher').dispatcher;
const path        = require('../../lib/path');
const DOMNode     = require('../../lib/dom').DOMNode;
const Tabs        = require('../../lib/components/Tabs').Tabs;
const Button      = require('../../lib/components/Button').Button;
const tabIndex    = require('../tabIndex');
const HomeScreen  = require('./editors/home/HomeScreen').HomeScreen;
const WheelEditor = require('./editors/text/WheelEditor').WheelEditor;
const VMViewer    = require('./editors/text/VMViewer').VMViewer;
const TextEditor  = require('./editors/text/TextEditor').TextEditor;
const LmsEditor   = require('./editors/text/LmsEditor').LmsEditor;
const SoundEditor = require('./editors/sound/SoundEditor').SoundEditor;
const SoundLoader = require('./editors/sound/SoundLoader').SoundLoader;
const ImageEditor = require('./editors/image/ImageEditor').ImageEditor;
const ImageLoader = require('./editors/image/ImageLoader').ImageLoader;

exports.Editors = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._ui           = opts.ui;
        this._settings     = opts.settings;
        this._brick        = opts.brick;
        this._editorsState = opts.editorsState;
        this._soundLoader  = new SoundLoader();
        this._imageLoader  = new ImageLoader();
        dispatcher
            .on('Editor.Renamed',                  this, this.onEditorRenamed)
            .on('Dialog.YesNoCancel.SaveAndClose', this, this.onCloseAndSave)
            .on('Dialog.YesNoCancel.Close',        this, this.onClose)
            .on('Dialog.YesNoCancel.Cancel',       this, this.onCloseCancel);
        this.initDOM(document.body);
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                className: 'editor-wrapper',
                children: [
                    {
                        className: 'toolbar',
                        children: [
                            {
                                ref:      this.setRef('tabs'),
                                type:     Tabs,
                                ui:       this._ui,
                                uiId:     1,
                                tabIndex: tabIndex.FILE_TABS,
                                contextMenuOptions: [
                                    {title: 'Close',        onClick: this.onContextMenuClose.bind(this)},
                                    {title: 'Close others', onClick: this.onContextMenuCloseOthers.bind(this)},
                                    {title: '-'},
                                    {title: 'New item',     onClick: this.onContextMenuCloseNewItem.bind(this)},
                                    {title: 'Open file',    onClick: this.onContextMenuCloseOpenFile.bind(this)}
                                ]
                            },
                            {
                                className: 'continue-button-wrapper',
                                children: [
                                    {
                                        type:      Button,
                                        ui:        this._ui,
                                        dispatch:  'Button.Continue',
                                        event:     'Button.Continue.Change',
                                        tabIndex:  tabIndex.CONTINUE_BUTTON,
                                        className: 'continue',
                                        disabled:  true,
                                        hidden:    true,
                                        value:     'Continue'
                                    }
                                ]
                            },
                            {
                                type:      Button,
                                ui:        this._ui,
                                dispatch:  'Button.Run',
                                event:     'Button.Run.Change',
                                tabIndex:  tabIndex.RUN_BUTTON,
                                className: 'run',
                                disabled:  true,
                                value:     'Run'
                            },
                            {
                                type:      Button,
                                ui:        this._ui,
                                dispatch:  'Button.Compile',
                                event:     'Button.Compile.Change',
                                tabIndex:  tabIndex.COMPILE_BUTTON,
                                className: 'compile',
                                disabled:  true,
                                value:     'Compile'
                            }
                        ]
                    },
                    {
                        className: 'editor',
                        children: [
                            {
                                ref:       this.setRef('sourceWrapper'),
                                className: 'source-wrapper',
                                children: [
                                    {
                                        ref:      this.setRef('homeScreen'),
                                        type:     HomeScreen,
                                        ui:       this._ui,
                                        settings: this._settings,
                                        brick:    this._brick
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        );
    }

    onContextMenuClose(item) {
        this.closeEditor(item.getMeta(), item.getTitle());
    }

    onContextMenuCloseOthers(item) {
        let tabs = [];
        this._refs.tabs.getTabs().forEach(function(tab) {
            tabs.push({path: tab.getMeta(), filename: tab.getTitle()});
        });
        let index = 0;
        let close = (function(type) {
                if ((type === 'cancel') || (index >= tabs.length)) {
                    this._closeNextCallback = null;
                    return;
                }
                let tab = tabs[index++];
                if (!tab) {
                    return;
                }
                if ((item.getMeta() === tab.path) && (item.getTitle() === tab.filename)) {
                    tab = tabs[index++];
                    if (!tab) {
                        return;
                    }
                }
                this.closeEditor(tab.path, tab.filename);
            }).bind(this);
        this._closeNextCallback = close;
        close();
    }

    onContextMenuCloseNewItem(item) {
        dispatcher.dispatch('Add.Item');
    }

    onContextMenuCloseOpenFile(item) {
        dispatcher.dispatch('Menu.File.Open');
    }

    onClickTab(filename, path) {
        this.showEditorByPathAndFilename(path, filename);
    }

    onCloseAndSave() {
        this._saveAndClose && this._saveAndClose();
    }

    onCloseCancel() {
        this.closeNext('cancel');
    }

    onClose() {
        this.close(this._closeOpts);
    }

    onEditorClose(opts) {
        this.closeEditor(opts.path, opts.filename);
    }

    onEditorRenamed(oldPathAndFilename, newPathAndFilename) {
        this._refs.tabs.renameTab(
            oldPathAndFilename.filename, oldPathAndFilename.path,
            newPathAndFilename.filename, newPathAndFilename.path
        );
    }

    showEditorByPathAndFilename(path, filename) {
        let activeEditor = this._editorsState.showEditorByPathAndFilename(path, filename);
        if (activeEditor) {
            this._refs.tabs.setActiveTab(filename, path);
            dispatcher.dispatch('Editors.ShowEditor', this.getDispatchInfo(activeEditor));
        }
        return activeEditor;
    }

    closeEditor(path, filename) {
        let editor = this._editorsState.findByPathAndFilename(path, filename);
        this._closeOpts = {path: path, filename: filename};
        if (editor.getChanged()) {
            this._saveAndClose = (function() { // Yes
                editor.save();
                this.close(this._closeOpts);
            }).bind(this);
            setTimeout(
                function() {
                    dispatcher.dispatch(
                        'Dialog.YesNoCancel.Show',
                        'Close file',
                        [
                            'The file "' + filename + '" has changed.',
                            'Do you want to save this file?'
                        ],
                        'Dialog.YesNoCancel.SaveAndClose',  // Yes
                        'Dialog.YesNoCancel.Close',         // No
                        'Dialog.YesNoCancel.Cancel'         // Cancel
                    );
                },
                250
            );
        } else {
            this
                .close(this._closeOpts)
                .closeNext('close');
        }
    }

    close(opts) {
        this._refs.tabs.remove(opts.filename, opts.path);
        let lastEditor = this._editorsState.close(opts);
        if (lastEditor) {
            this.showEditorByPathAndFilename(lastEditor.getPath(), lastEditor.getFilename());
        } else {
            dispatcher.dispatch('Screen.Ready');
        }
        dispatcher.dispatch('Editors.CloseEditor', this.getDispatchInfo(lastEditor));
        if (!this._editorsState.getLength()) {
            this._refs.homeScreen.show();
        }
        this.closeNext('close');
        return this;
    }

    closeNext(type) {
        if (typeof this._closeNextCallback === 'function') {
            this._closeNextCallback(type);
        }
    }

    addEditor(opts, editor) {
        this._editorsState.add(editor);
        this.onClickTab(opts.filename, opts.path);
        this._refs.tabs.add({
            title:   opts.filename,
            meta:    opts.path,
            onClick: this.onClickTab.bind(this),
            onClose: (function(title, meta) {
                (opts.filename === 'main.whlp') ? null : this.onEditorClose({path: meta, filename: title});
            }).bind(this)
        });
        dispatcher.dispatch('Editors.OpenEditor', this.getDispatchInfo(editor));
    }

    activateFile(opts) {
        let editor = this._editorsState.findByPathAndFilename(opts.path || '', opts.filename);
        if (!editor) {
            return false;
        }
        this._refs.tabs.setActiveTab(opts.filename, opts.path);
        this.onClickTab(opts.filename, opts.path);
        if (opts.cursorPosition && editor.showCursorPosition) {
            editor.showCursorPosition(opts.cursorPosition);
        }
        if (opts.value && editor.setValue && (path.getExtension(opts.filename) === '.vm')) {
            editor.setValue(opts.value);
        }
        return editor;
    }

    add(opts) {
        let extension = path.getExtension(opts.filename);
        if ([
                '.rgf', '.rsf', '.rtf',
                '.mp3', '.wav', '.ogg',
                '.bmp', '.png', '.jpg', '.jpeg', '.gif',
                '.whl', '.whlp', '.vm',
                '.txt', '.woc',
                '.lms'
            ].indexOf(extension) === -1) {
            return null;
        }
        this._refs.homeScreen.hide();
        let editor = this.activateFile(opts);
        if (editor) {
            return editor;
        }
        opts.ui         = this._ui;
        opts.settings   = this._settings;
        opts.editors    = this;
        opts.parentNode = this._refs.sourceWrapper;
        switch (extension) {
            case '.rgf':
                this.addEditor(opts, new ImageEditor(opts));
                break;
            case '.rsf':
                this.addEditor(opts, new SoundEditor(opts));
                break;
            case '.mp3':
            case '.wav':
            case '.ogg':
                this._soundLoader.load(
                    opts,
                    (function(opts) {
                        this.addEditor(opts, new SoundEditor(opts));
                    }).bind(this)
                );
                break;
            case '.bmp':
            case '.png':
            case '.jpg':
            case '.jpeg':
            case '.gif':
                this._imageLoader.load(
                    opts,
                    (function(opts) {
                        this.addEditor(opts, new ImageEditor(opts));
                    }).bind(this)
                );
                break;
            case '.whl':
            case '.whlp':
                opts.mode    = 'text/x-wheel';
                opts.gutters = ['CodeMirror-linenumbers', 'breakpoints'];
                this.addEditor(opts, new WheelEditor(opts));
                break;
            case '.woc':
                opts.mode    = 'text/x-woc';
                opts.gutters = [];
                this.addEditor(opts, new WheelEditor(opts));
                break;
            case '.vm':
                this.addEditor(opts, new VMViewer(opts));
                break;
            case '.txt':
            case '.rtf':
                this.addEditor(opts, new TextEditor(opts));
                break;
            case '.lms':
                opts.mode    = 'text/x-lms';
                opts.gutters = [];
                this.addEditor(opts, new LmsEditor(opts));
                break;
        }
        return null;
    }

    getDispatchInfo(activeEditor) {
        let canSave     = false;
        let canFind     = false;
        let canFindNext = false;
        let canUndo     = false;
        let canCopy     = false;
        let canPaste    = false;
        let canCompile  = this._editorsState.hasCompilableFile();
        if (activeEditor) {
            canSave     = (['.whl', '.whlp', '.rgf', '.rsf'].indexOf(path.getExtension(activeEditor.getFilename())) !== -1);
            canFind     = activeEditor.getCanFind();
            canFindNext = (activeEditor.getFindText() !== null);
            canUndo     = activeEditor.getCanUndo();
            canCopy     = activeEditor.getCanCopy();
            canPaste    = activeEditor.getCanPaste();
        }
        return {
            openFiles:    this._editorsState.getLength(),
            canSave:      canSave,
            canFind:      canFind,
            canFindNext:  canFindNext,
            canUndo:      canUndo,
            canCopy:      canCopy,
            canPaste:     canPaste,
            canCompile:   canCompile,
            activeEditor: activeEditor
        };
    }

    getBreakpoints() {
        this._editorsState.getBreakpoints();
    }

    getProjectEditors() {
        return this._editorsState.getProjectEditors();
    }

    getActiveEditor() {
        let activeTab = this._refs.tabs.getActiveTab();
        if (!activeTab) {
            return null;
        }
        return this._editorsState.findByPathAndFilename(activeTab.meta, activeTab.title);
    }
};