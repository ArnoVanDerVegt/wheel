/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const path       = require('../path');
const dispatcher = require('../dispatcher').dispatcher;
const Component  = require('./Component').Component;

exports.Image = class extends Component {
    constructor(opts) {
        opts.baseClassName = 'image';
        super(opts);
        this._getFormPath       = ('getFormPath' in opts) ? opts.getFormPath : null;
        this._getDataProvider   = opts.getDataProvider;
        this._naturalSize       = opts.naturalSize;
        this._width             = opts.width  || 20;
        this._height            = opts.height || 20;
        this._src               = opts.src    || '';
        this._error             = true;
        this._debounceTimeout   = null;
        this._onFilenameChanged = dispatcher.on('Editor.Changed.Filename', this, this.onFilenameChanged);
        this.initDOM(opts.parentNode);
    }

    initDOM(parentNode) {
        let style  = this._style || {};
        style.width  = this._width  + 'px';
        style.height = this._height + 'px';
        this.create(
            parentNode,
            {
                className: this.getClassName(),
                id:        this.setElement.bind(this),
                style:     style,
                children: [
                    {
                        id:     this.setImageElement.bind(this),
                        type:   'img',
                        width:  this._width,
                        height: this._height,
                        style: {
                            display: 'none'
                        }
                    }
                ]
            }
        );
        this.loadImage();
    }

    remove() {
        this._onFilenameChanged();
        super.remove();
    }

    showError(filename) {
        if (this._debounceTimeout) {
            clearTimeout(this._debounceTimeout);
        }
        this._debounceTimeout = setTimeout(
            () => {
                this._debounceTimeout = null;
                dispatcher.dispatch(
                    'Console.Log',
                    {
                        type:    'Error',
                        message: 'Error: File "' + filename + '" not found.'
                    }
                );
            },
            250
        );
    }

    loadImage() {
        let src = this._src;
        if (typeof src !== 'string') {
            return;
        }
        if (src.substr(0, 7) === 'http://') {
            this._imageElement.src = src;
        } else if (typeof this._getFormPath === 'function') {
            let filename = path.join(this._getFormPath(), src);
            this._getDataProvider().getData(
                'get',
                'ide/path-exists',
                {path: filename},
                (data) => {
                    let exists = false;
                    try {
                        exists = JSON.parse(data).exists;
                    } catch (error) {
                    }
                    if (exists) {
                        this._imageElement.src = filename;
                    } else {
                        this.showError(filename);
                    }
                }
            );
        }
    }

    setImageElement(imageElement) {
        this._imageElement = imageElement;
        imageElement.addEventListener('load',  this.onImageLoad.bind(this));
        imageElement.addEventListener('error', this.onImageError.bind(this));
    }

    setNaturalSize() {
        if (this._error) {
            return;
        }
        let imageElement = this._imageElement;
        let style        = this._element.style;
        if (this._naturalSize) {
            style.width  = imageElement.naturalWidth  + 'px';
            style.height = imageElement.naturalHeight + 'px';
        } else {
            style.width  = this._width + 'px';
            style.height = this._height + 'px';
        }
    }

    /**
     * This event is called when the filename or path of the form is changed.
     * Because the image path is based on the form path the image must be reloaded.
    **/
    onFilenameChanged() {
        this.loadImage();
    }

    onImageLoad(event) {
        this._error                      = false;
        this._imageElement.style.display = 'block';
        this.setNaturalSize();
    }

    onImageError(event) {
        this._error                      = true;
        this._imageElement.style.display = 'none';
        if (this._src.substr(0, 7) === 'http://') {
            this.showError(this._src);
        }
    }

    onEvent(opts) {
        let element = this._element;
        let style   = element.style;
        if ('width' in opts) {
            this._width  = parseInt(opts.width, 10);
            style.width  = this._width + 'px';
        }
        if ('height' in opts) {
            this._height = parseInt(opts.height, 10);
            style.height = this._height + 'px';
        }
        if ('naturalSize' in opts) {
            this._naturalSize = opts.naturalSize;
            this.setNaturalSize();
        }
        if ('src' in opts) {
            this._src    = opts.src;
            this.loadImage();
        }
        super.onEvent(opts);
    }
};

exports.Component = exports.Image;
