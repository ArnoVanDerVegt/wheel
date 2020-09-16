/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../../../lib/dispatcher').dispatcher;
const Dialog     = require('../../../lib/components/Dialog').Dialog;
const Img        = require('../../../lib/components/basic/Img').Img;
const getImage   = require('../../data/images').getImage;

exports.DeviceAliasDialog = class extends Dialog {
    constructor(opts) {
        opts.title = 'Device alias';
        super(opts);
        this.initWindow('device-alias-dialog', 'Device alias', this.initWindowContent(opts));
        dispatcher.on('Dialog.DeviceAlias.Show', this, this.onShow);
    }

    initWindowContent() {
        return [
            {
                ref:       this.setRef('text'),
                className: 'device-alias-text'
            },
            {
                className: 'device-alias-row',
                children: [
                    this.addTextInput({
                        ref:         this.setRef('alias'),
                        tabIndex:    1,
                        onKeyUp:     this.onAliasKeyUp.bind(this),
                        maxLength:   32,
                        placeholder: 'Enter alias'
                    })
                ]
            },
            {
                className: 'buttons',
                children: [
                    this.addButton({
                        ref:       this.setRef('buttonApply'),
                        tabIndex:  128,
                        value:     'Set device alias',
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
        ];
    }

    onApply() {
        this.hide();
        let refs  = this._refs;
        let alias = refs.alias.getValue().trim();
        if (alias) {
            alias = alias.substr(0, Math.min(alias.length, 32));
            dispatcher.dispatch('Settings.Set.DeviceAlias', this._uuid, alias);
        }
    }

    onAliasKeyUp(event) {
        this._refs.buttonApply.setDisabled(event.target.value.trim() === '');
    }

    onGlobalKeyUp(event) {
        if (event.keyCode === 13) {
            this.onApply();
        } else {
            super.onGlobalKeyUp(event);
        }
        event.preventDefault();
        event.stopPropagation();
    }

    onShow(opts) {
        let refs          = this._refs;
        let dialogElement = this._dialogElement;
        let alias         = ((opts.alias || opts.uuid) + '').trim();
        refs.text.innerHTML = 'Alias for uuid <i>' + opts.uuid + '</i>:';
        refs.alias.setValue(alias);
        refs.buttonApply.setDisabled(alias === '');
        this._uuid = opts.uuid;
        this.show();
    }
};
