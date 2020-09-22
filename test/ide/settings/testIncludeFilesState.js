/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher        = require('../../../js/frontend/lib/dispatcher').dispatcher;
const IncludeFilesState = require('../../../js/frontend/ide/settings/IncludeFilesState').IncludeFilesState;
const assert            = require('assert');

afterEach(() => {
    dispatcher.reset();
});

class MockSettings {
    save() { return this; }
    emit() { return this; }
}

describe(
    'Test IncludeFilesState',
    () => {
        it(
            'Should create IncludeFilesState',
            () => {
                let includeFilesState = new IncludeFilesState({});
                assert.notEqual(includeFilesState, null);
            }
        );
        it(
            'Should get EV3 files',
            () => {
                let includeFilesState = new IncludeFilesState({});
                assert.deepEqual(
                    includeFilesState.getIncludeFiles('EV3'),
                    [
                        {file: 'lib/button.whl', type: 'EV3', description: 'Read EV3 buttons'},
                        {file: 'lib/file.whl',   type: 'EV3', description: 'Read and write files'},
                        {file: 'lib/light.whl',  type: 'EV3', description: 'Control the EV3 light'},
                        {file: 'lib/screen.whl', type: 'EV3', description: 'Drawing functions'},
                        {file: 'lib/sound.whl',  type: 'EV3', description: 'Play tones and samples'},
                        {file: 'lib/system.whl', type: 'EV3', description: 'Access to EV3 system functions'}
                    ]
                );
            }
        );
        it(
            'Should add file',
            () => {
                let includeFilesState = new IncludeFilesState({settings: new MockSettings()});
                let length            = includeFilesState.toJSON().length;
                dispatcher.dispatch('Settings.Add.IncludeFile');
                assert.equal(includeFilesState.toJSON().length, length + 1);
            }
        );
        it(
            'Should move file up',
            () => {
                let includeFilesState = new IncludeFilesState({settings: new MockSettings()});
                let includeFile1      = includeFilesState.toJSON()[0];
                let includeFile2      = includeFilesState.toJSON()[1];
                dispatcher.dispatch('Settings.Set.IncludeFileUp', 1);
                assert.deepEqual(includeFile2, includeFilesState.toJSON()[0]);
                assert.deepEqual(includeFile1, includeFilesState.toJSON()[1]);
            }
        );
        it(
            'Should move file down',
            () => {
                let includeFilesState = new IncludeFilesState({settings: new MockSettings()});
                let includeFile1      = includeFilesState.toJSON()[1];
                let includeFile2      = includeFilesState.toJSON()[2];
                dispatcher.dispatch('Settings.Set.IncludeFileDown', 1);
                assert.deepEqual(includeFile2, includeFilesState.toJSON()[1]);
                assert.deepEqual(includeFile1, includeFilesState.toJSON()[2]);
            }
        );
        it(
            'Should set file info by index',
            () => {
                let includeFilesState = new IncludeFilesState({settings: new MockSettings()});
                dispatcher.dispatch(
                    'Settings.Set.IncludeFileByIndex',
                    {file: 'file', type: 'type', description: 'description'},
                    1
                );
                assert.deepEqual(
                    includeFilesState.toJSON()[1],
                    {file: 'file', type: 'type', description: 'description'}
                );
            }
        );
        it(
            'Should set file by index',
            () => {
                let includeFilesState = new IncludeFilesState({settings: new MockSettings()});
                dispatcher.dispatch('Settings.Set.IncludeFile.File', {file: 'file', index: 1});
                assert.deepEqual(
                    includeFilesState.toJSON()[1],
                    {file: 'file', type: 'EV3', description: 'Read EV3 buttons'}
                );
            }
        );
        it(
            'Should set description by index',
            () => {
                let includeFilesState = new IncludeFilesState({settings: new MockSettings()});
                dispatcher.dispatch('Settings.Set.IncludeFile.Description', {description: 'description', index: 1});
                assert.deepEqual(
                    includeFilesState.toJSON()[1],
                    {file: 'lib/button.whl', type: 'EV3', description: 'description'}
                );
            }
        );
        it(
            'Should reset to default',
            () => {
                let includeFilesState = new IncludeFilesState({settings: new MockSettings()});
                let length            = includeFilesState.toJSON().length;
                dispatcher.dispatch('Settings.Add.IncludeFile');
                assert.equal(includeFilesState.toJSON().length, length + 1);
                dispatcher.dispatch('Settings.Set.IncludeFileDefaults');
                assert.equal(includeFilesState.toJSON().length, length);
            }
        );
    }
);
