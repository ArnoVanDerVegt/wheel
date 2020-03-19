/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const sensorModuleConstants = require('../../../../../shared/vm/modules/sensorModuleConstants');
const dispatcher            = require('../../../../lib/dispatcher').dispatcher;
const DOMNode               = require('../../../../lib/dom').DOMNode;
const Checkbox              = require('../../../../lib/components/Checkbox').Checkbox;
const IconSelect            = require('../../../../lib/components/IconSelect').IconSelect;
const getImage              = require('../../../data/images').getImage;
const BasicIOState          = require('../lib/motor/io/BasicIOState').BasicIOState;
const UnknownSensor         = require('./io/UnknownSensor').UnknownSensor;
const ColorSensor           = require('./io/ColorSensor').ColorSensor;
const GyroSensor            = require('./io/GyroSensor').GyroSensor;
const InfraredSensor        = require('./io/InfraredSensor').InfraredSensor;
const SoundSensor           = require('./io/SoundSensor').SoundSensor;
const TouchSensor           = require('./io/TouchSensor').TouchSensor;
const UltrasonicSensor      = require('./io/UltrasonicSensor').UltrasonicSensor;
const MultiplexerSensor     = require('./io/MultiplexerSensor').MultiplexerSensor;

exports.SensorContainer = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._opts               = opts;
        this._hidden             = opts.hidden;
        this._currentConstructor = null;
        this._currentSensor      = null;
        this._sensorConstructors = [];
        opts.addSensor(this);
        opts.device
           .addEventListener('EV3.Layer' + this._layer + 'Sensor' + this._id + 'Changed',  this, this.onValueChanged)
           .addEventListener('EV3.Layer' + this._layer + 'Sensor' + this._id + 'Assigned', this, this.onAssigned);
        this
            .initSensorConstructors()
            .initDOM(opts.parentNode);
    }

    initSensorConstructors() {
        this._sensorConstructors[sensorModuleConstants.SENSOR_TYPE_NXT_TOUCH     ] = TouchSensor;
        this._sensorConstructors[sensorModuleConstants.SENSOR_TYPE_TOUCH         ] = TouchSensor;
        this._sensorConstructors[sensorModuleConstants.SENSOR_TYPE_NXT_COLOR     ] = ColorSensor;
        this._sensorConstructors[sensorModuleConstants.SENSOR_TYPE_COLOR         ] = ColorSensor;
        this._sensorConstructors[sensorModuleConstants.SENSOR_TYPE_NXT_ULTRASONIC] = UltrasonicSensor;
        this._sensorConstructors[sensorModuleConstants.SENSOR_TYPE_ULTRASONIC    ] = UltrasonicSensor;
        this._sensorConstructors[sensorModuleConstants.SENSOR_TYPE_GYRO          ] = GyroSensor;
        this._sensorConstructors[sensorModuleConstants.SENSOR_TYPE_INFRARED      ] = InfraredSensor;
        this._sensorConstructors[sensorModuleConstants.SENSOR_TYPE_NXT_SOUND     ] = SoundSensor;
        this._sensorConstructors[64                                              ] = MultiplexerSensor;
        return this;
    }

    initSensor(sensorConstructor) {
        this._currentConstructor = sensorConstructor;
        let opts = Object.assign({}, this._opts);
        opts.type             = sensorConstructor;
        opts.sensorContainer  = this;
        opts.stateConstructor = BasicIOState;
        return opts;
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                ref:       this.setRef('sensor'),
                className: 'sensor-container' + (this._hidden ? ' hidden' : ''),
                children: [
                    this.initSensor(UnknownSensor)
                ]
            }
        );
    }

    onValueChanged(value) {
        let currentSensor = this._currentSensor;
        if (currentSensor && currentSensor.setValue) {
            currentSensor.setValue(value);
        }
    }

    onAssigned(assignment, mode) {
        let currentConstructor = this._sensorConstructors[assignment] || UnknownSensor;
        if (currentConstructor !== this._currentConstructor) {
            if (this._currentSensor) {
                this._currentSensor.remove();
                this._currentSensor = null;
            }
            if (currentConstructor !== null) {
                let opts = this.initSensor(currentConstructor);
                opts.parentNode = this._refs.sensor;
                new currentConstructor(opts);
            }
            this._currentConstructor = currentConstructor;
        }
        if (this._currentSensor && (mode !== null)) {
            this._currentSensor.getState().setMode(parseInt(mode, 10));
        }
    }

    getCurrentSensor() {
        return this._currentSensor;
    }

    setCurrentSensor(currentSensor) {
        if (this._currentSensor) {
            this._currentSensor.remove();
        }
        this._currentSensor = currentSensor;
    }

    setHidden(hidden) {
        this._hidden                    = hidden;
        this._refs.sensor.style.display = hidden ? 'none' : 'block';
    }

    read() {
        return this._currentSensor ? this._currentSensor.getState().getValue() : 0;
    }
};
