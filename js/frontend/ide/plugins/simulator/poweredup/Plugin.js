/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher      = require('../../../../lib/dispatcher').dispatcher;
const DOMNode         = require('../../../../lib/dom').DOMNode;
const TextInput       = require('../../../../lib/components/TextInput').TextInput;
const SimulatorPlugin = require('../lib/SimulatorPlugin').SimulatorPlugin;
const Plugin          = require('../lib/motor/Plugin').Plugin;
const Motor           = require('./io/Motor').Motor;

exports.Plugin = class extends Plugin {
    constructor(opts) {
        opts.motorConstructor = Motor;
        opts.ev3              = opts.poweredUp; // Hack device should be fixed!
        super(opts);
        this.initEvents();
    }

    initEvents() {
        let device = this._device;
        for (let i = 0; i < 4; i++) {
            device
                .on('PoweredUp.Layer' + i + 'Uuid',  this, this.onUuid.bind(this, i))
                .on('PoweredUp.Layer' + i + 'Tilt',  this, this.onTilt.bind(this, i))
                .on('PoweredUp.Layer' + i + 'Accel', this, this.onAccel.bind(this, i));
        }
    }

    getMainElement() {
        return {
            className: 'powered-up',
            children: [
                {
                    className: 'hub-id',
                    children: [
                        {
                            ref:       this.setRef('uuid'),
                            type:      'span',
                            innerHTML: ''
                        }
                    ]
                },
                {
                    className: 'hub-body',
                    children: [
                        {
                            className: 'hub-top'
                        },
                        {
                            className: 'hub-middle'
                        },
                        {
                            className: 'hub-bottom'
                        },
                        {
                            className: 'hub-box',
                            children: [
                                {
                                    className: 'left-connections'
                                },
                                {
                                    className: 'right-connections'
                                },
                                {
                                    className: 'hub-button'
                                },
                                {
                                    className: 'hub-light',
                                    ref:       this.setRef('hubLight')
                                }
                            ]
                        }
                    ]
                },
                {
                    className: 'hub-status',
                    children: []
                        .concat(this.getVectorRow('tilt', 'Tilt'))
                        .concat(this.getVectorRow('accel', 'Acceleration'))
                }
            ]
        };
    }

    getVectorRow(ref, title) {
        return [
            {
                className: 'hub-status-row',
                children: [
                    {
                        type:      'span',
                        innerHTML: title
                    }
                ]
            },
            {
                className: 'hub-status-row',
                children: [
                    {
                        ref:       this.setRef(ref + 'X'),
                        className: 'xyz',
                        innerHTML: 'x: 0'
                    },
                    {
                        ref:       this.setRef(ref + 'Y'),
                        className: 'xyz',
                        innerHTML: 'y: 0'
                    },
                    {
                        ref:       this.setRef(ref + 'Z'),
                        className: 'xyz',
                        innerHTML: 'z: 0'
                    }
                ]
            }
        ];
    }

    getLight() {
        let hubLight = this._refs.hubLight;
        let colors   = [];
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
        return {
            setColor: function(color) {
                if (colors[color] !== undefined) {
                    hubLight.className = 'hub-light ' + colors[color];
                }
            },
            off: function() {
                hubLight.className = 'hub-light none';
            }
        };
    }

    onUuid(layer, uuid) {
        if (layer === this._simulator.getLayer()) {
            this._refs.uuid.innerHTML = uuid;
        }
    }

    onTilt(layer, tilt) {
        if (layer === this._simulator.getLayer()) {
            let refs = this._refs;
            refs.tiltX.innerHTML = 'x: ' + tilt.x;
            refs.tiltY.innerHTML = 'y: ' + tilt.y;
            refs.tiltZ.innerHTML = 'z: ' + tilt.z;
        }
    }

    onAccel(layer, accel) {
        if (layer === this._simulator.getLayer()) {
            let refs = this._refs;
            refs.accelX.innerHTML = 'x: ' + accel.x;
            refs.accelY.innerHTML = 'y: ' + accel.y;
            refs.accelZ.innerHTML = 'z: ' + accel.z;
        }
    }
};
