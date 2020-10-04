exports.WheelEditorState = class {
    constructor(opts) {
        this._codeMirrorRefreshTimeout = null;
        this._mode                     = opts.mode;
        this._gutters                  = opts.gutters;
        this._breakpoints              = {};
        this._hintTimeout              = null;
        this._findCursor               = null;
        this._findCaseSensitive        = false;
        this._findText                 = '';
        this._findVisible              = false;
        this._cursorChangedAfterFind   = false;
        this._replaceVisible           = false;
        this._database                 = {defines: null, files: null, compiler: null};
    }

    resetBreakpoints() {
        this._breakpoints = {};
    }

    getCodeMirrorRefreshTimeout() {
        return this._codeMirrorRefreshTimeout;
    }

    setCodeMirrorRefreshTimeout(codeMirrorRefreshTimeout) {
        this._codeMirrorRefreshTimeout = codeMirrorRefreshTimeout;
    }

    getMode() {
        return this._mode;
    }

    getGutters() {
        return this._gutters;
    }

    getHintTimeout() {
        return this._hintTimeout;
    }

    setHintTimeout(hintTimeout) {
        this._hintTimeout = hintTimeout;
    }

    getFindCursor() {
        return this._findCursor;
    }

    setFindCursor(findCursor) {
        this._findCursor = findCursor;
        return this;
    }

    getFindCaseSensitive() {
        return this._findCaseSensitive;
    }

    setFindCaseSensitive(findCaseSensitive) {
        this._findCaseSensitive = findCaseSensitive;
        return this;
    }

    getFindText() {
        return this._findText;
    }

    setFindText(findText) {
        this._findText = findText;
        return this;
    }

    getFindVisible() {
        return this._findVisible;
    }

    setFindVisible(findVisible) {
        this._findVisible = findVisible;
        return this;
    }

    getReplaceVisible() {
        return this._replaceVisible;
    }

    setReplaceVisible(replaceVisible) {
        this._replaceVisible = replaceVisible;
    }

    getDatabase() {
        return this._database;
    }

    setDatabase(database) {
        this._database = database;
    }

    getDatabaseCompiler() {
        return this._database.compiler;
    }

    setDatabaseCompiler(database) {
        this._database.compiler = database;
    }

    setDatabasePreProcessor(database) {
        this._database.defines = database.defines;
        this._database.files   = database.files;
    }

    getBreakpoints() {
        return this._breakpoints;
    }

    getCursorChangedAfterFind() {
        return this._cursorChangedAfterFind;
    }

    setCursorChangedAfterFind(cursorChangedAfterFind) {
        this._cursorChangedAfterFind = cursorChangedAfterFind;
        return this;
    }

    toggleBreakpoint(line) {
        let breakpoints = this._breakpoints;
        if (breakpoints[line]) {
            delete breakpoints[line];
        } else {
            breakpoints[line] = true;
        }
    }
};
