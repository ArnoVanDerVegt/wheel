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

const INITIAL_WIDTH  = 400;
const INITIAL_HEIGHT = 320;

exports.PoweredUpStep5Form = class extends Step {
    constructor(opts) {
        super(opts);
        this._createForm = false;
        this.reset();
    }

    initContent() {
        return {
            ui:        this._ui,
            uiId:      this._uiId,
            className: 'abs dialog-cw dialog-l dialog-b step-content step5',
            children: [
                {
                    className: 'flt dialog-cw input-row file-new-row',
                    children: [
                        {
                            className: 'flt input-label',
                            innerHTML: 'Create a form'
                        },
                        this._dialog.addCheckbox({
                            ref:      this.setRef('createForm'),
                            tabIndex: 1
                        })
                    ]
                },
                this._dialog.initTextInputRow({
                    className:      'flt max-w input-row file-new-row number',
                    labelClassName: 'flt input-label',
                    label:          'Width',
                    ref:            this.setRef('width'),
                    tabIndex:       2,
                    placeholder:    '',
                    value:          this._width
                }),
                this._dialog.initTextInputRow({
                    className:      'flt max-w input-row file-new-row number',
                    labelClassName: 'flt input-label',
                    label:          'Height',
                    ref:            this.setRef('height'),
                    tabIndex:       3,
                    placeholder:    '',
                    value:          this._height
                })
            ]
        };
    }

    reset() {
        this._width  = INITIAL_WIDTH;
        this._height = INITIAL_HEIGHT;
        let refs = this._refs;
        refs.createForm.setValue(false);
        refs.width.setValue(this._width);
        refs.height.setValue(this._height);
    }

    validate() {
        let refs = this._refs;
        if (!refs.createForm.getValue()) {
            this._createForm = false;
            return true;
        }
        this._createForm = true;
        if (!this._dialog.validateWidth.call(this)) {
            return false;
        } else if (!this._dialog.validateHeight.call(this)) {
            return false;
        }
        return true;
    }

    getCreateForm() {
        return this._refs.createForm.getValue();
    }

    getFormWidth() {
        return this._refs.width.getValue();
    }

    getFormHeight() {
        return this._refs.height.getValue();
    }
};
