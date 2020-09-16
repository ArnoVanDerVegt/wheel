/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const sensorModuleConstants = require('../../../../../../shared/vm/modules/sensorModuleConstants');
const IconSelect            = require('../../../../../lib/components/IconSelect').IconSelect;
const getImage              = require('../../../../data/images').getImage;
const Sensor                = require('./Sensor').Sensor;

exports.InfraredSensor = class extends Sensor {
    initDOM(parentNode) {
        this.initMainDom(
            parentNode,
            'images/ev3/infrared64.png',
            true, // With mode
            [
                {
                    className: 'value hidden',
                    ref:       this.setRef('infraredValue'),
                    children: [
                        {
                            type:     IconSelect,
                            ref:      this.setRef('specialValueInput'),
                            ui:       this._ui,
                            tabIndex: this._tabIndex,
                            options:  this.getInfraredOptions(),
                            onChange: this.onChangeRemoteValue.bind(this),
                            disabled: this._state.getConnected()
                        }
                    ]
                },
                this.getNumberValueInput()
            ]
        );
    }

    onChangeRemoteValue(value) {
        this._state.setValue(value);
    }

    onChangeValue(value) {
        if (this._state.getMode() === sensorModuleConstants.IR_REMOTE) {
            this._refs.specialValueInput.setValue(Math.min(Math.max(value, 0), 11));
        } else {
            this._numberInputElement.value = value;
        }
    }

    onChangeMode(mode) {
        let refs = this._refs;
        if (mode === sensorModuleConstants.IR_REMOTE) {
            refs.numberValue.className   = 'value hidden';
            refs.infraredValue.className = 'value';
            refs.specialValueInput.setValue(Math.min(Math.max(this._state.getValue(), 0), 11));
        } else {
            refs.infraredValue.className = 'value hidden';
            refs.numberValue.className   = 'value';
        }
    }

    getInfraredOptions() {
        return [
            {value:  0, icon: getImage('images/constants/button00.svg')},
            {value:  1, icon: getImage('images/constants/button01.svg')},
            {value:  2, icon: getImage('images/constants/button02.svg')},
            {value:  3, icon: getImage('images/constants/button03.svg')},
            {value:  4, icon: getImage('images/constants/button04.svg')},
            {value:  5, icon: getImage('images/constants/button05.svg')},
            {value:  6, icon: getImage('images/constants/button06.svg')},
            {value:  7, icon: getImage('images/constants/button07.svg')},
            {value:  8, icon: getImage('images/constants/button08.svg')},
            {value:  9, icon: getImage('images/constants/button09.svg')},
            {value: 10, icon: getImage('images/constants/button10.svg')},
            {value: 11, icon: getImage('images/constants/button11.svg')}
        ];
    }

    getContextMenuOptions() {
        return [
            'IR_PROXIMITY',
            'IR_SEEKER',
            'IR_REMOTE',
            'IR_REMOTE_ADVANCED',
            'IR_NOT_UTILIZED',
            'IR_CALIBRATION'
        ];
    }
};
