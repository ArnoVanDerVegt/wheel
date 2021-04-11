/**
 * Wheel, copyright (c) 2021 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const path       = require('../../../../shared/lib/path');
const dispatcher = require('../../../lib/dispatcher').dispatcher;
const Dialog     = require('../../../lib/components/Dialog').Dialog;

const SHOW_SIGNAL = 'Dialog.DefineValue.Show';

exports.DefineValueDialog = class extends Dialog {
    constructor(opts) {
        super(opts);
        this._add = false;
        this.initWindow({
            showSignal: SHOW_SIGNAL,
            width:      400,
            height:     256,
            className:  'no-select',
            title:      'Define value'
        });
    }

    initWindowContent(opts) {
        return [
            {
                className: 'abs dialog-cw dialog-lt',
                children: [
                    this.initTextInputRow({
                        tabIndex:    1,
                        title:       'Key',
                        ref:         'key',
                        placeholder: 'Enter key',
                        onKeyUp:     this.onKeyKeyUp.bind(this)
                    }),
                    this.initTextInputRow({
                        tabIndex:    2,
                        title:       'Value',
                        ref:         'value',
                        placeholder: 'Enter value',
                        onKeyUp:     this.onValueKeyUp.bind(this)
                    }),
                    this.initCheckboxInputRow({
                        tabIndex:    3,
                        title:       'Active',
                        ref:         'active'
                    })
                ]
            },
            this.initButtons([
                {
                    value:   'Ok',
                    ref:     this.setRef('okButton'),
                    onClick: this.onOk.bind(this)
                },
                {
                    value:   'Cancel',
                    onClick: this.hide.bind(this)
                }
            ])
        ];
    }

    initTextInputRow(opts) {
        return {
            className: 'flt max-w input-row',
            children: [
                {
                    className: 'flt input-label',
                    innerHTML: opts.title
                },
                this.addTextInput({
                    ref:         this.setRef(opts.ref),
                    tabIndex:    opts.tabIndex,
                    onKeyUp:     opts.onKeyUp,
                    placeholder: opts.placeholder
                })
            ]
        };
    }

    initCheckboxInputRow(opts) {
        return {
            className: 'flt max-w input-row',
            children: [
                {
                    className: 'flt input-label',
                    innerHTML: opts.title
                },
                this.addCheckbox({
                    ref:      this.setRef(opts.ref),
                    tabIndex: opts.tabIndex
                })
            ]
        };
    }

    validateKey() {
        let result = true;
        let refs   = this._refs;
        let key    = refs.key.getValue().trim();
        if ((key === '') || ('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.indexOf(key[0]) === -1)) {
            refs.key.focus();
            refs.key.setClassName('invalid');
            result = false;
        } else {
            refs.key.setClassName('');
        }
        return result;
    }

    validateValue() {
        let result = true;
        let refs   = this._refs;
        let value  = refs.value.getValue().trim();
        if (value === '') {
            refs.value.focus();
            refs.value.setClassName('invalid');
            result = false;
        } else {
            refs.value.setClassName('');
        }
        return result;
    }

    onKeyKeyUp(event) {
        if ((event.keyCode === 13) && this.validateKey()) {
            this._refs.value.focus();
        }
    }

    onValueKeyUp(event) {
        if ((event.keyCode === 13) && this.validateValue()) {
            this._refs.active.focus();
        }
    }

    onOk() {
        if (this.validateKey() && this.validateValue()) {
            const refs   = this._refs;
            const define = {
                    key:    refs.key.getValue(),
                    value:  refs.value.getValue(),
                    active: refs.active.getValue()
                };
            if (this._add) {
                dispatcher.dispatch('Settings.Define.Add', define);
            } else {
                dispatcher.dispatch('Settings.Define.UpdateByIndex', define, this._index);
            }
            this.hide();
        }
    }

    onShow(opts) {
        let refs   = this._refs;
        let define = opts.define || {};
        this._add   = opts.add;
        this._index = opts.index;
        if (opts.add) {
            refs.okButton.setValue('Add define');
        } else {
            refs.okButton.setValue('Update define');
        }
        refs.key.setValue(define.key || '');
        refs.value.setValue(define.value || '');
        refs.active.setValue(('active' in define) ? define.active : true);
        this.show();
        refs.key.focus();
    }
};

exports.DefineValueDialog.SHOW_SIGNAL = SHOW_SIGNAL;
