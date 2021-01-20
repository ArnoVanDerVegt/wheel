/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher      = require('../../../../../lib/dispatcher').dispatcher;
const DOMNode         = require('../../../../../lib/dom').DOMNode;
const SimulatorPlugin = require('../../lib/SimulatorPlugin').SimulatorPlugin;

exports.Plugin = class extends SimulatorPlugin {
    constructor(opts) {
        super(opts);
        if (!opts.stateConstructor) {
            throw new Error('No state constructor');
        }
        this._ui                  = opts.ui;
        this._title               = opts.title      || false;
        this._layerCount          = opts.layerCount || 4;
        this._portCount           = opts.portCount  || 4;
        this._device              = opts.device;
        this._baseClassName       = ('baseClassName' in opts) ? opts.baseClassName : 'motors';
        this._motors              = [];
        this._interval            = null;
        this._disconnectedTimeout = null;
        this._motorConstructor    = opts.motorConstructor;
        this._stateConstructor    = opts.stateConstructor;
        this.initDOM(opts.parentNode);
        opts.settings.on('Settings.Plugin', this, this.onPluginSettings);
    }

    initDOM(parentNode) {
        let portCount = this._portCount;
        let Motor     = this._motorConstructor;
        let addMotor  = this.addMotor.bind(this);
        let children  = [];
        if (this._title) {
            children.push(this.initTitle(this._title));
        }
        for (let i = 0; i < this._layerCount * portCount; i++) {
            children.push({
                type:             Motor,
                stateConstructor: this._stateConstructor,
                simulator:        this._simulator,
                settings:         this._settings,
                sensors:          this,
                device:           this._device,
                ui:               this._ui,
                layer:            ~~(i / portCount),
                id:               i % portCount,
                title:            String.fromCharCode(65 + (i % portCount)),
                addMotor:         addMotor,
                hidden:           (i >= portCount)
            });
        }
        children.push(this.initExtra());
        this.create(
            parentNode,
            {
                ref:       this.setRef('motors'),
                className: this.getClassName(),
                children:  [this.getMainElement() || null].concat(children)
            }
        );
        this._interval = setInterval(this.onInterval.bind(this), 10);
    }

    initExtra() {
        return null;
    }

    onDeviceConnected() {
        if (this._disconnectedTimeout) {
            clearTimeout(this._disconnectedTimeout);
            this._disconnectedTimeout = null;
        }
    }

    onDeviceDisconnected() {
    }

    onPluginSettings() {
        this._refs.motors.className = this.getClassName();
    }

    onInterval() {
        if (!this.getVisible()) {
            return;
        }
        let motors = this._motors;
        for (let i = 0; i < motors.length; i++) {
            motors[i].update();
        }
    }

    showLayer(layer) {
        let motors = this._motors;
        for (let i = 0; i < motors.length; i++) {
            motors[i].setHidden(layer !== Math.floor(i / this._portCount));
        }
    }

    showMotors() {
        let count      = this.getMotorCount();
        let layer      = this._simulator.getLayer();
        let motors     = this._motors;
        let foundCount = 0;
        for (let i = 0; i < motors.length; i++) {
            if (layer === Math.floor(i / this._portCount)) {
                motors[i].setHidden(foundCount >= count);
                foundCount++;
            } else {
                motors[i].setHidden(true);
            }
        }
    }

    reset() {
        let motors = this._motors;
        for (let i = 0; i < motors.length; i++) {
            motors[i].reset();
        }
    }

    addMotor(motor) {
        this._motors.push(motor);
    }

    callOnMotor(layer, id, func, param) {
        let motor = this.getMotor(layer, id);
        if (motor && motor[func]) {
            return motor[func](param);
        }
        return false;
    }

    getMainElement() {
        return null;
    }

    getMotorCount() {
        return 4;
    }

    getMotor(layer, id) {
        return this._motors[layer * this._portCount + id] || null;
    }

    getType(opts) {
        return this.callOnMotor(opts.layer, opts.id, 'getType');
    }

    setType(opts) {
        this.callOnMotor(opts.layer, opts.id, 'setType', opts.type);
    }

    setSpeed(opts) {
        this.callOnMotor(opts.layer, opts.id, 'setSpeed', opts.speed);
    }

    setPosition(opts) {
        this.callOnMotor(opts.layer, opts.id, 'setPosition', opts.position || 0);
    }

    moveTo(opts) {
        this.callOnMotor(opts.layer, opts.id, 'moveTo', opts.target);
    }

    on(opts) {
        this.callOnMotor(opts.layer, opts.id, 'on');
    }

    timeOn(opts) {
        this.callOnMotor(opts.layer, opts.id, 'timeOn', opts.time);
    }

    stop(opts) {
        this.callOnMotor(opts.layer, opts.id, 'stop');
    }

    read(opts) {
        return this.callOnMotor(opts.layer, opts.id, 'read');
    }

    ready(opts) {
        return this.callOnMotor(opts.layer, opts.id, 'ready');
    }

    readyBits(opts) {
        let layer = opts.layer;
        if ((layer < 0) || (layer > this._layerCount)) {
            return 0;
        }
        let bit    = 1;
        let bits   = opts.bits;
        let result = 1;
        for (let id = 0; id < this._portCount; id++) {
            let motor = this.getMotor(layer, id);
            if ((bits & bit) === bit) {
                if (!motor.ready()) {
                    result = 0;
                    break;
                }
            }
            bit <= 1;
        }
        return result;
    }
};
