/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const platform           = require('../../../lib/platform');
const dispatcher         = require('../../../lib/dispatcher').dispatcher;
const path               = require('../../../lib/path');
const Files              = require('../../../lib/components/files/Files').Files;
const Dialog             = require('../../../lib/components/Dialog').Dialog;
const getDataProvider    = require('../../../lib/dataprovider/dataProvider').getDataProvider;
const getImage           = require('../../data/images').getImage;
const sourceBuilderUtils = require('../../source/sourceBuilderUtils');

exports.FileDialog = class extends Dialog {
    initRow(opts) {
        let result = {
                className: opts.className,
                children: [
                    {
                        className: opts.labelClassName || '',
                        innerHTML: opts.label
                    },
                    this.addTextInput({
                        ref:         opts.ref,
                        tabIndex:    opts.tabIndex,
                        onKeyUp:     opts.onKeyUp ? opts.onKeyUp : () => {},
                        placeholder: opts.placeholder || '',
                        value:       opts.value       || ''
                    })
                ]
            };
        if (opts.rowRef) {
            result.ref = opts.rowRef;
        }
        return result;
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

    validateWidth() {
        let result = true;
        let refs   = this._refs;
        this._width = parseInt(refs.width.getValue().trim(), 10);
        if (isNaN(this._width) || (this._width < this._minWidth) || (this._width > this._maxWidth)) {
            refs.width.focus();
            refs.width.setClassName('invalid');
            result = false;
        } else {
            refs.width.setClassName('');
        }
        return result;
    }

    validateHeight() {
        let result = true;
        let refs   = this._refs;
        this._height = parseInt(refs.height.getValue().trim(), 10);
        if (isNaN(this._height) || (this._height < this._minHeight) || (this._height > this._maxHeight)) {
            refs.height.focus();
            refs.height.setClassName('invalid');
            result = false;
        } else {
            refs.height.setClassName('');
        }
        return result;
    }

    addProject(opts) {
        let filename   = opts.filename;
        let createForm = opts.createForm;
        if (path.getExtension(filename) !== '.whlp') {
            filename += '.whlp';
        }
        let lines = sourceBuilderUtils.createProjectFile({
                description:  opts.description,
                includeFiles: opts.includeFiles,
                createForm:   createForm,
                filename:     filename
            });
        dispatcher.dispatch(
            'Create.File',
            {
                filename: filename,
                value:    lines.join('\n')
            }
        );
        if (createForm) {
            dispatcher.dispatch(
                'Create.Form',
                {
                    filename: path.replaceExtension(filename, '.wfrm'),
                    width:    opts.formWidth,
                    height:   opts.formHeight
                }
            );
        }
    }
};
