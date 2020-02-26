/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../../../lib/dispatcher').dispatcher;
const Dialog     = require('../../../lib/components/Dialog').Dialog;
const Radio      = require('../../../lib/components/Radio').Radio;

exports.DeviceCountDialog = class extends Dialog {
    constructor(opts) {
        opts.help = 'Powered';
        super(opts);
        this.createWindow(
            'device-count-dialog',
            'Number of Powered Up devices',
            [
                {
                    ref:      this.setRef('radio'),
                    type:     Radio,
                    ui:       this._ui,
                    uiId:     this._uiId,
                    tabIndex: 1,
                    value:    1,
                    options: [
                        {value: 1, title: '1 Device'},
                        {value: 2, title: '2 Devices'},
                        {value: 3, title: '3 Devices'},
                        {value: 4, title: '4 Devices'}
                    ]
                },
                {
                    className: 'buttons',
                    children: [
                        this.addButton({
                            tabIndex: 128,
                            value:    'Ok',
                            onClick:  this.onApply.bind(this)
                        })
                    ]
                }
            ]
        );
        dispatcher.on('Dialog.DeviceCount.Show', this, this.onShow);
    }

    onApply() {
        this.hide();
        let deviceCount = this._refs.radio.getValue();
        dispatcher.dispatch('PoweredUp.DeviceCount', deviceCount);
        dispatcher.dispatch('Settings.Set.DeviceCount', deviceCount);
    }

    onShow(deviceCount) {
        this.show();
        this._refs.radio
            .setValue(deviceCount)
            .focus();
    }
};
