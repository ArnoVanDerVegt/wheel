/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const path = require('../lib/path');
const Rtf  = require('./output/Rtf').Rtf;

exports.getRemoteDirectory = function(filename) {
    filename = path.replaceExtension(path.getPathAndFilename(filename).filename, '');
    let valid  = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_';
    let result = '';
    for (let i = 0; i < filename.length; i++) {
        if (valid.indexOf(filename[i]) !== -1) {
            result += filename[i];
        }
    }
    return result;
};

exports.Downloader = class {
    _download(opts) {
        let currentIndex = 0;
        let ev3          = opts.ev3;
        let resources    = opts.resources;
        let filenames    = resources.getFilenameList();
        let downloadFile = function() {
                if (currentIndex >= filenames.length) {
                    ev3.resumePolling();
                    opts.onDownloadReady();
                    return;
                }
                let filename       = filenames[currentIndex];
                let resource       = resources.get(filename);
                let localPath      = opts.localPath;
                let remotePath     = path.join(opts.remotePath, opts.remoteDirectory);
                let remoteFilename = path.getPathAndFilename(filename).filename;
                let fileFinished   = function(result) {
                        opts.onDownloadedFile(filename, result);
                        currentIndex++;
                        downloadFile();
                    };
                resource.getDownloadData((data) => {
                    if (data) {
                        ev3.downloadData(
                            data,
                            path.join(remotePath, remoteFilename),
                            function(result) {
                                fileFinished(result);
                            }
                        );
                    } else {
                        ev3.download(
                            path.join(localPath,  filename),
                            path.join(remotePath, remoteFilename),
                            function(result) {
                                fileFinished(result);
                            }
                        );
                    }
                });
            };
        downloadFile();
    }

    _downloadProgram(opts) {
        let remotePath = path.join(opts.remotePath, opts.remoteDirectory);
        opts.ev3.downloadData(
            new Rtf(opts.program).getOutput(opts.program),
            path.join(remotePath, 'program.rtf'),
            (result) => {
                opts.onDownloadedProgram();
                this._download(opts);
            }
        );
    }

    _downloadVM(opts) {
        let remotePath      = path.join(opts.remotePath, opts.remoteDirectory);
        let programFilename = opts.remoteDirectory;
        programFilename = programFilename.substr(0, 1).toUpperCase() + programFilename.substr(1 - programFilename.length);
        opts.ev3.download(
            path.join(opts.localPath, 'vm/vm.rbf'),
            path.join(remotePath, programFilename + '.rbf'),
            (result) => {
                opts.onDownloadedVM();
                this._downloadProgram(opts);
            }
        );
    }

    _createRemoteDirectory(opts) {
        opts.ev3.createDir(
            path.join(opts.remotePath, opts.remoteDirectory),
            () => {
                opts.onCreatedDirectory();
                this._downloadVM(opts);
            }
        );
    }

    _waitAfterStopPolling(opts) {
        setTimeout(this._createRemoteDirectory.bind(this, opts), 250);
    }

    download(opts) {
        opts.ev3.stopPolling(this._waitAfterStopPolling.bind(this, opts));
    }
};
