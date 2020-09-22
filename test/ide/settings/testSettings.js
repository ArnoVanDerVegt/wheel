/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher    = require('../../../js/frontend/lib/dispatcher').dispatcher;
const SettingsState = require('../../../js/frontend/ide/settings/SettingsState');
const assert        = require('assert');

afterEach(() => {
    dispatcher.reset();
});

describe(
    'Test settings',
    () => {
        describe(
            'Test constructor',
            () => {
                it(
                    'Should create settings',
                    () => {
                        let settings = new SettingsState.SettingsState({});
                        assert.equal(settings.getVersion(), null);
                    }
                );
            }
        );
        describe(
            'Test defaults',
            () => {
                it(
                    'Should check defaults',
                    () => {
                        let settings = new SettingsState.SettingsState({});
                        assert.equal(settings.getConsoleVisible(),      true);
                        assert.equal(settings.getShowFileTree(),        true);
                        assert.equal(settings.getShowSimulator(),       true);
                        assert.equal(settings.getShowSimulatorOnRun(),  true);
                        assert.equal(settings.getCreateVMTextOutput(),  false);
                        assert.equal(settings.getLinter(),              true);
                        assert.equal(settings.getDontShowThemeTile(),   false);
                        assert.equal(settings.getDontShowOpenForm(),    false);
                        assert.equal(settings.getDontShowConnected(),   false);
                        assert.equal(settings.getConsoleShowOnLevel(),  SettingsState.CONSOLE_MESSAGE_TYPE_ERROR);
                        assert.equal(settings.getConsoleMessageCount(), 100);
                    }
                );
            }
        );
        describe(
            'Test miscellaneous',
            () => {
                it(
                    'Should get and set form grid size',
                    () => {
                        let settings = new SettingsState.SettingsState({});
                        assert.equal(settings.getFormGridSize(), 10);
                        dispatcher.dispatch('Settings.Set.FormGridSize', 20);
                        assert.equal(settings.getFormGridSize(), 20);
                    }
                );
                it(
                    'Should get os as object',
                    () => {
                        let settings = new SettingsState.SettingsState({});
                        assert.equal(typeof settings.getOS(), 'object');
                    }
                );
                it(
                    'Should get and set source header text',
                    () => {
                        let settings = new SettingsState.SettingsState({});
                        assert.equal(typeof settings.getSourceHeaderText(), 'string');
                        assert.notEqual(settings.getSourceHeaderText(), 'test');
                        dispatcher.dispatch('Settings.Set.SourceHeaderText', 'test');
                        assert.equal(settings.getSourceHeaderText(), '; test\n');
                    }
                );
                it(
                    'Should get and set auto select properties',
                    () => {
                        let settings = new SettingsState.SettingsState({});
                        assert.equal(settings.getAutoSelectProperties(), true);
                        dispatcher.dispatch('Settings.Set.AutoSelectProperties', false);
                        assert.equal(settings.getAutoSelectProperties(), false);
                    }
                );
                it(
                    'Should get and set create event comments',
                    () => {
                        let settings = new SettingsState.SettingsState({});
                        assert.equal(settings.getCreateEventComments(), true);
                        dispatcher.dispatch('Settings.Set.CreateEventComments', false);
                        assert.equal(settings.getCreateEventComments(), false);
                    }
                );
                it(
                    'Should get and set create VM text output',
                    () => {
                        let settings = new SettingsState.SettingsState({});
                        assert.equal(settings.getCreateVMTextOutput(), false);
                        dispatcher.dispatch('Settings.Set.CreateVMTextOutput', true);
                        assert.equal(settings.getCreateVMTextOutput(), true);
                    }
                );
                it(
                    'Should get and set linter',
                    () => {
                        let settings = new SettingsState.SettingsState({});
                        assert.equal(settings.getLinter(), true);
                        dispatcher.dispatch('Settings.Set.Linter', false);
                        assert.equal(settings.getLinter(), false);
                    }
                );
            }
        );
        describe(
            'Test consele',
            () => {
                it(
                    'Should toggle console',
                    () => {
                        let done     = false;
                        let settings = new SettingsState.SettingsState({});
                        settings.on('Settings.View', this, () => { done = true; });
                        dispatcher.dispatch('Settings.Toggle.ShowConsole');
                        assert.equal(done,                         true);
                        assert.equal(settings.getConsoleVisible(), false);
                    }
                );
                it(
                    'Should set show on level',
                    () => {
                        let settings = new SettingsState.SettingsState({});
                        assert.equal(settings.getConsoleShowOnLevel(), SettingsState.CONSOLE_MESSAGE_TYPE_ERROR);
                        dispatcher.dispatch('Settings.Set.Console.ShowOnLevel', SettingsState.CONSOLE_MESSAGE_TYPE_WARNING);
                        assert.equal(settings.getConsoleShowOnLevel(), SettingsState.CONSOLE_MESSAGE_TYPE_WARNING);
                    }
                );
                it(
                    'Should set message count',
                    () => {
                        let settings = new SettingsState.SettingsState({});
                        assert.equal(settings.getConsoleMessageCount(), 100);
                        dispatcher.dispatch('Settings.Set.Console.MessageCount', 50);
                        assert.equal(settings.getConsoleMessageCount(), 50);
                    }
                );
            }
        );
        describe(
            'Test recent paths',
            () => {
                it(
                    'Should set recent project',
                    () => {
                        let settings = new SettingsState.SettingsState({});
                        assert.equal(settings.getRecentProject(), '');
                        dispatcher.dispatch('Settings.Set.RecentProject', 'path/');
                        assert.equal(settings.getRecentProject(), 'path/');
                    }
                );
                it(
                    'Should set recent form',
                    () => {
                        let settings = new SettingsState.SettingsState({});
                        assert.equal(settings.getRecentForm(), '');
                        dispatcher.dispatch('Settings.Set.RecentForm', 'path/');
                        assert.equal(settings.getRecentForm(), 'path/');
                    }
                );
                it(
                    'Should set recent paths',
                    () => {
                        let settings = new SettingsState.SettingsState({});
                        assert.deepEqual(settings.getRecentPaths(), []);
                        dispatcher.dispatch('Settings.Set.RecentPaths', ['1', '2', '3']);
                        assert.deepEqual(settings.getRecentPaths(), ['1', '2', '3']);
                    }
                );
            }
        );
        describe(
            'Test image open',
            () => {
                it(
                    'Should get default image open settings',
                    () => {
                        let settings = new SettingsState.SettingsState({});
                        assert.equal(settings.getImageOpenForExtension('.bmp'), SettingsState.IMAGE_OPEN_VIEW);
                        assert.equal(settings.getImageOpenForExtension('.png'), SettingsState.IMAGE_OPEN_VIEW);
                        assert.equal(settings.getImageOpenForExtension('.jpg'), SettingsState.IMAGE_OPEN_VIEW);
                        assert.equal(settings.getImageOpenForExtension('.gif'), SettingsState.IMAGE_OPEN_VIEW);
                        assert.equal(settings.getImageOpenForExtension('.???'), SettingsState.IMAGE_OPEN_ASK);
                    }
                );
                it(
                    'Should set image open bmp',
                    () => {
                        let settings = new SettingsState.SettingsState({});
                        dispatcher.dispatch('Settings.Set.ImageOpen.Bmp', SettingsState.IMAGE_OPEN_IMPORT);
                        assert.equal(settings.getImageOpenForExtension('.bmp'), SettingsState.IMAGE_OPEN_IMPORT);
                    }
                );
                it(
                    'Should set image open png',
                    () => {
                        let settings = new SettingsState.SettingsState({});
                        dispatcher.dispatch('Settings.Set.ImageOpen.Png', SettingsState.IMAGE_OPEN_IMPORT);
                        assert.equal(settings.getImageOpenForExtension('.png'), SettingsState.IMAGE_OPEN_IMPORT);
                    }
                );
                it(
                    'Should set image open jpg',
                    () => {
                        let settings = new SettingsState.SettingsState({});
                        dispatcher.dispatch('Settings.Set.ImageOpen.Jpg', SettingsState.IMAGE_OPEN_IMPORT);
                        assert.equal(settings.getImageOpenForExtension('.jpg'), SettingsState.IMAGE_OPEN_IMPORT);
                    }
                );
                it(
                    'Should set image open gif',
                    () => {
                        let settings = new SettingsState.SettingsState({});
                        dispatcher.dispatch('Settings.Set.ImageOpen.Gif', SettingsState.IMAGE_OPEN_IMPORT);
                        assert.equal(settings.getImageOpenForExtension('.gif'), SettingsState.IMAGE_OPEN_IMPORT);
                    }
                );
            }
        );
        describe(
            'Test tile visibility',
            () => {
                it(
                    'Should set EV3 tile',
                    () => {
                        let settings = new SettingsState.SettingsState({});
                        assert.equal(settings.getShowEV3Tile(), true);
                        dispatcher.dispatch('Settings.Set.ShowEV3Tile', false);
                        assert.equal(settings.getShowEV3Tile(), false);
                    }
                );
                it(
                    'Should set EV3 image tile',
                    () => {
                        let settings = new SettingsState.SettingsState({});
                        assert.equal(settings.getShowEV3ImageTile(), true);
                        dispatcher.dispatch('Settings.Set.ShowEV3ImageTile', false);
                        assert.equal(settings.getShowEV3ImageTile(), false);
                    }
                );
                it(
                    'Should set Powered Up tile',
                    () => {
                        let settings = new SettingsState.SettingsState({});
                        assert.equal(settings.getShowPoweredUpTile(), true);
                        dispatcher.dispatch('Settings.Set.ShowPoweredUpTile', false);
                        assert.equal(settings.getShowPoweredUpTile(), false);
                    }
                );
                it(
                    'Should set Powered Up tile',
                    () => {
                        let settings = new SettingsState.SettingsState({});
                        assert.equal(settings.getShowNewFormTile(), true);
                        dispatcher.dispatch('Settings.Set.ShowNewFormTile', false);
                        assert.equal(settings.getShowNewFormTile(), false);
                    }
                );
            }
        );
        describe(
            'Test toggle view option',
            () => {
                it(
                    'Should toggle file tree',
                    () => {
                        let done     = false;
                        let settings = new SettingsState.SettingsState({});
                        settings.on('Settings.View', this, () => { done = true; });
                        dispatcher.dispatch('Settings.Toggle.ShowFileTree');
                        assert.equal(done,                       true);
                        assert.equal(settings.getShowFileTree(), false);

                    }
                );
                it(
                    'Should set file detail',
                    () => {
                        let done     = false;
                        let settings = new SettingsState.SettingsState({});
                        assert.equal(settings.getFilesDetail(), false);
                        dispatcher.dispatch('Settings.Set.FilesDetail', true);
                        assert.equal(settings.getFilesDetail(), true);

                    }
                );
                it(
                    'Should set local file detail',
                    () => {
                        let done     = false;
                        let settings = new SettingsState.SettingsState({});
                        assert.equal(settings.getLocalFilesDetail(), false);
                        dispatcher.dispatch('Settings.Set.LocalFilesDetail', true);
                        assert.equal(settings.getLocalFilesDetail(), true);

                    }
                );
                it(
                    'Should set remote file detail',
                    () => {
                        let done     = false;
                        let settings = new SettingsState.SettingsState({});
                        assert.equal(settings.getRemoteFilesDetail(), false);
                        dispatcher.dispatch('Settings.Set.RemoteFilesDetail', true);
                        assert.equal(settings.getRemoteFilesDetail(), true);

                    }
                );
                it(
                    'Should toggle dark mode',
                    () => {
                        let done     = false;
                        let settings = new SettingsState.SettingsState({});
                        settings.on('Settings.View', this, () => { done = true; });
                        dispatcher.dispatch('Settings.Toggle.DarkMode');
                        assert.equal(done,                   true);
                        assert.equal(settings.getDarkMode(), true);
                    }
                );
                it(
                    'Should set active device',
                    () => {
                        let settings = new SettingsState.SettingsState({});
                        assert.equal(settings.getActiveDevice(), 1);
                        dispatcher.dispatch('Settings.Set.ActiveDevice', 0);
                        assert.equal(settings.getActiveDevice(), 0);
                    }
                );
                it(
                    'Should set window size',
                    () => {
                        let settings = new SettingsState.SettingsState({});
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
                    () => {
                        let settings = new SettingsState.SettingsState({});
                        dispatcher.dispatch('Settings.Set.ShowSimulator', true);
                        assert.equal(settings.getShowSimulator(), true);
                        dispatcher.dispatch('Settings.Set.ShowSimulator', false);
                        assert.equal(settings.getShowSimulator(), false);
                    }
                );
                it(
                    'Should set show properties',
                    () => {
                        let settings = new SettingsState.SettingsState({});
                        dispatcher.dispatch('Settings.Set.ShowProperties', true);
                        assert.equal(settings.getShowProperties(), true);
                        dispatcher.dispatch('Settings.Set.ShowProperties', false);
                        assert.equal(settings.getShowProperties(), false);
                    }
                );
                it(
                    'Should toggle show properties',
                    () => {
                        let settings = new SettingsState.SettingsState({});
                        assert.equal(settings.getShowProperties(), false);
                        dispatcher.dispatch('Settings.Toggle.ShowProperties');
                        assert.equal(settings.getShowProperties(), true);
                    }
                );
                it(
                    'Should show simulator and hide properties',
                    () => {
                        let settings = new SettingsState.SettingsState({});
                        assert.equal(settings.getShowSimulator(),  true);
                        assert.equal(settings.getShowProperties(), false);
                        dispatcher.dispatch('Settings.Toggle.ShowProperties');
                        assert.equal(settings.getShowProperties(), true);
                        dispatcher.dispatch('Settings.Set.ShowSimulator', true);
                        assert.equal(settings.getShowSimulator(),  true);
                        assert.equal(settings.getShowProperties(), false);
                    }
                );
                it(
                    'Should show properties and hide simulator',
                    () => {
                        let settings = new SettingsState.SettingsState({});
                        assert.equal(settings.getShowSimulator(),  true);
                        assert.equal(settings.getShowProperties(), false);
                        dispatcher.dispatch('Settings.Set.ShowSimulator', false);
                        dispatcher.dispatch('Settings.Toggle.ShowSimulator');
                        assert.equal(settings.getShowSimulator(), true);
                        dispatcher.dispatch('Settings.Toggle.ShowProperties');
                        assert.equal(settings.getShowSimulator(),  false);
                        assert.equal(settings.getShowProperties(), true);
                    }
                );
                it(
                    'Should get and set show filetree',
                    () => {
                        let settings = new SettingsState.SettingsState({});
                        assert.equal(settings.getShowFileTree(), true);
                        dispatcher.dispatch('Settings.Set.ShowFileTree', false);
                        assert.equal(settings.getShowFileTree(), false);
                    }
                );
            }
        );
        describe(
            'Test toggle compile option',
            () => {
                it(
                    'Should toggle create text output',
                    () => {
                        let done     = false;
                        let settings = new SettingsState.SettingsState({});
                        settings.on('Settings.Compile', this, () => { done = true; });
                        dispatcher.dispatch('Settings.Toggle.CreateVMTextOutput');
                        assert.equal(done,                             true);
                        assert.equal(settings.getCreateVMTextOutput(), true);
                    }
                );
                it(
                    'Should toggle linter',
                    () => {
                        let done     = false;
                        let settings = new SettingsState.SettingsState({});
                        settings.on('Settings.Compile', this, () => { done = true; });
                        dispatcher.dispatch('Settings.Toggle.Linter');
                        assert.equal(done,                 true);
                        assert.equal(settings.getLinter(), false);
                    }
                );
            }
        );
        describe(
            'Test ev3 options',
            () => {
                it(
                    'Should toggle auto connect',
                    () => {
                        let done     = false;
                        let settings = new SettingsState.SettingsState({});
                        settings.on('Settings.EV3', this, () => { done = true; });
                        dispatcher.dispatch('Settings.Toggle.EV3AutoConnect');
                        assert.equal(done,                         true);
                        assert.equal(settings.getEV3AutoConnect(), true);
                    }
                );
                it(
                    'Should toggle auto install',
                    () => {
                        let done     = false;
                        let settings = new SettingsState.SettingsState({});
                        settings.on('Settings.EV3', this, () => { done = true; });
                        dispatcher.dispatch('Settings.Toggle.AutoInstall');
                        assert.equal(done,                      true);
                        assert.equal(settings.getAutoInstall(), true);
                    }
                );
                it(
                    'Should set daisy chain mode',
                    () => {
                        let done     = false;
                        let settings = new SettingsState.SettingsState({});
                        settings.on('Settings.EV3', this, () => { done = true; });
                        dispatcher.dispatch('Settings.Set.DaisyChainMode', 1);
                        assert.equal(done,                         true);
                        assert.equal(settings.getDaisyChainMode(), 1);
                    }
                );
                it(
                    'Should validate daisy chain mode',
                    () => {
                        let settings = new SettingsState.SettingsState({});
                        assert.equal(settings.getValidatedDaisyChainMode(-1), 0);
                        assert.equal(settings.getValidatedDaisyChainMode(0),  0);
                        assert.equal(settings.getValidatedDaisyChainMode(3),  3);
                        assert.equal(settings.getValidatedDaisyChainMode(4),  0);
                    }
                );
                it(
                    'Should set device name',
                    () => {
                        let done     = false;
                        let settings = new SettingsState.SettingsState({});
                        dispatcher.dispatch('Settings.Set.DeviceName', 'Wheel device');
                        assert.equal(settings.getDeviceName(), 'Wheel device');
                    }
                );
            }
        );
        describe(
            'Test settings',
            () => {
                it(
                    'Should set recent project',
                    () => {
                        let done     = false;
                        let settings = new SettingsState.SettingsState({});
                        assert.equal(settings.getRecentProject(), '');
                        dispatcher.dispatch('Settings.Set.RecentProject', 'hello.whlp');
                        assert.equal(settings.getRecentProject(), 'hello.whlp');
                    }
                );
                it(
                    'Should set last check version date',
                    () => {
                        let done     = false;
                        let settings = new SettingsState.SettingsState({});
                        dispatcher.dispatch('Settings.Set.LastVersionCheckDate', '10-11-2020');
                        assert.equal(settings.getLastVersionCheckDate(), '10-11-2020');
                        dispatcher.dispatch('Settings.Set.LastVersionCheckDate', '01-04-2021');
                        assert.equal(settings.getLastVersionCheckDate(), '01-04-2021');
                    }
                );
                it(
                    'Should get packed',
                    () => {
                        let done     = false;
                        let settings = new SettingsState.SettingsState({isPackaged: true});
                        assert.equal(settings.getIsPackaged(), true);
                        settings = new SettingsState.SettingsState({isPackaged: false});
                        assert.equal(settings.getIsPackaged(), false);
                    }
                );
                it(
                    'Should get in application folder',
                    () => {
                        let done     = false;
                        let settings = new SettingsState.SettingsState({});
                        settings.onLoad({isInApplicationsFolder: true});
                        assert.equal(settings.getIsInApplicationsFolder(), true);
                        settings.onLoad({isInApplicationsFolder: false});
                        assert.equal(settings.getIsInApplicationsFolder(), false);
                    }
                );
                it(
                    'Should get document path',
                    () => {
                        let done     = false;
                        let settings = new SettingsState.SettingsState({});
                        settings.onLoad({documentPath: '/user/'});
                        assert.equal(settings.getDocumentPath(), '/user/');
                    }
                );
                it(
                    'Should set document path',
                    () => {
                        let done     = false;
                        let settings = new SettingsState.SettingsState({});
                        dispatcher.dispatch('Settings.Set.DocumentPath', '/path/');
                        assert.equal(settings.getDocumentPath(), '/path/');
                    }
                );
                it(
                    'Should get document path exists',
                    () => {
                        let done     = false;
                        let settings = new SettingsState.SettingsState({});
                        settings.onLoad({documentPathExists: true});
                        assert.equal(settings.getDocumentPathExists(), true);
                        settings.onLoad({documentPathExists: false});
                        assert.equal(settings.getDocumentPathExists(), false);
                    }
                );
                it(
                    'Should get user document path',
                    () => {
                        let done     = false;
                        let settings = new SettingsState.SettingsState({systemDocumentPath: '/user/'});
                        assert.equal(settings.getSystemDocumentPath(), '/user/');
                        settings = new SettingsState.SettingsState({systemDocumentPath: '\\user\\'});
                        assert.equal(settings.getSystemDocumentPath(), '/user/');
                    }
                );
            }
        );
        describe(
            'Test sizing',
            () => {
                it(
                    'Should set file tree size',
                    () => {
                        let settings = new SettingsState.SettingsState({});
                        assert.equal(settings.getResizerFileTreeSize(), 192);
                        dispatcher.dispatch('Settings.Set.Resizer.FileTreeSize', 166);
                        assert.equal(settings.getResizerFileTreeSize(), 166);
                    }
                );
                it(
                    'Should set console size',
                    () => {
                        let settings = new SettingsState.SettingsState({});
                        assert.equal(settings.getResizerConsoleSize(), 192);
                        dispatcher.dispatch('Settings.Set.Resizer.ConsoleSize', 477);
                        assert.equal(settings.getResizerConsoleSize(), 477);
                    }
                );
            }
        );
        describe(
            'Test don\'t show',
            () => {
                it(
                    'Should set dont show connected',
                    () => {
                        let settings = new SettingsState.SettingsState({});
                        assert.equal(settings.getDontShowConnected(), false);
                        dispatcher.dispatch('Settings.Set.DontShowConnected', true);
                        assert.equal(settings.getDontShowConnected(), true);
                    }
                );
                it(
                    'Should set dont show open form',
                    () => {
                        let settings = new SettingsState.SettingsState({});
                        assert.equal(settings.getDontShowOpenForm(), false);
                        dispatcher.dispatch('Settings.Set.DontShowOpenForm', true);
                        assert.equal(settings.getDontShowOpenForm(), true);
                    }
                );
                it(
                    'Should set dont show theme tile',
                    () => {
                        let settings = new SettingsState.SettingsState({});
                        assert.equal(settings.getDontShowThemeTile(), false);
                        dispatcher.dispatch('Settings.Set.DontShowThemeTile', true);
                        assert.equal(settings.getDontShowThemeTile(), true);
                    }
                );
            }
        );
        describe(
            'Test Powered Up',
            () => {
                it(
                    'Should set device count',
                    () => {
                        let settings = new SettingsState.SettingsState({});
                        assert.equal(settings.getDeviceCount(), 1);
                        dispatcher.dispatch('Settings.Set.DeviceCount', 0);
                        assert.equal(settings.getDeviceCount(), 1);
                        dispatcher.dispatch('Settings.Set.DeviceCount', 2);
                        assert.equal(settings.getDeviceCount(), 2);
                    }
                );
                it(
                    'Should validate device count',
                    () => {
                        let settings = new SettingsState.SettingsState({});
                        assert.equal(settings.getValidatedDeviceCount(0), 1);
                        assert.equal(settings.getValidatedDeviceCount(1), 1);
                        assert.equal(settings.getValidatedDeviceCount(4), 4);
                        assert.equal(settings.getValidatedDeviceCount(9), 1);
                    }
                );
            }
        );
        describe(
            'Test simulator',
            () => {
                it(
                    'Should toggle sensor auto reset',
                    () => {
                        let settings = new SettingsState.SettingsState({});
                        assert.equal(settings.getSensorAutoReset(), true);
                        dispatcher.dispatch('Settings.Toggle.SensorAutoReset');
                        assert.equal(settings.getSensorAutoReset(), false);
                    }
                );
                it(
                    'Should toggle simulator',
                    () => {
                        let done     = false;
                        let settings = new SettingsState.SettingsState({});
                        settings.on('Settings.View', this, () => { done = true; });
                        dispatcher.dispatch('Settings.Toggle.ShowSimulator');
                        assert.equal(done,                        true);
                        assert.equal(settings.getShowSimulator(), false);
                    }
                );
                it(
                    'Should set show simulator on run',
                    () => {
                        let settings = new SettingsState.SettingsState({});
                        assert.equal(settings.getShowSimulatorOnRun(), true);
                        dispatcher.dispatch('Settings.Toggle.ShowSimulatorOnRun', false);
                        assert.equal(settings.getShowSimulatorOnRun(), false);
                    }
                );
            }
        );
        describe(
            'Test device alias',
            () => {
                it(
                    'Should set device alias',
                    () => {
                        let settings = new SettingsState.SettingsState({});
                        assert.equal(settings.getDeviceAlias('abc'), 'abc');
                        dispatcher.dispatch('Settings.Set.DeviceAlias', 'abc', 'def');
                        assert.equal(settings.getDeviceAlias('abc'), 'def');
                    }
                );
                it(
                    'Should set device port alias',
                    () => {
                        let settings = new SettingsState.SettingsState({});
                        assert.equal(settings.getDevicePortAlias('abc', 1), 2);
                        dispatcher.dispatch('Settings.Set.DevicePortAlias', 'abc', 1, 'def');
                        assert.equal(settings.getDevicePortAlias('abc', 1), 'def');
                    }
                );
            }
        );
        describe(
            'Test image open options',
            () => {
                it(
                    'Should check initial open options',
                    () => {
                        let settings = new SettingsState.SettingsState({});
                        assert.equal(settings.getImageOpenBmp(), 'View');
                        assert.equal(settings.getImageOpenPng(), 'View');
                        assert.equal(settings.getImageOpenJpg(), 'View');
                        assert.equal(settings.getImageOpenGif(), 'View');
                    }
                );
                it(
                    'Should validate options',
                    () => {
                        let settings = new SettingsState.SettingsState({});
                        assert.equal(settings.getValidatedImageOpenOption('View'),   'View');
                        assert.equal(settings.getValidatedImageOpenOption('Import'), 'Import');
                        assert.equal(settings.getValidatedImageOpenOption('Ask'),    'Ask');
                        assert.equal(settings.getValidatedImageOpenOption('Wrong'),  'View');
                    }
                );
                it(
                    'Should set options',
                    () => {
                        let settings = new SettingsState.SettingsState({});
                        assert.equal(settings.getImageOpenBmp(), 'View');
                        dispatcher.dispatch('Settings.Set.ImageOpen.Bmp', 'Ask');
                        assert.equal(settings.getImageOpenBmp(), 'Ask');
                        assert.equal(settings.getImageOpenPng(), 'View');
                        dispatcher.dispatch('Settings.Set.ImageOpen.Png', 'Ask');
                        assert.equal(settings.getImageOpenPng(), 'Ask');
                        assert.equal(settings.getImageOpenJpg(), 'View');
                        dispatcher.dispatch('Settings.Set.ImageOpen.Jpg', 'Ask');
                        assert.equal(settings.getImageOpenJpg(), 'Ask');
                        assert.equal(settings.getImageOpenGif(), 'View');
                        dispatcher.dispatch('Settings.Set.ImageOpen.Gif', 'Ask');
                        assert.equal(settings.getImageOpenGif(), 'Ask');
                    }
                );
            }
        );
    }
);
