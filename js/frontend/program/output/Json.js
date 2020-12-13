/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const $        = require('../commands');
const lineFeed = String.fromCharCode(0x0D);

exports.Json = class {
    constructor(program) {
        this._program = program;
        this._output  = {};
    }

    outputName() {
        this._output.name = this._program.getTitle() || '';
        return this;
    }

    outputLayers() {
        this._output.layers = this._program.getLayerCount();
        return this;
    }

    outputStrings() {
        let output     = this._output;
        let program    = this._program;
        let stringList = program.getStringList();
        output.strings = [];
        stringList.forEach((string) => {
            output.strings.push(string);
        });
        return this;
    }

    outputConstants() {
        let output    = this._output;
        let constants = this._program.getConstants();
        output.constants = [];
        constants.forEach((constant) => {
            output.constants.push({
                offset: constant.offset,
                data:   JSON.parse(JSON.stringify(constant.data))
            });
        });
        return this;
    }

    outputHeap() {
        this._output.heap = this._program.getHeap();
        return this;
    }

    outputCode() {
        this._output.regCode = this._program.getEntryPoint();
        return this;
    }

    outputStack() {
        this._output.regStack = this._program.getGlobalSize();
        return this;
    }

    outputCommands() {
        let output   = this._output;
        let commands = this._program.getCommands();
        output.commands = [];
        commands.forEach((command) => {
            output.commands.push(command.toJSON());
        });
        return this;
    }

    getOutput() {
        this
            .outputName()
            .outputLayers()
            .outputHeap()
            .outputStrings()
            .outputConstants()
            .outputCode()
            .outputStack()
            .outputCommands();
        return this._output;
    }
};
