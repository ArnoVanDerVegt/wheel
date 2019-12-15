/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher      = require('../../../lib/dispatcher').dispatcher;
const getDataProvider = require('../../../lib/dataprovider/dataProvider').getDataProvider;
const ListDialog      = require('./ListDialog').ListDialog;

exports.ConnectListDialog = class extends ListDialog {
    constructor(opts) {
        opts.help       = 'Bluetooth';
        opts.title      = 'Connect';
        opts.applyTitle = 'Connect';
        opts.subClass   = true;
        opts.comment    = 'Don\'t forget to pair your device first!';
        super(opts);
        dispatcher.on('Dialog.Connect.Show', this, this.onShow);
    }

    getList() {
        getDataProvider().getData('post', 'ev3/device-list', {}, this.onDeviceList.bind(this));
    }

    onApply() {
        if (this._selected) {
            this.hide();
            let item = this._list[this._selected.getIndex()];
            dispatcher
                .dispatch('Brick.ConnectToDevice',   item)
                .dispatch('Settings.Set.DeviceName', item);
        }
    }

    onShow() {
        this.show();
        this.getList();
    }

    onDeviceList(data) {
        try {
            data = JSON.parse(data);
        } catch (error) {
            data = null;
        }
        if (data) {
            this._list = data.list;
            this.showList(data.list);
            if (this._listItems && this._listItems.length) {
                this._listItems[0].focus();
            } else {
                this._refs.buttonCancel.focus();
            }
        }
    }
};
