/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../../../../lib/dispatcher').dispatcher;
const DOMNode    = require('../../../../lib/dom').DOMNode;
const Plugin     = require('../lib/motor/Plugin').Plugin;
const Motor      = require('./io/Motor').Motor;
const MotorState = require('./io/MotorState').MotorState;

exports.Plugin = class extends Plugin {
    constructor(opts) {
        opts.device           = opts.devices.ev3;
        opts.motorConstructor = Motor;
        opts.stateConstructor = MotorState;
        opts.title            = 'EV3 Motors';
        super(opts);
        this._device
            .addEventListener('EV3.Connected',    this, this.onDeviceConnected)
            .addEventListener('EV3.Disconnected', this, this.onDeviceDisconnected);
    }
};
