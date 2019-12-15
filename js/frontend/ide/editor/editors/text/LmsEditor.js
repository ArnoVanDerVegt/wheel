/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const WheelEditor = require('./WheelEditor').WheelEditor;

exports.LmsEditor = class extends WheelEditor {
    initCodeMirror() {
        let wheelEditorState = this._wheelEditorState;
        let codeMirror       = CodeMirror.fromTextArea(
            this._textareaElement,
            {
                indentUnit:     4,
                lineNumbers:    true,
                indentWithTabs: false,
                mode:           wheelEditorState.getMode()
            }
        );
        this._codeMirror = codeMirror;
        codeMirror.on('change',         this.onDocumentChanged.bind(this));
        codeMirror.on('cursorActivity', this.onCursorChanged.bind(this));
    }

    getBreakpoints() {
        return [];
    }

    showBreakpoint(lineNum) {
    }

    updateBreakpoints(callback) {
    }

    enableBreakpoints() {
    }

    onGutterClick(cm, n) {
    }

    onMouseMove(event) {
    }

    refresh() {
    }
};
