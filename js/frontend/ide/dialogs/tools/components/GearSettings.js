/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const DOMNode    = require('../../../../lib/dom').DOMNode;
const Dropdown   = require('../../../../lib/components/input/Dropdown').Dropdown;
const Button     = require('../../../../lib/components/input/Button').Button;
const getImage   = require('../../../data/images').getImage;

exports.GearSettings = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._gears       = opts.gears;
        this._gearByValue = opts.gearByValue;
        this._ui          = opts.ui;
        this._uiId        = opts.uiId;
        this._onAdd       = opts.onAdd;
        this._onUpdate    = opts.onUpdate;
        this._from        = this.getFromGears()[0].value;
        this._to          = this.getToGears()[0].value;
        this.initDOM(opts.parentNode);
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                className: 'abs dialog-l gear-settings',
                children: [
                    {
                        type:      Dropdown,
                        ref:       this.setRef('fromGear'),
                        ui:        this._ui,
                        uiId:      this._uiId,
                        tabIndex:  256,
                        images:    true,
                        getImage:  getImage,
                        items:     this.getFromGears(),
                        onChange:  this.onChangeFrom.bind(this)
                    },
                    {
                        type:      Dropdown,
                        ref:       this.setRef('toGear'),
                        ui:        this._ui,
                        uiId:      this._uiId,
                        tabIndex:  257,
                        images:    true,
                        getImage:  getImage,
                        items:     this.getToGears(),
                        onChange:  this.onChangeTo.bind(this)
                    },
                    {
                        type:      Button,
                        ref:       this.setRef('updateButton'),
                        ui:        this._ui,
                        uiId:      this._uiId,
                        tabIndex:  258,
                        value:     'Update',
                        color:     'blue',
                        disabled:  true,
                        onClick:   this.onUpdate.bind(this)
                    },
                    {
                        type:      Button,
                        ui:        this._ui,
                        uiId:      this._uiId,
                        tabIndex:  259,
                        value:     'Add',
                        color:     'blue',
                        onClick:   this.onAdd.bind(this)
                    }
                ]
            }
        );
    }

    getFromGears() {
        return JSON.parse(JSON.stringify(this._gears));
    }

    getToGears() {
        let gears = JSON.parse(JSON.stringify(this._gears));
        gears.splice(0, 1);
        return gears;
    }

    setValues(opts) {
        let refs = this._refs;
        if (opts) {
            refs.fromGear.setValue(opts.from.value);
            refs.toGear.setValue(opts.to.value);
        }
        refs.updateButton.setDisabled(!opts);
    }

    onChangeFrom(value) {
        this._from = value;
    }

    onChangeTo(value) {
        this._to = value;
    }

    onAdd() {
        this._onAdd({
            from: this._gearByValue[this._from],
            to:   this._gearByValue[this._to]
        });
        this._refs.updateButton.setDisabled(false);
    }

    onUpdate() {
        this._onUpdate({
            from: this._gearByValue[this._from],
            to:   this._gearByValue[this._to]
        });
    }
};
