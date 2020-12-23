/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher      = require('../../../lib/dispatcher').dispatcher;
const getDataProvider = require('../../../lib/dataprovider/dataProvider').getDataProvider;
const SpikeListItem   = require('./components/SpikeListItem').SpikeListItem;
const ListDialog      = require('./ListDialog').ListDialog;

exports.SpikeConnectListDialog = class extends ListDialog {
    constructor(opts) {
        opts.help       = 'Bluetooth';
        opts.title      = 'Connect Spike';
        opts.applyTitle = 'Connect';
        opts.subClass   = true;
        opts.comment    = 'Don\'t forget to pair your device first!';
        opts.showSignal = 'Dialog.ConnectSpike.Show';
        opts.ListItem   = SpikeListItem;
        super(opts);
    }

    getList() {
        getDataProvider().getData('post', 'spike/device-list', {}, this.onDeviceList.bind(this));
    }

    onApply() {
        let index = this._refs.list.getSelectedIndex();
        if (index >= 0) {
            let item = this._list[index];
            if (item.connected || item.connecting) {
                return;
            }
            this.hide();
            dispatcher.dispatch('Spike.ConnectToDevice', item.title);
        }
    }

    onSelectItem(index) {
        this.onApply();
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
