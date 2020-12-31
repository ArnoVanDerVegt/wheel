/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const path         = require('../../../../shared/lib/path');
const dispatcher   = require('../../../lib/dispatcher').dispatcher;
const DOMNode      = require('../../../lib/dom').DOMNode;
const IncludeFiles = require('../../../lib/components/IncludeFiles').IncludeFiles;
const FileDialog   = require('./FileDialog').FileDialog;

exports.FileNewDialog = class extends FileDialog {
    constructor(opts) {
        super(opts);
        this._formWidth  = 400;
        this._formHeight = 320;
        this.initWindow({
            width:     700,
            height:    464,
            className: 'file-new-dialog',
            title:     'Confirm'
        });
        dispatcher
            .on('Dialog.File.New.Show', this, this.onShow)
            .on('OnSetFormSize',        this, this.onUpdateFormSize);
    }

    initWindowContent(opts) {
        return [
            {
                className: 'abs dialog-cw dialog-lt new-file-text',
                children: [
                    this.initTextInputRow({
                        className:      'flt max-w input-row filename file-new-row',
                        labelClassName: 'flt input-label',
                        label:          'Filename',
                        ref:            this.setRef('filename'),
                        tabIndex:       1,
                        onKeyUp:        this.onFilenameKeyUp.bind(this),
                        placeholder:    'Enter filename'
                    }),
                    this.initTextInputRow({
                        rowRef:         this.setRef('descriptionRow'),
                        className:      'flt max-w input-row description file-new-row',
                        labelClassName: 'flt input-label',
                        label:          'Description',
                        ref:            this.setRef('description'),
                        tabIndex:       2,
                        onKeyUp:        this.onDescriptionKeyUp.bind(this),
                        placeholder:    'Enter description'
                    }),
                    this.initCheckboxRow({
                        rowRef:         this.setRef('createFormRow'),
                        className:      'flt max-w input-row file-new-row',
                        labelClassName: 'flt input-label',
                        label:          'Create a form',
                        ref:            this.setRef('createForm'),
                        tabIndex:       3,
                        extra:          this.addButton({
                            ref:      this.setRef('formSizeButton'),
                            tabIndex: 4,
                            value:    'Size: 400x320',
                            color:    'gray',
                            onClick:  this.onClickFormSize.bind(this)
                        })
                    })
                ]
            },
            {
                className: 'abs dialog-l include-file-label',
                innerHTML: 'Include files'
            },
            {
                type:     IncludeFiles,
                ref:      this.setRef('includeFiles'),
                id:       this.setIncludeFilesElement.bind(this),
                ui:       this._ui,
                uiId:     this._uiId,
                settings: this._settings
            },
            this.initButtons([
                {
                    ref:      this.setRef('buttonApply'),
                    tabIndex: 128,
                    value:    'Ok',
                    onClick:  this.onApply.bind(this)
                },
                {
                    tabIndex: 129,
                    value:    'Cancel',
                    color:    'dark-green',
                    onClick:  this.hide.bind(this)
                }
            ])
        ];
    }

    addFile(filename) {
        if (path.getExtension(filename) !== '.whl') {
            filename += '.whl';
        }
        let file         = [];
        let includeFiles = this._includeFilesElement.getIncludeFiles();
        includeFiles.forEach((includeFile) => {
            file.push('#include "' + includeFile + '"');
        });
        dispatcher.dispatch(
            'Create.File',
            {
                filename: filename,
                value:    file.join('\n')
            }
        );
    }

    onShow(type, activeDirectory) {
        type = (type || 'file').toLowerCase();
        let refs           = this._refs;
        let contentElement = this._dialogNode.querySelector('.dialog-content');
        this._type                    = type;
        this._activeDirectory         = activeDirectory;
        this._dialogElement.className = 'dialog-background file-new-dialog ' + type.toLowerCase();
        if (type === 'project') {
            this._expectedExtensions          = ['', '.whlp'];
            contentElement.style.marginTop    = '-272px';
            contentElement.style.height       = '544px';
            refs.title.innerHTML              = 'Create new project file';
            refs.descriptionRow.style.display = 'block';
            refs.createFormRow.style.display  = 'block';
            refs.buttonApply.setValue('Create project file');
        } else {
            this._expectedExtensions          = ['', '.whl'];
            contentElement.style.marginTop    = '-232px';
            contentElement.style.height       = '464px';
            refs.title.innerHTML              = 'Create new file';
            refs.descriptionRow.style.display = 'none';
            refs.createFormRow.style.display  = 'none';
            refs.buttonApply.setValue('Create file');
        }
        refs.includeFiles.update();
        super.show();
        this._includeFilesElement.reset();
        refs.description
            .setValue('')
            .setClassName('description');
        refs.filename
            .setValue('')
            .setClassName('')
            .focus();
    }

    onClickFormSize() {
        dispatcher.dispatch('Dialog.Form.SetSize', this._formWidth, this._formHeight);
    }

    onUpdateFormSize(width, height) {
        this._formWidth  = width;
        this._formHeight = height;
        this._refs.formSizeButton.setValue('Size: ' + width + 'x' + height);
    }

    onApply() {
        if (!this.validate()) {
            return;
        }
        let value    = '';
        let file;
        let filename = (this._activeDirectory ? this._activeDirectory + '/' : '') + this._filename;
        if (this._type === 'project') {
            this.addProject({
                filename:     filename,
                createForm:   this._refs.createForm.getChecked(),
                description:  this._description,
                includeFiles: this._includeFilesElement.getIncludeFiles(),
                formWidth:    this._formWidth,
                formHeight:   this._formHeight
            });
        } else {
            this.addFile(filename);
        }
        this.hide();
    }

    onFilenameKeyUp(event) {
        if ((event.keyCode === 13) && this.validateFilename()) {
            if (this._type === 'project') {
                this._refs.description.focus();
            } else {
                this.onApply();
            }
        }
    }

    onDescriptionKeyUp(event) {
        if ((event.keyCode === 13) && this.validateDescription()) {
            this.onApply();
        }
    }

    validate() {
        let result = this.validateFilename();
        if (result && (this._type === 'project')) {
            result = this.validateDescription();
        }
        return result;
    }

    setIncludeFilesElement(element) {
        this._includeFilesElement = element;
    }
};
