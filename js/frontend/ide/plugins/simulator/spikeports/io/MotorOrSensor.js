/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const spikeModuleConstants  = require('../../../../../../shared/vm/modules/spikeModuleConstants');
const sensorModuleConstants = require('../../../../../../shared/vm/modules/sensorModuleConstants');
const getImage              = require('../../../../data/images').getImage;
const Motor                 = require('../../lib/motor/io/Motor').Motor;
const MotorOrSensorState    = require('./MotorOrSensorState').MotorOrSensorState;
const deviceInfo            = require('./constants').deviceInfo;

exports.MotorOrSensor = class extends Motor {
    constructor(opts) {
        opts.deviceInfo = deviceInfo;
        opts.MotorState = MotorOrSensorState;
        opts.image      = 'images/spike/motor.svg';
        opts.signal     = {
            assigned: 'Spike.Layer' + opts.layer + '.Assigned' + opts.id,
            changed:  'Spike.Layer' + opts.layer + '.Changed'  + opts.id
        };
        super(opts);
        this._state.on('Type',  this, this.onChangeType);
        this._state.on('Mode',  this, this.onChangeMode);
        this._state.on('Value', this, this.onChangeValue);
        this._state
            .setType(0)
            .setMode(spikeModuleConstants.SPIKE_SENSOR_MODE_DISTANCE);
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
        let positionElement = this._positionElement;
        let state           = this._state;
        let type            = state.getType();
        let value           = state.getValue();
        if (!(type in deviceInfo)) {
            return;
        }
        if (deviceInfo[type].motor) {
            positionElement.style.display = 'block';
            positionElement.innerHTML     = value;
            return;
        }
        let refs = this._refs;
        positionElement.style.display = 'none';
        switch (type) {
            case sensorModuleConstants.SENSOR_TYPE_SPIKE_DISTANCE:
            case sensorModuleConstants.SENSOR_TYPE_SPIKE_COLOR:
            case sensorModuleConstants.SENSOR_TYPE_SPIKE_FORCE:
                refs.colorValue.className         = 'value hidden';
                refs.numberValue.className        = 'value';
                this._numberInputElement.disabled = '';
                this._numberInputElement.value    = value;
                break;
        }
    }

    onClickMotorElement(event) {
        this.onClickTitle(this._refs.sensorTitle, event);
    }
};
