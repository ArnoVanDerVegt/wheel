/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const DOMNode  = require('../../../lib/dom').DOMNode;
const Property = require('../Property').Property;

class ListItem extends DOMNode {
    constructor(opts) {
        super(opts);
        this._list  = opts.list;
        this._index = opts.index;
        this.initDOM(opts.parentNode);
    }

    initIconButton(opts) {
        return {
            id: function(element) {
                element.addEventListener(
                    'click',
                    function(event) {
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
    };

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                className: 'list-item',
                children: [
                    {
                        ref:       this.setRef('title'),
                        type:      'span',
                        className: 'list-item-title',
                        innerHTML: 'List item'
                    },
                    this.initIconButton({
                        title:     '✖',
                        className: 'delete',
                        onClick:   this.onClickDelete.bind(this)
                    }),
                    this.initIconButton({
                        title:     '▼',
                        className: 'down',
                        onClick:   this.onClickDown.bind(this)
                    }),
                    this.initIconButton({
                        title:     '▲',
                        className: 'up',
                        onClick:   this.onClickUp.bind(this)
                    })
                ]
            }
        );
    }

    setTitle(title) {
        this._refs.title.innerHTML = title;
    }

    setIndex(index) {
        this._index = index;
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

exports.ListProperty = class extends Property {
    constructor(opts) {
        super(opts);
        this._focus = false;
        this._items = [];
    }

    initPropertyValue() {
        return {
            ref:       this.setRef('value'),
            className: 'property-value',
            children: [
                {
                    id: function(element) {
                        element.addEventListener(
                            'click',
                            function(event) {
                                event.preventDefault();
                                //opts.onClick(opts.index);
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

    initListItem(index) {
        return {
            list:  this,
            type:  ListItem,
            title: 'Title' + index,
            index: index
        };
    }

    initPropertyName() {
        return {
            ref:       this.setRef('name'),
            className: 'property-name',
            innerHTML: this._name,
            children: [
                {
                    className: 'list-content',
                    children: [
                        this.initListItem(0),
                        this.initListItem(1),
                        this.initListItem(2)
                    ]
                }
            ]
        };
    }

    setInputElement(element) {
        this._inputElement = element;
        element.addEventListener('click', this.onClickInput.bind(this));
        //element.addEventListener('focus', this.onFocus.bind(this));
        //element.addEventListener('blur',  this.onBlur.bind(this));
    }

    setItem(index, item) {
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
        }
    }

    itemUp(index) {
        console.log('Up', index);
    }

    itemDown(index) {
        console.log('Down', index);
    }

    itemDelete(index) {
        console.log('Delete', index, this._items[index]);
    }

    onClickAdd() {
    }

    onClickInput(event) {
        event.preventDefault();
    }

    onClick(event) {
        this.setFocus(true);
    }
};
