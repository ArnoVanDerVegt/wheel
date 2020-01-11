/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
exports.Light = class {
    constructor(opts) {
        this._element = opts.element;
        exports.light = this;
    }

    setColor(color) {
        if (color > 0) {
            color--;
            let pattern = Math.floor(color / 3);
            color = color % 3;
            this._element.className = 'ev3-light ' + ['green', 'red', 'orange'][color] + ' ' + ['', 'flash', 'pulse'][pattern];
        } else {
            this._element.className = 'ev3-light off';
        }
    }

    off(color, pattern) {
        this._element.className = 'ev3-light';
    }
};
