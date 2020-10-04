/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher          = require('../../../../lib/dispatcher').dispatcher;
const IncludeFilesSetting = require('../components/IncludeFilesSetting').IncludeFilesSetting;
const ImageOpenSettings   = require('../components/ImageOpenSettings').ImageOpenSettings;

exports.tab = (settingsDialog, opts) => {
    return {
        ref:       settingsDialog.setRef('tabEditor'),
        className: 'abs max-x tab-panel ui1-box vscroll tab-editor',
        children: [
            settingsDialog.addTitle('Form editor'),
            settingsDialog.addCheckboxSetting({
                label:          'Add comments to generated event procedures',
                tabIndex:       1,
                getter:         'getCreateEventComments',
                signal:         'Settings.Set.CreateEventComments'
            }),
            settingsDialog.addCheckboxSetting({
                label:          'Switch to properties when a component is selected or changed',
                tabIndex:       2,
                getter:         'getAutoSelectProperties',
                signal:         'Settings.Set.AutoSelectProperties'
            }),
            settingsDialog.addHr(),
            settingsDialog.addTitle('Source file header text'),
            settingsDialog.addTextAreaSetting({
                label:    '',
                tabIndex: 2049,
                value:    opts.settings.getSourceHeaderText(),
                onChange: dispatcher.dispatch.bind(dispatcher, 'Settings.Set.SourceHeaderText')
            }),
            settingsDialog.addHr(),
            settingsDialog.addTitle('Include file options'),
            {
                type:           IncludeFilesSetting,
                tabIndex:       16,
                ui:             opts.ui,
                uiId:           opts.uiId,
                settings:       opts.settings
            },
            settingsDialog.addHr(),
            settingsDialog.addTitle('Image open options'),
            {
                settingsDialog: settingsDialog,
                type:           ImageOpenSettings,
                tabIndex:       2048,
                ui:             opts.ui,
                uiId:           opts.uiId,
                settings:       opts.settings
            },
            settingsDialog.addSpacer()
        ]
    };
};
