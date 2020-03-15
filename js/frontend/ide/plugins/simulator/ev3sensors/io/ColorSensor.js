/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const sensorModuleConstants = require('../../../../../../shared/vm/modules/sensorModuleConstants');
const getImage              = require('../../../../data/images').getImage;
const Sensor                = require('./Sensor').Sensor;

exports.ColorSensor = class extends Sensor {
    initDOM(parentNode) {
        this.initMainDom(
            parentNode,
            'images/ev3/color.png',
            true, // With mode
            [
                this.getColorValueInput(),
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
            this._value                    = value;
            this._numberInputElement.value = value;
       }
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
        this._numberInputElement.value = 0;
        this._timeoutReset = null;
        this._value        = 0;
    }
};
