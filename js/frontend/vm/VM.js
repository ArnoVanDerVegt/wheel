/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const $          = require('../program/commands');
const dispatcher = require('../lib/dispatcher').dispatcher;
const VMData     = require('./VMData').VMData;

class VM {
    constructor(opts) {
        this._runningEvent      = false;
        this._stopped           = true;
        this._sleepContinueTime = null;
        this._breakpoint        = false;
        this._runTimeout        = null;
        this._entryPoint        = opts.entryPoint || 0;
        this._lastCommand       = null;
        this._commands          = null;
        this._maxCallStackSize  = 2;
        this._modules           = [];
        this._outputPath        = '';
        this._sortedFiles       = opts.sortedFiles;
        this._vmData            = new VMData({
            globalSize: opts.globalSize,
            constants:  opts.constants,
            stringList: opts.stringList
        });
    }

    getSortedFiles() {
        return this._sortedFiles;
    }

    getOutputPath() {
        return this._outputPath;
    }

    setOutputPath(outputPath) {
        this._outputPath = outputPath;
        return this;
    }

    setModules(modules) {
        this._modules = modules;
        return this;
    }

    getModules() {
        return this._modules;
    }

    getVMData() {
        return this._vmData;
    }

    getParamValue(data, regOffsetStack, regOffsetPtr, param) {
        let p = param.getValue();
        switch (param.getType()) {
            case $.T_NUM_G: return data[p];
            case $.T_NUM_L: return data[p + regOffsetStack];
            case $.T_NUM_P: return data[p + regOffsetPtr];
        }
        return p;
    }

    getLastCommand() {
        if (this._lastCommand && this._lastCommand.info) {
            this._lastCommand.info.vm = this;
        }
        return this._lastCommand;
    }

    setCommands(commands) {
        // Find the max stack size.
        // This size is reserved when an event call is made.
        let maxCallStackSize = 2;
        commands.forEach(
            function(command) {
                if (command.getCmd() === $.CMD_CALL) {
                    maxCallStackSize = Math.max(maxCallStackSize, command.getParam2().getValue());
                }
            },
            this
        );
        this._commands         = commands;
        this._maxCallStackSize = maxCallStackSize;
        return this;
    }

    getBreakpoint() {
        return this._breakpoint;
    }

    runCommand(command) {
        let vmData         = this._vmData;
        let data           = vmData.getData();
        let regOffsetStack = data[$.REG_STACK];
        let regOffsetPtr   = data[$.REG_PTR];
        let param1         = command.getParam1();
        let param2         = command.getParam2();
        let v1             = this.getParamValue(data, regOffsetStack, regOffsetPtr, param1);
        let v2             = this.getParamValue(data, regOffsetStack, regOffsetPtr, param2);
        let v;
        this._lastCommand = command;
        switch (command.getCmd()) {
            case $.CMD_COPY:
                let size          = v2;
                let regOffsetSrc  = data[$.REG_SRC];
                let regOffsetDest = data[$.REG_DEST];
                for (let i = 0; i < size; i++) {
                    data[regOffsetDest + i] = data[regOffsetSrc + i];
                }
                break;
            case $.CMD_JMPC:
                let regFlags = data[$.REG_FLAGS];
                ((regFlags & v1) === v1) && (data[$.REG_CODE] = v2 - 1);
                break;
            case $.CMD_CMP:
                let flags = 0;
                (v1 === v2) && (flags |= $.FLAG_EQUAL);
                (v1 !== v2) && (flags |= $.FLAG_NOT_EQUAL);
                (v1 <   v2) && (flags |= $.FLAG_LESS);
                (v1 <=  v2) && (flags |= $.FLAG_LESS_EQUAL);
                (v1 >   v2) && (flags |= $.FLAG_GREATER);
                (v1 >=  v2) && (flags |= $.FLAG_GREATER_EQUAL);
                data[$.REG_FLAGS] = flags;
                break;
            case $.CMD_MOD:
                let modules = this._modules;
                if (modules[v1]) {
                    modules[v1].run(v2);
                } else {
                    throw new Error('Unknown module "' + v1 + '"');
                }
                break;
            case $.CMD_CALL:
                data[$.REG_STACK] += v2;
                data[regOffsetStack + v2 - 2] = regOffsetStack;
                data[regOffsetStack + v2 - 1] = data[$.REG_CODE];
                data[$.REG_CODE             ] = v1;
                break;
            case $.CMD_RET:
                if (!vmData.keepRet()) {
                    data[$.REG_RET] = v1;
                }
                data[$.REG_STACK] = data[regOffsetStack - 2];
                data[$.REG_CODE ] = data[regOffsetStack - 1];
                break;
            case $.CMD_SETF: // Set flags
                let flagValue = ((data[$.REG_FLAGS] & v2) === v2) ? 1 : 0;
                v = param1.getValue();
                switch (param1.getType()) {
                    case $.T_NUM_L: data[v + regOffsetStack] = flagValue; break;
                    // The following cases are not generated by the compiler:
                    // Case $.T_NUM_G: data[v]                  = flagValue; break;
                    // Case $.T_NUM_P: data[v + regOffsetPtr]   = flagValue; break;
                }
                break;
            case $.CMD_ADDS: // Add string
                vmData.getStringList()[v1] += vmData.getStringList()[v2];
                break;
            case $.CMD_SETS: // Set string
                vmData.getStringList()[v1] = vmData.getStringList()[v2];
                break;
            default:
                let result = null;
                switch (command.getCmd()) {
                    case $.CMD_SET: result = v2;       break;
                    case $.CMD_ADD: result = v1 + v2;  break;
                    case $.CMD_SUB: result = v1 - v2;  break;
                    case $.CMD_MUL: result = v1 * v2;  break;
                    case $.CMD_AND: result = v1 && v2; break;
                    case $.CMD_OR:  result = v1 || v2; break;
                    case $.CMD_DIV:
                        if (v2 === 0) {
                            dispatcher.dispatch('VM.Error.DivisionByZero', this.getLastCommand());
                            this.stop();
                            return;
                        }
                        result = v1 / v2;
                        break;
                }
                v = param1.getValue();
                switch (param1.getType()) {
                    case $.T_NUM_G: data[v]                  = result; break;
                    case $.T_NUM_L: data[v + regOffsetStack] = result; break;
                    case $.T_NUM_P: data[v + regOffsetPtr]   = result; break;
                }
                break;
        }
        if (vmData.getHeapOverflow()) {
            dispatcher.dispatch('VM.Error.HeapOverflow');
            this.stop();
        }
    }

    stop() {
        this._stopped = true;
        if (this._runTimeout !== null) {
            clearTimeout(this._runTimeout);
            this._runTimeout = null;
        }
        dispatcher.dispatch('VM.Stop', this);
    }

    running() {
        return !this._stopped;
    }

    sleeping() {
        return (this._sleepContinueTime !== null);
    }

    sleep(time) {
        this._sleepContinueTime = Date.now() + time;
        return this;
    }

    run() {
        this._sleepContinueTime = null;
        let vmData   = this._vmData;
        let data     = vmData.getData();
        let commands = this._commands;
        vmData.setGlobalNumber($.REG_CODE, this._entryPoint);
        while (vmData.getGlobalNumber($.REG_CODE) < commands.length) {
            this.runCommand(commands[vmData.getGlobalNumber($.REG_CODE)]);
            vmData.setGlobalNumber($.REG_CODE, vmData.getGlobalNumber($.REG_CODE) + 1);
        }
        dispatcher.dispatch('VM.Run', this);
    }

    runEvent(entryPoint, params) {
        this._runningEvent = true;
        let commands         = this._commands;
        let vmData           = this._vmData;
        let data             = vmData.getData();
        let regOffsetStack   = data[$.REG_STACK];
        let callStackSize    = 2 + this._maxCallStackSize;
        let runningRegisters = null;
        let registers        = vmData.getRegisters(); // Get the register state from the running VM.
        data[$.REG_STACK] += callStackSize;
        data[regOffsetStack + callStackSize - 2] = regOffsetStack;
        data[regOffsetStack + callStackSize - 1] = 0xFFFFFF;
        params.forEach(function(param, index) {
            data[regOffsetStack + callStackSize + index + 2] = param;
        });
        vmData.setGlobalNumber($.REG_CODE, entryPoint);
        let run = (function() { // This function runs a maximum of 1024 VM commands...
                if (!this.running()) {
                    return;
                }
                if (runningRegisters) {
                    vmData.setRegisters(runningRegisters); // Restore the event registers.
                }
                let commandCount = 0;
                while (vmData.getGlobalNumber($.REG_CODE) < commands.length) {
                    this.runCommand(commands[vmData.getGlobalNumber($.REG_CODE)]);
                    vmData.setGlobalNumber($.REG_CODE, vmData.getGlobalNumber($.REG_CODE) + 1);
                    commandCount++;
                    if (commandCount > 1024) {
                        runningRegisters = vmData.getRegisters();
                        vmData.setRegisters(registers); // Restore the running VM register state.
                        setTimeout(run, 10);
                        return;
                    }
                }
                vmData.setRegisters(registers); // Restore the running VM register state.
                this._runningEvent = false;
            }).bind(this);
        run();
    }

    runInterval(onFinished) {
        let commands = this._commands;
        let vmData   = this._vmData;
        let data     = vmData.getData();
        let count    = 0;
        while ((vmData.getGlobalNumber($.REG_CODE) < commands.length) && !this._stopped && !this._breakpoint && !this._runningEvent) {
            dispatcher.dispatch('VM.Step', this);
            if (this._sleepContinueTime === null) {
                let command    = commands[vmData.getGlobalNumber($.REG_CODE)];
                let breakpoint = command.getBreakpoint();
                if (breakpoint) {
                    breakpoint.vm    = this;
                    this._breakpoint = command;
                    dispatcher.dispatch('VM.Breakpoint', this, breakpoint);
                } else {
                    this.runCommand(command);
                    vmData.setGlobalNumber($.REG_CODE, vmData.getGlobalNumber($.REG_CODE) + 1);
                }
            } else if (Date.now() > this._sleepContinueTime) {
                this._sleepContinueTime = null;
            }
            count++;
            if (count > 512) {
                break;
            }
        }
        if ((vmData.getGlobalNumber($.REG_CODE) < commands.length) && !this._stopped) {
            this._runTimeout = setTimeout(this.runInterval.bind(this, onFinished), 1);
        } else {
            this._stopped    = true;
            this._runTimeout = null;
            onFinished();
            dispatcher.dispatch('VM.Stop', this);
        }
    }

    continueAfterBreakpoint() {
        if (this._breakpoint) {
            let vmData = this._vmData;
            let data   = vmData.getData();
            this.runCommand(this._breakpoint);
            vmData.setGlobalNumber($.REG_CODE, vmData.getGlobalNumber($.REG_CODE) + 1);
        }
        this._breakpoint = false;
        dispatcher.dispatch('VM.Continue', this);
    }

    startRunInterval(onFinished) {
        this._sleepContinueTime = null;
        this._stopped           = false;
        this._vmData.setGlobalNumber($.REG_CODE, this._entryPoint);
        this.runInterval(onFinished);
        dispatcher.dispatch('VM.Start', this);
    }
}

exports.VM = VM;
