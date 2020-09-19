/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const DOMNode = require('../../../lib/dom').DOMNode;

exports.ListItem = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._ui       = opts.ui;
        this._uiId     = opts.uiId;
        this._settings = opts.settings;
        this._item     = opts.item;
        this._list     = opts.list;
        this._index    = opts.index;
        this._tabIndex = opts.tabIndex;
        this._item     = opts.item;
        this._selected = false;
        this._focus    = false;
        this.initDOM(opts.parentNode);
    }

    initDOM(parentNode) {
        let item = this._item;
        if (typeof item === 'string') {
            this.create(
                parentNode,
                {
                    id:        this.setElement.bind(this),
                    className: 'flt rel max-w list-item',
                    children: [
                        {
                            id:        this.setLinkElement.bind(this),
                            tabIndex:  this._tabIndex,
                            type:      'a',
                            href:      '#',
                            className: 'flt rel max-w max-h list-item-item',
                            innerHTML: item
                        }
                    ]
                }
            );
            return;
        }
        this.create(
            parentNode,
            {
                id:        this.setElement.bind(this),
                className: 'flt rel max-w list-item',
                children: [
                    {
                        id:        this.setLinkElement.bind(this),
                        tabIndex:  this._tabIndex,
                        type:      'a',
                        href:      '#',
                        className: 'flt rel max-w max-h list-item-item',
                        children: [
                            item.image ?
                                {
                                    type:      'img',
                                    src:       item.image
                                } :
                                null,
                            item.label ?
                                {
                                    type:      'span',
                                    innerHTML: item.label
                                } :
                                null,
                            item.title ?
                                {
                                    type:      'span',
                                    className: 'item-title',
                                    innerHTML: item.title
                                } :
                                null,
                            item.subTitle ?
                                {
                                    type:      'span',
                                    className: 'item-sub-title',
                                    innerHTML: item.subTitle
                                } :
                                null
                        ]
                    }
                ]
            }
        );
    }

    setElement(element) {
        this._element = element;
    }

    setLinkElement(element) {
        this._linkElement = element;
        element.addEventListener('mousedown', this.onCancelEvent.bind(this));
        element.addEventListener('mouseup',   this.onCancelEvent.bind(this));
        element.addEventListener('click',     this.onClick.bind(this));
        element.addEventListener('focus',     this.onFocus.bind(this));
        element.addEventListener('blur',      this.onBlur.bind(this));
    }

    getClassName() {
        return 'list-item' +
            (this._selected ? ' selected' : '') +
            (this._focus    ? ' focus' : '');
    }

    setSelected(selected) {
        this._selected          = selected;
        this._element.className = this.getClassName();
        this._linkElement.focus();
    }

    getIndex() {
        return this._index;
    }

    onClick(event) {
        this.onCancelEvent(event);
        event.preventDefault();
        event.stopPropagation();
        this._list.onClickItem(this);
    }

    onFocus(event) {
        this._focus = true;
        this._element.className = this.getClassName();
    }

    onBlur(event) {
        this._focus = false;
        this._element.className = this.getClassName();
    }

    focus() {
        this._linkElement.focus();
    }
};
