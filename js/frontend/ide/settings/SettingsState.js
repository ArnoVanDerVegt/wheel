/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const poweredUpModuleConstants        = require('../../../shared/vm/modules/poweredUpModuleConstants');
const spikeModuleConstants            = require('../../../shared/vm/modules/spikeModuleConstants');
const nxtModuleConstants              = require('../../../shared/vm/modules/nxtModuleConstants');
const platform                        = require('../../../shared/lib/platform');
const path                            = require('../../../shared/lib/path');
const dispatcher                      = require('../../lib/dispatcher').dispatcher;
const Emitter                         = require('../../lib/Emitter').Emitter;
const PluginsState                    = require('./PluginsState').PluginsState;
const IncludeFilesState               = require('./IncludeFilesState').IncludeFilesState;
const PoweredUpAutoConnectState       = require('./PoweredUpAutoConnectState').PoweredUpAutoConnectState;
const DefinesState                    = require('./DefinesState').DefinesState;

// How to handle an image when opened:
const IMAGE_OPEN_VIEW                 = 'View';
const IMAGE_OPEN_IMPORT               = 'Import';
const IMAGE_OPEN_ASK                  = 'Ask';

const IMAGE_OPEN_OPTIONS              = [IMAGE_OPEN_VIEW, IMAGE_OPEN_IMPORT, IMAGE_OPEN_ASK];

// Console log levels:
const CONSOLE_MESSAGE_TYPE_INFO       = 'Info';
const CONSOLE_MESSAGE_TYPE_HINT       = 'Hint';
const CONSOLE_MESSAGE_TYPE_WARNING    = 'Warning';
const CONSOLE_MESSAGE_TYPE_ERROR      = 'Error';

const CONSOLE_NEVER                   = 'Never';

const CONSOLE_LOG_LEVELS              = [
        CONSOLE_MESSAGE_TYPE_INFO,
        CONSOLE_MESSAGE_TYPE_HINT,
        CONSOLE_MESSAGE_TYPE_WARNING,
        CONSOLE_MESSAGE_TYPE_ERROR
    ];

const CONSOLE_MIN_MESSAGE_COUNT       = 10;
const CONSOLE_MAX_MESSAGE_COUNT       = 10000;
const CONSOLE_DEFAULT_MESSAGE_COUNT   = 100;

// Source file header
const SOURCE_HEADER_TEXT              = [
        'Copyright (c) {year} - present by {yourName}',
        'Distributed under an {yourLicense}'
    ];

// Export constants...
exports.CONSOLE_MESSAGE_TYPE_INFO     = CONSOLE_MESSAGE_TYPE_INFO;
exports.CONSOLE_MESSAGE_TYPE_HINT     = CONSOLE_MESSAGE_TYPE_HINT;
exports.CONSOLE_MESSAGE_TYPE_WARNING  = CONSOLE_MESSAGE_TYPE_WARNING;
exports.CONSOLE_MESSAGE_TYPE_ERROR    = CONSOLE_MESSAGE_TYPE_ERROR;
exports.CONSOLE_NEVER                 = CONSOLE_NEVER;
exports.CONSOLE_LOG_LEVELS            = CONSOLE_LOG_LEVELS;

exports.CONSOLE_MIN_MESSAGE_COUNT     = CONSOLE_MIN_MESSAGE_COUNT;
exports.CONSOLE_MAX_MESSAGE_COUNT     = CONSOLE_MAX_MESSAGE_COUNT;
exports.CONSOLE_DEFAULT_MESSAGE_COUNT = CONSOLE_DEFAULT_MESSAGE_COUNT;

exports.IMAGE_OPEN_VIEW               = IMAGE_OPEN_VIEW;
exports.IMAGE_OPEN_IMPORT             = IMAGE_OPEN_IMPORT;
exports.IMAGE_OPEN_ASK                = IMAGE_OPEN_ASK;

exports.SettingsState = class extends Emitter {
    /**
     * The systemDocument path is the "real" document path e.g.: "/Users/User/Documents".
     * The documentPath is the path where Wheel is installed e.g.: "/Users/User/Documents/Wheel".
    **/
    constructor(opts) {
        super(opts);
        this._onLoad               = function() {};
        this._os                   = {};
        this._isPackaged           = !!opts.isPackaged;
        this._version              = null;
        this._getDataProvider      = opts.getDataProvider;
        this._documentPath         = '';
        this._systemDocumentPath   = (opts.systemDocumentPath || '').split('\\').join('/');
        this._plugins              = new PluginsState({settings: this});
        this._includeFiles         = new IncludeFilesState({settings: this});
        this._poweredUpAutoConnect = new PoweredUpAutoConnectState({settings: this});
        this._defines              = new DefinesState({settings: this});
        // Update...
        this.onLoad({});
        dispatcher
            .on('Settings.Load.New',                        this, this._loadNewSettings)
            // Setters...
            .on('Settings.Set.RecentPaths',                 this, this._setRecentPaths)
            .on('Settings.Set.RecentProject',               this, this._setRecentProject)
            .on('Settings.Set.RecentForm',                  this, this._setRecentForm)
            .on('Settings.Set.DocumentPath',                this, this._setDocumentPath)
            .on('Settings.Set.DaisyChainMode',              this, this._setDaisyChainMode)
            .on('Settings.Set.DeviceName',                  this, this._setDeviceName)
            .on('Settings.Set.NXTDeviceCount',              this, this._setNXTDeviceCount)
            .on('Settings.Set.PoweredUpDeviceCount',        this, this._setPoweredUpDeviceCount)
            .on('Settings.Set.PoweredUpAutoConnect',        this, this._setPoweredUpAutoConnect)
            .on('Settings.Set.SpikeDeviceCount',            this, this._setSpikeDeviceCount)
            .on('Settings.Set.WindowSize',                  this, this._setWindowSize)
            .on('Settings.Set.Resizer.ConsoleSize',         this, this._setResizerConsoleSize)
            .on('Settings.Set.Resizer.FileTreeSize',        this, this._setResizerFileTreeSize)
            .on('Settings.Set.DontShowThemeTile',           this, this._setDontShowThemeTile)
            .on('Settings.Set.DontShowOpenForm',            this, this._setDontShowOpenForm)
            .on('Settings.Set.DontShowConnected',           this, this._setDontShowConnected)
            .on('Settings.Set.FilesDetail',                 this, this._setFilesDetail)
            .on('Settings.Set.LocalFilesDetail',            this, this._setLocalFilesDetail)
            .on('Settings.Set.RemoteFilesDetail',           this, this._setRemoteFilesDetail)
            .on('Settings.Set.LastVersionCheckDate',        this, this._setLastVersionCheckDate)
            .on('Settings.Set.PluginByName',                this, this._setPluginByName)
            .on('Settings.Set.ActiveDevice',                this, this._setActiveDevice)
            .on('Settings.Set.DeviceAlias',                 this, this._setDeviceAlias)
            .on('Settings.Set.DevicePortAlias',             this, this._setDevicePortAlias)
            .on('Settings.Set.ImageOpen.Bmp',               this, this._setImageOpenBmp)
            .on('Settings.Set.ImageOpen.Png',               this, this._setImageOpenPng)
            .on('Settings.Set.ImageOpen.Jpg',               this, this._setImageOpenJpg)
            .on('Settings.Set.ImageOpen.Gif',               this, this._setImageOpenGif)
            .on('Settings.Set.Console.Visible',             this, this._setConsoleVisible)
            .on('Settings.Set.Console.ShowOnLevel',         this, this._setConsoleShowOnLevel)
            .on('Settings.Set.Console.MessageCount',        this, this._setConsoleMessageCount)
            .on('Settings.Set.FormGridSize',                this, this._setFormGridSize)
            .on('Settings.Set.CreateEventComments',         this, this._setCreateEventComments)
            .on('Settings.Set.CreateVMTextOutput',          this, this._setCreateVMTextOutput)
            .on('Settings.Set.Linter',                      this, this._setLinter)
            .on('Settings.Set.ShowFileTree',                this, this._setShowFileTree)
            .on('Settings.Set.ShowSimulatorOnRun',          this, this._setShowSimulatorOnRun)
            .on('Settings.Set.ShowProperties',              this, this._setShowProperties)
            .on('Settings.Set.ShowSimulator',               this, this._setShowSimulator)
            .on('Settings.Set.ShowNXTTile',                 this, this._setShowNXTTile)
            .on('Settings.Set.ShowEV3Tile',                 this, this._setShowEV3Tile)
            .on('Settings.Set.ShowEV3ImageTile',            this, this._setShowEV3ImageTile)
            .on('Settings.Set.ShowPoweredUpTile',           this, this._setShowPoweredUpTile)
            .on('Settings.Set.ShowNewFormTile',             this, this._setShowNewFormTile)
            .on('Settings.Set.DarkMode',                    this, this._setDarkMode)
            .on('Settings.Set.SensorAutoReset',             this, this._setSensorAutoReset)
            .on('Settings.Set.AutoSelectProperties',        this, this._setAutoSelectProperties)
            .on('Settings.Set.SourceHeaderText',            this, this._setSourceHeaderText)
            // Toggle...
            .on('Settings.Toggle.ShowConsole',              this, this._toggleShowConsole)
            .on('Settings.Toggle.ShowFileTree',             this, this._toggleShowFileTree)
            .on('Settings.Toggle.ShowProperties',           this, this._toggleShowProperties)
            .on('Settings.Toggle.ShowSimulator',            this, this._toggleShowSimulator)
            .on('Settings.Toggle.ShowQuickViewMenu',        this, this._toggleShowQuickViewMenu)
            .on('Settings.Toggle.ShowSimulatorOnRun',       this, this._toggleShowSimulatorOnRun)
            .on('Settings.Toggle.CreateVMTextOutput',       this, this._toggleCreateVMTextOutput)
            .on('Settings.Toggle.Linter',                   this, this._toggleLinter)
            .on('Settings.Toggle.EV3AutoConnect',           this, this._toggleEV3AutoConnect)
            .on('Settings.Toggle.AutoInstall',              this, this._toggleAutoInstall)
            .on('Settings.Toggle.DarkMode',                 this, this._toggleDarkMode)
            .on('Settings.Toggle.SensorAutoReset',          this, this._toggleAutoReset)
            .on('Settings.Toggle.CloseIDEonVMRun',          this, this._toggleCloseIDEonVMRun);
    }

    load(onLoad) {
        this._onLoad = onLoad;
        this._getDataProvider().getData(
            'get',
            'ide/settings-load',
            {systemDocumentPath: this._systemDocumentPath},
            this.onLoad.bind(this)
        );
    }

    _save() {
        if (this._getDataProvider) {
            this._getDataProvider().getData('post', 'ide/settings-save', {settings: this.getSettings()});
        }
        return this;
    }

    save() {
        return this._save();
    }

    getSettings() {
        return {
            documentPath:          this._documentPath,
            createEventComments:   this._createEventComments,
            createVMTextOutput:    this._createVMTextOutput,
            linter:                this._linter,
            recentProject:         this._recentProject,
            recentPaths:           this._recentPaths,
            recentForm:            this._recentForm,
            activeDevice:          this._activeDevice,
            deviceAlias:           this._deviceAlias,
            devicePortAlias:       this._devicePortAlias,
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
            console: {
                visible:           this._console.visible,
                showOnLevel:       this._console.showOnLevel,
                messageCount:      this._console.messageCount
            },
            show: {
                fileTree:          this._show.fileTree,
                properties:        this._show.properties,
                simulator:         this._show.simulator,
                simulatorOnRun:    this._show.simulatorOnRun,
                nxtTile:           this._show.nxtTile,
                ev3Tile:           this._show.ev3Tile,
                ev3ImageTile:      this._show.ev3ImageTile,
                poweredUpTile:     this._show.poweredUpTile,
                spikeTile:         this._show.spikeTile,
                newFormTile:       this._show.newFormTile
            },
            dontShow:{
                themeTile:         this._dontShow.themeTile,
                openForm:          this._dontShow.openForm,
                connected:         this._dontShow.connected
            },
            nxt: {
                deviceCount:       this._nxt.deviceCount
            },
            ev3: {
                autoConnect:       this._ev3.autoConnect,
                autoInstall:       this._ev3.autoInstall,
                deviceName:        this._ev3.deviceName,
                daisyChainMode:    this._ev3.daisyChainMode
            },
            poweredUp: {
                autoConnect:       this._poweredUpAutoConnect.toJSON(),
                deviceCount:       this._poweredUp.deviceCount
            },
            spike: {
                deviceCount:       this._spike.deviceCount
            },
            imageOpen: {
                bmp:               this._imageOpen.bmp,
                png:               this._imageOpen.png,
                jpg:               this._imageOpen.jpg,
                gif:               this._imageOpen.gif
            },
            sensorAutoReset:       this._sensorAutoReset,
            autoSelectProperties:  this._autoSelectProperties,
            sourceHeaderText:      this._sourceHeaderText,
            formGridSize:          this._formGridSize,
            plugins:               this._plugins.toJSON(),
            includeFiles:          this._includeFiles.toJSON(),
            defines:               this._defines.toJSON(),
            closeIDEonVMRun:       this._closeIDEonVMRun
        };
    }

    getVersion() {
        return this._version;
    }

    getIsPackaged() {
        return this._isPackaged;
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

    getSystemDocumentPath() {
        return this._systemDocumentPath;
    }

    getOS() {
        return this._os;
    }

    getShowConsole() {
        return this._console.visible;
    }

    getConsoleShowOnLevel() {
        return this._console.showOnLevel;
    }

    getConsoleMessageCount() {
        return this._console.messageCount;
    }

    getShowFileTree() {
        return this._show.fileTree;
    }

    getShowSimulator() {
        return this._show.simulator;
    }

    getShowProperties() {
        return this._show.properties;
    }

    getShowQuickViewMenu() {
        return this._show.quickViewMenu;
    }

    getShowSimulatorOnRun() {
        return this._show.simulatorOnRun;
    }

    getShowNXTTile() {
        return this._show.nxtTile;
    }

    getShowEV3Tile() {
        return this._show.ev3Tile;
    }

    getShowEV3ImageTile() {
        return this._show.ev3ImageTile;
    }

    getShowPoweredUpTile() {
        return this._show.poweredUpTile;
    }

    getShowSpikeTile() {
        return this._show.spikeTile;
    }

    getShowNewFormTile() {
        return this._show.newFormTile;
    }

    getDontShowThemeTile() {
        return this._dontShow.themeTile;
    }

    getDontShowOpenForm() {
        return this._dontShow.openForm;
    }

    getDontShowConnected() {
        return this._dontShow.connected;
    }

    getCreateVMTextOutput() {
        return this._createVMTextOutput;
    }

    getCreateEventComments() {
        return this._createEventComments;
    }

    getLinter() {
        return this._linter;
    }

    getEV3AutoConnect() {
        return this._ev3.autoConnect;
    }

    getAutoInstall() {
        return this._ev3.autoInstall;
    }

    getDeviceName() {
        return this._ev3.deviceName;
    }

    getNXTDeviceCount() {
        return this._nxt.deviceCount || 1;
    }

    getPoweredUpDeviceCount() {
        return this._poweredUp.deviceCount || 1;
    }

    getPoweredUpAutoConnect() {
        return this._poweredUpAutoConnect;
    }

    getSpikeDeviceCount() {
        return this._spike.deviceCount || 1;
    }

    getValidatedDeviceCount(deviceCount, maxDeviceCount) {
        return ((deviceCount >= 1) && (deviceCount <= maxDeviceCount)) ? deviceCount : 1;
    }

    getImageOpenBmp() {
        return this._imageOpen.bmp;
    }

    getImageOpenPng() {
        return this._imageOpen.png;
    }

    getImageOpenJpg() {
        return this._imageOpen.jpg;
    }

    getImageOpenGif() {
        return this._imageOpen.gif;
    }

    getValidatedImageOpenOption(option) {
        return (IMAGE_OPEN_OPTIONS.indexOf(option) === -1) ? IMAGE_OPEN_VIEW : option;
    }

    getValidatedShowOnLevel(level) {
        if ((level === CONSOLE_NEVER) || (CONSOLE_LOG_LEVELS.indexOf(level) !== -1)) {
            return level;
        }
        return CONSOLE_MESSAGE_TYPE_ERROR;
    }

    getValidatedMessageCount(messageCount) {
        if ((messageCount >= CONSOLE_MIN_MESSAGE_COUNT) && (messageCount <= CONSOLE_MAX_MESSAGE_COUNT)) {
            return messageCount;
        }
        return CONSOLE_DEFAULT_MESSAGE_COUNT;
    }

    getImageOpenForExtension(extension) {
        switch (extension) {
            case '.bmp':  return this._imageOpen.bmp;
            case '.png':  return this._imageOpen.png;
            case '.jpg':  return this._imageOpen.jpg;
            case '.gif':  return this._imageOpen.gif;
        }
        return IMAGE_OPEN_ASK;
    }

    getDaisyChainMode() {
        return this._ev3.daisyChainMode;
    }

    getValidatedDaisyChainMode(daisyChainMode) {
        return ((daisyChainMode > 0) && (daisyChainMode <= 4)) ? daisyChainMode : 1;
    }

    getRecentProject() {
        return this._recentProject;
    }

    getRecentPaths() {
        return this._recentPaths;
    }

    getRecentForm() {
        return this._recentForm;
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

    getPlugins() {
        return this._plugins;
    }

    getIncludeFiles() {
        return this._includeFiles;
    }

    getDefines() {
        return this._defines;
    }

    getActiveDevice() {
        return this._activeDevice;
    }

    getDeviceAlias(uuid) {
        return this._deviceAlias[uuid] || uuid;
    }

    getDevicePortAlias(uuid, port) {
        if (!this._devicePortAlias[uuid] || !this._devicePortAlias[uuid][port]) {
            return (port + 1) + '';
        }
        return this._devicePortAlias[uuid][port];
    }

    getSensorAutoReset() {
        return this._sensorAutoReset;
    }

    getAutoSelectProperties() {
        return this._autoSelectProperties;
    }

    getSourceHeaderText() {
        let text = '; ' + this._sourceHeaderText.join('\n; ') + '\n';
        return text.split('{year}').join(new Date().getFullYear());
    }

    getFormGridSize() {
        return this._formGridSize;
    }

    getCloseIDEonVMRun() {
        return this._closeIDEonVMRun;
    }

    getGlobalDefines() {
        return {};
    }

    _setRecentProject(recentProject) {
        this._recentProject = recentProject;
        this._save();
        this.emit('Settings.RecentProject');
    }

    _setRecentPaths(recentPaths) {
        this._recentPaths.length = 0;
        recentPaths.forEach((recentPath) => {
            // Save the path relative to the document path...
            this._recentPaths.push(path.removePath(this._documentPath, recentPath));
        });
        this._save();
    }

    _setRecentForm(recentForm) {
        this._recentForm = recentForm;
        this._save();
        this.emit('Settings.RecentForm');
    }

    _setDocumentPath(documentPath) {
        this._documentPath = documentPath;
        this._save();
    }

    _setDaisyChainMode(daisyChainMode) {
        this._ev3.daisyChainMode = this.getValidatedDaisyChainMode(daisyChainMode);
        this._save();
        this.emit('Settings.EV3');
    }

    _setDeviceName(deviceName) {
        this._ev3.deviceName = deviceName;
        this._save();
    }

    _setNXTDeviceCount(deviceCount) {
        this._nxt.deviceCount = this.getValidatedDeviceCount(deviceCount || 1, nxtModuleConstants.NXT_LAYER_COUNT);
        this._save();
        this.emit('Settings.NXT');
    }

    _setPoweredUpDeviceCount(deviceCount) {
        this._poweredUp.deviceCount = this.getValidatedDeviceCount(deviceCount || 1, poweredUpModuleConstants.POWERED_UP_LAYER_COUNT);
        this._save();
        this.emit('Settings.PoweredUp');
    }

    _setPoweredUpAutoConnect(autoConnect) {
        this._poweredUp.autoConnect = autoConnect;
        this._save();
        this.emit('Settings.PoweredUp');
    }

    _setSpikeDeviceCount(deviceCount) {
        this._spike.deviceCount = this.getValidatedDeviceCount(deviceCount || 1, spikeModuleConstants.SPIKE_LAYER_COUNT);
        this._save();
        this.emit('Settings.Spike');
    }

    _setWindowSize(width, height) {
        this._windowSize.width  = width;
        this._windowSize.height = height;
        this._save();
    }

    _setResizerConsoleSize(consoleSize) {
        this._resizer.consoleSize = consoleSize;
        this._save();
    }

    _setResizerFileTreeSize(fileTreeSize) {
        this._resizer.fileTreeSize = fileTreeSize;
        this._save();
    }

    _setDontShowThemeTile(themeTile) {
        this._dontShow.themeTile = themeTile;
        this._save();
    }

    _setDontShowOpenForm(openForm) {
        this._dontShow.openForm = openForm;
        this._save();
    }

    _setDontShowConnected(connected) {
        this._dontShow.connected = connected;
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

    _setActiveDevice(activeDevice) {
        this._activeDevice = activeDevice;
        this._save();
    }

    _setDeviceAlias(uuid, alias) {
        this._deviceAlias[uuid] = alias;
        this._save();
        this.emit('Settings.AliasChanged');
    }

    _setDevicePortAlias(uuid, port, alias) {
        if (!this._devicePortAlias[uuid]) {
            this._devicePortAlias[uuid] = [];
        }
        this._devicePortAlias[uuid][port] = alias;
        this._save();
        this.emit('Settings.AliasPortChanged');
    }

    _setImageOpenBmp(imageOpenBmp) {
        this._imageOpen.bmp = this.getValidatedImageOpenOption(imageOpenBmp);
        this._save();
    }

    _setImageOpenPng(imageOpenPng) {
        this._imageOpen.png = this.getValidatedImageOpenOption(imageOpenPng);
        this._save();
    }

    _setImageOpenJpg(imageOpenJpg) {
        this._imageOpen.jpg = this.getValidatedImageOpenOption(imageOpenJpg);
        this._save();
    }

    _setImageOpenGif(imageOpenGif) {
        this._imageOpen.gif = this.getValidatedImageOpenOption(imageOpenGif);
        this._save();
    }

    _setConsoleVisible(visible) {
        this._console.visible = visible;
        this._save().emit('Settings.View');
    }

    _setConsoleShowOnLevel(level) {
        this._console.showOnLevel = this.getValidatedShowOnLevel(level);
        this._save();
    }

    _setConsoleMessageCount(messageCount) {
        this._console.messageCount = this.getValidatedMessageCount(messageCount);
        this._save();
    }

    _setFormGridSize(formGridSize) {
        this._formGridSize = formGridSize;
        this._save();
        this.emit('Settings.Grid.Size', formGridSize);
    }

    _setCreateEventComments(createEventComments) {
        this._createEventComments = createEventComments;
        this._save();
    }

    _setCreateVMTextOutput(createVMTextOutput) {
        this._createVMTextOutput = createVMTextOutput;
        this._save();
        this.emit('Settings.Compile');
    }

    _setLinter(linter) {
        this._linter = linter;
        this._save();
        this.emit('Settings.Compile');
    }

    _setShowFileTree(showFileTree) {
        this._show.fileTree = showFileTree;
        this._save().emit('Settings.View');
    }

    _setShowSimulatorOnRun(showSimulatorOnRun) {
        this._show.simulatorOnRun = !this._show.simulatorOnRun;
        this._save().emit('Settings.View');
    }

    _setShowSimulator(showSimulator) {
        this._show.simulator = showSimulator;
        if (showSimulator) {
            this._show.properties = false;
        }
        this._save().emit('Settings.View');
    }

    _setShowProperties(showProperties) {
        this._show.properties = showProperties;
        if (showProperties) {
            this._show.simulator = false;
        }
        this._save().emit('Settings.View');
    }

    _setShowNXTTile(showNXTTile) {
        this._show.nxtTile = showNXTTile;
        this._save();
        this.emit('Settings.HomeScreen');
    }

    _setShowEV3Tile(showEV3Tile) {
        this._show.ev3Tile = showEV3Tile;
        this._save();
        this.emit('Settings.HomeScreen');
    }

    _setShowEV3ImageTile(showEV3ImageTile) {
        this._show.ev3ImageTile = showEV3ImageTile;
        this._save();
        this.emit('Settings.HomeScreen');
    }

    _setShowPoweredUpTile(showPoweredUpTile) {
        this._show.poweredUpTile = showPoweredUpTile;
        this._save();
        this.emit('Settings.HomeScreen');
    }

    _setShowSpikeTile(showSpikeTile) {
        this._show.spikeTile = showSpikeTile;
        this._save();
        this.emit('Settings.HomeScreen');
    }

    _setShowNewFormTile(showNewFormTile) {
        this._show.newFormTile = showNewFormTile;
        this._save();
        this.emit('Settings.HomeScreen');
    }

    _setDarkMode(darkMode) {
        this._darkMode = darkMode;
        this._save().emit('Settings.View');
    }

    _setSensorAutoReset(sensorAutoReset) {
        this._sensorAutoReset = sensorAutoReset;
        this._save();
        this.emit('Settings.Simulator');
    }

    _setAutoSelectProperties(autoSelectProperties) {
        this._autoSelectProperties = autoSelectProperties;
        this._save();
    }

    _setSourceHeaderText(sourceHeaderText) {
        this._sourceHeaderText = (typeof sourceHeaderText === 'string') ? sourceHeaderText.split('\n') : sourceHeaderText;
        this._save();
    }

    _toggleShowFileTree() {
        this._show.fileTree = !this._show.fileTree;
        this._save().emit('Settings.View');
    }

    _toggleShowConsole() {
        this._setConsoleVisible(!this._console.visible);
    }

    _toggleShowProperties() {
        this._show.properties = !this._show.properties;
        if (this._show.properties) {
            this._show.simulator = false;
        }
        this._save().emit('Settings.View');
    }

    _toggleShowSimulator() {
        this._show.simulator = !this._show.simulator;
        if (this._show.simulator) {
            this._show.properties = false;
        }
        this._save().emit('Settings.View');
    }

    _toggleShowQuickViewMenu() {
        this._show.quickViewMenu = !this._show.quickViewMenu;
        this._save().emit('Settings.View');
    }

    _toggleShowSimulatorOnRun() {
        this._setShowSimulatorOnRun(!this._show.simulatorOnRun);
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

    _toggleEV3AutoConnect() {
        this._ev3.autoConnect = !this._ev3.autoConnect;
        this._save();
        this.emit('Settings.EV3');
    }

    _toggleAutoInstall() {
        this._ev3.autoInstall = !this._ev3.autoInstall;
        this._save();
        this.emit('Settings.EV3');
    }

    _toggleDarkMode() {
        this._setDarkMode(!this._darkMode);
    }

    _toggleAutoReset() {
        this._setSensorAutoReset(!this._sensorAutoReset);
    }

    _toggleCloseIDEonVMRun() {
        this._closeIDEonVMRun = !this._closeIDEonVMRun;
        this._save();
        this.emit('Settings.Run');
    }

    _loadNewSettings(settings) {
        this
            .onLoad(settings)
            .emit('Settings.Grid.Size', this._formGridSize)
            .emit('Settings.AliasChanged')
            .emit('Settings.AliasPortChanged')
            .emit('Settings.Simulator')
            .emit('Settings.View')
            .emit('Settings.Compile')
            .emit('Settings.EV3')
            .emit('Settings.PoweredUp');
    }

    onLoad(data) {
        if (typeof data === 'string') {
            try {
                data = JSON.parse(data);
            } catch (error) {
                data = {};
            }
        }
        let electron = platform.isElectron();
        if ('os' in data) {
            this._os = data.os;
        }
        let maxNXT = nxtModuleConstants.NXT_LAYER_COUNT;
        let maxPU  = poweredUpModuleConstants.POWERED_UP_LAYER_COUNT;
        let maxS   = spikeModuleConstants.SPIKE_LAYER_COUNT;
        this._version                    = data.version;
        this._documentPathExists         = data.documentPathExists;
        this._documentPath               = data.documentPath;
        this._isInApplicationsFolder     = data.isInApplicationsFolder;
        this._systemDocumentPath         = ('systemDocumentPath'    in data)             ? data.systemDocumentPath                                          : this._systemDocumentPath;
        this._console                    = ('console'               in data)             ? data.console                                                     : {};
        this._console.visible            = ('visible'               in this._console)    ? this._console.visible                                            : true;
        this._console.showOnLevel        = ('showOnLevel'           in this._console)    ? this.getValidatedShowOnLevel(this._console.showOnLevel)          : CONSOLE_MESSAGE_TYPE_ERROR;
        this._console.messageCount       = ('messageCount'          in this._console)    ? this.getValidatedMessageCount(this._console.messageCount)        : CONSOLE_DEFAULT_MESSAGE_COUNT;
        this._show                       = ('show'                  in data)             ? data.show                                                        : {};
        this._show.fileTree              = ('fileTree'              in this._show)       ? this._show.fileTree                                              : true;
        this._show.properties            = ('properties'            in this._show)       ? this._show.properties                                            : false;
        this._show.simulator             = ('simulator'             in this._show)       ? this._show.simulator                                             : true;
        this._show.quickViewMenu         = ('quickViewMenu'         in this._show)       ? this._show.quickViewMenu                                         : true;
        this._show.simulatorOnRun        = ('simulatorOnRun'        in this._show)       ? this._show.simulatorOnRun                                        : true;
        this._show.nxtTile               = ('nxtTile'               in this._show)       ? this._show.nxtTile                                               : true;
        this._show.ev3Tile               = ('ev3Tile'               in this._show)       ? this._show.ev3Tile                                               : true;
        this._show.ev3ImageTile          = ('ev3ImageTile'          in this._show)       ? this._show.ev3ImageTile                                          : true;
        this._show.poweredUpTile         = ('poweredUpTile'         in this._show)       ? this._show.poweredUpTile                                         : true;
        this._show.spikeTile             = ('spikeTile'             in this._show)       ? this._show.spikeTile                                             : true;
        this._show.newFormTile           = ('newFormTile'           in this._show)       ? this._show.newFormTile                                           : true;
        this._dontShow                   = ('dontShow'              in data)             ? data.dontShow                                                    : {};
        this._dontShow.themeTile         = ('themeTile'             in this._dontShow)   ? this._dontShow.themeTile                                         : false;
        this._dontShow.openForm          = ('openForm'              in this._dontShow)   ? this._dontShow.openForm                                          : false;
        this._dontShow.connected         = ('connected'             in this._dontShow)   ? this._dontShow.connected                                         : false;
        this._windowSize                 = ('windowSize'            in data)             ? data.windowSize                                                  : {};
        this._windowSize.width           = ('width'                 in this._windowSize) ? this._windowSize.width                                           : 1200;
        this._windowSize.height          = ('height'                in this._windowSize) ? this._windowSize.height                                          : 800;
        this._windowPosition             = ('windowPosition'        in data)             ? data.windowPosition                                              : {};
        this._windowPosition.x           = ('x'                     in data)             ? data.windowPosition.x                                            : 0;
        this._windowPosition.y           = ('y'                     in data)             ? data.windowPosition.y                                            : 0;
        this._darkMode                   = ('darkMode'              in data)             ? data.darkMode                                                    : false;
        this._activeDevice               = ('activeDevice'          in data)             ? data.activeDevice                                                : 1;
        this._nxt                        = ('nxt'                   in data)             ? data.nxt                                                         : {};
        this._nxt.deviceCount            = ('deviceCount'           in this._nxt)        ? this.getValidatedDeviceCount(this._nxt.deviceCount, maxNXT)      : 1;
        this._ev3                        = ('ev3'                   in data)             ? data.ev3                                                         : {};
        this._ev3.autoConnect            = ('autoConnect'           in this._ev3)        ? this._ev3.autoConnect                                            : false;
        this._ev3.autoInstall            = ('autoInstall'           in this._ev3)        ? this._ev3.autoInstall                                            : false;
        this._ev3.deviceName             = ('deviceName'            in this._ev3)        ? this._ev3.deviceName                                             : '';
        this._ev3.daisyChainMode         = ('daisyChainMode'        in this._ev3)        ? this.getValidatedDaisyChainMode(this._ev3.daisyChainMode)        : 1;
        this._poweredUp                  = ('poweredUp'             in data)             ? data.poweredUp                                                   : {};
        this._poweredUp.deviceCount      = ('deviceCount'           in this._poweredUp)  ? this.getValidatedDeviceCount(this._poweredUp.deviceCount, maxPU) : 1;
        this._spike                      = ('spike'                 in data)             ? data.spike                                                       : {};
        this._spike.deviceCount          = ('deviceCount'           in this._spike)      ? this.getValidatedDeviceCount(this._spike.deviceCount, maxS)      : 1;
        this._imageOpen                  = ('imageOpen'             in data)             ? data.imageOpen                                                   : {};
        this._imageOpen.bmp              = ('bmp'                   in this._imageOpen)  ? this.getValidatedImageOpenOption(this._imageOpen.bmp)            : 'View';
        this._imageOpen.png              = ('png'                   in this._imageOpen)  ? this.getValidatedImageOpenOption(this._imageOpen.png)            : 'View';
        this._imageOpen.jpg              = ('jpg'                   in this._imageOpen)  ? this.getValidatedImageOpenOption(this._imageOpen.jpg)            : 'View';
        this._imageOpen.gif              = ('gif'                   in this._imageOpen)  ? this.getValidatedImageOpenOption(this._imageOpen.gif)            : 'View';
        this._createVMTextOutput         = ('createVMTextOutput'    in data)             ? data.createVMTextOutput                                          : false;
        this._createEventComments        = ('createEventComments'   in data)             ? data.createEventComments                                         : true;
        this._linter                     = ('linter'                in data)             ? data.linter                                                      : true;
        this._recentProject              = ('recentProject'         in data)             ? data.recentProject                                               : '';
        this._recentPaths                = ('recentPaths'           in data)             ? data.recentPaths                                                 : [];
        this._recentForm                 = ('recentForm'            in data)             ? data.recentForm                                                  : '';
        this._filesDetail                = ('filesDetail'           in data)             ? data.filesDetail                                                 : false;
        this._localFilesDetail           = ('localFilesDetail'      in data)             ? data.localFilesDetail                                            : false;
        this._remoteFilesDetail          = ('remoteFilesDetail'     in data)             ? data.remoteFilesDetail                                           : false;
        this._lastVersionCheckDate       = ('lastVersionCheckDate') in data              ? data.lastVersionCheckDate                                        : '';
        this._resizer                    = ('resizer'               in data)             ? data.resizer                                                     : {};
        this._resizer.consoleSize        = ('consoleSize'           in this._resizer)    ? this._resizer.consoleSize                                        : 192;
        this._resizer.fileTreeSize       = ('fileTreeSize'          in this._resizer)    ? this._resizer.fileTreeSize                                       : 192;
        this._deviceAlias                = ('deviceAlias'           in data)             ? data.deviceAlias                                                 : {};
        this._devicePortAlias            = ('devicePortAlias'       in data)             ? data.devicePortAlias                                             : {};
        this._sensorAutoReset            = ('sensorAutoReset'       in data)             ? data.sensorAutoReset                                             : true;
        this._autoSelectProperties       = ('autoSelectProperties'  in data)             ? data.autoSelectProperties                                        : true;
        this._sourceHeaderText           = ('sourceHeaderText'      in data)             ? data.sourceHeaderText                                            : SOURCE_HEADER_TEXT;
        this._formGridSize               = ('formGridSize'          in data)             ? data.formGridSize                                                : 10;
        this._closeIDEonVMRun            = ('closeIDEonVMRun'       in data)             ? data.closeIDEonVMRun                                             : false;
        if (this._show.simulator) {
            this._show.properties = false;
        } else if (this._show.properties) {
            this._show.simulator = false;
        }
        if ('plugins' in data) {
            this._plugins.load(data.plugins);
        } else {
            this._plugins.loadDefaults();
        }
        if ('includeFiles' in data) {
            this._includeFiles.load(data.includeFiles);
        } else {
            this._includeFiles.loadDefaults();
        }
        if ('defines' in data) {
            this._defines.load(data.defines);
        }
        if ('autoConnect' in this._poweredUp) {
            this._poweredUpAutoConnect.load(this._poweredUp.autoConnect);
        }
        dispatcher
            .dispatch('EV3.ActiveLayerCount', this._ev3.daisyChainMode)
            .dispatch('PoweredUp.ActiveLayerCount', this._poweredUp.deviceCount)
            .dispatch('Spike.ActiveLayerCount', this._poweredUp.deviceCount);
        this._onLoad();
        this.emit('Settings.View');
        return this;
    }
};
