/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher      = require('../../../lib/dispatcher').dispatcher;
const getDataProvider = require('../../../lib/dataprovider/dataProvider').getDataProvider;
const ListDialog      = require('../list/ListDialog').ListDialog;

exports.EV3ConnectListDialog = class extends ListDialog {
    constructor(opts) {
        opts.help       = 'Bluetooth';
        opts.title      = 'Connect EV3';
        opts.applyTitle = 'Connect';
        opts.subClass   = true;
        opts.comment    = 'Don\'t forget to pair your device first!';
        opts.showSignal = 'Dialog.ConnectEV3.Show';
        super(opts);
    }

    getList() {
        getDataProvider().getData('post', 'ev3/device-list', {}, this.onDeviceList.bind(this));
    }

    onApply() {
        let index = this._refs.list.getSelectedIndex();
        if (index >= 0) {
            this.hide();
            let item = this._list[index];
            dispatcher
                .dispatch('EV3.ConnectToDevice',     item)
                .dispatch('Settings.Set.DeviceName', item);
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
