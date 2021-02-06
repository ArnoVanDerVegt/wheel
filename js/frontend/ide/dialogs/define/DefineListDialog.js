/**
 * Wheel, copyright (c) 2021 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher     = require('../../../lib/dispatcher').dispatcher;
const ListDialog     = require('../list/ListDialog').ListDialog;
const DefineListItem = require('./components/DefineListItem').DefineListItem;

const SHOW_SIGNAL = 'Dialog.DefineList.Show';

exports.DefineListDialog = class extends ListDialog {
    constructor(opts) {
        opts.ListItem   = DefineListItem;
        opts.help       = 'define';
        opts.title      = 'Defines';
        opts.applyTitle = 'Connect';
        opts.showSignal = SHOW_SIGNAL;
        super(opts);
        this._settings.on('Settings.Defines', this, this.showList);
    }

    initButtonRow(opts) {
        return this.initButtons([
            {
                tabIndex: 258,
                value:    'Add define',
                onClick:  this.onAddDefine.bind(this)
            },
            {
                tabIndex: 258,
                disabled: true,
                value:    'Delete define',
                ref:      this.setRef('delete'),
                onClick:  this.onDeleteDefine.bind(this)
            },
            {
                ref:      this.setRef('buttonCancel'),
                tabIndex: 257,
                value:    'Close',
                color:    'dark-green',
                onClick:  this.hide.bind(this)
            }
        ]);
    }

    showList() {
        let refs = this._refs;
        refs.list.setItems(this._settings.getDefines().getList());
        refs.list.setLoading(false);
        this._refs.delete.setDisabled(true);
    }

    onAddDefine() {
        dispatcher.dispatch(
            'Dialog.DefineValue.Show',
            {
                add: true
            }
        );
    }

    onDeleteDefine() {
        dispatcher.dispatch(
            'Settings.Define.DeleteByIndex',
            {
                index: this._refs.list.getSelectedIndex()
            }
        );
    }

    onChangeItem() {
        this._refs.delete.setDisabled(false);
    }

    onSelectItem(index) {
        dispatcher.dispatch(
            'Dialog.DefineValue.Show',
            {
                add:    false,
                index:  index,
                define: this._settings.getDefines().getList()[index]
            }
        );
    }

    onShow() {
        this.show();
        this.showList();
    }
};

exports.DefineListDialog.SHOW_SIGNAL = SHOW_SIGNAL;
