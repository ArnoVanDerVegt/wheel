/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const platform                     = require('../../../../shared/lib/platform');
const dispatcher                   = require('../../../lib/dispatcher').dispatcher;
const getDataProvider              = require('../../../lib/dataprovider/dataProvider').getDataProvider;
const ListDialog                   = require('./ListDialog').ListDialog;
const PoweredUpAutoConnectListItem = require('./components/PoweredUpAutoConnectListItem').PoweredUpAutoConnectListItem;

exports.PoweredUpAutoConnectListDialog = class extends ListDialog {
    constructor(opts) {
        opts.showSignal  = 'Dialog.AutoConnectPoweredUp.Show';
        opts.help        = 'Bluetooth';
        opts.title       = 'Auto connect Powered Up';
        opts.applyTitle  = null;
        opts.cancelTitle = 'Close';
        opts.ListItem    = PoweredUpAutoConnectListItem;
        super(opts);
    }

    getList() {
        getDataProvider().getData(
            'post',
            'powered-up/connected-device-list',
            {
                autoConnect: this._settings.getPoweredUpAutoConnect().toJSON()
            },
            (data) => {
                try {
                    data = JSON.parse(data);
                } catch (error) {
                    data = null;
                }
                if (data) {
                    let list = [];
                    data.list.forEach(function(item) {
                        if (item) {
                            if (!item.title) {
                                item.title = '??';
                            }
                            list.push(item);
                        }
                    });
                    this.onDeviceList(list);
                }
            }
        );
    }

    onApply() {
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
};
