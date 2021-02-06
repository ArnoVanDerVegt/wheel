/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../../../lib/dispatcher').dispatcher;
const Dialog     = require('../../../lib/components/Dialog').Dialog;
const Radio      = require('../../../lib/components/input/Radio').Radio;

const SHOW_SIGNAL = 'Dialog.SelectGridSize.Show';

exports.FormGridSizeDialog = class extends Dialog {
    constructor(opts) {
        super(opts);
        this.initWindow({
            showSignal: SHOW_SIGNAL,
            width:      256,
            height:     264,
            className:  'grid-size-dialog',
            title:      'Select grid size'
        });
    }

    initWindowContent(opts) {
        return [
            {
                ref:       this.setRef('radio'),
                type:      Radio,
                ui:        this._ui,
                uiId:      this._uiId,
                tabIndex:  1,
                value:     0,
                className: 'abs dialog-lt',
                options: [
                    {value:  0, title: 'No grid'},
                    {value: 10, title: '10x10'},
                    {value: 12, title: '12x12'},
                    {value: 16, title: '16x16'},
                    {value: 20, title: '20x20'}
                ]
            },
            this.initButtons([
                {
                    tabIndex: 128,
                    value:    'Ok',
                    onClick:  this.onApply.bind(this)
                }
            ])
        ];
    }

    onApply() {
        this.hide();
        let formGridSize = this._refs.radio.getValue();
        dispatcher.dispatch('Settings.Set.FormGridSize', formGridSize);
        this._onApply(formGridSize);
    }

    onShow(opts) {
        this.show();
        this._onApply = opts.onApply;
        this._refs.radio
            .setValue(opts.gridSize)
            .focus();
    }
};

exports.FormGridSizeDialog.SHOW_SIGNAL = SHOW_SIGNAL;
