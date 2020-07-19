/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
exports.tab = (settingsDialog) => {
    return {
        ref:       settingsDialog.setRef('tabCompiler'),
        className: 'tab-panel tab-compiler',
        children: [
            settingsDialog.addTitle('Validation'),
            settingsDialog.addCheckboxSetting({
                label:    'Linter',
                tabIndex: 1,
                getter:   'getLinter',
                signal:   'Settings.Set.SetLinter'
            }),
            settingsDialog.addTitle('Output'),
            settingsDialog.addCheckboxSetting({
                label:    'Create VM text output',
                tabIndex: 2,
                getter:   'getCreateVMTextOutput',
                signal:   'Settings.Set.CreateVMTextOutput'
            })
        ]
    };
};
