/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../../../lib/dispatcher').dispatcher;
const DOMNode    = require('../../../lib/dom').DOMNode;
const Dialog     = require('../../../lib/components/Dialog').Dialog;
const ListItem   = require('./components/ListItem').ListItem;

exports.ListDialog = class extends Dialog {
    constructor(opts) {
        super(opts);
        opts || (opts = {});
        this._list          = [];
        this._dispatchApply = null;
        this.createWindow(
            'list-dialog' + (opts.comment ? ' with-comment' : ''),
            opts.title || 'Title',
            [
                opts.comment ?
                    {
                        innerHTML: opts.comment,
                        className: 'list-comment'
                    } :
                    null,
                {
                    ref:       this.setRef('text'),
                    uiId:      this._uiId,
                    tabIndex:  1,
                    className: 'item-list'
                },
                {
                    className: 'buttons',
                    children: [
                        this.addButton({
                            ref:      this.setRef('buttonApply'),
                            tabIndex: 256,
                            value:    'Ok',
                            disabled: true,
                            onClick:  this.onApply.bind(this)
                        }),
                        this.addButton({
                            ref:      this.setRef('buttonCancel'),
                            tabIndex: 257,
                            value:    'Cancel',
                            color:    'dark-green',
                            onClick:  this.hide.bind(this)
                        })
                    ]
                }
            ]
        );
        if (!opts || !opts.subClass) {
            dispatcher.on('Dialog.List.Show', this, this.onShow);
        }
    }

    getList() {
        return this._list;
    }

    setList(list) {
        this._list = list;
        this.showList(list);
    }

    setOnApply(onApply) {
        this._onApply = onApply;
        return this;
    }

    onClickItem(listItem) {
        if (this._selected) {
            this._selected.setSelected(false);
        }
        if (this._selected === listItem) {
            this.onApply();
            return;
        }
        this._selected = listItem;
        this._selected.setSelected(true);
        this._refs.buttonApply.setDisabled(false);
        event.preventDefault();
        event.stopPropagation();
    }

    hide() {
        if (this._dispatchCancel) {
            dispatcher.dispatch(this._dispatchCancel);
        }
        super.hide();
    }

    onApply() {
        if (this._selected) {
            this.hide();
            this._dispatchApply && dispatcher.dispatch(this._dispatchApply, this._selected.getIndex());
        }
    }

    onShow(opts) {
        let refs = this._refs;
        refs.title.innerHTML       = opts.title;
        refs.buttonApply.innerHTML = opts.applyTitle;
        refs.buttonApply.className = 'button disabled';
        this._list                 = opts.list;
        this._selected             = null;
        this._dispatchApply        = opts.dispatchApply;
        this._dispatchCancel       = opts.dispatchCancel;
        this.showList(opts.list);
        super.show();
        if (this._listItems && this._listItems.length) {
            this._listItems[0].focus();
        } else {
            refs.buttonCancel.focus();
        }
    }

    showList(list) {
        let refs = this._refs;
        while (refs.text.childNodes.length) {
            refs.text.removeChild(this._refs.text.childNodes[0]);
        }
        this._listItems = [];
        list.forEach(
            function(item, index) {
                this._listItems.push(new ListItem({
                    parentNode: refs.text,
                    index:      index,
                    tabIndex:   index + 1,
                    item:       item,
                    dialog:     this
                }));
            },
            this
        );
        return this;
    }
};
