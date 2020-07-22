/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../dispatcher').dispatcher;
const DOMNode    = require('../dom').DOMNode;
const Component  = require('./Component').Component;

class RadioOption extends DOMNode {
    constructor(opts) {
        super(opts);
        this._focus    = false;
        this._option   = opts.option;
        this._radio    = opts.radio;
        this._tabIndex = opts.tabIndex;
        this._onChange = opts.onChange;
        this.initDOM(opts.parentNode);
        opts.radio.addRadioElement(this);
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
                        type:      'span',
                        className: 'dot',
                        children: [
                            {
                                type:      'span',
                                className: 'dot'
                            }
                        ]
                    },
                    {
                        type:      'span',
                        className: 'title',
                        innerHTML: this._option.title
                    }
                ]
            }
        );
    }

    onFocus(event) {
        this._focus = true;
        this.updateClassName();
    }

    onBlur(event) {
        this._focus = false;
        this.updateClassName();
    }

    onClick(event) {
        this.onCancelEvent(event);
        this._element.focus();
        if (this._focus) {
            this._radio.setValue(this._option.value);
            (typeof this._onChange === 'function') && this._onChange(this._option.value);
        }
    }

    setElement(element) {
        this._element = element;
        element.addEventListener('mousedown', this.onCancelEvent.bind(this));
        element.addEventListener('click',     this.onClick.bind(this));
        element.addEventListener('focus',     this.onFocus.bind(this));
        element.addEventListener('blur',      this.onBlur.bind(this));
    }

    getClassName() {
        return 'radio-option' +
            (this._focus                                   ? ' focus'    : '') +
            (this._option.value === this._radio.getValue() ? ' selected' : '');
    }

    updateClassName() {
        this._element.className = this.getClassName();
    }

    setDisabled(disabled) {
        this._element.tabIndex = disabled ? -1 : this._tabIndex;
    }

    focus() {
        this._element.focus();
    }
}

exports.Radio = class extends Component {
    constructor(opts) {
        opts.baseClassName = 'radio';
        super(opts);
        this._onChange      = opts.onChange;
        this._tabIndex      = opts.tabIndex;
        this._value         = opts.value;
        this._horizontal    = opts.horizontal;
        this._radioElements = [];
        this._options       = this.getOptionsWithTitles(opts.options);
        this.initDOM(opts.parentNode);
    }

    initDOM(parentNode) {
        let children = [];
        this._options.forEach(
            (option, index) => {
                children.push({
                    type:     RadioOption,
                    tabIndex: this._tabIndex + index,
                    radio:    this,
                    onChange: this._onChange,
                    option:   option
                });
            }
        );
        this.create(
            parentNode,
            {
                id:        this.setElement.bind(this),
                className: this.getClassName(),
                style:     this._style,
                children:  children
            }
        );
    }

    getClassName() {
        return super.getClassName() + ' ' + (this._horizontal ? 'horizontal' : 'vertical');
    }

    getOptionsWithTitles(options) {
        let result = [];
        (options || []).forEach((option, index) => {
            if (typeof option === 'string') {
                result.push({value: index, title: option});
            } else {
                result.push(option);
            }
        });
        return result;
    }

    setValue(value) {
        this._value = value;
        this._radioElements.forEach(
            function(radioElement) {
                radioElement.updateClassName();
            }
        );
        return this;
    }

    getValue() {
        return this._value;
    }

    setOptions(options) {
        this._radioElements.length = 0;
        let element    = this._element;
        let childNodes = element.childNodes;
        while (childNodes.length) {
            element.removeChild(childNodes[0]);
        }
        options = this.getOptionsWithTitles(options);
        options.forEach((option, index) => {
            this.create(
                element,
                {
                    type:     RadioOption,
                    tabIndex: this._tabIndex + index,
                    radio:    this,
                    onChange: this._onChange,
                    option:   option
                }
            );
        });
    }

    addRadioElement(element) {
        this._radioElements.push(element);
    }

    onGlobalUIId() {
        let disabled = (this._uiId !== this._ui.getActiveUIId());
        this._radioElements.forEach(
            function(radioElement) {
                radioElement.setDisabled(disabled);
            }
        );
    }

    onEvent(opts) {
        if ('options' in opts) {
            this.setOptions(opts.options);
        }
        if ('horizontal' in opts) {
            this._horizontal        = opts.horizontal;
            this._element.className = this.getClassName();
        }
        super.onEvent(opts);
    }

    focus() {
        this._radioElements[0].focus();
        return this;
    }
};

exports.Component = exports.Radio;
