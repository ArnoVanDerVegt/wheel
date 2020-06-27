/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../dispatcher').dispatcher;
const DOMNode    = require('../dom').DOMNode;

let COLORS = {};
COLORS[0] = 'gray';
// Black
COLORS[2] = 'blue';
COLORS[3] = 'green';
COLORS[4] = 'yellow';
COLORS[5] = 'red';
// White
// Brown

exports.COLORS = COLORS;

exports.getComponentColor = function(color) {
    return (color in COLORS) ? COLORS[color] : color;
};

exports.Component = class extends DOMNode {
    constructor(opts) {
        super(opts);
        if (opts.uiOwner) {
            if (typeof opts.uiOwner.getUI !== 'function') {
                console.error(opts.uiOwner);
                throw new Error('Missing uiOwner getUI function.');
            }
            if (typeof opts.uiOwner.getUIId !== 'function') {
                console.error(opts.uiOwner);
                throw new Error('Missing uiOwner getUIId function.');
            }
            opts.ui   = opts.uiOwner.getUI();
            opts.uiId = opts.uiOwner.getUIId();
        }
        if (!('ui' in opts)) {
            console.error('Opts:', opts);
            throw new Error('Missing UI value.');
        }
        if (typeof opts.uiId === 'function') {
            this._uiId = opts.uiId(this);
        } else if ('uiId' in opts) {
            this._uiId = opts.uiId;
        } else {
            this._uiId = 1;
        }
        let ui = opts.ui;
        this._ui            = ui;
        this._id            = opts.id;
        this._dispatch      = opts.dispatch;
        this._value         = opts.value;
        this._title         = opts.title;
        this._tabIndex      = opts.tabIndex;
        this._selected      = opts.selected;
        this._focus         = opts.focus;
        this._open          = opts.open;
        this._disabled      = ('disabled' in opts) ? opts.disabled : false;
        this._hidden        = ('hidden'   in opts) ? opts.hidden   : false;
        this._color         = ('color'    in opts) ? opts.color    : 'green';
        this._width         = ('width'    in opts) ? opts.width    : 0;
        this._height        = ('height'   in opts) ? opts.height   : 0;
        this._style         = opts.style || {};
        this._className     = opts.className     || '';
        this._baseClassName = opts.baseClassName || '';
        this._parentNode    = opts.parentNode;
        this._onFocus       = opts.onFocus;
        this._onBlur        = opts.onBlur;
        this._onClick       = opts.onClick;
        this._onKeyDown     = opts.onKeyDown;
        this._onKeyUp       = opts.onKeyUp;
        this._onMouseDown   = opts.onMouseDown;
        this._onMouseUp     = opts.onMouseUp;
        this._onMouseOut    = opts.onMouseOut;
        this._onGlobalUIId  = ui.addEventListener('Global.UIId', this, this.onGlobalUIId);
        this._dispatchEvent = null;
        if (opts.event) {
            this._dispatchEvent = dispatcher.on(opts.event, this, this.onEvent);
        }
        (typeof this._id === 'function') && this._id(this);
    }

    getUI() {
        return this._ui;
    }

    getUIId() {
        return this._uiId;
    }

    getClassName() {
        return (this._baseClassName + ' ' +
            this._className + ' ' +
            (this._disabled ? 'disabled ' : '') +
            (this._hidden   ? 'hidden '   : '') +
            (this._selected ? 'selected ' : '') +
            (this._checked  ? 'checked '  : '') +
            (this._open     ? 'open '     : '') +
            (this._focus    ? 'focus'     : '') +
            ' ' + this._color).trim();
    }

    setClassName(className) {
        this._className         = className;
        this._element.className = this.getClassName();
        return this;
    }

    setColor(color) {
        this._color             = color;
        this._element.className = this.getClassName();
    }

    setDisabled(disabled) {
        this._element.disabled  = disabled ? 'disabled' : '';
        this._disabled          = disabled;
        this._element.className = this.getClassName();
        return this;
    }

    setHidden(hidden) {
        this._hidden                = hidden;
        this._element.style.display = hidden ? 'none' : 'block';
        this._element.className     = this.getClassName();
        return this;
    }

    setVisible(visible) {
        return this.setHidden(!visible);
    }

    getElement() {
        return this._element;
    }

    setElement(element) {
        this._element = element;
        element.addEventListener('click',     this.onClick.bind(this));
        element.addEventListener('focus',     this.onFocus.bind(this));
        element.addEventListener('blur',      this.onBlur.bind(this));
        element.addEventListener('keydown',   this.onKeyDown.bind(this));
        element.addEventListener('keyup',     this.onKeyUp.bind(this));
        element.addEventListener('mousedown', this.onMouseDown.bind(this));
        element.addEventListener('mouseup',   this.onMouseUp.bind(this));
        element.addEventListener('mouseout',  this.onMouseOut.bind(this));
        if (this._hidden) {
            element.style.display = 'none';
        }
    }

    setValue(value) {
        this._value         = value;
        this._element.value = value;
        return this;
    }

    setTitle(title) {
        this._title         = title;
        this._element.title = title;
        return this;
    }

    setWidth(width) {
        this._element.style.width = width;
    }

    setHeight(height) {
        this._element.style.height = height;
    }

    remove() {
        (typeof this._onGlobalUIId === 'function') && this._onGlobalUIId();
        this._dispatchEvent && this._dispatchEvent();
    }

    onGlobalUIId() {
        if (!this._element) {
            return;
        }
        if (this._uiId === this._ui.getActiveUIId()) {
            if (!this._disabled) {
                this._element.disabled = '';
            }
        } else {
            this._element.disabled = 'disabled';
        }
    }

    onEvent(opts) {
        let element = this._element;
        if (!element) {
            return;
        }
        if ('hidden' in opts) {
            this.setHidden(opts.hidden);
        }
        if ('disabled' in opts) {
            this.setDisabled(opts.disabled);
        }
        if ('x' in opts) {
            element.style.left = opts.x + 'px';
        }
        if ('y' in opts) {
            element.style.top = opts.y + 'px';
        }
        if ('pointerEvents' in opts) {
            element.style.pointerEvents = opts.pointerEvents;
        }
    }

    onFocus() {
        this._focus             = true;
        this._element.className = this.getClassName();
        this._onFocus && this._onFocus.call(this);
    }

    onBlur() {
        this._focus             = false;
        this._element.className = this.getClassName();
        this._onBlur && this._onBlur.call(this);
    }

    onClick(event) {
        if (!this._disabled) {
            this._onClick  && this._onClick(event);
            this._dispatch && dispatcher.dispatch(this._dispatch);
        }
    }

    onKeyDown() {
        if (!this._disabled) {
            this._element.focus();
            this._onKeyDown && this._onKeyDown(event);
        }
    }

    onKeyUp() {
        if (!this._disabled) {
            this._onKeyUp && this._onKeyUp(event);
        }
    }

    onMouseDown() {
        if (!this._disabled) {
            this._element.focus();
            this._onMouseDown && this._onMouseDown(event);
        }
    }

    onMouseUp() {
        this.onCancelEvent(event);
        if (!this._disabled) {
            this._onMouseUp && this._onMouseUp(event);
        }
    }

    onMouseOut() {
        this.onCancelEvent(event);
        if (!this._disabled) {
            this._onMouseOut && this._onMouseOut(event);
        }
    }

    focus() {
        this._element.focus();
        return this;
    }
};
