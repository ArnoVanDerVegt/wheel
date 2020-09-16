/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../../../lib/dispatcher').dispatcher;
const Dialog     = require('../../../lib/components/Dialog').Dialog;

exports.HintDialog = class extends Dialog {
    constructor(opts) {
        super(opts);
        let buttons = [
                this.addButton({
                    value:    opts.okButton || 'Ok',
                    tabIndex: 128,
                    onClick:  this.onClose.bind(this)
                })
            ].concat(this.addCustomButtons());
        buttons.push(this.addDontShowAgain(2));
        this.initWindow('hint-dialog ' + (opts.dialogClassName || ''), 'Title', this.initWindowContent(opts, buttons));
        this._title            = opts.title;
        this._lines            = opts.lines;
        this._dispatchDontShow = opts.dispatchDontShow;
        this._dispatchHide     = opts.dispatchHide;
        dispatcher.on(opts.signal || 'Dialog.Hint.Show', this, this.onShow);
    }

    initWindowContent(opts, buttons) {
        return [
            {
                ref:       this.setRef('text'),
                className: 'hint-text'
            },
            {
                className: 'buttons',
                children:  buttons
            }
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
