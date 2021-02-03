/**
 * Wheel, copyright (c) 2021 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../../../lib/dispatcher').dispatcher;
const ListDialog = require('../list/ListDialog').ListDialog;

exports.DefineListDialog = class extends ListDialog {
    constructor(opts) {
        opts.help       = 'define';
        opts.title      = 'Defines';
        opts.applyTitle = 'Connect';
        opts.showSignal = 'Dialog.DefineList.Show';
        super(opts);
    }

    initButtonRow(opts) {
        return this.initButtons([
            {
                ref:      this.setRef('buttonCancel'),
                tabIndex: 257,
                value:    'Close',
                color:    'dark-green',
                onClick:  this.hide.bind(this)
            },
            {
                color:    'blue',
                tabIndex: 258,
                value:    'Add define',
                onClick:  this.onAddDefine.bind(this)
            }
        ]);
    }

    getList() {
    }

    onApply() {
    }

    onAddDefine() {
        dispatcher.dispatch('Dialog.DefineValue.Show', {});
    }

    onSelectItem(index) {
    }

    onShow() {
        this.show();
        this.getList();
    }
};
