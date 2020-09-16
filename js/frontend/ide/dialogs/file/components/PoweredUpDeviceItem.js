/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const poweredUpModuleConstants = require('../../../../../shared/vm/modules/poweredUpModuleConstants');
const dispatcher               = require('../../../../lib/dispatcher').dispatcher;
const DOMNode                  = require('../../../../lib/dom').DOMNode;
const Button                   = require('../../../../lib/components/Button').Button;
const CloseButton              = require('../../../../lib/components/CloseButton').CloseButton;
const Dropdown                 = require('../../../../lib/components/Dropdown').Dropdown;
const getImage                 = require('../../../data/images').getImage;

let infoByDeviceType = {};
infoByDeviceType[poweredUpModuleConstants.POWERED_UP_DEVICE_HUB        ] = {image: 'images/poweredup/hub64.png',        name: 'Hub'};
infoByDeviceType[poweredUpModuleConstants.POWERED_UP_DEVICE_MOVE_HUB   ] = {image: 'images/poweredup/moveHub64.png',    name: 'Move hub'};
infoByDeviceType[poweredUpModuleConstants.POWERED_UP_DEVICE_TECHNIC_HUB] = {image: 'images/poweredup/technicHub64.png', name: 'Technic hub'};
infoByDeviceType[poweredUpModuleConstants.POWERED_UP_DEVICE_REMOTE     ] = {image: 'images/poweredup/remote64.png',     name: 'Remote control'};

let infoByPortType = {};
infoByPortType[poweredUpModuleConstants.POWERED_UP_DEVICE_BASIC_MOTOR              ] = {image: 'images/poweredup/motor64.png'};
infoByPortType[poweredUpModuleConstants.POWERED_UP_DEVICE_BOOST_TACHO_MOTOR        ] = {image: 'images/poweredup/motorM64.png'};
infoByPortType[poweredUpModuleConstants.POWERED_UP_DEVICE_CONTROL_PLUS_LARGE_MOTOR ] = {image: 'images/poweredup/motorL64.png'};
infoByPortType[poweredUpModuleConstants.POWERED_UP_DEVICE_CONTROL_PLUS_XLARGE_MOTOR] = {image: 'images/poweredup/motorXL64.png'};
infoByPortType[poweredUpModuleConstants.POWERED_UP_DEVICE_TRAIN_MOTOR              ] = {image: 'images/poweredup/train64.png'};
infoByPortType[poweredUpModuleConstants.POWERED_UP_DEVICE_LED_LIGHTS               ] = {image: 'images/poweredup/light64.png'};
infoByPortType[poweredUpModuleConstants.POWERED_UP_DEVICE_BOOST_DISTANCE           ] = {image: 'images/poweredup/lightSensor64.png'};

exports.PoweredUpDeviceItem = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._ui            = opts.ui;
        this._uiId          = opts.uiId;
        this._index         = opts.index;
        this._list          = opts.list;
        this._onChangePort  = opts.deviceList.on('ChangePort', this, this.onChangePort);
        this._list.push(this);
        this.initDOM(opts);
    }

    initDeviceItem(opts) {
        return {
            className: 'device-item',
            children: [
                {
                    type:      'img',
                    ref:       this.setRef('deviceImage'),
                    src:       getImage(infoByDeviceType[opts.device.getType()].image)
                },
                {
                    className: 'value',
                    ref:       this.setRef('deviceValue'),
                    innerHTML: this._index + 1
                }
            ]
        };
    }

    initDeviceInfo(opts) {
        return {
            className: 'device-info',
            children: [
                {
                    ref:       this.setRef('deviceNumber'),
                    className: 'device-title',
                    innerHTML: 'Device ' + (this._index + 1)
                },
                {
                    ref:       this.setRef('deviceName'),
                    className: 'device-description',
                    innerHTML: infoByDeviceType[opts.device.getType()].name
                }
            ]
        };
    }

    initPortItem(opts, port) {
        let portInfo = opts.device.getPortInfo(port);
        return {
            ref:       this.setRef('portItem' + port),
            className: 'port-item' + (port === 'D' ? ' last' : ''),
            style: {
                visibility: portInfo.available ? 'visible' : 'hidden',
                opacity:    portInfo.enabled   ? 1         : 0.5
            },
            children: [
                {
                    ref:       this.setRef('port' + port),
                    type:      'img',
                    style: {
                        display: ((portInfo.type !== 0) && portInfo.available) ? 'block' : 'none'
                    }
                },
                {
                    className: 'value',
                    innerHTML: port
                }
            ]
        };
    }

    initRemoveButton() {
        return {
            type:      CloseButton,
            ref:       this.setRef('removeButton'),
            ui:        this._ui,
            uiId:      this._uiId,
            tabIndex:  this._tabIndex + 1,
            onClick:   this.onRemove.bind(this)
        };
    }

    initDOM(opts) {
        let children = [
                {
                    id:       this.setElement.bind(this),
                    type:     'a',
                    href:     '#',
                    tabIndex: this._tabIndex
                },
                this.initDeviceItem(opts),
                this.initDeviceInfo(opts)
            ];
        if (opts.ports) {
            children.push(
                this.initPortItem(opts, 'D'),
                this.initPortItem(opts, 'C'),
                this.initPortItem(opts, 'B'),
                this.initPortItem(opts, 'A')
            );
        } else {
            children.push(this.initRemoveButton());
        }
        this.create(
            opts.parentNode,
            {
                ref:       this.setRef('item'),
                className: 'vertical-list-item selected',
                children:  children
            }
        );
    }

    remove() {
        this._onChangePort();
        let item = this._refs.item;
        item.parentNode.removeChild(item);
    }

    setSelected(selected) {
        this._refs.item.className = 'vertical-list-item' + (selected ? ' selected' : '');
    }

    setElement(element) {
        this._element = element;
        element.addEventListener('click',     this.onClick.bind(this));
        element.addEventListener('mousedown', this.onCancelEvent.bind(this));
        element.addEventListener('mouseup',   this.onMouseUp.bind(this));
        element.addEventListener('focus',     this.onFocus.bind(this));
    }

    setIndex(index) {
        this._index = index;
        let refs = this._refs;
        refs.deviceValue.innerHTML  = index + 1;
        refs.deviceNumber.innerHTML = 'Device ' + (index + 1);
        return this;
    }

    setTabIndex(tabIndex) {
        this._element.tabIndex = tabIndex;
        let removeButton = this._refs.removeButton;
        if (removeButton) {
            removeButton.setTabIndex(tabIndex + 1);
        }
        return this;
    }

    setDeviceType(deviceType) {
        let refs = this._refs;
        let info = infoByDeviceType[deviceType];
        refs.deviceName.innerHTML = info.name;
        refs.deviceImage.style    =
        refs.deviceImage.src      = getImage(info.image);
    }

    onChangePort(opts) {
        if (opts.index !== this._index) {
            return;
        }
        let port      = opts.port;
        let portInfo  = opts.portInfo;
        let refs      = this._refs;
        let portImage = refs['port' + port];
        let portItem  = refs['portItem' + port];
        if (!portImage) {
            return;
        }
        portItem.style.visibility = portInfo.available ? 'visible' : 'hidden';
        if (portInfo.available) {
            portImage.style.display = 'none';
            if (portInfo.enabled) {
                portImage.style.display = 'block';
                portItem.style.opacity  = 1;
                if (portInfo.type) {
                    portImage.style.display = 'block';
                    portImage.src           = getImage(infoByPortType[portInfo.type].image);
                } else {
                    portImage.style.display = 'none';
                }
            } else {
                portItem.style.opacity  = 0.5;
                portImage.style.display = 'none';
            }
        }
    }

    onRemove() {
        let index = this._index;
        dispatcher
            .dispatch('Dialog.File.PoweredUpProject.SetActiveIndex', index)
            .dispatch('Dialog.File.PoweredUpProject.RemoveDevice',   index);
    }

    onFocus(event) {
        dispatcher.dispatch('Dialog.File.PoweredUpProject.SetActiveIndex', this._index);
    }

    onClick(event) {
        this.onCancelEvent(event);
        dispatcher.dispatch('Dialog.File.PoweredUpProject.SetActiveIndex', this._index);
    }

    onMouseUp(event) {
        this.onCancelEvent(event);
        this._element.focus();
    }
};
