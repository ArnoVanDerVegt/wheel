/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const path         = require('../../../../shared/lib/path');
const Downloader   = require('../../../program/Downloader');
const dispatcher   = require('../../../lib/dispatcher').dispatcher;
const Dialog       = require('../../../lib/components/Dialog').Dialog;
const ResourceLine = require('./components/ResourceLine').ResourceLine;

const SHOW_SIGNAL = 'Dialog.Download.Show';

exports.DownloadDialog = class extends Dialog {
    constructor(opts) {
        super(opts);
        this._ev3 = opts.ev3;
        this.initWindow({
            showSignal: SHOW_SIGNAL,
            width:      600,
            height:     472,
            className:  'download-dialog',
            title:      'Download resources'
        });
    }

    initWindowContent(opts) {
        return [
            {
                className: 'flt max-w download-row',
                children: [
                    {
                        innerHTML: 'Project filename:',
                        className: 'flt label'
                    },
                    {
                        ref:       this.setRef('projectFilename'),
                        className: 'flt value'
                    }
                ]
            },
            {
                className: 'flt max-w download-row',
                children: [
                    {
                        innerHTML: 'Project description:',
                        className: 'flt label'
                    },
                    {
                        ref:       this.setRef('projectDescription'),
                        className: 'flt value'
                    }
                ]
            },
            {
                className: 'flt max-w download-row',
                children: [
                    {
                        innerHTML: 'Remote directory:',
                        className: 'flt label'
                    },
                    {
                        ref:       this.setRef('remoteDirectory'),
                        className: 'flt value'
                    }
                ]
            },
            {
                className: 'flt max-w download-row',
                children: [
                    {
                        innerHTML: 'Actions:',
                        className: 'flt label'
                    }
                ]
            },
            {
                ref:       this.setRef('text'),
                className: 'abs dialog-cw dialog-l ui1-box vscroll pad download-text'
            },
            this.initButtons([
                {
                    ref:      this.setRef('downloadButton'),
                    value:    'Download',
                    tabIndex: 128,
                    onClick:  this.onDownload.bind(this)
                },
                {
                    ref:      this.setRef('closeButton'),
                    value:    'Close',
                    tabIndex: 129,
                    color:    'dark-green',
                    onClick:  this.hide.bind(this)
                }
            ])
        ];
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

exports.DownloadDialog.SHOW_SIGNAL = SHOW_SIGNAL;
