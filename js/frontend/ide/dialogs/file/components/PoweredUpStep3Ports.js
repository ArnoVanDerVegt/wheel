/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const poweredUpModuleConstants = require('../../../../../shared/vm/modules/poweredUpModuleConstants');
const dispatcher               = require('../../../../lib/dispatcher').dispatcher;
const DOMNode                  = require('../../../../lib/dom').DOMNode;
const Button                   = require('../../../../lib/components/input/Button').Button;
const Dropdown                 = require('../../../../lib/components/input/Dropdown').Dropdown;
const getImage                 = require('../../../data/images').getImage;
const PoweredUpDeviceList      = require('./PoweredUpDeviceList').PoweredUpDeviceList;
const PoweredUpDeviceItem      = require('./PoweredUpDeviceItem').PoweredUpDeviceItem;

const devices = [
        {value: 0,                                                                    image: null,                                 color: '#D0D4D8', title: 'No device',  subTitle: ''},
        {value: poweredUpModuleConstants.POWERED_UP_DEVICE_BASIC_MOTOR,               image: 'images/poweredup/motor64.png',       color: '#D0D4D8', title: 'Basic',      subTitle: 'Motor'},
        {value: poweredUpModuleConstants.POWERED_UP_DEVICE_BOOST_TACHO_MOTOR,         image: 'images/poweredup/motorM64.png',      color: '#D0D4D8', title: 'Medium',     subTitle: 'Motor'},
        {value: poweredUpModuleConstants.POWERED_UP_DEVICE_CONTROL_PLUS_LARGE_MOTOR,  image: 'images/poweredup/motorL64.png',      color: '#D0D4D8', title: 'Technic L',  subTitle: 'Motor'},
        {value: poweredUpModuleConstants.POWERED_UP_DEVICE_CONTROL_PLUS_XLARGE_MOTOR, image: 'images/poweredup/motorXL64.png',     color: '#D0D4D8', title: 'Technic XL', subTitle: 'Motor'},
        {value: poweredUpModuleConstants.POWERED_UP_DEVICE_TRAIN_MOTOR,               image: 'images/poweredup/train64.png',       color: '#D0D4D8', title: 'Train',      subTitle: 'Motor'},
        {value: poweredUpModuleConstants.POWERED_UP_DEVICE_LED_LIGHTS,                image: 'images/poweredup/light64.png',       color: '#D0D4D8', title: 'Lights',     subTitle: 'Light'},
        {value: poweredUpModuleConstants.POWERED_UP_DEVICE_BOOST_DISTANCE,            image: 'images/poweredup/lightSensor64.png', color: '#D0D4D8', title: 'Color',      subTitle: 'Sensor'}
    ];

exports.PoweredUpStep3Ports = class extends PoweredUpDeviceList {
    constructor(opts) {
        super(opts);
        opts.deviceList.on('ChangePort', this, this.onChangePort);
    }

    initDropdown(port) {
        return {
            type:      Dropdown,
            getImage:  getImage,
            ref:       this.setRef('port' + port),
            ui:        this._ui,
            uiId:      this._uiId,
            images:    true,
            up:        true,
            items:     devices,
            onChange:  this.onSelectPort.bind(this, port)
        };
    }

    initContent() {
        return {
            ui:        this._ui,
            uiId:      this._uiId,
            className: 'abs dialog-cw dialog-l dialog-b step-content step3',
            children: [
                {
                    className: 'abs list vertical-list',
                    ref:       this.setRef('list'),
                    list:      this._list
                },
                {
                    className: 'abs device-options',
                    children: [
                        this.initDropdown('A'),
                        this.initDropdown('B'),
                        this.initDropdown('C'),
                        this.initDropdown('D')
                    ]
                }
            ]
        };
    }

    onSetActiveIndex(lastActiveIndex, activeIndex, device) {
        super.onSetActiveIndex(lastActiveIndex, activeIndex, device);
        if (!device) {
            return;
        }
        const isPortEnabled = (port) => {
                port = device.getPortInfo(port);
                return port.available && port.enabled;
            };
        let refs = this._refs;
        ['A', 'B', 'C', 'D'].forEach((port) => {
            let dropdown = refs['port' + port];
            dropdown.getDOMNode().style.visibility = isPortEnabled(port) ? 'visible' : 'hidden';
            dropdown.setValue(device.getPortInfo(port).type);
        });
    }

    onSelectPort(port, value) {
        dispatcher.dispatch('Dialog.File.PoweredUpProject.SetPortType', port, value);
    }

    onChangePort(opts) {
        let dropdown = this._refs['port' + opts.port];
        dropdown.getDOMNode().style.visibility = (opts.portInfo.enabled && opts.portInfo.available) ? 'visible' : 'hidden';
        dropdown.setValue(opts.portInfo.type);
    }
};
