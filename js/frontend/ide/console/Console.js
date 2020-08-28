/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const platform             = require('../../lib/platform');
const dispatcher           = require('../../lib/dispatcher').dispatcher;
const DOMNode              = require('../../lib/dom').DOMNode;
const Tabs                 = require('../../lib/components/Tabs').Tabs;
const Button               = require('../../lib/components/Button').Button;
const Resizer              = require('../../lib/components/Resizer').Resizer;
const CloseButton          = require('../../lib/components/CloseButton').CloseButton;
const SettingsState        = require('../settings/SettingsState');
const tabIndex             = require('../tabIndex');
const Vars                 = require('./Vars').Vars;
const NewVersion           = require('./NewVersion').NewVersion;
const Registers            = require('./Registers').Registers;
const Log                  = require('./Log').Log;
const FindResults          = require('./FindResults').FindResults;
const Terminal             = require('./Terminal').Terminal;

exports.Console = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._ui              = opts.ui;
        this._settings        = opts.settings;
        this._getDataProvider = opts.getDataProvider;
        dispatcher
            .on('Console.Breakpoint',   this, this.onBreakpoint)
            .on('Console.RuntimeError', this, this.onRuntimeError)
            .on('Console.Log',          this, this.onLog)
            .on('Console.Error',        this, this.onError)
            .on('Console.FindResult',   this, this.onFindResult);
        this.initDOM(opts.parentNode);
    }

    initDOM(parentNode) {
        let tabs = [
                {title: 'Console',      onClick: this.onClickConsoleTab.bind(this)},
                {title: 'Find results', onClick: this.onClickFindResultsTab.bind(this)},
                {title: 'Registers',    onClick: this.onClickRegistersTab.bind(this)},
                {title: 'Global vars',  onClick: this.onClickGlobalVarsTab.bind(this)},
                {title: 'Local vars',   onClick: this.onClickLocalVarsTab.bind(this)}
            ];
        if (platform.isElectron()) {
            tabs.push({title: 'Terminal', onClick: this.onClickTerminalTab.bind(this)});
        }
        this.create(
            parentNode,
            {
                className: 'console-wrapper',
                children: [
                    {
                        className: 'toolbar',
                        children: [
                            {
                                ref:      this.setRef('tabs'),
                                type:     Tabs,
                                ui:       this._ui,
                                uiId:     1,
                                active:   {title: 'Console', meta: ''},
                                tabIndex: tabIndex.CONSOLE_TABS,
                                tabs:     tabs
                            },
                            {
                                type:     CloseButton,
                                ui:       this._ui,
                                onClick:  this.onCloseConsole.bind(this),
                                tabIndex: tabIndex.CLOSE_CONSOLE
                            },
                            {
                                type:      Button,
                                ui:        this._ui,
                                event:     'Button.Console.Change',
                                tabIndex:  tabIndex.CONSOLE_CLEAR_BUTTON,
                                onClick:   this.onClickClear.bind(this),
                                className: 'clear',
                                value:     'Clear'
                            },
                            {
                                type:      Resizer,
                                ui:        this._ui,
                                varName:   '--console-height',
                                direction: 'y',
                                size:      this._settings.getResizerConsoleSize(),
                                minSize:   96,
                                dispatch:  'Settings.Set.Resizer.ConsoleSize'
                            }
                        ]
                    },
                    {
                        className: 'console-content',
                        children: [
                            {
                                type:     Log,
                                id:       this.setLogElement.bind(this),
                                ui:       this._ui,
                                settings: this._settings
                            },
                            {
                                type:     FindResults,
                                ref:      this.setRef('findResults'),
                                ui:       this._ui,
                                settings: this._settings
                            },
                            {
                                type:     Vars,
                                ref:      this.setRef('globals'),
                                ui:       this._ui,
                                global:   true
                            },
                            {
                                type:     Vars,
                                ref:      this.setRef('locals'),
                                ui:       this._ui,
                                global:   false
                            },
                            {
                                type:     Registers,
                                ref:      this.setRef('registers'),
                                ui:       this._ui
                            },
                            platform.isElectron() ?
                                {
                                    type:     Terminal,
                                    ref:      this.setRef('terminal'),
                                    ui:       this._ui
                                } :
                                null,
                            platform.isElectron() ?
                                {
                                    type:     NewVersion,
                                    ref:      this.setRef('newVersion'),
                                    ui:       this._ui,
                                    console:  this,
                                    settings: this._settings
                                } :
                                null
                        ]
                    }
                ]
            }
        );
    }

    setLogElement(element) {
        this._active     = element;
        this._logElement = element;
    }

    onClickConsoleTab() {
        dispatcher.dispatch('Button.Console.Change', {hidden: false});
        this.hide().show(this._logElement);
    }

    onClickRegistersTab() {
        dispatcher.dispatch('Button.Console.Change', {hidden: true});
        this.hide().show(this._refs.registers);
    }

    onClickGlobalVarsTab() {
        dispatcher.dispatch('Button.Console.Change', {hidden: true});
        this.hide().show(this._refs.globals);
    }

    onClickLocalVarsTab() {
        dispatcher.dispatch('Button.Console.Change', {hidden: true});
        this.hide().show(this._refs.locals);
    }

    onClickTerminalTab() {
        dispatcher.dispatch('Button.Console.Change', {hidden: true});
        this.hide().show(this._refs.terminal);
    }

    onClickNewVersionTab() {
        dispatcher.dispatch('Button.Console.Change', {hidden: true});
        this.hide().show(this._refs.newVersion);
    }

    onClickFindResultsTab() {
        dispatcher.dispatch('Button.Console.Change', {hidden: false});
        this.hide().show(this._refs.findResults);
    }

    onClickClear() {
        if (this._active === this._refs.terminal) {
            this._refs.terminal.clear().focus();
        } else if (this._active === this._refs.findResults) {
            dispatcher.dispatch('Console.FindResults.Clear');
        } else {
            dispatcher.dispatch('Console.Clear');
        }
    }

    onBreakpoint(breakpoint) {
        let refs = this._refs;
        refs.registers.update(breakpoint);
        refs.globals.update(breakpoint);
        refs.locals.update(breakpoint);
    }

    onRuntimeError(info) {
        let refs = this._refs;
        refs.registers
            .update(info);
        refs.globals
            .updateVM(info.vm)
            .updateScope(info.scope);
        refs.locals
            .updateVM(info.vm)
            .updateScope(info.scope);
    }

    onCloseConsole() {
        dispatcher.dispatch('Settings.Toggle.ShowConsole');
    }

    onLog(message) {
        this.showForIncoming(message.type);
    }

    onFindResult(findResult) {
        let refs = this._refs;
        dispatcher.dispatch('Settings.Set.Console.Visible', true);
        this.hide().show(refs.findResults);
        refs.findResults.addResult(findResult);
        refs.tabs.setActiveTab('Find results');
        dispatcher.dispatch('Button.Console.Change', {hidden: false});
    }

    onError(message) {
        this.showForIncoming(SettingsState.CONSOLE_MESSAGE_TYPE_ERROR);
    }

    showForIncoming(incomingType) {
        let settings = this._settings;
        if (settings.getConsoleShowOnLevel() === SettingsState.CONSOLE_NEVER) {
            return;
        }
        let incoming = SettingsState.CONSOLE_LOG_LEVELS.indexOf(incomingType);
        let level    = SettingsState.CONSOLE_LOG_LEVELS.indexOf(settings.getConsoleShowOnLevel());
        if (incoming >= level) {
            dispatcher.dispatch('Settings.Set.Console.Visible', true);
            this.hide().show(this._logElement);
            this._refs.tabs.setActiveTab('Console');
            dispatcher.dispatch('Button.Console.Change', {hidden: false});
        }
    }

    show(active) {
        this._active = active;
        active.show();
        if (active === this._refs.terminal) {
            this._refs.terminal.focus();
        }
    }

    hide() {
        this._active.hide();
        return this;
    }

    addNewVersionTab() {
        this._refs.tabs.add({
            title:   'New version',
            onClick: this.onClickNewVersionTab.bind(this)
        });
        return this;
    }
};
