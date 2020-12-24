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
        this._spike   = opts.spike;
        this.initDOM(opts.parentNode);
        this._spike
            .on('Spike.Connected' + opts.layer, this, this.onConnected)
            .on('Spike.Gyro'      + opts.layer, this, this.onGyro)
            .on('Spike.Accel'     + opts.layer, this, this.onAccel)
            .on('Spike.Pos'       + opts.layer, this, this.onPos);
        opts.id(this);
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                className: 'flt hub-status' + (this._visible ? ' visible' : ''),
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

    setVisible(visible) {
        this._visible                = visible;
        this._refs.hubInfo.className = 'flt hub-status'  + (visible ? ' visible' : '');
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
