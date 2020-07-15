/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const DOMNode             = require('../../../lib/dom').DOMNode;
const platform            = require('../../../lib/platform');
const dispatcher          = require('../../../lib/dispatcher').dispatcher;
const Dialog              = require('../../../lib/components/Dialog').Dialog;
const Button              = require('../../../lib/components/Button').Button;
const Tabs                = require('../../../lib/components/Tabs').Tabs;
const Checkbox            = require('../../../lib/components/Checkbox').Checkbox;
const Img                 = require('../../../lib/components/basic/Img').Img;
const getDataProvider     = require('../../../lib/dataprovider/dataProvider').getDataProvider;
const path                = require('../../../lib/path');
const getImage            = require('../../data/images').getImage;
const Updater             = require('./components/Updater').Updater;
const IncludeFilesSetting = require('./components/IncludeFilesSetting').IncludeFilesSetting;

exports.SettingsDialog = class extends Dialog {
    constructor(opts) {
        super(opts);
        this._settings        = opts.settings;
        this._updateFunctions = [];
        this._showUpdate      = platform.isElectron() || platform.isNode();
        let tabs = [];
        if (this._showUpdate) {
            tabs.push({title: 'Update', onClick: this.onClickTab.bind(this, 'panelUpdate')});
        }
        tabs.push.apply(
            tabs,
            [
                {title: 'Editor',    onClick: this.onClickTab.bind(this, 'panelEditor')},
                {title: 'Compiler',  onClick: this.onClickTab.bind(this, 'panelCompiler')},
                {title: 'View',      onClick: this.onClickTab.bind(this, 'panelView')},
                {title: 'Simulator', onClick: this.onClickTab.bind(this, 'panelSimulator')}
            ]
        );
        this.createWindow(
            'settings-dialog',
            'Settings',
            [
                {
                    ref:       this.setRef('text'),
                    className: 'settings-text',
                    children: [
                        {
                            ref:      this.setRef('tabs'),
                            type:     Tabs,
                            ui:       this._ui,
                            uiId:     this._uiId,
                            tabIndex: 1,
                            tabs:     tabs
                        },
                        this._showUpdate ? {
                                ref:       this.setRef('panelUpdate'),
                                className: 'tab-panel panel-update',
                                children: [
                                    {
                                        type:     Updater,
                                        ui:       this._ui,
                                        uiId:     this._uiId,
                                        settings: this._settings
                                    }
                                ]
                            } :
                            null,
                        {
                            ref:       this.setRef('panelEditor'),
                            className: 'tab-panel panel-editor',
                            children: [
                                this.addBooleanSetting({
                                    description: 'Add comments to generated event procedures',
                                    tabIndex:    1,
                                    getter:      'getCreateEventComments',
                                    signal:      'Settings.Set.CreateEventComments'
                                }),
                                this.addHr(),
                                this.addIncludeFilesSetting()
                            ]
                        },
                        {
                            ref:       this.setRef('panelCompiler'),
                            className: 'tab-panel panel-compiler',
                            children: [
                                this.addBooleanSetting({
                                    description: 'Linter',
                                    tabIndex:    1,
                                    getter:      'getLinter',
                                    signal:      'Settings.Set.SetLinter'
                                }),
                                this.addBooleanSetting({
                                    description: 'Create VM text output',
                                    tabIndex:    2,
                                    getter:      'getCreateVMTextOutput',
                                    signal:      'Settings.Set.CreateVMTextOutput'
                                })
                            ]
                        },
                        {
                            ref:       this.setRef('panelView'),
                            className: 'tab-panel panel-view',
                            children: [
                                this.addBooleanSetting({
                                    description: 'Show files',
                                    tabIndex:    1,
                                    getter:      'getShowFileTree',
                                    signal:      'Settings.Set.SetShowFileTree'
                                }),
                                this.addBooleanSetting({
                                    description: 'Show console',
                                    tabIndex:    2,
                                    getter:      'getShowConsole',
                                    signal:      'Settings.Set.ConsoleVisible'
                                }),
                                this.addBooleanSetting({
                                    description: 'Show simulator on run',
                                    tabIndex:    3,
                                    getter:      'getShowSimulatorOnRun',
                                    signal:      'Settings.Set.ShowSimulatorOnRun'
                                }),
                                this.addHr(),
                                this.addBooleanSetting({
                                    description: 'Dark mode',
                                    tabIndex:    4,
                                    getter:      'getDarkMode',
                                    signal:      'Settings.Set.DarkMode'
                                })
                            ]
                        },
                        {
                            ref:       this.setRef('panelSimulator'),
                            className: 'tab-panel panel-simulator',
                            children: [
                                this.addBooleanSetting({
                                    description: 'Auto reset sensor value',
                                    tabIndex:    1,
                                    getter:      'getSensorAutoReset',
                                    signal:      'Settings.Set.SensorAutoReset'
                                })
                            ]
                        }
                    ]
                },
                {
                    className: 'buttons',
                    children: [
                        this.addButton({
                            value:    'Ok',
                            onClick:  this.hide.bind(this),
                            tabIndex: 128
                        })
                    ]
                }
            ]
        );
        dispatcher.on('Dialog.Settings.Show', this, this.onShow);
    }

    addHr() {
        return {type: 'Hr'};
    }

    addBooleanSetting(opts) {
        let updateFunctions = this._updateFunctions;
        let settings        = this._settings;
        return {
            className: 'boolean-setting',
            children: [
                {
                    id: (element) => {
                        updateFunctions.push(() => {
                            element.setValue(!!settings[opts.getter]());
                        });
                    },
                    type:     Checkbox,
                    ui:       this._ui,
                    uiId:     this._uiId,
                    tabIndex: opts.tabIndex,
                    onChange: (value) => {
                        dispatcher.dispatch(opts.signal, value);
                    }
                },
                {
                    className: 'description',
                    innerHTML: opts.description
                }
            ]
        };
    }

    addIncludeFilesSetting(opts) {
        return {
            type:     IncludeFilesSetting,
            ui:       this._ui,
            uiId:     this._uiId,
            settings: this._settings
        };
    }

    onClickTab(tab) {
        let refs = this._refs;
        for (let i in refs) {
            if (i.substr(0, 5) === 'panel') {
                refs[i].style.display = (i === tab) ? 'block' : 'none';
            }
        }
    }

    onShow(opts) {
        this._updateFunctions.forEach((updateFunction) => {
            updateFunction();
        });
        this._refs.tabs.setActiveTab(this._showUpdate ? 'Update' : 'Editor');
        this.onClickTab(this._showUpdate ? 'panelUpdate' : 'panelEditor');
        this.show();
    }
};
