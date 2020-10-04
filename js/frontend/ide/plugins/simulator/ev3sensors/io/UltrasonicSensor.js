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
            'images/ev3/ultrasonic64.png',
            true, // With mode
            [
                this.getNumberValueInput()
            ]
        );
        this._refs.numberValue.className  = 'value';
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

    onChangeConnected(connected) {

    }

    onChangeValue(value) {
        this._numberInputElement.value = (value === 255) ? '?' : value.toFixed(1);
    }

    onConnected() {
        this._numberInputElement.disabled = 'disabled';
    }

    onDisconnected() {
        this._numberInputElement.disabled = '';
    }
};
