/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
exports.CompileAndRunInstall = class {
    constructor(opts) {
        this._settings = opts.settings;
    }

    setEV3(ev3) {
        this._ev3 = ev3;
        return this;
    }

    setProgram(program) {
        this._program = program;
        return this;
    }

    setPreProcessor(preProcessor) {
        this._preProcessor = preProcessor;
        return this;
    }

    setProjectFilename(projectFilename) {
        this._projectFilename = projectFilename;
        return this;
    }

    installProgram() {
        if (!this._ev3.getConnected() || !this._settings.getAutoInstall()) {
            return;
        }
        let messageId       = Log.getMessageId();
        let program         = this._program;
        let remoteDirectory = Downloader.getRemoteDirectory(this._projectFilename);
        let filename        = path.getPathAndFilename(this._projectFilename).filename;
        let resources       = this._preProcessor.getResources();
        new Downloader.Downloader().download({
            ev3:             this._ev3,
            program:         this._program,
            localPath:       this._settings.getDocumentPath(),
            resources:       resources,
            remoteDirectory: remoteDirectory,
            remotePath:      '../prjs/',
            onCreatedDirectory() {
                dispatcher.dispatch(
                    'Console.Log',
                    {
                        message:   'Created remote directory <i>' + remoteDirectory + '</i>',
                        className: 'ok'
                    }
                );
            },
            onDownloadedVM() {
                dispatcher.dispatch(
                    'Console.Log',
                    {
                        message:   'Downloaded VM.',
                        className: 'ok'
                    }
                );
            },
            onDownloadedProgram() {
                dispatcher.dispatch(
                    'Console.Log',
                    {
                        message:   'Downloaded program.',
                        className: 'ok'
                    }
                );
                let resourceCount = resources.getResources().length;
                if (resourceCount) {
                    dispatcher.dispatch(
                        'Console.Log',
                        {
                            message:   'Downloading ' + resourceCount + ' resource' + (resourceCount ? 's' : ''),
                            messageId: messageId
                        }
                    );
                }
            },
            onDownloadedFile: function(filename, result) {
                dispatcher.dispatch(
                    'Console.Log',
                    {
                        message:         'Downloaded file <i>' + filename + '</i>',
                        parentMessageId: messageId
                    }
                );
            },
            onDownloadReady: function() {
                dispatcher.dispatch(
                    'Console.Log',
                    {
                        message:   'Download finished.',
                        className: 'ok'
                    }
                );
            }
        });
    }
};
