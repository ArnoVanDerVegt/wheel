/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher  = require('../../lib/dispatcher').dispatcher;
const MainMenu    = require('../../lib/components/MainMenu').MainMenu;
const ProgressBar = require('../../lib/components/ProgressBar').ProgressBar;
const tabIndex    = require('../tabIndex');
const HelpOption  = require('./HelpOption').HelpOption;

exports.MainMenu = class extends MainMenu {
    constructor(opts) {
        super(opts);
        let brick    = opts.brick;
        let settings = opts.settings;
        this._ui       = opts.ui;
        this._brick    = brick;
        this._settings = settings;
        this
            .initMenu()
            .initHelp()
            .initStorage();
        // Settings events...
        settings
            .addEventListener('Settings.View',    this, this.onUpdateViewMenu)
            .addEventListener('Settings.EV3',     this, this.onUpdateEV3Menu)
            .addEventListener('Settings.Compile', this, this.onUpdateCompileMenu)
            .addEventListener('Settings.Plugin',  this, this.onUpdateSimulatorMenu);
        // Brick events...
        brick
            .addEventListener('Brick.Connecting',   this, this.onBrickConnecting)
            .addEventListener('Brick.Connected',    this, this.onUpdateEV3Menu)
            .addEventListener('Brick.Disconnect',   this, this.onUpdateEV3Menu)
            .addEventListener('Brick.Disconnected', this, this.onUpdateEV3Menu);
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
        if ('electron' in window) {
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
            .initCompileMenu()
            .initViewMenu()
            .initSimulatorMenu()
            .initAboutMenu()
            .onUpdateViewMenu()
            .onUpdateSimulatorMenu()
            .onUpdateCompileMenu()
            .onVM()
            .onUpdateEV3Menu()
            .onUpdateFileMenu();
    }

    initFileMenu() {
        this._fileMenu = this.addMenu({
            title: '^File',
            width: '200px',
            items: [
                {title: 'New file',                     hotkey: ['command', 'N'], dispatch: 'Menu.File.NewFile'},
                {title: 'New project file',             hotkey: ['command', 'P'], dispatch: 'Menu.File.NewProjectFile'},
                {title: 'New image',                    hotkey: ['command', 'I'], dispatch: 'Menu.File.NewImageFile'},
                {title: '-'},
                {title: 'Open...',                      hotkey: ['command', 'O'], dispatch: 'Menu.File.Open'},
                {title: 'Save',                         hotkey: ['command', 'S'], dispatch: 'Editor.Save'},
                {title: 'Save as..',                                              dispatch: 'Menu.File.SaveAs'},
                {title: '-'},
                {title: 'Close',                        hotkey: ['command', 'X'], dispatch: 'Editor.CloseFile'},
                {title: '-'},
                {title: 'Setup',                                                  dispatch: 'Menu.File.Setup'},
                {title: '-'},
                {title: 'Exit Wheel',                   hotkey: ['command', 'Q'], dispatch: 'Menu.File.Exit'}
            ]
        });
        let menuOptions = this._fileMenu.getMenu().getMenuOptions();
        menuOptions[7].setEnabled('electron' in window); // Setup
        menuOptions[8].setEnabled('electron' in window); // Exit Wheel
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
                {title: 'Resize',                       hotkey: ['command', 'R'], dispatch: 'Menu.Edit.Resize'}
            ]
        });
        let menuOptions = this._editMenu.getMenu().getMenuOptions();
        menuOptions[0].setEnabled(false); // Undo
        menuOptions[1].setEnabled(false); // Copy
        menuOptions[2].setEnabled(false); // Paste
        menuOptions[3].setEnabled(false); // Crop
        menuOptions[4].setEnabled(false); // Resize
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
                {title: 'Replace...',                                             dispatch: 'Menu.Find.Replace'},
                {title: 'Replace next',                                           dispatch: 'Menu.Find.ReplaceNext'},
                {title: 'Replace all...',                                         dispatch: 'Dialog.Replace.Show'}
            ]
        });
        let menuOptions = this._findMenu.getMenu().getMenuOptions();
        menuOptions[0].setEnabled(false); // Find
        menuOptions[1].setEnabled(false); // Find next
        menuOptions[2].setEnabled(false); // Replace
        menuOptions[3].setEnabled(false); // Replace next
        menuOptions[4].setEnabled(false); // Replace all
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
                {title: 'Autoconnect',                                            dispatch: 'Settings.Toggle.AutoConnect'},
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
        menuOptions[0].setEnabled('electron' in window); // Connect
        menuOptions[1].setEnabled(false);                // Disconnect
        menuOptions[2].setEnabled('electron' in window); // Autoconnect
        menuOptions[7].setEnabled(false);                // Install compiled files
        return this;
    }

    initCompileMenu() {
        this._compileMenu = this.addMenu({
            title:     '^Compile',
            width:     '256px',
            withCheck: true,
            items: [
                {title: 'Compile',                                                dispatch: 'Menu.Compile.Compile'},
                {title: 'Run',                                                    dispatch: 'Menu.Compile.Run'},
                {title: 'Compile & run',                hotkey: ['command', 'E'], dispatch: 'Menu.Compile.CompileAndRun'},
                {title: 'Continue',                                               dispatch: 'Menu.Compile.Continue'},
                {title: 'Stop',                                                   dispatch: 'Menu.Compile.Stop'},
                {title: '-'},
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

    initViewMenu() {
        this._viewMenu = this.addMenu({
            title:     '^View',
            width:     '256px',
            withCheck: true,
            items: [
                {title: 'Show files',                   hotkey: ['command', 'D'], dispatch: 'Settings.Toggle.ShowFileTree'},
                {title: 'Show console',                 hotkey: ['command', 'B'], dispatch: 'Settings.Toggle.ShowConsole'},
                {title: 'Show simulator',                                         dispatch: 'Settings.Toggle.ShowSimulator'},
                {title: '-'},
                {title: 'Show simulator on run',                                  dispatch: 'Settings.Toggle.ShowSimulatorOnRun'},
                {title: '-'},
                {title: 'Dark mode',                                              dispatch: 'Settings.Toggle.DarkMode'}
            ]
        });
        return this;
    }

    initSimulatorMenu() {
        let items     = [];
        let lastGroup = null;
        this._settings.getPlugins().getSortedPlugins().forEach(function(plugin) {
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
            width:     '200px',
            withCheck: true,
            items:     items
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
        menuOptions[4].setEnabled(info ? info.canSave         : false);     // Save
        menuOptions[5].setEnabled(info ? info.canSave         : false);     // Save as...
        menuOptions[6].setEnabled(info ? (info.openFiles > 0) : false);     // Close
        return this;
    }

    onUpdateEditMenu(info) {
        let menuOptions = this._editMenu.getMenu().getMenuOptions();
        menuOptions[0].setEnabled(info.canUndo);                            // Undo
        menuOptions[1].setEnabled(info.canCopy);                            // Copy
        menuOptions[2].setEnabled(info.canPaste);                           // Paste
        return this;
    }

    onUpdateEV3Menu() {
        let connected   = this._brick.getConnected();
        let menuOptions = this._ev3Menu.getMenu().getMenuOptions();
        let settings    = this._settings;
        menuOptions[0].setTitle(connected ? 'Connected' : 'Connect').setChecked(connected);
        menuOptions[1].setEnabled(connected);                               // Disconnect
        menuOptions[2].setChecked(settings.getAutoConnect());
        menuOptions[3].setChecked(settings.getDaisyChainMode());
        menuOptions[4].setEnabled(connected);                               // EV3 File viewer
        menuOptions[5].setEnabled(connected);                               // EV3 Direct control
        menuOptions[6].setEnabled(connected);                               // Stop all motors
        menuOptions[8].setChecked(settings.getAutoInstall());
        return this;
    }

    onUpdateCompileMenu(info) {
        let menuOptions = this._compileMenu.getMenu().getMenuOptions();
        let settings    = this._settings;
        if (info) {
            menuOptions[0].setEnabled(info.canCompile);                     // Compile
            menuOptions[2].setEnabled(info.canCompile);                     // Compile & run
        } else {
            menuOptions[0].setEnabled(false);                               // Compile
            menuOptions[2].setEnabled(false);                               // Compile & run
        }
        menuOptions[6].setChecked(settings.getLinter());                    // Linter
        menuOptions[5].setEnabled(this._brick.getConnected());              //
        menuOptions[9].setChecked(settings.getCreateVMTextOutput());        // Create text output
        return this;
    }

    onVM(vm) {
        let menuOptions = this._compileMenu.getMenu().getMenuOptions();
        menuOptions[1].setEnabled(vm && !vm.running());                     // Run
        menuOptions[3].setEnabled(vm && vm.getBreakpoint());                // Continue
        menuOptions[4].setEnabled(vm && vm.running());                      // Stop
        let connected = this._brick.getConnected();
        menuOptions = this._ev3Menu.getMenu().getMenuOptions();
        menuOptions[7].setEnabled(vm && connected);                         // Install compiled files
        return this;
    }

    onUpdateViewMenu() {
        let menuOptions = this._viewMenu.getMenu().getMenuOptions();
        let settings    = this._settings;
        menuOptions[0].setChecked(settings.getShowFileTree());
        menuOptions[1].setChecked(settings.getShowConsole());
        menuOptions[2].setChecked(settings.getShowSimulator());
        menuOptions[3].setChecked(settings.getShowSimulatorOnRun());
        menuOptions[4].setChecked(settings.getDarkMode());
        return this;
    }

    onUpdateSimulatorMenu(info) {
        let menuOptions    = this._simulatorMenu.getMenu().getMenuOptions();
        this._settings.getPlugins().getSortedPlugins().forEach(function(plugin, index) {
            menuOptions[index].setChecked(plugin.visible);
        });
        return this;
    }

    onBrickConnecting() {
        let menuOptions = this._ev3Menu.getMenu().getMenuOptions();
        menuOptions[0].setTitle('Connecting...');
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
        let menuOptionReplace     = findMenuOptions[2];
        let menuOptionReplaceNext = findMenuOptions[3];
        let menuOptionReplaceAll  = findMenuOptions[4];
        if (info.activeEditor) {
            if (info.activeEditor.canCrop && info.activeEditor.canCrop()) {
                menuOptionCrop.setEnabled(info.activeEditor.canCrop());
            } else {
                menuOptionCrop.setEnabled(false);
            }
            if (info.activeEditor.canResize && info.activeEditor.canResize()) {
                menuOptionResize.setEnabled(info.activeEditor.canResize());
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
