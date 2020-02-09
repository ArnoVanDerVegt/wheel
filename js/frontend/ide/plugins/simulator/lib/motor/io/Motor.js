/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../../../../../../lib/dispatcher').dispatcher;
const DOMNode    = require('../../../../../../lib/dom').DOMNode;
const getImage   = require('../../../../../data/images').getImage;
const MotorState = require('./MotorState').MotorState;

exports.Motor = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._type              = -1;
        this._image             = opts.image || 'images/ev3/motorMedium.png';
        this._device            = opts.device;
        this._simulator         = opts.simulator;
        this._layer             = opts.layer;
        this._id                = opts.id;
        this._hidden            = opts.hidden;
        this._title             = opts.title;
        this._motorElement      = null;
        this._imageElement      = null;
        this._positionElement   = null;
        this._readyElement      = null;
        this._speedValueElement = null;
        this._state             = new MotorState(opts);
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
                ]
            }
        );
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
        return this._type;
    }

    setType(type) {
        this._type = type;
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
        this.setType(this._state.getType());
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
        let ready = null;
        if (this._state.update()) {
            this._positionElement.innerHTML = this._state.getPosition();
            if (this._state.getTarget() !== null) {
                ready = this._state.ready();
            }
        } else if (this._device && this._device.getConnected() && (this._type !== -1)) {
            let vm = this._simulator.getVM();
            if (vm) {
                let motorModule = vm.getModules()[6];
                if (motorModule &&  motorModule.getMotorReady) {
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
