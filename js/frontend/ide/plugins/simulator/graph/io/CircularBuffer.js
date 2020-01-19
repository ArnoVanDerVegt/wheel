/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/

exports.CircularBuffer = class {
    constructor(opts) {
        this._buffer        = [];
        this._size          = opts.size || 23;
        this._currentOffset = 0;
    }

    add(value) {
        let buffer = this._buffer;
        let size   = this._size;
        if (buffer.length < size) {
            buffer.push(value);
        } else {
            buffer[this._currentOffset] = value;
            this._currentOffset = (this._currentOffset + 1) % size;
        }
    }

    getValue(index) {
        return this._buffer[index % this._size];
    }

    getCurrentSize() {
        return this._buffer.length;
    }

    getCurrentOffset() {
        return this._currentOffset;
    }

    getFull() {
        return this._buffer.length >= this._size;
    }
};
