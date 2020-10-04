/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher      = require('../../../../lib/dispatcher').dispatcher;
const path            = require('../../../../lib/path');
const getDataProvider = require('../../../../lib/dataprovider/dataProvider').getDataProvider;
const Editor          = require('../Editor').Editor;
const ToolbarTop                          = require('./toolbar/ToolbarTop').ToolbarTop;
const ToolbarBottom                       = require('./toolbar/ToolbarBottom').ToolbarBottom;

exports.ImageViewer = class extends Editor {
    constructor(opts) {
        super(opts);
        this._src = path.join(opts.path, opts.filename);
        this.initDOM(opts.parentNode);
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                ref:       this.setRef('wrapper'),
                className: 'max-w resource-wrapper',
                children: [
                    {
                        type:        ToolbarTop,
                        ui:          this._ui,
                        imageViewer: this
                    },
                    {
                        className: 'resource-content',
                        ref:       this.setRef('resourceContent'),
                        children: [
                            {
                                ref:       this.setRef('resourceContentWrapper'),
                                className: 'resource-content-wrapper',
                                children: [
                                    {
                                        id:        this.setImage.bind(this),
                                        type:      'img',
                                        className: 'resource with-shadow',
                                        style:     {display: 'none'}
                                    },
                                    {
                                        ref:       this.setRef('imageError'),
                                        innerHTML: 'Failed to load image',
                                        className: 'resource error with-shadow',
                                        style:     {display: 'none'}
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        type:        ToolbarBottom,
                        ui:          this._ui,
                        imageViewer: this
                    }
                ]
            }
        );
    }

    setImage(element) {
        element.addEventListener('mousemove', this.onMouseMove.bind(this));
        element.addEventListener('mouseout',  this.onMouseOut.bind(this));
        element.addEventListener('load',      this.onLoad.bind(this));
        element.addEventListener('error',     this.onError.bind(this));
        element.src        = this._src;
        this._imageElement = element;
    }

    onLoad() {
        let imageElement = this._imageElement;
        let element      = this._refs.resourceContentWrapper;
        imageElement.style.display = 'block';
        element.style.width        = (imageElement.naturalWidth  + 64)  + 'px';
        element.style.height       = (imageElement.naturalHeight + 64)  + 'px';
    }

    onError() {
        let imageError = this._refs.imageError;
        imageError.innerHTML     = 'Failed to load image "' + this._filename + '".';
        imageError.style.display = 'block';
    }

    onMouseMove(event) {
        this._refs.cursorPosition.innerHTML = Math.min(Math.max(event.offsetX, 0), this._imageElement.naturalWidth - 1) + ',' +
            Math.min(Math.max(event.offsetY, 0), this._imageElement.naturalHeight - 1);
    }

    onMouseOut(event) {
        this._refs.cursorPosition.innerHTML = '';
    }
};
