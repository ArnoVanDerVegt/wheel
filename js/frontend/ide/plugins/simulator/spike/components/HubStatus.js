/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const DOMNode    = require('../../../../../lib/dom').DOMNode;

exports.HubStatus = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._visible = opts.visible;
        this._layer   = opts.layer;
        this._device  = opts.device;
        this.initDOM(opts.parentNode);
        this._device
            .on('Spike.Layer' + opts.layer + '.Connected', this, this.onConnected)
            .on('Spike.Layer' + opts.layer + '.Battery',   this, this.onBattery)
            .on('Spike.Layer' + opts.layer + '.Gyro',      this, this.onGyro)
            .on('Spike.Layer' + opts.layer + '.Accel',     this, this.onAccel)
            .on('Spike.Layer' + opts.layer + '.Pos',       this, this.onPos);
        opts.id(this);
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                ref:       this.setRef('hubStatus'),
                className: 'flt hub-status',
                children: [
                    {
                        className: 'flt title',
                        innerHTML: 'Device:'
                    },
                    {
                        className: 'frt values',
                        children: [
                            {
                                ref:       this.setRef('hubName'),
                                className: 'flt value',
                                innerHTML: 'Layer ' + (this._layer + 1) + ' (not connected)'
                            }
                        ]
                    },
                    {
                        className: 'flt title',
                        innerHTML: 'Battery:'
                    },
                    {
                        className: 'frt values',
                        children: [
                            {
                                ref:       this.setRef('battery'),
                                className: 'flt value',
                                innerHTML: '?'
                            }
                        ]
                    },
                    this.initValues('Gyro:',  'gyro'),
                    this.initValues('Accel:', 'accel'),
                    this.initValues('Pos:',   'pos')
                ]
            }
        );
    }

    initValues(title, ref) {
        let children = [
                {
                    className: 'frt values',
                    children:  []
                },
                {
                    className: 'flt title',
                    innerHTML: title
                }
            ];
        for (let i = 0; i < 3; i++) {
            children[0].children.push({
                ref:       this.setRef(ref + i),
                className: 'flt third-w value',
                innerHTML: 0
            });
        }
        return {
            className: 'flt max-w',
            children:  children
        };
    }

    setProperty(property, value) {
        let refs = this._refs;
        refs[property + '0'].innerHTML = value.x;
        refs[property + '1'].innerHTML = value.y;
        refs[property + '2'].innerHTML = value.z;
    }

    onConnected(deviceName) {
        let hubName = this._refs.hubName;
        hubName.innerHTML = deviceName;
        hubName.title     = deviceName;
    }

    onBattery(battery) {
        this._refs.battery.innerHTML = battery + '%';
    }

    onGyro(gyro) {
        this.setProperty('gyro', gyro);
    }

    onAccel(accel) {
        this.setProperty('accel', accel);
    }

    onPos(pos) {
        this.setProperty('pos', pos);
    }
};
