/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const DOMNode    = require('../../../../lib/dom').DOMNode;
const dispatcher = require('../../../../lib/dispatcher').dispatcher;
const TextInput  = require('../../../../lib/components/TextInput').TextInput;

exports.TextInputSetting = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._ui        = opts.ui;
        this._uiId      = opts.uiId;
        this._tabIndex  = opts.tabIndex;
        this._label     = opts.label;
        this._value     = opts.value;
        this._numeric   = opts.numeric;
        this._onChange  = opts.onChange;
        this._validate  = opts.validate;
        this._className = this._numeric ? 'numeric' : '';
        this.initDOM(opts.parentNode);
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                className: 'text-input-setting',
                children: [
                    {
                        className: 'label',
                        innerHTML: this._label
                    },
                    {
                        type:      TextInput,
                        ref:       this.setRef('input'),
                        value:     this._value,
                        numeric:   this._numeric,
                        className: this._className,
                        ui:        this._ui,
                        uiId:      this._uiId,
                        onKeyUp:   this.onChange.bind(this)
                    }
                ]
            }
        );
    }

    onChange() {
        let input = this._refs.input;
        let value = input.getValue();
        if (!this._validate) {
            this._onChange(value);
        } else if (this._validate(value)) {
            input.setClassName(this._className);
            this._onChange(value);
        } else {
            input.setClassName(this._className + ' invalid');
        }
    }
};
