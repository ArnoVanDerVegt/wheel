/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const DOMNode    = require('../../../../lib/dom').DOMNode;
const dispatcher = require('../../../../lib/dispatcher').dispatcher;
const Checkbox   = require('../../../../lib/components/Checkbox').Checkbox;

exports.CheckboxSetting = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._updateFunctions = opts.updateFunctions;
        this._ui              = opts.ui;
        this._uiId            = opts.uiId;
        this._settings        = opts.settings;
        this._tabIndex        = opts.tabIndex;
        this._getter          = opts.getter;
        this._signal          = opts.signal;
        this._label           = opts.label;
        this._onChange        = opts.onChange;
        this.initDOM(opts.parentNode);
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                className: 'flt checkbox-setting',
                children: [
                    {
                        ref: this.setRef('checkbox'),
                        id:  (element) => {
                            this._updateFunctions.push(() => {
                                element.setValue(!!this._settings[this._getter]());
                            });
                        },
                        type:     Checkbox,
                        ui:       this._ui,
                        uiId:     this._uiId,
                        tabIndex: this._tabIndex,
                        onChange: (value) => {
                            dispatcher.dispatch(this._signal, value);
                            this._onChange && this._onChange(value);
                        }
                    },
                    {
                        className: 'label',
                        innerHTML: this._label
                    }
                ]
            }
        );
    }

    getChecked() {
        return this._refs.checkbox.getValue();
    }

    setChecked(checked) {
        this._refs.checkbox.setValue(checked);
    }
};
