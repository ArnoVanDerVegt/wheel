/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../../lib/dispatcher').dispatcher;
const Dialog     = require('../../lib/components/Dialog').Dialog;

exports.YesNoCancelDialog = class extends Dialog {
    constructor(opts) {
        super(opts);
        this._onYes    = null;
        this._onNo     = null;
        this._onCancel = null;
        this.initWindow('confirm-dialog', 'Confirm', this.initWindowContent(opts));
        dispatcher.on('Dialog.YesNoCancel.Show', this, this.onShow);
    }

    initWindowContent(opts) {
        return [
            {
                ref:       this.setRef('text'),
                className: 'confirm-text'
            },
            {
                className: 'buttons',
                children: [
                    this.addButton({
                        ref:      this.setRef('yesButton'),
                        value:    'Yes',
                        tabIndex: 128,
                        onClick:  this.onYes.bind(this)
                    }),
                    this.addButton({
                        value:    'No',
                        tabIndex: 129,
                        onClick:  this.onNo.bind(this)
                    }),
                    this.addButton({
                        value:    'Cancel',
                        tabIndex: 130,
                        color:    'dark-green',
                        onClick:  this.onCancel.bind(this)
                    })
                ]
            }
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

    onShow(title, lines, dispatchYes, dispatchNo, dispatchCancel) {
        let refs = this._refs;
        this._dispatchYes    = dispatchYes;
        this._dispatchNo     = dispatchNo;
        this._dispatchCancel = dispatchCancel;
        refs.title.innerHTML = title || 'Title';
        refs.text.innerHTML  = (lines || ['Lorem ipsum dolor sit amet, consectetur adipiscing elit.']).join('<br/>');
        this.show();
        refs.yesButton.focus();
    }
};
