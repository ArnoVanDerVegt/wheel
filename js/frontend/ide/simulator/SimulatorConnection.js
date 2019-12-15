/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const sensorModuleConstants = require('../../../shared/vm/modules/sensorModuleConstants');
const dispatcher            = require('../../lib/dispatcher').dispatcher;
const DOMNode               = require('../../lib/dom').DOMNode;

exports.SimulatorConnection = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this.initDOM(opts.parentNode);
        this._disconnectedTimeout = null;
        opts.brick
            .addEventListener('Brick.Connected',    this, this.onBrickConnected)
            .addEventListener('Brick.Connecting',   this, this.onBrickConnecting)
            .addEventListener('Brick.Disconnected', this, this.onBrickDisconnected)
            .addEventListener('Brick.Battery',      this, this.onBrickBattery);
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                id:        this.setConnectPanel.bind(this),
                className: 'connection',
                children: [
                    {
                        id:        this.setConnectStatus.bind(this),
                        innerHTML: 'Connecting...'
                    },
                    {
                        id:        this.setConnectDevice.bind(this),
                        className: 'device-info',
                        innerHTML: 'Device'
                    },
                    {
                        id:        this.setDeviceBattery.bind(this),
                        className: 'device-info',
                        innerHTML: ''
                    }
                ]
            }
        );
    }

    setConnectPanel(element) {
        this._connectPanelElement = element;
    }

    setConnectStatus(element) {
        this._connectStatusElement = element;
    }

    setConnectDevice(element) {
        this._connectDeviceElement = element;
    }

    setDeviceBattery(element) {
        this._deviceBatteryElement = element;
    }

    clearDisconnectedTimeout() {
        if (this._disconnectedTimeout) {
            clear(this._disconnectedTimeout);
        }
        this._disconnectedTimeout = null;
    }

    onBrickConnecting(deviceName) {
        this.clearDisconnectedTimeout();
        this._connectPanelElement.style.display = 'block';
        this._connectStatusElement.innerHTML    = 'Connecting...';
        this._connectDeviceElement.innerHTML    = deviceName;
    }

    onBrickConnected() {
        this.clearDisconnectedTimeout();
        this._connected                      = true;
        this._connectStatusElement.innerHTML = 'Connected.';
    }

    onBrickDisconnected() {
        this.clearDisconnectedTimeout();
        this._connected                      = true;
        this._connectStatusElement.innerHTML = 'Disconnected.';
        this._disconnectedTimeout = setTimeout(
            (function() {
                this._connectPanelElement.style.display = 'none';
                this._disconnectedTimeout               = null;
            }).bind(this),
            5000
        );
    }

    onBrickBattery(battery) {
        this._deviceBatteryElement.innerHTML = 'Battery ' + battery + '%';
    }
};
