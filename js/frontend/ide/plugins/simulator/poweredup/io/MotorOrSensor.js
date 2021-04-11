/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const poweredUpModuleConstants = require('../../../../../../shared/vm/modules/poweredUpModuleConstants');
const getImage                 = require('../../../../data/images').getImage;
const Motor                    = require('../../lib/motor/io/Motor').Motor;
const MotorOrSensorState       = require('./MotorOrSensorState').MotorOrSensorState;
const deviceInfo               = require('./constants').deviceInfo;

exports.MotorOrSensor = class extends Motor {
    constructor(opts) {
        opts.MotorState = MotorOrSensorState;
        opts.image      = 'images/poweredup/motor.svg';
        opts.signal     = {
                assigned: 'PoweredUp.Layer' + opts.layer + '.Assigned' + opts.id,
                changed:  'PoweredUp.Layer' + opts.layer + '.Changed'  + opts.id
            };
        super(opts);
        this._state.on('Type',  this, this.onChangeType);
        this._state.on('Mode',  this, this.onChangeMode);
        this._state.on('Value', this, this.onChangeValue);
        this._state
            .setType(0)
            .setMode(poweredUpModuleConstants.POWERED_UP_SENSOR_MODE_DISTANCE);
    }

    getExtraElements() {
        return [
            this.getColorValueInput(),
            this.getNumberValueInput()
        ];
    }

    setMotorElement(element) {
        this._motorElement = element;
        element.addEventListener('click', this.onClickMotorElement.bind(this));
    }

    getContextMenuOptions() {
        if (this._state.getType() in deviceInfo) {
            return [
                'POWERED_UP_SENSOR_MODE_DISTANCE',
                'POWERED_UP_SENSOR_MODE_COLOR'
            ];
        }
        return [];
    }

    onChangeType() {
        let state = this._state;
        let refs  = this._refs;
        let type  = state.getType();
        let info  = deviceInfo[type];
        refs.sensorTitle.className = 'title';
        refs.colorValue.className  = 'value hidden';
        refs.numberValue.className = 'value hidden';
        if (info) {
            let isMotor = info.motor;
            this._imageElement.style.display = 'block';
            this._speedElement.style.display = 'block';
            this._imageElement.src           = getImage(info.src);
            this._speedElement.style.display = isMotor ? 'block' : 'none';
            if (!isMotor) {
                refs.sensorTitle.className = 'title with-mode';
            }
            if (isMotor || this._device.getConnected()) {
                this._positionElement.style.display = deviceInfo[type].value ? 'block' : 'none';
            } else {
                // Not connected, no motor: allow input in the simulator...
                this._positionElement.style.display = 'none';
            }
        } else {
            this._imageElement.style.display    = 'none';
            this._positionElement.style.display = 'none';
            this._speedElement.style.display    = 'none';
        }
        return this;
    }

    onChangeMode() {
        let state = this._state;
        if (state.getType() !== -1) {
            this.onChangeValue(this._state.getValue());
        }
    }

    onChangeValue() {
        let state           = this._state;
        let positionElement = this._positionElement;
        let value           = state.getValue();
        let type            = state.getType();
        if (!(type in deviceInfo)) {
            return;
        }
        if (deviceInfo[type].motor) {
            positionElement.style.display = 'block';
            positionElement.innerHTML     = value;
            return;
        }
        positionElement.style.display = 'none';
        if (type === poweredUpModuleConstants.POWERED_UP_DEVICE_BOOST_DISTANCE) {
            state._value = value; // Todo: Should be done through subscripion from MotorOrSensorState!!!
            let refs = this._refs;
            switch (state.getMode()) {
                case poweredUpModuleConstants.POWERED_UP_SENSOR_MODE_DISTANCE:
                    refs.colorValue.className         = 'value hidden';
                    refs.numberValue.className        = 'value';
                    this._numberInputElement.disabled = this._device.getConnected() ? 'disabled' : '';
                    this._numberInputElement.value    = value;
                    break;
                case poweredUpModuleConstants.POWERED_UP_SENSOR_MODE_COLOR:
                    refs.numberValue.className = 'value hidden';
                    refs.colorValue.className  = 'value';
                    refs.specialValueInput.setValue(value);
                    refs.specialValueInput.setDisabled(this._device.getConnected());
                    break;
            }
        }
    }

    onClickMotorElement(event) {
        this.onClickTitle(this._refs.sensorTitle, event);
    }
};
