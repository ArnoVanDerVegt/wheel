/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const DOMNode = require('../dom').DOMNode;

exports.IconSelect = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._open         = false;
        this._disabled     = false;
        this._focus        = false;
        this._options      = opts.options;
        this._value        = ('value' in opts) ? opts.value : this._options[0].value;
        this._onChange     = opts.onChange;
        this._tabIndex     = opts.tabIndex;
        this._ui           = opts.ui;
        this._onGlobalUIId = this._ui.addEventListener('Global.UIId', this, this.onGlobalUIId);
        this.initDOM(opts.parentNode);
        (typeof opts.id === 'function') && opts.id(this);
    }

    remove() {
        this._onGlobalUIId();
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
                        className: 'selected',
                        children: [
                            {
                                id:   this.setSelectedElement.bind(this),
                                type: 'img'
                            }
                        ]
                    },
                    {
                        id:        this.setOptionsElement.bind(this),
                        className: 'options',
                        children:  this.getOptionElements()
                    }
                ]
            }
        );
    }

    onGlobalUIId() {
        this._element.tabIndex = (this._uiId === this._ui.getActiveUIId()) ? this._tabIndex : -1;
    }

    onFocus() {
        this._focus             = true;
        this._element.className = this.getClassName();
    }

    onBlur() {
        this._focus             = false;
        this._open              = false;
        this._element.className = this.getClassName();
    }

    onClick(event) {
        this.onCancelEvent(event);
        if (!this._focus) {
            this._element.focus();
        }
        this._open              = !this._open;
        this._focus             = true;
        this._element.className = this.getClassName();
    }

    onClickOption(index) {
        if (this._options[index].value === this._value) {
            return;
        }
        let option = this._options[index];
        this._value               = option.value;
        this._selectedElement.src = option.icon;
        this._onChange && this._onChange(this._value);
    }

    getValue() {
       return this._value;
    }

    setValue(value) {
        this._options.forEach(
            function(option) {
                if ((option.value === value) && (option.value !== this._value)) {
                    this._selectedElement.src = option.icon;
                    this._value               = option.value;
                    this._onChange && this._onChange(this._value);
                }
            },
            this
        );
    }

    setDisabled(disabled) {
        this._disabled = disabled;
        let element = this._element;
        element.className = this.getClassName();
        element.tabIndex  = disabled ? -1 : this._tabIndex;
    }

    getClassName() {
        return 'icon-select' +
            (this._disabled ? ' disabled' : '') +
            (this._focus    ? ' focus'    : '') +
            (this._open     ? ' open'     : '');
    }

    getElement() {
        return this._element;
    }

    setElement(element) {
        element.addEventListener('mousedown', this.onCancelEvent.bind(this));
        element.addEventListener('click',     this.onClick.bind(this));
        element.addEventListener('focus',     this.onFocus.bind(this));
        element.addEventListener('blur',      this.onBlur.bind(this));
        this._element = element;
    }

    setSelectedElement(element) {
        this._selectedElement = element;
        this._options.forEach(
            function(option) {
                if (option.value === this._value) {
                    element.src = option.icon;
                }
            },
            this
        );
    }

    setOptionsElement(element) {
        let height = this._options.length * 18 + 1;

        this._optionsElement              = element;
        this._optionsElement.style.top    = '-' + height + 'px';
        this._optionsElement.style.height = height + 'px';
    }

    getOptionElements() {
        let elements = [];
        this._options.forEach(
            function(option, index) {
                elements.push({
                    className: 'option',
                    children: [
                        {
                            id: (function(element) {
                                element.addEventListener('click', this.onClickOption.bind(this, index));
                            }).bind(this),
                            type: 'img',
                            src:  option.icon
                        }
                    ]
                });
            },
            this
        );
        return elements;
    }
};
