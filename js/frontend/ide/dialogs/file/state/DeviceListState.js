/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const poweredUpModuleConstants = require('../../../../../shared/vm/modules/poweredUpModuleConstants');
const Emitter                  = require('../../../../lib/Emitter').Emitter;
const dispatcher               = require('../../../../lib/dispatcher').dispatcher;

class Device {
    constructor(opts) {
        this._index = opts.index;
        this._ports = {
            a: {enabled: false, available: false, type: 0},
            b: {enabled: false, available: false, type: 0},
            c: {enabled: false, available: false, type: 0},
            d: {enabled: false, available: false, type: 0}
        };
        this.setType(opts.type);
    }

    getIndex() {
        return this._index;
    }

    setIndex(index) {
        this._index = index;
    }

    getType() {
        return this._type;
    }

    setType(type) {
        let ports = this._ports;
        switch (type) {
            case poweredUpModuleConstants.POWERED_UP_DEVICE_HUB:
                ports.a.enabled   = true;
                ports.a.available = true;
                ports.b.enabled   = true;
                ports.b.available = true;
                ports.c.enabled   = false;
                ports.c.available = false;
                ports.d.enabled   = false;
                ports.d.available = false;
                break;
            case poweredUpModuleConstants.POWERED_UP_DEVICE_MOVE_HUB:
                ports.a.enabled   = false;
                ports.a.available = true;
                ports.b.enabled   = false;
                ports.b.available = true;
                ports.c.enabled   = true;
                ports.c.available = true;
                ports.d.enabled   = true;
                ports.d.available = true;
                break;
            case poweredUpModuleConstants.POWERED_UP_DEVICE_TECHNIC_HUB:
                ports.a.enabled   = true;
                ports.a.available = true;
                ports.b.enabled   = true;
                ports.b.available = true;
                ports.c.enabled   = true;
                ports.c.available = true;
                ports.d.enabled   = true;
                ports.d.available = true;
                break;
            case poweredUpModuleConstants.POWERED_UP_DEVICE_REMOTE:
                ports.a.enabled   = false;
                ports.a.available = false;
                ports.b.enabled   = false;
                ports.b.available = false;
                ports.c.enabled   = false;
                ports.c.available = false;
                ports.d.enabled   = false;
                ports.d.available = false;
                break;
        }
        this._type = type;
    }

    getPortInfo(port) {
        return this._ports[port.toLowerCase()];
    }

    setPortType(port, type) {
        this._ports[port.toLowerCase()].type = type;
    }
}

exports.DeviceListState = class extends Emitter {
    constructor(opts) {
        super(opts);
        this._list        = [];
        this._activeIndex = 0;
        dispatcher
            .on('Dialog.File.PoweredUpProject.SetActiveIndex', this, this.onSetActiveIndex)
            .on('Dialog.File.PoweredUpProject.SetPortType',    this, this.onSetPortType)
            .on('Dialog.File.PoweredUpProject.AddDevice',      this, this.onAddDevice)
            .on('Dialog.File.PoweredUpProject.UpdateDevice',   this, this.onUpdateDevice)
            .on('Dialog.File.PoweredUpProject.RemoveDevice',   this, this.onRemoveDevice)
            .on('Dialog.File.PoweredUpProject.Reset',          this, this.onReset);
    }

    onSetActiveIndex(activeIndex) {
        let lastActiveIndex = this._activeIndex;
        this._activeIndex = activeIndex;
        this.emit('SetActiveIndex', lastActiveIndex, activeIndex, this._list[activeIndex]);
    }

    onSetPortType(port, type) {
        let device = this._list[this._activeIndex];
        if (device) {
            device.setPortType(port, type);
            this.emit(
                'ChangePort',
                {
                    index:    this._activeIndex,
                    port:     port.toUpperCase(),
                    portInfo: device.getPortInfo(port)
                }
            );
        }
    }

    onAddDevice(type) {
        let list = this._list;
        if (list.length >= 8) {
            return;
        }
        let lastActiveIndex = this._activeIndex;
        this._activeIndex = this._list.length;
        let device = new Device({type: type, index: this._activeIndex});
        list.push(device);
        this
            .emit('AddDevice', device)
            .emit('SetActiveIndex', lastActiveIndex, this._activeIndex, this._list[this._activeIndex]);
    }

    onUpdateDevice(type) {
        let device = this._list[this._activeIndex];
        device.setType(type);
        this.emit('UpdateDevice', device);
        ['A', 'B', 'C', 'D'].forEach((port) => {
            this.emit(
                'ChangePort',
                {
                    index:    this._activeIndex,
                    port:     port,
                    portInfo: device.getPortInfo(port)
                }
            );
        });
    }

    onRemoveDevice(index) {
        let list = this._list;
        list.splice(this._activeIndex, 1);
        list.forEach((device, index) => {
            device.setIndex(index);
        });
        this.emit('RemoveDevice', index);
        if (this._activeIndex >= list.length) {
            this._activeIndex = list.length - 1;
        }
        this.emit('SetActiveIndex', -1, this._activeIndex, this._list[this._activeIndex]);
    }

    onReset() {
        this._list.length = 0;
        this._activeIndex = 0;
    }

    getActiveIndex() {
        return this._activeIndex;
    }

    getList() {
        return this._list;
    }

    toJSON() {
        let result = [];
        this._list.forEach((device) => {
            let item = {
                    type:  device.getType(),
                    ports: []
                };
            ['A', 'B', 'C', 'D'].forEach((port) => {
                item.ports.push(device.getPortInfo(port));
            });
            result.push(item);
        });
        return JSON.parse(JSON.stringify(result));
    }
};
