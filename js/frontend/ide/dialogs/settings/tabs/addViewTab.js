/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
exports.tab = (settingsDialog) => {
    return {
        ref:       settingsDialog.setRef('tabView'),
        className: 'tab-panel tab-view',
        children: [
            settingsDialog.addTitle('General'),
            settingsDialog.addCheckboxSetting({
                description: 'Dark mode',
                tabIndex:    1,
                getter:      'getDarkMode',
                signal:      'Settings.Set.DarkMode'
            }),
            settingsDialog.addHr(),
            settingsDialog.addTitle('Panels'),
            settingsDialog.addCheckboxSetting({
                description: 'Show files',
                tabIndex:    2,
                getter:      'getShowFileTree',
                signal:      'Settings.Set.SetShowFileTree'
            }),
            settingsDialog.addCheckboxSetting({
                description: 'Show console',
                tabIndex:    3,
                getter:      'getConsoleVisible',
                signal:      'Settings.Set.Console.Visible'
            }),
            settingsDialog.addCheckboxSetting({
                ref:         settingsDialog.setRef('showSimulator'),
                description: 'Show simulator',
                tabIndex:    4,
                getter:      'getShowSimulator',
                signal:      'Settings.Set.ShowSimulator',
                onChange:    (value) => {
                    if (value) {
                        let showProperties = settingsDialog.getRefs().showProperties;
                        if (showProperties.getChecked()) {
                            showProperties.setChecked(false);
                        }
                    }
                }
            }),
            settingsDialog.addCheckboxSetting({
                ref:         settingsDialog.setRef('showProperties'),
                description: 'Show component properties',
                tabIndex:    5,
                getter:      'getShowProperties',
                signal:      'Settings.Set.ShowProperties',
                onChange:    (value) => {
                    if (value) {
                        let showSimulator = settingsDialog.getRefs().showSimulator;
                        if (showSimulator.getChecked()) {
                            showSimulator.setChecked(false);
                        }
                    }
                }
            }),
            settingsDialog.addHr(),
            settingsDialog.addTitle('Simulator'),
            settingsDialog.addCheckboxSetting({
                description: 'Show simulator on run',
                tabIndex:    6,
                getter:      'getShowSimulatorOnRun',
                signal:      'Settings.Set.ShowSimulatorOnRun'
            }),
            settingsDialog.addHr(),
            settingsDialog.addTitle('Hint dialogs'),
            settingsDialog.addCheckboxSetting({
                description: 'A form was openend but the property editor is not visible',
                tabIndex:    7,
                getter:      'getDontShowOpenForm',
                signal:      'Settings.Set.DontShowOpenForm'
            }),
            settingsDialog.addCheckboxSetting({
                description: 'Connected to device but simulator is not visible',
                tabIndex:    8,
                getter:      'getDontShowConnected',
                signal:      'Settings.Set.DontShowConnected'
            }),
            settingsDialog.addSpacer()
        ]
    };
};
