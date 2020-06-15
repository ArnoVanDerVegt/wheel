/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../../lib/dispatcher').dispatcher;
const Dialog     = require('../../lib/components/Dialog').Dialog;

exports.ConfirmDialog = class extends Dialog {
    constructor(opts) {
        super(opts);
        this._dispatchApply = null;
        this.createWindow(
            'confirm-dialog',
            'Confirm',
            [
                {
                    ref:       this.setRef('text'),
                    className: 'confirm-text'
                },
                {
                    className: 'buttons',
                    children: [
                        this.addButton({
                            ref:       this.setRef('buttonApply'),
                            tabIndex:  128,
                            value:     'Ok',
                            onClick:   this.onApply.bind(this)
                        }),
                        this.addButton({
                            ref:       this.setRef('buttonCancel'),
                            tabIndex:  129,
                            value:     'Cancel',
                            onClick:   this.onCancel.bind(this)
                        })
                    ]
                }
            ]
        );
        dispatcher.on('Dialog.Confirm.Show', this, this.onShow);
    }

    onApply() {
        this._applyCallback && this._applyCallback();
        this._dispatchApply && dispatcher.dispatch(this._dispatchApply);
        this.hide();
    }

    onCancel() {
        this._cancelCallback && this._cancelCallback();
        this._dispatchCancel && dispatcher.dispatch(this._dispatchCancel);
        this.hide();
    }

    onShow(opts) {
        let refs = this._refs;
        this._dispatchApply  = ('dispatchApply'  in opts) ? opts.dispatchApply  : false;
        this._dispatchCancel = ('dispatchCancel' in opts) ? opts.dispatchCancel : false;
        this._applyCallback  = ('applyCallback'  in opts) ? opts.applyCallback  : false;
        this._cancelCallback = ('cancelCallback' in opts) ? opts.cancelCallback : false;
        refs.title.innerHTML = opts.title         || 'Title';
        refs.text.innerHTML  = (opts.lines || ['Lorem ipsum dolor sit amet, consectetur adipiscing elit.']).join('<br/>');
        refs.buttonApply.setValue(opts.applyTitle || 'Ok');
        refs.buttonCancel.setValue(opts.cancelTitle || 'Cancel');
        this.show();
        if (opts.focus === 'apply') {
            refs.buttonApply.focus();
        } else if (opts.focus === 'cancel') {
            refs.buttonCancel.focus();
        }
    }
};
