/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const sensorModuleConstants = require('../../../../../../shared/vm/modules/sensorModuleConstants');
const getImage              = require('../../../../data/images').getImage;
const Sensor                = require('./Sensor').Sensor;

exports.DistanceSensor = class extends Sensor {
    initDOM(parentNode) {
        this.initMainDom(
            parentNode,
            'images/spike/distanceSensor64.png',
            true, // With mode
            [
                this.getNumberValueInput()
            ]
        );
        this._refs.numberValue.className  = 'value';
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
