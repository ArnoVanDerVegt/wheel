/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const IncludeFilesSetting = require('../components/IncludeFilesSetting').IncludeFilesSetting;
const ImageOpenSettings   = require('../components/ImageOpenSettings').ImageOpenSettings;

exports.tab = (settingsDialog, opts) => {
    return {
        ref:       settingsDialog.setRef('tabEditor'),
        className: 'tab-panel tab-editor',
        children: [
            settingsDialog.addCheckboxSetting({
                description:    'Add comments to generated event procedures',
                tabIndex:       1,
                getter:         'getCreateEventComments',
                signal:         'Settings.Set.CreateEventComments'
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
            }
        ]
    };
};
