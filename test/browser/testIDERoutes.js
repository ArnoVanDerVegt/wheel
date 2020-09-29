/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const ide    = require('../../js/browser/routes/ide');
const assert = require('assert');

const getMockDependencies = () => {
        return {
            './js/frontend/ide/data/templates': require('../../js/frontend/ide/data/templates'),
            './js/frontend/lib/path':           require('../../js/frontend/lib/path')
        };
    };

const getFilesFromData = (data) => {
        let files = [];
        data.files.forEach((file) => {
            files.push(file.name);
        });
        files.sort();
        return files;
    };

global.atob = (data) => { return Buffer.from(data, 'base64').toString(); };

global.localStorage = {
    getItem(key) {
        return '{}';
    }
};

global.navigator = {
    platform: 'mac'
};

beforeEach(() => {
    ide.ideRoutes.reset();
});

describe(
    'Test browser routes',
    () => {
        it(
            'Should check type',
            () => {
                assert.equal(typeof ide.ideRoutes, 'object');
            }
        );
        it(
            'Should get root directories',
            (done) => {
                ide.setRequireDependencies(getMockDependencies());
                const onRecieveDirectories = (data) => {
                        assert.deepEqual(
                            getFilesFromData(data),
                            ['examples', 'lib', 'projects', 'resources', 'vm', 'woc']
                        );
                        done();
                    };
                ide.ideRoutes.files({index: 0}, onRecieveDirectories);
            }
        );
        it(
            'Should change path and get files',
            (done) => {
                ide.setRequireDependencies(getMockDependencies());
                const onRecieveDirectories = (data) => {
                        assert.deepEqual(
                            getFilesFromData(data),
                            [
                                '..',
                                'bit', 'components', 'console', 'device', 'ev3',
                                'file', 'math', 'poweredup', 'string'
                            ]
                        );
                        done();
                    };
                const onChangedPath = (data) => {
                        ide.ideRoutes.files({index: 0}, onRecieveDirectories);
                    };
                ide.ideRoutes.files({index: 0, changePath: 'examples'}, onChangedPath);
            }
        );
        it(
            'Should get file',
            (done) => {
                ide.setRequireDependencies(getMockDependencies());
                ide.ideRoutes.file(
                    {filename: 'Wheel/examples/bit/bit.whlp'},
                    (data) => {
                        data = JSON.parse(data);
                        assert.equal(data.success, true);
                        done();
                    }
                );
            }
        );
        it(
            'Should find in file',
            (done) => {
                ide.setRequireDependencies(getMockDependencies());
                ide.ideRoutes.findInFile(
                    {filename: 'Wheel/examples/bit/bit.whlp', text: 'proc'},
                    (data) => {
                        assert.deepEqual(
                            JSON.parse(data),
                            {
                              filename: 'Wheel/examples/bit/bit.whlp',
                              text:     'proc',
                              found:    [{line: 'proc main()', num: 11, pos: 0}]
                            }
                        );
                        done();
                    }
                );
            }
        );
        it(
            'Should load settings',
            (done) => {
                ide.setRequireDependencies(getMockDependencies());
                ide.ideRoutes.settingsLoad(
                    {},
                    (data) => {
                        assert.deepEqual(
                            data,
                            {
                                version:      '0.9.1',
                                documentPath: 'Wheel',
                                os:           {homedir: '', platform: 'darwin', arch: '?', pathSep: '/'}
                            }
                        );
                        done();
                    }
                );
            }
        );
        it(
            'Should get files in path',
            (done) => {
                ide.setRequireDependencies(getMockDependencies());
                ide.ideRoutes.filesInPath(
                    {},
                    (data) => {
                        data = JSON.parse(data);
                        assert.deepEqual(data, Object.keys(require('../../js/frontend/ide/data/templates').files));
                        done();
                    }
                );
            }
        );
        it(
            'Should save file',
            (done) => {
                ide.setRequireDependencies(getMockDependencies());
                const onFileLoaded = (data) => {
                        assert.deepEqual(JSON.parse(data), {success: true, data: 'Test save data'});
                        done();
                    };
                const onFileSaved = (data) => {
                        assert.equal(data.success, true);
                        ide.ideRoutes.file({filename: '/Wheel/test.rtf'}, onFileLoaded);
                    };
                ide.ideRoutes.fileSave({filename: '/Wheel/test.rtf', data: 'Test save data'}, onFileSaved);
            }
        );
        it(
            'Should delete file',
            (done) => {
                ide.setRequireDependencies(getMockDependencies());
                const onFileLoaded = (data) => {
                        data = JSON.parse(data);
                        assert.equal(data.success, false);
                        done();
                    };
                const onFileDeleted = (data) => {
                        assert.equal(data.success, true);
                        ide.ideRoutes.file({filename: '/Wheel/test1.rtf'}, onFileLoaded);
                    };
                const onFileSaved = (data) => {
                        assert.equal(data.success, true);
                        ide.ideRoutes.fileDelete({filename: '/Wheel/test1.rtf'}, onFileDeleted);
                    };
                ide.ideRoutes.fileSave({filename: '/Wheel/test1.rtf', data: 'Test save data'}, onFileSaved);
            }
        );
        it(
            'Should register changes',
            (done) => {
                ide.setRequireDependencies(getMockDependencies());
                const onChanges = (data) => {
                        data = JSON.parse(data);
                        assert.deepEqual(data, [{eventType: 'change', path: '/Wheel/test2.rtf'}]);
                        done();
                    };
                const onFileSaved = (data) => {
                        assert.equal(data.success, true);
                        ide.ideRoutes.changes({filename: '/Wheel/test2.rtf'}, onChanges);
                    };
                ide.ideRoutes.fileSave({filename: '/Wheel/test2.rtf', data: 'Test save data'}, onFileSaved);
            }
        );
    }
);
