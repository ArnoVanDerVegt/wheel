/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const $ = require('../program/commands');

exports.VMData = class {
    constructor(opts) {
        let data = [];
        for (let i = 0; i < 8; i++) {
            data[i] = 0;
        }
        data[$.REG_STACK] = opts.globalSize;
        opts.constants.forEach((constant) => {
            for (let i = 0; i < constant.data.length; i++) {
                data[constant.offset + i] = constant.data[i];
            }
        });
        this._data       = data;
        this._heap       = opts.heap       || 1024;
        this._stringList = opts.stringList || [];
        this._keepRet    = false; // When a module sets the return value then the return statement will not change it!
    }

    allocateString() {
        this._stringList.push('');
        return this._stringList.length - 1;
    }

    releaseString() {
        this._stringList.pop();
    }

    setHeap(heap) {
        this._heap = heap;
    }

    getHeapOverflow() {
        return (this._data.length >= this._heap);
    }

    getData() {
        return this._data;
    }

    getStringStack() {
        return this._stringStack;
    }

    /* Global */
    setGlobalNumber(offset, value) {
        this._data[offset] = value;
    }

    getGlobalNumber(offset) {
        return this._data[offset];
    }

    getStringList() {
        return this._stringList;
    }

    getRecordFromSrcOffset(recordFields) {
        let regOffsetSrc = this._data[$.REG_SRC];
        let result       = {};
        for (let i = 0; i < recordFields.length; i++) {
            result[recordFields[i]] = this._data[regOffsetSrc + i];
        }
        return result;
    }

    getRegSrc() {
        return this._data[$.REG_SRC];
    }

    getNumberAtRegOffset() {
        let data = this._data;
        return data[data[$.REG_SRC]];
    }

    getNumberAtOffset(offset) {
        return this._data[offset];
    }

    setNumberAtOffset(value, offset) {
        this._data[offset ? offset : 0] = value;
    }

    setNumberAtRegOffset(value, offset) {
        let data = this._data;
        let o    = data[$.REG_SRC] + (offset ? offset : 0);
        data[o] = value;
    }

    setNumberAtRet(value) {
        this._data[$.REG_RET] = value;
        this._keepRet         = true;
    }

    getRegisters() {
        let result = [];
        let data   = this._data;
        for (let i = 0; i <= $.REG_RANGE1; i++) {
            result[i] = data[i];
        }
        return result;
    }

    setRegisters(registers) {
        let data = this._data;
        for (let i = 0; i <= $.REG_RANGE1; i++) {
            data[i] = registers[i];
        }
    }

    keepRet() {
        let keepRet = this._keepRet;
        this._keepRet = false;
        return keepRet;
    }
};
