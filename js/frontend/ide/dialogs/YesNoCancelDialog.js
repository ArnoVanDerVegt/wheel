/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../../lib/dispatcher').dispatcher;
const Dialog     = require('../../lib/components/Dialog').Dialog;

const SHOW_SIGNAL = 'Dialog.YesNoCancel.Show';

exports.YesNoCancelDialog = class extends Dialog {
    constructor(opts) {
        super(opts);
        this._onYes    = null;
        this._onNo     = null;
        this._onCancel = null;
        this.initWindow({
            showSignal: SHOW_SIGNAL,
            width:      600,
            height:     200,
            className:  'confirm-dialog',
            title:      'Confirm'
        });
    }

    initWindowContent(opts) {
        return [
            {
                ref:       this.setRef('text'),
                className: 'dialog-lt dialog-cw abs confirm-text'
            },
            this.initButtons([
                {
                    ref:      this.setRef('yesButton'),
                    value:    'Yes',
                    tabIndex: 128,
                    onClick:  this.onYes.bind(this)
                },
                {
                    value:    'No',
                    tabIndex: 129,
                    onClick:  this.onNo.bind(this)
                },
                {
                    value:    'Cancel',
                    tabIndex: 130,
                    color:    'dark-green',
                    onClick:  this.onCancel.bind(this)
                }
            ])
        ];
    }

    onNo() {
        this.hide();
        this._dispatchNo && dispatcher.dispatch(this._dispatchNo);
    }

    onYes() {
        this.hide();
        this._dispatchYes && dispatcher.dispatch(this._dispatchYes);
    }

    onCancel() {
        this.hide();
        this._dispatchCancel && dispatcher.dispatch(this._dispatchCancel);
    }

    onShow(opts) {
        let refs = this._refs;
        this._dispatchYes    = opts.dispatchYes;
        this._dispatchNo     = opts.dispatchNo;
        this._dispatchCancel = opts.dispatchCancel;
        refs.title.innerHTML = opts.title || 'Title';
        refs.text.innerHTML  = (opts.lines || ['Lorem ipsum dolor sit amet, consectetur adipiscing elit.']).join('<br/>');
        this.show();
        refs.yesButton.focus();
    }
};

exports.YesNoCancelDialog.SHOW_SIGNAL = SHOW_SIGNAL;
