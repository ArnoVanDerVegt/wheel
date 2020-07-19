/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher    = require('../../../../lib/dispatcher').dispatcher;
const SettingsState = require('../../../settings/SettingsState');

exports.tab = (settingsDialog, opts) => {
    return {
        ref:       settingsDialog.setRef('tabConsole'),
        className: 'tab-panel tab-console',
        children: [
            settingsDialog.addTitle('Automatically show console'),
            settingsDialog.addDescriptionRow('You can select at which log level the console automatically will be shown.'),
            settingsDialog.addRadioSetting({
                label:    'Log level',
                value:    opts.settings.getConsoleShowOnLevel(),
                options:  [
                    {value: SettingsState.CONSOLE_MESSAGE_TYPE_INFO,    title: 'Info'},
                    {value: SettingsState.CONSOLE_MESSAGE_TYPE_HINT,    title: 'Hint'},
                    {value: SettingsState.CONSOLE_MESSAGE_TYPE_WARNING, title: 'Warning'},
                    {value: SettingsState.CONSOLE_MESSAGE_TYPE_ERROR,   title: 'Error'},
                    {value: SettingsState.CONSOLE_NEVER,                title: 'Never'}
                ],
                onChange: (value) => {
                    dispatcher.dispatch('Settings.Set.Console.ShowOnLevel', value);
                }
            }),
            settingsDialog.addTitle('Maximum size')
        ]
    };
};
