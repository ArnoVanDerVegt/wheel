/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const poweredUpModuleConstants = require('../../../../../shared/vm/modules/poweredUpModuleConstants');
const dispatcher               = require('../../../../lib/dispatcher').dispatcher;
const DOMNode                  = require('../../../../lib/dom').DOMNode;
const Button                   = require('../../../../lib/components/Button').Button;
const Dropdown                 = require('../../../../lib/components/Dropdown').Dropdown;
const getImage                 = require('../../../data/images').getImage;
const PoweredUpDeviceList      = require('./PoweredUpDeviceList').PoweredUpDeviceList;
const PoweredUpDeviceItem      = require('./PoweredUpDeviceItem').PoweredUpDeviceItem;

exports.PoweredUpStep2Device = class extends PoweredUpDeviceList {
    constructor(opts) {
        super(opts);
    }

    initContent() {
        return {
            className: 'step-content step2',
            children: [
                {
                    className: 'list vertical-list',
                    ref:       this.setRef('list'),
                    list:      this._list
                },
                {
                    className: 'device-options',
                    children: [
                        {
                            type:     Button,
                            ref:      this.setRef('addButton'),
                            ui:       this._ui,
                            uiId:     this._uiId,
                            onClick:  this.onAdd.bind(this),
                            value:    'Add',
                            color:    'blue'
                        },
                        {
                            type:     Button,
                            ref:      this.setRef('updateButton'),
                            ui:       this._ui,
                            uiId:     this._uiId,
                            onClick:  this.onUpdate.bind(this),
                            value:    'Update',
                            color:    'blue',
                            disabled: true
                        },
                        {
                            type:      Dropdown,
                            getImage:  getImage,
                            ref:       this.setRef('devices'),
                            ui:        this._ui,
                            uiId:      this._uiId,
                            images:    true,
                            up:        true,
                            items: [
                                {value: poweredUpModuleConstants.POWERED_UP_DEVICE_HUB,         image: 'images/poweredup/hub64.png',        color: '#D0D4D8', title: 'Hub',            subTitle: 'Hub'},
                                {value: poweredUpModuleConstants.POWERED_UP_DEVICE_MOVE_HUB,    image: 'images/poweredup/moveHub64.png',    color: '#D0D4D8', title: 'Move hub',       subTitle: 'Hub'},
                                {value: poweredUpModuleConstants.POWERED_UP_DEVICE_TECHNIC_HUB, image: 'images/poweredup/technicHub64.png', color: '#D0D4D8', title: 'Technic hub',    subTitle: 'Hub'},
                                {value: poweredUpModuleConstants.POWERED_UP_DEVICE_REMOTE,      image: 'images/poweredup/remote64.png',     color: '#D0D4D8', title: 'Remote control', subTitle: 'Remote'}
                            ]
                        }
                    ]
                }
            ]
        };
    }

    onAdd() {
        dispatcher.dispatch('Dialog.File.PoweredUpProject.AddDevice', this._refs.devices.getValue());
    }

    onAddDevice(device) {
        super.onAddDevice(device);
        this._dialog.setNextEnabled(true);
        let refs = this._refs;
        refs.addButton.setDisabled(this._deviceList.getList().length >= 8);
        refs.updateButton.setDisabled(false);
    }

    onRemoveDevice(index) {
        super.onRemoveDevice(index);
        let enabled = this._deviceList.getList().length;
        this._dialog.setNextEnabled(enabled);
        this._refs.updateButton.setDisabled(enabled);
    }

    onUpdate() {
        dispatcher.dispatch('Dialog.File.PoweredUpProject.UpdateDevice', this._refs.devices.getValue());
    }

    update() {
        this._dialog.setNextEnabled(this._deviceList.getList().length);
        return this;
    }
};
