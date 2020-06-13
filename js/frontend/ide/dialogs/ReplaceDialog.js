/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../../lib/dispatcher').dispatcher;
const Dialog     = require('../../lib/components/Dialog').Dialog;
const Checkbox   = require('../../lib/components/Checkbox').Checkbox;

exports.ReplaceDialog = class extends Dialog {
    constructor(opts) {
        super(opts);
        this.createWindow(
            'replace-dialog',
            'Replace',
            [
                {
                    className: 'replace-dialog-text',
                    children: [
                        {
                            className: 'replace-dialog-row',
                            children: [
                                {
                                    innerHTML: 'Replace'
                                },
                                this.addTextInput({
                                    ref:         this.setRef('replace'),
                                    tabIndex:    10,
                                    onKeyUp:     this.onReplaceKeyUp.bind(this),
                                    placeholder: 'Enter text'
                                })
                            ]
                        },
                        {
                            className: 'replace-dialog-row',
                            children: [
                                {
                                    innerHTML: 'With'
                                },
                                this.addTextInput({
                                    ref:         this.setRef('with'),
                                    tabIndex:    11,
                                    onKeyUp:     this.onWithKeyUp.bind(this),
                                    placeholder: 'Enter text'
                                })
                            ]
                        },
                        {
                            className: 'replace-dialog-row',
                            children: [
                                {
                                    innerHTML: 'Match case'
                                },
                                {
                                    ref:      this.setRef('caseSensitive'),
                                    type:     Checkbox,
                                    ui:       this._ui,
                                    uiId:     this._uiId,
                                    tabIndex: 12
                                }
                            ]
                        }
                    ]
                },
                {
                    className: 'buttons',
                    children: [
                        this.addButton({
                            ref:      this.setRef('buttonApply'),
                            tabIndex: 128,
                            value:    'Ok',
                            onClick:  this.onApply.bind(this)
                        }),
                        this.addButton({
                            tabIndex: 129,
                            value:    'Cancel',
                            color:    'dark-green',
                            onClick:  this.hide.bind(this)
                        })
                    ]
                }
            ]
        );
        dispatcher.on('Dialog.Replace.Show', this, this.onShow);
    }

    validateReplace() {
        let result = false;
        let refs   = this._refs;
        this._replace = refs.replace.getValue();
        if (this._replace === '') {
            refs.replace.setClassName('invalid');
        } else {
            refs.replace.setClassName('');
            result = true;
        }
        return result;
    }

    validate() {
        this._with = this._refs.with.getValue();
        return this.validateReplace();
    }

    onReplaceKeyUp(event) {
        if ((event.keyCode === 13) && this.validateReplace()) {
            this._refs.with.focus();
        }
    }

    onWithKeyUp() {
        if (event.keyCode === 13) {
            this.onApply();
        }
    }

    onShow() {
        super.show();
        this._refs.replace.focus();
    }

    onApply() {
        if (!this.validate()) {
            this._refs.replace.focus();
            return;
        }
        dispatcher.dispatch('Dialog.Replace.Replace', this._replace, this._with, this._refs.caseSensitive.getChecked());
        this.hide();
    }
};
