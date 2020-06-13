/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher    = require('../../../lib/dispatcher').dispatcher;
const DOMNode       = require('../../../lib/dom').DOMNode;
const path          = require('../../../lib/path');
const Dialog        = require('../../../lib/components/Dialog').Dialog;
const SourceBuilder = require('../../editor/editors/form/SourceBuilder');
const IncludeFiles  = require('./components/IncludeFiles').IncludeFiles;

exports.FileNewDialog = class extends Dialog {
    constructor(opts) {
        super(opts);
        this._ui         = opts.ui;
        this._formWidth  = 400;
        this._formHeight = 320;
        this.createWindow(
            'file-new-dialog',
            'Confirm',
            [
                {
                    className: 'new-file-text',
                    children: [
                        {
                            className: 'file-new-row',
                            children: [
                                {
                                    className: 'form-label',
                                    innerHTML: 'Filename'
                                },
                                this.addTextInput({
                                    ref:      this.setRef('filename'),
                                    tabIndex: 1,
                                    onKeyUp:  this.onFilenameKeyUp.bind(this)
                                })
                            ]
                        },
                        {
                            ref:       this.setRef('descriptionRow'),
                            className: 'file-new-row',
                            children: [
                                {
                                    className: 'form-label',
                                    innerHTML: 'Description'
                                },
                                this.addTextInput({
                                    ref:       this.setRef('description'),
                                    tabIndex:  2,
                                    className: 'description',
                                    onKeyUp:   this.onDescriptionKeyUp.bind(this)
                                })
                            ]
                        },
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
                    id:   this.setIncludeFilesElement.bind(this),
                    type: IncludeFiles,
                    ui:   this._ui,
                    uiId: this._uiId
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
            ]
        );
        dispatcher
            .on('Dialog.File.New.Show', this, this.onShow)
            .on('OnSetFormSize',        this, this.onUpdateFormSize);
    }

    addIncludes(file, includeFiles) {
        for (let i = 0; i < includeFiles.length; i++) {
            file.push('#include "' + includeFiles[i] + '"');
        }
    }

    addProject(filename) {
        if (path.getExtension(filename) !== '.whlp') {
            filename += '.whlp';
        }
        let file            = ['#project "' + this._description + '"', ''];
        let includeFiles    = this._includeFilesElement.getIncludeFiles();
        let createForm      = this._refs.createForm.getChecked();
        let pathAndFilename = path.getPathAndFilename(filename);
        let formFilename;
        let formName;
        if (createForm) {
            formFilename = path.replaceExtension(path.getPathAndFilename(filename).filename, '.wfrm');
            formName     = path.replaceExtension(formFilename, '');
            if (includeFiles.indexOf('lib/standard.whl') === -1) {
                includeFiles.push('lib/standard.whl');
            }
            includeFiles.push('lib/components/form.whl');
        }
        this.addIncludes(file, includeFiles);
        if (createForm) {
            file.push('');
            file.push.apply(file, SourceBuilder.getFormCode(formFilename));
            file.push(
                'proc main()',
                '    ' + SourceBuilder.getShowProcNameFromFormName(formName) + '()',
                '    halt()',
                'end'
            );
        } else {
            if (includeFiles.length) {
                file.push('');
            }
            file.push(
                'proc main()',
                'end'
            );
        }
        dispatcher.dispatch(
            'Create.File',
            {
                filename: filename,
                value:    file.join('\n')
            }
        );
        if (createForm) {
            dispatcher.dispatch(
                'Create.Form',
                {
                    filename: path.replaceExtension(filename, '.wfrm'),
                    width:    this._formWidth,
                    height:   this._formHeight
                }
            );
        }
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
        let refs        = this._refs;
        let projectType = (type === 'project');
        this._type                        = type;
        this._activeDirectory             = activeDirectory;
        this._dialogElement.className     = 'dialog-background file-new-dialog ' + type.toLowerCase();
        refs.descriptionRow.style.display = projectType ? 'block' : 'none';
        refs.createFormRow.style.display  = projectType ? 'block' : 'none';
        refs.title.innerHTML              = 'Create new ' + (projectType ? 'project file' : ' file');
        refs.buttonApply.setValue((type === 'project') ? 'Create project file' : 'Create file');
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
            this.addProject(filename);
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

    validateFilename() {
        let refs = this._refs;
        this._filename = refs.filename.getValue().trim();
        let result = (this._filename !== '');
        if ((this._type === 'project') && (['', '.whlp'].indexOf(path.getExtension(this._filename)) === -1)) {
            result = false;
        }
        if (!result) {
            refs.filename.focus();
            refs.filename.setClassName('invalid');
        }
        return result;
    }

    validateDescription() {
        let refs = this._refs;
        this._description = refs.description.getValue().trim();
        let result = (this._description !== '') && (this._description.indexOf('"') === -1);
        if (!result) {
            refs.description.focus();
            refs.description.setClassName('description invalid');
        }
        return result;
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
