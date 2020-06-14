/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../../../lib/dispatcher').dispatcher;
const Dialog     = require('../../../lib/components/Dialog').Dialog;
const Radio      = require('../../../lib/components/Radio').Radio;

exports.FormGridSizeDialog = class extends Dialog {
    constructor(opts) {
        super(opts);
        this.createWindow(
            'grid-size-dialog',
            'Select grid size',
            [
                {
                    ref:      this.setRef('radio'),
                    type:     Radio,
                    ui:       this._ui,
                    uiId:     this._uiId,
                    tabIndex: 1,
                    value:    0,
                    options: [
                        {value:  0, title: 'No grid'},
                        {value: 10, title: '10x10'},
                        {value: 12, title: '12x12'},
                        {value: 16, title: '16x16'},
                        {value: 20, title: '20x20'}
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
        dispatcher.on('Dialog.SelectGridSize.Show', this, this.onShow);
    }

    onApply() {
        this.hide();
        let formGridSize = this._refs.radio.getValue();
        dispatcher.dispatch('Settings.Set.FormGridSize', formGridSize);
        this._onApply(formGridSize);
    }

    onShow(gridSize, onApply) {
        this.show();
        this._onApply = onApply;
        this._refs.radio
            .setValue(gridSize)
            .focus();
    }
};
