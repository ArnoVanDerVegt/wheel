/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../../../lib/dispatcher').dispatcher;
const Dialog     = require('../../../lib/components/Dialog').Dialog;

exports.HintDialog = class extends Dialog {
    constructor(opts) {
        super(opts);
        this.createWindow(
            'hint-dialog',
            'Title',
            [
                {
                    ref:       this.setRef('text'),
                    className: 'hint-text'
                },
                {
                    className: 'buttons',
                    children: [
                        this.addButton({
                            value:    'Ok',
                            tabIndex: 128,
                            onClick:  this.onClose.bind(this)
                        }),
                        this.addDontShowAgain(2)
                    ]
                }
            ]
        );
        this._title            = opts.title;
        this._lines            = opts.lines;
        this._dispatchDontShow = opts.dispatchDontShow;
        this._dispatchHide     = opts.dispatchHide;
        dispatcher.on(opts.signal || 'Dialog.Hint.Show', this, this.onShow);
    }

    onDontShowAgain(dontShowAgain) {
        dispatcher.dispatch(this._dispatchDontShow, dontShowAgain);
    }

    onShow(opts) {
        if (opts.dispatchDontShow) {
            this._dispatchDontShow = opts.dispatchDontShow;
        }
        if (opts.dispatchHide) {
            this._dispatchHide = opts.dispatchHide;
        }
        let refs = this._refs;
        refs.title.innerHTML = this._title || opts.title;
        refs.text.innerHTML  = (this._lines || opts.lines).join('<br/>');
        this.show();
    }

    onClose() {
        this._dispatchHide && dispatcher.dispatch(this._dispatchHide);
        this.hide();
    }
};
