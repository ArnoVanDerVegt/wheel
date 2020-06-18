/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const DOMNode  = require('../../../lib/dom').DOMNode;
const Property = require('../Property').Property;

class ListItem extends DOMNode {
    constructor(opts) {
        super(opts);
        this._options = opts.options;
        this._index   = opts.index;
        this._title   = opts.title;
        this._list    = opts.list;
        this._list.setItem(this._index, this);
        this.initDOM(opts.parentNode);
    }

    initIconButton(opts) {
        return {
            id: function(element) {
                element.addEventListener(
                    'click',
                    function(event) {
                        event.stopPropagation();
                        event.preventDefault();
                        opts.onClick(opts.index);
                    }
                );
            },
            type:      'a',
            href:      '#',
            className: 'list-item-button ' + (opts.className || ''),
            innerHTML: opts.title
        };
    }

    initDOM(parentNode) {
        let options = this._options;
        this.create(
            parentNode,
            {
                id:        this.setElement.bind(this),
                className: 'list-item',
                children: [
                    {
                        ref:       this.setRef('title'),
                        type:      'span',
                        className: 'list-item-title',
                        innerHTML: this._title
                    },
                    {
                        id:        this.setInputElement.bind(this),
                        type:      'input',
                        inputType: 'text',
                        className: 'list-item-input',
                        value:     this._title
                    },
                    (options.remove || options.removeLast) ?
                        this.initIconButton({
                            title:     '✖',
                            className: 'delete',
                            onClick:   this.onClickDelete.bind(this)
                        }) :
                        null,
                    options.sort ?
                        this.initIconButton({
                            title:     '▼',
                            className: 'down',
                            onClick:   this.onClickDown.bind(this)
                        }) :
                        null,
                    options.sort ?
                        this.initIconButton({
                            title:     '▲',
                            className: 'up',
                            onClick:   this.onClickUp.bind(this)
                        }) :
                        null
                ]
            }
        );
    }

    remove() {
        this._element.parentNode.removeChild(this._element);
        return this._element;
    }

    setElement(element) {
        this._element = element;
        element.addEventListener('click', this.onClick.bind(this));
    }

    setInputElement(element) {
        element.addEventListener('keyup', this.onKeyUp.bind(this));
    }

    getElement() {
        return this._element;
    }

    setActive(active) {
        this._element.className = 'list-item' + (active ? ' active' : '');
    }

    getTitle(title) {
        return this._title;
    }

    setIndex(index) {
        this._index = index;
        this._list.setItem(index, this);
    }

    onKeyUp(event) {
        this._title                = event.target.value;
        this._refs.title.innerHTML = this._title;
        this._list.onChange();
    }

    onClick(event) {
        event.stopPropagation();
        this._list.setActiveItem(this);
    }

    onClickUp() {
        this._list.itemUp(this._index);
    }

    onClickDown() {
        this._list.itemDown(this._index);
    }

    onClickDelete() {
        this._list.itemDelete(this._index);
    }
}

exports.TextListProperty = class extends Property {
    constructor(opts) {
        super(opts);
        this._focus = false;
    }

    initPropertyValue() {
        return {
            ref:       this.setRef('value'),
            className: 'property-value',
            children: [
                {
                    id: (element) => {
                        element.addEventListener(
                            'click',
                            (event) => {
                                event.preventDefault();
                                this.onClickAdd();
                            }
                        );
                    },
                    type:      'a',
                    href:      '#',
                    className: 'list-item-button add',
                    innerHTML: '+'
                },
                {
                    id:        this.setInputElement.bind(this),
                    type:      'a',
                    href:      '#',
                    innerHTML: 'List value',
                    className: 'list-selected'
                }
            ]
        };
    }

    initListItem(index, value) {
        return {
            list:    this,
            options: this._options,
            type:    ListItem,
            title:   value,
            index:   index
        };
    }

    initPropertyName() {
        let children = [];
        this._value.forEach(
            function(value, index) {
                children.push(this.initListItem(index, value));
            },
            this
        );
        return {
            ref:       this.setRef('name'),
            className: 'property-name',
            innerHTML: this._name,
            children: [
                {
                    ref:       this.setRef('listContent'),
                    className: 'list-content' + (this._options.removeLast ? ' remove-last' : ''),
                    children:  children
                }
            ]
        };
    }

    setInputElement(element) {
        this._inputElement = element;
        element.addEventListener('click', this.onClickInput.bind(this));
    }

    setItem(index, item) {
        if (!this._items) {
            this._items = [];
        }
        this._items[index] = item;
    }

    setFocus(focus) {
        let refs = this._refs;
        if (focus) {
            refs.name.className             = 'property-name list-focus';
            refs.value.className            = 'property-value list-focus';
            this._propertyElement.className = 'property focus';
            this._inputElement.focus();
        } else {
            refs.name.className             = 'property-name';
            refs.value.className            = 'property-value';
            this._propertyElement.className = 'property';
            this.setActiveItem(null);
        }
    }

    setActiveItem(activeItem) {
        this._items.forEach((item) => {
            item.setActive(item === activeItem);
        });
    }

    itemUp(index) {
        this.setActiveItem(null);
        let items     = this._items;
        let listItem1 = items[index - 1].getElement();
        let listItem2 = items[index].remove();
        listItem1.parentNode.insertBefore(listItem2, listItem1);
        let item1 = items[index - 1];
        let item2 = items[index];
        item1.setIndex(index);
        item2.setIndex(index - 1);
        this.onChange();
    }

    itemDown(index) {
        this.setActiveItem(null);
        let items     = this._items;
        let listItem1 = items[index].getElement();
        let listItem2 = items[index + 1].remove();
        listItem1.parentNode.insertBefore(listItem2, listItem1);
        let item1 = items[index];
        let item2 = items[index + 1];
        item1.setIndex(index + 1);
        item2.setIndex(index);
        this.onChange();
    }

    itemDelete(index) {
        this.setActiveItem(null);
        let items = this._items;
        items[index].remove();
        items.splice(index, 1);
        for (let i = index; i < items.length; i++) {
            items[i].setIndex(i);
        }
        this.onChange();
    }

    onClickAdd() {
        this.setActiveItem(null);
        let index = this._items.length;
        let title = 'New(' + index + ')';
        this.create(
            this._refs.listContent,
            this.initListItem(index, title)
        );
        this.onChange();
    }

    onClickInput(event) {
        event.preventDefault();
    }

    onClick(event) {
        this.setFocus(true);
    }

    onChange() {
        let value = [];
        this._items.forEach((item) => {
            value.push(item.getTitle());
        });
        this._onChange(value);
    }
};
