/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const sensorModuleConstants = require('../../../../../../shared/vm/modules/sensorModuleConstants');
const getImage              = require('../../../../data/images').getImage;
const Sensor                = require('./Sensor').Sensor;

exports.GyroSensor = class extends Sensor {
    initDOM(parentNode) {
        this.initMainDom(
            parentNode,
            'images/ev3/gyro.png',
            true, // With mode
            [
                this.getNumberValueInput()
            ]
        );
        this._refs.numberValue.className = 'value';
    }

    setValue(value) {
        this._value                    = value;
        this._numberInputElement.value = value;
    }

    getContextMenuOptions() {
        return [
            'GYRO_ANGLE',
            'GYRO_RATE',
            'GYRO_FAST',
            'GYRO_RATE_AND_ANGLE',
            'GYRO_CALIBRATION'
        ];
    }

    onConnected() {
        this._numberInputElement.disabled = 'disabled';
    }

    onDisconnected() {
        this._numberInputElement.disabled = '';
    }

    onResetTimeout() {
        this._timeoutReset = null;
        this._value        = 0;
    }
};
