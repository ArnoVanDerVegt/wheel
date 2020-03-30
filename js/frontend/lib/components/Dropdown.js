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
            this._dropdown.setValue(this._value);
            setTimeout(this._dropdown.close.bind(this._dropdown), 500);
        }
    }

exports.Dropdown = class extends Component {
    constructor(opts) {
        super(opts);
        this._items = [
            {title: 'Title(1)', value: 0},
            {title: 'Title(2)', value: 1},
            {title: 'Title(3)', value: 2},
            {title: 'Title(4)', value: 3},
            {title: 'Title(5)', value: 4},
            {title: 'Title(6)', value: 5}
        ];
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
                        innerHTML: 'Value',
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
    }

    setValue(value) {
        let title = '';
        this._items.forEach(
            function(item, index) {
                let active = (item.value === value);
                this._itemElements[index].setSelected(active);
                if (active) {
                    title = item.title;
                }
            },
            this
        );
        this._valueElement.innerHTML = title;
    }

    close() {
        this._refs.dropdown.className = 'dropdown';
        console.log('close');
    }

    onFocus(event) {
        this.onCancelEvent(event);
        this._refs.dropdown.className = 'dropdown focus';
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
        this._refs.dropdown.className = 'dropdown focus';
        console.log(this._valueElement);
    }
};
