/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const platform    = require('../../lib/platform');
const dispatcher  = require('../../lib/dispatcher').dispatcher;
const DOMNode     = require('../../lib/dom').DOMNode;
const Tabs        = require('../../lib/components/Tabs').Tabs;
const Button      = require('../../lib/components/Button').Button;
const Resizer     = require('../../lib/components/Resizer').Resizer;
const CloseButton = require('../../lib/components/CloseButton').CloseButton;
const tabIndex    = require('../tabIndex');
const Vars        = require('./Vars').Vars;
const NewVersion  = require('./NewVersion').NewVersion;
const Registers   = require('./Registers').Registers;
const Log         = require('./Log').Log;
const Terminal    = require('./Terminal').Terminal;

exports.MESSAGE_TYPE_INFO    = 'Info';
exports.MESSAGE_TYPE_HINT    = 'Hint';
exports.MESSAGE_TYPE_WARNING = 'Warning';
exports.MESSAGE_TYPE_ERROR   = 'Error';

exports.Console = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._ui              = opts.ui;
        this._settings        = opts.settings;
        this._getDataProvider = opts.getDataProvider;
        dispatcher
            .on('Console.Breakpoint',   this, this.onBreakpoint)
            .on('Console.RuntimeError', this, this.onRuntimeError);
        this.initDOM(opts.parentNode);
    }

    initDOM(parentNode) {
        let tabs = [
                {title: 'Console',     onClick: this.onClickConsoleTab.bind(this)},
                {title: 'Registers',   onClick: this.onClickRegistersTab.bind(this)},
                {title: 'Global vars', onClick: this.onClickGlobalVarsTab.bind(this)},
                {title: 'Local vars',  onClick: this.onClickLocalVarsTab.bind(this)}
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
                                id:     this.setLogElement.bind(this),
                                type:   Log,
                                ui:     this._ui
                            },
                            {
                                ref:    this.setRef('globals'),
                                type:   Vars,
                                ui:     this._ui,
                                global: true
                            },
                            {
                                ref:    this.setRef('locals'),
                                type:   Vars,
                                ui:     this._ui,
                                global: false
                            },
                            {
                                ref:    this.setRef('registers'),
                                type:   Registers,
                                ui:     this._ui
                            },
                            platform.isElectron() ?
                                {
                                    ref:      this.setRef('terminal'),
                                    type:     Terminal,
                                    ui:       this._ui
                                } :
                                null,
                            platform.isElectron() ?
                                {
                                    ref:      this.setRef('newVersion'),
                                    type:     NewVersion,
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
        this.hide().show(this._logElement);
    }

    onClickRegistersTab() {
        this.hide().show(this._refs.registers);
    }

    onClickGlobalVarsTab() {
        this.hide().show(this._refs.globals);
    }

    onClickLocalVarsTab() {
        this.hide().show(this._refs.locals);
    }

    onClickTerminalTab() {
        this.hide().show(this._refs.terminal);
    }

    onClickNewVersionTab() {
        this.hide().show(this._refs.newVersion);
    }

    onClickClear() {
        if (this._active === this._refs.terminal) {
            this._refs.terminal.clear().focus();
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
