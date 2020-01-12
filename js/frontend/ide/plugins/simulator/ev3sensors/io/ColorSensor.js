/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const sensorModuleConstants = require('../../../../../../shared/vm/modules/sensorModuleConstants');
const IconSelect            = require('../../../../../lib/components/IconSelect').IconSelect;
const getImage              = require('../../../../data/images').getImage;
const Sensor                = require('./Sensor').Sensor;

exports.ColorSensor = class extends Sensor {
    initDOM(parentNode) {
        this.initMainDom(
            parentNode,
            'images/ev3/color.png',
            true, // With mode
            [
                {
                    className: 'value hidden',
                    ref:       this.setRef('colorValue'),
                    children: [
                        {
                            ref:      this.setRef('colorValueInput'),
                            type:     IconSelect,
                            ui:       this._ui,
                            tabIndex: this._tabIndex,
                            options:  this.getColorOptions(),
                            onChange: this.onChangeValue.bind(this)
                        }
                    ]
                },
                this.getNumberValueInput()
            ]
        );
    }

    setMode(mode) {
        let refs = this._refs;
        this._mode = mode;
        if (mode === sensorModuleConstants.COLOR_COLOR) {
            refs.numberValue.className = 'value hidden';
            refs.colorValue.className  = 'value';
            refs.colorValueInput.setValue(this._value);
        } else {
            refs.colorValue.className  = 'value hidden';
            refs.numberValue.className = 'value';
        }
    }

    setValue(value) {
       if (this._mode === sensorModuleConstants.COLOR_COLOR) {
           this._value = Math.min(Math.max(value, 0), 7);
           this._refs.colorValueInput.setValue(this._value);
       } else {
           this._value = value;
       }
    }

    getColorOptions() {
        return [
            {value: 0, icon: getImage('images/constants/colorNone.svg')},
            {value: 1, icon: getImage('images/constants/colorBlack.svg')},
            {value: 2, icon: getImage('images/constants/colorBlue.svg')},
            {value: 3, icon: getImage('images/constants/colorGreen.svg')},
            {value: 4, icon: getImage('images/constants/colorYellow.svg')},
            {value: 5, icon: getImage('images/constants/colorRed.svg')},
            {value: 6, icon: getImage('images/constants/colorWhite.svg')},
            {value: 7, icon: getImage('images/constants/colorBrown.svg')}
        ];
    }

    getContextMenuOptions() {
        return [
            'COLOR_REFLECTED',
            'COLOR_AMBIENT',
            'COLOR_COLOR',
            'COLOR_REFLECTED_RAW',
            'COLOR_RGB_RAW',
            'COLOR_CALIBRATION'
        ];
    }

    onConnected() {
        this._numberInputElement.disabled = 'disabled';
        this._refs.colorValueInput.setDisabled(true);
    }

    onDisconnected() {
        this._numberInputElement.disabled = '';
        this._refs.colorValueInput.setDisabled(false);
    }

    onResetTimeout() {
        this._refs.colorValueInput.setValue(0);
        this._timeoutReset = null;
        this._value        = 0;
    }
};
