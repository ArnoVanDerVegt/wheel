/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher    = require('../../js/frontend/lib/dispatcher').dispatcher;
const SettingsState = require('../../js/frontend/ide/settings/SettingsState').SettingsState;
const assert        = require('assert');

afterEach(function() {
    dispatcher.reset();
});

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
                        assert.equal(settings.getShowFileTree(),       true);
                        assert.equal(settings.getShowConsole(),        true);
                        assert.equal(settings.getShowSimulator(),      true);
                        assert.equal(settings.getShowSimulatorOnRun(), true);
                        assert.equal(settings.getCreateVMTextOutput(), false);
                        assert.equal(settings.getLinter(),             true);
                        assert.equal(settings.getDontShowThemeTile(),  false);
                        assert.equal(settings.getDontShowOpenForm(),   false);
                        assert.equal(settings.getDontShowConnected(),  false);
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
                        let done     = false;
                        let settings = new SettingsState({});
                        settings.on('Settings.View', this, function() { done = true; });
                        dispatcher.dispatch('Settings.Toggle.ShowFileTree');
                        assert.equal(done,                       true);
                        assert.equal(settings.getShowFileTree(), false);

                    }
                );
                it(
                    'Should set file detail',
                    function() {
                        let done     = false;
                        let settings = new SettingsState({});
                        assert.equal(settings.getFilesDetail(), false);
                        dispatcher.dispatch('Settings.Set.FilesDetail', true);
                        assert.equal(settings.getFilesDetail(), true);

                    }
                );
                it(
                    'Should set local file detail',
                    function() {
                        let done     = false;
                        let settings = new SettingsState({});
                        assert.equal(settings.getLocalFilesDetail(), false);
                        dispatcher.dispatch('Settings.Set.LocalFilesDetail', true);
                        assert.equal(settings.getLocalFilesDetail(), true);

                    }
                );
                it(
                    'Should set remote file detail',
                    function() {
                        let done     = false;
                        let settings = new SettingsState({});
                        assert.equal(settings.getRemoteFilesDetail(), false);
                        dispatcher.dispatch('Settings.Set.RemoteFilesDetail', true);
                        assert.equal(settings.getRemoteFilesDetail(), true);

                    }
                );
                it(
                    'Should toggle console',
                    function() {
                        let done     = false;
                        let settings = new SettingsState({});
                        settings.on('Settings.View', this, function() { done = true; });
                        dispatcher.dispatch('Settings.Toggle.ShowConsole');
                        assert.equal(done,                      true);
                        assert.equal(settings.getShowConsole(), false);
                    }
                );
                it(
                    'Should toggle simulator',
                    function() {
                        let done     = false;
                        let settings = new SettingsState({});
                        settings.on('Settings.View', this, function() { done = true; });
                        dispatcher.dispatch('Settings.Toggle.ShowSimulator');
                        assert.equal(done,                        true);
                        assert.equal(settings.getShowSimulator(), false);
                    }
                );
                it(
                    'Should toggle dark mode',
                    function() {
                        let done     = false;
                        let settings = new SettingsState({});
                        settings.on('Settings.View', this, function() { done = true; });
                        dispatcher.dispatch('Settings.Toggle.DarkMode');
                        assert.equal(done,                   true);
                        assert.equal(settings.getDarkMode(), true);
                    }
                );
                it(
                    'Should set active device',
                    function() {
                        let settings = new SettingsState({});
                        assert.equal(settings.getActiveDevice(), 1);
                        dispatcher.dispatch('Settings.Set.ActiveDevice', 0);
                        assert.equal(settings.getActiveDevice(), 0);
                    }
                );
                it(
                    'Should set window size',
                    function() {
                        let settings = new SettingsState({});
                        dispatcher.dispatch('Settings.Set.WindowSize', 640, 480);
                        assert.equal(settings._windowSize.width,  640);
                        assert.equal(settings._windowSize.height, 480);
                        dispatcher.dispatch('Settings.Set.WindowSize', 800, 600);
                        assert.equal(settings._windowSize.width,  800);
                        assert.equal(settings._windowSize.height, 600);
                    }
                );
                it(
                    'Should set show simulator',
                    function() {
                        let settings = new SettingsState({});
                        dispatcher.dispatch('Settings.Set.ShowSimulator', true);
                        assert.equal(settings.getShowSimulator(), true);
                        dispatcher.dispatch('Settings.Set.ShowSimulator', false);
                        assert.equal(settings.getShowSimulator(), false);
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
                        let done     = false;
                        let settings = new SettingsState({});
                        settings.on('Settings.Compile', this, function() { done = true; });
                        dispatcher.dispatch('Settings.Toggle.CreateVMTextOutput');
                        assert.equal(done,                             true);
                        assert.equal(settings.getCreateVMTextOutput(), true);
                    }
                );
                it(
                    'Should toggle linter',
                    function() {
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
                        let done     = false;
                        let settings = new SettingsState({});
                        settings.on('Settings.EV3', this, function() { done = true; });
                        dispatcher.dispatch('Settings.Toggle.EV3AutoConnect');
                        assert.equal(done,                         true);
                        assert.equal(settings.getEV3AutoConnect(), true);
                    }
                );
                it(
                    'Should toggle auto install',
                    function() {
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
                        let done     = false;
                        let settings = new SettingsState({});
                        settings.on('Settings.EV3', this, function() { done = true; });
                        dispatcher.dispatch('Settings.Set.DaisyChainMode', 1);
                        assert.equal(done,                         true);
                        assert.equal(settings.getDaisyChainMode(), 1);
                    }
                );
                it(
                    'Should set device name',
                    function() {
                        let done     = false;
                        let settings = new SettingsState({});
                        dispatcher.dispatch('Settings.Set.DeviceName', 'Wheel device');
                        assert.equal(settings.getDeviceName(), 'Wheel device');
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
                        let done     = false;
                        let settings = new SettingsState({});
                        assert.equal(settings.getRecentProject(), '');
                        dispatcher.dispatch('Settings.Set.RecentProject', 'hello.whlp');
                        assert.equal(settings.getRecentProject(), 'hello.whlp');
                    }
                );
                it(
                    'Should set last check version date',
                    function() {
                        let done     = false;
                        let settings = new SettingsState({});
                        dispatcher.dispatch('Settings.Set.LastVersionCheckDate', '10-11-2020');
                        assert.equal(settings.getLastVersionCheckDate(), '10-11-2020');
                        dispatcher.dispatch('Settings.Set.LastVersionCheckDate', '01-04-2021');
                        assert.equal(settings.getLastVersionCheckDate(), '01-04-2021');
                    }
                );
                it(
                    'Should get packed',
                    function() {
                        let done     = false;
                        let settings = new SettingsState({isPackaged: true});
                        assert.equal(settings.getIsPackaged(), true);
                        settings = new SettingsState({isPackaged: false});
                        assert.equal(settings.getIsPackaged(), false);
                    }
                );
                it(
                    'Should get in application folder',
                    function() {
                        let done     = false;
                        let settings = new SettingsState({});
                        settings.onLoad({isInApplicationsFolder: true});
                        assert.equal(settings.getIsInApplicationsFolder(), true);
                        settings.onLoad({isInApplicationsFolder: false});
                        assert.equal(settings.getIsInApplicationsFolder(), false);
                    }
                );
                it(
                    'Should get document path',
                    function() {
                        let done     = false;
                        let settings = new SettingsState({});
                        settings.onLoad({documentPath: '/user/'});
                        assert.equal(settings.getDocumentPath(), '/user/');
                    }
                );
                it(
                    'Should set document path',
                    function() {
                        let done     = false;
                        let settings = new SettingsState({});
                        dispatcher.dispatch('Settings.Set.DocumentPath', '/path/');
                        assert.equal(settings.getDocumentPath(), '/path/');
                    }
                );
                it(
                    'Should get document path exists',
                    function() {
                        let done     = false;
                        let settings = new SettingsState({});
                        settings.onLoad({documentPathExists: true});
                        assert.equal(settings.getDocumentPathExists(), true);
                        settings.onLoad({documentPathExists: false});
                        assert.equal(settings.getDocumentPathExists(), false);
                    }
                );
                it(
                    'Should get user document path',
                    function() {
                        let done     = false;
                        let settings = new SettingsState({userDocumentPath: '/user/'});
                        assert.equal(settings.getUserDocumentPath(), '/user/');
                        settings = new SettingsState({userDocumentPath: '\\user\\'});
                        assert.equal(settings.getUserDocumentPath(), '/user/');
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
                        let settings = new SettingsState({});
                        assert.equal(settings.getResizerFileTreeSize(), 192);
                        dispatcher.dispatch('Settings.Set.Resizer.FileTreeSize', 166);
                        assert.equal(settings.getResizerFileTreeSize(), 166);
                    }
                );
                it(
                    'Should set console size',
                    function() {
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
                    'Should set dont show connected',
                    function() {
                        let settings = new SettingsState({});
                        assert.equal(settings.getDontShowConnected(), false);
                        dispatcher.dispatch('Settings.Set.DontShowConnected', true);
                        assert.equal(settings.getDontShowConnected(), true);
                    }
                );
            }
        );
        describe(
            'Test Powered Up',
            function() {
                it(
                    'Should set device count',
                    function() {
                        let settings = new SettingsState({});
                        assert.equal(settings.getDeviceCount(), 1);
                        dispatcher.dispatch('Settings.Set.DeviceCount', 0);
                        assert.equal(settings.getDeviceCount(), 1);
                        dispatcher.dispatch('Settings.Set.DeviceCount', 2);
                        assert.equal(settings.getDeviceCount(), 2);
                    }
                );
            }
        );
        describe(
            'Test simulator',
            function() {
                it(
                    'Should toggle sensor auto reset',
                    function() {
                        let settings = new SettingsState({});
                        assert.equal(settings.getSensorAutoReset(), true);
                        dispatcher.dispatch('Settings.Toggle.SensorAutoReset');
                        assert.equal(settings.getSensorAutoReset(), false);
                    }
                );
            }
        );
        describe(
            'Test device alias',
            function() {
                it(
                    'Should set device alias',
                    function() {
                        let settings = new SettingsState({});
                        assert.equal(settings.getDeviceAlias('abc'), 'abc');
                        dispatcher.dispatch('Settings.Set.DeviceAlias', 'abc', 'def');
                        assert.equal(settings.getDeviceAlias('abc'), 'def');
                    }
                );
                it(
                    'Should set device port alias',
                    function() {
                        let settings = new SettingsState({});
                        assert.equal(settings.getDevicePortAlias('abc', 1), 2);
                        dispatcher.dispatch('Settings.Set.DevicePortAlias', 'abc', 1, 'def');
                        assert.equal(settings.getDevicePortAlias('abc', 1), 'def');
                    }
                );
            }
        );
    }
);
