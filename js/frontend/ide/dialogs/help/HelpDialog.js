/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher      = require('../../../lib/dispatcher').dispatcher;
const Dialog          = require('../../../lib/components/Dialog').Dialog;
const Button          = require('../../../lib/components/Button').Button;
const getDataProvider = require('../../../lib/dataprovider/dataProvider').getDataProvider;
const path            = require('../../../lib/path');
const getHelpData     = require('../../help/helpData').getHelpData;
const setHelp         = require('../../help/helpData').setHelp;
const Woc             = require('../../help/woc/Woc').Woc;
const helpBuilder     = require('../../help/HelpBuilder').helpBuilder;
const HelpBuilderText = require('../../help/HelpBuilderText');
const getImage        = require('../../data/images').getImage;
const WocFileLoader   = require('./components/WocFileLoader').WocFileLoader;

exports.HelpDialog = class extends Dialog {
    constructor(opts) {
        super(opts);
        this._needsRebuild = false;
        this._settings     = opts.settings;
        this._documentPath = '';
        new WocFileLoader().load(function(loadedFiles) { setHelp(new Woc().build(loadedFiles)); });
        this.createWindow(
            'help-dialog',
            'Help',
            [
                {
                    ref:       this.setRef('helpFiles'),
                    className: 'help-files'
                },
                {
                    ref:       this.setRef('helpFile'),
                    className: 'help-file',
                    children: [
                        {
                            ref:       this.setRef('helpFileSubjects'),
                            className: 'help-file-subjects'
                        },
                        {
                            ref:       this.setRef('helpFileContent'),
                            className: 'help-file-content'
                        }
                    ]
                },
                {
                    className: 'buttons',
                    children: [
                        this.addButton({
                            ref:      this.setRef('closeButton'),
                            tabIndex: 1024,
                            value:    'Index',
                            onClick:  this.onClickIndex.bind(this)
                        }),
                        this.addButton({
                            ref:      this.setRef('closeButton'),
                            tabIndex: 1025,
                            value:    'Close',
                            color:   'dark-green',
                            onClick:  this.hide.bind(this)
                        }),
                        ('electron' in window) ?
                            this.addButton({
                                tabIndex:  1026,
                                value:     'Rebuild',
                                color:     'blue',
                                onClick:   this.onRebuild.bind(this)
                            }) :
                            null
                    ]
                }
            ]
        );
        dispatcher.on('Dialog.Help.Show',    this, this.onShow);
        dispatcher.on('Dialog.Help.Rebuild', this, this.onRebuild);
    }

    setHelpIndexElement(element) {
        this._helpIndexElement = element;
        element.addEventListener('click', this.onClickIndex.bind(this));
    }

    onClickIndex() {
        let refs = this._refs;
        refs.helpFile.style.display    = 'none';
        refs.helpFiles.style.display   = 'block';
        refs.helpFiles.innerHTML       = '';
        refs.helpFileContent.scrollTop = 0;
        helpBuilder.buildMainIndex(this, refs.helpFiles, getHelpData(), this._documentPath);
    }

    onRebuild() {
        new WocFileLoader().load(function(loadedFiles) { setHelp(new Woc().build(loadedFiles)); });
    }

    onGenerateAllHelp() {
        let helpBuilderText = new HelpBuilderText.HelpBuilderText({});
        let files           = getHelpData().files;
        let fileIndex       = 0;
        let getTemplateFile = function(file, lines, className) {
                return [
                    '<!doctype html>',
                    '<html>',
                    '<head>',
                    '    <meta charset="utf-8"/>',
                    '    <title>Wheel - ' + file.subject + '</title>',
                    '    <meta name="description" content="' + file.subject + '"/>',
                    '    <link rel="shortcut icon" href="../../favicon.ico" type="image/x-icon">',
                    '    <link rel="icon" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAABhlBMVEUAVH8ASXAABwsAAAAAeLYAcbP///8Apf4FWuEDeOwGVt4AovYEaOAFYOMBlvgEbegAoPwCiPIDdOoChfECgO8Dfe4Ci/MDg/AEcekBnfoBmvkBjvUDaOUFZeT9/f3y8vKfn5+ampoWMVIBkfYAn/QAmPIBkPABiuwCgOkDcuRWW2D5+fkAnPXw8PAAk/Ds7OwChuwCe+gCeOcDbeLh4eEDcOHd3d3KysrGxsaoqKgBU5CLi4uJiYl3eXt0dHRmZmZZXWI7T1w2SlwJNFxYWVlHUFgYPFgUOVQDZdoEWdEAarIBYK8CV6sCQYkEQ3cEL3EGQWMpOEkAlfEBje4Cg+oCduUEYdwEV9YETLwAcrQCTqgDQqICTKECVIIBTH1laWtmaGtWXGA2TV06SFs2R1s9SVg4SFI4QlAfPE8gM0wAlOkAjuUAi+QEZeQBg+IAjNkBcs4AgMwCZckBb8YDXr8AbaoBXKQDPpgCQ4oCOXkDOHIFOGIFMl8XRV4GKFsMKlgIJlYpP0yHjd85AAAABnRSTlONeiAA5eUssUaZAAACGElEQVQ4y4WTZ3MaMRCGAdsbSOEA0xLIAXc0HwZsTAfTiwHT3Huv6b3Xf57dg8HyB+Lng6R955E0sxopJlRKxViUqgmFair2cCyxKZVCGbv/H2J4/IL6hq0/QlfNsqC4ETYbavXvMGR21Z+vu5uMMPNIZvey0N06Agj0f2X5pIAJMTMSGhUeErkoAATjOJyywlNiIw8s5y83GhSTsG6XqWLscElnZ5LLAZCq5it7mK6jEOG4JeH0PAXgFHbsHGffEZyA8JdLHBdBYZ7jviYpWWxzQ9qLVBdQmCfBar3mAfe3rSO+4BmJb7ggwW8w7GXxfsHAIDgg9wFnPwkajeZHHFzLGoZlF0SPyu80JKxh2Q+CFGGFiAQA4bJmDYU5UycTACiZblECpGaaI8FYo6JkvAUKgUzHSILPUg6jIPktDH4Jgv2WxeIjYfpN+TAKrtY0Q8sF8e84k7Cq1+vf58BR1zPUsd3ZT3r9Kgpes9ncSWCj0uYRaWo2f2U2e0mw2V4V5FanbUPScquTBzYbCSFR9F3wlDjrTa8oept13J8qFms+UQyhsKLVapuVfDVFz318cnJMzw1VrcwKCh5avAhpi8CSD8mCh4QnA0iIB3GI5hLAV57LIQmzjwfUkny29xebfvj2oHCxPQhnSdAN8OxffdRtZyDc0+meeYYhCe57LPs/e6+Z0o3/E4XxuJUK1aT7wVjck6o7v/8/LSdqSvnu0LoAAAAASUVORK5CYII=" type="image/x-icon" />',
                    '    <link rel="stylesheet" href="../../css/fonts.css"/>',
                    '    <link rel="stylesheet" href="../../css/index.css"/>',
                    '    <link rel="stylesheet" href="../../css/docs.css"/>',
                    '    <link rel="stylesheet" href="../../css/source.css"/>',
                    '</head>',
                    '<body>',
                    '    <div class="header">',
                    '        <div class="header-center">',
                    '            <h2>',
                    '                <a href="../../index.html">',
                    '                    <img src="../../assets/images/logos/wheelSite.svg" width="40"/>',
                    '                    <span>Wheel IDE</span>',
                    '                </a>',
                    '            </h2>',
                    '            <a href="../ide/ide.html" class="start">Online demo &raquo;</a>',
                    '            <ul>',
                    '                <li><a href="index.html">Documentation</a></li>',
                    '                <li><a href="../source.html">Source</a></li>',
                    '                <li><a href="../screenshots.html">Screenshots</a></li>',
                    '                <li><a href="../install.html">Install</a></li>',
                    '            </ul>',
                    '        </div>',
                    '    </div>',
                    '    <div class="content-center"><div class="' + className + '">',
                    '    ' + lines,
                    '    </div></div>',
                    '</body>',
                    '</html>'
                ].join('\n');
            };
        let processFile     = function() {
                if (fileIndex >= files.length) {
                    return;
                }
                let file     = files[fileIndex];
                let filename = HelpBuilderText.getFilename(file.subject);
                fileIndex++;
                getDataProvider().getData(
                    'post',
                    'ide/file-save',
                    {
                        filename: 'site/docs/' + filename,
                        data:     getTemplateFile(file, helpBuilderText.buildFile({file: file}).join('\n    '), 'help-file')
                    },
                    processFile
                );
            };
        getDataProvider().getData(
            'post',
            'ide/file-save',
            {
                filename: 'site/docs/index.html',
                data:     getTemplateFile(
                    {
                        subject: 'Documentation'
                    },
                    helpBuilderText.buildMainIndex(getHelpData(), this._documentPath).join('\n    '),
                    'help-files'
                )
            },
            processFile
        );
    }

    onShowFileIndex(fileIndex) {
        let refs = this._refs;
        refs.helpFiles.style.display   = 'none';
        refs.helpFile.style.display    = 'block';
        refs.helpFileContent.innerHTML = '';
        refs.helpFileContent.scrollTop = 0;
        helpBuilder.buildFile({
            ui:           this._ui,
            uiId:         this._uiId,
            dialog:       this,
            documentPath: this._documentPath,
            parentNode:   refs.helpFileContent,
            file:         getHelpData().files[fileIndex]
        });
        refs.helpFileSubjects.innerHTML = '';
        helpBuilder.buildFileIndex({
            ui:           this._ui,
            uiId:         this._uiId,
            dialog:       this,
            documentPath: this._documentPath,
            parentNode:   refs.helpFileSubjects,
            container:    refs.helpFileContent,
            file:         getHelpData().files[fileIndex]
        });
    }

    onShow(opts) {
        this.onGenerateAllHelp();
        this._documentPath = this._settings.getDocumentPath();
        this.show();
        if (opts && ('fileIndex' in opts)) {
            this.onShowFileIndex(opts.fileIndex);
        } else {
            this.onClickIndex();
        }
        this._refs.closeButton.focus();
    }
};
