/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const Console = require('./console/Console');

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
                        type:    Console.MESSAGE_TYPE_HINT,
                        message: 'Created remote directory <i>' + remoteDirectory + '</i>'
                    }
                );
            },
            onDownloadedVM() {
                dispatcher.dispatch(
                    'Console.Log',
                    {
                        type:    Console.MESSAGE_TYPE_HINT,
                        message: 'Downloaded VM.'
                    }
                );
            },
            onDownloadedProgram() {
                dispatcher.dispatch(
                    'Console.Log',
                    {
                        type:    Console.MESSAGE_TYPE_HINT,
                        message: 'Downloaded program.'
                    }
                );
                let resourceCount = resources.getResources().length;
                if (resourceCount) {
                    dispatcher.dispatch(
                        'Console.Log',
                        {
                            type:      Console.MESSAGE_TYPE_INFO,
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
                        type:            Console.MESSAGE_TYPE_INFO,
                        message:         'Downloaded file <i>' + filename + '</i>',
                        parentMessageId: messageId
                    }
                );
            },
            onDownloadReady: function() {
                dispatcher.dispatch(
                    'Console.Log',
                    {
                        type:    Console.MESSAGE_TYPE_HINT,
                        message: 'Download finished.'
                    }
                );
            }
        });
    }
};
