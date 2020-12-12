/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const sensorModuleConstants = require('../../../../../../shared/vm/modules/sensorModuleConstants');
const Checkbox              = require('../../../../../lib/components/input/Checkbox').Checkbox;
const getImage              = require('../../../../data/images').getImage;
const Sensor                = require('./Sensor').Sensor;

exports.TouchSensor = class extends Sensor {
    initDOM(parentNode) {
        this.initMainDom(
            parentNode,
            'images/ev3/touch64.png',
            false, // With mode
            [
                {
                    ref:       this.setRef('touchValue'),
                    className: 'value',
                    children: [
                        {
                            ref:      this.setRef('touchValueInput'),
                            type:     Checkbox,
                            ui:       this._ui,
                            tabIndex: this._tabIndex,
                            onChange: this.onChangeCheckboxValue.bind(this)
                        }
                    ]
                }
            ]
        );
    }

    onChangeCheckboxValue(checked) {
        this._state.setValue(checked ? 1 : 0);
    }

    onChangeValue(value) {
        this._refs.touchValueInput.setChecked(value);
    }
};
