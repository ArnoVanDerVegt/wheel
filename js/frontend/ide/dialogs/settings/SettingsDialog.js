/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const path                = require('../../../../shared/lib/path');
const platform            = require('../../../../shared/lib/platform');
const DOMNode             = require('../../../lib/dom').DOMNode;
const dispatcher          = require('../../../lib/dispatcher').dispatcher;
const Dialog              = require('../../../lib/components/Dialog').Dialog;
const Button              = require('../../../lib/components/input/Button').Button;
const Tabs                = require('../../../lib/components/input/Tabs').Tabs;
const Radio               = require('../../../lib/components/input/Radio').Radio;
const Img                 = require('../../../lib/components/basic/Img').Img;
const getDataProvider     = require('../../../lib/dataprovider/dataProvider').getDataProvider;
const getImage            = require('../../data/images').getImage;
const CheckboxSetting     = require('./components/CheckboxSetting').CheckboxSetting;
const TextInputSetting    = require('./components/TextInputSetting').TextInputSetting;
const TextAreaSetting     = require('./components/TextAreaSetting').TextAreaSetting;
const addVersionTab       = require('./tabs/addVersionTab');
const addExportTab        = require('./tabs/addExportTab');
const addEditorTab        = require('./tabs/addEditorTab');
const addCompilerTab      = require('./tabs/addCompilerTab');
const addViewTab          = require('./tabs/addViewTab');
const addConsoleTab       = require('./tabs/addConsoleTab');
const addSimulatorTab     = require('./tabs/addSimulatorTab');

exports.SettingsDialog = class extends Dialog {
    constructor(opts) {
        super(opts);
        this._updateFunctions = [];
        this.initWindow({
            ui:         opts.ui,
            uiId:       opts.uiId,
            settings:   opts.settings,
            showSignal: 'Dialog.Settings.Show',
            width:      580,
            height:     600,
            className:  'settings-dialog',
            title:      'Settings'
        });
    }

    initWindowContent(opts) {
        opts.uiId = this._uiId;
        return [
            {
                ref:       this.setRef('text'),
                className: 'abs dialog-cw dialog-lt settings-text',
                children: [
                    {
                        ref:      this.setRef('tabs'),
                        type:     Tabs,
                        ui:       this._ui,
                        uiId:     this._uiId,
                        tabIndex: 1,
                        tabs:     [
                            {title: 'Version',   onClick: this.onClickTab.bind(this, 'tabVersion')},
                            {title: 'Export',    onClick: this.onClickTab.bind(this, 'tabExport')},
                            {title: 'Editor',    onClick: this.onClickTab.bind(this, 'tabEditor')},
                            {title: 'Compiler',  onClick: this.onClickTab.bind(this, 'tabCompiler')},
                            {title: 'View',      onClick: this.onClickTab.bind(this, 'tabView')},
                            {title: 'Console',   onClick: this.onClickTab.bind(this, 'tabConsole')},
                            {title: 'Simulator', onClick: this.onClickTab.bind(this, 'tabSimulator')}
                        ]
                    },
                    addVersionTab.tab(this, opts),
                    addExportTab.tab(this, opts),
                    addEditorTab.tab(this, opts),
                    addCompilerTab.tab(this, opts),
                    addViewTab.tab(this, opts),
                    addConsoleTab.tab(this, opts),
                    addSimulatorTab.tab(this, opts)
                ]
            },
            this.initButtons([
                {
                    value:    'Ok',
                    onClick:  this.hide.bind(this),
                    tabIndex: 4096
                }
            ])
        ];
    }

    addHr() {
        return {type: 'Hr'};
    }

    addTitle(title) {
        return {
            type:      'h3',
            className: 'no-select flt max-w title-row',
            innerHTML: title
        };
    }

    addDescriptionRow(description) {
        return {
            className: 'no-select flt max-w description-row',
            innerHTML: description
        };
    }

    addSpacer() {
        return {
            className: 'flt max-w spacer'
        };
    }

    addCheckboxSetting(opts) {
        opts.type            = CheckboxSetting;
        opts.updateFunctions = this._updateFunctions;
        opts.settings        = this._settings;
        opts.ui              = this._ui;
        opts.uiId            = this._uiId;
        return opts;
    }

    addTextInputSetting(opts) {
        opts.type            = TextInputSetting;
        opts.updateFunctions = this._updateFunctions;
        opts.settings        = this._settings;
        opts.ui              = this._ui;
        opts.uiId            = this._uiId;
        return opts;
    }

    addTextAreaSetting(opts) {
        opts.type            = TextAreaSetting;
        opts.updateFunctions = this._updateFunctions;
        opts.settings        = this._settings;
        opts.ui              = this._ui;
        opts.uiId            = this._uiId;
        return opts;
    }

    addRadioSetting(opts) {
        return {
            className: 'flt max-w radio-row',
            children: [
                {
                    className: 'no-select label',
                    innerHTML: opts.label
                },
                {
                    type:       Radio,
                    ui:         this._ui,
                    uiId:       this._uiId,
                    tabIndex:   opts.tabIndex,
                    value:      opts.value,
                    horizontal: true,
                    onChange:   opts.onChange,
                    options:    opts.options
                }
            ]
        };
    }

    onClickTab(tab) {
        let refs = this._refs;
        refs.export.load();
        for (let i in refs) {
            if ((i.substr(0, 3) === 'tab') && (i.substr(0, 4) !== 'tabs')) {
                refs[i].style.display = (i === tab) ? 'block' : 'none';
            }
        }
    }

    onShow(opts) {
        // Unpdate them here because settings like the console view, properties view could be changed from a menu.
        // Call settings getters to update the checkbox states:
        this._updateFunctions.forEach((updateFunction) => {
            updateFunction();
        });
        this._refs.tabs.setActiveTab('Version');
        this.onClickTab('tabVersion');
        this.show();
    }

    getSettings() {
        return this._settings;
    }

    getRefs() {
        return this._refs;
    }
};
