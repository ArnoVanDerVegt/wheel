/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const $            = require('../../program/commands');
const CompileBlock = require('./CompileBlock').CompileBlock;

exports.CompileLoop = class CompileLoop extends CompileBlock {
    constructor(opts) {
        super(opts);
        this._breaks = [];
    }

    addBreak() {
        let program = this._program;
        this._breaks.push(program.getLength());
        program.addCommand($.CMD_SET, $.T_NUM_G, $.REG_CODE, $.T_NUM_C, 0);
    }

    getBreaks() {
        return this._breaks;
    }
};
