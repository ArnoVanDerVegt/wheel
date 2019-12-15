/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const sensorModuleConstants = require('../../../../shared/vm/modules/sensorModuleConstants');
const dispatcher            = require('../../../lib/dispatcher').dispatcher;
const DOMNode               = require('../../../lib/dom').DOMNode;
const Checkbox              = require('../../../lib/components/Checkbox').Checkbox;
const IconSelect            = require('../../../lib/components/IconSelect').IconSelect;
const getImage              = require('../../data/images').getImage;

exports.Sensor = class extends DOMNode {
    constructor(opts) {
        super(opts);
        let brick = opts.brick;
        this._simulator          = opts.simulator;
        this._layer              = opts.layer;
        this._id                 = opts.id;
        this._ui                 = opts.ui;
        this._sensors            = opts.sensors;
        this._hidden             = opts.hidden;
        this._title              = opts.title;
        this._tabIndex           = opts.tabIndex;
        this._touchValue         = 0;
        this._colorValue         = 0;
        this._infraredValue      = 0;
        this._ultrasonicValue    = 0;
        this._numberInputElement = null;
        this._type               = 0;
        this._mode               = null;
        this._gyroValue          = 0;
        this._soundValue         = 0;
        this._timeoutReset       = null;
        this._timeoutType        = null;
        opts.addSensor(this);
        this.initDOM(opts.parentNode);
        brick
            .addEventListener('Brick.Connecting',                                             this, this.onConnecting)
            .addEventListener('Brick.Connected',                                              this, this.onConnected)
            .addEventListener('Brick.Disconnected',                                           this, this.onDisconnected)
            .addEventListener('Brick.Layer' + this._layer + 'Sensor' + this._id + 'Changed',  this, this.onValueChanged)
            .addEventListener('Brick.Layer' + this._layer + 'Sensor' + this._id + 'Assigned', this, this.onAssigned);
    }

    initDOM(domNode) {
        this.create(
            domNode,
            {
                ref:       this.setRef('sensor'),
                className: 'sensor' + (this._hidden ? ' hidden' : ''),
                children: [
                    {
                        className: 'title',
                        id:        this.setTitleElement.bind(this),
                        children: [
                            {
                                type: 'img',
                                src:  getImage('images/ev3/touch.png'),
                                ref:  this.setRef('image')
                            },
                            {
                                type:      'span',
                                innerHTML: this._title
                            }
                        ]
                    },
                    {
                        ref:       this.setRef('touchValue'),
                        className: 'value',
                        children: [
                            {
                                ref:      this.setRef('touchValueInput'),
                                type:     Checkbox,
                                ui:       this._ui,
                                tabIndex: this._tabIndex,
                                onChange: this.onChangeTouch.bind(this)
                            }
                        ]
                    },
                    {
                        className: 'value hidden',
                        ref:       this.setRef('colorValue'),
                        children: [
                            {
                                ref:      this.setRef('colorValueInput'),
                                type:     IconSelect,
                                ui:       this._ui,
                                tabIndex: this._tabIndex,
                                options:  this.getColorOptions(),
                                onChange: this.onChangeColor.bind(this)
                            }
                        ]
                    },
                    {
                        className: 'value hidden',
                        ref:       this.setRef('infraredValue'),
                        children: [
                            {
                                ref:      this.setRef('infraredValueInput'),
                                type:     IconSelect,
                                ui:       this._ui,
                                tabIndex: this._tabIndex,
                                options:  this.getInfraredOptions(),
                                onChange: this.onChangeInfrared.bind(this)
                            }
                        ]
                    },
                    {
                        className: 'value hidden',
                        ref:       this.setRef('numberValue'),
                        children: [
                            {
                                id:        this.setNumberInputElement.bind(this),
                                type:      'input',
                                ui:        this._ui,
                                tabIndex:  this._tabIndex,
                                inputType: 'text',
                                value:     '0'
                            }
                        ]
                    }
                ]
            }
        );
    }

    onConnecting() {
        this.setType(-1);
    }

    onConnected() {
        let refs = this._refs;
        refs.touchValueInput.setDisabled(true);
        refs.colorValueInput.setDisabled(true);
        refs.infraredValueInput.setDisabled(true);
    }

    onDisconnected() {
        let refs = this._refs;
        refs.touchValueInput.setDisabled(false);
        refs.colorValueInput.setDisabled(false);
        refs.infraredValueInput.setDisabled(false);
    }

    onValueChanged(value) {
        let refs = this._refs;
        switch (this._type) {
            case sensorModuleConstants.SENSOR_TYPE_NXT_TOUCH:
            case sensorModuleConstants.SENSOR_TYPE_TOUCH:
                this._touchValue = value;
                refs.touchValueInput.setChecked(value);
                break;
            case sensorModuleConstants.SENSOR_TYPE_NXT_COLOR:
            case sensorModuleConstants.SENSOR_TYPE_COLOR:
                if (this._mode === sensorModuleConstants.COLOR_COLOR) {
                    this._colorValue = Math.min(Math.max(value, 0), 7);
                    refs.colorValueInput.setValue(this._colorValue);
                } else {
                    this._colorValue = value;
                }
                break;
            case sensorModuleConstants.SENSOR_TYPE_INFRARED:
                if (this._mode === sensorModuleConstants.INFRARED_BUTTON) {
                    this._infraredValue = Math.min(Math.max(value, 0), 11);
                    refs.infraredValueInput.setValue(this._infraredValue);
                } else {
                    this._infraredValue = value;
                }
                break;
            case sensorModuleConstants.SENSOR_TYPE_NXT_ULTRASONIC:
            case sensorModuleConstants.SENSOR_TYPE_ULTRASONIC:
                this._numberInputElement.value = (value === 255) ? '?' : value.toFixed(1);
                this._ultrasonicValue          = value;
                break;
            case sensorModuleConstants.SENSOR_TYPE_GYRO:
                this._numberInputElement.value = value;
                this._gyroValue                = value;
                break;
            case sensorModuleConstants.SENSOR_TYPE_SOUND:
                this._numberInputElement.value = value;
                this._soundValue               = value;
                break;
        }
    }

    onAssigned(assignment, mode) {
        if (mode !== null) {
            mode = parseInt(mode, 10);
        }
        switch (assignment) {
            case sensorModuleConstants.SENSOR_TYPE_NXT_TOUCH:
            case sensorModuleConstants.SENSOR_TYPE_TOUCH:
                this.setType(sensorModuleConstants.SENSOR_TYPE_TOUCH);
                break;
            case sensorModuleConstants.SENSOR_TYPE_NXT_COLOR:
            case sensorModuleConstants.SENSOR_TYPE_COLOR:
                this.setType(sensorModuleConstants.SENSOR_TYPE_COLOR);
                break;
            case sensorModuleConstants.SENSOR_TYPE_NXT_ULTRASONIC:
            case sensorModuleConstants.SENSOR_TYPE_ULTRASONIC:
                this.setType(sensorModuleConstants.SENSOR_TYPE_ULTRASONIC);
                break;
            case sensorModuleConstants.SENSOR_TYPE_GYRO:
                this.setType(sensorModuleConstants.SENSOR_TYPE_GYRO);
                break;
            case sensorModuleConstants.SENSOR_TYPE_INFRARED:
                this.setType(sensorModuleConstants.SENSOR_TYPE_INFRARED);
                break;
            case 0x7E: // None
            case 0x7F: // Port Error
            case 0xFF: // Unknown
            case 0x7D: // Initializing
            case sensorModuleConstants.SENSOR_TYPE_NXT_LIGHT:       // Todo
            case sensorModuleConstants.SENSOR_TYPE_NXT_SOUND:       // Todo
            case sensorModuleConstants.SENSOR_TYPE_NXT_TEMPERATURE: // Todo
                this.setType(-1);
                break;
        }
        this.setMode((this._type === -1) ? null : mode);
    }

    onChangeInfrared(value) {
        this._infraredValue = value;
        this.setTimeoutReset();
    }

    onChangeTouch(value) {
        this._touchValue = value;
        this.setTimeoutReset();
    }

    onChangeColor(value) {
        this._colorValue = value;
        this.setTimeoutReset();
    }

    onChangeNumberValue(event) {
        let value = parseInt(event.target.value, 10);
        if (isNaN(value)) {
            return;
        }
        switch (this._type) {
            case sensorModuleConstants.SENSOR_TYPE_COLOR:
                this._colorValue = value;
                break;
            case sensorModuleConstants.SENSOR_TYPE_INFRARED:
                this._infraredValue = Math.min(Math.max(value, 0), 999);
                break;
            case sensorModuleConstants.SENSOR_TYPE_ULTRASONIC:
                this._ultrasonicValue = Math.min(Math.max(value, 0), 999);
                break;
            case sensorModuleConstants.SENSOR_TYPE_GYRO:
                this._gyroValue = value;
                break;
            case sensorModuleConstants.SENSOR_TYPE_SOUND:
                this._soundValue = value;
                break;
        }
        this.setTimeoutReset();
    }

    onResetTimeout() {
        this._timeoutReset = null;
        if (this._timeoutType !== this._type) {
            return;
        }
        let refs = this._refs;
        switch (this._type) {
            case sensorModuleConstants.SENSOR_TYPE_TOUCH:
                if (this._touchValue !== 0) {
                    this._touchValue = 0;
                    refs.touchValueInput.setChecked(false);
                }
                break;
            case sensorModuleConstants.SENSOR_TYPE_COLOR:
                refs.colorValueInput.setValue(0);
                this._colorValue = 0;
                break;
            case sensorModuleConstants.SENSOR_TYPE_INFRARED:
                this._numberInputElement.value = 0;
                refs.infraredValueInput.setValue(0);
                this._infraredValue = 0;
                break;
            case sensorModuleConstants.SENSOR_TYPE_ULTRASONIC:
                this._ultrasonicValue          = 0;
                this._numberInputElement.value = 0;
                break;
            case sensorModuleConstants.SENSOR_TYPE_GYRO:
                this._gyroValue                = 0;
                this._numberInputElement.value = 0;
                break;
            case sensorModuleConstants.SENSOR_TYPE_SOUND:
                this._soundValue               = 0;
                this._numberInputElement.value = 0;
                break;
        }
    }

    setTitleElement(element) {
        this._titleElement = element;
        element.addEventListener(
            'click',
            (function(event) {
                let offsetX = element.offsetLeft;
                let offsetY = element.offsetTop;
                let parent  = element.offsetParent;
                while (parent) {
                    offsetX += parent.offsetLeft;
                    offsetY += parent.offsetTop;
                    parent = parent.offsetParent;
                }
                parent = element.offsetParent.offsetParent;
                this._sensors.showContextMenu(
                    this,
                    {x: offsetX + parent.scrollLeft, y: offsetY + parent.scrollTop},
                    event
                );
            }).bind(this)
        );
    }

    setTimeoutReset() {
        if (!this._sensors.getAutoReset()) {
            return;
        }
        if (this._timeoutReset) {
            clearTimeout(this._timeoutReset);
        }
        this._timeoutType  = this._type;
        this._timeoutReset = setTimeout(this.onResetTimeout.bind(this), 1500);
    }

    getColorOptions() {
        return [
            {value: 0, icon: getImage('images/constants/colorNone.svg')},
            {value: 1, icon: getImage('images/constants/colorBlack.svg')},
            {value: 2, icon: getImage('images/constants/colorBlue.svg')},
            {value: 3, icon: getImage('images/constants/colorGreen.svg')},
            {value: 4, icon: getImage('images/constants/colorYellow.svg')},
            {value: 5, icon: getImage('images/constants/colorRed.svg')},
            {value: 6, icon: getImage('images/constants/colorWhite.svg')},
            {value: 7, icon: getImage('images/constants/colorBrown.svg')}
        ];
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

    setHidden(hidden) {
        this._hidden                    = hidden;
        this._refs.sensor.style.display = hidden ? 'none' : 'block';
    }

    /**
     * https://stackoverflow.com/questions/469357/html-text-input-allow-only-numeric-input
    **/
    setNumberInputElement(element) {
        this._numberInputElement = element;
        ['input', 'keydown', 'keyup', 'mousedown', 'mouseup', 'select', 'contextmenu', 'drop'].forEach(
            function(event) {
                /* eslint-disable no-invalid-this */
                element.addEventListener(
                    event,
                    function() {
                        if (/^\d*\.?\d*$/.test(this.value)) {
                            this.oldValue           = this.value;
                            this.oldSelectionStart  = this.selectionStart;
                            this.oldSelectionEnd    = this.selectionEnd;
                        } else if (this.hasOwnProperty('oldValue')) {
                            this.value = this.oldValue;
                            this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
                        }
                    }
                );
            }
        );
        ['keyup', 'change'].forEach(
            function(event) {
                element.addEventListener(event, this.onChangeNumberValue.bind(this));
            },
            this
        );
    }

    getType() {
        return this._type;
    }

    getLayer() {
        return this._layer;
    }

    getId() {
        return this._id;
    }

    updateInfrared() {
        let refs = this._refs;
        if (this._type === sensorModuleConstants.SENSOR_TYPE_INFRARED) {
            if (this._mode === sensorModuleConstants.IR_REMOTE) {
                refs.infraredValue.className = 'value';
                refs.infraredValueInput.setValue(this._infraredValue);
            } else {
                refs.numberValue.className = 'value';
            }
        }
    }

    updateColor() {
        let refs = this._refs;
        if (this._mode === sensorModuleConstants.COLOR_COLOR) {
            refs.colorValue.className = 'value';
            refs.colorValueInput.setValue(this._colorValue);
        } else {
            refs.numberValue.className = 'value';
        }
    }

    updateSensorTypeAndMode() {
        let refs = this._refs;
        refs.touchValue.className    = 'value hidden';
        refs.colorValue.className    = 'value hidden';
        refs.infraredValue.className = 'value hidden';
        refs.numberValue.className   = 'value hidden';
        this._titleElement.className = 'title';
        switch (this._type) {
            case -1:
                break;
            case sensorModuleConstants.SENSOR_TYPE_NXT_TOUCH:
            case sensorModuleConstants.SENSOR_TYPE_TOUCH:
                refs.touchValue.className    = 'value';
                break;
            case sensorModuleConstants.SENSOR_TYPE_NXT_COLOR:
            case sensorModuleConstants.SENSOR_TYPE_COLOR:
                this.updateColor();
                this._titleElement.className = 'title with-mode';
                break;
            case sensorModuleConstants.SENSOR_TYPE_INFRARED:
                this.updateInfrared();
                this._titleElement.className = 'title with-mode';
                break;
            case sensorModuleConstants.SENSOR_TYPE_NXT_ULTRASONIC:
            case sensorModuleConstants.SENSOR_TYPE_ULTRASONIC:
            case sensorModuleConstants.SENSOR_TYPE_GYRO:
                refs.numberValue.className   = 'value';
                this._titleElement.className = 'title with-mode';
                break;
            case sensorModuleConstants.SENSOR_TYPE_SOUND:
                refs.numberValue.className   = 'value';
                break;
        }
    }

    setType(type) {
        this._type = type;
        let refs   = this._refs;
        let images = [];
        images[sensorModuleConstants.SENSOR_TYPE_NXT_TOUCH     ] = 'images/ev3/touch.png';
        images[sensorModuleConstants.SENSOR_TYPE_TOUCH         ] = 'images/ev3/touch.png';
        images[sensorModuleConstants.SENSOR_TYPE_NXT_COLOR     ] = 'images/ev3/color.png';
        images[sensorModuleConstants.SENSOR_TYPE_COLOR         ] = 'images/ev3/color.png';
        images[sensorModuleConstants.SENSOR_TYPE_INFRARED      ] = 'images/ev3/infrared.png';
        images[sensorModuleConstants.SENSOR_TYPE_NXT_ULTRASONIC] = 'images/ev3/ultrasonic.png';
        images[sensorModuleConstants.SENSOR_TYPE_ULTRASONIC    ] = 'images/ev3/ultrasonic.png';
        images[sensorModuleConstants.SENSOR_TYPE_GYRO          ] = 'images/ev3/gyro.png';
        images[sensorModuleConstants.SENSOR_TYPE_SOUND         ] = 'images/ev3/microphone.png';
        if (images[type]) {
            refs.image.src           = getImage(images[type]);
            refs.image.style.display = 'block';
        } else {
            refs.image.style.display = 'none';
        }
        this.updateSensorTypeAndMode();
    }

    getMode() {
        return this._mode;
    }

    setMode(mode) {
        this._mode = mode;
        this.updateSensorTypeAndMode();
    }

    reset(reset) {
        let sensor = this.getSensor(reset.id);
        sensor && sensor.reset();
    }

    read() {
        switch (this._type) {
            case sensorModuleConstants.SENSOR_TYPE_NXT_TOUCH:
            case sensorModuleConstants.SENSOR_TYPE_TOUCH:
                return this._touchValue;
            case sensorModuleConstants.SENSOR_TYPE_NXT_COLOR:
            case sensorModuleConstants.SENSOR_TYPE_COLOR:
                return this._colorValue;
            case sensorModuleConstants.SENSOR_TYPE_INFRARED:
                return this._infraredValue;
            case sensorModuleConstants.SENSOR_TYPE_NXT_ULTRASONIC:
            case sensorModuleConstants.SENSOR_TYPE_ULTRASONIC:
                return this._ultrasonicValue;
            case sensorModuleConstants.SENSOR_TYPE_GYRO:
                return this._gyroValue;
            case sensorModuleConstants.SENSOR_TYPE_SOUND:
                return this._soundValue;
        }
        return 0;
    }
};
