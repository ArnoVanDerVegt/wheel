/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher   = require('../../../lib/dispatcher').dispatcher;
const DOMNode      = require('../../../lib/dom').DOMNode;
const path         = require('../../../lib/path');
const IncludeFiles = require('../../../lib/components/IncludeFiles').IncludeFiles;
const FileDialog   = require('./FileDialog').FileDialog;

exports.FileNewDialog = class extends FileDialog {
    constructor(opts) {
        super(opts);
        this._formWidth  = 400;
        this._formHeight = 320;
        this.initWindow('file-new-dialog', 'Confirm', this.initWindowContent(opts));
        dispatcher
            .on('Dialog.File.New.Show', this, this.onShow)
            .on('OnSetFormSize',        this, this.onUpdateFormSize);
    }

    initWindowContent(opts) {
        return [
            {
                className: 'new-file-text',
                children: [
                    this.initRow({
                        className:      'file-new-row',
                        labelClassName: 'form-label',
                        label:          'Filename',
                        ref:            this.setRef('filename'),
                        tabIndex:       1,
                        onKeyUp:        this.onFilenameKeyUp.bind(this),
                        placeholder:    'Enter filename'
                    }),
                    this.initRow({
                        rowRef:         this.setRef('descriptionRow'),
                        className:      'file-new-row description',
                        labelClassName: 'form-label',
                        label:          'Description',
                        ref:            this.setRef('description'),
                        tabIndex:       2,
                        onKeyUp:        this.onDescriptionKeyUp.bind(this),
                        placeholder:    'Enter description'
                    }),
                    {
                        ref:       this.setRef('createFormRow'),
                        className: 'file-new-row',
                        children: [
                            {
                                className: 'form-label',
                                innerHTML: 'Create a form'
                            },
                            this.addCheckbox({
                                ref:      this.setRef('createForm'),
                                tabIndex: 3
                            }),
                            this.addButton({
                                ref:      this.setRef('formSizeButton'),
                                tabIndex: 4,
                                value:    'Size: 400x320',
                                color:    'gray',
                                onClick:  this.onClickFormSize.bind(this)
                            })
                        ]
                    }
                ]
            },
            {
                className: 'include-file-label',
                innerHTML: 'Include files'
            },
            {
                type:     IncludeFiles,
                ref:      this.setRef('includeFiles'),
                id:       this.setIncludeFilesElement.bind(this),
                ui:       this._ui,
                uiId:     this._uiId,
                settings: opts.settings
            },
            {
                className: 'buttons',
                children: [
                    this.addButton({
                        ref:      this.setRef('buttonApply'),
                        tabIndex: 128,
                        value:    'Ok',
                        onClick:  this.onApply.bind(this)
                    }),
                    this.addButton({
                        tabIndex: 129,
                        value:    'Cancel',
                        color:    'dark-green',
                        onClick:  this.hide.bind(this)
                    })
                ]
            }
        ];
    }

    addFile(filename) {
        if (path.getExtension(filename) !== '.whl') {
            filename += '.whl';
        }
        let file = [];
        this.addIncludes(file, this._includeFilesElement.getIncludeFiles());
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
        let refs = this._refs;
        this._type                    = type;
        this._activeDirectory         = activeDirectory;
        this._dialogElement.className = 'dialog-background file-new-dialog ' + type.toLowerCase();
        if (type === 'project') {
            refs.title.innerHTML              = 'Create new project file';
            refs.descriptionRow.style.display = 'block';
            refs.createFormRow.style.display  = 'block';
            refs.buttonApply.setValue('Create project file');
        } else {
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
