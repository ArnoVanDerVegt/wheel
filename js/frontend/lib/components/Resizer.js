/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../dispatcher').dispatcher;
const Component  = require('./component/Component').Component;

exports.Resizer = class extends Component {
    constructor(opts) {
        super(opts);
        this._down      = false;
        this._docX      = null;
        this._docY      = null;
        this._lastX     = null;
        this._lastY     = null;
        this._style     = null;
        this._size      = opts.size;
        this._minSize   = opts.minSize;
        this._varName   = opts.varName;
        this._direction = opts.direction || 'y';
        this._dispatch  = opts.dispatch;
        this._onResize  = opts.onResize;
        this._ui.on('Global.Mouse.Up',   this, this.onDocumentMouseUp);
        this._ui.on('Global.Mouse.Move', this, this.onDocumentMouseMove);
        this.initDOM(opts.parentNode);
        this.createStyle();
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                id:        this.setElement.bind(this),
                className: 'resizer ' + this._direction
            }
        );
    }

    createStyle() {
        let css   = 'body { ' + this._varName + ': ' + this._size + 'px; }';
        let head  = document.head || document.getElementsByTagName('head')[0];
        let style = document.createElement('style');
        if (this._style) {
            head.removeChild(this._style);
        }
        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));
        head.appendChild(style);
        this._style = style;
        this._onResize && this._onResize(this._size);
    }

    onDocumentMouseUp(event) {
        if (this._down) {
            event.preventDefault();
            this._element.className = 'resizer ' + this._direction;
            this._down              = false;
            if (this._dispatch) {
                dispatcher.dispatch(this._dispatch, this._size);
            }
        }
    }

    onDocumentMouseMove(event) {
        this._docX = event.pageX;
        this._docY = event.pageY;
        if (this._down) {
            switch (this._direction) {
                case 'x':
                    let deltaX = this._docX - this._lastX;
                    this._size = Math.max(this._lastSize + deltaX, this._minSize);
                    break;
                case 'y':
                    let deltaY = this._docY - this._lastY;
                    this._size = Math.max(this._lastSize - deltaY, this._minSize);
                    break;
            }
            this.createStyle();
        }
        event.preventDefault();
    }

    onMouseDown(event) {
        this._down              = true;
        this._lastX             = this._docX;
        this._lastY             = this._docY;
        this._lastSize          = this._size;
        this._element.className = 'resizer ' + this._direction + ' down';
        event.preventDefault();
    }

    onMouseUp(event) {
        this.onDocumentMouseUp(event);
    }

    onClick() {
        // Overwrite default component behaviour...
    }

    getSize() {
        return this._size;
    }
};
