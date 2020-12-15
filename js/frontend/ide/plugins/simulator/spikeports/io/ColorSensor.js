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
            'images/spike/colorSensor64.png',
            true, // With mode
            [
                this.getColorValueInput(),
                this.getNumberValueInput()
            ]
        );
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

    onChangeValue(value) {
       if (this._state.getMode() === sensorModuleConstants.COLOR_COLOR) {
            this._refs.specialValueInput.setValue(Math.min(Math.max(value, 0), 7));
       } else {
            this._numberInputElement.value = value;
       }
    }

    onChangeMode(mode) {
        let refs = this._refs;
        if (mode === sensorModuleConstants.COLOR_COLOR) {
            refs.numberValue.className = 'value hidden';
            refs.colorValue.className  = 'value';
            refs.specialValueInput.setValue(this._value);
        } else {
            refs.colorValue.className  = 'value hidden';
            refs.numberValue.className = 'value';
        }
    }

    onConnected() {
        this._numberInputElement.disabled = 'disabled';
        this._refs.specialValueInput.setDisabled(true);
    }

    onDisconnected() {
        this._numberInputElement.disabled = '';
        this._refs.specialValueInput.setDisabled(false);
    }
};
