/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const DOMNode = require('../../../../../lib/dom').DOMNode;

exports.BasicHub = class extends DOMNode {
    getVectorRow(ref, title, addZ) {
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
        if (refs.tiltZ) {
            refs.tiltZ.innerHTML = 'z: ' + tilt.z;
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
