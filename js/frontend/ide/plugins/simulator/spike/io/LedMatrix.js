/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const DOMNode = require('../../../../../lib/dom').DOMNode;

exports.LedMatrix = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this.initDOM(opts.parentNode);
    }

    initDOM(parentNode) {
        let node = {
                className: 'flt leds',
                children:  []
            };
        for (let y = 0; y < 5; y++) {
            for (let x = 0; x < 5; x++) {
                node.children.push({
                    ref:       this.setRef('led' + y + '_' + x),
                    className: 'flt led'
                });
            }
        }
        this.create(parentNode, node);
    }

    setLed(x, y, brightness) {
        let ref = this._refs['led' + y + '_' + x];
        if (!ref) {
            return;
        }
        if (brightness === 0) {
            ref.style.backgroundColor = 'rgba(0,0,0,0.05);';
        } else if ((brightness > 0) && (brightness <= 100)) {
            ref.style.backgroundColor = 'rgba(255,255,0,' + (brightness / 100) + ');';
        }
    }

    clear() {
        for (let y = 0; y < 5; y++) {
            for (let x = 0; x < 5; x++) {
                this.setLed(x, y, 0);
            }
        }
    }
};
