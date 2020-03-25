/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
exports.FormEditorState = class {
    constructor(opts) {
        this._width     = opts.width;
        this._height    = opts.height;
        this._undoStack = [];
    }

    getUndoStackLength() {
        return this._undoStack.length;
    }

    getWidth() {
        return this._width;
    }

    getHeight() {
        return this._height;
    }

    getMouseDown() {
        return this._mouseDown;
    }

    setMouseDown(mouseDown) {
        this._mouseDown = mouseDown;
    }

    undoStackPop() {
        return this._undoStack.pop();
    }

    undoStackPush(item) {
        this._undoStack.push(item);
    }
};
