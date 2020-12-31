/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const path            = require('../../../../shared/lib/path');
const dispatcher      = require('../../../lib/dispatcher').dispatcher;
const DOMNode         = require('../../../lib/dom').DOMNode;
const getDataProvider = require('../../../lib/dataprovider/dataProvider').getDataProvider;

exports.Editor = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._ev3            = opts.ev3;
        this._poweredUp      = opts.poweredUp;
        this._ui             = opts.ui;
        this._settings       = opts.settings;
        this._editors        = opts.editors;
        this._path           = opts.path;
        this._filename       = opts.filename;
        this._value          = opts.value || '';
        this._changed        = !!opts.changed;
        this._findText       = null;
        this._removeElements = [];
        this._lastCursor     = null;
    }

    remove() {
        this._refs.wrapper.parentNode.removeChild(this._refs.wrapper);
        while (this._removeElements.length) {
            this._removeElements.pop().remove();
        }
    }

    setFileSavedElement(element) {
        this._fileSavedElement = element;
    }

    setFilenameSavedElement(element) {
        this._filenameSavedElement = element;
    }

    getUIId(element) {
        if (element instanceof DOMNode) {
            this._removeElements.push(element);
        } else {
            throw new Error('DOMNode instance expected, got: ' + element);
        }
        return 1;
    }

    getValue() {
        return null;
    }

    setValue(value, reset) {
    }

    getFilename() {
        return this._filename;
    }

    getPath() {
        return this._path;
    }

    getPathAndFilename() {
        return {path: this._path, filename: this._filename};
    }

    getChanged() {
        return this._changed;
    }

    setChanged(changed) {
        this._changed = changed;
    }

    getCanFind() {
        return false;
    }

    getFindText() {
        return this._findText;
    }

    getBreakpoints() {
        return [];
    }

    getCanUndo() {
        return false;
    }

    getCanCopy() {
        return false;
    }

    getCanPaste() {
        return false;
    }

    getCanFormat() {
        return false;
    }

    getEditor() {
        return null;
    }

    clearAllBreakpoints() {
    }

    hideBreakpoint(lineNum) {
    }

    showBreakpoint(lineNum) {
    }

    updateBreakpoints(callback) {
    }

    disableBreakpoints() {
    }

    enableBreakpoints() {
    }

    show() {
        if (this._refs.wrapper) {
            this._refs.wrapper.style.display = 'block';
            this.updateElements();
        }
    }

    hide() {
        this._refs.wrapper.style.display = 'none';
    }

    pathAndFilenameEqual(p, filename) {
        if (p === null) {
            return (path.removeSlashes(this._filename) === path.removeSlashes(filename));
        }
        return (path.removeSlashes(this._filename) === path.removeSlashes(filename)) &&
            (path.removeSlashes(this._path) === path.removeSlashes(p));
    }

    showSaveError(message) {
        let documentPath = this._settings.getDocumentPath();
        if (documentPath.substr(-1) !== '/') {
            documentPath += '/';
        }
        let i = message.indexOf(documentPath);
        if (i !== -1) {
            let j = documentPath.length;
            message = message.substr(0, i) + message.substr(i + j, message.length - i - j);
        }
        dispatcher.dispatch(
            'Dialog.Alert.Show',
            {
                title: 'Error: Failed to save file',
                lines: [message]
            }
        );
    }

    save(callback) {
        let documentPath = this._settings.getDocumentPath();
        let filename     = path.removePath(documentPath, path.join(this._path, this._filename));
        getDataProvider().getData(
            'post',
            'ide/file-save',
            {
                filename: path.join(documentPath, filename),
                data:     this.getValue()
            },
            (data) => {
                try {
                    data = JSON.parse(data);
                } catch (error) {
                    data = {success: false, error: 'Invalid data.'};
                }
                if (data.success) {
                    this.onFileSaved(this._filename);
                } else {
                    this.showSaveError(data.error || 'Unknown error.');
                }
                if (typeof callback === 'function') {
                    callback();
                }
            }
        );
    }

    saveAs(filename) {
        let oldPathAndFilename = {path: this._path, filename: this._filename};
        let pathAndFilename    = path.getPathAndFilename(filename);
        this._path     = pathAndFilename.path;
        this._filename = pathAndFilename.filename;
        this.save(() => {
            dispatcher.dispatch('Editor.Renamed', oldPathAndFilename, pathAndFilename);
        });
    }

    updateElements() {
    }

    restoreCursor() {
    }

    onFileSavedHide() {
        this._onFileSaved                = null;
        this._fileSavedElement.className = 'bottom-options hidden';
    }

    onFileSaved(filename) {
        this._onFileSaved && clearTimeout(this._onFileSaved);
        if (this._fileSavedElement && this._filenameSavedElement) {
            this._fileSavedElement.className     = 'bottom-options';
            this._filenameSavedElement.innerHTML = 'Saved: <i>' + filename + '</i>';
            this._onFileSaved                    = setTimeout(this.onFileSavedHide.bind(this), 1000);
        }
        this._changed = false;
    }
};
