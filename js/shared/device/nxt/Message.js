/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
exports.ResponseMessage = class {
    constructor() {
        this._buffer = null;
        this._offset = 0;
    }

    setBuffer(buffer) {
        this._buffer = buffer;
        this._offset = 2;
        return this;
    }

    readByte() {
        return this._buffer[this._offset++];
    }

    readWord() {
        return this.readByte() + (this.readByte() << 8);
    }
};

exports.Message = class {
    constructor() {
        this._buffer = [];
    }

    addByte(b) {
        this._buffer.push(b);
        return this;
    }

    addWord(w) {
        return this
            .addByte(w & 0xFF)
            .addByte((w >>> 8) & 0xFF);
    }

    getData() {
        let buffer = this._buffer;
        let result = new Uint8Array(buffer.length + 2);
        result[0] = buffer.length;
        result[1] = 0;
        buffer.forEach((b, index) => {
            result[index + 2] = b;
        });
        return result;
    }
};
