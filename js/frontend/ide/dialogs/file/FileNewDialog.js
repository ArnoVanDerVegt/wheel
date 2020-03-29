/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher   = require('../../../lib/dispatcher').dispatcher;
const DOMNode      = require('../../../lib/dom').DOMNode;
const path         = require('../../../lib/path');
const Dialog       = require('../../../lib/components/Dialog').Dialog;
const IncludeFiles = require('./components/IncludeFiles').IncludeFiles;

exports.FileNewDialog = class extends Dialog {
    constructor(opts) {
        super(opts);
        this._ui = opts.ui;
        this.createWindow(
            'file-new-dialog',
            'Confirm',
            [
                {
                    className: 'new-file-text project',
                    children: [
                        {
                            className: 'file-new-row',
                            children: [
                                {
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
                            className: 'file-new-row',
                            children: [
                                {
                                    innerHTML: 'Description'
                                },
                                this.addTextInput({
                                    ref:       this.setRef('description'),
                                    tabIndex:  2,
                                    className: 'description',
                                    onKeyUp:   this.onDescriptionKeyUp.bind(this)
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
        dispatcher.on('Dialog.File.New.Show', this, this.onShow);
    }

    onShow(type, activeDirectory) {
        let refs = this._refs;
        type                          = type || 'file';
        this._type                    = type;
        this._activeDirectory         = activeDirectory;
        this._dialogElement.className = 'dialog-background file-new-dialog ' + type.toLowerCase();
        refs.title.innerHTML          = 'Create new ' + type.toLowerCase() + ' file';
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

    onApply() {
        if (!this.validate()) {
            return;
        }
        let filename = (this._activeDirectory ? this._activeDirectory + '/' : '') + this._filename;
        if (this._type === 'Project') {
            if (path.getExtension(filename) !== '.whlp') {
                filename += '.whlp';
            }
            dispatcher.dispatch('Create.Project', filename, this._description, this._includeFilesElement.getIncludeFiles());
        } else {
            if (path.getExtension(filename) !== '.whl') {
                filename += '.whl';
            }
            dispatcher.dispatch('Create.File', filename, this._includeFilesElement.getIncludeFiles());
        }
        this.hide();
    }

    onFilenameKeyUp(event) {
        if ((event.keyCode === 13) && this.validateFilename()) {
            if (this._type === 'Project') {
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
        if ((this._type === 'Project') && (['', '.whlp'].indexOf(path.getExtension(this._filename)) === -1)) {
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
        if (result && (this._type === 'Project')) {
            result = this.validateDescription();
        }
        return result;
    }

    setIncludeFilesElement(element) {
        this._includeFilesElement = element;
    }
};
