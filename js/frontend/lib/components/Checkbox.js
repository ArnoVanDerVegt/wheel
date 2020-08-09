/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../dispatcher').dispatcher;
const Component  = require('./Component').Component;

exports.Checkbox = class extends Component {
    constructor(opts) {
        super(opts);
        this._checked       = !!opts.checked;
        this._onChange      = opts.onChange;
        this._baseClassName = 'checkbox';
        this.initDOM(opts.parentNode);
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                id:        this.setElement.bind(this),
                type:      'a',
                href:      '#',
                tabIndex:  this._tabIndex,
                className: this.getClassName(),
                children: [
                    {
                        type: 'span'
                    }
                ]
            }
        );
    }

    getChecked() {
        return this._checked;
    }

    setChecked(checked) {
        this._checked           = checked;
        this._element.className = this.getClassName();
    }

    getValue() {
        return this.getChecked();
    }

    setValue(checked) {
        this.setChecked(checked);
    }

    setDisabled(disabled) {
        this._disabled = disabled;
        let element = this._element;
        element.className = this.getClassName();
        element.tabIndex  = disabled ? -1 : this._tabIndex;
    }

    onGlobalUIId() {
        this._element.tabIndex = (this._uiId === this._ui.getActiveUIId()) ? this._tabIndex : -1;
    }

    onClick(event) {
        this.onCancelEvent(event);
        this._checked = !this._checked;
        this._element.focus();
        (typeof this._onChange === 'function') && this._onChange(this._checked ? 1 : 0);
        this._element.className = this.getClassName();
    }

    focus() {
        this._element.focus();
    }
};
