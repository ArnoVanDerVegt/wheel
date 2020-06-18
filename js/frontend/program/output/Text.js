/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const $     = require('../commands');
const space = '                                             ';

exports.Text = class {
    constructor(program, withBlockId, withLineNumber) {
        this._progam         = program;
        this._commands       = program.getCommands();
        this._withBlockId    = withBlockId;
        this._withLineNumber = (withLineNumber === undefined) || withLineNumber;
    }

    getCommandText(command, i, blockIndex) {
        let paramToStr  = function(param) {
                let p = '';
                switch (param.getType()) {
                    case $.T_NUM_C:
                        p = param.getValue();
                        break;
                    case $.T_NUM_G:
                        if (param.getValue() < $.REG_TO_STR.length) {
                            p = $.REG_TO_STR[param.getValue()];
                        } else {
                            p = '[' + param.getValue() + ']';
                        }
                        break;
                    case $.T_NUM_L:
                        p = '[stack + ' + param.getValue() + ']';
                        break;
                    case $.T_NUM_P:
                        p = '[ptr + ' + param.getValue() + ']';
                        break;
                }
                return p;
            };
        let num = ('0000' + i).substr(-4);
        let width;
        if (this._withBlockId) {
            num += '|' + ('0000' + blockIndex).substr(-4) + ' ';
            width = 16;
        } else if (this._withLineNumber) {
            num += '  ';
            width = 20;
        } else {
            num = '';
            width = 20;
        }
        let param1 = command.getParam1();
        let param2 = command.getParam2();
        if (!this._withLineNumber) {
            let cmd       = command.getCmd();
            let cmdPacked = (cmd << 4) + (param1.getType() << 2) + param2.getType();
            if ([88, 84, 0, 64, 16, 101, 90, 106, 122].indexOf(cmdPacked) !== -1) {
                num = '  ' + num;
            } else {
                num = '- ' + num;
            }
        }
        switch (command.getCmd()) {
            case $.CMD_SETF:
                return num + ($.CMD_TO_STR[command.getCmd()] + space).substr(0, 8) +
                    (paramToStr(param1) + ',' + space).substr(0, width) +
                    'flags.' + $.FLAG_TO_STR[param2.getValue()];
            case $.CMD_JMPC:
                if (command.getParam2().getType() === $.T_NUM_C) {
                    return num + ($.CMD_TO_STR[command.getCmd()] + space).substr(0, 8) +
                        ('flags.' + $.FLAG_TO_STR[param1.getValue()] + ',' + space).substr(0, width) +
                        ('0000' + (param2.getValue() - 1)).substr(-4);
                }
                return num + ($.CMD_TO_STR[command.getCmd()] + space).substr(0, 8) +
                    ('flags.' + $.FLAG_TO_STR[param1.getValue()] + ',' + space).substr(0, width) +
                    paramToStr(param2);
            case $.CMD_COPY:
                return num + ($.CMD_TO_STR[command.getCmd()] + space).substr(0, 8) +
                    paramToStr(param2);
            case $.CMD_RET:
                return num + ($.CMD_TO_STR[command.getCmd()] + space).substr(0, 8) +
                    paramToStr(param1);
            case $.CMD_CALL:
                if (param1.getType()  === $.T_NUM_C) {
                    return num + ($.CMD_TO_STR[command.getCmd()] + space).substr(0, 8) +
                        (('0000' + (param1.getValue() + 1)).substr(-4) + ',' + space).substr(0, width) +
                        paramToStr(param2);
                }
                return num + ($.CMD_TO_STR[command.getCmd()] + space).substr(0, 8) +
                    (paramToStr(param1) + ',' + space).substr(0, width) +
                    paramToStr(param2);
            case $.CMD_SET:
                if ((param1.getType()  === $.T_NUM_G)  &&
                    (param1.getValue() === $.REG_CODE) &&
                    (param2.getType()  === $.T_NUM_C)) {
                    return num + ('jump' + space).substr(0, 8) + ('0000' + (param2.getValue() + 1)).substr(-4);
                }
                return num + ($.CMD_TO_STR[command.getCmd()] + space).substr(0, 8) +
                    (paramToStr(param1) + ',' + space).substr(0, width) +
                    paramToStr(param2);
            default:
                return num + ($.CMD_TO_STR[command.getCmd()] + space).substr(0, 8) +
                    (paramToStr(param1) + ',' + space).substr(0, width) +
                    paramToStr(param2);
        }
    }

    getOutput(full) {
        let program     = this._progam;
        let text        = '';
        let blockIndex  = -1;
        let lastBlockId = -1;
        if (full) {
            text += 'Wheel VM Program\n';
            text += '#VERSION\n' +
                        '    1\n';
            text += '#NAME\n' +
                        '    ' + program.getTitle() + '\n';
            text += '#LAYERS\n' +
                        '    ' + program.getLayerCount() + '\n';
            text += '#HEAP\n' +
                        '    ' + program.getHeap() + '\n';
            let stringList = program.getStringList();
            text += '#STRINGS\n' +
                        '    ' + program.getStringCount() + ',' + program.getStringLength() + '\n' +
                        '    ' + stringList.length + '\n';
            stringList.forEach((string) => {
                text += '    "' + string + '"\n';
            });
            let constants = program.getConstants();
            text += '#CONSTANTS\n' +
                        '    ' + constants.length + '\n';
            constants.forEach((constant) => {
                text += '    offset: ' + ('0000' + constant.offset).substr(-4) + '\n';
                let s = '    data:   [';
                let first = true;
                constant.data.forEach((n) => {
                    if (first) {
                        first = false;
                    } else {
                        s += ',';
                    }
                    s += n;
                });
                text += s + ']\n';
            });
            text += '#REG_CODE\n' +
                        '    ' + program.getEntryPoint() + '\n';
            text += '#REG_STACK\n' +
                        '    ' + program.getGlobalSize() + '\n';
            text += '#CODE\n';
        }
        this._commands.forEach(
            function(command, i) {
                if (lastBlockId !== command.getBlockId()) {
                    lastBlockId = command.getBlockId();
                    blockIndex++;
                }
                text += this.getCommandText(command, i, blockIndex) + '\n';
            },
            this
        );
        return text;
    }
};
