/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const sensorModuleConstants = require('../../../shared/vm/modules/sensorModuleConstants');
const dispatcher            = require('../../lib/dispatcher').dispatcher;
const Dialog                = require('../../lib/components/Dialog').Dialog;
const Tabs                  = require('../../lib/components/input/Tabs').Tabs;
const Dropdown              = require('../../lib/components/input/Dropdown').Dropdown;
const getImage              = require('../data/images').getImage;

const SENSORS = [
        {value: 0,                                                                                      color: '#D0D4D8', title: '',                  subTitle: ''},
        {value: sensorModuleConstants.SENSOR_TYPE_NXT_TOUCH,      image: 'images/nxt/touch64.png',      color: '#D0D4D8', title: 'Touch sensor',      subTitle: ''},
        {value: sensorModuleConstants.SENSOR_TYPE_NXT_LIGHT,      image: 'images/nxt/light64.png',      color: '#D0D4D8', title: 'Light sensor',      subTitle: ''},
        {value: sensorModuleConstants.SENSOR_TYPE_NXT_SOUND,      image: 'images/nxt/sound64.png',      color: '#D0D4D8', title: 'Sound sensor',      subTitle: ''},
        {value: sensorModuleConstants.SENSOR_TYPE_NXT_ULTRASONIC, image: 'images/nxt/ultrasonic64.png', color: '#D0D4D8', title: 'Ultrasonic sensor', subTitle: ''},
        {value: sensorModuleConstants.SENSOR_TYPE_NXT_COLOR,      image: 'images/nxt/color64.png',      color: '#D0D4D8', title: 'Color sensor',      subTitle: ''}
    ];

exports.SensorTypeDialog = class extends Dialog {
    constructor(opts) {
        super(opts);
        this._nxt = opts.nxt;
        this.initWindow({
            showSignal: 'Dialog.SensorType.Show',
            width:      416,
            height:     408,
            className:  'no-select sensor-type-dialog',
            title:      'NXT Sensor type'
        });
    }

    initWindowContent(opts) {
        return [
            {
                ref:       this.setRef('text'),
                className: 'abs dialog-lt dialog-cw sensor-type-content',
                children: [
                    {
                        ref:       this.setRef('tabs'),
                        type:      Tabs,
                        ui:        this._ui,
                        uiId:      this._uiId,
                        tabIndex:  1,
                        active:    {title: '1', meta: ''},
                        className: 'abs max-w'
                    },
                    {
                        className: 'abs max-w sensor-list',
                        children: [
                            this.initSensorRow(0),
                            this.initSensorRow(1),
                            this.initSensorRow(2),
                            this.initSensorRow(3)
                        ]
                    }
                ]
            },
            this.initButtons([
                {
                    value:   'Close',
                    onClick: this.hide.bind(this)
                }
            ])
        ];
    }

    initSensorRow(id) {
        return {
            className: 'flt max-w row',
            children: [
                {
                    className: 'flt type-label',
                    innerHTML: 'Input ' + (id + 1)
                },
                {
                    type:      Dropdown,
                    className: 'flt',
                    ref:       this.setRef('input' + id),
                    ui:        this._ui,
                    uiId:      this._uiId,
                    tabIndex:  10,
                    images:    true,
                    getImage:  getImage,
                    items:     SENSORS,
                    onChange:  this.onChangeInput.bind(this, id)
                }
            ]
        };
    }

    onChangeInput(id, value) {
        let layer = parseInt(this._refs.tabs.getActiveTab().title, 10) - 1;
        this._nxt.setType(layer, id, value, 0);
    }

    onSelectLayer(layer) {
        layer = this._nxt.getLayerState(layer);
        let refs    = this._refs;
        let sensors = layer.getSensors();
        for (let i = 0; i < 4; i++) {
            refs['input' + i].setValue(sensors[i].assigned);
        }
    }

    onShow(opts) {
        this.show();
        let tabs = [];
        for (let i = 0; i < this._settings.getNXTDeviceCount(); i++) {
            (function(index) {
                tabs.push({
                    title: (i + 1).toString(),
                    onClick: (function() {
                        this.onSelectLayer(index);
                    }).bind(this)
                });
            }).call(this, i);
        }
        this._refs.tabs
            .setTabs(tabs)
            .setActiveTab('1', '')
            .focus();
        this.onSelectLayer(0);
    }
};
