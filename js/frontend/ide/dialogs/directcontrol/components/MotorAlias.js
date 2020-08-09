/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const motorModuleConstants = require('../../../../../shared/vm/modules/motorModuleConstants');
const DOMNode              = require('../../../../lib/dom').DOMNode;
const Button               = require('../../../../lib/components/Button').Button;
const Slider               = require('../../../../lib/components/Slider').Slider;
const dispatcher           = require('../../../../lib/dispatcher').dispatcher;

exports.MotorAlias = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._settings = opts.settings;
        this._ui       = opts.ui;
        this._uiId     = opts.uiId;
        this._alias    = opts.alias;
        this._index    = opts.index;
        this._dialog   = opts.dialog;
        this._device   = opts.device;
        this.initDOM(opts.parentNode);
        opts.id(this);
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                id:        this.setElement.bind(this),
                innerHTML: this._alias,
                className: 'motor-alias ' + ((this._index === 3) ? 'last' : '')
            }
        );
    }

    setElement(element) {
        this._element = element;
        element.addEventListener(
            'click',
            () => {
                dispatcher.dispatch(
                    'Dialog.DevicePortAlias.Show',
                    {
                        onApply: this.onChangeAlias.bind(this),
                        port:    this._index,
                        alias:   this._settings.getDevicePortAlias(this.getDeviceUUID(), this._index)
                    }
                );
            }
        );
    }

    getDeviceUUID() {
        return this._device.getLayerState(this._dialog.getLayer()).getUUID();
    }

    onChangeAlias(port, alias) {
        dispatcher.dispatch('Settings.Set.DevicePortAlias', this.getDeviceUUID(), port, alias);
        this.update();
    }

    update() {
        this._element.innerHTML = this._settings.getDevicePortAlias(this.getDeviceUUID(), this._index);
    }
};
