/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../dispatcher').dispatcher;
const DOMNode    = require('../dom').DOMNode;
const Component  = require('./Component').Component;

const ListItem = class extends DOMNode {
        constructor(opts) {
            super(opts);
            this._title    = opts.title;
            this._value    = opts.value;
            this._dropdown = opts.dropdown;
            this._dropdown.addItem(this);
            this.initDOM(opts.parentNode);
        }

        initDOM(parentNode) {
            this.create(
                parentNode,
                {
                    id:        this.setElement.bind(this),
                    className: 'dropdown-list-item',
                    innerHTML: this._title
                }
            );
        }

        setSelected(selected) {
            this._element.className = 'dropdown-list-item' + (selected ? ' selected' : '');
        }

        setElement(element) {
            element.addEventListener('mousedown', this.onMouseDown.bind(this));
            this._element = element;
        }

        onMouseDown(event) {
            this.onCancelEvent(event);
            this._dropdown
                .setValue(this._value)
                .dispatchValue();
            setTimeout(this._dropdown.close.bind(this._dropdown), 500);
        }
    };

exports.Dropdown = class extends Component {
    constructor(opts) {
        super(opts);
        this._items        = opts.items || [];
        this._value        = null;
        this._itemElements = [];
        this._tabIndex     = opts.tabIndex;
        this.initDOM(opts.parentNode);
    }

    initListItems() {
        let children = [];
        this._items.forEach(
            function(item) {
                children.push({
                    dropdown: this,
                    type:     ListItem,
                    title:    item.title,
                    value:    item.value
                });
            },
            this
        );
        return children;
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                ref:       this.setRef('dropdown'),
                className: 'dropdown',
                children: [
                    {
                        id:        this.setValueElement.bind(this),
                        type:      'a',
                        href:      '#',
                        className: 'dropdown-value',
                        innerHTML: '',
                        tabIndex:  this._tabIndex
                    },
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
        }
    }

    addItem(item) {
        this._itemElements.push(item);
    }

    setValueElement(element) {
        this._valueElement = element;
        element.addEventListener('focus',     this.onFocus.bind(this));
        element.addEventListener('blur',      this.onBlur.bind(this));
        element.addEventListener('mousedown', this.onMouseDown.bind(this));
        element.addEventListener('mouseup',   this.onMouseUp.bind(this));
        element.addEventListener('click',     this.onClick.bind(this));
        element.addEventListener('keyup',     this.onKeyUp.bind(this));
    }

    setValue(value) {
        let title = '';
        let found = false;
        this._items.forEach(
            function(item, index) {
                let active = (item.value === value);
                this._itemElements[index].setSelected(active);
                if (active) {
                    this._value = item.value;
                    title       = item.title;
                    found       = true;
                }
            },
            this
        );
        if (!found) {
            this._value = null;
        }
        this._valueElement.innerHTML = title;
        return this;
    }

    setItems(items) {
        this._itemElements = [];
        this._items        = items;
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
        } else {
            this._valueElement.innerHTML = '';
            this._value                  = null;
        }
    }

    close() {
        this._refs.dropdown.className = 'dropdown';
    }

    onFocus(event) {
        this.onCancelEvent(event);
        if (this._items.length) {
            this._refs.dropdown.className = 'dropdown focus';
        }
    }

    onEvent(opts) {
        if ('items' in opts) {
            this.setItems(opts.items);
        }
        if ('value' in opts) {
            this.setValue(opts.value);
        }
    }

    onBlur(event) {
        this.onCancelEvent(event);
        this._refs.dropdown.className = 'dropdown';
    }

    onMouseDown(event) {
        this.onCancelEvent(event);
    }

    onMouseUp(event) {
        this.onCancelEvent(event);
    }

    onClick(event) {
        this.onCancelEvent(event);
        this._valueElement.focus();
        if (this._items.length) {
            this._refs.dropdown.className = 'dropdown focus';
        }
    }

    onKeyUp(event) {
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
                        .setValue(value)
                        .dispatchValue();
                } else {
                    this
                        .setValue(items[0].value)
                        .dispatchValue();
                }
                refs.dropdown.className = 'dropdown focus';
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
                        .setValue(value)
                        .dispatchValue();
                }
                refs.dropdown.className = 'dropdown focus';
                break;
        }
    }

    dispatchValue() {
        if (this._dispatch) {
            dispatcher.dispatch(this._dispatch, this._value);
        }
    }
};
