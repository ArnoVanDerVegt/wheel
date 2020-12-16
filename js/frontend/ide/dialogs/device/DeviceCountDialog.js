/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../../../lib/dispatcher').dispatcher;
const Dialog     = require('../../../lib/components/Dialog').Dialog;
const Dropdown   = require('../../../lib/components/input/Dropdown').Dropdown;

exports.DeviceCountDialog = class extends Dialog {
    constructor(opts) {
        super(opts);
        this._onApply = () => {};
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
        return [
            {
                type:      Dropdown,
                ref:       this.setRef('deviceCount'),
                ui:        this._ui,
                uiId:      this._uiId,
                className: 'abs dialog-lt',
                tabIndex:  1,
                items:     []
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
        this._onApply(this._refs.deviceCount.getValue());
    }

    onShow(opts) {
        this.show();
        this._onApply = opts.onApply;
        let refs = this._refs;
        refs.deviceCount.setValue(opts.deviceCount);
        refs.title.innerHTML = opts.title;
        let items = [];
        for (let i = 0; i < opts.layerCount; i++) {
            items.push({value: i + 1, title: (i + 1) + ' Device' + (i ? 's' : '')});
        }
        refs.deviceCount
            .setItems(items)
            .setValue(opts.deviceCount);
    }
};
