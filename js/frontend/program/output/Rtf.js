/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const $        = require('../commands');
const lineFeed = String.fromCharCode(0x0D);

exports.Rtf = class {
    constructor(program) {
        this._program = program;
        this._output  = '';
    }

    addLine(s) {
        this._output += s + lineFeed;
        return this;
    }

    outputHeader() {
        return this.addLine('Wheel VM Program');
    }

    outputVersion() {
        return this
            .addLine('#VERSION')
            .addLine(1);
    }

    outputName() {
        return this
            .addLine('#NAME')
            .addLine(this._program.getTitle().substr(0, 31));
    }

    outputLayers() {
        return this
            .addLine('#LAYERS')
            .addLine(this._program.getLayerCount());
    }

    outputStrings() {
        let program    = this._program;
        let stringList = program.getStringList();
        this
            .addLine('#STRINGS')
            .addLine(program.getStringCount() + ',' + program.getStringLength())
            .addLine(stringList.length);
        stringList.forEach(this.addLine, this);
        return this;
    }

    outputConstants() {
        let constants = this._program.getConstants();
        this
            .addLine('#CONSTANTS')
            .addLine(constants.length);
        constants.forEach(
            function(constant) {
                this
                    .addLine(constant.offset)
                    .addLine(constant.data.length)
                    .addLine(constant.data.join(','));
            },
            this
        );
        return this;
    }

    outputHeap() {
        return this
            .addLine('#HEAP')
            .addLine(this._program.getHeap());
    }

    outputCode() {
        return this
            .addLine('#REG_CODE')
            .addLine(this._program.getEntryPoint());
    }

    outputStack() {
        return this
            .addLine('#REG_STACK')
            .addLine(this._program.getGlobalSize());
    }

    outputCommands() {
        let commands = this._program.getCommands();
        this
            .addLine('#COMMANDS')
            .addLine(commands.length);
        commands.forEach(
            function(command) {
                let param1    = command.getParam1();
                let param2    = command.getParam2();
                let cmd       = command.getCmd();
                let cmdPacked = (cmd << 4) + (param1.getType() << 2) + param2.getType();
                let list      = [
                        cmdPacked,
                        param1.getValue(),
                        param2.getValue()
                    ];
                return this.addLine(list.join(','));
            },
            this
        );
        return this;
    }

    getOutput() {
        this
            .outputHeader()
            .outputVersion()
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
