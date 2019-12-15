/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const messageEncoder = require('./messageEncoder');

exports.Message = class {
    constructor() {
        this._message = '';
    }

    addS(value) {
        this._message += value;
        return this;
    }

    add1(value) {
        this._message += messageEncoder.getPackedOutputHexString(value, 1);
        return this;
    }

    add2(value) {
        this._message += messageEncoder.getPackedOutputHexString(value, 2);
        return this;
    }

    add3(value) {
        this._message += messageEncoder.getPackedOutputHexString(value, 3);
        return this;
    }

    addB(value) {
        this._message += messageEncoder.byteString(value);
        return this;
    }

    addH(value) {
        this._message += messageEncoder.stringToHexString(value);
        return this;
    }

    get() {
        return this._message;
    }
};
