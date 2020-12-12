/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const sensorModuleConstants = require('../../../../../../shared/vm/modules/sensorModuleConstants');
const Checkbox              = require('../../../../../lib/components/input/Checkbox').Checkbox;
const dispatcher            = require('../../../../../lib/dispatcher').dispatcher;
const getImage              = require('../../../../data/images').getImage;
const Sensor                = require('./Sensor').Sensor;

exports.MultiplexerSensor = class extends Sensor {
    initDOM(parentNode) {
        this.initMainDom(
            parentNode,
            'images/ev3/multiplexer64.png',
            false, // With mode
            [
                {
                    ref:       this.setRef('touchValue'),
                    className: 'value multiplexer',
                    children: [
                        {
                            ref:      this.setRef('multiplexerValueInput1'),
                            type:     Checkbox,
                            ui:       this._ui,
                            tabIndex: this._tabIndex,
                            onChange: this.onChangeCheckboxValue.bind(this, 0, 4)
                        },
                        {
                            ref:      this.setRef('multiplexerValueInput2'),
                            type:     Checkbox,
                            ui:       this._ui,
                            tabIndex: this._tabIndex + 1,
                            onChange: this.onChangeCheckboxValue.bind(this, 1, 2)
                        },
                        {
                            ref:      this.setRef('multiplexerValueInput3'),
                            type:     Checkbox,
                            ui:       this._ui,
                            tabIndex: this._tabIndex + 2,
                            onChange: this.onChangeCheckboxValue.bind(this, 2, 1)
                        }
                    ]
                }
            ]
        );
    }

    getValue() {
        let refs = this._refs;
        return (
            (refs.multiplexerValueInput1.getChecked() ? 4 : 0) |
            (refs.multiplexerValueInput2.getChecked() ? 2 : 0) |
            (refs.multiplexerValueInput3.getChecked() ? 1 : 0)
        );
    }

    onChangeValue(value) {
        let refs = this._refs;
        refs.multiplexerValueInput1.setChecked((value & 4) === 4);
        refs.multiplexerValueInput2.setChecked((value & 2) === 2);
        refs.multiplexerValueInput3.setChecked((value & 1) === 1);
        let state = this._state;
        let bit   = 1;
        for (let i = 0; i < 3; i++) {
            dispatcher.dispatch('Sensor.Multiplexer.Changed', state.getId(), 2 - i, ((value & bit) === bit) ? 1 : 0);
            bit <<= 1;
        }
    }

    onChangeCheckboxValue(index, bit, value) {
        let state = this._state;
        if (value) {
            state.setValue(state.getValue() | bit);
        } else {
            state.setValue(state.getValue() & (~bit));
        }
        dispatcher.dispatch('Sensor.Multiplexer.Changed', state.getId(), index, value ? 1 : 0);
    }
};
