/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../../../lib/dispatcher').dispatcher;
const Dialog     = require('../../../lib/components/Dialog').Dialog;
const Checkbox   = require('../../../lib/components/Checkbox').Checkbox;

exports.FindDialog = class extends Dialog {
    addTextRow(text) {
        return {
            className: 'find-dialog-row',
            children: [
                {
                    type:      'span',
                    innerHTML: text
                }
            ]
        };
    }

    addTextInputRow(opts) {
        return {
            className: 'find-dialog-row',
            children: [
                {
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

    addCheckboxRow(opts) {
        return {
            className: 'find-dialog-row',
            children: [
                {
                    innerHTML: opts.title
                },
                {
                    ref:      this.setRef(opts.ref),
                    type:     Checkbox,
                    ui:       this._ui,
                    uiId:     this._uiId,
                    tabIndex: opts.tabIndex
                }
            ]
        };
    }

    addSmallCheckboxRow(opts) {
        return {
            className: 'find-dialog-row small',
            children: [
                {
                    ref:      this.setRef(opts.ref),
                    type:     Checkbox,
                    ui:       this._ui,
                    uiId:     this._uiId,
                    tabIndex: opts.tabIndex,
                    checked:  opts.checked
                },
                {
                    type:     'span',
                    innerHTML: opts.title
                }
            ]
        };
    }

    addButtons(applyTitle) {
        return {
            className: 'buttons',
            children: [
                this.addButton({
                    ref:      this.setRef('buttonApply'),
                    tabIndex: 128,
                    value:    applyTitle,
                    onClick:  this.onApply.bind(this)
                }),
                this.addButton({
                    tabIndex: 129,
                    value:    'Cancel',
                    color:    'dark-green',
                    onClick:  this.hide.bind(this)
                })
            ]
        };
    }
};
