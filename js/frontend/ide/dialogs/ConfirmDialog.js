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
        this.initWindow({
            showSignal: 'Dialog.Confirm.Show',
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
                className: 'no-select dialog-lt dialog-cw abs confirm-text'
            },
            this.initButtons([
                {
                    ref:       this.setRef('buttonApply'),
                    tabIndex:  128,
                    value:     'Ok',
                    onClick:   this.onApply.bind(this)
                },
                {
                    ref:       this.setRef('buttonCancel'),
                    tabIndex:  129,
                    value:     'Cancel',
                    onClick:   this.onCancel.bind(this)
                }
            ])
        ];
    }

    onApply() {
        this.hide();
        // Add a timeout to make sure that the dialog uiId is popped from the stack when the callback is called!
        setTimeout(
            () => {
                this._applyCallback && this._applyCallback();
                this._dispatchApply && dispatcher.dispatch(this._dispatchApply);
            },
            500
        );
    }

    onCancel() {
        this.hide();
        // Add a timeout to make sure that the dialog uiId is popped from the stack when the callback is called!
        setTimeout(
            () => {
                this._cancelCallback && this._cancelCallback();
                this._dispatchCancel && dispatcher.dispatch(this._dispatchCancel);
            },
            500
        );
    }

    onClose() {
        this._onCloseCallback && this._onCloseCallback();
        super.onClose();
    }

    onShow(opts) {
        let refs = this._refs;
        this._onCloseCallback = ('onCloseCallback' in opts) ? opts.onCloseCallback : false;
        this._dispatchApply   = ('dispatchApply'   in opts) ? opts.dispatchApply   : false;
        this._dispatchCancel  = ('dispatchCancel'  in opts) ? opts.dispatchCancel  : false;
        this._applyCallback   = ('applyCallback'   in opts) ? opts.applyCallback   : false;
        this._cancelCallback  = ('cancelCallback'  in opts) ? opts.cancelCallback  : false;
        refs.title.innerHTML  = opts.title || 'Title';
        refs.text.innerHTML   = (opts.lines || ['Lorem ipsum dolor sit amet, consectetur adipiscing elit.']).join('<br/>');
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
