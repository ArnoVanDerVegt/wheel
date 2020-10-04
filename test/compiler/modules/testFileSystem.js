/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const FileSystem = require('../../..//js/frontend/vm/modules/local/FileSystem');
const assert     = require('assert');

class MockVM {
    sleep() {
        return this;
    }

    getOutputPath() {
        return '';
    }
}

class MockDataProvider {
    getData(method, path, params, callback) {
        switch (method + ':' + path) {
            case 'get:ide/path-exists':
                callback(JSON.stringify({exists: (params.path === 'goodfile')}));
                break;
            case 'get:ide/file':
                callback(JSON.stringify({data: [50, 60, 'A', 'B'].join('\r')}));
                break;
            case 'post:ide/file-append':
                callback(JSON.stringify(params));
                break;
            case 'post:ide/file-delete':
                callback(JSON.stringify(params));
                break;
            case 'post:ide/file-size':
                callback(JSON.stringify({success: true, size: 1024}));
                break;
        }
    }
}

const getDataProvider = () => {
        return new MockDataProvider({});
    };

describe(
    'Test File system',
    () => {
        it(
            'Should create FileSystem',
            () => {
                let fileSystem = new FileSystem.FileSystem({getDataProvider: getDataProvider, vm: new MockVM()});
                assert.notEqual(fileSystem, null);
            }
        );
        it(
            'Should check if file exists',
            (done) => {
                let fileSystem = new FileSystem.FileSystem({getDataProvider: getDataProvider, vm: new MockVM()});
                const onFileDoesNotExist = (exists) => {
                        assert.equal(exists, false);
                        done();
                    };
                const onFileExists = (exists) => {
                        assert.equal(exists, true);
                        fileSystem.exists('badfile', onFileDoesNotExist);
                    };
                fileSystem.exists('goodfile', onFileExists);
            }
        );
        it(
            'Should open file for reading',
            () => {
                let fileSystem = new FileSystem.FileSystem({getDataProvider: getDataProvider, vm: new MockVM()});
                assert.strictEqual(fileSystem.open('test', FileSystem.MODE_READ), 0);
            }
        );
        it(
            'Should read number',
            () => {
                let fileSystem = new FileSystem.FileSystem({getDataProvider: getDataProvider, vm: new MockVM()});
                assert.strictEqual(fileSystem.open('test', FileSystem.MODE_READ), 0);
                assert.strictEqual(fileSystem.readNumber(0), 50);
                assert.strictEqual(fileSystem.readNumber(0), 60);
            }
        );
        it(
            'Should read string',
            () => {
                let fileSystem = new FileSystem.FileSystem({getDataProvider: getDataProvider, vm: new MockVM()});
                assert.strictEqual(fileSystem.open('test', FileSystem.MODE_READ), 0);
                fileSystem.readNumber(0);
                fileSystem.readNumber(0);
                assert.strictEqual(fileSystem.readString(0), 'A');
                assert.strictEqual(fileSystem.readString(0), 'B');
            }
        );
        it(
            'Should open file for writing',
            () => {
                let fileSystem = new FileSystem.FileSystem({getDataProvider: getDataProvider, vm: new MockVM()});
                assert.strictEqual(fileSystem.open('test', FileSystem.MODE_WRITE), 0);
            }
        );
        it(
            'Should write string to file',
            (done) => {
                let fileSystem = new FileSystem.FileSystem({getDataProvider: getDataProvider, vm: new MockVM()});
                assert.strictEqual(fileSystem.open('test', FileSystem.MODE_WRITE), 0);
                fileSystem.writeString(
                    0,
                    'hello world',
                    (data) => {
                        assert.deepEqual(data, {filename: 'test', data: 'hello world\r', handle: 0});
                        done();
                    }
                );
            }
        );
        it(
            'Should write number to file',
            (done) => {
                let fileSystem = new FileSystem.FileSystem({getDataProvider: getDataProvider, vm: new MockVM()});
                assert.strictEqual(fileSystem.open('test', FileSystem.MODE_WRITE), 0);
                fileSystem.writeNumber(
                    0,
                    1681,
                    (data) => {
                        assert.deepEqual(data, {filename: 'test', data: '1681\r', handle: 0});
                        done();
                    }
                );
            }
        );
        it(
            'Should close file',
            () => {
                let fileSystem = new FileSystem.FileSystem({getDataProvider: getDataProvider, vm: new MockVM()});
                fileSystem.open('test', FileSystem.MODE_READ);
                assert.equal(fileSystem.close(0), fileSystem);
            }
        );
        it(
            'Should remove file',
            (done) => {
                let fileSystem = new FileSystem.FileSystem({getDataProvider: getDataProvider, vm: new MockVM()});
                fileSystem.remove(
                    'test',
                    (data) => {
                        assert.deepEqual(data, {filename: 'test'});
                        done();
                    }
                );
            }
        );
        it(
            'Should get file size',
            (done) => {
                let fileSystem = new FileSystem.FileSystem({getDataProvider: getDataProvider, vm: new MockVM()});
                fileSystem.fileSize(
                    'test',
                    (size) => {
                        assert.equal(size, 1024);
                        done();
                    }
                );
            }
        );
    }
);
