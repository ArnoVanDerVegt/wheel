/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const Component   = require('../component/Component').Component;
const LoadingDots = require('../status/LoadingDots').LoadingDots;
const ListItem    = require('./ListItem').ListItem;

exports.List = class extends Component {
    constructor(opts) {
        super(opts);
        this._settings            = opts.settings;
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
                children:  [
                    {
                        type: LoadingDots,
                        ref:  this.setRef('loadingDots'),
                        ui:   this._ui,
                        uiId: this._uiId
                    }
                ].concat(this.initListItems())
            }
        );
    }

    initListItems() {
        let result   = [];
        let refs     = this._refs;
        let tabIndex = this._tabIndex;
        this._items.forEach((item, index) => {
            result.push(new this._listItemConstructor({
                list:       this,
                settings:   this._settings,
                ui:         this._ui,
                uiId:       this._uiId,
                parentNode: refs.list,
                index:      index,
                tabIndex:   tabIndex + 1 + index * 2,
                item:       item
            }));
        });
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
        while (list.childNodes.length > 1) {
            list.removeChild(list.childNodes[1]);
        }
        this._refs.loadingDots.setVisible(true);
    }

    focus() {
        if (this._listItems.length) {
            this._listItems[0].focus();
        }
    }

    setItems(items) {
        let index = this.getSelectedIndex();
        this.clear();
        this._refs.loadingDots.setVisible(items.length === 0);
        this._items     = items;
        this._listItems = this.initListItems();
        if (this._listItems[index]) {
            this.onClickItem(this._listItems[index]);
        }
    }

    getSelectedIndex() {
        return this._selected ? this._selected.getIndex() : -1;
    }
};
