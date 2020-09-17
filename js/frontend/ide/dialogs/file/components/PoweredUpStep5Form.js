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
            className: 'step-content step4',
            children: [
                {
                    className: 'file-new-row',
                    children: [
                        {
                            className: 'form-label',
                            innerHTML: 'Create a form'
                        },
                        this._dialog.addCheckbox({
                            ref:      this.setRef('createForm'),
                            tabIndex: 1
                        })
                    ]
                },
                this._dialog.initRow({
                    className:      'file-new-row number',
                    labelClassName: 'form-label',
                    label:          'Width',
                    ref:            this.setRef('width'),
                    tabIndex:       2,
                    placeholder:    '',
                    value:          this._width
                }),
                this._dialog.initRow({
                    className:      'file-new-row number',
                    labelClassName: 'form-label',
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
