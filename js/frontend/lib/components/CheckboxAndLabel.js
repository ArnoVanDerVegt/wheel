/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../dispatcher').dispatcher;
const Component  = require('./component/Component').Component;
const Checkbox   = require('./input/Checkbox').Checkbox;

exports.CheckboxAndLabel = class extends Component {
    constructor(opts) {
        opts.baseClassName = 'checkbox-and-label';
        super(opts);
        this._text     = opts.text;
        this._checked  = !!opts.checked;
        this._onChange = opts.onChange;
        this.initDOM(opts.parentNode);
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                id:        this.setElement.bind(this),
                style:     this.applyStyle({}, this._style),
                className: this.getClassName(),
                children: [
                    {
                        type:     Checkbox,
                        ui:       this._ui,
                        ref:      this.setRef('checkbox'),
                        checked:  this._checked,
                        onChange: (value) => {
                            this._checked = value;
                            this._onChange && this._onChange(value);
                        }
                    },
                    {
                        className: 'label',
                        ref:       this.setRef('text'),
                        innerHTML: this._text
                    }
                ]
            }
        );
    }

    setDisabled(disabled) {
        super.setDisabled(disabled);
        this._refs.checkbox.setDisabled(disabled);
    }

    getValue() {
        return this._checked;
    }

    onEvent(opts) {
        let element = this._element;
        let refs    = this._refs;
        if ('text' in opts) {
            this._text          = opts.text;
            refs.text.innerHTML = opts.text;
        }
        if ('checked' in opts) {
            this._checked = opts.checked;
            refs.checkbox.setChecked(this._checked);
        }
        super.onEvent(opts);
        this.applyStyle(element.style, this._style);
    }
};

exports.Component = exports.CheckboxAndLabel;
