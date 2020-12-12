/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const DOMNode    = require('../../../../../lib/dom').DOMNode;
const dispatcher = require('../../../../../lib/dispatcher').dispatcher;
const Button     = require('../../../../../lib/components/input/Button').Button;

let colors = [];
colors[  0] = 'black';
colors[  1] = 'pink';
colors[  2] = 'purple';
colors[  3] = 'blue';
colors[  4] = 'light-blue';
colors[  5] = 'cyan';
colors[  6] = 'green';
colors[  7] = 'yellow';
colors[  8] = 'orange';
colors[  9] = 'red';
colors[ 10] = 'white';
colors[255] = 'none';

exports.BasicHub = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._settings = opts.settings;
        this._ui       = opts.ui;
        this._device   = opts.device;
        this._light    = null;
        this._device
            .addEventListener('PoweredUp.Connected',    this, this.onDeviceConnected)
            .addEventListener('PoweredUp.Disconnected', this, this.onDeviceDisconnected);
    }

    getVectorRow(ref, title, addZ) {
        return [
            {
                className: 'flt max-w hub-state-row',
                children: [
                    {
                        type:      'span',
                        innerHTML: title
                    }
                ]
            },
            {
                className: 'flt max-w hub-state-row',
                children: [
                    {
                        ref:       this.setRef(ref + 'X'),
                        className: 'xyz',
                        innerHTML: 'x'
                    },
                    {
                        ref:       this.setRef(ref + 'Y'),
                        className: 'xyz',
                        innerHTML: 'y'
                    },
                    addZ ?
                        {
                            ref:       this.setRef(ref + 'Z'),
                            className: 'xyz',
                            innerHTML: 'z'
                        } :
                        null
                ]
            }
        ];
    }

    getDirectControlRow() {
        return [
            {
                className: 'flt max-w hub-state-row',
                children: [
                    {
                        type:    Button,
                        ref:     this.setRef('directControlButton'),
                        ui:      this._ui,
                        onClick: this.onClickDirectControl.bind(this),
                        uiId:    1,
                        value:   'Direct control',
                        color:   'blue',
                        hidden:  true
                    }
                ]
            }
        ];
    }

    getLight() {
        if (this._light) {
            return this._light;
        }
        let hubLight = this._refs.hubLight;
        this._light = {
            setColor: function(color) {
                if (colors[color] !== undefined) {
                    hubLight.className = 'abs hub-light ' + colors[color];
                }
            },
            off: function() {
                hubLight.className = 'abs hub-light none';
            }
        };
        return this._light;
    }

    getButtons() {
        return this._buttons;
    }

    setButton(button) {
    }

    setTilt(tilt) {
        let refs = this._refs;
        refs.tiltX.innerHTML = 'x: ' + tilt.x;
        refs.tiltY.innerHTML = 'y: ' + tilt.y;
        if (refs.tiltZ) {
            refs.tiltZ.innerHTML = 'z: ' + tilt.z;
        }
    }

    onClickDirectControl() {
        dispatcher.dispatch(
            'Dialog.PoweredUpControl.Show',
            {
                deviceCount: this._settings.getDeviceCount() - 1,
                withAlias:   true
            }
        );
    }

    onDeviceConnected() {
        let refs = this._refs;
        if (refs.directControlButton) {
            refs.directControlButton.setHidden(false);
        }
    }

    onDeviceDisconnected() {
        let refs = this._refs;
        if (refs.directControlButton) {
            refs.directControlButton.setHidden(true);
        }
    }

    clear() {
        let refs = this._refs;
        refs.tiltX.innerHTML = 'x';
        refs.tiltY.innerHTML = 'y';
        if (refs.tiltZ) {
            refs.tiltZ.innerHTML  = 'z';
        }
        if (refs.accelX) {
            refs.accelX.innerHTML = 'x';
            refs.accelY.innerHTML = 'y';
            refs.accelZ.innerHTML = 'z';
        }
    }
};
