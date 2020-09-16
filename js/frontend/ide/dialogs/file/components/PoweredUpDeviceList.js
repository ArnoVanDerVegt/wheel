/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher          = require('../../../../lib/dispatcher').dispatcher;
const DOMNode             = require('../../../../lib/dom').DOMNode;
const Step                = require('./Step').Step;
const PoweredUpDeviceItem = require('./PoweredUpDeviceItem').PoweredUpDeviceItem;

exports.PoweredUpDeviceList = class extends Step {
    constructor(opts) {
        super(opts);
        this._ports      = opts.ports;
        this._deviceList = opts.deviceList;
        this._list       = [];
        this._deviceList
            .on('AddDevice',      this, this.onAddDevice)
            .on('UpdateDevice',   this, this.onUpdateDevice)
            .on('RemoveDevice',   this, this.onRemoveDevice)
            .on('SetActiveIndex', this, this.onSetActiveIndex);
    }

    reset() {
        while (this._list.length) {
            this._list.pop().remove();
        }
    }

    onAddDevice(device) {
        let list        = this._refs.list;
        let deviceList  = this._deviceList;
        let activeIndex = deviceList.getActiveIndex();
        if (this._list[activeIndex]) {
            this._list[activeIndex].setSelected(false);
        }
        this.create(
            list,
            {
                type:       PoweredUpDeviceItem,
                deviceList: deviceList,
                device:     device,
                index:      device.getIndex(),
                tabIndex:   1 + device.getIndex() * 2,
                ports:      this._ports,
                ui:         this._ui,
                uiId:       this._uiId,
                list:       this._list
            }
        );
    }

    onUpdateDevice(device) {
        this._list[this._deviceList.getActiveIndex()].setDeviceType(device.getType());
    }

    onRemoveDevice(index) {
        let list = this._list;
        if (list[index]) {
            list[index].remove();
        }
        this._list.splice(index, 1);
        this._deviceList.getList().forEach((device, index) => {
            list[index]
                .setIndex(index)
                .setTabIndex(1 + index * 3)
                .setDeviceType(device.getType());
        });
    }

    onSetActiveIndex(lastActiveIndex, activeIndex, device) {
        let list = this._list;
        if (list[lastActiveIndex]) {
            list[lastActiveIndex].setSelected(false);
        }
        if (list[activeIndex]) {
            list[activeIndex].setSelected(true);
        }
    }
};
