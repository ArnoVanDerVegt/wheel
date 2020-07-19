/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
exports.tab = (settingsDialog, opts) => {
    return {
        ref:       settingsDialog.setRef('tabSimulator'),
        className: 'tab-panel tab-simulator',
        children: [
            settingsDialog.addCheckboxSetting({
                description: 'Auto reset sensor value',
                tabIndex:    1,
                getter:      'getSensorAutoReset',
                signal:      'Settings.Set.SensorAutoReset'
            })
        ]
    };
};
