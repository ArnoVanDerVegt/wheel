/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const Downloader                 = require('../ev3/Downloader');
const platform                   = require('../lib/platform');
const path                       = require('../lib/path');
const Http                       = require('../lib/Http').Http;
const dispatcher                 = require('../lib/dispatcher').dispatcher;
const Button                     = require('../lib/components/Button').Button;
const Hint                       = require('../lib/components/Hint').Hint;
const FileTree                   = require('../lib/components/filetree/FileTree').FileTree;
const getDataProvider            = require('../lib/dataprovider/dataProvider').getDataProvider;
const Text                       = require('../program/output/Text').Text;
const Rtf                        = require('../program/output/Rtf').Rtf;
const Linter                     = require('../compiler/linter/Linter');
const getImage                   = require('./data/images').getImage;
const tabIndex                   = require('./tabIndex');
const CompileAndRun              = require('./CompileAndRun').CompileAndRun;
const EditorsState               = require('./editor/EditorsState').EditorsState;
const Editor                     = require('./editor/Editor').Editor;
const Console                    = require('./console/Console').Console;
const Log                        = require('./console/Log');
const MainMenu                   = require('./menu/MainMenu').MainMenu;
const FileDialog                 = require('./dialogs/file/FileDialog').FileDialog;
const FileNewDialog              = require('./dialogs/file/FileNewDialog').FileNewDialog;
const FileRenameDialog           = require('./dialogs/file/FileRenameDialog').FileRenameDialog;
const ExploreDialog              = require('./dialogs/ExploreDialog').ExploreDialog;
const EV3ControlDialog           = require('./dialogs/directcontrol/EV3ControlDialog').EV3ControlDialog;
const PoweredUpControlDialog     = require('./dialogs/directcontrol/PoweredUpControlDialog').PoweredUpControlDialog;
const ConfirmDialog              = require('./dialogs/ConfirmDialog').ConfirmDialog;
const AlertDialog                = require('./dialogs/AlertDialog').AlertDialog;
const SettingsDialog             = require('./dialogs/settings/SettingsDialog').SettingsDialog;
const YesNoCancelDialog          = require('./dialogs/YesNoCancelDialog').YesNoCancelDialog;
const ImageNewDialog             = require('./dialogs/image/ImageNewDialog').ImageNewDialog;
const ImageResizeDialog          = require('./dialogs/image/ImageResizeDialog').ImageResizeDialog;
const ImageLoadDialog            = require('./dialogs/image/ImageLoadDialog').ImageLoadDialog;
const FormNewDialog              = require('./dialogs/form/FormNewDialog').FormNewDialog;
const FormSizeDialog             = require('./dialogs/form/FormSizeDialog').FormSizeDialog;
const ListDialog                 = require('./dialogs/list/ListDialog').ListDialog;
const EV3ConnectListDialog       = require('./dialogs/list/EV3ConnectListDialog').EV3ConnectListDialog;
const PoweredUpConnectListDialog = require('./dialogs/list/PoweredUpConnectListDialog').PoweredUpConnectListDialog;
const StatisticsDialog           = require('./dialogs/statistics/StatisticsDialog').StatisticsDialog;
const VolumeDialog               = require('./dialogs/VolumeDialog').VolumeDialog;
const HelpDialog                 = require('./dialogs/help/HelpDialog').HelpDialog;
const DaisyChainDialog           = require('./dialogs/DaisyChainDialog').DaisyChainDialog;
const LicenseDialog              = require('./dialogs/LicenseDialog').LicenseDialog;
const DirectoryNewDialog         = require('./dialogs/directory/DirectoryNewDialog').DirectoryNewDialog;
const ReplaceDialog              = require('./dialogs/ReplaceDialog').ReplaceDialog;
const DownloadDialog             = require('./dialogs/download/DownloadDialog').DownloadDialog;
const GraphDialog                = require('./dialogs/GraphDialog').GraphDialog;
const DeviceAliasDialog          = require('./dialogs/device/DeviceAliasDialog').DeviceAliasDialog;
const DevicePortAliasDialog      = require('./dialogs/device/DevicePortAliasDialog').DevicePortAliasDialog;
const DeviceCountDialog          = require('./dialogs/device/DeviceCountDialog').DeviceCountDialog;
const WelcomeHintDialog          = require('./dialogs/hint/WelcomeHintDialog').WelcomeHintDialog;
const FormDialog                 = require('./dialogs/form/FormDialog').FormDialog;
const FormGridSizeDialog         = require('./dialogs/form/FormGridSizeDialog').FormGridSizeDialog;
const ComponentFormContainer     = require('./dialogs/form/ComponentFormContainer').ComponentFormContainer;
const Properties                 = require('./properties/Properties').Properties;
const CompileAndRunOutput        = require('./CompileAndRunOutput').CompileAndRunOutput;
const CompileAndRunInstall       = require('./CompileAndRunInstall').CompileAndRunInstall;

exports.IDE = class extends CompileAndRun {
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
        this._editor                 = new Editor({
            ui:           ui,
            settings:     settings,
            ev3:          this._ev3,
            poweredUp:    this._poweredUp,
            editorsState: this._editorsState
        });
        new Console ({
            ui:            ui,
            settings:      settings
        });
        new MainMenu({
            ui:            ui,
            settings:      settings,
            platform:      settings.getOS().platform,
            tabIndex:      tabIndex.MAIN_MENU,
            ev3:           this._ev3,
            poweredUp:     this._poweredUp,
            getImage:      getImage
        });
        new FileTree({
            ui:            ui,
            uiId:          1,
            settings:      settings,
            tabIndex:      tabIndex.FILE_TREE,
            tabIndexClose: tabIndex.CLOSE_FILE_TREE,
            getImage:      getImage
        });
        new Hint({
            ui:            ui,
            settings:      settings
        });
        new Properties({
            ui:            ui,
            settings:      settings
        });
        this
            .initGlobalRequire()
            .initEV3()
            .initDialogs()
            .initDispatcher()
            .initWindowResizeListener()
            .initWelcome();
    }

    initGlobalRequire() {
        require('../lib/directoryWatcher').init();
        require('../lib/fileDropHandler').init(this._settings);
        return this;
    }

    initDispatcher() {
        dispatcher
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
            (function(event) {
                if (this._resizeDebounce) {
                    clearTimeout(this._resizeDebounce);
                }
                this._resizeDebounce = setTimeout(
                    (function() {
                        this._resizeDebounce = null;
                        dispatcher.dispatch('Settings.Set.WindowSize', window.outerWidth, window.outerHeight);
                    }).bind(this),
                    100
                );
            }).bind(this)
        );
        return this;
    }

    initWelcome() {
        if (!platform.isElectron() && !this._settings.getDontShowWelcomeHintDialog()) {
            dispatcher.dispatch('Dialog.WelcomeHint.Show', {});
        }
        return this;
    }

    onEditorChanged(info) {
        dispatcher.dispatch('Button.Compile.Change', {disabled: !info.canCompile});
    }

    onCancelCompile() {
        this._compiling = false;
    }

    onEditorsSetBreakpoint() {
        this.setBreakpoint();
    }

    // Buttons
    onButtonCompile() {
        this._compileSilent = false;
        this._compileAndRun = false;
        this.compile(this._settings.getDocumentPath(), '');
    }

    onButtonContinue() {
        this.onContinue('');
    }

    // File menu...
    onMenuFileNewFile(activeDirectory) {
        dispatcher.dispatch('Dialog.File.New.Show', 'File', activeDirectory);
    }

    onMenuFileNewProjectFile(activeDirectory) {
        dispatcher.dispatch('Dialog.File.New.Show', 'Project', activeDirectory);
    }

    onMenuFileNewImageFile(activeDirectory) {
        dispatcher.dispatch('Dialog.Image.New.Show', activeDirectory, this._settings.getDocumentPath());
    }

    onMenuFileNewFormFile(activeDirectory) {
        dispatcher.dispatch('Dialog.Form.New.Show', activeDirectory, this._settings.getDocumentPath());
    }

    onMenuFileOpen() {
        dispatcher.dispatch('Dialog.File.Show', {mode: 'openFile', index: 'main'});
    }

    onMenuFileSetup() {
        dispatcher.dispatch('Setup.Show', {canCancel: true});
    }

    // Edit menu...
    onResize() {
        let activeEditor = this._editor.getActiveEditor();
        if (activeEditor && activeEditor.canResize && activeEditor.canResize()) {
            dispatcher.dispatch('Dialog.Image.Resize.Show', activeEditor.getWidth(), activeEditor.getHeight());
        }
    }

    // Find menu...
    onFindFind() {
        this.callOnActiveEditor('showFindToolbar');
    }

    onFindFindNext() {
        this.callOnActiveEditor('findNext');
    }

    onFindReplace() {
        this.callOnActiveEditor('showReplaceToolbar');
    }

    onFindReplaceNext() {
        this.callOnActiveEditor('replaceNext');
    }

    // Compile menu...
    onMenuCompileCompile() {
        this._compileAndRun = false;
        this.compile(this._settings.getDocumentPath());
    }

    onMenuCompileCompileAndRun() {
        this._compileAndRun = true;
        this.compile(this._settings.getDocumentPath());
    }

    onMenuCompileCompileAndInstall() {
    }

    onMenuCompileStatistics() {
        dispatcher.dispatch('Dialog.Statistics.Show', {program: this._program});
    }

    // EV3 Menu...
    onMenuEV3Connect() {
        dispatcher.dispatch('Dialog.ConnectEV3.Show');
        this.onSelectDeviceEV3();
    }

    onMenuEV3DaisyChain() {
        dispatcher.dispatch('Dialog.DaisyChain.Show', this._settings.getDaisyChainMode());
    }

    onMenuEV3DirectControl() {
        dispatcher.dispatch(
            'Dialog.EV3Control.Show',
            {
                deviceCount: this._settings.getDaisyChainMode()
            }
        );
    }

    onMenuEV3StopAllMotors() {
        this._ev3.stopAllMotors();
    }

    // Powered Up Menu...
    onMenuPoweredUpConnect() {
        dispatcher.dispatch('Dialog.ConnectPoweredUp.Show');
        this.onSelectDevicePoweredUp();
    }

    onMenuPoweredDeviceCount() {
        dispatcher.dispatch('Dialog.DeviceCount.Show', this._settings.getDeviceCount());
        this.onSelectDevicePoweredUp();
    }

    onMenuPoweredUpDirectControl() {
        dispatcher.dispatch(
            'Dialog.PoweredUpControl.Show',
            {
                deviceCount: this._settings.getDaisyChainMode(),
                withAlias:   true
            }
        );
    }

    onMenuDownloadInstallCompiledFiles() {
        dispatcher.dispatch(
            'Dialog.Download.Show',
            {
                filename:  this._projectFilename,
                resources: this._preProcessor.getResources(),
                program:   this._program
            }
        );
    }

    // About menu...
    onMenuAboutVersion() {
        let settings = this._settings;
        settings.load(function() {
            let os = settings.getOS();
            dispatcher.dispatch(
                'Dialog.Alert.Show',
                {
                    title: 'Wheel',
                    image: 'images/logos/logo.png',
                    lines: ['Version: ' + settings.getVersion() + ', Platform: ' + os.platform + ', Arch: ' + os.arch]
                }
            );
        });
    }

    onMenuAboutWebsite() {
        if (platform.isElectron()) {
            const shell = require('electron').shell;
            shell.openExternal('https://arnovandervegt.github.io/wheel/');
        } else {
            window.open('https://arnovandervegt.github.io/wheel/', 'wheel_github');
        }
    }

    onMenuAboutReportIssue() {
        if (platform.isElectron()) {
            const shell = require('electron').shell;
            shell.openExternal('https://github.com/ArnoVanDerVegt/wheel/issues');
        } else {
            window.open('https://github.com/ArnoVanDerVegt/wheel/issues', 'wheel_github');
        }
    }

    onCompileSilent() {
        // Compile silent, don't show any messages...
        this._compileSilent = true;
        this._compileAndRun = false;
        this.compile(this._settings.getDocumentPath());
    }

    onShowForm(data) {
        if (!this._vm || !this._vm.running()) {
            return;
        }
        let componentFormContainer = this._componentFormContainer;
        let formDialogs            = this._formDialogs;
        let index                  = formDialogs.length;
        formDialogs.push(new FormDialog({
            ui:                     this._ui,
            vm:                     this._vm,
            program:                this._program,
            componentFormContainer: componentFormContainer,
            data:                   data,
            onHide: function(uiId) {
                componentFormContainer.removeWindow(uiId);
                formDialogs[index] = null;
            }
        }).show());
    }

    callOnActiveEditor(func) {
        let activeEditor = this._editor.getActiveEditor();
        activeEditor && activeEditor[func] && activeEditor[func]();
    }

    initEV3() {
        let settings = this._settings;
        if (settings.getEV3AutoConnect() && (settings.getDeviceName() !== '')) {
            dispatcher.dispatch('EV3.ConnectToDevice', settings.getDeviceName());
        }
        return this;
    }

    initDialogs() {
        if (!platform.isElectron()) {
            new FileDialog({getImage: require('../data/images').getImage, ui: this._ui, settings: this._settings});
        }
        new FileNewDialog             ({getImage: getImage, ui: this._ui});
        new FileRenameDialog          ({getImage: getImage, ui: this._ui});
        new ConfirmDialog             ({getImage: getImage, ui: this._ui});
        new AlertDialog               ({getImage: getImage, ui: this._ui});
        new EV3ConnectListDialog      ({getImage: getImage, ui: this._ui});
        new EV3ControlDialog          ({getImage: getImage, ui: this._ui, device: this._ev3});
        new PoweredUpConnectListDialog({getImage: getImage, ui: this._ui, settings: this._settings});
        new PoweredUpControlDialog    ({getImage: getImage, ui: this._ui, settings: this._settings, device: this._poweredUp});
        new SettingsDialog            ({getImage: getImage, ui: this._ui, settings: this._settings});
        new YesNoCancelDialog         ({getImage: getImage, ui: this._ui});
        new ImageNewDialog            ({getImage: getImage, ui: this._ui});
        new ImageResizeDialog         ({getImage: getImage, ui: this._ui});
        new ImageLoadDialog           ({getImage: getImage, ui: this._ui});
        new FormNewDialog             ({getImage: getImage, ui: this._ui});
        new FormSizeDialog            ({getImage: getImage, ui: this._ui});
        new ListDialog                ({getImage: getImage, ui: this._ui, signal: 'Dialog.List.Show'});
        new StatisticsDialog          ({getImage: getImage, ui: this._ui});
        new VolumeDialog              ({getImage: getImage, ui: this._ui});
        new DaisyChainDialog          ({getImage: getImage, ui: this._ui});
        new LicenseDialog             ({getImage: getImage, ui: this._ui});
        new DirectoryNewDialog        ({getImage: getImage, ui: this._ui});
        new ReplaceDialog             ({getImage: getImage, ui: this._ui});
        new GraphDialog               ({getImage: getImage, ui: this._ui});
        new FormGridSizeDialog        ({getImage: getImage, ui: this._ui});
        new WelcomeHintDialog         ({getImage: getImage, ui: this._ui, settings: this._settings});
        new DeviceAliasDialog         ({getImage: getImage, ui: this._ui, settings: this._settings});
        new DevicePortAliasDialog     ({getImage: getImage, ui: this._ui, settings: this._settings});
        new DeviceCountDialog         ({getImage: getImage, ui: this._ui, settings: this._settings});
        new HelpDialog                ({getImage: getImage, ui: this._ui, settings: this._settings});
        new ExploreDialog             ({getImage: getImage, ui: this._ui, ev3: this._ev3, settings: this._settings});
        new DownloadDialog            ({getImage: getImage, ui: this._ui, ev3: this._ev3, settings: this._settings});
        return this;
    }

    onMenuModuleLoad(opts) {
        this._editor.add({
            value:    this._exportsByUrl[opts.url],
            filename: filename,
            path:     'lib/' + opts.filename
        });
    }

    onEV3Connecting() {
        dispatcher.dispatch('Console.Log', {message: 'Connecting to EV3...'});
    }

    onEV3Connected() {
        dispatcher.dispatch('Console.Log', {message: 'Connected to EV3.', className: 'ok'});
    }

    onPoweredUpConnecting(hub) {
        dispatcher.dispatch('Console.Log', {message: 'Connecting to Powered Up <i>' + hub.title + '</i>...'});
    }

    onPoweredUpConnected() {
        dispatcher.dispatch('Console.Log', {message: 'Connected to Powered Up.', className: 'ok'});
    }

    onCreatedPreProcessor(preProcessor) {
        this._editor.setPreProcessor(this._preProcessor);
        dispatcher.dispatch('Console.PreProcessor', this._preProcessor);
    }

    onBreakpoint(vm, breakpoint) {
        this._editor.onBreakpoint(breakpoint);
        dispatcher.dispatch('Console.Breakpoint', breakpoint);
    }

    onCompilerError(opts) {
        if (this._compileSilent) {
            return;
        }
        dispatcher
            .dispatch('Console.Error',               opts)
            .dispatch('Compile.Failed',              this._projectFilename)
            .dispatch('Settings.Set.ConsoleVisible', true);
        this._compileAndRun = false;
    }

    onBeforeCompile() {
        if (this._compileSilent) {
            return;
        }
        this._editor.hideBreakpoint();
        dispatcher
            .dispatch('Button.Run.Change', {disabled: true})
            .dispatch('Compile.Start',     this._projectFilename)
            .dispatch('Console.Clear');
    }

    onGetSource(callback) {
        this._editor.getValue(
            (function(info) {
                this._projectFilename = info.filename;
                this._source          = info.source;
                callback();
            }).bind(this),
            this._compileSilent
        );
    }

    onCompileSuccess(program, lineCount) {
        if (this._compileSilent) {
            return;
        }
        if (this._linter) {
            this.showLinterMessages();
        }
        dispatcher
            .dispatch('Compile.Success',   this._projectFilename)
            .dispatch('Button.Run.Change', {disabled: false});
        let leadingZero     = function(v) { return ('00' + v).substr(-2); };
        let date            = new Date();
        let time            = leadingZero(date.getHours()) + ':' +
                                leadingZero(date.getMinutes()) + ':' +
                                leadingZero(date.getSeconds());
        let pathAndFilename = path.getPathAndFilename(this._projectFilename);
        dispatcher.dispatch(
            'Console.Log',
            {
                message: time + ' <i>' + pathAndFilename.filename + '</i> ' +
                    'Compiled ' + lineCount + ' lines, ' +
                    'generated ' + program.getLength() + ' commands.',
                className: 'ok'
            }
        );
        if (this._settings.getCreateVMTextOutput()) {
            this.showOutput(program);
        }
        this._compileAndRunOutput
            .setProjectFilename(this._projectFilename)
            .setPreProcessor(this._preProcessor)
            .setSimulatorModules(this._simulatorModules)
            .saveOutput(new Rtf(program).getOutput());
        if (this._compileAndRun) {
            this._compileAndRun = false;
            setTimeout(this.run.bind(this), 200);
        }
        this._compileAndRunInstall
            .setEV3(this._ev3)
            .setProgram(this._program)
            .setPreProcessor(this._preProcessor)
            .setProjectFilename(this._projectFilename)
            .installProgram();
    }

    onBeforeRun(program) {
        let settings = this._settings;
        if (settings.getShowSimulatorOnRun() && !settings.getShowSimulator()) {
            dispatcher.dispatch('Settings.Toggle.ShowSimulator');
        }
        program.setBreakpoints(this._editor.getBreakpoints());
    }

    onStop() {
        if (this._vm) {
            this._vm.stop();
            dispatcher.dispatch('Button.Run.Change', {value: 'Run'});
            this.simulatorLoaded();
        }
    }

    onVMStop() {
        // Close all open windows when the VM stops...
        let formDialogs = this._formDialogs;
        for (let i = 0; i < formDialogs.length; i++) {
            if (formDialogs[i]) {
                formDialogs[i].hide();
                formDialogs[i] = null;
            }
        }
    }

    onContinue() {
        if (this._vm.getBreakpoint()) {
            this._editor.hideBreakpoint();
            if (!this._changedWhileRunning) {
                this._program.setBreakpoints(this._editor.getBreakpoints());
            }
            this._vm.continueAfterBreakpoint();
        }
    }

    onSaveAs() {
        let activeEditor = this._editor.getActiveEditor();
        if (!activeEditor) {
            return;
        }
        dispatcher.dispatch(
            'Dialog.File.Show',
            {
                mode:     'saveFile',
                path:     activeEditor.getPath(),
                filename: activeEditor.getFilename()
            }
        );
    }

    onExit() {
        let ipcRenderer = require('electron').ipcRenderer;
        ipcRenderer.send('postMessage', {command: 'quit'});
    }

    onEditorSetBreakpoint() {
        if (this._vm && this._vm.getBreakpoint() && !this._changedWhileRunning) {
            this._program.setBreakpoints(this._editor.getBreakpoints());
        }
    }

    onEditorsChanged() {
        this.setChangedWhileRunning(true);
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
            .dispatch('Console.Log',     {message: message})
            .dispatch('Compile.Warning', this._projectFilename);
        messages.forEach(function(message) {
            let token    = message.token;
            let location = path.removePath(documentPath, sortedFiles[token.fileIndex].filename) + '(line:' + (token.lineNum + 1) + ') ';
            let type     = Linter.TYPE_TO_STR[message.type] + ': ';
            switch (message.type) {
                case Linter.WHITE_SPACE:
                    message = location + type + ' found ' + message.expected.found + ' spaces, ' +
                                'expected ' + message.expected.expected + ' spaces.';
                    dispatcher.dispatch('Console.Log', {message: message});
                    break;
                case Linter.TAB:
                    dispatcher.dispatch('Console.Log', {message: location + type + ' Tab: Invalid whitespace character.'});
                    break;
                default:
                    dispatcher.dispatch(
                        'Console.Log',
                        {message: location + type + '"' + token.origLexeme + '" expected "' + message.expected + '".'}
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

    getEditorFileData(filename, callback) {
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

    getFileData(filename, token, callback) {
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
        getDataProvider().getData(
            'get',
            'ide/file',
            {filename: [fullDocumentPath1, fullProjectPath1, fullDocumentPath2, fullProjectPath2]},
            (function(data) {
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
                                message:   'Error: File "' + filename + '" not found.',
                                className: 'error'
                            }
                        );
                    }
                    return;
                }
                callback(data.data);
            }).bind(this)
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
