/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const DOMNode = require('../../../../../lib/dom').DOMNode;

exports.BluetoothState = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._devices = opts.devices;
        this.initDOM(opts.parentNode);
        this._devices.nxt
            .addEventListener('NXT.Connected',          this, this.updateMessage)
            .addEventListener('NXT.Connecting',         this, this.updateMessage)
            .addEventListener('NXT.Disconnected',       this, this.updateMessage);
        this._devices.ev3
            .addEventListener('EV3.Connected',          this, this.updateMessage)
            .addEventListener('EV3.Connecting',         this, this.updateMessage)
            .addEventListener('EV3.Disconnected',       this, this.updateMessage)
            .addEventListener('EV3.Battery',            this, this.updateMessage);
        this._devices.poweredUp
            .addEventListener('PoweredUp.Connecting',   this, this.updateMessage)
            .addEventListener('PoweredUp.Connected',    this, this.updateMessage)
            .addEventListener('PoweredUp.Disconnected', this, this.updateMessage);
        this._devices.spike
            .addEventListener('Spike.Connecting',       this, this.updateMessage)
            .addEventListener('Spike.Connected',        this, this.updateMessage)
            .addEventListener('Spike.Disconnected',     this, this.updateMessage);
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                className: 'bottom-options connection-state',
                children: [
                    {
                        ref:       this.setRef('bluetoothState'),
                        className: 'bluetooth-state',
                        children: [
                            {
                                className: 'bluetooth-icon'
                            },
                            {
                                ref:       this.setRef('connectionState'),
                                type:      'span',
                                innerHTML: ''
                            }
                        ]
                    }
                ]
            }
        );
        this.updateMessage();
    }

    updateMessage() {
        let message = '';
        let devices = this._devices;
        // NXT...
        if (devices.nxt.getConnecting()) {
            message = 'Connecting to NXT';
        } else if (devices.nxt.getConnected()) {
            message = 'NXT:' + devices.nxt.getConnectionCount() + 'x';
        }
        // EV3...
        if (devices.ev3.getConnecting()) {
            message = 'Connecting to EV3';
        } else if (devices.ev3.getConnected()) {
            message = 'EV3:' + devices.ev3.getDeviceName() + ' ' + devices.ev3.getBattery() + '%';
        }
        // Powered Up...
        let connectionCount = devices.poweredUp.getConnectionCount();
        if (connectionCount > 0) {
            if (message !== '') {
                message += ' * ';
            }
            message += 'Powered Up: ' + connectionCount + 'x';
        }
        if (message !== '') {
            message += '   ';
        }
        // Spike...
        if (devices.spike.getConnecting()) {
            message = 'Connecting to Spike';
        } else if (devices.spike.getConnected()) {
            message = 'Spike:' + devices.spike.getConnectionCount() + 'x';
        }
        let refs = this._refs;
        refs.bluetoothState.className  = 'bluetooth-state' + ((message === '') ? '' : ' visible');
        refs.connectionState.innerHTML = message;
    }
};
