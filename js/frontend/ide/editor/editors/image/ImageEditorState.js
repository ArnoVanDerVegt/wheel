/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
exports.ImageEditorState = class {
    constructor() {
        this._meta      = false;
        this._grid      = true;
        this._pixelSize = 4;
        this._undoStack = [];
        this._tool      = 'pen';
        this._font      = 0;
        this._monospace = false;
        this._size      = 0;
        this._fill      = 1;
        this._stroke    = 1;
        this._lastLine  = null;
        this._mouseDown = false;
        this._x1        = 0;
        this._y1        = 0;
        this._x2        = 0;
        this._y2        = 0;
        this._dragX     = null;
        this._dragY     = null;
    }

    getMeta() {
        return this._meta;
    }

    setMeta(meta) {
        this._meta = meta;
    }

    getGrid() {
        return this._grid;
    }

    setGrid(grid) {
        this._grid = grid;
    }

    getPixelSize() {
        return this._pixelSize;
    }

    setPixelSize(pixelSize) {
        this._pixelSize = pixelSize;
    }

    getTool() {
        return this._tool;
    }

    setTool(tool) {
        this._tool = tool;
    }

    getFont() {
        return this._font;
    }

    setFont(font) {
        this._font = font;
    }

    getMonospace() {
        return this._monospace;
    }

    setMonospace(monospace) {
        this._monospace = monospace;
    }

    getSize() {
        return this._size;
    }

    setSize(size) {
        this._size = size;
    }

    getFill() {
        return this._fill;
    }

    setFill(fill) {
        this._fill = fill;
    }

    getStroke() {
        return this._stroke;
    }

    setStroke(stroke) {
        this._stroke = stroke;
    }

    getLastLine() {
        return this._lastLine;
    }

    setLastLine(lastLine) {
        this._lastLine = lastLine;
    }

    getMouseDown() {
        return this._mouseDown;
    }

    setMouseDown(mouseDown) {
        this._mouseDown = mouseDown;
    }

    getUndoStackLength() {
        return this._undoStack.length;
    }

    getStartPoint() {
        return {x: this._x1, y: this._y1};
    }

    setStartPoint(x1, y1) {
        this._x1 = x1;
        this._y1 = y1;
        return this;
    }

    getEndPoint() {
        return {x: this._x2, y: this._y2};
    }

    setEndPoint(x2, y2) {
        this._x2 = x2;
        this._y2 = y2;
        return this;
    }

    getRect() {
        return {x1: this._x1, y1: this._y1, x2: this._x2, y2: this._y2};
    }

    setRect(x1, y1, x2, y2) {
        this._x1 = x1;
        this._y1 = y1;
        this._x2 = x2;
        this._y2 = y2;
    }

    getDragX() {
        return this._dragX;
    }

    getDragY() {
        return this._dragY;
    }

    setDrag(x, y) {
        this._dragX = x;
        this._dragY = y;
    }

    undoStackPop() {
        return this._undoStack.pop();
    }

    undoStackPush(item) {
        this._undoStack.push(item);
    }
};
