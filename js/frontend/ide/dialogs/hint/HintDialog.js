/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../../../lib/dispatcher').dispatcher;
const Dialog     = require('../../../lib/components/Dialog').Dialog;

exports.HintDialog = class extends Dialog {
    constructor(opts) {
        super(opts);
        this._title            = opts.title;
        this._lines            = opts.lines;
        this._dispatchDontShow = opts.dispatchDontShow;
        this._dispatchHide     = opts.dispatchHide;
        this.initWindow({
            showSignal: opts.signal || 'Dialog.Hint.Show',
            width:      600,
            height:     opts.height || 400,
            className:  'hint-dialog ' + (opts.dialogClassName || ''),
            title:      this._title
        });
    }

    initWindowContent(opts) {
        let buttons = [
                {
                    value:    opts.okButton || 'Ok',
                    tabIndex: 128,
                    onClick:  this.onClose.bind(this)
                }
            ].concat(this.addCustomButtons());
        buttons.push(this.addDontShowAgain(2));
        return [
            {
                ref:       this.setRef('text'),
                className: 'no-select abs dialog-cw dialog-lt hint-text'
            },
            this.initButtons(buttons)
        ];
    }

    addCustomButtons() {
        return [];
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
