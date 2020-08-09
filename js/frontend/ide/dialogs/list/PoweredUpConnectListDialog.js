/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher      = require('../../../lib/dispatcher').dispatcher;
const getDataProvider = require('../../../lib/dataprovider/dataProvider').getDataProvider;
const platform        = require('../../../lib/platform');
const ListDialog      = require('./ListDialog').ListDialog;
const ListItem        = require('./components/ListItem').ListItem;

exports.PoweredUpConnectListDialog = class extends ListDialog {
    constructor(opts) {
        opts.help       = 'Bluetooth';
        opts.title      = 'Connect Powered Up';
        opts.applyTitle = 'Connect';
        opts.ListItem   = ListItem;
        super(opts);
        dispatcher.on('Dialog.ConnectPoweredUp.Show', this, this.onShow);
        this._scanTimeout = null;
        this._changed     = -1;
        this._changeTime  = Date.now();
    }

    getExtraButtons() {
        return [
            platform.forceWebVersion() ?
                this.addButton({
                    color:    'blue',
                    tabIndex: 258,
                    value:    'Look for devices',
                    onClick:  this.onScan.bind(this)
                }) :
                null
        ];
    }

    getList() {
        getDataProvider().getData(
            'post',
            'powered-up/device-list',
            {},
            (data) => {
                try {
                    data = JSON.parse(data);
                } catch (error) {
                    data = null;
                }
                let time = Date.now();
                if (data && ((data.changed !== this._changed) || (time > this._changeTime + 5000))) {
                    this._changed    = data.changed;
                    this._changeTime = time;
                    data.list.forEach(function(item) {
                        if (!item.title) {
                            item.title = '??';
                        }
                    });
                    this.onDeviceList(data.list);
                }
                this._scanTimeout = setTimeout(this.getList.bind(this), 200);
            }
        );
    }

    onApply() {
        let index = this._refs.list.getSelectedIndex();
        if (index >= 0) {
            this.hide();
            dispatcher.dispatch('PoweredUp.ConnectToDevice', this._list[index]);
        }
    }

    onScan() {
        getDataProvider().getData(
            'post',
            'powered-up/scan',
            {},
            (data) => {}
        );
    }

    onSelectItem(index) {
        this.onApply();
    }

    onShow() {
        this.show();
        this.getList();
    }

    onDeviceList(list) {
        this._list = list;
        this.showList(list);
        this._refs.buttonCancel.focus();
    }

    hide() {
        if (this._scanTimeout) {
            clearTimeout(this._scanTimeout);
            this._scanTimeout = null;
        }
        super.hide();
    }
};
