/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../../dispatcher').dispatcher;
const DOMNode    = require('../../dom').DOMNode;
const Component  = require('../component/Component').Component;

const ListItem = class extends DOMNode {
        constructor(opts) {
            super(opts);
            this._getImage = opts.getImage;
            this._title    = opts.title;
            this._subTitle = opts.subTitle;
            this._value    = opts.value;
            this._image    = opts.image;
            this._color    = opts.color;
            this._dropdown = opts.dropdown;
            this._dropdown.addItem(this);
            this.initDOM(opts.parentNode);
        }

        initDOM(parentNode) {
            if (this._dropdown.getImages()) {
                let style = {};
                if (this._color) {
                    style.backgroundColor = this._color;
                }
                this.create(
                    parentNode,
                    {
                        id:        this.setElement.bind(this),
                        className: 'flt max-w dropdown-list-item',
                        children: [
                            {
                                className: 'flt dropdown-img-wrapper',
                                style:     style,
                                children: [
                                    {
                                        type:      'img',
                                        className: 'no-select',
                                        src:       this._image ? this._getImage(this._image) : '',
                                        style: {
                                            display: this._image ? 'block' : 'none'
                                        }
                                    }
                                ]
                            },
                            {
                                className: 'no-select flt dropdown-title',
                                innerHTML: this._title
                            },
                            {
                                className: 'no-select flt dropdown-sub-title',
                                innerHTML: this._subTitle
                            }
                        ]
                    }
                );
            } else {
                this.create(
                    parentNode,
                    {
                        id:        this.setElement.bind(this),
                        className: 'no-select flt max-w dropdown-list-item',
                        innerHTML: this._title
                    }
                );
            }
        }

        setSelected(selected) {
            this._element.className = 'flt max-w dropdown-list-item' + (selected ? ' selected' : '');
        }

        setElement(element) {
            element.addEventListener('mousedown', this.onMouseDown.bind(this));
            this._element = element;
        }

        onMouseDown(event) {
            this.onCancelEvent(event);
            this._dropdown
                .setValueAndChange(this._value)
                .dispatchValue();
            setTimeout(this._dropdown.close.bind(this._dropdown), 500);
        }
    };

exports.Dropdown = class extends Component {
    constructor(opts) {
        opts.baseClassName = 'dropdown' + (opts.images ? ' images' : '') + (opts.up ? ' up' : ' down');
        super(opts);
        this._items        = this.getUpdatedItems(opts.items);
        this._value        = null;
        this._itemElements = [];
        this._images       = opts.images;
        this._getImage     = opts.getImage;
        this._tabIndex     = opts.tabIndex;
        this._onChange     = opts.onChange;
        this.initDOM(opts.parentNode);
        if ('value' in opts) {
            this.setValue(opts.value);
        }
    }

    initListItems() {
        let children = [];
        this._items.forEach(
            function(item) {
                children.push({
                    dropdown: this,
                    type:     ListItem,
                    title:    item.title,
                    subTitle: item.subTitle,
                    value:    item.value,
                    image:    item.image,
                    color:    item.color,
                    getImage: this._getImage
                });
            },
            this
        );
        return children;
    }

    initValue() {
        if (this._images) {
            return {
                className: 'dropdown-value',
                tabIndex:  this._tabIndex,
                children: [
                    {
                        id:        this.setValueElement.bind(this),
                        disabled:  this._disabled ? 'disabled' : '',
                        type:      'input',
                        inputType: 'button',
                        tabIndex:  this._tabIndex
                    },
                    {
                        ref:       this.setRef('valueImgWrapper'),
                        className: 'flt dropdown-img-wrapper',
                        children: [
                            {
                                ref:       this.setRef('valueImg'),
                                className: 'no-select',
                                type:      'img'
                            }
                        ]
                    },
                    {
                        ref:       this.setRef('valueTitle'),
                        className: 'no-select flt dropdown-title'
                    },
                    {
                        ref:       this.setRef('valueSubTitle'),
                        className: 'no-select flt dropdown-sub-title'
                    }
                ]
            };
        }
        return {
            className: 'dropdown-value',
            children: [
                {
                    id:        this.setValueElement.bind(this),
                    tabIndex:  this._tabIndex,
                    disabled:  this._disabled ? 'disabled' : '',
                    type:      'input',
                    inputType: 'button'
                },
                {
                    className: 'no-select dropdown-value-label',
                    ref:       this.setRef('dropdownValue'),
                    innerHTML: ''
                }
            ]
        };
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                id:        this._design ? this.setElement.bind(this) : () => {},
                ref:       this.setRef('dropdown'),
                className: this.getClassName(),
                style:     this.applyStyle({}, this._style),
                children: [
                    this.initValue(),
                    {
                        ref:       this.setRef('list'),
                        className: 'dropdown-list',
                        children:  this.initListItems()
                    }
                ]
            }
        );
        if (this._items.length) {
            this.setValue(this._items[0].value);
            this.updateHeight();
        }
    }

    addItem(item) {
        this._itemElements.push(item);
    }

    getDOMNode() {
        return this._refs.dropdown;
    }

    getUpdatedItems(items) {
        let result = [];
        (items || []).forEach((item, index) => {
            if (typeof item === 'string') {
                result.push({title: item, value: index});
            } else {
                result.push(item);
            }
        });
        return result;
    }

    setValueElement(element) {
        this._valueElement = element;
        if (this._design) {
            return;
        }
        element.addEventListener('focus',     this.onValueFocus.bind(this));
        element.addEventListener('blur',      this.onValueBlur.bind(this));
        element.addEventListener('mousedown', this.onValueMouseDown.bind(this));
        element.addEventListener('mouseup',   this.onValueMouseUp.bind(this));
        element.addEventListener('click',     this.onValueClick.bind(this));
        element.addEventListener('keyup',     this.onValueKeyUp.bind(this));
    }

    getValue() {
        return this._value;
    }

    setValue(value) {
        let found     = false;
        let foundItem = {};
        this._items.forEach(
            function(item, index) {
                let active = (item.value === value);
                this._itemElements[index].setSelected(active);
                if (active) {
                    this._value = item.value;
                    foundItem   = item;
                    found       = true;
                }
            },
            this
        );
        if (!found) {
            this._value = null;
        }
        if (this._images) {
            let refs = this._refs;
            if (foundItem.image) {
                refs.valueImg.src           = this._getImage(foundItem.image);
                refs.valueImg.style.display = 'block';
            } else {
                refs.valueImg.style.display = 'none';
            }
            refs.valueImgWrapper.style.backgroundColor = foundItem.color    || 'transparent';
            refs.valueTitle.innerHTML                  = foundItem.title    || '';
            refs.valueSubTitle.innerHTML               = foundItem.subTitle || '';
        } else {
            this._refs.dropdownValue.innerHTML = foundItem.title || '';
        }
        return this;
    }

    setValueAndChange(value) {
        this.setValue(value);
        if (typeof this._onChange === 'function') {
            this._onChange(value);
        }
        return this;
    }

    setItems(items) {
        this._itemElements = [];
        this._items        = this.getUpdatedItems(items);
        let refs = this._refs;
        let list = refs.list;
        while (list.childNodes.length) {
            list.removeChild(list.childNodes[0]);
        }
        let children = this.initListItems();
        children.forEach(
            function(item) {
                this.create(refs.list, item);
            },
            this
        );
        if (items.length) {
            this.setValue(this._value);
            if (!this._value) {
                this.setValue(items[0].value);
            }
            this.updateHeight();
        } else {
            this._valueElement.innerHTML = '';
            this._value                  = null;
        }
        return this;
    }

    getImages() {
        return this._images;
    }

    updateHeight() {
        let list  = this._refs.list;
        let items = this._items;
        if (this._images) {
            if (items.length >= 5) {
                list.style.height = '208px';
            } else {
                list.style.height = (items.length * 48 + 2) + 'px';
            }
        } else {
            if (items.length >= 9) {
                list.style.height = '208px';
            } else {
                list.style.height = (items.length * 24 + 2) + 'px';
            }
        }
    }

    focus() {
        this._valueElement.focus();
        return this;
    }

    close() {
        this._focus                   = false;
        this._refs.dropdown.className = this.getClassName();
    }

    onEvent(opts) {
        if ('items' in opts) {
            this.setItems(opts.items);
        }
        if ('value' in opts) {
            this.setValue(opts.value);
        }
        super.onEvent(opts);
        this.applyStyle(this._refs.dropdown.style, this._style);
    }

    onValueFocus(event) {
        this.onCancelEvent(event);
        if (this._items.length) {
            this._focus                   = true;
            this._refs.dropdown.className = this.getClassName();
        }
    }

    onValueBlur(event) {
        this.onCancelEvent(event);
        this._focus                   = false;
        this._refs.dropdown.className = this.getClassName();
    }

    onValueMouseDown(event) {
        this.onCancelEvent(event);
    }

    onValueMouseUp(event) {
        this.onCancelEvent(event);
    }

    onValueClick(event) {
        if (this._design) {
            return;
        }
        this.onCancelEvent(event);
        this._valueElement.focus();
        if (this._items.length) {
            this._focus                   = true;
            this._refs.dropdown.className = this.getClassName();
        }
    }

    onValueKeyUp(event) {
        if (this._design) {
            return;
        }
        if (!this._items.length) {
            return;
        }
        let value        = null;
        let refs         = this._refs;
        let items        = this._items;
        let itemElements = this._itemElements;
        switch (event.keyCode) {
            case 13: // Enter
                this.close();
                break;
            case 38: // Up
                for (let i = 1; i < items.length; i++) {
                    let item = items[i];
                    if (item.value === this._value) {
                        value = items[i - 1].value;
                        break;
                    }
                }
                if (value) {
                    this
                        .setValueAndChange(value)
                        .dispatchValue();
                } else {
                    this
                        .setValueAndChange(items[0].value)
                        .dispatchValue();
                }
                this._focus             = true;
                refs.dropdown.className = this.getClassName();
                break;
            case 40: // Down
                for (let i = 0; i < items.length - 1; i++) {
                    let item = items[i];
                    if (item.value === this._value) {
                        value = items[i + 1].value;
                        break;
                    }
                }
                if (value) {
                    this
                        .setValueAndChange(value)
                        .dispatchValue();
                }
                this._focus             = true;
                refs.dropdown.className = this.getClassName();
                break;
        }
    }

    dispatchValue() {
        if (this._dispatch) {
            dispatcher.dispatch(this._dispatch, this._value);
        }
    }
};

exports.Component = exports.Dropdown;
