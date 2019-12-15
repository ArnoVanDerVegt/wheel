/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const DOMNode    = require('../../dom').DOMNode;
const dispatcher = require('../../dispatcher').dispatcher;

exports.Item = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._ui              = opts.ui;
        this._activeDirectory = '';
        this._fullPath        = opts.path + '/' + opts.file.name;
        this._path            = opts.path;
        this._fileTree        = opts.fileTree;
        this._file            = opts.file;
        this._getImage        = opts.getImage;
        this._contextMenu     = opts.contextMenu;
        this._selected        = false;
        this._focus           = false;
        this._fileTree.setFullPathItem(this, this._fullPath);
    }

    getElement() {
        return this._element;
    }

    setElement(element) {
        this._element = element;
        element._item = this;
        element.addEventListener('click',     this.onCancelEvent.bind(this));
        element.addEventListener('mousedown', this.onCancelEvent.bind(this));
    }

    setNameElement(element) {
        this._nameElement = element;
        element._item     = this;
        element.addEventListener('click',       this.onClickName.bind(this));
        element.addEventListener('mouseup',     this.onCancelEvent.bind(this));
        element.addEventListener('mousedown',   this.onCancelEvent.bind(this));
        element.addEventListener('contextmenu', this.onContextMenu.bind(this));
        element.addEventListener('keydown',     this.onKeyDown.bind(this));
        element.addEventListener('focus',       this.onFocus.bind(this));
        element.addEventListener('blur',        this.onBlur.bind(this));
    }

    getFullPath() {
        return this._fullPath;
    }

    getPath() {
        return this._path;
    }

    getName() {
        return this._file.name;
    }

    getNameClassName() {
        return 'name' +
            (this._selected ? ' selected' : '') +
            (this._focus    ? ' focus'    : '');
    }

    isDirectory() {
        return false;
    }

    onKeyDown(event) {
        this._fileTree.onKeyDown(event);
    }

    onContextMenu(event) {
    }

    onFocus() {
        this._focus                 = true;
        this._nameElement.className = this.getNameClassName();
    }

    onBlur() {
        this._focus                 = false;
        this._nameElement.className = this.getNameClassName();
    }

    focus() {
        this._nameElement.focus();
    }
};
