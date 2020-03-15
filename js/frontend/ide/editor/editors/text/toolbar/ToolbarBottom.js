/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const DOMNode    = require('../../../../../lib/dom').DOMNode;
const dispatcher = require('../../../../../lib/dispatcher').dispatcher;
const Toolbar    = require('../../../../../lib/components/Toolbar').Toolbar;
const Button     = require('../../../../../lib/components/Button').Button;
const Checkbox   = require('../../../../../lib/components/Checkbox').Checkbox;
const TextInput  = require('../../../../../lib/components/TextInput').TextInput;
const tabIndex   = require('../../../../tabIndex');

/*
Todo: show connection status in toolbar

    // this._device
    //     .addEventListener('EV3.Connected',    this, this.onEV3Connected)
    //     .addEventListener('EV3.Connecting',   this, this.onEV3Connecting)
    //     .addEventListener('EV3.Disconnected', this, this.onEV3Disconnected);

    // clearDisconnectedTimeout() {
    //     if (this._disconnectedTimeout) {
    //         clear(this._disconnectedTimeout);
    //     }
    //     this._disconnectedTimeout = null;
    // }

    // onEV3Connecting(deviceName) {
    //     this.clearDisconnectedTimeout();
    //     //this._autoResetPanelElement.style.display = 'none';
    // }

    // onEV3Connected() {
    //     this.clearDisconnectedTimeout();
    //     this._connected                           = true;
    //     //this._autoResetPanelElement.style.display = 'none';
    // }

    // onEV3Disconnected() {
    //     this.clearDisconnectedTimeout();
    //     this._connected = true;
    //     this._disconnectedTimeout = setTimeout(
    //         (function() {
    //             //this._autoResetPanelElement.style.display = 'block';
    //             this._disconnectedTimeout                 = null;
    //         }).bind(this),
    //         5000
    //     );
    // }
*/


exports.ToolbarBottom = class extends Toolbar {
    constructor(opts) {
        super(opts);
        this._ui          = opts.ui;
        this._settings    = opts.settings;
        this._parentNode  = opts.parentNode;
        this._wheelEditor = opts.wheelEditor;
        this.initDOM();
        dispatcher
            .on('Compile.Start',   this, this.onCompileStart)
            .on('Compile.Success', this, this.onCompileSuccess)
            .on('Compile.Warning', this, this.onCompileWarning)
            .on('Compile.Failed',  this, this.onCompileFailed);
    }

    initDOM() {
        let wheelEditor = this._wheelEditor;
        this.create(
            this._parentNode,
            {
                className: 'resource-options bottom',
                children: [
                    this.addFileSaved(wheelEditor),
                    {
                        ref:       wheelEditor.setRef('findOptions'),
                        className: 'bottom-options hidden',
                        children: [
                            // Find...
                            {
                                innerHTML: 'Find:',
                                className: 'label find'
                            },
                            {
                                ref:       wheelEditor.setRef('findText'),
                                type:      TextInput,
                                ui:        this._ui,
                                tabIndex:  tabIndex.WHEEL_EDITOR_FIND_TEXT,
                                onKeyUp:   wheelEditor.onFindKeyUp.bind(wheelEditor)
                            },
                            {
                                type:      Button,
                                ui:        this._ui,
                                tabIndex:  tabIndex.WHEEL_EDITOR_FIND_BUTTON,
                                className: 'find-button',
                                value:     'Find',
                                onClick:   wheelEditor.onFind.bind(wheelEditor)
                            },
                            // Case...
                            {
                                innerHTML: 'Match case:',
                                className: 'label case'
                            },
                            {
                                ref:       wheelEditor.setRef('findCaseSensitive'),
                                type:      Checkbox,
                                ui:        this._ui,
                                uiId:      1,
                                tabIndex:  tabIndex.WHEEL_EDITOR_TEXT_CASE
                            }
                        ]
                    },
                    {
                        ref:       wheelEditor.setRef('replaceOptions'),
                        className: 'bottom-options replace hidden',
                        children: [
                            // Replace...
                            {
                                innerHTML: 'Replace:',
                                className: 'label find'
                            },
                            {
                                ref:       wheelEditor.setRef('replaceText'),
                                type:      TextInput,
                                ui:        this._ui,
                                tabIndex:  tabIndex.WHEEL_EDITOR_REPLACE_TEXT,
                                onKeyUp:   wheelEditor.onReplaceKeyUp.bind(wheelEditor)
                            },
                            {
                                type:      Button,
                                ui:        this._ui,
                                tabIndex:  tabIndex.WHEEL_EDITOR_REPLACE_BUTTON,
                                className: 'find-button',
                                value:     'Replace',
                                onClick:   wheelEditor.onReplace.bind(wheelEditor)
                            }
                        ]
                    },
                    this.addCursorInfo(wheelEditor),
                    {
                        id:        this.setCompileInfo.bind(this),
                        className: 'compile-info'
                    }
                ]
            }
        );
    }

    setCompileInfo(element) {
        this._compileInfoElement = element;
        element.addEventListener('click', this.onClickState.bind(this));
    }

    setFilenameAndState(filename, state) {
        this._compileInfoElement.innerHTML = filename;
        this._compileInfoElement.title     = filename;
        this._compileInfoElement.className = 'compile-info ' + state;
    }

    onCompileStart(projectFilename) {
        this.setFilenameAndState(projectFilename, '');
    }

    onCompileSuccess(projectFilename) {
        this.setFilenameAndState(projectFilename, 'success');
    }

    onCompileWarning(projectFilename) {
        this.setFilenameAndState(projectFilename, 'warning');
    }

    onCompileFailed(projectFilename) {
        this.setFilenameAndState(projectFilename, 'failed');
    }

    onClickState() {
        dispatcher.dispatch('Settings.Toggle.ShowConsole');
    }
};
