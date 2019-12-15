/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const Emitter    = require('./Emitter').Emitter;
const dispatcher = require('./dispatcher').dispatcher;

/* Class to handle tabs in different layers in the UI */
exports.UIState = class extends Emitter {
    constructor() {
        super();
        this._uiId           = 1;
        this._uiIdStack      = [];
        this._keyMetaDown    = false;
        this._keyControlDown = false;
        document.addEventListener('mousedown', this.onMouseDown.bind(this));
        document.addEventListener('mousemove', this.onMouseMove.bind(this));
        document.addEventListener('mouseup',   this.onMouseUp.bind(this));
        document.addEventListener('keydown',   this.onKeyDown.bind(this));
        document.addEventListener('keyup',     this.onKeyUp.bind(this));
        window.addEventListener('blur',  this.onBlur.bind(this));
        window.addEventListener('focus', this.onFocus.bind(this));
        dispatcher.on('Global.HotKey.Clear', this, this.onClearHotKey);
    }

    getNextUIId() {
        this._uiId++;
        return this._uiId;
    }

    getActiveUIId() {
        if (this._uiIdStack.length) {
            return this._uiIdStack[this._uiIdStack.length - 1];
        }
        return 1;
    }

    /**
     * This function is used for the hotkeys in the main menu...
    **/
    getKeyMetaDown() {
        return this._keyMetaDown;
    }

    /**
     * This function is used for the hotkeys in the main menu...
    **/
    getKeyControlDown() {
        return this._keyControlDown;
    }

    preventBrowserKeyPressed(event) {
        if ((this._keyControlDown || this._keyMetaDown) && (['p', 's'].indexOf(event.key) !== -1)) {
            event.preventDefault(); // Prevent browser save/print dialog...
        }
    }

    pushUIId(uiId) {
        this._uiIdStack.push(uiId);
        this.emit('Global.UIId');
    }

    popUIId(uiId) {
        this._uiIdStack.pop();
        this.emit('Global.UIId');
    }

    onClearHotKey() {
        this._keyMetaDown    = false;
        this._keyControlDown = false;
    }

    onMouseDown(event) {
        this.emit('Global.Mouse.Down', event);
    }

    onMouseMove(event) {
        this.emit('Global.Mouse.Move', event);
    }

    onMouseUp(event) {
        this.emit('Global.Mouse.Up', event);
    }

    onKeyDown(event) {
        this.preventBrowserKeyPressed(event);
        switch (event.key) {
            case 'Control':
                this._keyControlDown = true;
                break;
            case 'Meta':
                this._keyMetaDown = true;
                break;
        }
        this.emit('Global.Key.Down', event);
    }

    onKeyUp(event) {
        this.preventBrowserKeyPressed(event);
        switch (event.key) {
            case 'Control':
                this._keyControlDown = false;
                break;
            case 'Meta':
                this._keyMetaDown = false;
                break;
        }
        this.emit('Global.Key.Up', event);
    }

    onBlur() {
        this.emit('Global.Window.Blur', event);
    }

    onFocus() {
        this.emit('Global.Window.Focus', event);
    }
};
