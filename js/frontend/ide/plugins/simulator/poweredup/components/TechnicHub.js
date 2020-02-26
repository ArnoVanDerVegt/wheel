/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const DOMNode = require('../../../../../lib/dom').DOMNode;

exports.TechnicHub = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._buttons = 0;
        opts.plugin.setTechnicHub(this);
        this.initDOM(opts.parentNode);
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                ref: this.setRef('technicHub'),
                children: [
                    {
                        ref:       this.setRef('hubBody'),
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
                        ref:       this.setRef('hubStatus'),
                        className: 'hub-status',
                        children: []
                            .concat(this.getVectorRow('tilt', 'Tilt'))
                            .concat(this.getVectorRow('accel', 'Acceleration'))
                    }
                ]
            }
        );
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
                        innerHTML: 'x'
                    },
                    {
                        ref:       this.setRef(ref + 'Y'),
                        className: 'xyz',
                        innerHTML: 'y'
                    },
                    {
                        ref:       this.setRef(ref + 'Z'),
                        className: 'xyz',
                        innerHTML: 'z'
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

    getButtons() {
        return this._buttons;
    }

    setButton(button) {
    }

    setTilt(tilt) {
        let refs = this._refs;
        refs.tiltX.innerHTML = 'x: ' + tilt.x;
        refs.tiltY.innerHTML = 'y: ' + tilt.y;
        refs.tiltZ.innerHTML = 'z: ' + tilt.z;
    }

    setAccel(accel) {
        let refs = this._refs;
        refs.accelX.innerHTML = 'x: ' + accel.x;
        refs.accelY.innerHTML = 'y: ' + accel.y;
        refs.accelZ.innerHTML = 'z: ' + accel.z;
    }

    clear() {
        let refs = this._refs;
        refs.tiltX.innerHTML  = 'x';
        refs.tiltY.innerHTML  = 'y';
        refs.tiltZ.innerHTML  = 'z';
        refs.accelX.innerHTML = 'x';
        refs.accelY.innerHTML = 'y';
        refs.accelZ.innerHTML = 'z';
    }

    hide() {
        this._refs.hubBody.className   = 'hub-body';
        this._refs.hubStatus.className = 'hub-status';
    }

    show() {
        this._refs.hubBody.className   = 'hub-body visible';
        this._refs.hubStatus.className = 'hub-status visible';
    }
};
