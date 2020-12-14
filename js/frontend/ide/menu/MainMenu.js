/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const MainMenu    = require('../../lib/components/mainmenu/MainMenu').MainMenu;
const ProgressBar = require('../../lib/components/status/ProgressBar').ProgressBar;
const Button      = require('../../lib/components/input/Button').Button;
const platform    = require('../../lib/platform');
const dispatcher  = require('../../lib/dispatcher').dispatcher;
const tabIndex    = require('../tabIndex');
const HelpOption  = require('./HelpOption').HelpOption;

exports.MainMenu = class extends MainMenu {
    constructor(opts) {
        super(opts);
        let ev3       = opts.ev3;
        let poweredUp = opts.poweredUp;
        let settings  = opts.settings;
        this._ui        = opts.ui;
        this._ev3       = ev3;
        this._poweredUp = poweredUp;
        this._settings  = settings;
        this
            .initMenu()
            .initQuickMenu()
            .initHelp()
            .initStorage();
        // Settings events...
        settings
            .addEventListener('Settings.View',        this, this.onUpdateViewMenu)
            .addEventListener('Settings.EV3',         this, this.onUpdateEV3Menu)
            .addEventListener('Settings.PoweredUp',   this, this.onUpdatePoweredUpMenu)
            .addEventListener('Settings.Compile',     this, this.onUpdateCompileMenu)
            .addEventListener('Settings.Run',         this, this.onUpdateRunMenu)
            .addEventListener('Settings.Plugin',      this, this.onUpdateSimulatorMenu)
            .addEventListener('Settings.Simulator',   this, this.onUpdateSimulatorMenu);
        // EV3 events...
        ev3
            .addEventListener('EV3.Connecting',       this, this.onEV3Connecting)
            .addEventListener('EV3.Connected',        this, this.onUpdateEV3Menu)
            .addEventListener('EV3.Disconnect',       this, this.onUpdateEV3Menu)
            .addEventListener('EV3.Disconnected',     this, this.onUpdateEV3Menu);
        poweredUp
            .addEventListener('PoweredUp.Connecting', this, this.onPoweredUpConnecting)
            .addEventListener('PoweredUp.Connected',  this, this.onUpdatePoweredUpMenu)
            .addEventListener('PoweredUp.Disconnect', this, this.onUpdatePoweredUpMenu);
        dispatcher
            .on('VM',                         this, this.onVM)
            .on('VM.Run',                     this, this.onVM)
            .on('VM.Start',                   this, this.onVM)
            .on('VM.Stop',                    this, this.onVM)
            .on('VM.Continue',                this, this.onVM)
            .on('VM.Breakpoint',              this, this.onVM)
            .on('Editors.ShowEditor',         this, this.onUpdateFileMenu)
            .on('Editors.CloseEditor',        this, this.onUpdateFileMenu)
            .on('Editor.Changed',             this, this.onUpdateFileMenu)
            .on('Editors.ShowEditor',         this, this.onUpdateEditMenu)
            .on('Editors.CloseEditor',        this, this.onUpdateEditMenu)
            .on('Editor.Changed',             this, this.onUpdateEditMenu)
            .on('Editors.ShowEditor',         this, this.onUpdateCompileMenu)
            .on('Editors.CloseEditor',        this, this.onUpdateCompileMenu)
            .on('Editor.Changed',             this, this.onUpdateCompileMenu)
            .on('Editors.OpenEditor',         this, this.onEditorsChanged)
            .on('Editors.CloseEditor',        this, this.onEditorsChanged)
            .on('Editors.ShowEditor',         this, this.onEditorsChanged)
            .on('Editors.ChangeEditor',       this, this.onEditorsChanged)
            .on('Compile.Compiled',           this, this.onVM)
            .on('ImageEditor.Selection.Hide', this, this.onUpdateCropDisable)
            .on('ImageEditor.Selection.Show', this, this.onUpdateCropEnable);
    }

    initStorage() {
        if (platform.isElectron() || platform.isNode()) {
            return this;
        }
        this.create(
            this._mainMenuElement,
            {
                className: 'storage',
                children: [
                    {
                        className: 'storage-label',
                        innerHTML: 'Storage'
                    },
                    {
                        type:  ProgressBar,
                        event: 'LocalStorage.Size',
                        ui:    this._ui
                    }
                ]
            }
        );
        return this;
    }

    initQuickMenu() {
        this.create(
            this._mainMenuElement,
            {
                className: 'flt resource-options main-menu',
                children: [
                    {
                        type:      Button,
                        ui:        this._ui,
                        uiId:      1,
                        tabIndex:  tabIndex.QUICK_VIEW_MENU,
                        className: 'toolbar-button',
                        color:     ' ',
                        icon:      'flt icon-folder',
                        hint:      {text: 'Toggle folder panel'},
                        dispatch:  'Settings.Toggle.ShowFileTree'
                    },
                    {
                        type:      Button,
                        ui:        this._ui,
                        uiId:      1,
                        tabIndex:  tabIndex.QUICK_VIEW_MENU + 1,
                        className: 'toolbar-button',
                        color:     ' ',
                        icon:      'flt icon-error',
                        hint:      {text: 'Toggle console panel'},
                        dispatch:  'Settings.Toggle.ShowConsole'
                    },
                    {
                        type:      Button,
                        ui:        this._ui,
                        uiId:      1,
                        tabIndex:  tabIndex.QUICK_VIEW_MENU + 2,
                        className: 'toolbar-button',
                        color:     ' ',
                        icon:      'flt icon-tag',
                        hint:      {text: 'Toggle component and properties panel'},
                        dispatch:  'Settings.Toggle.ShowProperties'
                    },
                    {
                        type:      Button,
                        ui:        this._ui,
                        uiId:      1,
                        tabIndex:  tabIndex.QUICK_VIEW_MENU + 3,
                        className: 'toolbar-button',
                        color:     ' ',
                        icon:      'flt icon-simulator',
                        hint:      {text: 'Toggle simulator panel'},
                        dispatch:  'Settings.Toggle.ShowSimulator'
                    }
                ]
            }
        );
        return this;
    }

    initHelp() {
        this.create(
            this._mainMenuElement,
            {
                type:     HelpOption,
                ui:       this._ui,
                settings: this._settings
            }
        );
        return this;
    }

    initMenu() {
        return this
            .initFileMenu()
            .initEditMenu()
            .initFindMenu()
            .initEV3Menu()
            .initPoweredUpMenu()
            .initCompileMenu()
            .initRunMenu()
            .initViewMenu()
            .initSimulatorMenu()
            .initToolsMenu()
            .initAboutMenu()
            .onUpdateViewMenu()
            .onUpdateSimulatorMenu()
            .onUpdateCompileMenu()
            .onUpdateRunMenu()
            .onVM()
            .onUpdateEV3Menu()
            .onUpdatePoweredUpMenu()
            .onUpdateFileMenu();
    }

    initFileMenu() {
        this._fileMenu = this.addMenu({
            title: '^File',
            width: '272px',
            items: [
                {title: 'New file...',                  hotkey: ['command', 'N'], dispatch: 'Menu.File.NewFile'},
                {title: 'New project file...',          hotkey: ['command', 'P'], dispatch: 'Menu.File.NewProjectFile'},
                {title: 'New Powered Up project...',                              dispatch: 'Dialog.File.PoweredUpProject'},
                {title: 'New image...',                 hotkey: ['command', 'I'], dispatch: 'Menu.File.NewImageFile'},
                {title: 'New form...',                                            dispatch: 'Menu.File.NewFormFile'},
                {title: '-'},
                {title: 'Open...',                      hotkey: ['command', 'O'], dispatch: 'Menu.File.Open'},
                {title: 'Save',                         hotkey: ['command', 'S'], dispatch: 'Editor.Save'},
                {title: 'Save as...',                                             dispatch: 'Menu.File.SaveAs'},
                {title: '-'},
                {title: 'Close',                        hotkey: ['command', 'X'], dispatch: 'Editor.CloseFile'},
                {title: '-'},
                {title: 'Settings...',                                            dispatch: 'Dialog.Settings.Show'},
                {title: '-'},
                {title: 'Exit Wheel',                   hotkey: ['command', 'Q'], dispatch: 'Menu.File.Exit'}
            ]
        });
        let menuOptions = this._fileMenu.getMenu().getMenuOptions();
        menuOptions[10].setEnabled(platform.isElectron()); // Exit Wheel
        return this;
    }

    initEditMenu() {
        this._editMenu = this.addMenu({
            title: '^Edit',
            width: '160px',
            items: [
                {title: 'Undo',                         hotkey: ['command', 'Z'], dispatch: 'Editor.Undo'},
                {title: '-'},
                {title: 'Copy',                         hotkey: ['command', 'C'], dispatch: 'Editor.Copy'},
                {title: 'Paste',                        hotkey: ['command', 'V'], dispatch: 'Editor.Paste'},
                {title: '-'},
                {title: 'Crop',                                                   dispatch: 'Editor.Crop'},
                {title: 'Resize',                       hotkey: ['command', 'R'], dispatch: 'Menu.Edit.Resize'},
                {title: '-'},
                {title: 'Format code',                                            dispatch: 'Menu.Edit.FormatCode'}
            ]
        });
        let menuOptions = this._editMenu.getMenu().getMenuOptions();
        menuOptions[0].setEnabled(false); // Undo
        menuOptions[1].setEnabled(false); // Copy
        menuOptions[2].setEnabled(false); // Paste
        menuOptions[3].setEnabled(false); // Crop
        menuOptions[4].setEnabled(false); // Resize
        menuOptions[5].setEnabled(false); // Format code
        return this;
    }

    initFindMenu() {
        this._findMenu = this.addMenu({
            title: '^Find',
            width: '160px',
            items: [
                {title: 'Find...',                      hotkey: ['command', 'F'], dispatch: 'Menu.Find.Find'},
                {title: 'Find next',                    hotkey: ['command', 'G'], dispatch: 'Menu.Find.FindNext'},
                {title: '-'},
                {title: 'Find in files...',                                       dispatch: 'Dialog.FindInFiles.Show'},
                {title: '-'},
                {title: 'Replace...',                                             dispatch: 'Menu.Find.Replace'},
                {title: 'Replace next',                                           dispatch: 'Menu.Find.ReplaceNext'},
                {title: 'Replace all...',                                         dispatch: 'Dialog.Replace.Show'}
            ]
        });
        let menuOptions = this._findMenu.getMenu().getMenuOptions();
        menuOptions[0].setEnabled(false); // Find
        menuOptions[1].setEnabled(false); // Find next
        menuOptions[3].setEnabled(false); // Replace
        menuOptions[4].setEnabled(false); // Replace next
        menuOptions[5].setEnabled(false); // Replace all
        return this;
    }

    initEV3Menu() {
        this._ev3Menu = this.addMenu({
            title:     'EV^3',
            width:     '256px',
            className: 'ev3-menu',
            withCheck: true,
            items: [
                {title: 'Connect',                                                dispatch: 'Menu.EV3.Connect'},
                {title: 'Disconnect',                                             dispatch: 'Menu.EV3.Disconnect'},
                {title: 'Autoconnect',                                            dispatch: 'Settings.Toggle.EV3AutoConnect'},
                {title: '-'},
                {title: 'Daisy chain mode',                                       dispatch: 'Menu.EV3.DaisyChainMode'},
                {title: '-'},
                {title: 'EV3 File viewer',              hotkey: ['command', 'L'], dispatch: 'Dialog.Explore.Show'},
                {title: 'Direct control',                                         dispatch: 'Menu.EV3.DirectControl'},
                {title: 'Stop all motors',                                        dispatch: 'Menu.EV3.StopAllMotors'},
                {title: '-'},
                {title: 'Install compiled files on EV3',                          dispatch: 'Menu.Download.InstallCompiledFiles'},
                {title: 'Autoinstall after compile',                              dispatch: 'Settings.Toggle.AutoInstall'}
            ]
        });
        let menuOptions = this._ev3Menu.getMenu().getMenuOptions();
        menuOptions[0].setEnabled(platform.isElectron()); // Connect
        menuOptions[1].setEnabled(false);                 // Disconnect
        menuOptions[2].setEnabled(platform.isElectron()); // Autoconnect
        menuOptions[7].setEnabled(false);                 // Install compiled files
        return this;
    }

    initPoweredUpMenu() {
        this._poweredUpMenu = this.addMenu({
            title:     '^PoweredUp',
            width:     '256px',
            className: 'ev3-menu',
            withCheck: true,
            items: [
                {title: 'Connect',                                                dispatch: 'Menu.PoweredUp.Connect'},
                {title: 'Disconnect',                                             dispatch: 'Menu.PoweredUp.Disconnect'},
                {title: 'Autoconnect',                                            dispatch: 'Menu.PoweredUp.AutoConnect'},
                {title: '-'},
                {title: 'Device count',                                           dispatch: 'Menu.PoweredUp.DeviceCount'},
                {title: '-'},
                {title: 'Direct control',                                         dispatch: 'Menu.PoweredUp.DirectControl'},
                {title: 'Stop all motors',                                        dispatch: 'Menu.PoweredUp.StopAllMotors'}
            ]
        });
        let menuOptions = this._poweredUpMenu.getMenu().getMenuOptions();
        let available   = platform.isElectron() || platform.isNode() || window.PoweredUP.isWebBluetooth;
        menuOptions[0].setEnabled(available);                                   // Connect
        menuOptions[1].setEnabled(false);                                       // Disconnect
        menuOptions[2].setEnabled(platform.isElectron() || platform.isNode());  // Autoconnect, not in browser!
        menuOptions[4].setEnabled(false);                                       // Direct control
        return this;
    }

    initCompileMenu() {
        this._compileMenu = this.addMenu({
            title:     '^Compile',
            width:     '256px',
            withCheck: true,
            items: [
                {title: 'Compile',                                                dispatch: 'Menu.Compile.Compile'},
                {title: 'Compile & run',                hotkey: ['command', 'E'], dispatch: 'Menu.Compile.CompileAndRun'},
                {title: 'Compile and install on EV3',                             dispatch: 'Menu.Compile.CompileAndInstall'},
                {title: '-'},
                {title: 'Linter',                                                 dispatch: 'Settings.Toggle.Linter'},
                {title: '-'},
                {title: 'Statistics',                                             dispatch: 'Menu.Compile.Statistics'},
                {title: '-'},
                {title: 'Clear all breakpoints',                                  dispatch: 'Menu.Compile.ClearAllBreakpoints'},
                {title: '-'},
                {title: 'Create VM text output',                                  dispatch: 'Settings.Toggle.CreateVMTextOutput'}
            ]
        });
        return this;
    }

    initRunMenu() {
        this._runMenu = this.addMenu({
            title:     '^Run',
            width:     '272px',
            withCheck: true,
            items: [
                {title: 'Run',                                                    dispatch: 'Menu.Compile.Run'},
                {title: 'Continue',                                               dispatch: 'Menu.Compile.Continue'},
                {title: 'Stop',                                                   dispatch: 'Menu.Compile.Stop'},
                {title: '-'},
                {title: 'Run in VM window',                                       dispatch: 'Menu.Compile.RunVM'},
                {title: '-'},
                {title: 'Close IDE on run VM window',                             dispatch: 'Settings.Toggle.CloseIDEonVMRun'}
            ]
        });
        let menuOptions = this._runMenu.getMenu().getMenuOptions();
        menuOptions[3].setEnabled(platform.isElectron());                       // Run in VM window
        menuOptions[4].setEnabled(platform.isElectron());                       // Close IDE on run VM window
        return this;
    }

    initViewMenu() {
        this._viewMenu = this.addMenu({
            title:     '^View',
            width:     '256px',
            withCheck: true,
            items: [
                {title: 'Show files',                   hotkey: ['command', 'D'], dispatch: 'Settings.Toggle.ShowFileTree'},
                {title: 'Show console',                 hotkey: ['command', 'B'], dispatch: 'Settings.Toggle.ShowConsole'},
                {title: 'Show properties',                                        dispatch: 'Settings.Toggle.ShowProperties'},
                {title: 'Show simulator',                                         dispatch: 'Settings.Toggle.ShowSimulator'},
                {title: '-'},
                {title: 'Show quick view menu',                                   dispatch: 'Settings.Toggle.ShowQuickViewMenu'},
                {title: '-'},
                {title: 'Show simulator on run',                                  dispatch: 'Settings.Toggle.ShowSimulatorOnRun'},
                {title: '-'},
                {title: 'Dark mode',                                              dispatch: 'Settings.Toggle.DarkMode'}
            ]
        });
        return this;
    }

    initSimulatorMenu() {
        let lastGroup = null;
        let items     = [
                {title: 'Auto reset sensor value', dispatch: 'Settings.Toggle.SensorAutoReset'},
                {title: '-'}
            ];
        this._settings.getPlugins().getSortedPlugins().forEach((plugin) => {
            if (lastGroup === null) {
                lastGroup = plugin.group;
            } else if (lastGroup !== plugin.group) {
                lastGroup = plugin.group;
                items.push({title: '-'});
            }
            items.push({
                title:   plugin.name,
                onClick: function() {
                    dispatcher.dispatch('Settings.Toggle.PluginByUuid', plugin.uuid);
                }
            });
        });
        this._simulatorMenu = this.addMenu({
            title:     '^Simulator',
            width:     '256px',
            withCheck: true,
            items:     items
        });
        return this;
    }

    initToolsMenu() {
        this._toolsMenu = this.addMenu({
            title: '^Tools',
            width: '256px',
            items: [
                {title: 'Gear ratio calculator',                                  dispatch: 'Dialog.GearRatioCalculator.Show'},
                {title: 'Inverse kinematics calculator',                          dispatch: 'Dialog.InverseKinematics.Show'},
                {title: '-'},
                {title: 'Wheel to SVG',                                           dispatch: 'Dialog.WheelToSVG.Show'}
            ]
        });
        return this;
    }

    initAboutMenu() {
        this._aboutMenu = this.addMenu({
            title: '^About',
            width: '160px',
            items: [
                {title: 'Help index',                                             dispatch: 'Dialog.Help.Show'},
                {title: '-'},
                {title: 'License',                                                dispatch: 'Dialog.License.Show'},
                {title: 'Version',                                                dispatch: 'Menu.About.Version'},
                {title: '-'},
                {title: 'Visit website',                                          dispatch: 'Menu.About.Website'},
                {title: 'Report an issue',                                        dispatch: 'Menu.About.ReportIssue'}
            ]
        });
        return this;
    }

    onUpdateFileMenu(info) {
        let menuOptions = this._fileMenu.getMenu().getMenuOptions();
        menuOptions[ 6].setEnabled(info ? info.canSave         : false);     // Save
        menuOptions[ 7].setEnabled(info ? info.canSave         : false);     // Save as...
        menuOptions[10].setEnabled(info ? (info.openFiles > 0) : false);     // Close
        return this;
    }

    onUpdateEditMenu(info) {
        let menuOptions = this._editMenu.getMenu().getMenuOptions();
        menuOptions[0].setEnabled(info.canUndo);                            // Undo
        menuOptions[1].setEnabled(info.canCopy);                            // Copy
        menuOptions[2].setEnabled(info.canPaste);                           // Paste
        menuOptions[5].setEnabled(info.canFormat);                          // Format code
        return this;
    }

    onUpdateEV3Menu() {
        let connected   = this._ev3.getConnected();
        let menuOptions = this._ev3Menu.getMenu().getMenuOptions();
        let settings    = this._settings;
        menuOptions[0].setTitle(connected ? 'Connected' : 'Connect').setChecked(connected);
        menuOptions[1].setEnabled(connected);                               // Disconnect
        menuOptions[2].setChecked(settings.getEV3AutoConnect());
        menuOptions[3].setChecked(settings.getDaisyChainMode());
        menuOptions[4].setEnabled(connected);                               // EV3 File viewer
        menuOptions[5].setEnabled(connected);                               // EV3 Direct control
        menuOptions[6].setEnabled(connected);                               // Stop all motors
        menuOptions[8].setEnabled(platform.isElectron());
        menuOptions[8].setChecked(platform.isElectron() && settings.getAutoInstall());
        return this;
    }

    onUpdatePoweredUpMenu() {
        let connected   = this._poweredUp.getConnected();
        let menuOptions = this._poweredUpMenu.getMenu().getMenuOptions();
        let settings    = this._settings;
        menuOptions[0].setTitle(connected ? 'Connected' : 'Connect').setChecked(connected);
        menuOptions[1].setEnabled(connected);                               // Disconnect
        menuOptions[2].setEnabled(connected);                               // Autoconnect
        menuOptions[4].setEnabled(connected);                               // PoweredUp Direct control
        menuOptions[5].setEnabled(connected);                               // Stop all motors
        return this;
    }

    onUpdateCompileMenu(info) {
        let menuOptions = this._compileMenu.getMenu().getMenuOptions();
        let settings    = this._settings;
        if (info) {
            menuOptions[0].setEnabled(info.canCompile);                     // Compile
            menuOptions[1].setEnabled(info.canCompile);                     // Compile & run
        } else {
            menuOptions[0].setEnabled(false);                               // Compile
            menuOptions[1].setEnabled(false);                               // Compile & run
        }
        menuOptions[2].setEnabled(this._ev3.getConnected());                // Compile and install on EV3
        menuOptions[3].setChecked(settings.getLinter());                    // Linter
        menuOptions[6].setChecked(settings.getCreateVMTextOutput());        // Create text output
        return this;
    }

    onUpdateRunMenu() {
        let menuOptions = this._runMenu.getMenu().getMenuOptions();
        let settings    = this._settings;
        menuOptions[3].setEnabled(platform.isElectron());                   // Run in VM window
        menuOptions[4].setEnabled(platform.isElectron());                   // Close IDE on run VM window
        menuOptions[4].setChecked(settings.getCloseIDEonVMRun());           // Close IDE on run VM window
        return this;
    }

    onVM(vm) {
        let connected   = this._ev3.getConnected();
        let menuOptions = this._runMenu.getMenu().getMenuOptions();
        menuOptions[0].setEnabled(vm && !vm.running());                     // Run
        menuOptions[1].setEnabled(vm && vm.getBreakpoint());                // Continue
        menuOptions[2].setEnabled(vm && vm.running());                      // Stop
        menuOptions[3].setEnabled(vm);                                      // Run in VM window
        menuOptions = this._ev3Menu.getMenu().getMenuOptions();
        menuOptions[7].setEnabled(vm && connected);                         // Install compiled files
        return this;
    }

    onUpdateViewMenu() {
        let menuOptions = this._viewMenu.getMenu().getMenuOptions();
        let settings    = this._settings;
        menuOptions[0].setChecked(settings.getShowFileTree());
        menuOptions[1].setChecked(settings.getShowConsole());
        menuOptions[2].setChecked(settings.getShowProperties());
        menuOptions[3].setChecked(settings.getShowSimulator());
        menuOptions[4].setChecked(settings.getShowQuickViewMenu());
        menuOptions[5].setChecked(settings.getShowSimulatorOnRun());
        menuOptions[6].setChecked(settings.getDarkMode());
        return this;
    }

    onUpdateSimulatorMenu(info) {
        let menuOptions = this._simulatorMenu.getMenu().getMenuOptions();
        menuOptions[0].setChecked(this._settings.getSensorAutoReset());
        this._settings.getPlugins().getSortedPlugins().forEach((plugin, index) => {
            menuOptions[1 + index].setChecked(plugin.visible);
        });
        return this;
    }

    onEV3Connecting() {
        let menuOptions = this._ev3Menu.getMenu().getMenuOptions();
        menuOptions[0].setTitle('Connecting...');
    }

    onPoweredUpConnecting() {

    }

    onUpdateCropDisable() {
        this._editMenu.getMenu().getMenuOptions()[2].setEnabled(false);
    }

    onUpdateCropEnable() {
        this._editMenu.getMenu().getMenuOptions()[2].setEnabled(true);
    }

    onEditorsChanged(info) {
        let editMenuOptions       = this._editMenu.getMenu().getMenuOptions();
        let menuOptionUndo        = editMenuOptions[0];
        let menuOptionCrop        = editMenuOptions[3];
        let menuOptionResize      = editMenuOptions[4];
        let findMenuOptions       = this._findMenu.getMenu().getMenuOptions();
        let menuOptionFind        = findMenuOptions[0];
        let menuOptionFindNext    = findMenuOptions[1];
        let menuOptionReplace     = findMenuOptions[3];
        let menuOptionReplaceNext = findMenuOptions[4];
        let menuOptionReplaceAll  = findMenuOptions[5];
        if (info.activeEditor) {
            if (info.activeEditor.getCanCrop && info.activeEditor.getCanCrop()) {
                menuOptionCrop.setEnabled(info.activeEditor.getCanCrop());
            } else {
                menuOptionCrop.setEnabled(false);
            }
            if (info.activeEditor.getCanResize && info.activeEditor.getCanResize()) {
                menuOptionResize.setEnabled(info.activeEditor.getCanResize());
            } else {
                menuOptionResize.setEnabled(false);
            }
            menuOptionFind.setEnabled(info.canFind);
            menuOptionFindNext.setEnabled(info.canFindNext);
            menuOptionReplace.setEnabled(info.canFind);
            menuOptionReplaceNext.setEnabled(info.canFindNext);
            menuOptionReplaceAll.setEnabled(info.canFind);
        } else {
            menuOptionUndo.setEnabled(false);
            menuOptionCrop.setEnabled(false);
            menuOptionResize.setEnabled(false);
            menuOptionFind.setEnabled(false);
            menuOptionFindNext.setEnabled(false);
            menuOptionReplace.setEnabled(false);
            menuOptionReplaceNext.setEnabled(false);
            menuOptionReplaceAll.setEnabled(false);
        }
    }
};
