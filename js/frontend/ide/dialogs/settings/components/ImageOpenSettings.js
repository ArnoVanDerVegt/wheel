/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const DOMNode       = require('../../../../lib/dom').DOMNode;
const dispatcher    = require('../../../../lib/dispatcher').dispatcher;
const SettingsState = require('../../../settings/SettingsState');

exports.ImageOpenSettings = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._settingsDialog = opts.settingsDialog;
        this._ui             = opts.ui;
        this._uiId           = opts.uiId;
        this._settings       = opts.settings;
        this._tabIndex       = opts.tabIndex;
        this.initDOM(opts.parentNode);
    }

    initOpenOptions(opts) {
        opts.value    = this._settings[opts.getter]();
        opts.onChange = dispatcher.dispatch.bind(dispatcher, opts.signal);
        opts.options  = [
            {value: SettingsState.IMAGE_OPEN_VIEW,   title: 'View'},
            {value: SettingsState.IMAGE_OPEN_IMPORT, title: 'Import'},
            {value: SettingsState.IMAGE_OPEN_ASK,    title: 'Ask how to open'}
        ];
        return this._settingsDialog.addRadioSetting(opts);
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                className: 'flt max-w image-open-settings',
                children: [
                    this._settingsDialog.addDescriptionRow('Image files can be converted to <i>.rgf</i> ' +
                        'files for the EV3 or they can be viewed.<br/>' +
                        'You can select how they should be handled here.'
                    ),
                    this.initOpenOptions({
                        getter:   'getImageOpenBmp',
                        signal:   'Settings.Set.ImageOpen.Bmp',
                        tabIndex: this._tabIndex,
                        label:    'Bmp files'
                    }),
                    this.initOpenOptions({
                        getter:   'getImageOpenPng',
                        signal:   'Settings.Set.ImageOpen.Png',
                        tabIndex: this._tabIndex + 1,
                        label:    'Png files'
                    }),
                    this.initOpenOptions({
                        getter:   'getImageOpenJpg',
                        signal:   'Settings.Set.ImageOpen.Jpg',
                        tabIndex: this._tabIndex + 2,
                        label:    'Jpg files'
                    }),
                    this.initOpenOptions({
                        getter:   'getImageOpenGif',
                        signal:   'Settings.Set.ImageOpen.Gif',
                        tabIndex: this._tabIndex + 3,
                        label:    'Gif files'
                    })
                ]
            }
        );
    }
};
