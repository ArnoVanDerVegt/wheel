/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
exports.SoundEditorState = class {
    constructor() {
        this._undoStack       = [];
        this._zoom            = 0;
        this._playingInterval = null;
        this._mouseDown       = false;
        this._x1              = null;
        this._x2              = null;
        this._offset1         = null;
        this._offset2         = null;
    }

    getZoom() {
        return this._zoom;
    }

    setZoom(zoom) {
        this._zoom = zoom;
    }

    getPlayingInterval() {
        return this._playingInterval;
    }

    setPlayingInterval(playingInterval) {
        this._playingInterval = playingInterval;
    }

    getUndoStackLength() {
        return this._undoStack.length;
    }

    getMouseDown() {
        return this._mouseDown;
    }

    setMouseDown(mouseDown) {
        this._mouseDown = mouseDown;
    }

    getX1() {
        return this._x1;
    }

    setX1(x1) {
        this._x1 = x1;
    }

    getX2() {
        return this._x2;
    }

    setX2(x2) {
        this._x2 = x2;
    }

    setXRange(x1, x2) {
        this._x1 = x1;
        this._x2 = x2;
        return this;
    }

    getOffset1() {
        return this._offset1;
    }

    getOffset2() {
        return this._offset2;
    }

    setOffsetRange(offset1, offset2) {
        this._offset1 = offset1;
        this._offset2 = offset2;
        return this;
    }

    undoStackPop() {
        return this._undoStack.pop();
    }

    undoStackPush(item) {
        this._undoStack.push(item);
    }
};
