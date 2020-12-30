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
        this._offset = 0;
        return this;
    }

    readByte() {
        return this._buffer[this._offset++];
    }

    readWord() {
        return this.readByte() + (this.readByte() << 8);
    }

    readDWord() {
        return this.readByte() + (this.readByte() << 8) + (this.readByte() << 16) + (this.readByte() << 24);
    }
};

exports.Message = class {
    constructor() {
        this._buffer = [];
        this._port   = -1;
    }

    getPort() {
        return this._port;
    }

    setPort(port) {
        this._port = port;
        return this;
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

    addByte5(b5) {
        return this
            .addByte(b5 & 0xFF)
            .addByte((b5 >>> 8) & 0xFF)
            .addByte((b5 >>> 16) & 0xFF)
            .addByte((b5 >>> 24) & 0xFF)
            .addByte((b5 >>> 32) & 0xFF);
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
