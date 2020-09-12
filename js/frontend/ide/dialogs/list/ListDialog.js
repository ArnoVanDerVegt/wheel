/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../../../lib/dispatcher').dispatcher;
const DOMNode    = require('../../../lib/dom').DOMNode;
const Dialog     = require('../../../lib/components/Dialog').Dialog;
const List       = require('../../../lib/components/list/List').List;

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
                    type:      List,
                    ListItem:  opts.ListItem,
                    settings:  this._settings,
                    ref:       this.setRef('list'),
                    ui:        this._ui,
                    tabIndex:  1,
                    className: 'item-list',
                    onChange:  this.onChangeItem.bind(this),
                    onSelect:  this.onSelectItem.bind(this)
                },
                {
                    className: 'buttons',
                    children: [
                        (opts.applyTitle === null) ?
                            null :
                            this.addButton({
                                ref:      this.setRef('buttonApply'),
                                tabIndex: 256,
                                value:    opts.applyTitle || 'Ok',
                                disabled: true,
                                onClick:  this.onApply.bind(this)
                            }),
                        this.addButton({
                            ref:      this.setRef('buttonCancel'),
                            tabIndex: 257,
                            value:    opts.cancelTitle || 'Cancel',
                            color:    'dark-green',
                            onClick:  this.hide.bind(this)
                        })
                    ].concat(this.getExtraButtons())
                }
            ]
        );
        if (opts && opts.signal) {
            dispatcher.on(opts.signal, this, this.onShow);
        }
    }

    getExtraButtons() {
        return [];
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

    onChangeItem() {
        this._refs.buttonApply.setDisabled(false);
    }

    onSelectItem(index) {
        this.hide();
        this._dispatchApply && dispatcher.dispatch(this._dispatchApply, index);
    }

    hide() {
        if (this._dispatchCancel) {
            dispatcher.dispatch(this._dispatchCancel);
        }
        super.hide();
    }

    onApply() {
        let index = this._refs.list.getSelectedIndex();
        if (index >= 0) {
            this.hide();
            this._dispatchApply && dispatcher.dispatch(this._dispatchApply, index);
        }
    }

    onShow(opts) {
        let refs = this._refs;
        refs.title.innerHTML       = opts.title;
        refs.buttonApply.innerHTML = opts.applyTitle;
        refs.buttonApply.className = 'button disabled';
        this._list                 = opts.list;
        this._dispatchApply        = opts.dispatchApply;
        this._dispatchCancel       = opts.dispatchCancel;
        this.showList(opts.list);
        super.show();
        if (this._list.length) {
            refs.list.focus();
        } else {
            refs.buttonCancel.focus();
        }
    }

    showList(list) {
        this._refs.list.setItems(list);
    }
};
