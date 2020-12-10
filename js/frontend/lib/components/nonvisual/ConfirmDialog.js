/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher         = require('../../dispatcher').dispatcher;
const NonVisualComponent = require('./NonVisualComponent').NonVisualComponent;

exports.ConfirmDialog = class extends NonVisualComponent {
    constructor(opts) {
        super(opts);
        this._title         = opts.title;
        this._text          = opts.text;
        this._okTitle       = opts.okTitle;
        this._cancelTitle   = opts.cancelTitle;
        this._onOk          = opts.onOk;
        this._onCancel      = opts.onCancel;
        this._baseClassName = 'non-visual component-confirm-dialog';
        this.initDOM(opts.parentNode);
    }

    remove() {
        super.remove();
    }

    onEvent(opts) {
        if ('show' in opts) {
            dispatcher.dispatch(
                'Dialog.Confirm.Show',
                {
                    title:          this._title,
                    lines:          [this._text],
                    applyTitle:     this._okTitle,
                    cancelTitle:    this._cancelTitle,
                    applyCallback:  () => { (typeof this._onOk     === 'function') && this._onOk(); },
                    cancelCallback: () => { (typeof this._onCancel === 'function') && this._onCancel(); }
                }
            );
        }
        super.onEvent(opts);
    }

    onInterval() {
    }
};

exports.Component = exports.ConfirmDialog;
