/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../../lib/dispatcher').dispatcher;
const Dialog     = require('../../lib/components/Dialog').Dialog;
const Radio      = require('../../lib/components/Radio').Radio;

exports.DaisyChainDialog = class extends Dialog {
    constructor(opts) {
        opts.help = 'Chain';
        super(opts);
        this.createWindow(
            'daisy-chain-dialog',
            'Select daisy chain mode',
            [
                {
                    ref:      this.setRef('radio'),
                    type:     Radio,
                    ui:       this._ui,
                    uiId:     this._uiId,
                    tabIndex: 1,
                    value:    0,
                    options: [
                        {value: 0, title: '1 Layer'},
                        {value: 1, title: '2 Layers'},
                        {value: 2, title: '3 Layers'},
                        {value: 3, title: '4 Layers'}
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
        dispatcher.on('Dialog.DaisyChain.Show', this, this.onShow);
    }

    onApply() {
        this.hide();
        let daisyChainMode = this._refs.radio.getValue();
        dispatcher.dispatch('EV3.LayerCount', daisyChainMode);
        dispatcher.dispatch('Settings.Set.DaisyChainMode', daisyChainMode);
    }

    onShow(daisyChainMode) {
        this.show();
        this._refs.radio
            .setValue(daisyChainMode)
            .focus();
    }
};
