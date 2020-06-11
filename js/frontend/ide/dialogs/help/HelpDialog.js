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
                            null,
                        ('electron' in window) ?
                            this.addButton({
                                ref:       this.setRef('saveTextFilesButton'),
                                tabIndex:  1027,
                                value:     'Save text files',
                                color:     'blue',
                                onClick:   this.onRebuildText.bind(this)
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

    onRebuildText() {
        let refs            = this._refs;
        let helpBuilderText = new HelpBuilderText.HelpBuilderText({helpData: getHelpData()});
        refs.saveTextFilesButton.setDisabled(true);
        helpBuilderText.generateAllHelp(function() {
            refs.saveTextFilesButton.setDisabled(false);
        });
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
