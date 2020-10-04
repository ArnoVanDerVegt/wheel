/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const DOMNode = require('../../dom').DOMNode;
const path    = require('../../path');

const getIcon = function(getImage, file) {
    if (file.directory) {
        return {
            className: 'no-select folder-icon',
            type:      'img',
            src:       getImage('images/files/folder.svg')
        };
    }
    let image = 'images/files/file.svg';
    switch (path.getExtension(file.name)) {
        case '.gif':  image = 'images/files/gif.svg';  break;
        case '.help': image = 'images/files/help.svg'; break;
        case '.jpg':  image = 'images/files/jpg.svg';  break;
        case '.jpeg': image = 'images/files/jpg.svg';  break;
        case '.bmp':  image = 'images/files/bmp.svg';  break;
        case '.svg':  image = 'images/files/svg.svg';  break;
        case '.mp3':  image = 'images/files/mp3.svg';  break;
        case '.ogg':  image = 'images/files/ogg.svg';  break;
        case '.png':  image = 'images/files/png.svg';  break;
        case '.rgf':  image = 'images/files/rgf.svg';  break;
        case '.rsf':  image = 'images/files/rsf.svg';  break;
        case '.rtf':  image = 'images/files/rtf.svg';  break;
        case '.txt':  image = 'images/files/txt.svg';  break;
        case '.wav':  image = 'images/files/wav.svg';  break;
        case '.whl':  image = 'images/files/whl.svg';  break;
        case '.whlp': image = 'images/files/whlp.svg'; break;
        case '.woc':  image = 'images/files/woc.svg';  break;
        case '.lms':  image = 'images/files/lms.svg';  break;
        case '.wfrm': image = 'images/files/form.svg'; break;
    }
    return {
        className: 'no-select file-icon',
        type:      'img',
        src:       getImage(image)
    };
};

exports.getIcon = getIcon;

exports.File = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._className = opts.className || 'file';
        this._getImage  = opts.getImage;
        this._tabIndex  = opts.tabIndex;
        this._file      = opts.file;
        this._files     = opts.files;
        this._index     = opts.index;
        this.initDOM(opts.parentNode);
        opts.id(this);
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                id:        this.setElement.bind(this),
                className: this._className,
                children: [
                    getIcon(this._getImage, this._file),
                    {
                        id:        this.setLinkElement.bind(this),
                        type:      'a',
                        href:      '#',
                        className: 'no-select name',
                        innerHTML: this._file.name
                    }
                ]
            }
        );
    }

    setElement(element) {
        this._element = element;
        element.addEventListener('mousedown', this.onMouseDown.bind(this));
        element.addEventListener('click',     this.onClick.bind(this));
    }

    setLinkElement(element) {
        this._linkElement = element;
        element.addEventListener('focus',     this.onFocus.bind(this));
        element.addEventListener('blur',      this.onBlur.bind(this));
        element.addEventListener('keydown',   this.onKeyDown.bind(this));
    }

    setDisabled(disabled) {
        this._linkElement.tabIndex = disabled ? -1 : this._tabIndex;
    }

    onMouseDown(event) {
        this.onCancelEvent(event);
    }

    onKeyDown(event) {
        switch (event.keyCode) {
            case 37: // Left
                break;
            case 38: // Up
                this._files.setPrevActive(this._index);
                break;
            case 39: // Right
                break;
            case 40: // Down
                this._files.setNextActive(this._index);
                break;
        }
    }

    onClick(event) {
        this.onCancelEvent(event);
        this._files.onClickFile(event, this._file);
    }

    onFocus(event) {
        let element = this._element;
        element.className = this.addClassName(element.className, 'focus');
    }

    onBlur(event) {
        let element = this._element;
        element.className = this.removeClassName(element.className, 'focus');
    }

    focus() {
        this._linkElement.focus();
    }
};
