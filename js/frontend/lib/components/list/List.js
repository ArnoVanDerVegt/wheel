/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const Component = require('../Component').Component;
const ListItem  = require('./ListItem').ListItem;

exports.List = class extends Component {
    constructor(opts) {
        super(opts);
        this._listItemConstructor = opts.ListItem || ListItem;
        this._selected            = 0;
        this._items               = opts.items || [];
        this._listItems           = [];
        this._onChange            = opts.onChange;
        this._onSelect            = opts.onSelect;
        this._baseClassName       = 'list';
        this.initDOM(opts.parentNode);
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                ref:       this.setRef('list'),
                className: this.getClassName(),
                children:  this.initListItems()
            }
        );
    }

    initListItems() {
        let result   = [];
        let refs     = this._refs;
        let tabIndex = this._tabIndex;
        this._items.forEach(
            function(item, index) {
                result.push(new this._listItemConstructor({
                    list:       this,
                    parentNode: refs.list,
                    index:      index,
                    tabIndex:   tabIndex + 1 + index,
                    item:       item
                }));
            },
            this
        );
        return result;
    }

    onClickItem(listItem) {
        if (this._selected) {
            this._selected.setSelected(false);
        }
        if (this._selected === listItem) {
            this._onSelect && this._onSelect(this._selected.getIndex());
            return;
        }
        this._selected = listItem;
        this._selected.setSelected(true);
        this._onChange && this._onChange();
    }

    onApply() {
        if (this._selected) {
            this._onSelect && this._onSelect(this._selected.getIndex());
            this.hide();
            this._dispatchApply && dispatcher.dispatch(this._dispatchApply, this._selected.getIndex());
        }
    }

    clear() {
        let list = this._refs.list;
        while (list.childNodes.length) {
            list.removeChild(list.childNodes[0]);
        }
    }

    focus() {
        if (this._listItems.length) {
            this._listItems[0].focus();
        }
    }

    setItems(items) {
        this.clear();
        this._items     = items;
        this._listItems = this.initListItems();
    }

    getSelectedIndex() {
        return this._selected ? this._selected.getIndex() : -1;
    }
};
