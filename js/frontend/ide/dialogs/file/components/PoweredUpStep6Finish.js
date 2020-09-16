/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher   = require('../../../../lib/dispatcher').dispatcher;
const DOMNode      = require('../../../../lib/dom').DOMNode;
const Button       = require('../../../../lib/components/Button').Button;
const Dropdown     = require('../../../../lib/components/Dropdown').Dropdown;
const getImage     = require('../../../data/images').getImage;
const Step         = require('./Step').Step;

exports.PoweredUpStep6Finish = class extends Step {
    initContent() {
        return {
            ui:        this._ui,
            uiId:      this._uiId,
            className: 'step-content step6',
            children: [
                this._dialog.initRow({
                    className:      'file-new-row',
                    labelClassName: 'form-label',
                    label:          'Filename',
                    ref:            this.setRef('filename'),
                    tabIndex:       1,
                    placeholder:    'Enter filename'
                }),
                this._dialog.initRow({
                    className:      'file-new-row description',
                    labelClassName: 'form-label',
                    label:          'Description',
                    ref:            this.setRef('description'),
                    tabIndex:       2,
                    placeholder:    'Enter description'
                })
            ]
        };
    }

    reset() {
        let refs = this._refs;
        refs.filename.setValue('');
        refs.description.setValue('');
    }

    validate() {
        let refs = this._refs;
        if (!this._dialog.validateFilename.call(this)) {
            return false;
        } else if (!this._dialog.validateDescription.call(this)) {
            return false;
        }
        return true;
    }
};
