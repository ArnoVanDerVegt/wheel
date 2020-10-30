/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const BasicHub = require('./BasicHub').BasicHub;

exports.TechnicHub = class extends BasicHub {
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
                children: [
                    {
                        ref:       this.setRef('hubBody'),
                        className: 'flt rel technic-hub-body',
                        children: [
                            {
                                className: 'flt hub-top'
                            },
                            {
                                className: 'flt hub-middle'
                            },
                            {
                                className: 'flt hub-bottom'
                            },
                            {
                                className: 'abs hub-box',
                                children: [
                                    {
                                        className: 'abs left-connections'
                                    },
                                    {
                                        className: 'abs right-connections'
                                    },
                                    {
                                        className: 'abs hub-button'
                                    },
                                    {
                                        className: 'abs hub-light',
                                        ref:       this.setRef('hubLight')
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        ref:       this.setRef('hubState'),
                        className: 'hub-state',
                        children: [].concat(
                            this.getVectorRow('tilt', 'Tilt', true),
                            this.getVectorRow('accel', 'Acceleration', true),
                            this.getDirectControlRow()
                        )
                    }
                ]
            }
        );
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
        this._refs.hubBody.className  = 'flt rel technic-hub-body';
        this._refs.hubState.className = 'hub-state';
    }

    show() {
        this._refs.hubBody.className  = 'flt rel technic-hub-body visible';
        this._refs.hubState.className = 'hub-state visible';
    }
};
