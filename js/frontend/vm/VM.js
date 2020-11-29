/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const $          = require('../program/commands');
const dispatcher = require('../lib/dispatcher').dispatcher;
const VMData     = require('./VMData').VMData;

class VM {
    constructor(opts) {
        this._runningEvent             = false;
        this._stopped                  = true;
        this._sleepContinueTime        = null;
        this._sleepProcessContinueTime = null;
        this._breakpoint               = false;
        this._runTimeout               = null;
        this._entryPoint               = opts.entryPoint || 0;
        this._lastCommand              = null;
        this._commands                 = null;
        this._maxCallStackSize         = 2;
        this._modules                  = [];
        this._outputPath               = '';
        this._sortedFiles              = opts.sortedFiles;
        this._vmData                   = new VMData({
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

    runOptimizedCommand(command) {
        let data = this._vmData.getData();
        switch (command.getCmd()) {
            case 16: /* Set const  const  */                                                                                                       return;
            case 17: /* Set const  global */                                                                                                       return;
            case 18: /* Set const  local  */                                                                                                       return;
            case 19: /* Set const  ptr    */                                                                                                       return;
            case 20: /* Set global const  */ data[command._param1._value                    ] =       command._param2._value;                      return;
            case 21: /* Set global global */ data[command._param1._value                    ] =  data[command._param2._value                    ]; return;
            case 22: /* Set global local  */ data[command._param1._value                    ] =  data[command._param2._value + data[$.REG_STACK]]; return;
            case 23: /* Set global ptr    */ data[command._param1._value                    ] =  data[command._param2._value + data[$.REG_PTR]  ]; return;
            case 24: /* Set local  const  */ data[command._param1._value + data[$.REG_STACK]] =       command._param2._value;                      return;
            case 25: /* Set local  global */ data[command._param1._value + data[$.REG_STACK]] =  data[command._param2._value                    ]; return;
            case 26: /* Set local  local  */ data[command._param1._value + data[$.REG_STACK]] =  data[command._param2._value + data[$.REG_STACK]]; return;
            case 27: /* Set local  ptr    */ data[command._param1._value + data[$.REG_STACK]] =  data[command._param2._value + data[$.REG_PTR]  ]; return;
            case 28: /* Set ptr    const  */ data[command._param1._value + data[$.REG_PTR]  ] =       command._param2._value;                      return;
            case 29: /* Set ptr    global */ data[command._param1._value + data[$.REG_PTR]  ] =  data[command._param2._value                    ]; return;
            case 30: /* Set ptr    local  */ data[command._param1._value + data[$.REG_PTR]  ] =  data[command._param2._value + data[$.REG_STACK]]; return;
            case 31: /* Set ptr    ptr    */ data[command._param1._value + data[$.REG_PTR]  ] =  data[command._param2._value + data[$.REG_PTR]  ]; return;
            case 32: /* Add const  const  */                                                                                                       return;
            case 33: /* Add const  global */                                                                                                       return;
            case 34: /* Add const  local  */                                                                                                       return;
            case 35: /* Add const  ptr    */                                                                                                       return;
            case 36: /* Add global const  */ data[command._param1._value                    ] +=      command._param2._value;                      return;
            case 37: /* Add global global */ data[command._param1._value                    ] += data[command._param2._value                    ]; return;
            case 38: /* Add global local  */ data[command._param1._value                    ] += data[command._param2._value + data[$.REG_STACK]]; return;
            case 39: /* Add global ptr    */ data[command._param1._value                    ] += data[command._param2._value + data[$.REG_PTR  ]]; return;
            case 40: /* Add local  const  */ data[command._param1._value + data[$.REG_STACK]] +=      command._param2._value;                      return;
            case 41: /* Add local  global */ data[command._param1._value + data[$.REG_STACK]] += data[command._param2._value                    ]; return;
            case 42: /* Add local  local  */ data[command._param1._value + data[$.REG_STACK]] += data[command._param2._value + data[$.REG_STACK]]; return;
            case 43: /* Add local  ptr    */ data[command._param1._value + data[$.REG_STACK]] += data[command._param2._value + data[$.REG_PTR  ]]; return;
            case 44: /* Add ptr    const  */ data[command._param1._value + data[$.REG_PTR  ]] +=      command._param2._value;                      return;
            case 45: /* Add ptr    global */ data[command._param1._value + data[$.REG_PTR  ]] += data[command._param2._value                    ]; return;
            case 46: /* Add ptr    local  */ data[command._param1._value + data[$.REG_PTR  ]] += data[command._param2._value + data[$.REG_STACK]]; return;
            case 47: /* Add ptr    ptr    */ data[command._param1._value + data[$.REG_PTR  ]] += data[command._param2._value + data[$.REG_PTR  ]]; return;
            case 48: /* Sub const  const  */                                                                                                       return;
            case 49: /* Sub const  global */                                                                                                       return;
            case 50: /* Sub const  local  */                                                                                                       return;
            case 51: /* Sub const  ptr    */                                                                                                       return;
            case 52: /* Sub global const  */ data[command._param1._value                    ] -=      command._param2._value;                      return;
            case 53: /* Sub global global */ data[command._param1._value                    ] -= data[command._param2._value                    ]; return;
            case 54: /* Sub global local  */ data[command._param1._value                    ] -= data[command._param2._value + data[$.REG_STACK]]; return;
            case 55: /* Sub global ptr    */ data[command._param1._value                    ] -= data[command._param2._value + data[$.REG_PTR  ]]; return;
            case 56: /* Sub local  const  */ data[command._param1._value + data[$.REG_STACK]] -=      command._param2._value;                      return;
            case 57: /* Sub local  global */ data[command._param1._value + data[$.REG_STACK]] -= data[command._param2._value                    ]; return;
            case 58: /* Sub local  local  */ data[command._param1._value + data[$.REG_STACK]] -= data[command._param2._value + data[$.REG_STACK]]; return;
            case 59: /* Sub local  ptr    */ data[command._param1._value + data[$.REG_STACK]] -= data[command._param2._value + data[$.REG_PTR  ]]; return;
            case 60: /* Sub ptr    const  */ data[command._param1._value + data[$.REG_PTR  ]] -=      command._param2._value;                      return;
            case 61: /* Sub ptr    global */ data[command._param1._value + data[$.REG_PTR  ]] -= data[command._param2._value                    ]; return;
            case 62: /* Sub ptr    local  */ data[command._param1._value + data[$.REG_PTR  ]] -= data[command._param2._value + data[$.REG_STACK]]; return;
            case 63: /* Sub ptr    ptr    */ data[command._param1._value + data[$.REG_PTR  ]] -= data[command._param2._value + data[$.REG_PTR  ]]; return;
            case 64: /* Mul const  const  */                                                                                                       return;
            case 65: /* Mul const  global */                                                                                                       return;
            case 66: /* Mul const  local  */                                                                                                       return;
            case 67: /* Mul const  ptr    */                                                                                                       return;
            case 68: /* Mul global const  */ data[command._param1._value                    ] *=      command._param2._value;                      return;
            case 69: /* Mul global global */ data[command._param1._value                    ] *= data[command._param2._value                    ]; return;
            case 70: /* Mul global local  */ data[command._param1._value                    ] *= data[command._param2._value + data[$.REG_STACK]]; return;
            case 71: /* Mul global ptr    */ data[command._param1._value                    ] *= data[command._param2._value + data[$.REG_PTR  ]]; return;
            case 72: /* Mul local  const  */ data[command._param1._value + data[$.REG_STACK]] *=      command._param2._value;                      return;
            case 73: /* Mul local  global */ data[command._param1._value + data[$.REG_STACK]] *= data[command._param2._value                    ]; return;
            case 74: /* Mul local  local  */ data[command._param1._value + data[$.REG_STACK]] *= data[command._param2._value + data[$.REG_STACK]]; return;
            case 75: /* Mul local  ptr    */ data[command._param1._value + data[$.REG_STACK]] *= data[command._param2._value + data[$.REG_PTR  ]]; return;
            case 76: /* Mul ptr    const  */ data[command._param1._value + data[$.REG_PTR  ]] *=      command._param2._value;                      return;
            case 77: /* Mul ptr    global */ data[command._param1._value + data[$.REG_PTR  ]] *= data[command._param2._value                    ]; return;
            case 78: /* Mul ptr    local  */ data[command._param1._value + data[$.REG_PTR  ]] *= data[command._param2._value + data[$.REG_STACK]]; return;
            case 79: /* Mul ptr    ptr    */ data[command._param1._value + data[$.REG_PTR  ]] *= data[command._param2._value + data[$.REG_PTR  ]]; return;
            case 80: /* Div const  const  */                                                                                                       return;
            case 81: /* Div const  global */                                                                                                       return;
            case 82: /* Div const  local  */                                                                                                       return;
            case 83: /* Div const  ptr    */                                                                                                       return;
            case 84: /* Div global const  */ data[command._param1._value                    ] /=      command._param2._value;                      return;
            case 85: /* Div global global */ data[command._param1._value                    ] /= data[command._param2._value                    ]; return;
            case 86: /* Div global local  */ data[command._param1._value                    ] /= data[command._param2._value + data[$.REG_STACK]]; return;
            case 87: /* Div global ptr    */ data[command._param1._value                    ] /= data[command._param2._value + data[$.REG_PTR  ]]; return;
            case 88: /* Div local  const  */ data[command._param1._value + data[$.REG_STACK]] /=      command._param2._value;                      return;
            case 89: /* Div local  global */ data[command._param1._value + data[$.REG_STACK]] /= data[command._param2._value                    ]; return;
            case 90: /* Div local  local  */ data[command._param1._value + data[$.REG_STACK]] /= data[command._param2._value + data[$.REG_STACK]]; return;
            case 91: /* Div local  ptr    */ data[command._param1._value + data[$.REG_STACK]] /= data[command._param2._value + data[$.REG_PTR  ]]; return;
            case 92: /* Div ptr    const  */ data[command._param1._value + data[$.REG_PTR  ]] /=      command._param2._value;                      return;
            case 93: /* Div ptr    global */ data[command._param1._value + data[$.REG_PTR  ]] /= data[command._param2._value                    ]; return;
            case 94: /* Div ptr    local  */ data[command._param1._value + data[$.REG_PTR  ]] /= data[command._param2._value + data[$.REG_STACK]]; return;
            case 95: /* Div ptr    ptr    */ data[command._param1._value + data[$.REG_PTR  ]] /= data[command._param2._value + data[$.REG_PTR  ]]; return;
        }
    }

    runCommand(command) {
        let data           = this._vmData.getData();
        let regOffsetStack = data[$.REG_STACK];
        let regOffsetPtr   = data[$.REG_PTR];
        let cmd            = command.getCmd();
        let offset;
        let param1;
        let param2;
        let v1;
        let v2;
        switch (cmd) {
            case $.CMD_COPY:
                let size          = this.getParamValue(data, regOffsetStack, regOffsetPtr, command.getParam2());
                let regOffsetSrc  = data[$.REG_SRC];
                let regOffsetDest = data[$.REG_DEST];
                for (let i = 0; i < size; i++) {
                    data[regOffsetDest + i] = data[regOffsetSrc + i];
                }
                break;
            case $.CMD_JMPC:
                v1 = this.getParamValue(data, regOffsetStack, regOffsetPtr, command.getParam1());
                v2 = this.getParamValue(data, regOffsetStack, regOffsetPtr, command.getParam2());
                ((data[$.REG_FLAGS] & v1) === v1) && (data[$.REG_CODE] = v2 - 1);
                break;
            case $.CMD_CMP:
                v1 = this.getParamValue(data, regOffsetStack, regOffsetPtr, command.getParam1());
                v2 = this.getParamValue(data, regOffsetStack, regOffsetPtr, command.getParam2());
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
                v1 = this.getParamValue(data, regOffsetStack, regOffsetPtr, command.getParam1());
                v2 = this.getParamValue(data, regOffsetStack, regOffsetPtr, command.getParam2());
                let modules = this._modules;
                if (modules[v1]) {
                    modules[v1].run(v2);
                } else {
                    throw new Error('Unknown module "' + v1 + '"');
                }
                break;
            case $.CMD_CALL:
                v1     = this.getParamValue(data, regOffsetStack, regOffsetPtr, command.getParam1());
                v2     = command.getParam2().getValue();
                offset = regOffsetStack + v2;
                data[$.REG_STACK] += v2;
                data[offset - 2] = regOffsetStack;
                data[offset - 1] = data[$.REG_CODE];
                data[$.REG_CODE] = v1;
                break;
            case $.CMD_RET:
                v1 = this.getParamValue(data, regOffsetStack, regOffsetPtr, command.getParam1());
                if (!this._vmData.keepRet()) {
                    data[$.REG_RET] = v1;
                }
                data[$.REG_STACK] = data[regOffsetStack - 2];
                data[$.REG_CODE ] = data[regOffsetStack - 1];
                break;
            case $.CMD_SETF: // Set flags
                param1 = command.getParam1();
                v1     = this.getParamValue(data, regOffsetStack, regOffsetPtr, param1);
                v2     = this.getParamValue(data, regOffsetStack, regOffsetPtr, command.getParam2());
                let flagValue = ((data[$.REG_FLAGS] & v2) === v2) ? 1 : 0;
                switch (param1.getType()) {
                    case $.T_NUM_L: data[param1.getValue() + regOffsetStack] = flagValue; break;
                    // The following cases are not generated by the compiler:
                    // Case $.T_NUM_G: data[v]                  = flagValue; break;
                    // Case $.T_NUM_P: data[v + regOffsetPtr]   = flagValue; break;
                }
                break;
            case $.CMD_ADDS: // Add string
                v1 = this.getParamValue(data, regOffsetStack, regOffsetPtr, command.getParam1());
                v2 = this.getParamValue(data, regOffsetStack, regOffsetPtr, command.getParam2());
                this._vmData.getStringList()[v1] += this._vmData.getStringList()[v2];
                break;
            case $.CMD_SETS: // Set string
                v1 = this.getParamValue(data, regOffsetStack, regOffsetPtr, command.getParam1());
                v2 = this.getParamValue(data, regOffsetStack, regOffsetPtr, command.getParam2());
                this._vmData.getStringList()[v1] = this._vmData.getStringList()[v2];
                break;
            case $.CMD_SET:
                param1 = command.getParam1();
                v1     = param1.getValue();
                v2     = this.getParamValue(data, regOffsetStack, regOffsetPtr, command.getParam2());
                switch (param1.getType()) {
                    case $.T_NUM_G: data[v1                 ] = v2; break;
                    case $.T_NUM_L: data[v1 + regOffsetStack] = v2; break;
                    case $.T_NUM_P: data[v1 + regOffsetPtr  ] = v2; break;
                }
                break;
            case $.CMD_ADD:
                param1 = command.getParam1();
                v1     = param1.getValue();
                v2     = this.getParamValue(data, regOffsetStack, regOffsetPtr, command.getParam2());
                switch (param1.getType()) {
                    case $.T_NUM_G: data[v1                 ] += v2; break;
                    case $.T_NUM_L: data[v1 + regOffsetStack] += v2; break;
                    case $.T_NUM_P: data[v1 + regOffsetPtr  ] += v2; break;
                }
                break;
            case $.CMD_SUB:
                param1 = command.getParam1();
                v1     = param1.getValue();
                v2     = this.getParamValue(data, regOffsetStack, regOffsetPtr, command.getParam2());
                switch (param1.getType()) {
                    case $.T_NUM_G: data[v1                 ] -= v2; break;
                    case $.T_NUM_L: data[v1 + regOffsetStack] -= v2; break;
                    case $.T_NUM_P: data[v1 + regOffsetPtr  ] -= v2; break;
                }
                break;
            case $.CMD_MUL:
                param1 = command.getParam1();
                v1     = param1.getValue();
                v2     = this.getParamValue(data, regOffsetStack, regOffsetPtr, command.getParam2());
                switch (param1.getType()) {
                    case $.T_NUM_G: data[v1                 ] *= v2; break;
                    case $.T_NUM_L: data[v1 + regOffsetStack] *= v2; break;
                    case $.T_NUM_P: data[v1 + regOffsetPtr  ] *= v2; break;
                }
                break;
            case $.CMD_DIV:
                param1 = command.getParam1();
                v1     = param1.getValue();
                v2     = this.getParamValue(data, regOffsetStack, regOffsetPtr, command.getParam2());
                if (v2 === 0) {
                    dispatcher.dispatch('VM.Error.DivisionByZero', this.getLastCommand());
                    this.stop();
                    return;
                }
                switch (param1.getType()) {
                    case $.T_NUM_G: data[v1                 ] /= v2; break;
                    case $.T_NUM_L: data[v1 + regOffsetStack] /= v2; break;
                    case $.T_NUM_P: data[v1 + regOffsetPtr  ] /= v2; break;
                }
                break;
            case $.CMD_AND:
                param1 = command.getParam1();
                v1     = param1.getValue();
                v2     = this.getParamValue(data, regOffsetStack, regOffsetPtr, command.getParam2());
                switch (param1.getType()) {
                    case $.T_NUM_G: offset = v1;                  break;
                    case $.T_NUM_L: offset = v1 + regOffsetStack; break;
                    case $.T_NUM_P: offset = v1 + regOffsetPtr;   break;
                }
                data[offset] = data[offset] && v2;
                break;
            case $.CMD_OR:
                param1 = command.getParam1();
                v1     = param1.getValue();
                v2     = this.getParamValue(data, regOffsetStack, regOffsetPtr, command.getParam2());
                switch (param1.getType()) {
                    case $.T_NUM_G: offset = v1;                  break;
                    case $.T_NUM_L: offset = v1 + regOffsetStack; break;
                    case $.T_NUM_P: offset = v1 + regOffsetPtr;   break;
                }
                data[offset] = data[offset] || v2;
                break;
        }
        if (this._vmData.getHeapOverflow()) {
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
        return (this._sleepContinueTime !== null) || (this._sleepProcessContinueTime !== null);
    }

    sleep(time) {
        this._sleepContinueTime = Date.now() + time;
        return this;
    }

    /**
     * A module can also pause the VM execution, this may not interfere with the standard sleep function...
    **/
    sleepForProcess(time) {
        this._sleepProcessContinueTime = Date.now() + time;
        return this;
    }

    run() {
        this._sleepContinueTime        = null;
        this._sleepProcessContinueTime = null;
        let vmData   = this._vmData;
        let data     = vmData.getData();
        let commands = this._commands;
        data[$.REG_CODE] = this._entryPoint;
        while (data[$.REG_CODE] < commands.length) {
            this.runCommand(commands[data[$.REG_CODE]]);
            data[$.REG_CODE]++;
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
        data[$.REG_CODE] = entryPoint;
        let run = (function() { // This function runs a maximum of 1024 VM commands...
                if (!this.running()) {
                    return;
                }
                if (runningRegisters) {
                    vmData.setRegisters(runningRegisters); // Restore the event registers.
                }
                let commandCount = 0;
                while (data[$.REG_CODE] < commands.length) {
                    this._lastCommand = commands[vmData.getGlobalNumber($.REG_CODE)];
                    if (this._lastCommand.getCmd() < 16) {
                        this.runCommand(this._lastCommand);
                    } else {
                        this.runOptimizedCommand(this._lastCommand);
                    }
                    data[$.REG_CODE]++;
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
        let vmData       = this._vmData;
        let data         = vmData.getData();
        let commands     = this._commands;
        let commandCount = commands.length;
        if (!this._runningEvent) {
            for (let count = 0; count < 1024; count++) {
                if (this._stopped || (data[$.REG_CODE] >= commandCount)) {
                    break;
                }
                if ((this._sleepContinueTime === null) && (this._sleepProcessContinueTime === null)) {
                    this._lastCommand = commands[data[$.REG_CODE]];
                    if (this._lastCommand.getCmd() < 16) {
                        this.runCommand(this._lastCommand);
                    } else {
                        this.runOptimizedCommand(this._lastCommand);
                    }
                    data[$.REG_CODE]++;
                } else {
                    let time = Date.now();
                    if ((this._sleepContinueTime !== null) && (time > this._sleepContinueTime)) {
                        this._sleepContinueTime = null;
                    }
                    if ((this._sleepProcessContinueTime !== null) && (time > this._sleepProcessContinueTime)) {
                        this._sleepProcessContinueTime = null;
                    }
                }
            }
        }
        if ((data[$.REG_CODE] < commandCount) && !this._stopped) {
            this._runTimeout = setTimeout(this.runInterval.bind(this, onFinished), 2);
        } else {
            this._stopped    = true;
            this._runTimeout = null;
            onFinished();
            dispatcher.dispatch('VM.Stop', this);
        }
    }

    runIntervalWithBreakpoint(onFinished) {
        let vmData       = this._vmData;
        let data         = vmData.getData();
        let commands     = this._commands;
        let commandCount = commands.length;
        if (!this._runningEvent) {
            for (let count = 0; count < 1024; count++) {
                if (this._stopped || this._breakpoint || (data[$.REG_CODE] >= commandCount)) {
                    break;
                }
                dispatcher.dispatch('VM.Step', this);
                if ((this._sleepContinueTime === null) && (this._sleepProcessContinueTime === null)) {
                    let command    = commands[data[$.REG_CODE]];
                    let breakpoint = command.getBreakpoint();
                    if (breakpoint) {
                        breakpoint.vm    = this;
                        this._breakpoint = command;
                        dispatcher.dispatch('VM.Breakpoint', this, breakpoint);
                    } else {
                        this._lastCommand = commands[data[$.REG_CODE]];
                        if (this._lastCommand.getCmd() < 16) {
                            this.runCommand(this._lastCommand);
                        } else {
                            this.runOptimizedCommand(this._lastCommand);
                        }
                        data[$.REG_CODE]++;
                    }
                } else {
                    let time = Date.now();
                    if ((this._sleepContinueTime !== null) && (time > this._sleepContinueTime)) {
                        this._sleepContinueTime = null;
                    }
                    if ((this._sleepProcessContinueTime !== null) && (time > this._sleepProcessContinueTime)) {
                        this._sleepProcessContinueTime = null;
                    }
                }
            }
        }
        if ((data[$.REG_CODE] < commandCount) && !this._stopped) {
            this._runTimeout = setTimeout(this.runIntervalWithBreakpoint.bind(this, onFinished), 2);
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
            this._lastCommand = this._breakpoint;
            if (this._lastCommand.getCmd() < 16) {
                this.runCommand(this._lastCommand);
            } else {
                this.runOptimizedCommand(this._lastCommand);
            }
            data[$.REG_CODE]++;
        }
        this._breakpoint = false;
        dispatcher.dispatch('VM.Continue', this);
    }

    startRunInterval(onFinished) {
        let count         = 0;
        let hasBreakpoint = false;
        this._commands.forEach((command) => {
            if (command.getBreakpoint()) {
                hasBreakpoint = true;
            }
            switch (command.getCmd()) {
                case $.CMD_SET: command._cmd = 16 + command.getParam1().getType() * 4 + command.getParam2().getType(); count++; break;
                case $.CMD_ADD: command._cmd = 32 + command.getParam1().getType() * 4 + command.getParam2().getType(); count++; break;
                case $.CMD_SUB: command._cmd = 48 + command.getParam1().getType() * 4 + command.getParam2().getType(); count++; break;
                case $.CMD_MUL: command._cmd = 64 + command.getParam1().getType() * 4 + command.getParam2().getType(); count++; break;
                case $.CMD_DIV: command._cmd = 80 + command.getParam1().getType() * 4 + command.getParam2().getType(); count++; break;
            }
        });
        this._sleepContinueTime            = null;
        this._sleepProcessContinueTime     = null;
        this._stopped                      = false;
        this._vmData.getData()[$.REG_CODE] = this._entryPoint;
        if (hasBreakpoint) {
            this.runIntervalWithBreakpoint(onFinished);
        } else {
            this.runInterval(onFinished);
        }
        dispatcher.dispatch('VM.Start', this);
    }
}

exports.VM = VM;
