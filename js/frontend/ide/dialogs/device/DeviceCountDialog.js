/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const poweredUpModuleConstants = require('../../../../shared/vm/modules/poweredUpModuleConstants');
const dispatcher               = require('../../../lib/dispatcher').dispatcher;
const Dialog                   = require('../../../lib/components/Dialog').Dialog;
const Dropdown                 = require('../../../lib/components/Dropdown').Dropdown;

exports.DeviceCountDialog = class extends Dialog {
    constructor(opts) {
        super(opts);
        this.initWindow({
            showSignal: 'Dialog.DeviceCount.Show',
            width:      480,
            height:     180,
            className:  'device-count-dialog',
            title:      'Number of Powered Up devices',
            help:       'Powered'
        });
    }

    initWindowContent() {
        let items = [];
        for (let i = 0; i < poweredUpModuleConstants.POWERED_UP_LAYER_COUNT; i++) {
            items.push({value: i + 1, title: (i + 1) + ' Device' + (i ? 's' : '')});
        }
        return [
            {
                type:      Dropdown,
                ref:       this.setRef('deviceCount'),
                ui:        this._ui,
                uiId:      this._uiId,
                className: 'abs dialog-lt',
                tabIndex:  1,
                items:     items
            },
            this.initButtons([
                {
                    tabIndex: 128,
                    value:    'Set device count',
                    onClick:  this.onApply.bind(this)
                }
            ])
        ];
    }

    onApply() {
        this.hide();
        let deviceCount = this._refs.deviceCount.getValue();
        dispatcher.dispatch('PoweredUp.DeviceCount', deviceCount);
        dispatcher.dispatch('Settings.Set.DeviceCount', deviceCount);
    }

    onShow(deviceCount) {
        this.show();
        this._refs.deviceCount.setValue(deviceCount);
    }
};
