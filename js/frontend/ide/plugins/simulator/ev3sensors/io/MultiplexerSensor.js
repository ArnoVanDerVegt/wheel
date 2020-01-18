/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const sensorModuleConstants = require('../../../../../../shared/vm/modules/sensorModuleConstants');
const Checkbox              = require('../../../../../lib/components/Checkbox').Checkbox;
const dispatcher            = require('../../../../../lib/dispatcher').dispatcher;
const getImage              = require('../../../../data/images').getImage;
const Sensor                = require('./Sensor').Sensor;

exports.MultiplexerSensor = class extends Sensor {
    initDOM(parentNode) {
        this.initMainDom(
            parentNode,
            'images/ev3/multiplexer.png',
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
                            onChange: this.onChangeValue.bind(this, 0)
                        },
                        {
                            ref:      this.setRef('multiplexerValueInput2'),
                            type:     Checkbox,
                            ui:       this._ui,
                            tabIndex: this._tabIndex + 1,
                            onChange: this.onChangeValue.bind(this, 1)
                        },
                        {
                            ref:      this.setRef('multiplexerValueInput3'),
                            type:     Checkbox,
                            ui:       this._ui,
                            tabIndex: this._tabIndex + 2,
                            onChange: this.onChangeValue.bind(this, 2)
                        }
                    ]
                }
            ]
        );
    }

    getValue() {
        let refs = this._refs;
        return (refs.multiplexerValueInput1.getChecked() ? 1 : 0) |
            (refs.multiplexerValueInput2.getChecked() ? 2 : 0)
            (refs.multiplexerValueInput3.getChecked() ? 4 : 0);
    }

    setValue(value) {
        let refs = this._refs;
        this._value = value;
        refs.multiplexerValueInput1.setChecked((value & 1) === 1);
        refs.multiplexerValueInput2.setChecked((value & 2) === 2);
        refs.multiplexerValueInput3.setChecked((value & 4) === 4);
    }

    onChangeValue(index, value) {
        let id = this._sensorContainer.getId();
        dispatcher.dispatch('Sensor.Multiplexer.Changed', id, index, value ? 1 : 0);
        this.setTimeoutReset();
    }

    onResetTimeout() {
        let refs = this._refs;
        let id   = this._sensorContainer.getId();
        refs.multiplexerValueInput1.setChecked(false);
        refs.multiplexerValueInput2.setChecked(false);
        refs.multiplexerValueInput3.setChecked(false);
        dispatcher
            .dispatch('Sensor.Multiplexer.Changed', id, 0, 0)
            .dispatch('Sensor.Multiplexer.Changed', id, 1, 0)
            .dispatch('Sensor.Multiplexer.Changed', id, 2, 0);
        this._timeoutReset = null;
        this._value        = 0;
    }
};
