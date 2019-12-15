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
                            onClick:   this.hide.bind(this)
                        })
                    ]
                }
            ]
        );
        dispatcher.on('Dialog.Confirm.Show', this, this.onShow);
    }

    onApply() {
        this._dispatchApply && dispatcher.dispatch(this._dispatchApply);
        this.hide();
    }

    onShow(title, lines, dispatchApply, focus) {
        let refs = this._refs;
        this._dispatchApply  = dispatchApply || 'Confirm.Close';
        refs.title.innerHTML = title         || 'Title';
        refs.text.innerHTML  = (lines || ['Lorem ipsum dolor sit amet, consectetur adipiscing elit.']).join('<br/>');
        this.show();
        if (focus === 'apply') {
            refs.buttonApply.focus();
        } else if (focus === 'cancel') {
            refs.buttonCancel.focus();
        }
    }
};
