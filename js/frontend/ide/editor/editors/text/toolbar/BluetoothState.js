/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const DOMNode = require('../../../../../lib/dom').DOMNode;

exports.BluetoothState = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._ev3       = opts.ev3;
        this._poweredUp = opts.poweredUp;
        this.initDOM(opts.parentNode);
        this._ev3
            .addEventListener('EV3.Connected',    this, this.updateMessage)
            .addEventListener('EV3.Connecting',   this, this.updateMessage)
            .addEventListener('EV3.Disconnected', this, this.updateMessage)
            .addEventListener('EV3.Battery',      this, this.updateMessage);
        this._poweredUp
            .addEventListener('PoweredUp.Connecting', this, this.updateMessage)
            .addEventListener('PoweredUp.Connected',  this, this.updateMessage);
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
        let ev3     = this._ev3;
        if (ev3.getConnecting()) {
            message = 'Connecting to EV3';
        } else if (ev3.getConnected()) {
            message = 'EV3:' + ev3.getDeviceName() + ' ' + ev3.getBattery() + '%';
        }
        let connectionCount = this._poweredUp.getConnectionCount();
        if (connectionCount > 0) {
            if (message !== '') {
                message += ' * ';
            }
            message += 'Powered Up: ' + connectionCount + 'x';
        }
        if (message !== '') {
            message += '   ';
        }
        let refs = this._refs;
        refs.bluetoothState.className  = 'bluetooth-state' + ((message === '') ? '' : ' visible');
        refs.connectionState.innerHTML = message;
    }
};
