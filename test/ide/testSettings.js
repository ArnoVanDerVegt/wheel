/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher    = require('../../js/frontend/lib/dispatcher').dispatcher;
const SettingsState = require('../../js/frontend/ide/SettingsState').SettingsState;
const assert        = require('assert');

describe(
    'Test settings',
    function() {
        describe(
            'Test constructor',
            function() {
                it(
                    'Should create settings',
                    function() {
                        let settings = new SettingsState({});
                        assert.equal(settings.getVersion(), null);
                    }
                );
            }
        );
        describe(
            'Test defaults',
            function() {
                it(
                    'Should check defaults',
                    function() {
                        let settings = new SettingsState({});
                        assert.equal(settings.getShowFileTree(),              true);
                        assert.equal(settings.getShowConsole(),               true);
                        assert.equal(settings.getShowSimulatorMotors(),       true);
                        assert.equal(settings.getShowSimulatorEV3(),          true);
                        assert.equal(settings.getShowSimulatorSensors(),      true);
                        assert.equal(settings.getShowSimulatorOnRun(),        true);
                        assert.equal(settings.getCreateVMTextOutput(),        true);
                        assert.equal(settings.getLinter(),                    true);
                        assert.equal(settings.getDontShowWelcomeHintDialog(), false);
                    }
                );
            }
        );
        describe(
            'Test toggle view option',
            function() {
                it(
                    'Should toggle file tree',
                    function() {
                        dispatcher.reset();
                        let done     = false;
                        let settings = new SettingsState({});
                        settings.on('Settings.View', this, function() { done = true; });
                        dispatcher.dispatch('Settings.Toggle.ShowFileTree');
                        assert.equal(done,                       true);
                        assert.equal(settings.getShowFileTree(), false);

                    }
                );
                it(
                    'Should toggle console',
                    function() {
                        dispatcher.reset();
                        let done     = false;
                        let settings = new SettingsState({});
                        settings.on('Settings.View', this, function() { done = true; });
                        dispatcher.dispatch('Settings.Toggle.ShowConsole');
                        assert.equal(done,                      true);
                        assert.equal(settings.getShowConsole(), false);
                    }
                );
                it(
                    'Should toggle simulator motors',
                    function() {
                        dispatcher.reset();
                        let done     = false;
                        let settings = new SettingsState({});
                        settings.on('Settings.View', this, function() { done = true; });
                        dispatcher.dispatch('Settings.Toggle.ShowSimulatorMotors');
                        assert.equal(done,                              true);
                        assert.equal(settings.getShowSimulatorMotors(), false);
                    }
                );
                it(
                    'Should toggle simulator ev3',
                    function() {
                        dispatcher.reset();
                        let done     = false;
                        let settings = new SettingsState({});
                        settings.on('Settings.View', this, function() { done = true; });
                        dispatcher.dispatch('Settings.Toggle.ShowSimulatorEV3');
                        assert.equal(done,                           true);
                        assert.equal(settings.getShowSimulatorEV3(), false);
                    }
                );
                it(
                    'Should toggle simulator sensors',
                    function() {
                        dispatcher.reset();
                        let done     = false;
                        let settings = new SettingsState({});
                        settings.on('Settings.View', this, function() { done = true; });
                        dispatcher.dispatch('Settings.Toggle.ShowSimulatorSensors');
                        assert.equal(done,                               true);
                        assert.equal(settings.getShowSimulatorSensors(), false);
                    }
                );
                it(
                    'Should toggle dark mode',
                    function() {
                        dispatcher.reset();
                        let done     = false;
                        let settings = new SettingsState({});
                        settings.on('Settings.View', this, function() { done = true; });
                        dispatcher.dispatch('Settings.Toggle.DarkMode');
                        assert.equal(done,                   true);
                        assert.equal(settings.getDarkMode(), true);
                    }
                );
            }
        );
        describe(
            'Test toggle compile option',
            function() {
                it(
                    'Should toggle create text output',
                    function() {
                        dispatcher.reset();
                        let done     = false;
                        let settings = new SettingsState({});
                        settings.on('Settings.Compile', this, function() { done = true; });
                        dispatcher.dispatch('Settings.Toggle.CreateVMTextOutput');
                        assert.equal(done,                             true);
                        assert.equal(settings.getCreateVMTextOutput(), false);
                    }
                );
                it(
                    'Should toggle linter',
                    function() {
                        dispatcher.reset();
                        let done     = false;
                        let settings = new SettingsState({});
                        settings.on('Settings.Compile', this, function() { done = true; });
                        dispatcher.dispatch('Settings.Toggle.Linter');
                        assert.equal(done,                 true);
                        assert.equal(settings.getLinter(), false);
                    }
                );
            }
        );
        describe(
            'Test ev3 options',
            function() {
                it(
                    'Should toggle auto connect',
                    function() {
                        dispatcher.reset();
                        let done     = false;
                        let settings = new SettingsState({});
                        settings.on('Settings.EV3', this, function() { done = true; });
                        dispatcher.dispatch('Settings.Toggle.AutoConnect');
                        assert.equal(done,                      true);
                        assert.equal(settings.getAutoConnect(), true);
                    }
                );
                it(
                    'Should toggle auto install',
                    function() {
                        dispatcher.reset();
                        let done     = false;
                        let settings = new SettingsState({});
                        settings.on('Settings.EV3', this, function() { done = true; });
                        dispatcher.dispatch('Settings.Toggle.AutoInstall');
                        assert.equal(done,                      true);
                        assert.equal(settings.getAutoInstall(), true);
                    }
                );
                it(
                    'Should set daisy chain mode',
                    function() {
                        dispatcher.reset();
                        let done     = false;
                        let settings = new SettingsState({});
                        settings.on('Settings.EV3', this, function() { done = true; });
                        dispatcher.dispatch('Settings.Set.DaisyChainMode', 1);
                        assert.equal(done,                         true);
                        assert.equal(settings.getDaisyChainMode(), 1);
                    }
                );
            }
        );
        describe(
            'Test settings',
            function() {
                it(
                    'Should set recent project',
                    function() {
                        dispatcher.reset();
                        let done     = false;
                        let settings = new SettingsState({});
                        assert.equal(settings.getRecentProject(), '');
                        dispatcher.dispatch('Settings.Set.RecentProject', 'hello.whlp');
                        assert.equal(settings.getRecentProject(), 'hello.whlp');
                    }
                );
                it(
                    'Should set show simulator motors',
                    function() {
                        dispatcher.reset();
                        let done     = false;
                        let settings = new SettingsState({});
                        dispatcher.dispatch('Settings.Set.ShowSimulatorMotors', true);
                        assert.equal(settings.getShowSimulatorMotors(), true);
                        dispatcher.dispatch('Settings.Set.ShowSimulatorMotors', false);
                        assert.equal(settings.getShowSimulatorMotors(), false);
                    }
                );
                it(
                    'Should set show simulator sensors',
                    function() {
                        dispatcher.reset();
                        let done     = false;
                        let settings = new SettingsState({});
                        dispatcher.dispatch('Settings.Set.ShowSimulatorSensors', true);
                        assert.equal(settings.getShowSimulatorSensors(), true);
                        dispatcher.dispatch('Settings.Set.ShowSimulatorSensors', false);
                        assert.equal(settings.getShowSimulatorSensors(), false);
                    }
                );
                it(
                    'Should set last check version date',
                    function() {
                        dispatcher.reset();
                        let done     = false;
                        let settings = new SettingsState({});
                        dispatcher.dispatch('Settings.Set.LastVersionCheckDate', '10-11-2020');
                        assert.equal(settings.getLastVersionCheckDate(), '10-11-2020');
                        dispatcher.dispatch('Settings.Set.LastVersionCheckDate', '01-04-2021');
                        assert.equal(settings.getLastVersionCheckDate(), '01-04-2021');
                    }
                );
            }
        );
        describe(
            'Test sizing',
            function() {
                it(
                    'Should set file tree size',
                    function() {
                        dispatcher.reset();
                        let settings = new SettingsState({});
                        assert.equal(settings.getResizerFileTreeSize(), 192);
                        dispatcher.dispatch('Settings.Set.Resizer.FileTreeSize', 166);
                        assert.equal(settings.getResizerFileTreeSize(), 166);
                    }
                );
                it(
                    'Should set console size',
                    function() {
                        dispatcher.reset();
                        let settings = new SettingsState({});
                        assert.equal(settings.getResizerConsoleSize(), 192);
                        dispatcher.dispatch('Settings.Set.Resizer.ConsoleSize', 477);
                        assert.equal(settings.getResizerConsoleSize(), 477);
                    }
                );
            }
        );
        describe(
            'Test don\'t show',
            function() {
                it(
                    'Should set dont show welcome hint',
                    function() {
                        dispatcher.reset();
                        let settings = new SettingsState({});
                        assert.equal(settings.getDontShowWelcomeHintDialog(), false);
                        dispatcher.dispatch('Settings.Set.DontShowWelcomeHintDialog', true);
                        assert.equal(settings.getDontShowWelcomeHintDialog(), true);
                    }
                );
            }
        );
    }
);
