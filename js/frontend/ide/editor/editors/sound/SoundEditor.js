/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const path             = require('../../../../../shared/lib/path');
const Sound            = require('../../../../../shared/lib/Sound').Sound;
const Button           = require('../../../../lib/components/input/Button').Button;
const dispatcher       = require('../../../../lib/dispatcher').dispatcher;
const Editor           = require('../Editor').Editor;
const Clipboard        = require('../Clipboard');
const ToolbarTop       = require('./toolbar/ToolbarTop').ToolbarTop;
const ToolbarBottom    = require('./toolbar/ToolbarBottom').ToolbarBottom;
const SoundEditorState = require('./SoundEditorState').SoundEditorState;

let soundEditorId = 0;

exports.SoundEditor = class extends Editor {
    constructor(opts) {
        if (path.getExtension(opts.filename) === '.rsf') {
            for (let i = 0; i < 8; i++) { // Remove the rsf header...
                opts.value.data.shift();
            }
        }
        super(opts);
        this._soundEditorState = new SoundEditorState();
        this._soundEditorId    = soundEditorId++;
        this._canvasElement    = null;
        this._sound            = null;
        this
            .initDOM(opts.parentNode)
            .initDispatcher();
    }

    initDispatcher() {
        this._dispatchChangeVolume = 'Dialog.Volume.CHangeVolume' + this._soundEditorId;
        this._dispatchFadeIn       = 'Dialog.Volume.FadeIn'       + this._soundEditorId;
        this._dispatchFadeOut      = 'Dialog.Volume.FadeOut'      + this._soundEditorId;
        this._dispatch             = [
            dispatcher.on(this._dispatchChangeVolume, this, this.onVolumeApply),
            dispatcher.on(this._dispatchFadeIn,       this, this.onFadeInApply),
            dispatcher.on(this._dispatchFadeOut,      this, this.onFadeOutApply)
        ];
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
                        soundEditor: this
                    },
                    {
                        className: 'resource-content',
                        children: [
                            {
                                ref:       this.setRef('resourceContentWrapper'),
                                className: 'resource-content-wrapper',
                                children: [
                                    {
                                        id:        this.setCanvasElement.bind(this),
                                        type:      'canvas',
                                        className: 'resource sound with-shadow'
                                    },
                                    {
                                        id:        this.setResourceOverlayElement.bind(this),
                                        className: 'resource-overlay',
                                        children: [
                                            {
                                                ref:       this.setRef('position'),
                                                className: 'play-position'
                                            },
                                            {
                                                ref:       this.setRef('selection'),
                                                className: 'sound-selection'
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        type:        ToolbarBottom,
                        ui:          this._ui,
                        soundEditor: this
                    }
                ]
            }
        );
        return this;
    }

    remove() {
        while (this._dispatch.length) {
            this._dispatch.pop()();
        }
        super.remove();
    }

    show() {
        super.show();
        dispatcher.dispatch('Screen.Ready');
        this.updateElements();
    }

    onSelectZoom(zoom) {
        this._soundEditorState.setZoom(zoom);
        this
            .setSize()
            .renderCanvas()
            .renderSelection();
    }

    onUndo() {
        let soundEditorState = this._soundEditorState;
        if (!soundEditorState.getUndoStackLength() || soundEditorState.getPlayingInterval()) {
            return;
        }
        let undo    = soundEditorState.undoStackPop();
        let offset1 = undo.offset1;
        let offset2 = undo.offset2;
        let data    = this._value.data;
        switch (undo.tool) {
            case 'delete':
                undo.data.unshift(undo.offset1, 0);
                data.splice.apply(data, undo.data);
                this.updateAfterResize();
                break;
            case 'change':
                for (let i = offset1; i < offset2; i++) {
                    data[i] = undo.data[i - offset1];
                }
                this.renderCanvas();
                break;
            case 'paste':
                this._value.data.splice(undo.offset1, undo.length);
                this.updateAfterResize();
                break;
        }
        if (('offset1' in undo) && (undo.offset1 !== null) &&
            ('offset2' in undo) && (undo.offset2 !== null)) {
            soundEditorState.setOffsetRange(undo.offset1, undo.offset2);
            soundEditorState.setXRange(
                this.getXFromOffset(undo.offset1),
                this.getXFromOffset(undo.offset2)
            );
            this
                .renderSelection()
                .updateElements();
        }
        dispatcher.dispatch('Editor.Changed', this._editors.getDispatchInfo(this));
        this._changed = this._soundEditorState.getUndoStackLength();
    }

    onCopy() {
        Clipboard.clipboard.copy(Clipboard.TYPE_SOUND, this.copyRange());
        this.updateElements();
    }

    onPaste() {
        let soundEditorState = this._soundEditorState;
        if ((Clipboard.clipboard.getType() !== Clipboard.TYPE_SOUND) ||
            (soundEditorState.getOffset1() === null)) {
            return;
        }
        let clipboardData = Clipboard.clipboard.getData();
        this.addUndo({
            tool:   'paste',
            offset1: soundEditorState.getOffset1(),
            offset2: soundEditorState.getOffset2(),
            length:  clipboardData.length
        });
        let data = [soundEditorState.getOffset1(), 0].concat(clipboardData);
        this._value.data.splice.apply(this._value.data, data);
        this
            .updateAfterResize()
            .renderSelection();
    }

    onDelete() {
        if (this.allowSelectionEdit()) {
            let soundEditorState = this._soundEditorState;
            let offset1          = soundEditorState.getOffset1();
            let offset2          = soundEditorState.getOffset2();
            this
                .addUndo({
                    tool:    'delete',
                    offset1: offset1,
                    offset2: offset2,
                    data:    this._value.data.splice(offset1, offset2 - offset1)
                })
                .updateAfterResize();
        }
    }

    onVolume() {
        if (this.allowSelectionEdit()) {
            dispatcher.dispatch(
                'Dialog.Volume.Show',
                {
                    title:         'Change volume of selection',
                    label:         'Volume',
                    value:         50,
                    dispatchApply: this._dispatchChangeVolume
                }
            );
        }
    }

    onVolumeApply(value) {
        this.changeVolume(value, value);
    }

    onFadeIn() {
        if (this.allowSelectionEdit()) {
            dispatcher.dispatch(
                'Dialog.Volume.Show',
                {
                    title:         'Fade selection in',
                    label:         'Fade from volume',
                    value:         0,
                    dispatchApply: this._dispatchFadeIn
                }
            );
        }
    }

    onFadeInApply(value) {
        this.changeVolume(value, 1);
    }

    onFadeOut() {
        if (this.allowSelectionEdit()) {
            dispatcher.dispatch(
                'Dialog.Volume.Show',
                {
                    title:         'Fade selection out',
                    label:         'Fade to volume',
                    value:         0,
                    dispatchApply: this._dispatchFadeOut
                }
            );
        }
    }

    onFadeOutApply(value) {
        this.changeVolume(1, value);
    }

    onPlay() {
        let soundEditorState = this._soundEditorState;
        if (soundEditorState.getPlayingInterval()) {
            return;
        }
        let offset1 = soundEditorState.getOffset1();
        let offset2 = soundEditorState.getOffset2();
        if (offset1 === offset2) {
            offset1 = 0;
            offset2 = this._value.data.length;
        }
        soundEditorState.setPlayingInterval(setInterval(this.onPlayInterval.bind(this), 10));
        this._sound           = new Sound().create(
            {
                data:       this._value.data,
                offset1:    offset1,
                offset2:    offset2,
                onFinished: () => {
                    clearInterval(soundEditorState.getPlayingInterval());
                    soundEditorState.setPlayingInterval(null);
                    this._sound                       = null;
                    this._refs.position.style.display = 'none';
                    this.updateElements();
                }
            }
        );
        this.updateElements();
    }

    onPlayInterval() {
        if (!this._sound) {
            return;
        }
        let soundEditorState = this._soundEditorState;
        let offset1          = soundEditorState.getOffset1();
        let offset2          = soundEditorState.getOffset2();
        let offset           = (offset1 === offset2) ? 0 : offset1;
        let width            = this.getZoomWidth();
        let currentTime      = this._sound.getCurrentTime();
        let style            = this._refs.position.style;
        style.display = 'block';
        style.left    = ((offset / this.getDataLength() * width) +
                            (width * this._sound.getCurrentTime() / this.getTotalSeconds())) + 'px';
    }

    onMouseMove(event) {
        this.onCancelEvent(event);
        let soundEditorState = this._soundEditorState;
        let x1               = soundEditorState.getX1();
        let x2               = this.getCursorPosition(event);
        this._refs.cursorPosition.innerHTML = this.getPositionInSeconds(x2);
        if (this._soundEditorState.getMouseDown()) {
            if (x1 > x2) {
                let n = x1;
                x1 = x2;
                x2 = n;
            }
            let style = this._refs.selection.style;
            style.left            = x1 + 'px';
            style.width           = (x2 - x1) + 'px';
            style.display         = 'block';
            style.backgroundColor = 'rgba(52, 152, 219, 0.3)';
            soundEditorState.setXRange(x1, x2);
        }
    }

    onMouseOut(event) {
        this._soundEditorState.setMouseDown(false);
        this._refs.cursorPosition.innerHTML = '';
        this
            .onCancelEvent(event)
            .updateElements();
    }

    onMouseDown(event) {
        let soundEditorState = this._soundEditorState;
        let x                = this.getCursorPosition(event);
        soundEditorState
            .setOffsetRange(0, 0)
            .setXRange(x, x)
            .setMouseDown(true);
        this.updateElements();
    }

    onMouseUp(event) {
        let soundEditorState = this._soundEditorState;
        soundEditorState.setMouseDown(false);
        soundEditorState.setOffsetRange(
            this.getPositionIndex(soundEditorState.getX1()),
            this.getPositionIndex(soundEditorState.getX2())
        );
        this
            .onCancelEvent(event)
            .renderSelection()
            .updateElements();
        dispatcher.dispatch('Editor.Changed', this._editors.getDispatchInfo(this));
    }

    getCanUndo() {
        return this._soundEditorState.getUndoStackLength();
    }

    getCanCopy() {
        return this.allowSelectionEdit();
    }

    getCanPaste() {
        return (this._soundEditorState.getOffset1() !== null) &&
            (Clipboard.clipboard.getType() === Clipboard.TYPE_SOUND);
    }

    getZoomInterval() {
        return [20, 10, 5, 2][this._soundEditorState.getZoom()];
    }

    getDataLength() {
        return this._value.data.length - 8;
    }

    getTotalSeconds() {
        return this.getDataLength() / 8000;
    }

    getWidthPerSecond() {
        return this.getZoomWidth() / this.getTotalSeconds();
    }

    getZoomWidth() {
        return Math.floor(this.getDataLength() / (this.getZoomInterval() / 2));
    }

    getPositionIndex(position) {
        let length = this.getDataLength();
        return Math.min(Math.round(position / this.getZoomWidth() * length), length - 1);
    }

    getXFromOffset(offset) {
        return offset / this.getDataLength() * this.getZoomWidth();
    }

    getPositionInSeconds(position) {
        let n = position / this.getZoomWidth() * this.getTotalSeconds();
        return n.toFixed(3) + 's';
    }

    getCursorPosition(event) {
        let element = this._canvasElement;
        let offsetX = element.offsetLeft;
        let parent  = element.offsetParent;
        while (parent) {
            offsetX += parent.offsetLeft;
            parent = parent.offsetParent;
        }
        let x = event.clientX - offsetX + element.offsetWidth / 2;
        parent = element.offsetParent.offsetParent;
        let data = this._value.data;
        return Math.floor(x + parent.scrollLeft);
    }

    setSize() {
        let elements = [
                {element: this._refs.resourceContentWrapper, margin: 64},
                {element: this._canvasElement,               margin: 0},
                {element: this._resourceOverlayElement,      margin: 0}
            ];
        let width = this.getZoomWidth();
        elements.forEach((e) => {
            let element = e.element;
            element.width        = width + e.margin;
            element.height       = 256;
            element.style.width  = (width + e.margin)  + 'px';
            element.style.height = '256px';
        });
        return this;
    }

    setResourceOverlayElement(element) {
        this._resourceOverlayElement = element;
        this
            .setSize()
            .renderCanvas();
    }

    setCanvasElement(element) {
        this._canvasElement = element;
        element.addEventListener('mousemove', this.onMouseMove.bind(this));
        element.addEventListener('mouseout',  this.onMouseOut.bind(this));
        element.addEventListener('mousedown', this.onMouseDown.bind(this));
        element.addEventListener('mouseup',   this.onMouseUp.bind(this));
    }

    getRange(offset) {
        let data = this._value.data;
        let min  = 255;
        let max  = 0;
        for (let i = 0; (i < this.getZoomInterval()) && (offset < data.length); i++) {
            min = Math.min(data[offset], min);
            max = Math.max(data[offset], max);
            offset++;
        }
        return {min: min, max: max};
    }

    getValue() {
        let length = this._value.data.length;
        let value  = [
                0x01, 0x00,
                length >> 8, length & 0xFF,
                0x1F, 0x40, // 8000, sampling rate
                0x00, 0x00
            ].concat(this._value.data);
        return value;
    }

    allowSelectionEdit() {
        let soundEditorState = this._soundEditorState;
        return (soundEditorState.getOffset1() !== soundEditorState.getOffset2()) &&
            !soundEditorState.getPlayingInterval();
    }

    clearSelection() {
        let soundEditorState = this._soundEditorState;
        soundEditorState.setXRange(null, null);
        soundEditorState.setOffsetRange(null, null);
        this._refs.selection.style.display = 'none';
        return this;
    }

    changeVolume(value1, value2) {
        let data             = this._value.data;
        let undoData         = [];
        let soundEditorState = this._soundEditorState;
        let offset1          = soundEditorState.getOffset1();
        let offset2          = soundEditorState.getOffset2();
        let deltaValue       = value2 - value1;
        let deltaOffset      = offset2 - offset1;
        for (let i = offset1; i < offset2; i++) {
            let j     = data[i];
            let value = value1 + (i - offset1) / deltaOffset * deltaValue;
            undoData.push(j);
            data[i] = Math.round(127 + (127 - j) * value);
        }
        this.addUndo({
            tool:    'change',
            offset1: offset1,
            offset2: offset2,
            data:    undoData
        });
        this
            .renderCanvas()
            .updateElements();
    }

    renderSelection() {
        let soundEditorState = this._soundEditorState;
        if ((soundEditorState.getX1() === null) || (soundEditorState.getX2() === null)) {
            return this;
        }
        let style  = this._refs.selection.style;
        let width  = this.getZoomWidth();
        let length = this.getDataLength();
        let x1     = soundEditorState.getOffset1() / length * width;
        let x2     = soundEditorState.getOffset2() / length * width;
        if (Math.round(x1) === Math.round(x2)) {
            style.left            = x1 + 'px';
            style.width           = 0;
            style.display         = 'block';
            style.backgroundColor = '#000000';
        } else {
            style.left            = x1 + 'px';
            style.width           = (x2 - x1) + 'px';
            style.display         = 'block';
            style.backgroundColor = 'rgba(52, 152, 219, 0.3)';
        }
        return this;
    }

    renderCanvas() {
        return this
            .render()
            .renderGrid();
    }

    renderGrid() {
        let context        = this._canvasElement.getContext('2d');
        let widthPerSecond = this.getWidthPerSecond();
        let x              = 0;
        let width          = this.getZoomWidth();
        let second         = 0;
        context.fillStyle    = '#383838';
        context.strokeStyle  = '#3498db';
        context.textBaseline = 'top';
        while (x < width) {
            for (let i = 0; i < 10; i++) {
                let n = Math.floor(x + widthPerSecond * i / 10) + 0.5;
                if (n > 1) {
                    context.globalAlpha = ((i === 0) || (i === 5)) ? 1 : 0.25;
                    context.beginPath();
                    context.moveTo(n, 0);
                    context.lineTo(n, 256);
                    context.stroke();
                    context.globalAlpha = 1;
                }
                context.fillText(second.toFixed(1), n + 2, 2);
                second += 0.1;
            }
            x += widthPerSecond;
        }
        context.fillStyle = '#2980b9';
        for (let i = 1; i < 4; i++) {
            let y = i * 64 + 0.5;
            context.globalAlpha = (i === 2) ? 1 : 0.25;
            context.beginPath();
            context.moveTo(0,                   y);
            context.lineTo(this.getZoomWidth(), y);
            context.stroke();
        }
        context.globalAlpha = 1;
        return this;
    }

    render() {
        let data    = this._value.data;
        let context = this._canvasElement.getContext('2d');
        let count   = Math.floor(this.getDataLength() / this.getZoomInterval());
        let offset  = 8;
        let range   = this.getRange(offset);
        let x       = 0;
        context.clearRect(0, 0, this.getZoomWidth(), 256);
        context.strokeStyle = '#e74c3c';
        context.lineWidth   = 0.5;
        context.beginPath();
        context.moveTo(0, 128 + (range.min - 128));
        for (let i = 0; i < count; i++) {
            context.lineTo(x, 128 + (range.max - 128));
            range = this.getRange(offset);
            x++;
            offset += this.getZoomInterval();
            context.lineTo(x, 128 + (range.min - 128));
            x++;
        }
        context.stroke();
        return this;
    }

    copyRange() {
        let result           = [];
        let data             = this._value.data;
        let soundEditorState = this._soundEditorState;
        for (let i = soundEditorState.getOffset1(); i < soundEditorState.getOffset2(); i++) {
            result.push(data[i]);
        }
        return result;
    }

    updateAfterResize() {
        return this
            .setSize()
            .renderCanvas()
            .clearSelection()
            .updateElements();
    }

    updateElements() {
        let refs                = this._refs;
        let enableSelectionEdit = false;
        let soundEditorState    = this._soundEditorState;
        if (this._soundEditorState.getPlayingInterval()) {
            refs.copy.setDisabled(true);
            refs.paste.setDisabled(true);
            refs.undo.setDisabled(true);
            refs.play.setDisabled(true);
            enableSelectionEdit = false;
        } else {
            let copyOk  = this.allowSelectionEdit();
            let pasteOk = (soundEditorState.getOffset1() !== null) && (Clipboard.clipboard.getType() === Clipboard.TYPE_SOUND);
            refs.copy.setDisabled(!copyOk);
            refs.paste.setDisabled(!pasteOk);
            refs.undo.setDisabled(!soundEditorState.getUndoStackLength());
            refs.play.setDisabled(false);
            enableSelectionEdit = (soundEditorState.getX1() !== soundEditorState.getX2());
        }
        if (enableSelectionEdit) {
            refs.delete.setDisabled(false);
            refs.volume.setDisabled(false);
            refs.fadeIn.setDisabled(false);
            refs.fadeOut.setDisabled(false);
        } else {
            refs.delete.setDisabled(true);
            refs.volume.setDisabled(true);
            refs.fadeIn.setDisabled(true);
            refs.fadeOut.setDisabled(true);
        }
        return this;
    }

    addUndo(undo) {
        this._changed = true;
        this._soundEditorState.undoStackPush(undo);
        dispatcher.dispatch('Editor.Changed', this._editors.getDispatchInfo(this));
        return this;
    }
};
