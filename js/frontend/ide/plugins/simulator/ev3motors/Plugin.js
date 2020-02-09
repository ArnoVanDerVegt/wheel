/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher      = require('../../../../lib/dispatcher').dispatcher;
const DOMNode         = require('../../../../lib/dom').DOMNode;
const SimulatorPlugin = require('../lib/SimulatorPlugin').SimulatorPlugin;
const Plugin          = require('../lib/motor/Plugin').Plugin;
const Motor           = require('./io/Motor').Motor;

exports.Plugin = class extends Plugin {
    constructor(opts) {
        opts.motorConstructor = Motor;
        super(opts);
        this._device
            .addEventListener('EV3.Connected',    this, this.onDeviceConnected)
            .addEventListener('EV3.Disconnected', this, this.onDeviceDisconnected);
    }
};
