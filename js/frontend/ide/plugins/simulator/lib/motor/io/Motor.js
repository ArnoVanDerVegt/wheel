/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const motorModuleConstants = require('../../../../../../../shared/vm/modules/motorModuleConstants');
const dispatcher           = require('../../../../../../lib/dispatcher').dispatcher;
const DOMNode              = require('../../../../../../lib/dom').DOMNode;
const getImage             = require('../../../../../data/images').getImage;
const MotorState           = require('./MotorState').MotorState;
const BasicIODevice        = require('./BasicIODevice').BasicIODevice;

exports.Motor = class extends BasicIODevice {
    constructor(opts) {
        super(opts);
        this._image             = opts.image || 'images/ev3/motorMedium.png';
        this._motorElement      = null;
        this._imageElement      = null;
        this._positionElement   = null;
        this._readyElement      = null;
        this._speedValueElement = null;
        this._state             = opts.MotorState ? new opts.MotorState(opts) : new MotorState(opts);
        this._resetTimeout      = null;
        opts.addMotor(this);
        this.initDOM(opts.parentNode);
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                id:        this.setMotorElement.bind(this),
                className: 'motor' + (this._hidden ? ' hidden' : ''),
                children: [
                    {
                        className: 'title',
                        ref:       this.setRef('sensorTitle'),
                        children: [
                            {
                                type:      'img',
                                className: 'type',
                                src:       getImage(this._image),
                                id:        this.setImageElement.bind(this)
                            },
                            {
                                type:      'span',
                                innerHTML: this._title
                            },
                            {
                                id:        this.setReadyElement.bind(this),
                                className: 'ready',
                                type:      'span'
                            }
                        ]
                    },
                    {
                        id:        this.setSpeedElement.bind(this),
                        className: 'speed',
                        children: [
                            {
                                className: 'speed-bar'
                            },
                            {
                                className: 'speed-bar-center'
                            },
                            {
                                id:        this.setSpeedValueElement.bind(this),
                                className: 'speed-bar-value'
                            }
                        ]
                    },
                    {
                        className: 'position',
                        id:        this.setPositionElement.bind(this)
                    }
                ].concat(this.getExtraElements())
            }
        );
    }

    /**
     * Subclasses can implement this function and add extra elements such as a number input to this device.
    **/
    getExtraElements() {
        return [];
    }

    setReadyElement(element) {
        this._readyElement = element;
    }

    setMotorElement(element) {
        this._motorElement = element;
    }

    setImageElement(element) {
        this._imageElement = element;
    }

    setPositionElement(element) {
        this._positionElement = element;
        element.innerHTML     = '0';
    }

    setSpeedElement(element) {
        this._speedElement = element;
    }

    setSpeedValueElement(element) {
        this._speedValueElement = element;
    }

    setHidden(hidden) {
        this._motorElement.className = 'motor' + (hidden ? ' hidden' : '');
    }

    getType() {
        return this._state.getType();
    }

    setType(type) {
        this._state.setType(type);
    }

    setSpeed(speed) {
        let element = this._speedValueElement;
        speed = this._state.setSpeed(speed);
        if (speed < 0) {
            let w = (-speed / 100) * 24;
            element.style.display = 'block';
            element.style.left    = (29 - w) + 'px';
            element.style.width   = w + 'px';
        } else if (speed === 0) {
            element.style.display = 'none';
        } else {
            element.style.display = 'block';
            element.style.left    = '30px';
            element.style.width   = ((speed / 100) * 24) + 'px';
        }
    }

    reset() {
        this._state.reset();
        this.setSpeed(100);
        this._positionElement.innerHTML = '0';
    }

    setPosition(position) {
        this._state.setPosition(position);
    }

    moveTo(target) {
        this._state.setTarget(target);
    }

    on() {
        this._state.setOn(true);
    }

    timeOn(time) {
    }

    stop() {
        this._state.setOn(false);
    }

    read() {
        return this._state.getPosition();
    }

    ready() {
        return this._state.ready();
    }

    update() {
        let state = this._state;
        if (!state.getIsMotor()) {
            this._readyElement.className = 'ready';
            return;
        }
        let ready = null;
        if (state.update()) { // Update based on local value...
            this._positionElement.innerHTML = state.getPosition();
            if (state.getTarget() !== null) {
                ready = state.ready();
            }
        } else if (this._device && this._device.getConnected() && (state.getType() !== -1)) {
            let vm = this._simulator.getVM();
            if (vm) {
                let motorModule = vm.getModules()[motorModuleConstants.MODULE_MOTOR];
                if (motorModule && motorModule.getMotorReady) {
                    ready = motorModule.getMotorReady(this._layer, this._id);
                }
            }
        }
        if (ready === null) {
            this._readyElement.className = 'ready';
        } else {
            this._readyElement.className = 'ready ' + (ready ? 'yes' : 'no');
        }
    }

    onConnecting() {
        this.setType(-1);
    }

    onDisconnected() {
        this.setType(1);
    }

    onValueChanged(value) {
        this._state.setPosition(value);
        this._positionElement.innerHTML = value;
    }

    onAssigned(assignment) {
    }
};
