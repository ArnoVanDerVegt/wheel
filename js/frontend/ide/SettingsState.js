/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../lib/dispatcher').dispatcher;
const Emitter    = require('../lib/Emitter').Emitter;

exports.SettingsState = class extends Emitter {
    constructor(opts) {
        super(opts);
        this._onLoad           = function() {};
        this._os               = {};
        this._version          = null;
        this._getDataProvider  = opts.getDataProvider;
        this._documentPath     = '';
        this._userDocumentPath = (opts.userDocumentPath || '').split('\\').join('/');
        this._plugins          = {};
        this.onLoad({});
        // Update...
        dispatcher
            .on('Settings.UpdateViewSettings',              this, this._updateViewSettings)
            // Setters...
            .on('Settings.Set.RecentProject',               this, this._setRecentProject)
            .on('Settings.Set.DocumentPath',                this, this._setDocumentPath)
            .on('Settings.Set.DaisyChainMode',              this, this._setDaisyChainMode)
            .on('Settings.Set.DeviceName',                  this, this._setDeviceName)
            .on('Settings.Set.WindowSize',                  this, this._setWindowSize)
            .on('Settings.Set.ShowSimulator',               this, this._setShowSimulator)
            .on('Settings.Set.Resizer.ConsoleSize',         this, this._setResizerConsoleSize)
            .on('Settings.Set.Resizer.FileTreeSize',        this, this._setResizerFileTreeSize)
            .on('Settings.Set.DontShowWelcomeHintDialog',   this, this._setDontShowWelcomeHintDialog)
            .on('Settings.Set.DontShowThemeTile',           this, this._setDontShowThemeTile)
            .on('Settings.Set.FilesDetail',                 this, this._setFilesDetail)
            .on('Settings.Set.LocalFilesDetail',            this, this._setLocalFilesDetail)
            .on('Settings.Set.RemoteFilesDetail',           this, this._setRemoteFilesDetail)
            .on('Settings.Set.LastVersionCheckDate',        this, this._setLastVersionCheckDate)
            .on('Settings.Set.PluginByName',                this, this._setPluginByName)
            // Toggle...
            .on('Settings.Show.PluginByName',               this, this._showPluginByName)
            // Toggle...
            .on('Settings.Toggle.ShowConsole',              this, this._toggleShowConsole)
            .on('Settings.Toggle.ShowFileTree',             this, this._toggleShowFileTree)
            .on('Settings.Toggle.ShowSimulator',            this, this._toggleShowSimulator)
            .on('Settings.Toggle.ShowSimulatorOnRun',       this, this._toggleShowSimulatorOnRun)
            .on('Settings.Toggle.CreateVMTextOutput',       this, this._toggleCreateVMTextOutput)
            .on('Settings.Toggle.Linter',                   this, this._toggleLinter)
            .on('Settings.Toggle.AutoConnect',              this, this._toggleAutoConnect)
            .on('Settings.Toggle.AutoInstall',              this, this._toggleAutoInstall)
            .on('Settings.Toggle.DarkMode',                 this, this._toggleDarkMode);
    }

    load(onLoad) {
        this._onLoad = onLoad;
        this._getDataProvider().getData('get', 'ide/settings-load', {}, this.onLoad.bind(this));
    }

    _save() {
        let settings = {
                documentPath:          this._documentPath,
                createVMTextOutput:    this._createVMTextOutput,
                linter:                this._linter,
                recentProject:         this._recentProject,
                darkMode:              this._darkMode,
                windowSize: {
                    width:             this._windowSize.width,
                    height:            this._windowSize.height
                },
                windowPosition: {
                    x:                 this._windowPosition.x,
                    y:                 this._windowPosition.y
                },
                filesDetail:           this._filesDetail,
                localFilesDetail:      this._localFilesDetail,
                remoteFilesDetail:     this._remoteFilesDetail,
                lastVersionCheckDate:  this._lastVersionCheckDate,
                resizer: {
                    consoleSize:       this._resizer.consoleSize,
                    fileTreeSize:      this._resizer.fileTreeSize
                },
                show: {
                    fileTree:          this._show.fileTree,
                    console:           this._show.console,
                    simulator:         this._show.simulator,
                    simulatorOnRun:    this._show.simulatorOnRun
                },
                dontShow:{
                    welcomeHintDialog: this._dontShow.welcomeHintDialog,
                    themeTile:         this._dontShow.themeTile
                },
                brick: {
                    autoConnect:       this._brick.autoConnect,
                    autoInstall:       this._brick.autoInstall,
                    deviceName:        this._brick.deviceName,
                    daisyChainMode:    this._brick.daisyChainMode
                },
                plugins: this._plugins
            };
        if (this._getDataProvider) {
            this._getDataProvider().getData('post', 'ide/settings-save', {settings: settings});
        }
    }

    _updateViewSettings() {
        if (typeof document === 'undefined') {
            return;
        }
        let items       = ['ide'];
        let noSimulator = !this._show.simulator;
        noSimulator                      && items.push('no-simulator');
        this._show.fileTree              || items.push('no-file-tree');
        this._show.console               || items.push('no-console');
        this._darkMode                   && items.push('dark');
        (this._os.platform === 'darwin') || items.push('scroll-bar');
        if (document.body) {
            document.body.className = items.join(' ');
        }
    }

    getVersion() {
        return this._version;
    }

    getIsInApplicationsFolder() {
        return this._isInApplicationsFolder;
    }

    getDocumentPathExists() {
        return this._documentPathExists;
    }

    getDocumentPath() {
        return (this._documentPath === undefined) ? '' : this._documentPath;
    }

    getUserDocumentPath() {
        return this._userDocumentPath;
    }

    getOS() {
        return this._os;
    }

    getShowFileTree() {
        return this._show.fileTree;
    }

    getShowConsole() {
        return this._show.console;
    }

    getShowSimulator() {
        return this._show.simulator;
    }

    getShowSimulatorOnRun() {
        return this._show.simulatorOnRun;
    }

    getDontShowWelcomeHintDialog() {
        return this._dontShow.welcomeHintDialog;
    }

    getDontShowThemeTile() {
        return this._dontShow.themeTile;
    }

    getCreateVMTextOutput() {
        return this._createVMTextOutput;
    }

    getLinter() {
        return this._linter;
    }

    getAutoConnect() {
        return this._brick.autoConnect;
    }

    getAutoInstall() {
        return this._brick.autoInstall;
    }

    getDeviceName() {
        return this._brick.deviceName;
    }

    getDaisyChainMode() {
        return this._brick.daisyChainMode;
    }

    getRecentProject() {
        return this._recentProject;
    }

    getFilesDetail() {
        return this._filesDetail;
    }

    getLocalFilesDetail() {
        return this._localFilesDetail;
    }

    getRemoteFilesDetail() {
        return this._remoteFilesDetail;
    }

    getLastVersionCheckDate() {
        return this._lastVersionCheckDate;
    }

    getDarkMode() {
        return this._darkMode;
    }

    getResizerConsoleSize() {
        return this._resizer.consoleSize;
    }

    getResizerFileTreeSize() {
        return this._resizer.fileTreeSize;
    }

    getPluginByName(name, defaults) {
        if (name in this._plugins) {
            return this._plugins[name];
        }
        return defaults;
    }

    getDefaultPlugins() {
        return {
            EV3Motors: {
                group:   'EV3',
                name:    'EV3 Motors',
                path:    '../plugins/simulator/ev3motors/Motors',
                visible: true
            },
            EV3: {
                group:   'EV3',
                name:    'EV3',
                path:    '../plugins/simulator/ev3/EV3',
                visible: true
            },
            EV3Sensors: {
                group:   'EV3',
                name:    'EV3 Sensors',
                path:    '../plugins/simulator/ev3sensors/Sensors',
                visible: true
            }
        };
    }

    _setRecentProject(recentProject) {
        this._recentProject = recentProject;
        this._save();
        this.emit('Settings.RecentProject');
    }

    _setDocumentPath(documentPath) {
        this._documentPath = documentPath;
        this._save();
    }

    _setDaisyChainMode(daisyChainMode) {
        this._brick.daisyChainMode = daisyChainMode;
        this._save();
        this.emit('Settings.EV3');
    }

    _setDeviceName(deviceName) {
        this._brick.deviceName = deviceName;
        this._save();
    }

    _setWindowSize(width, height) {
        this._windowSize.width  = width;
        this._windowSize.height = height;
        this._save();
    }

    _setShowSimulator(showSimulator) {
        this._show.simulator = showSimulator;
        this._updateViewSettings();
        this._save();
        this.emit('Settings.View');
    }

    _setResizerConsoleSize(consoleSize) {
        this._resizer.consoleSize = consoleSize;
        this._save();
    }

    _setResizerFileTreeSize(fileTreeSize) {
        this._resizer.fileTreeSize = fileTreeSize;
        this._save();
    }

    _setDontShowWelcomeHintDialog(dontShowWelcomeHintDialog) {
        this._dontShow.welcomeHintDialog = dontShowWelcomeHintDialog;
        this._save();
    }

    _setDontShowThemeTile(themeTile) {
        this._dontShow.themeTile = themeTile;
        this._save();
    }

    _setFilesDetail(filesDetail) {
        this._filesDetail = filesDetail;
        this._save();
    }

    _setLocalFilesDetail(localFilesDetail) {
        this._localFilesDetail = localFilesDetail;
        this._save();
    }

    _setRemoteFilesDetail(remoteFilesDetail) {
        this._remoteFilesDetail = remoteFilesDetail;
        this._save();
    }

    _setLastVersionCheckDate(lastVersionCheckDate) {
        this._lastVersionCheckDate = lastVersionCheckDate;
        this._save();
    }

    _setPluginByName(name, opts) {
        this._plugins[name] = opts;
        this._save();
        this.emit('Settings.Plugin');
    }

    _showPluginByName(name) {
        if (!(name in this._plugins)) {
            return;
        }
        this._plugins[name].visible = true;
        this.emit('Settings.Plugin');
    }

    _toggleShowFileTree() {
        this._show.fileTree = !this._show.fileTree;
        this._updateViewSettings();
        this._save();
        this.emit('Settings.View');
    }

    _toggleShowConsole() {
        this._show.console = !this._show.console;
        this._updateViewSettings();
        this._save();
        this.emit('Settings.View');
    }

    _toggleShowSimulator() {
        this._show.simulator = !this._show.simulator;
        this._updateViewSettings();
        this._save();
        this.emit('Settings.View');
    }

    _toggleShowSimulatorEV3() {
        this._show.simulatorEV3 = !this._show.simulatorEV3;
        this._updateViewSettings();
        this._save();
        this.emit('Settings.View');
    }

    _toggleShowSimulatorSensors() {
        this._show.simulatorSensors = !this._show.simulatorSensors;
        this._updateViewSettings();
        this._save();
        this.emit('Settings.View');
    }

    _toggleShowSimulatorOnRun() {
        this._show.simulatorOnRun = !this._show.simulatorOnRun;
        this._updateViewSettings();
        this._save();
        this.emit('Settings.View');
    }

    _toggleCreateVMTextOutput() {
        this._createVMTextOutput = !this._createVMTextOutput;
        this._save();
        this.emit('Settings.Compile');
    }

    _toggleLinter() {
        this._linter = !this._linter;
        this._save();
        this.emit('Settings.Compile');
    }

    _toggleAutoConnect() {
        this._brick.autoConnect = !this._brick.autoConnect;
        this._save();
        this.emit('Settings.EV3');
    }

    _toggleAutoInstall() {
        this._brick.autoInstall = !this._brick.autoInstall;
        this._save();
        this.emit('Settings.EV3');
    }

    _toggleDarkMode() {
        this._darkMode = !this._darkMode;
        this._save();
        this._updateViewSettings();
        this.emit('Settings.View');
    }

    onLoad(data) {
        if (typeof data === 'string') {
            try {
                data = JSON.parse(data);
            } catch (error) {
                data = {};
            }
        }
        let electron = (typeof window !== 'undefined') && ('electron' in window);
        this._version                    = data.version;
        this._documentPathExists         = data.documentPathExists;
        this._documentPath               = data.documentPath;
        this._isInApplicationsFolder     = data.isInApplicationsFolder;
        this._os                         = data.os || {};
        this._show                       = ('show'                  in data)             ? data.show                        : {};
        this._show.fileTree              = ('fileTree'              in this._show)       ? this._show.fileTree              : true;
        this._show.console               = ('console'               in this._show)       ? this._show.console               : true;
        this._show.simulator             = ('simulator'             in this._show)       ? this._show.simulator             : true;
        this._show.simulatorOnRun        = ('simulatorOnRun'        in this._show)       ? this._show.simulatorOnRun        : true;
        this._dontShow                   = ('dontShow'              in data)             ? data.dontShow                    : {};
        this._dontShow.welcomeHintDialog = ('welcomeHintDialog'     in this._dontShow)   ? this._dontShow.welcomeHintDialog : false;
        this._dontShow.themeTile         = ('themeTile'             in this._dontShow)   ? this._dontShow.themeTile         : false;
        this._windowSize                 = ('windowSize'            in data)             ? data.windowSize                  : {};
        this._windowSize.width           = ('width'                 in this._windowSize) ? this._windowSize.width           : 1200;
        this._windowSize.height          = ('height'                in this._windowSize) ? this._windowSize.height          : 800;
        this._windowPosition             = ('windowPosition'        in data)             ? data.windowPosition              : {};
        this._windowPosition.x           = ('x'                     in data)             ? data.windowPosition.x            : 0;
        this._windowPosition.y           = ('y'                     in data)             ? data.windowPosition.y            : 0;
        this._darkMode                   = ('darkMode'              in data)             ? data.darkMode                    : false;
        this._brick                      = ('brick'                 in data)             ? data.brick                       : {};
        this._brick.autoConnect          = ('autoConnect'           in this._brick)      ? this._brick.autoConnect          : false;
        this._brick.autoInstall          = ('autoInstall'           in this._brick)      ? this._brick.autoInstall          : false;
        this._brick.deviceName           = ('deviceName'            in this._brick)      ? this._brick.deviceName           : '';
        this._brick.daisyChainMode       = ('daisyChainMode'        in this._brick)      ? this._brick.daisyChainMode       : 0;
        this._createVMTextOutput         = ('createVMTextOutput'    in data)             ? data.createVMTextOutput          : !electron;
        this._linter                     = ('linter'                in data)             ? data.linter                      : true;
        this._recentProject              = ('recentProject'         in data)             ? data.recentProject               : '';
        this._filesDetail                = ('filesDetail'           in data)             ? data.filesDetail                 : false;
        this._localFilesDetail           = ('localFilesDetail'      in data)             ? data.localFilesDetail            : false;
        this._remoteFilesDetail          = ('remoteFilesDetail'     in data)             ? data.remoteFilesDetail           : false;
        this._lastVersionCheckDate       = ('lastVersionCheckDate') in data              ? data.lastVersionCheckDate        : '';
        this._resizer                    = ('resizer'               in data)             ? data.resizer                     : {};
        this._resizer.consoleSize        = ('consoleSize'           in this._resizer)    ? this._resizer.consoleSize        : 192;
        this._resizer.fileTreeSize       = ('fileTreeSize'          in this._resizer)    ? this._resizer.fileTreeSize       : 192;
        this._plugins                    = ('plugins'               in data)             ? data.plugins                     : this.getDefaultPlugins();
        this._updateViewSettings();
        dispatcher.dispatch('Brick.LayerCount', this._brick.daisyChainMode);
        this._onLoad();
    }
};
