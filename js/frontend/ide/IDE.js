/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const Downloader             = require('../program/Downloader');
const platform               = require('../lib/platform');
const path                   = require('../lib/path');
const Http                   = require('../lib/Http').Http;
const dispatcher             = require('../lib/dispatcher').dispatcher;
const Button                 = require('../lib/components/Button').Button;
const getDataProvider        = require('../lib/dataprovider/dataProvider').getDataProvider;
const Text                   = require('../program/output/Text').Text;
const Rtf                    = require('../program/output/Rtf').Rtf;
const Linter                 = require('../compiler/linter/Linter');
const getImage               = require('./data/images').getImage;
const tabIndex               = require('./tabIndex');
const EditorsState           = require('./editor/EditorsState').EditorsState;
const SettingsState          = require('./settings/SettingsState');
const Log                    = require('./console/Log');
const CompileAndRunOutput    = require('./CompileAndRunOutput').CompileAndRunOutput;
const CompileAndRunInstall   = require('./CompileAndRunInstall').CompileAndRunInstall;
const ComponentFormContainer = require('./dialogs/form/ComponentFormContainer').ComponentFormContainer;
const IDEAssistant           = require('./IDEAssistant').IDEAssistant;
const IDEDOM                 = require('./IDEDOM').IDEDOM;

exports.IDE = class extends IDEDOM {
    constructor(opts) {
        super(opts);
        let ui       = opts.ui;
        let settings = opts.settings;
        this._ui                     = opts.ui;
        this._compileAndRunOutput    = new CompileAndRunOutput({settings: settings});
        this._compileAndRunInstall   = new CompileAndRunInstall({settings: settings});
        this._componentFormContainer = new ComponentFormContainer();
        this._formDialogs            = [];
        this._settings               = settings;
        this._local                  = (document.location.hostname === '127.0.0.1') || window.electron;
        this._title                  = 'No program selected.';
        this._linter                 = null;
        this._editorsState           = new EditorsState();
        this._ideAssistant           = new IDEAssistant({settings: settings, poweredUp: this._poweredUp});
        this
            .initDOM()
            .initGlobalRequire()
            .initEV3()
            .initPoweredUp()
            .initDialogs()
            .initEvents()
            .initWindowResizeListener();
    }

    initGlobalRequire() {
        require('../lib/directoryWatcher').init();
        require('../lib/fileDropHandler').init(this._settings);
        return this;
    }

    initEvents() {
        dispatcher
            .on('Settings.UpdateViewSettings',        this, this.onViewChanged)
            .on('Editors.CloseEditor',                this, this.onEditorChanged)
            .on('Editors.ShowEditor',                 this, this.onEditorChanged)
            .on('Editors.SetBreakpoint',              this, this.onEditorsSetBreakpoint)
            .on('Button.Run',                         this, this.run)
            .on('Button.Compile',                     this, this.onButtonCompile)
            .on('Button.Continue',                    this, this.onButtonContinue)
            .on('Editor.SetBreakpoint',               this, this.onEditorSetBreakpoint)
            .on('Editor.Changed',                     this, this.onEditorsChanged)
            .on('Menu.Module.Load',                   this, this.onMenuModuleLoad)
            .on('Menu.File.NewFile',                  this, this.onMenuFileNewFile)
            .on('Menu.File.NewProjectFile',           this, this.onMenuFileNewProjectFile)
            .on('Menu.File.NewImageFile',             this, this.onMenuFileNewImageFile)
            .on('Menu.File.NewFormFile',              this, this.onMenuFileNewFormFile)
            .on('Menu.File.Open',                     this, this.onMenuFileOpen)
            .on('Menu.File.SaveAs',                   this, this.onSaveAs)
            .on('Menu.File.Exit',                     this, this.onExit)
            .on('Menu.File.Setup',                    this, this.onMenuFileSetup)
            .on('Menu.Edit.Resize',                   this, this.onResize)
            .on('Menu.Find.Find',                     this, this.onFindFind)
            .on('Menu.Find.FindNext',                 this, this.onFindFindNext)
            .on('Menu.Find.Replace',                  this, this.onFindReplace)
            .on('Menu.Find.ReplaceNext',              this, this.onFindReplaceNext)
            .on('Menu.EV3.Connect',                   this, this.onMenuEV3Connect)
            .on('Menu.EV3.DaisyChainMode',            this, this.onMenuEV3DaisyChain)
            .on('Menu.EV3.DirectControl',             this, this.onMenuEV3DirectControl)
            .on('Menu.EV3.StopAllMotors',             this, this.onMenuEV3StopAllMotors)
            .on('Menu.PoweredUp.Connect',             this, this.onMenuPoweredUpConnect)
            .on('Menu.PoweredUp.Disconnect',          this, this.onMenuPoweredUpDisconnect)
            .on('Menu.PoweredUp.AutoConnect',         this, this.onMenuPoweredUpAutoConnect)
            .on('Menu.PoweredUp.DeviceCount',         this, this.onMenuPoweredDeviceCount)
            .on('Menu.PoweredUp.DirectControl',       this, this.onMenuPoweredUpDirectControl)
            .on('Menu.Download.InstallCompiledFiles', this, this.onMenuDownloadInstallCompiledFiles)
            .on('Menu.Compile.Compile',               this, this.onMenuCompileCompile)
            .on('Menu.Compile.CompileAndRun',         this, this.onMenuCompileCompileAndRun)
            .on('Menu.Compile.Run',                   this, this.run)
            .on('Menu.Compile.Stop',                  this, this.onStop)
            .on('Menu.Compile.Continue',              this, this.onContinue)
            .on('Menu.Compile.CompileAndInstall',     this, this.onMenuCompileCompileAndInstall)
            .on('Menu.Compile.Statistics',            this, this.onMenuCompileStatistics)
            .on('Menu.About.Version',                 this, this.onMenuAboutVersion)
            .on('Menu.About.Website',                 this, this.onMenuAboutWebsite)
            .on('Menu.About.ReportIssue',             this, this.onMenuAboutReportIssue)
            .on('FileTree.NewFile',                   this, this.onMenuFileNewFile)
            .on('FileTree.NewProjectFile',            this, this.onMenuFileNewProjectFile)
            .on('FileTree.NewImageFile',              this, this.onMenuFileNewImageFile)
            .on('Compile.Silent',                     this, this.onCompileSilent)
            .on('Form.Show',                          this, this.onShowForm)
            .on('VM.Stop',                            this, this.onVMStop);
        // EV3...
        let ev3 = this._ev3;
        ev3
            .addEventListener('EV3.Connecting', this, this.onEV3Connecting)
            .addEventListener('EV3.Connected',  this, this.onEV3Connected);
        dispatcher.on('Menu.EV3.Disconnect', ev3, ev3.disconnect);
        this._poweredUp
            .addEventListener('PoweredUp.Connecting', this, this.onPoweredUpConnecting)
            .addEventListener('PoweredUp.Connected',  this, this.onPoweredUpConnected);
        this._ideAssistant
            .addEventListener('PoweredUp.Connecting', this, this.onPoweredUpConnecting)
            .addEventListener('PoweredUp.Connected',  this, this.onPoweredUpConnected);
        this._settings
            .addEventListener('Settings.View',        this, this.onViewChanged);
        // Editor...
        let editor = this._editor;
        dispatcher
            .on('Menu.Compile.Stop',                editor, editor.enableBreakpoints)
            .on('Menu.Compile.ClearAllBreakpoints', editor, editor.clearAllBreakpoints)
            .on('Dialog.List.CancelCompile',        this,   this.onCancelCompile);
        return this;
    }

    initWindowResizeListener() {
        this._resizeDebounce = null;
        window.addEventListener(
            'resize',
            (event) => {
                if (this._resizeDebounce) {
                    clearTimeout(this._resizeDebounce);
                }
                this._resizeDebounce = setTimeout(
                    () => {
                        this._resizeDebounce = null;
                        dispatcher.dispatch('Settings.Set.WindowSize', window.outerWidth, window.outerHeight);
                    },
                    100
                );
            }
        );
        return this;
    }

    initEV3() {
        let settings = this._settings;
        if (settings.getEV3AutoConnect() && (settings.getDeviceName() !== '')) {
            dispatcher.dispatch('EV3.ConnectToDevice', settings.getDeviceName());
        }
        return this;
    }

    initPoweredUp() {
        if (platform.isNode()) {
            getDataProvider().getData('post', 'powered-up/disconnect-all', {}, (data) => {});
        }
        let poweredUpAutoConnect = this._settings.getPoweredUpAutoConnect().toJSON();
        getDataProvider().getData(
            'post',
            'powered-up/discover',
            {
                autoConnect: poweredUpAutoConnect
            },
            (data) => {}
        );
        if (poweredUpAutoConnect.length) {
            this._ideAssistant.autoConnectPoweredUp();
        }
        return this;
    }

    callOnActiveEditor(func) {
        let activeEditor = this._editor.getActiveEditor();
        activeEditor && activeEditor[func] && activeEditor[func]();
    }

    showLinterMessages() {
        let linter      = this.getLinter();
        let messages    = linter.getMessages();
        let sortedFiles = this._sortedFiles;
        if (!messages.length) {
            return;
        }
        let documentPath = this._settings.getDocumentPath();
        let message      = messages.length + ' Linter warning' + ((messages.length > 1) ? 's' : '') + ':';
        dispatcher
            .dispatch(
                'Console.Log',
                {
                    type:    SettingsState.CONSOLE_MESSAGE_TYPE_INFO,
                    message: message
                }
            )
            .dispatch('Compile.Warning', this._projectFilename);
        messages.forEach((message) => {
            let token    = message.token;
            let location = path.removePath(documentPath, sortedFiles[token.fileIndex].filename) + '(line:' + (token.lineNum + 1) + ') ';
            let type     = Linter.TYPE_TO_STR[message.type] + ': ';
            switch (message.type) {
                case Linter.WHITE_SPACE:
                    message = location + type + ' found ' + message.expected.found + ' spaces, ' +
                                'expected ' + message.expected.expected + ' spaces.';
                    dispatcher.dispatch(
                        'Console.Log',
                        {
                            type:    SettingsState.CONSOLE_MESSAGE_TYPE_HINT,
                            message: message
                        }
                    );
                    break;
                case Linter.TAB:
                    dispatcher.dispatch(
                        'Console.Log',
                        {
                            type:    SettingsState.CONSOLE_MESSAGE_TYPE_HINT,
                            message: location + type + ' Tab: Invalid whitespace character.'
                        }
                    );
                    break;
                default:
                    dispatcher.dispatch(
                        'Console.Log',
                        {
                            type:    SettingsState.CONSOLE_MESSAGE_TYPE_HINT,
                            message: location + type + '"' + token.origLexeme + '" expected "' + message.expected + '".'
                        }
                    );
                    break;
            }
        });
    }

    showOutput(program) {
        let pathAndFilename = path.getPathAndFilename(this._projectFilename);
        this._editor.add({
            path:     pathAndFilename.path,
            filename: path.replaceExtension(pathAndFilename.filename, '.vm'),
            value:    {
                text: new Text(program, true, false).getOutput(true).trim(),
                rtf:  new Rtf(program).getOutput()
            }
        });
    }

    getNextWinUiId() {
        return this._componentFormContainer.peekUiId();
    }

    getComponentFormContainer() {
        return this._componentFormContainer;
    }

    getActiveEditor() {
        return this._editor.getActiveEditor();
    }

    getEditor(path, filename) {
        let editor = this._editor;
        return editor.findEditor(path, filename) || editor.findEditor((path === '') ? null : path, filename);
    }

    getCompileSilent() {
        return this._compileSilent;
    }

    getLinter() {
        if (this._settings.getLinter()) {
            if (!this._linter) {
                this._linter = new Linter.Linter();
            }
        } else {
            this._linter = null;
        }
        return this._linter;
    }

    getEditorFile(fullPath, callback) {
        let pathAndFilename = path.getPathAndFilename(fullPath);
        let editor          = this._editorsState.findByPathAndFilename(pathAndFilename.path, pathAndFilename.filename);
        if (!editor) {
            return false;
        }
        setTimeout(
            function() {
                // Debug: Check for tabs...
                let s = editor.getValue();
                if (['.whlp', '.whl'].indexOf(path.getExtension(pathAndFilename.filename)) !== -1) {
                    let lines = s.split('\n');
                    s = '';
                    for (let i = 0; i < lines.length; i++) {
                        s += lines[i].trimRight() + '\n';
                    }
                    if (s.indexOf('\t') !== -1) {
                        console.log('Tabs!!!!!');
                        console.log(s.split('\t').join('@@@@'));
                        s = s.split('\t').join('    ');
                    }
                }
                callback(s);
            },
            1
        );
        return true;
    }

    onGetEditorFileData(filename, callback) {
        let projectPath       = path.getPathAndFilename(this._projectFilename).path;
        let documentPath      = this._settings.getDocumentPath();
        let fullProjectPath1  = path.join(projectPath, filename);
        let fullProjectPath2  = path.join(projectPath, path.getPathAndFilename(filename).filename);
        let fullDocumentPath1 = path.join(documentPath, filename);
        let fullDocumentPath2 = path.join(documentPath, path.getPathAndFilename(filename).filename);
        if (this.getEditorFile(filename,          callback) ||
            this.getEditorFile(fullProjectPath1,  callback) ||
            this.getEditorFile(fullDocumentPath1, callback) ||
            this.getEditorFile(fullProjectPath2,  callback) ||
            this.getEditorFile(fullDocumentPath2, callback)) {
            return;
        }
        callback(null);
    }

    onGetFileData(filename, token, callback) {
        const documentPath    = this._settings.getDocumentPath();
        const addDocumentPath = (filename) => {
                return path.join(documentPath, path.removePath(documentPath, filename));
            };
        let projectPath       = path.getPathAndFilename(this._projectFilename).path;
        let fullProjectPath1  = path.join(projectPath, filename);
        let fullProjectPath2  = path.join(projectPath, path.getPathAndFilename(filename).filename);
        let fullDocumentPath1 = addDocumentPath(filename);
        let fullDocumentPath2 = addDocumentPath(path.getPathAndFilename(filename).filename);
        if (this.getEditorFile(filename,          callback) ||
            this.getEditorFile(fullProjectPath1,  callback) ||
            this.getEditorFile(fullDocumentPath1, callback) ||
            this.getEditorFile(fullProjectPath2,  callback) ||
            this.getEditorFile(fullDocumentPath2, callback)) {
            return;
        }
        fullProjectPath1 = addDocumentPath(fullProjectPath1);
        fullProjectPath2 = addDocumentPath(fullProjectPath2);
        getDataProvider().getData(
            'get',
            'ide/file',
            {filename: [fullDocumentPath1, fullProjectPath1, fullDocumentPath2, fullProjectPath2]},
            (data) => {
                try {
                    data = JSON.parse(data);
                } catch (error) {
                    data = {data: null};
                }
                if ((data.data === null) || !data.success) {
                    this._compiling = false;
                    if (!this._compileSilent) {
                        dispatcher.dispatch(
                            'Console.Log',
                            {
                                type:    SettingsState.CONSOLE_MESSAGE_TYPE_ERROR,
                                message: 'Error: File "' + filename + '" not found.'
                            }
                        );
                    }
                    return;
                }
                callback(data.data);
            }
        );
    }

    setChangedWhileRunning(changedWhileRunning) {
        if (this._vm && (this._changedWhileRunning !== changedWhileRunning)) {
            this._changedWhileRunning = changedWhileRunning;
            if (this._vm.running()) {
                this._editor.disableBreakpoints();
                this._program.setBreakpoints([]);
            }
        }
    }

    setRunProgramTitle(value) {
        dispatcher.dispatch('Button.Run.Change', {value: value});
    }
};
