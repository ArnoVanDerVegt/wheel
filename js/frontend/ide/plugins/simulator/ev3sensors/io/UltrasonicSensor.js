/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const sensorModuleConstants = require('../../../../../../shared/vm/modules/sensorModuleConstants');
const getImage              = require('../../../../data/images').getImage;
const Sensor                = require('./Sensor').Sensor;

exports.UltrasonicSensor = class extends Sensor {
    initDOM(parentNode) {
        this.initMainDom(
            parentNode,
            'images/ev3/ultrasonic.png',
            true, // With mode
            [
                this.getNumberValueInput()
            ]
        );
        this._refs.numberValue.className = 'value';
    }

    setMode(mode) {
        this._mode                       = mode;
        this._refs.numberValue.className = 'value';
    }

    setValue(value) {
        this._value                    = value;
        this._numberInputElement.value = (this._value === 255) ? '?' : this._value.toFixed(1);
    }

    getContextMenuOptions() {
        return [
            'ULTRASONIC_CM',
            'ULTRASONIC_INCH',
            'ULTRASONIC_LISTEN',
            'ULTRASONIC_SI_CM',
            'ULTRASONIC_SI_INCH',
            'ULTRASONIC_DC_CM',
            'ULTRASONIC_DC_INCH'
        ];
    }

    onChangeNumberValue(event) {
        let value = parseInt(event.target.value, 10);
        if (isNaN(value)) {
            return;
        }
        this._value = Math.min(Math.max(value, 0), 999);
        this.setTimeoutReset();
    }

    onConnected() {
        this._numberInputElement.disabled = 'disabled';
    }

    onDisconnected() {
        this._numberInputElement.disabled = '';
    }

    onResetTimeout() {
        this._numberInputElement.value = 0;
        this._timeoutReset             = null;
        this._value                    = 0;
    }
};
