/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const getDataProvider  = require('../../../../lib/dataprovider/dataProvider').getDataProvider;
const dispatcher       = require('../../../../lib/dispatcher').dispatcher;
const path             = require('../../../../lib/path');
const Editor           = require('../Editor').Editor;
const ToolbarBottom    = require('./toolbar/ToolbarBottom').ToolbarBottom;
const WheelEditorState = require('./WheelEditorState').WheelEditorState;

exports.WheelEditor = class extends Editor {
    constructor(opts) {
        super(opts);
        this._wheelEditorState = new WheelEditorState(opts);
        this._textareaElement  = null;
        this._codeMirror       = null;
        this._mouseDown        = false;
        this._keyDown          = false;
        this._onGlobalUIId     = opts.ui.addEventListener('Global.UIId',   this, this.onGlobalUIId);
        this._onGlobalKeyUp    = opts.ui.addEventListener('Global.Key.Up', this, this.onGlobalKeyUp);
        this._cursorPosition   = opts.cursorPosition;
        this.initDOM(opts.parentNode);
        if (this._wheelEditorState.getMode() === 'text/x-wheel') {
            dispatcher
                .on('Compiler.Database',     this, this.onCompilerDatabase)
                .on('PreProcessor.Database', this, this.onPreProcessorDatabase);
        }
    }

    initCodeMirrorDependencies(codeMirror) {
        let settings         = this._settings;
        let wheelEditorState = this._wheelEditorState;
        codeMirror.getSettings     = function() { return settings; };
        codeMirror.getDispatcher   = function() { return dispatcher; };
        codeMirror.getCodeDatabase = function() { return wheelEditorState.getDatabase(); };
        codeMirror.getDataProvider = function() { return getDataProvider(); };
    }

    initCodeMirror() {
        let wheelEditorState = this._wheelEditorState;
        let codeMirror       = CodeMirror.fromTextArea(
            this._textareaElement,
            {
                indentUnit:     4,
                lineNumbers:    true,
                indentWithTabs: false,
                gutters:        wheelEditorState.getGutters(),
                mode:           wheelEditorState.getMode()
            }
        );
        this._codeMirror = codeMirror;
        codeMirror.setOption(
            'extraKeys',
            {
                Tab: function(cm) {
                    if (cm.somethingSelected()) {
                        cm.indentSelection('add');
                    } else {
                        let spaces = Array(cm.getOption('indentUnit') + 1).join(' ');
                        cm.replaceSelection(spaces);
                    }
                },
                'Ctrl-Space': 'autocomplete'
            }
        );
        if (wheelEditorState.getGutters().length) {
            codeMirror.on('gutterClick', this.onGutterClick.bind(this));
        }
        codeMirror.on('change',         this.onDocumentChanged.bind(this));
        codeMirror.on('cursorActivity', this.onCursorChanged.bind(this));
        codeMirror.on('keydown',        this.onKeyDown.bind(this));
        codeMirror.on('keyup',          this.onKeyUp.bind(this));
        this.initCodeMirrorDependencies(codeMirror);
        if (wheelEditorState.getMode() === 'text/x-wheel') {
            let codeMirrorElement = this._refs.wrapper.querySelector('.CodeMirror');
            if (codeMirrorElement) {
                codeMirrorElement.addEventListener('mousedown', this.onMouseDown.bind(this));
                codeMirrorElement.addEventListener('mousemove', this.onMouseMove.bind(this));
                codeMirrorElement.addEventListener('mouseout',  this.onMouseOut.bind(this));
                codeMirrorElement.addEventListener('mouseup',   this.onMouseUp.bind(this));
            }
        }
        if (this._cursorPosition) {
            this.showCursorPosition(this._cursorPosition);
            this._cursorPosition = null;
        }
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                id:        this.setRef('wrapper'),
                className: 'max-w max-h code-mirror-wrapper',
                children: [
                    {
                        id:    this.setTextareaElement.bind(this),
                        type:  'textarea',
                        value: this._value
                    },
                    {
                        type:        ToolbarBottom,
                        ui:          this._ui,
                        settings:    this._settings,
                        ev3:         this._ev3,
                        poweredUp:   this._poweredUp,
                        wheelEditor: this
                    }
                ]
            }
        );
        this.initCodeMirror();
    }

    makeMarker() {
        let marker = document.createElement('div');
        marker.className = 'breakpoint-marker';
        return marker;
    }

    remove() {
        super.remove();
        this._onGlobalUIId();
        this._onGlobalKeyUp();
    }

    show() {
        super.show();
        this._codeMirror.setOption('viewportMargin', Infinity);
        this._codeMirror.refresh();
        dispatcher.dispatch('Screen.Ready');
    }

    onGlobalUIId() {
        let textarea = this._refs.wrapper.querySelector('.CodeMirror textarea');
        if (textarea) {
            textarea.disabled = (this._ui.getActiveUIId() === 1) ? '' : 'disabled';
        }
    }

    onGlobalKeyUp(event) {
        if (event.keyCode === 27) { // Escape
            this.hideReplaceOptions();
        }
    }

    getValue() {
        return this._codeMirror.getValue();
    }

    setValue(value, reset) {
        if (value !== this.getValue()) {
            this._codeMirror.setValue(value);
        }
        reset && this._codeMirror.clearHistory();
    }

    getCanFind() {
        return true;
    }

    getBreakpoints() {
        let breakpoints = [];
        for (let b in this._wheelEditorState.getBreakpoints()) {
            breakpoints.push({
                lineNum: parseInt(b, 10) + 1
            });
        }
        let lines = this._codeMirror.getValue().split('\n');
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i].trim();
            if (line.substr(0, 6) === '#break') {
                breakpoints.push({
                    lineNum: i + 1
                });
            }
        }
        return breakpoints;
    }

    setTextareaElement(element) {
        this._textareaElement = element;
    }

    setBluetoothStatusElement(element) {
        this._blueToothStatusElement = element;
    }

    /**
     * Check if the hint token is part of a potential namespace and return the complete namespaced identifier.
     * For example:
     *      The lines:                      "components.statusLight.setColor()"
     *      The found token:                "statusLight"
     *      Which results in the alt hint:  "components.statusLight.setColor"
    **/
    getAltHintFromLine(line, hint, start, end) {
        let i;
        let chars   = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_0123456789.';
        let altHint = hint;
        let ch;
        if ((start > 0) && (line[start - 1] === '.')) {
            i = start - 1;
            while ((i > 0) && (chars.indexOf(line[i]) !== -1)) {
                ch      = line[i--];
                altHint = (ch === '.' ? '~' : ch) + altHint;
            }
        }
        if ((end < line.length) && (line[end] === '.')) {
            let i = end;
            while ((i < line.length) && (chars.indexOf(line[i]) !== -1)) {
                ch = line[i++];
                altHint += (ch === '.' ? '~' : ch);
            }
        }
        return altHint;
    }

    /**
     * Get the first occurance of a proc declaration above the cursor line if there is any.
    **/
    getProc(line) {
        let codeMirror = this._codeMirror;
        while (line > 0) {
            line--;
            let s = codeMirror.getLine(line);
            if (s.substr(0, 5) === 'proc ') {
                s = s.substr(5 - s.length).trim();
                let i = s.indexOf('(');
                return (i === -1) ? false : s.substr(0, i);
            }
        }
        return false;
    }

    getHintInfoAtCoords(coords) {
        let codeMirror = this._codeMirror;
        let start      = codeMirror.findWordAt({line: coords.line, ch: coords.ch}).anchor.ch;
        let end        = codeMirror.findWordAt({line: coords.line, ch: coords.ch}).head.ch;
        let hint       = codeMirror.getRange({line: coords.line, ch: start}, {line: coords.line, ch: end});
        return {
            coords:  coords,
            hint:    hint,
            proc:    this.getProc(coords.line),
            altHint: this.getAltHintFromLine(codeMirror.getLine(coords.line), (typeof hint === 'string') ? hint : '', start, end)
        };
    }

    getVarFromCompiler(opts) {
        let vr       = false;
        let database = this._wheelEditorState.getDatabase();
        if (opts.proc) {
            let proc = database.compiler.findProc(opts.proc);
            if (proc) {
                vr = proc.findLocalVar(opts.hint);
                if (vr) {
                    return vr;
                }
            }
        }
        return vr;
    }

    getTokenFromHintInfo(hintInfo) {
        let database = this._wheelEditorState.getDatabase();
        let proc     = database.compiler.findProc(hintInfo.hint) || database.compiler.findProc(hintInfo.altHint);
        if (proc) {
            return proc.getToken();
        }
        let record = database.compiler.findRecord(hintInfo.hint) || database.compiler.findRecord(hintInfo.altHint);
        if (record) {
            return record.getToken();
        }
        let define = database.defines.getFullInfo(hintInfo.hint);
        if (define) {
            return define.token;
        }
        let vr = this.getVarFromCompiler(hintInfo) || database.compiler.findVar(hintInfo.hint);
        if (vr) {
            return vr.getToken();
        }
        return null;
    }

    getFilenameFromToken(token) {
        return this._wheelEditorState.getDatabase().files[token.fileIndex].filename;
    }

    clearAllBreakpoints() {
        this._codeMirror.clearGutter('breakpoints');
        this._wheelEditorState.resetBreakpoints();
        // Hack! Codemirror appears to fail to remove breakpoint elements...
        let codeMirrorBreakpoints = document.querySelectorAll('.breakpoint-marker');
        for (let i = 0; i < codeMirrorBreakpoints.length; i++) {
            try {
                let codeMirrorBreakpoint = codeMirrorBreakpoints[i];
                codeMirrorBreakpoint.parentNode.parentNode.removeChild(codeMirrorBreakpoint.parentNode);
            } catch (error) {
            }
        }
    }

    hideBreakpoint(lineNum) {
        let codeMirror = this._codeMirror;
        let info       = codeMirror.lineInfo(lineNum);
        if (info.bgClass === 'breakpoint-line') {
            codeMirror.removeLineClass(lineNum, 'background', 'breakpoint-line');
        } else {
            for (let i = 0; i < codeMirror.lineCount(); i++) {
                codeMirror.removeLineClass(i, 'background', 'breakpoint-line');
            }
        }
    }

    showCursorPosition(cursorPosition) {
        let codeMirror = this._codeMirror;
        codeMirror.setCursor({line: cursorPosition.lineNum - 1, ch: cursorPosition.ch});
        codeMirror.focus();
        document.body.scrollTop = 0;
    }

    showBreakpoint(lineNum) {
        this._codeMirror.addLineClass(lineNum, 'background', 'breakpoint-line');
        this._codeMirror.scrollIntoView({line: lineNum, ch: 0});
    }

    showFindToolbar() {
        let refs = this._refs;
        refs.findOptions.className      = 'bottom-options';
        refs.connectionStatus.className = 'bottom-options hidden';
        this._wheelEditorState.setFindVisible(true);
        refs.findText.focus();
    }

    showReplaceToolbar() {
        let refs = this._refs;
        refs.wrapper.className          = 'max-w max-h code-mirror-wrapper with-replace';
        refs.findOptions.className      = 'bottom-options';
        refs.replaceOptions.className   = 'bottom-options replace';
        refs.connectionStatus.className = 'bottom-options hidden';
        this._wheelEditorState.setReplaceVisible(true);
        this._wheelEditorState.setFindVisible(true);
    }

    updateBreakpoints(callback) {
        for (let b in this._wheelEditorState.getBreakpoints()) {
            let lineNum = parseInt(b, 10) + 1;
            let info    = this._codeMirror.lineInfo(lineNum);
            if (info.gutterMarkers && info.gutterMarkers.breakpoints) {
                callback(info.gutterMarkers.breakpoints);
            }
        }
    }

    disableBreakpoints() {
        this.updateBreakpoints((breakpoint) => {
            breakpoint.className = 'breakpoint-marker disabled';
        });
    }

    enableBreakpoints() {
        this.updateBreakpoints((breakpoint) => {
            breakpoint.className = 'breakpoint-marker';
        });
    }

    onCompilerDatabase(database) {
        this._wheelEditorState.setDatabaseCompiler(database);
        this.refresh();
    }

    onPreProcessorDatabase(database) {
        this._wheelEditorState.setDatabasePreProcessor(database);
        this.refresh();
    }

    onFindKeyUp(event) {
        if (event.keyCode === 13) { // Enter
            this.onFind();
        }
    }

    onFind(event) {
        let findText = this._refs.findText.getValue();
        if (this._wheelEditorState.getFindText() === findText) {
            this.findNext();
        } else {
            this.find();
        }
    }

    onReplaceKeyUp(event) {
        switch (event.keyCode) {
            case 13: // Enter
                this.replaceNext();
                break;
            case 27: // Escape
                this.hideReplaceOptions();
                break;
        }
    }

    onReplace(event) {
        this.replaceNext();
    }

    onGutterClick(cm, n) {
        let info = cm.lineInfo(n);
        this._wheelEditorState.toggleBreakpoint(info.line);
        cm.setGutterMarker(n, 'breakpoints', info.gutterMarkers ? null : this.makeMarker());
        dispatcher.dispatch('Editor.SetBreakpoint');
    }

    onDocumentChanged() {
        this._changed = true;
        dispatcher.dispatch('Editor.Changed', this._editors.getDispatchInfo(this));
    }

    onCursorChanged() {
        let wheelEditorState = this._wheelEditorState;
        if (wheelEditorState.getCursorChangedAfterFind()) {
            // The cursor changed after clicking find, reset the state...
            wheelEditorState.setCursorChangedAfterFind(false);
        } else {
            // The cursor changed after clicking in the editor, reset the find text state...
            // This forces the search to reset when find is clicked again.
            wheelEditorState.setFindText(null);
        }
        let cursor = this._codeMirror.getCursor();
        this._lastCursor                    = cursor;
        this._refs.cursorPosition.innerHTML = (cursor.line + 1) + ',' + cursor.ch;
    }

    onKeyDown(cm, event) {
        this._keyDown = event.key;
        this.onMouseOut(event);
    }

    onKeyUp(cm, event) {
        this._keyDown = false;
        if (this._autoCompleteTimeout) {
            clearTimeout(this._autoCompleteTimeout);
        }
        let ch = String.fromCharCode(event.keyCode);
        if ('ABCDEFGHIJKLMNOPQRSTUVWXYZ_0123456789'.indexOf(ch) === -1) {
            return;
        }
        let callback = () => {
                CodeMirror.commands.autocomplete(cm, null, {completeSingle: true});
                this._autoCompleteTimeout = null;
            };
        this._autoCompleteTimeout = setTimeout(callback, 1000);
    }

    onMouseDown(event) {
        this._mouseDown = true;
        this.onMouseOut(event);
    }

    onMouseUp(event) {
        if (this._mouseDown && (this._keyDown === 'Control')) {
            let cursor = this._codeMirror.getCursor();
            let token  = this.getTokenFromHintInfo(this.getHintInfoAtCoords(cursor));
            if (token) {
                let filename = this.getFilenameFromToken(token);
                getDataProvider().getData(
                    'get',
                    'ide/path-exists',
                    {path: filename},
                    (data) => {
                        let exists = false;
                        try {
                            exists = JSON.parse(data).exists;
                        } catch (error) {
                        }
                        if (exists) {
                            dispatcher.dispatch('Dialog.File.Open', filename, token);
                        }
                    }
                );
            }
        }
        this._mouseDown = false;
    }

    onMouseMove(event) {
        let wheelEditorState = this._wheelEditorState;
        if (!wheelEditorState.getDatabaseCompiler()) {
            return;
        }
        if (wheelEditorState.getHintTimeout()) {
            clearTimeout(wheelEditorState.getHintTimeout());
        }
        wheelEditorState.setHintTimeout(setTimeout(
            () => {
                wheelEditorState.setHintTimeout(null);
                let hintInfo = this.getHintInfoAtCoords(this._codeMirror.coordsChar({left: event.clientX, top: event.clientY}));
                if ((typeof hintInfo.hint === 'string') && (hintInfo.hint.trim() !== '')) {
                    hintInfo.event = event;
                    dispatcher.dispatch('Hint.Show', hintInfo);
                }
            },
            300
        ));
    }

    onMouseOut(event) {
        let wheelEditorState = this._wheelEditorState;
        if (wheelEditorState.getHintTimeout()) {
            clearTimeout(wheelEditorState.getHintTimeout());
            wheelEditorState.setHintTimeout(null);
        }
        dispatcher.dispatch('Hint.Hide');
    }

    onFileSavedHide() {
        super.onFileSavedHide();
        if (this._wheelEditorState.getFindVisible()) {
            this._refs.findOptions.className = 'bottom-options';
        }
        if (this._wheelEditorState.getReplaceVisible()) {
            this._refs.replaceOptions.className = 'bottom-options replace';
        }
    }

    onFileSaved(filename) {
        this._refs.findOptions.className    = 'bottom-options hidden';
        this._refs.replaceOptions.className = 'bottom-options hidden';
        super.onFileSaved(filename);
    }

    refresh() {
        let wheelEditorState = this._wheelEditorState;
        wheelEditorState.getCodeMirrorRefreshTimeout() && clearTimeout(wheelEditorState.getCodeMirrorRefreshTimeout());
        wheelEditorState.setCodeMirrorRefreshTimeout(setTimeout(
            () => {
                wheelEditorState.setCodeMirrorRefreshTimeout(null);
                this._codeMirror.setOption('mode', wheelEditorState.getMode());
            }),
            10
        );
    }

    hideReplaceOptions() {
        let refs = this._refs;
        refs.findOptions.className      = 'bottom-options hidden';
        refs.replaceOptions.className   = 'bottom-options hidden';
        refs.connectionStatus.className = 'bottom-options connection-status';
        refs.wrapper.className          = 'max-w max-h code-mirror-wrapper';
        this._wheelEditorState
            .setFindVisible(false)
            .setReplaceVisible(false);
    }

    find() {
        let wheelEditorState  = this._wheelEditorState;
        let findText          = this._refs.findText.getValue();
        let findCaseSensitive = this._refs.findCaseSensitive.getChecked();
        let findCursor        = this._codeMirror.getSearchCursor(findText, null, !findCaseSensitive);
        wheelEditorState
            .setCursorChangedAfterFind(true)
            .setFindCursor(findCursor)
            .setFindCaseSensitive(findCaseSensitive)
            .setFindText(findText);
        findCursor && findCursor.findNext();
        if (findCursor && !findCursor.from()) {
            findCursor = this._codeMirror.getSearchCursor(findText, null, !findCaseSensitive);
            findCursor && findCursor.findNext();
        }
        if (findCursor && findCursor.from()) {
            this._codeMirror.setSelection(findCursor.from(), findCursor.to());
        }
        dispatcher.dispatch('Editors.ChangeEditor', this._editors.getDispatchInfo(this));
    }

    findNext() {
        let wheelEditorState  = this._wheelEditorState;
        let findText          = this._refs.findText.getValue();
        let findCaseSensitive = this._refs.findCaseSensitive.getChecked();
        let findCursor        = wheelEditorState.getFindCursor();
        if (findText === '') {
            wheelEditorState.setFindText(null);
            return;
        }
        if (!findCursor ||
            (wheelEditorState.getFindText()          !== findText) ||
            (wheelEditorState.getFindCaseSensitive() !== findCaseSensitive)) {
            findCursor = this._codeMirror.getSearchCursor(findText, null, !findCaseSensitive);
        }
        wheelEditorState
            .setCursorChangedAfterFind(true)
            .setFindText(findText)
            .setFindCaseSensitive(findCaseSensitive);
        findCursor && findCursor.findNext();
        if (findCursor && !findCursor.from()) {
            findCursor = this._codeMirror.getSearchCursor(findText, null, !findCaseSensitive);
            findCursor && findCursor.findNext();
        }
        if (findCursor && findCursor.from()) {
            this._codeMirror.setSelection(findCursor.from(), findCursor.to());
        }
    }

    replaceNext() {
        let replaceText = this._refs.replaceText.getValue();
        let findCursor  = this._wheelEditorState.getFindCursor();
        if (findCursor && findCursor.from() && findCursor.to()) {
            this._codeMirror.replaceRange(replaceText, findCursor.from(), findCursor.to());
            this.findNext();
        }
    }

    replace(replace, w, replaceCaseSensitive) {
        let findCursor = this._codeMirror.getSearchCursor(replace, null, replaceCaseSensitive);
        while (true) {
            findCursor && findCursor.findNext();
            if (findCursor && findCursor.from() && findCursor.to()) {
                this._codeMirror.replaceRange(w, findCursor.from(), findCursor.to());
            } else {
                break;
            }
        }
    }

    restoreCursor() {
        setTimeout(
            () => {
                let lastCursor = this._lastCursor;
                if (!lastCursor) {
                    return;
                }
                let codeMirror = this._codeMirror;
                let cursor     = codeMirror.getCursor();
                if ((cursor.line === lastCursor.line) && (cursor.ch !== lastCursor.ch)) {
                    return;
                }
                codeMirror.focus();
                codeMirror.setCursor(lastCursor);
            },
            0
        );
    }
};
