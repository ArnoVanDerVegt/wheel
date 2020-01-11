/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/

// Todo:
//     0000|0000 set     [stack + 2],    15
//     0001|0000 ret     [stack + 2]
//
//    0010 set     src,            0
//    0011 add     src,            stack
//
//    0000|0000 set     [stack + 23],   5
//    0001|0001 set     [stack + 24],   [stack + 23]
const $ = require('./commands');

class Param {
    constructor(type, value) {
        this._type  = type;
        this._value = value;
    }

    getType() {
        return this._type;
    }

    getValue() {
        return this._value;
    }

    setValue(value) {
        this._value = value;
    }
}

class Command {
    constructor(cmd, type1, value1, type2, value2, blockId) {
        this._cmd        = cmd;
        this._breakpoint = false;
        this._param1     = new Param(type1, value1);
        this._param2     = new Param(type2, value2);
        this._blockId    = blockId;
    }

    getCmd() {
        return this._cmd;
    }

    getBreakpoint() {
        return this._breakpoint;
    }

    setBreakpoint(breakpoint) {
        this._breakpoint = breakpoint;
    }

    getParam1() {
        return this._param1;
    }

    getParam2() {
        return this._param2;
    }

    getBlockId() {
        return this._blockId;
    }
}

exports.Program = class {
    constructor(compiler) {
        this._compiler   = compiler;
        this._title      = null;
        this._layerCount = 0;
        this._pass       = 0;
        this._stringList = [];
        this.reset();
    }

    reset(pass) {
        this._pass         = pass;
        this._commands     = [];
        this._heap         = 1024;
        this._entryPoint   = 0;
        this._globalSize   = $.REG_TO_STR.length;
        this._constants    = [];
        this._blockId      = 0;
        this._blockIdInfo  = [];
        this._optimize     = true;
        this._codeUsed     = true;
        this._stringLength = 64;
        this._stringCount  = 64;
        if (pass === 0) {
            this._stringList = [];
        }
    }

    findStringConstant(s) {
        let stringList = this._stringList;
        for (let i = 0; i < stringList.length; i++) {
            if (stringList[i] === s) {
                return i;
            }
        }
        return null;
    }

    addConstantString(s) {
        s = s.substr(1, s.length - 2);
        let found = this.findStringConstant(s);
        if (found !== null) {
            return found;
        }
        this._stringList.push(s);
        return this._stringList.length - 1;
    }

    addConstant(constant) {
        let constants = this._constants;
        if (constants.length > 0) {
            let lastConstant = constants[constants.length - 1];
            // If the new constant is next to the last constant then merge them...
            if (lastConstant.offset + lastConstant.data.length === constant.offset) {
                lastConstant.data = lastConstant.data.concat(constant.data);
                return this;
            }
        }
        constants.push(constant);
        return this;
    }

    nextBlockId(token, scope) {
        this._blockIdInfo[this._blockId] = {token: token, scope: scope};
        this._blockId++;
        return this;
    }

    addTwoOptimizedCommands(lastCommandA, lastCommandB, blockId) {
        let optimized    = false;
        let commands     = this._commands;
        let add          = true;
        let cmdB         = lastCommandB.getCmd();
        let typeB1       = lastCommandB.getParam1().getType();
        let valueB1      = lastCommandB.getParam1().getValue();
        let typeB2       = lastCommandB.getParam2().getType();
        let valueB2      = lastCommandB.getParam2().getValue();
        let cmdA         = lastCommandA.cmd;
        let typeA1       = lastCommandA.type1;
        let valueA1      = lastCommandA.value1;
        let typeA2       = lastCommandA.type2;
        let valueA2      = lastCommandA.value2;
        if ((cmdA   === $.CMD_ADD) &&
            (typeA1 === $.T_NUM_G) && (valueA1 === $.REG_PTR) &&
            (typeA2 === $.T_NUM_C) && (valueA2 === 0)) {
            add       = false;
            optimized = true;
        } else if ((cmdA === $.CMD_SET) && (typeA1 === typeA2) && (valueA1 === valueA2)) {
            // Found:
            //     Set     XXXX,           XXXX
            // Replaced with:
            //     -
            add       = false;
            optimized = true;
        // ===========================================================================================================//
        } else if ((cmdB    === $.CMD_SET) && (typeB1  === typeA1)    && (valueB1 === valueA1) &&
                                              (typeB2  === $.T_NUM_C) &&
                   (cmdA    === $.CMD_ADD) && (typeA2  === $.T_NUM_C)) {
            // Found:
            //     Set     ptr,            1
            //     Add     ptr,            3
            // Replace with:
            //     Set     ptr,            4
            lastCommandB.getParam2().setValue(valueB2 + valueA2);
            add       = false;
            optimized = true;
        } else if ((cmdB    === $.CMD_SET) && (typeB1  === $.T_NUM_G) && (valueB1 === $.REG_PTR) &&
                                              (typeB2  === $.T_NUM_C) &&
                                              (typeA2  === $.T_NUM_P)) {
            // Found:
            //     Set     ptr,            9
            //     Set     [stack + 0],    [ptr + 0]
            // Replace with:
            //     Set     [stack + 0],    [9]
            valueA2 += valueB2;
            typeA2    = $.T_NUM_G;
            optimized = true;
            commands.pop();
        } else if ((cmdB    === $.CMD_SET) && (typeB1  === $.T_NUM_G) && (valueB1 === $.REG_PTR) &&
                                              (typeB2  === $.T_NUM_C) &&
                                              (typeA1  === $.T_NUM_P)) {
            // Found:
            //     Set     ptr,            9
            //     Set     [ptr + 0],      [stack + 0]
            // Replace with:
            //     Set     [9],            [stack + 0]
            valueA1 += valueB2;
            typeA1    = $.T_NUM_G;
            optimized = true;
            commands.pop();
        } else if ((cmdB === $.CMD_SET) && (typeB1 === $.T_NUM_G) && (valueB1 === $.REG_PTR) &&
                                           (typeB2 === $.T_NUM_C) && (valueB2 === 0) &&
                   (cmdA === $.CMD_ADD) && (typeA1 === $.T_NUM_G) && (valueA1 === $.REG_PTR) &&
                                           (typeA2 === $.T_NUM_G) && (valueA2 === $.REG_STACK)) {
            // Found:
            //     Set     ptr,            0
            //     Add     ptr,            stack
            // Replace with:
            //     Set     ptr,            stack
            cmdA      = $.CMD_SET;
            typeA2    = $.T_NUM_G;
            valueA2   = $.REG_STACK;
            optimized = true;
            commands.pop();
        } else if ((cmdB === $.CMD_SET) && (typeB1 === $.T_NUM_G) && (valueB1 === $.REG_PTR) &&
                                           (typeB2 === $.T_NUM_G) && (valueB2 === $.REG_STACK) &&
                   (cmdA === $.CMD_SET) && (typeA1 === $.T_NUM_L) &&
                                           (typeA2 === $.T_NUM_P)) {
            // Found:
            //     Set     ptr,            stack
            //     Set     [stack + 12],   [ptr + 2]
            // Replaced with:
            //     Set     [stack + 12],   [stack + 2]
            typeA2    = $.T_NUM_L;
            optimized = true;
            commands.pop();
        } else if ((cmdB === $.CMD_SET) && (typeB1 === $.T_NUM_G) && (valueB1 === $.REG_PTR) &&
                                           (typeB2 === $.T_NUM_G) && (valueB2 === $.REG_STACK) &&
                   ((cmdA === $.CMD_SET) || (cmdA === $.CMD_ADD)) &&
                                           (typeA1 === $.T_NUM_P) &&
                                           (typeA2 === $.T_NUM_L)) {
            // Found:
            //     Set     ptr,            stack
            //     Xxx     [ptr + 12],     [stack + 2]
            // Replaced with:
            //     Xxx     [stack + 12],   [stack + 2]
            typeA1    = $.T_NUM_L;
            optimized = true;
            commands.pop();
        } else if ((cmdB === $.CMD_SET) && (typeB1 === $.T_NUM_G) && (valueB1 === $.REG_PTR) &&
                                           (typeB2 === $.T_NUM_G) && (valueB2 === $.REG_STACK) &&
                   (cmdA === $.CMD_SET) && (typeA1 === $.T_NUM_P) &&
                                           (typeA2 === $.T_NUM_G) && (valueA2 === $.REG_RET)) {
            // Found:
            //     Set     ptr,            stack
            //     Set     [ptr + 11],     return
            // Replaced with:
            //     Set     [stack + 11],   return
            typeA1    = $.T_NUM_L;
            optimized = true;
            commands.pop();
        } else if ((cmdB === $.CMD_SET) && (typeB1 === $.T_NUM_G) && (valueB1 === $.REG_PTR) &&
                                           (typeB2 === $.T_NUM_G) && (valueB2 === $.REG_STACK) &&
                   (cmdA === $.CMD_RET) && (typeA1 === $.T_NUM_P)) {
            // Found:
            //     Set     ptr,            stack
            //     Ret     [ptr + 2]
            // Replaced with:
            //     Ret     [stack + 2]
            typeA1    = $.T_NUM_L;
            optimized = true;
            commands.pop();
        // ===========================================================================================================//
        } else if ((cmdB === $.CMD_ADD) && (typeB1 === $.T_NUM_G) && (valueB1 === $.REG_PTR) &&
                                           (typeB2 === $.T_NUM_C) &&
                                           (typeA1 === $.T_NUM_P)) {
            // Found:
            //     Add     ptr,            1
            //     Set     [ptr + 0],      24
            // Replace with:
            //     Set     [ptr + 1],      24
            valueA1 += valueB2;
            optimized = true;
            commands.pop();
        } else if ((cmdB    === $.CMD_ADD) && (typeB1  === typeA1)    &&
                                              (typeB2  === $.T_NUM_C) && (valueB1 === valueA1) &&
                   (cmdA    === $.CMD_ADD) && (typeA2  === $.T_NUM_C)) {
            // Found:
            //     Add     ptr,            3
            //     Add     ptr,            5
            // Replace with:
            //     Add     ptr,            8
            lastCommandB.getParam2().setValue(valueB2 + valueA2);
            add       = false;
            optimized = true;
        } else if ((cmdB === $.CMD_ADD) && (typeB1 === $.T_NUM_G) && (valueB1 === $.REG_PTR) &&
                                           (typeB2 === $.T_NUM_C) &&
                                           (typeA2 === $.T_NUM_P)) {
            // Found:
            //     Add     ptr,            1
            //     Set     [stack + 3],    [ptr + 0]
            // Replace with:
            //     Set     [stack + 3],    [ptr + 1]
            valueA2 += valueB2;
            optimized = true;
            commands.pop();
        // ===========================================================================================================//
        } else if ((cmdB === $.CMD_SET) && (typeB1 === $.T_NUM_L) && (valueB1 === valueA2) &&
                                           (typeB2 === $.T_NUM_C) &&
                   (cmdA === $.CMD_SET) && (typeA1 === $.T_NUM_L) &&
                                           (typeA2 === $.T_NUM_L)) {
            // Found:
            //     Set     [stack + 0],    0
            //     Set     [stack + 2],    [stack + 0]
            // Replace with:
            //     Set     [stack + 2],    0
            typeA2    = typeB2;
            valueA2   = valueB2;
            optimized = true;
            commands.pop();
        } else if ((cmdB === $.CMD_SET) && (typeB1 === $.T_NUM_L) && (valueB1 === valueA2) &&
                                           (typeB2 === $.T_NUM_C) &&
                   (cmdA === $.CMD_SET) && (typeA1 === $.T_NUM_G) &&
                                           (typeA2 === $.T_NUM_L)) {
            // Found:
            //     Set     [stack + 0],    0
            //     Set     [2],            [stack + 0]
            // Replace with:
            //     Set     [2],            0
            typeA2    = typeB2;
            valueA2   = valueB2;
            optimized = true;
            commands.pop();
        } else if ((cmdB === $.CMD_SET) && (typeB1 === $.T_NUM_L) && (valueB1 === valueA2) &&
                                           (typeB2 === $.T_NUM_L) &&
                   (cmdA === $.CMD_SET) && (typeA1 === $.T_NUM_L) &&
                                           (typeA2 === $.T_NUM_L)) {
            // Found:
            //     Set     [stack + 1],    [stack + 2]
            //     Set     [stack + 0],    [stack + 1]
            // Replace with:
            //     Set     [stack + 0],    [stack + 2]
            valueA2   = valueB2;
            optimized = true;
            commands.pop();
        } else if ((cmdB === $.CMD_SET) && (typeB1 === $.T_NUM_L) && (valueB1 === valueA2) &&
                                           (typeB2 === $.T_NUM_G) &&
                   (cmdA === $.CMD_SET) && (typeA1 === $.T_NUM_G) &&
                                           (typeA2 === $.T_NUM_L)) {
            // Found:
            //     Set     [stack + 1],    [2]
            //     Set     [3],            [stack + 1]
            // Replace with:
            //     Set     [3],            [2]
            typeA2    = $.T_NUM_G;
            valueA2   = valueB2;
            optimized = true;
            commands.pop();
        } else if ((cmdB === $.CMD_SET) && (typeB1 === $.T_NUM_L) && (valueB1 === valueA2) &&
                                           (typeB2 === $.T_NUM_L) &&
                   (cmdA === $.CMD_SET) && (typeA1 === $.T_NUM_G) &&
                                           (typeA2 === $.T_NUM_L)) {
            // Found:
            //     Set     [stack + 1],    [stack + 3]
            //     Set     [3],            [stack + 1]
            // Replace with:
            //     Set     [3],            [stack + 3]
            valueA2   = valueB2;
            optimized = true;
            commands.pop();
        } else if ((cmdB === $.CMD_SET) && (typeB1 === $.T_NUM_L) && (valueB1 === valueA2) &&
                                           (typeB2 === $.T_NUM_G) &&
                   (cmdA === $.CMD_SET) && (typeA1 === $.T_NUM_L) &&
                                           (typeA2 === $.T_NUM_L)) {
            // Found:
            //     Set     [stack + 1],    [7]
            //     Set     [stack + 0],    [stack + 1]
            // Replace with:
            //     Set     [stack + 0],    [7]
            typeA2    = $.T_NUM_G;
            valueA2   = valueB2;
            optimized = true;
            commands.pop();
        } else if ((cmdB === $.CMD_SET) && (typeB1 === $.T_NUM_L) && (valueB1 === valueA2) &&
                                           (typeB2 === $.T_NUM_P) &&
                   (cmdA === $.CMD_SET) && (typeA1 === $.T_NUM_L) &&
                                           (typeA2 === $.T_NUM_L)) {
            // Found:
            //     Set     [stack + 1],    [ptr + 0]
            //     Set     [stack + 0],    [stack + 1]
            // Replace with:
            //     Set     [stack + 0],    [ptr + 0]
            typeA2    = $.T_NUM_P;
            valueA2   = valueB2;
            optimized = true;
            commands.pop();
        } else if ((cmdB === $.CMD_SET) && (typeB1 === $.T_NUM_L) && (valueB1 === valueA2) &&
                                           (typeB2 === $.T_NUM_P) &&
                   (cmdA === $.CMD_SET) && (typeA1 === $.T_NUM_G) &&
                                           (typeA2 === $.T_NUM_L)) {
            // Found:
            //     Set     [stack + 1],    [ptr + 0]
            //     Set     [stack + 0],    [stack + 1]
            // Replace with:
            //     Set     [10],           [ptr + 0]
            typeA2  = $.T_NUM_P;
            valueA2 = valueB2;
            commands.pop();
            optimized = true;
        } else if ((cmdB === $.CMD_ADD) && (typeB1 === $.T_NUM_G) && (valueB1 === $.REG_PTR) &&
                                           (typeB2 === $.T_NUM_C) &&
                   (cmdA === $.CMD_SET) && (typeA1 === $.T_NUM_L) &&
                                           (typeA2 === $.T_NUM_P)) {
            // Found:
            //     Add     ptr,            3
            //     Set     [stack + 12],   [ptr + 2]
            // Replaced with:
            //     Set     [stack + 12],   [ptr + 5]
            valueA2 += valueB2;
            optimized = true;
            commands.pop();
        } else if ((cmdB === $.CMD_SET) && (typeB1 === $.T_NUM_G) && (valueB1 === $.REG_PTR)   &&
                                           (typeB2 === $.T_NUM_G) && (valueB2 === $.REG_STACK) &&
                   (cmdA === $.CMD_CMP) && (typeA2 === $.T_NUM_P)) {
            // Found:
            //     Set     ptr,                stack
            //     Cmp     [stack + 4],        [ptr + 5]
            // Replaced with:
            //     Cmp     [stack + 4],        [stack + 5]
            typeA2    = $.T_NUM_L;
            optimized = true;
            commands.pop();
        } else if ((cmdB === $.CMD_SET) && (typeB1 === $.T_NUM_L) && (valueB1 === valueA2)   &&
                                           (typeA2 === $.T_NUM_L)) {
            // Found:
            //     Set     [stack + 5],        4
            //     Cmp     [stack + 4],        [stack + 5]
            // Replaced with:
            //     Cmp     [stack + 4],        4
            typeA2    = typeB2;
            valueA2   = valueB2;
            optimized = true;
            commands.pop();
        } else if ((cmdB === $.CMD_SET) && (typeB1 === $.T_NUM_L) && (valueB1 === valueA1)   &&
                   (cmdA === $.CMD_CMP) && (typeA1 === $.T_NUM_L)) {
            // Found:
            //     Set     [stack + 4],    [stack + 2]
            //     Cmp     [stack + 4],    4
            // Replaced with:
            //     Cmp     [stack + 2],    4
            typeA1    = typeB2;
            valueA1   = valueB2;
            optimized = true;
            commands.pop();
        }
        if (add) {
            commands.push(new Command(cmdA, typeA1, valueA1, typeA2, valueA2, blockId));
        }
        return optimized;
    }

    addThreeOptimizedCommands(lastCommandA, lastCommandB, lastCommandC, blockId) {
        let optimized    = false;
        let commands     = this._commands;
        let add          = true;
        let cmdC         = lastCommandC.getCmd();
        let typeC1       = lastCommandC.getParam1().getType();
        let valueC1      = lastCommandC.getParam1().getValue();
        let typeC2       = lastCommandC.getParam2().getType();
        let valueC2      = lastCommandC.getParam2().getValue();
        let cmdB         = lastCommandB.getCmd();
        let typeB1       = lastCommandB.getParam1().getType();
        let valueB1      = lastCommandB.getParam1().getValue();
        let typeB2       = lastCommandB.getParam2().getType();
        let valueB2      = lastCommandB.getParam2().getValue();
        let cmdA         = lastCommandA.cmd;
        let typeA1       = lastCommandA.type1;
        let valueA1      = lastCommandA.value1;
        let typeA2       = lastCommandA.type2;
        let valueA2      = lastCommandA.value2;
        if ((cmdC === $.CMD_SET) && (typeC1 === $.T_NUM_G) && (valueC1 === $.REG_PTR)   &&
                                    (typeC2 === $.T_NUM_C) &&
            (cmdB === $.CMD_ADD) && (typeB1 === $.T_NUM_G) && (valueB1 === $.REG_PTR)   &&
                                    (typeB2 === $.T_NUM_G) && (valueB2 === $.REG_STACK) &&
            ([$.CMD_SET, $.CMD_ADD, $.CMD_SUB, $.CMD_DIV, $.CMD_MUL].indexOf(cmdA) !== -1) &&
                                    (typeA1 === $.T_NUM_L) &&
                                    (typeA2 === $.T_NUM_P)) {
            // Found:
            //     Set     ptr,            3
            //     Add     ptr,            stack
            //     Xxx     [stack + 12],   [ptr + 2]
            // Replaced with:
            //     Xxx     [stack + 12],   [stack + 5]
            commands.pop();
            commands.pop();
            valueA2 += valueC2;
            typeA2    = $.T_NUM_L;
            optimized = true;
            add       = true;
        } else if ((cmdC === $.CMD_SET) && (typeC1 === $.T_NUM_G) && (valueC1 === $.REG_PTR)   &&
                                           (typeC2 === $.T_NUM_C) &&
                   (cmdB === $.CMD_ADD) && (typeB1 === $.T_NUM_G) && (valueB1 === $.REG_PTR)   &&
                                           (typeB2 === $.T_NUM_G) && (valueB2 === $.REG_STACK) &&
                   ([$.CMD_SET, $.CMD_ADD, $.CMD_SUB, $.CMD_DIV, $.CMD_MUL].indexOf(cmdA) !== -1) &&
                                           (typeA1 === $.T_NUM_P) &&
                                           (typeA2 === $.T_NUM_L)) {
            // Found:
            //     Set     ptr,            3
            //     Add     ptr,            stack
            //     Xxx     [ptr + 2],      [stack + 12]
            // Replaced with:
            //     Xxx     [stack + 5],    [stack + 12]
            commands.pop();
            commands.pop();
            valueA1 += valueC2;
            typeA1    = $.T_NUM_L;
            optimized = true;
            add       = true;
        } else if ((cmdC === $.CMD_SET) && (typeC1 === $.T_NUM_G) && (valueC1 === $.REG_PTR)   &&
                                           (typeC2 === $.T_NUM_C) &&
                   (cmdB === $.CMD_ADD) && (typeB1 === $.T_NUM_G) && (valueB1 === $.REG_PTR)   &&
                                           (typeB2 === $.T_NUM_G) && (valueB2 === $.REG_STACK) &&
                   (cmdA === $.CMD_SET) && (typeA2 === $.T_NUM_P) &&
                                           (typeA1 === $.T_NUM_G) && (valueA1 === $.REG_SRC)) {
            // Found:
            //     Set     ptr,            3
            //     Add     ptr,            stack
            //     Xxx     src,            [ptr + 0]
            // Replaced with:
            //     Xxx     src,            [stack + 3]
            commands.pop();
            commands.pop();
            valueA2 += valueC2;
            typeA2    = $.T_NUM_L;
            optimized = true;
            add       = true;
        } else if ((cmdC === $.CMD_SET) && (typeC1 === $.T_NUM_G) && (valueC1 === $.REG_PTR)   &&
                                           (typeC2 === $.T_NUM_C) &&
                   (cmdB === $.CMD_ADD) && (typeB1 === $.T_NUM_G) && (valueB1 === $.REG_PTR)   &&
                                           (typeB2 === $.T_NUM_G) && (valueB2 === $.REG_STACK) &&
                   ([$.CMD_SET, $.CMD_ADD, $.CMD_SUB, $.CMD_DIV, $.CMD_MUL].indexOf(cmdA) !== -1) &&
                                           (typeA1 === $.T_NUM_P) &&
                                           (typeA2 === $.T_NUM_C)) {
            // Found:
            //     Set     ptr,            2
            //     Add     ptr,            stack
            //     Xxx     [ptr + 0],      1
            // Replaced with:
            //     Xxx     [stack + 2],    1
            commands.pop();
            commands.pop();
            valueA1 += valueC2;
            typeA1    = $.T_NUM_L;
            optimized = true;
            add       = true;
        } else if ((cmdC === $.CMD_SET) && (typeC1 === $.T_NUM_G) && (valueC1 === $.REG_PTR)   &&
                                           (typeC2 === $.T_NUM_C) &&
                   (cmdB === $.CMD_ADD) && (typeB1 === $.T_NUM_G) && (valueB1 === $.REG_PTR)   &&
                                           (typeB2 === $.T_NUM_G) && (valueB2 === $.REG_STACK) &&
                   (cmdA === $.CMD_RET) && (typeA1 === $.T_NUM_P)) {
            // Found:
            //     Set     ptr,                2
            //     Add     ptr,                stack
            //     Ret     [ptr + 0]
            // Replaced with:
            //     Ret     [stack + 2]
            commands.pop();
            commands.pop();
            valueA1 += valueC2;
            typeA1    = $.T_NUM_L;
            optimized = true;
            add       = true;
        } else {
            add = false;
        }
        if (add) {
            commands.push(new Command(cmdA, typeA1, valueA1, typeA2, valueA2, blockId));
        }
        return optimized;
    }

    _addCommand(cmd, type1, value1, type2, value2) {
        if (!this._optimize) {
            this._commands.push(new Command(cmd, type1, value1, type2, value2, this._blockId));
            return;
        }
        let commands   = this._commands;
        let command;
        let optimized1 = true;
        let blockId    = this._blockId;
        while (optimized1) {
            let lastCommandA = {
                    cmd:    cmd,
                    type1:  type1,
                    value1: value1,
                    type2:  type2,
                    value2: value2
                };
            let lastCommandB = commands[commands.length - 1] || null;
            let optimized2   = false;
            if (lastCommandB && (lastCommandB.getBlockId() === blockId)) {
                let lastCommandC = commands[commands.length - 2] || null;
                if (lastCommandC && (lastCommandC.getBlockId() === blockId)) {
                    optimized1 = this.addThreeOptimizedCommands(lastCommandA, lastCommandB, lastCommandC, blockId);
                    optimized2 = true;
                } else {
                    optimized1 = false;
                    optimized2 = true;
                }
                if (!optimized1) {
                    optimized1 = this.addTwoOptimizedCommands(lastCommandA, lastCommandB, blockId);
                    optimized2 = true;
                }
            }
            if (!optimized2) {
                commands.push(new Command(
                    lastCommandA.cmd,
                    lastCommandA.type1,
                    lastCommandA.value1,
                    lastCommandA.type2,
                    lastCommandA.value2,
                    blockId
                ));
                break;
            }
            if (optimized1) {
                command = commands.pop();
                cmd     = command.getCmd();
                type1   = command.getParam1().getType();
                value1  = command.getParam1().getValue();
                type2   = command.getParam2().getType();
                value2  = command.getParam2().getValue();
                blockId = command.getBlockId();
            }
        }
    }

    addCommand(cmd, type1, value1, type2, value2) {
        if (!this.getSecondPass() || !this._codeUsed) {
            return this;
        }
        if (arguments.length === 5) {
            this._addCommand(cmd, type1, value1, type2, value2);
            return this;
        }
        let params = [];
        for (let i = 0; i < arguments.length; i++) {
            params.push(arguments[i]);
            if (params.length === 5) {
                this._addCommand.apply(this, params);
                params.length = 0;
            }
        }
        return this;
    }

    getCodeUsed() {
        return this._codeUsed;
    }

    setCodeUsed(codeUsed) {
        this._codeUsed = codeUsed;
    }

    getLength() {
        return this._commands.length;
    }

    getOptimize() {
        return this._optimize;
    }

    setOptimize(optimize) {
        this._optimize = optimize;
    }

    getHeap(heap) {
        return this._heap;
    }

    setHeap(heap) {
        this._heap = heap;
    }

    getEntryPoint() {
        return this._entryPoint;
    }

    setEntryPoint(entryPoint) {
        this._entryPoint = entryPoint;
    }

    getCommands() {
        return this._commands;
    }

    getGlobalSize() {
        return this._globalSize;
    }

    setGlobalSize(globalSize) {
        this._globalSize = globalSize;
    }

    getConstants() {
        return this._constants;
    }

    getLastCommand() {
        return this._commands.length ? this._commands[this._commands.length - 1] : null;
    }

    getStringList() {
        return this._stringList;
    }

    getStringLength() {
        return this._stringLength;
    }

    setStringLength(stringLength) {
        this._stringLength = stringLength;
    }

    getStringCount() {
        return this._stringCount;
    }

    setStringCount(stringCount) {
        this._stringCount = stringCount;
    }

    getSecondPass() {
        return (this._compiler.getPass() === 1);
    }

    setCommandParamValue2(index, value) {
        if (this.getSecondPass()) {
            this._commands[index].getParam2().setValue(value);
        }
    }

    getTitle() {
        return this._title;
    }

    setTitle(title) {
        this._title = title;
    }

    setBreakpoints(breakpoints) {
        let breakpointHash = {};
        breakpoints.forEach(function(breakpoint) {
            breakpoint.done = false;
            breakpointHash[breakpoint.fileIndex + '_' + breakpoint.lineNum] = breakpoint;
        });
        let blockIdInfo  = this._blockIdInfo;
        let commands     = this._commands;
        let commandIndex = 0;
        for (let i = 0; i < commands.length; i++) {
            commands[i].setBreakpoint(false);
        }
        for (let i = 0; i < blockIdInfo.length; i++) {
            let token = blockIdInfo[i].token;
            if (!token) {
                continue;
            }
            let hash  = token.fileIndex + '_' + token.lineNum;
            let b     = breakpointHash[hash];
            if (b && !b.done) {
                b.done = true;
                while (commandIndex < commands.length) {
                    let command = commands[commandIndex++];
                    if ((command.getBlockId() > i) && blockIdInfo[i].scope && !blockIdInfo[i].scope.getGlobal()) {
                        let bh = breakpointHash[hash];
                        command.setBreakpoint({
                            lineNum:   bh.lineNum,
                            fileIndex: bh.fileIndex,
                            scope:     blockIdInfo[i].scope
                        });
                        break;
                    }
                }
            }
        }
    }

    addInfoToLastCommand(info) {
        let lastCommand = this.getLastCommand();
        if (lastCommand) {
            lastCommand.info = info;
        }
    }

    removeLastCommand() {
        this._commands.pop();
    }

    getLayerCount() {
        return this._layerCount;
    }

    setLayerCount(layerCount) {
        this._layerCount = layerCount;
    }
};
