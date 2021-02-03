/**
 * Wheel, copyright (c) 2021 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const path       = require('../../../../shared/lib/path');
const dispatcher = require('../../../lib/dispatcher').dispatcher;
const Dialog     = require('../../../lib/components/Dialog').Dialog;

exports.DefineValueDialog = class extends Dialog {
    constructor(opts) {
        super(opts);
        this.initWindow({
            showSignal: 'Dialog.DefineValue.Show',
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
                        placeholder: 'Enter key'
                    }),
                    this.initTextInputRow({
                        tabIndex:    2,
                        title:       'Value',
                        ref:         'value',
                        placeholder: 'Enter value'
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
                    onClick: this.hide.bind(this)
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
                    //onKeyUp:     this.onFilenameKeyUp.bind(this),
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
                    ref:       this.setRef(opts.ref),
                    tabIndex:  opts.tabIndex,
                    //onKeyUp: this.onFilenameKeyUp.bind(this),
                })
            ]
        };
    }

    onShow(opts) {
        this.show();
    }
};
