/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const path            = require('../../../../shared/lib/path');
const platform        = require('../../../../shared/lib/platform');
const dispatcher      = require('../../../lib/dispatcher').dispatcher;
const Dialog          = require('../../../lib/components/Dialog').Dialog;
const Button          = require('../../../lib/components/input/Button').Button;
const getDataProvider = require('../../../lib/dataprovider/dataProvider').getDataProvider;
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
        new WocFileLoader().load((loadedFiles) => { setHelp(new Woc().build(loadedFiles)); });
        this.initWindow({
            width:     960,
            height:    600,
            className: 'help-dialog',
            title:     'Help'
        });
        dispatcher
            .on('Dialog.Help.Show',    this, this.onShow)
            .on('Dialog.Help.Rebuild', this, this.onRebuild);
    }

    initWindowContent(opts) {
        return [
            {
                ref:       this.setRef('helpFiles'),
                className: 'abs ui1-box dialog-l dialog-b dialog-t dialog-r help-files'
            },
            {
                ref:       this.setRef('helpFile'),
                className: 'abs dialog-l dialog-b dialog-r dialog-t help-file',
                children: [
                    {
                        ref:       this.setRef('helpFileSubjects'),
                        className: 'ui1-box help-file-subjects'
                    },
                    {
                        ref:       this.setRef('helpFileContent'),
                        className: 'abs ui1-box help-file-content'
                    }
                ]
            },
            this.initButtons([
                {
                    ref:      this.setRef('closeButton'),
                    tabIndex: 1024,
                    value:    'Index',
                    onClick:  this.onClickIndex.bind(this)
                },
                {
                    ref:      this.setRef('closeButton'),
                    tabIndex: 1025,
                    value:    'Close',
                    color:   'dark-green',
                    onClick:  this.hide.bind(this)
                },
                platform.isElectron() ?
                    {
                        tabIndex:  1026,
                        value:     'Rebuild',
                        color:     'blue',
                        onClick:   this.onRebuild.bind(this)
                    } :
                    null,
                platform.isElectron() ?
                    {
                        ref:       this.setRef('saveTextFilesButton'),
                        tabIndex:  1027,
                        value:     'Save html files',
                        color:     'blue',
                        onClick:   this.onRebuildText.bind(this)
                    } :
                    null
            ])
        ];
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
        let documentPath = this._settings.getDocumentPath();
        helpBuilder.buildMainIndex(this, refs.helpFiles, getHelpData(), documentPath);
    }

    onRebuild() {
        new WocFileLoader().load((loadedFiles) => { setHelp(new Woc().build(loadedFiles)); });
    }

    onRebuildText() {
        let refs            = this._refs;
        let documentPath    = this._settings.getDocumentPath();
        let helpBuilderText = new HelpBuilderText.HelpBuilderText({helpData: getHelpData(), documentPath: documentPath});
        refs.saveTextFilesButton.setDisabled(true);
        helpBuilderText.generateAllHelp(() => {
            refs.saveTextFilesButton.setDisabled(false);
        });
    }

    onShowFileIndex(fileIndex) {
        let refs = this._refs;
        refs.helpFiles.style.display   = 'none';
        refs.helpFile.style.display    = 'block';
        refs.helpFileContent.innerHTML = '';
        refs.helpFileContent.scrollTop = 0;
        let documentPath = this._settings.getDocumentPath();
        helpBuilder.buildFile({
            ui:           this._ui,
            uiId:         this._uiId,
            dialog:       this,
            documentPath: documentPath,
            parentNode:   refs.helpFileContent,
            file:         getHelpData().files[fileIndex]
        });
        refs.helpFileSubjects.innerHTML = '';
        helpBuilder.buildFileIndex({
            ui:           this._ui,
            uiId:         this._uiId,
            dialog:       this,
            documentPath: documentPath,
            parentNode:   refs.helpFileSubjects,
            container:    refs.helpFileContent,
            file:         getHelpData().files[fileIndex]
        });
    }

    onShow(opts) {
        this.show();
        if (opts && ('fileIndex' in opts)) {
            this.onShowFileIndex(opts.fileIndex);
        } else {
            this.onClickIndex();
        }
        this._refs.closeButton.focus();
    }
};
