/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const Downloader   = require('../../../ev3/Downloader');
const dispatcher   = require('../../../lib/dispatcher').dispatcher;
const path         = require('../../../lib/path');
const Dialog       = require('../../../lib/components/Dialog').Dialog;
const ResourceLine = require('./components/ResourceLine').ResourceLine;

exports.DownloadDialog = class extends Dialog {
    constructor(opts) {
        super(opts);
        this.createWindow(
            'download-dialog',
            'Download resources',
            [
                {
                    className: 'download-row',
                    children: [
                        {
                            innerHTML: 'Project filename:',
                            className: 'label'
                        },
                        {
                            ref:       this.setRef('projectFilename'),
                            className: 'value'
                        }
                    ]
                },
                {
                    className: 'download-row',
                    children: [
                        {
                            innerHTML: 'Project description:',
                            className: 'label'
                        },
                        {
                            ref:       this.setRef('projectDescription'),
                            className: 'value'
                        }
                    ]
                },
                {
                    className: 'download-row',
                    children: [
                        {
                            innerHTML: 'Remote directory:',
                            className: 'label'
                        },
                        {
                            ref:       this.setRef('remoteDirectory'),
                            className: 'value'
                        }
                    ]
                },
                {
                    className: 'download-row',
                    children: [
                        {
                            innerHTML: 'Actions:',
                            className: 'label'
                        }
                    ]
                },
                {
                    ref:       this.setRef('text'),
                    className: 'download-text'
                },
                {
                    className: 'buttons',
                    children: [
                        this.addButton({
                            ref:      this.setRef('downloadButton'),
                            value:    'Download',
                            tabIndex: 128,
                            onClick:  this.onDownload.bind(this)
                        }),
                        this.addButton({
                            ref:      this.setRef('closeButton'),
                            value:    'Close',
                            tabIndex: 129,
                            color:    'dark-green',
                            onClick:  this.hide.bind(this)
                        })
                    ]
                }
            ]
        );
        dispatcher.on('Dialog.Download.Show', this, this.onShow);
        this._ev3      = opts.ev3;
        this._settings = opts.settings;
    }

    initLines(resources) {
        let text = this._refs.text;
        while (text.childNodes.length) {
            text.removeChild(text.childNodes[0]);
        }
        let filenames         = resources.getFilenameList();
        let elementByFilename = {};
        new ResourceLine({
            parentNode:        text,
            elementByFilename: elementByFilename,
            elementId:         'createDirectory',
            filename:          'Create directory "' + this._remoteDirectory + '"'
        });
        new ResourceLine({
            parentNode:        text,
            elementByFilename: elementByFilename,
            elementId:         'downloadedVM',
            filename:          'Download VM'
        });
        new ResourceLine({
            parentNode:        text,
            elementByFilename: elementByFilename,
            elementId:         'downloadProgram',
            filename:          'Download program "program.rtf"'
        });
        filenames.forEach(
            function(filename) {
                new ResourceLine({
                    parentNode:        text,
                    elementByFilename: elementByFilename,
                    filename:          filename
                });
            },
            this
        );
        this._elementByFilename = elementByFilename;
    }

    onDownload() {
        let refs              = this._refs;
        let elementByFilename = this._elementByFilename;
        refs.downloadButton.setDisabled(true);
        refs.closeButton.setDisabled(true);
        new Downloader.Downloader().download({
            ev3:             this._ev3,
            program:         this._program,
            resources:       this._resources,
            localPath:       this._settings.getDocumentPath(),
            remoteDirectory: this._remoteDirectory,
            remotePath:      '../prjs/',
            onCreatedDirectory() {
                elementByFilename.createDirectory.setResult(true);
            },
            onDownloadedVM() {
                elementByFilename.downloadedVM.setResult(true);
            },
            onDownloadedProgram() {
                elementByFilename.downloadProgram.setResult(true);
            },
            onDownloadedFile: function(filename, result) {
                elementByFilename[filename].setResult(result);
            },
            onDownloadReady: function() {
                refs.downloadButton.setDisabled(false);
                refs.closeButton.setDisabled(false);
            }
        });
    }

    onShow(opts) {
        let refs = this._refs;
        this._ev3.stopPolling();
        this._program         = opts.program;
        this._remoteDirectory = Downloader.getRemoteDirectory(opts.filename);
        this._resources       = opts.resources;
        refs.projectDescription.innerHTML = opts.program.getTitle() || '?';
        refs.projectFilename.innerHTML    = path.removePath(this._settings.getDocumentPath(), opts.filename);
        refs.remoteDirectory.innerHTML    = this._remoteDirectory;
        this.initLines(opts.resources);
        this.show();
    }

    hide() {
        this._ev3.resumePolling();
        super.hide();
    }
};
