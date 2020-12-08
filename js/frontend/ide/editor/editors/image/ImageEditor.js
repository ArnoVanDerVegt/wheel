/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const Editor           = require('../Editor').Editor;
const Clipboard        = require('../Clipboard');
const dispatcher       = require('../../../../lib/dispatcher').dispatcher;
const Grid             = require('./Grid').Grid;
const Selection        = require('./selection/Selection').Selection;
const SelectionCopy    = require('./selection/SelectionCopy').SelectionCopy;
const SelectionText    = require('./selection/SelectionText').SelectionText;
const TextSmall        = require('./text/TextSmall').TextSmall;
const TextMedium       = require('./text/TextMedium').TextMedium;
const TextLarge        = require('./text/TextLarge').TextLarge;
const ToolbarTop       = require('./toolbar/ToolbarTop').ToolbarTop;
const ToolbarBottom    = require('./toolbar/ToolbarBottom').ToolbarBottom;
const Image            = require('./Image').Image;
const ImageEditorState = require('./ImageEditorState').ImageEditorState;
const TRANSPARENT      = require('./Image').TRANSPARENT;

exports.ImageEditor = class extends Editor {
    constructor(opts) {
        super(opts);
        this._imageEditorState = new ImageEditorState();
        this._texts            = [new TextSmall({}), new TextMedium({}), new TextLarge({})];
        this._canvasElement    = null;
        this.initDOM(opts.parentNode);
    }

    show() {
        super.show();
        dispatcher.dispatch('Screen.ImageData', this._image.getImageData());
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
                        imageEditor: this
                    },
                    {
                        ref:       this.setRef('imageResourceContent'),
                        className: 'resource-content',
                        children: [
                            {
                                id:        this.setResourceContentWrapperElement.bind(this),
                                className: 'resource-content-wrapper',
                                children: [
                                    {
                                        id:               this.setCanvasElement.bind(this),
                                        imageEditorState: this._imageEditorState,
                                        type:             'canvas',
                                        className:        'resource with-shadow'
                                    },
                                    {
                                        id:               this.setSelectionCopyElement.bind(this),
                                        imageEditorState: this._imageEditorState,
                                        type:             SelectionCopy
                                    },
                                    {
                                        id:               this.setSelectionTextElement.bind(this),
                                        imageEditorState: this._imageEditorState,
                                        type:             SelectionText
                                    },
                                    {
                                        id:               this.setGridElement.bind(this),
                                        type:             Grid,
                                        imageEditorState: this._imageEditorState,
                                        onMouseMove:      this.onMouseMove.bind(this),
                                        onMouseOut:       this.onMouseOut.bind(this),
                                        onMouseDown:      this.onMouseDown.bind(this),
                                        onMouseUp:        this.onMouseUp.bind(this)
                                    },
                                    {
                                        id:               this.setSelectionElement.bind(this),
                                        imageEditorState: this._imageEditorState,
                                        type:             Selection
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        ref:       this.setRef('metaResourceContent'),
                        className: 'resource-content hidden',
                        children: [
                            {
                                type:      'pre',
                                className: 'wheel'
                            }
                        ]
                    },
                    {
                        type:        ToolbarBottom,
                        ui:          this._ui,
                        imageEditor: this
                    }
                ]
            }
        );
    }

    initElement(element) {
        let pixelSize = this._imageEditorState.getPixelSize();
        let value     = this._value;
        let width     = value.width  * pixelSize;
        let height    = value.height * pixelSize;
        element.width        = width;
        element.height       = height;
        element.style.width  = width  + 'px';
        element.style.height = height + 'px';
        return element;
    }

    drawEnd() {
        let imageEditorState = this._imageEditorState;
        let undo             = {tool: imageEditorState.getTool()};
        switch (this._imageEditorState.getTool()) {
            case 'pen':
            case 'line':
            case 'rect':
            case 'circle':
                undo.data = imageEditorState.getLastLine();
                break;
        }
        if (undo.data) {
            this
                .addUndo(undo)
                .updateElements();
        }
        imageEditorState.setDrag(null, null);
        imageEditorState.setMouseDown(false);
        imageEditorState.setLastLine(null);
        this._image.resetLastPixels();
        dispatcher.dispatch('Screen.ImageData', this._image.getImageData());
    }

    hideSelection() {
        this._selectionElement.hide();
        this._selectionCopyElement.hide();
        this._selectionTextElement.hide();
        dispatcher
            .dispatch('ImageEditor.Selection.Hide')
            .dispatch('Editor.Changed', this._editors.getDispatchInfo(this));
        return this;
    }

    onSelectTool(tool) {
        if (this._imageEditorState.getTool() === 'text') {
            this.applyText();
        }
        this._imageEditorState.setTool(['pen', 'line', 'rect', 'circle', 'text', 'select'][tool]);
        this
            .hideSelection()
            .updateElements();
    }

    onSelectFont(font) {
        this._imageEditorState.setFont(font);
        this.updateText();
    }

    onSelectZoom(zoom) {
        let pixelSize = [2, 4, 6, 8][zoom];
        if (pixelSize === this._imageEditorState.getPixelSize()) {
            return;
        }
        this._imageEditorState.setPixelSize(pixelSize);
        this.setResourceContentWrapperElement(this._resourceContentWrapperElement);
        this._gridElement.initElement();
        this._gridElement.setValue(this._value);
        this.initElement(this._canvasElement);
        this.initElement(this._selectionElement.getElement());
        this.initElement(this._selectionCopyElement.getElement());
        this.initElement(this._selectionTextElement.getElement());
        this._image.render();
    }

    onChangeMonospace(monospace) {
        this._imageEditorState.setMonospace(monospace);
        this.updateText();
    }

    onSelectFill(fill) {
        let imageEditorState = this._imageEditorState;
        imageEditorState.setFill(fill);
        (imageEditorState.getTool() === 'text') && this.updateText();
    }

    onSelectStroke(stroke) {
        let imageEditorState = this._imageEditorState;
        imageEditorState.setStroke(stroke);
        (imageEditorState.getTool() === 'text') && this.updateText();
    }

    onSelectSize(size) {
        this._imageEditorState.setSize(size);
    }

    onSelectGrid() {
        let imageEditorState = this._imageEditorState;
        imageEditorState.setGrid(!imageEditorState.getGrid());
        this._refs.gridToggle.setClassName('toolbar-button' + (imageEditorState.getGrid() ? ' active' : ''));
        this._gridElement.setVisible(imageEditorState.getGrid());
    }

    onSelectMeta() {
        let imageEditorState = this._imageEditorState;
        imageEditorState.setMeta(!imageEditorState.getMeta());
        if (imageEditorState.getMeta()) {
            this._refs.metaResourceContent.childNodes[0].innerHTML = this._image.getMeta(this._filename);
        }
        this._refs.meta.setClassName('toolbar-button' + (imageEditorState.getMeta() ? ' active' : ''));
        this.updateElements();
    }

    onCopy() {
        let data = this._selectionCopyElement.getData();
        if (data) {
            Clipboard.clipboard.copy(Clipboard.TYPE_IMAGE, data);
            this
                .hideSelection()
                .updateElements();
        }
    }

    onPaste() {
        if (Clipboard.clipboard.getType() !== Clipboard.TYPE_IMAGE) {
            return;
        }
        let data = Clipboard.clipboard.getData();
        if (!data) {
            return;
        }
        let imageEditorState = this._imageEditorState;
        if (imageEditorState.getTool() !== 'select') {
            this.onSelectTool(5);
        }
        imageEditorState.setRect(data.x1, data.y1, data.x2, data.y2);
        this._selectionElement.showRect(imageEditorState.getRect());
        this._selectionCopyElement.setData(data);
    }

    onMouseMove(event) {
        this.onCancelEvent(event);
        let imageEditorState = this._imageEditorState;
        let cursorPosition   = this.getCursorPosition(event);
        let endPoint         = imageEditorState.getEndPoint();
        this._refs.cursorPosition.innerHTML = cursorPosition.x + ',' + cursorPosition.y;
        if (!imageEditorState.getMouseDown() || ((cursorPosition.x === endPoint.x) && (cursorPosition.y === endPoint.y))) {
            return;
        }
        let rect = imageEditorState.getRect();
        let x1   = rect.x1;
        let y1   = rect.y1;
        let x2   = rect.x2;
        let y2   = rect.y2;
        if (imageEditorState.getTool() !== 'text') {
            imageEditorState.setEndPoint(cursorPosition.x, cursorPosition.y);
            x2 = cursorPosition.x;
            y2 = cursorPosition.y;
            let n;
            if (imageEditorState.getTool() !== 'line') {
                if (x1 > x2) {
                    n  = x1;
                    x1 = x2;
                    x2 = n;
                }
                if (y1 > y2) {
                    n  = y1;
                    y1 = y2;
                    y2 = n;
                }
            }
        }
        this.applyTool(x1, y1, x2, y2, cursorPosition);
    }

    onMouseOut(event) {
        this.onCancelEvent(event);
        this._refs.cursorPosition.innerHTML = '';
        if (this._imageEditorState.getMouseDown()) {
            this.drawEnd();
        }
    }

    onMouseDown(event) {
        this.onCancelEvent(event);
        let imageEditorState = this._imageEditorState;
        let cursorPosition   = this.getCursorPosition(event);
        let selectionElement = this._selectionElement;
        imageEditorState.setMouseDown(true);
        switch (imageEditorState.getTool()) {
            case 'pen':
                imageEditorState.setLastLine([this._image.drawPixel(cursorPosition.x, cursorPosition.y, 1)]);
                break;
            case 'text':
            case 'select':
                if (selectionElement.getInside(cursorPosition.x, cursorPosition.y)) {
                    imageEditorState.setDrag(cursorPosition.x, cursorPosition.y);
                } else {
                    let data;
                    let selectionElement;
                    if (imageEditorState.getTool() === 'text') {
                        selectionElement = this._selectionTextElement;
                        data             = selectionElement.getData();
                    } else {
                        selectionElement = this._selectionCopyElement;
                        data             = selectionElement.getData().data;
                    }
                    if (data) {
                        let undo = {tool: imageEditorState.getTool()};
                        let x    = selectionElement.getX1();
                        let y    = selectionElement.getY1();
                        if (this._imageEditorState.getTool() === 'select') {
                            undo.data = this._image.drawData(x, y, data);
                        } else {
                            undo.data = this._image.drawDataConditional(x, y, data);
                        }
                        if (undo.data) {
                            this
                                .addUndo(undo)
                                .updateElements();
                        }
                    }
                    this.hideSelection();
                    imageEditorState.setDrag(null, null);
                    imageEditorState
                        .setStartPoint(cursorPosition.x, cursorPosition.y)
                        .setEndPoint(null, null);
                    if (imageEditorState.getTool() === 'text') {
                        this._refs.text.setValue('');
                        this.updateText();
                    }
                }
            default:
                imageEditorState
                    .setStartPoint(cursorPosition.x, cursorPosition.y)
                    .setEndPoint(null, null);
                break;
        }
    }

    onMouseUp(event) {
        this.onCancelEvent(event);
        let imageEditorState = this._imageEditorState;
        switch (imageEditorState.getTool()) {
            case 'select':
                if (imageEditorState.getDragX() === null) {
                    this._selectionCopyElement.copy(this._image);
                    this.updateElements();
                    dispatcher.dispatch('Editor.Changed', this._editors.getDispatchInfo(this));
                }
                break;
            case 'text':
                imageEditorState.setStartPoint(
                    this._selectionTextElement.getX1(),
                    this._selectionTextElement.getY1()
                );
                break;
        }
        this.drawEnd();
    }

    onUndo() {
        if (!this._imageEditorState.getUndoStackLength()) {
            return;
        }
        let undo = this._imageEditorState.undoStackPop();
        switch (undo.tool) {
            case 'pen':
            case 'line':
            case 'rect':
            case 'circle':
            case 'select':
            case 'text':
                this._image.drawLastLine(undo.data);
                break;
            case 'crop':
                this.setCropValue(undo.data);
                break;
        }
        this
            .hideSelection()
            .updateElements();
        dispatcher
            .dispatch('Screen.ImageData', this._image.getImageData())
            .dispatch('Editor.Changed',   this._editors.getDispatchInfo(this));
        this._changed = this._imageEditorState.getUndoStackLength();
    }

    onKeyUp() {
        this.updateText();
    }

    onFileSavedHide() {
        super.onFileSavedHide();
        this.updateElements();
    }

    onFileSaved(filename) {
        this._refs.fontOptions.className = 'bottom-options hidden';
        super.onFileSaved(filename);
    }

    updateText() {
        let imageEditorState = this._imageEditorState;
        let text             = this._texts[imageEditorState.getFont()];
        let s                = this._refs.text.getValue();
        let startPoint       = imageEditorState.getStartPoint();
        imageEditorState.setEndPoint(
            startPoint.x + text.getTextWidth(s, imageEditorState.getMonospace()) + 1,
            startPoint.y + text.getTextHeight() + 1
        );
        let rect = imageEditorState.getRect();
        this._selectionElement.showRect(rect);
        this._selectionTextElement.showRect(rect);
        this._selectionTextElement.setText(s, text);
    }

    updateElements() {
        let refs = this._refs;
        if (this._imageEditorState.getMeta()) {
            refs.metaResourceContent.className         = 'resource-content';
            refs.imageResourceContent.className        = 'resource-content hidden';
            refs.bottomDefaultOptions.className        = 'bottom-options hidden';
            refs.topDefaultOptions.className           = 'top-options hidden';
            refs.fontOptions.className                 = 'bottom-options hidden';
            refs.gridToggle.getElement().style.display = 'none';
            refs.cursorPosition.innerHTML              = 'meta';
        } else {
            refs.undo.setDisabled(!this._imageEditorState.getUndoStackLength);
            refs.topDefaultOptions.className           = 'top-option';
            refs.gridToggle.getElement().style.display = 'block';
            refs.bottomDefaultOptions.className        = 'bottom-options right';
            refs.imageResourceContent.className        = 'resource-content';
            refs.metaResourceContent.className         = 'resource-content hidden';
            refs.cursorPosition.innerHTML              = '';
            let pasteOk = (Clipboard.clipboard.getType() === Clipboard.TYPE_IMAGE);
            this._refs.paste.setDisabled(!pasteOk);
            switch (this._imageEditorState.getTool()) {
                case 'select':
                    let copyOk = this._selectionCopyElement.getHasSelection();
                    refs.copy.setDisabled(!copyOk);
                    refs.fontOptions.className = 'bottom-options hidden';
                    break;
                case 'text':
                    refs.copy.setDisabled(true);
                    refs.fontOptions.className = 'bottom-options';
                    break;
                default:
                    refs.copy.setDisabled(true);
                    refs.fontOptions.className = 'bottom-options hidden';
                    break;
            }
        }
    }

    applyText() {
        let selectionTextElement = this._selectionTextElement;
        let data                 = this._selectionTextElement.getData();
        if (data) {
            let undo = {
                    tool: 'text',
                    data: this._image.drawData(selectionTextElement.getX1(), selectionTextElement.getY1(), data)
                };
            if (undo.data) {
                this
                    .addUndo(undo)
                    .updateElements();
            }
            this._refs.text.setValue('');
        }
    }

    applyTool(x1, y1, x2, y2, cursorPosition) {
        let image            = this._image;
        let imageEditorState = this._imageEditorState;
        let stroke           = imageEditorState.getStroke();
        let lastLine         = imageEditorState.getLastLine();
        let dragX            = imageEditorState.getDragX();
        let dragY            = imageEditorState.getDragY();
        let selectionElement = this._selectionElement;
        switch (imageEditorState.getTool()) {
            case 'pen':
                if (stroke !== TRANSPARENT) {
                    image.addPixels(lastLine, image.drawPixels(cursorPosition.x, cursorPosition.y));
                }
                break;
            case 'line':
                if (stroke !== TRANSPARENT) {
                    if (lastLine) {
                        image
                            .drawLastLine(lastLine)
                            .resetLastPixels();
                    }
                    imageEditorState.setLastLine(image.drawLine(x1, y1, x2, y2));
                }
                break;
            case 'rect':
                if (lastLine) {
                    image
                        .drawLastLine(lastLine)
                        .resetLastPixels();
                }
                imageEditorState.setLastLine(image.drawRect(x1, y1, x2, y2));
                break;
            case 'circle':
                if (lastLine) {
                    image
                        .drawLastLine(lastLine)
                        .resetLastPixels();
                }
                imageEditorState.setLastLine(image.drawCircle(x1, y1, x2, y2));
                break;
            case 'text':
                if (dragX === null) {
                    selectionElement.show(x1, y1, x2, y2);
                    this._selectionTextElement.show(x1, y1, x2, y2);
                } else {
                    let deltaX = cursorPosition.x - dragX;
                    let deltaY = cursorPosition.y - dragY;
                    selectionElement.move(deltaX, deltaY);
                    this._selectionTextElement.move(deltaX, deltaY);
                    imageEditorState.setDrag(cursorPosition.x, cursorPosition.y);
                }
                break;
            case 'select':
                if (dragX === null) {
                    if (selectionElement.show(x1, y1, x2, y2)) {
                        dispatcher.dispatch('ImageEditor.Selection.Show');
                    }
                    this._selectionCopyElement.show(x1, y1, x2, y2);
                } else {
                    let deltaX = cursorPosition.x - dragX;
                    let deltaY = cursorPosition.y - dragY;
                    selectionElement.move(deltaX, deltaY);
                    this._selectionCopyElement.move(deltaX, deltaY);
                    imageEditorState.setDrag(cursorPosition.x, cursorPosition.y);
                }
                break;
        }
    }

    getCanUndo() {
        return this._imageEditorState.getUndoStackLength();
    }

    getCanCopy() {
        return this._selectionCopyElement.getHasSelection();
    }

    getCanPaste() {
        return (Clipboard.clipboard.getType() === Clipboard.TYPE_IMAGE);
    }

    getValue() {
        return this._image.getValue();
    }

    getCursorPosition(event) {
        let element = this._canvasElement;
        let offsetX = element.offsetLeft;
        let offsetY = element.offsetTop;
        let parent  = element.offsetParent;
        while (parent) {
            offsetX += parent.offsetLeft;
            offsetY += parent.offsetTop;
            parent = parent.offsetParent;
        }
        let x = event.clientX - offsetX + element.offsetWidth / 2;
        let y = event.clientY - offsetY + element.offsetHeight / 2;
        parent = element.offsetParent.offsetParent;
        let image     = this._image;
        let pixelSize = this._imageEditorState.getPixelSize();
        return {
            x: Math.max(Math.min(Math.round((x + parent.scrollLeft) / pixelSize - 0.5), image.getWidth()  - 1), 0),
            y: Math.max(Math.min(Math.round((y + parent.scrollTop)  / pixelSize - 0.5), image.getHeight() - 1), 0)
        };
    }

    setResourceContentWrapperElement(element) {
        this._resourceContentWrapperElement = element;
        let value     = this._value;
        let pixelSize = this._imageEditorState.getPixelSize();
        let width     = value.width  * pixelSize + 64;
        let height    = value.height * pixelSize + 64;
        element.style.width  = width  + 'px';
        element.style.height = height + 'px';
    }

    setCanvasElement(element) {
        this._canvasElement = this.initElement(element);
        this._image         = new Image({
            imageEditorState: this._imageEditorState,
            canvas:           element,
            value:            this._value
        });
        dispatcher.dispatch('Screen.ImageData', this._image.getImageData());
    }

    setGridElement(element) {
        this._gridElement = element.setValue(this._value);
    }

    setSelectionCopyElement(element) {
        this.initElement(element.getElement());
        this._selectionCopyElement = element;
    }

    setSelectionTextElement(element) {
        this.initElement(element.getElement());
        this._selectionTextElement = element;
    }

    setSelectionElement(element) {
        this.initElement(element.getElement());
        this._selectionElement = element;
    }

    setCropValue(value) {
        this._value = value;
        this.setResourceContentWrapperElement(this._resourceContentWrapperElement);
        this.initElement(this._canvasElement);
        this.initElement(this._selectionElement.getElement());
        this.initElement(this._selectionCopyElement.getElement());
        this.initElement(this._selectionTextElement.getElement());
        this._image.setValue(value);
        this._gridElement.setValue(value);
        this.hideSelection();
        dispatcher.dispatch('Screen.ImageData', this._image.getImageData());
        return this;
    }

    getWidth() {
        return this._value ? this._value.width : 0;
    }

    getHeight() {
        return this._value ? this._value.height : 0;
    }

    getCanResize() {
        return true;
    }

    getCanCrop() {
        return (this._imageEditorState.getTool() === 'select') && this._selectionCopyElement.getData();
    }

    crop() {
        let data = this._selectionCopyElement.getData();
        if (!data) {
            return;
        }
        this
            .addUndo({
                tool: 'crop',
                data: this._image.getValue()
            })
            .setCropValue({
                width:  data.data[0].length,
                height: data.data.length,
                image:  data.data
            })
            .updateElements();
    }

    resize(width, height) {
        this
            .addUndo({
                tool: 'crop',
                data: this._image.getValue()
            })
            .setCropValue(this._image.getResizedImage(width, height))
            .updateElements();
    }

    addUndo(undo) {
        this._changed = true;
        this._imageEditorState.undoStackPush(undo);
        dispatcher.dispatch('Editor.Changed', this._editors.getDispatchInfo(this));
        return this;
    }
};
