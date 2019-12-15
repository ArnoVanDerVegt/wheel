/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const path = require('../lib/path');
const Rtf  = require('../program/output/Rtf').Rtf;

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
        let brick        = opts.brick;
        let resources    = opts.resources;
        let filenames    = resources.getFilenameList();
        let downloadFile = function() {
                if (currentIndex >= filenames.length) {
                    brick.resumePolling();
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
                resource.getDownloadData(function(data) {
                    if (data) {
                        brick.downloadData(
                            data,
                            path.join(remotePath, remoteFilename),
                            function(result) {
                                fileFinished(result);
                            }
                        );
                    } else {
                        brick.download(
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
        opts.brick.downloadData(
            new Rtf(opts.program).getOutput(opts.program),
            path.join(remotePath, 'program.rtf'),
            (function(result) {
                opts.onDownloadedProgram();
                this._download(opts);
            }).bind(this)
        );
    }

    _downloadVM(opts) {
        let remotePath      = path.join(opts.remotePath, opts.remoteDirectory);
        let programFilename = opts.remoteDirectory;
        programFilename = programFilename.substr(0, 1).toUpperCase() + programFilename.substr(1 - programFilename.length);
        opts.brick.download(
            path.join(opts.localPath, 'vm/vm.rbf'),
            path.join(remotePath, programFilename + '.rbf'),
            (function(result) {
                opts.onDownloadedVM();
                this._downloadProgram(opts);
            }).bind(this)
        );
    }

    _createRemoteDirectory(opts, callback) {
        opts.brick.createDir(
            path.join(opts.remotePath, opts.remoteDirectory),
            function() {
                opts.onCreatedDirectory();
                callback();
            }
        );
    }

    _waitAfterStopPolling(opts) {
        setTimeout(this._downloadVM.bind(this, opts), 250);
    }

    download(opts) {
        opts.brick.stopPolling(this._waitAfterStopPolling.bind(this, opts));
    }
};
