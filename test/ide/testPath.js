/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const path   = require('../../js/frontend/lib/path');
const assert = require('assert');

describe(
    'Test path',
    () => {
        describe(
            'Test extension',
            () => {
                it(
                    'Should find extension from file',
                    () => {
                        assert.equal(path.getExtension('test.whl'), '.whl');
                    }
                );
                it(
                    'Should find extension from file with path',
                    () => {
                        assert.equal(path.getExtension('path/test.whl'), '.whl');
                    }
                );
                it(
                    'Should find not extension from file',
                    () => {
                        assert.equal(path.getExtension('test'), '');
                    }
                );
                it(
                    'Should find not extension from file in directory',
                    () => {
                        assert.equal(path.getExtension('path/test'), '');
                    }
                );
                it(
                    'Should not find extension from hidden file',
                    () => {
                        assert.equal(path.getExtension('.htaccess'), '');
                    }
                );
                it(
                    'Should not find extension from hidden in directory file',
                    () => {
                        assert.equal(path.getExtension('test/.htaccess'), '');
                    }
                );
            }
        );
        describe(
            'Test path and filename',
            () => {
                it(
                    'Should get path and filename',
                    () => {
                        let s               = 'test/file.whl';
                        let pathAndFilename = path.getPathAndFilename(s);
                        assert.equal(pathAndFilename.path,     'test');
                        assert.equal(pathAndFilename.filename, 'file.whl');
                    }
                );
                it(
                    'Should get path',
                    () => {
                        let s               = 'test/';
                        let pathAndFilename = path.getPathAndFilename(s);
                        assert.equal(pathAndFilename.path,     'test');
                        assert.equal(pathAndFilename.filename, '');
                    }
                );
                it(
                    'Should get filename',
                    () => {
                        let s               = 'test.whl';
                        let pathAndFilename = path.getPathAndFilename(s);
                        assert.equal(pathAndFilename.path,     '');
                        assert.equal(pathAndFilename.filename, 'test.whl');
                    }
                );
            }
        );
        describe(
            'Test path',
            () => {
                it(
                    'Should get path from path and filename',
                    () => {
                        assert.equal(path.getPath('test/file.whl'), 'test');
                    }
                );
                it(
                    'Should get path',
                    () => {
                        assert.equal(path.getPath('test/'), 'test');
                    }
                );
                it(
                    'Should get empty path',
                    () => {
                        assert.equal(path.getPath('test.whl'), '');
                    }
                );
            }
        );
        describe(
            'Test replace extension',
            () => {
                it(
                    'Should replace extension',
                    () => {
                        assert.equal(path.replaceExtension('file.whl', '.vm'), 'file.vm');
                    }
                );
                it(
                    'Should not replace extension',
                    () => {
                        assert.equal(path.replaceExtension('file', '.vm'), 'file');
                    }
                );
                it(
                    'Should replace extension in file with path',
                    () => {
                        assert.equal(path.replaceExtension('path/file.whl', '.vm'), 'path/file.vm');
                    }
                );
                it(
                    'Should not replace extension in file with path',
                    () => {
                        assert.equal(path.replaceExtension('path/file', '.vm'), 'path/file');
                    }
                );
                it(
                    'Should not replace extension from hidden file',
                    () => {
                        assert.equal(path.replaceExtension('.htaccess', '.vm'), '.htaccess');
                    }
                );
                it(
                    'Should not replace extension from hidden file with path',
                    () => {
                        assert.equal(path.replaceExtension('path/.htaccess', '.vm'), 'path/.htaccess');
                    }
                );
            }
        );
        describe(
            'Test remove slashes',
            () => {
                it(
                    'Should not remove anything',
                    () => {
                        assert.equal(path.removeSlashes('string'), 'string');
                    }
                );
                it(
                    'Should remove right slash',
                    () => {
                        assert.equal(path.removeSlashes('string/'), 'string');
                    }
                );
                it(
                    'Should remove left slash',
                    () => {
                        assert.equal(path.removeSlashes('/string'), 'string');
                    }
                );
                it(
                    'Should remove both slashes',
                    () => {
                        assert.equal(path.removeSlashes('/string/'), 'string');
                    }
                );
                it(
                    'Should remove both slashes and keep middle',
                    () => {
                        assert.equal(path.removeSlashes('/string/string/'), 'string/string');
                    }
                );
            }
        );
        describe(
            'Test join',
            () => {
                it(
                    'Should not change path',
                    () => {
                        assert.equal(path.join('path', ''), 'path');
                    }
                );
                it(
                    'Should not change path',
                    () => {
                        assert.equal(path.join('', 'path'), 'path');
                    }
                );
                it(
                    'Should add path',
                    () => {
                        assert.equal(path.join('path1', 'path2'), 'path1/path2');
                    }
                );
                it(
                    'Should add path and remove slashes',
                    () => {
                        assert.equal(path.join('/path1/', '/path2/'), '/path1/path2/');
                    }
                );
                it(
                    'Should add path with multiple parts',
                    () => {
                        assert.equal(path.join('/path1/path2/', '/path3/'), '/path1/path2/path3/');
                    }
                );
                it(
                    'Should add path with .. part',
                    () => {
                        assert.equal(path.join('/path1/../', '/path2/'), '/path2/');
                    }
                );
                it(
                    'Should not remove .. part',
                    () => {
                        assert.equal(path.join('../', '/path2/'), '../path2/');
                    }
                );
            }
        );
        describe(
            'Test add root path',
            () => {
                it(
                    'Should make root path',
                    () => {
                        assert.equal(path.addRootPath('root'), '/root');
                    }
                );
            }
        );
        describe(
            'Test remove path',
            () => {
                it(
                    'Should not remove path',
                    () => {
                        assert.equal(path.removePath('/no-match', '/some/path'), '/some/path');
                    }
                );
                it(
                    'Should remove path',
                    () => {
                        assert.equal(path.removePath('/match', '/match/path'), 'path');
                    }
                );
                it(
                    'Should remove same path as filename',
                    () => {
                        assert.equal(path.removePath('/match', '/match'), '');
                    }
                );
            }
        );
        describe(
            'Test platform path',
            () => {
                it(
                    'Should not make platform path',
                    () => {
                        assert.equal(path.makePlatformPath('/platform/path'), '/platform/path');
                    }
                );
                it(
                    'Should make platform path',
                    () => {
                        path.setSep('\\');
                        assert.equal(path.makePlatformPath('/platform/path'), '\\platform\\path');
                        path.setSep('/');
                    }
                );
            }
        );
    }
);
