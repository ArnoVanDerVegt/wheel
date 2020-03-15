/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const sensorModuleConstants = require('../../../../../../shared/vm/modules/sensorModuleConstants');
const getImage              = require('../../../../data/images').getImage;
const Sensor                = require('./Sensor').Sensor;

exports.SoundSensor = class extends Sensor {
    initDOM(parentNode) {
        this.initMainDom(
            parentNode,
            'images/ev3/microphone.png',
            false, // With mode
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

    onChangeNumberValue(event) {
        let value = parseInt(event.target.value, 10);
        if (isNaN(value)) {
            return;
        }
        this._value = value;
        this.setTimeoutReset();
    }

    onConnected() {
        this._numberInputElement.disabled = 'disabled';
    }

    onDisconnected() {
        this._numberInputElement.disabled = '';
    }

    onResetTimeout() {
        this._timeoutReset             = null;
        this._value                    = 0;
        this._numberInputElement.value = 0;
    }
};
