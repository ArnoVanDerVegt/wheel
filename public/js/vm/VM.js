wheel(
    'vm.VM',
    Class(Emitter, function(supr) {
        this.init = function(opts) {
            supr(this, 'init', arguments);

            this._motors      = opts.motors;
            this._vmData      = new VMData({});
            this._commands    = null;
            this._callStack   = [];
            this._runInterval = null;

            this.initModules();
        };

        this.initModules = function() {
            this._modules    = [];
            this._modules[0] = new wheel.vm.modules.StandardModule({vm: this, vmData: this._vmData});
            this._modules[1] = new wheel.vm.modules.ScreenModule  ({vm: this, vmData: this._vmData});
            this._modules[2] = new wheel.vm.modules.MotorModule   ({vm: this, vmData: this._vmData});
            this._modules[3] = new wheel.vm.modules.SensorModule  ({vm: this, vmData: this._vmData});
            this._modules[4] = new wheel.vm.modules.MathModule    ({vm: this, vmData: this._vmData});
            this._modules[5] = new wheel.vm.modules.LightModule   ({vm: this, vmData: this._vmData});
            this._modules[6] = new wheel.vm.modules.ButtonsModule ({vm: this, vmData: this._vmData});
        };

        this.runCommand = function(command) {
            var vmData     = this._vmData;
            var saveResult = function(result) {
                    switch (command.params[0].type) {
                        case wheel.compiler.command.T_NUMBER_GLOBAL: vmData.setGlobalNumber(p1, result); break;
                        case wheel.compiler.command.T_NUMBER_LOCAL:  vmData.setLocalNumber(p1, result);  break;
                    }
                };

            if (command.code <= wheel.compiler.command.NO_PARAM_COMMANDS) { // Commands without parameters...
                switch (command.command) {
                    case 'ret':
                        vmData.popRegOffsetStack();
                        vmData.setGlobalNumber(wheel.compiler.command.REG_OFFSET_CODE, this._callStack.pop());
                        break;

                    default:
                        throw new Error('Unknown command "' + command.command + '"');
                }
            } else {
                var p1 = command.params[0].value;
                var v1;
                switch (command.params[0].type) {
                    case wheel.compiler.command.T_NUMBER_CONSTANT: v1 = p1;                         break;
                    case wheel.compiler.command.T_NUMBER_GLOBAL:   v1 = vmData.getGlobalNumber(p1); break;
                    case wheel.compiler.command.T_NUMBER_LOCAL:    v1 = vmData.getLocalNumber(p1);  break;
                }
                if (command.code <= wheel.compiler.command.SINGLE_PARAM_COMMANDS) { // Commands with a signle parameter...
                    switch (command.command) {
                        case 'copy':
                            var size          = command.params[0].value;
                            var regOffsetSrc  = vmData.getGlobalNumber(wheel.compiler.command.REG_OFFSET_SRC);
                            var regOffsetDest = vmData.getGlobalNumber(wheel.compiler.command.REG_OFFSET_DEST);
                            for (var i = 0; i < size; i++) {
                                var value = vmData.getGlobalNumber(regOffsetSrc + i);
                                vmData.setGlobalNumber(regOffsetDest + i, vmData.getGlobalNumber(regOffsetSrc + i));
                            }
                            break;

                        case 'jmp':
                            vmData.setGlobalNumber(wheel.compiler.command.REG_OFFSET_CODE, p1);
                            break;

                        case 'call':
                            vmData.pushRegOffsetStack(command.params[1].value);
                            this._callStack.push(vmData.getGlobalNumber(wheel.compiler.command.REG_OFFSET_CODE));
                            vmData.setGlobalNumber(wheel.compiler.command.REG_OFFSET_CODE, command.params[0].value - 1)
                            break;

                        default:
                            throw new Error('Unknown command "' + command.command + '"');
                    }
                } else { // Commands with two parameters...
                    var p2 = command.params[1].value;
                    var v2;
                    switch (command.params[1].type) {
                        case wheel.compiler.command.T_NUMBER_CONSTANT: v2 = p2;                         break;
                        case wheel.compiler.command.T_NUMBER_GLOBAL:   v2 = vmData.getGlobalNumber(p2); break;
                        case wheel.compiler.command.T_NUMBER_LOCAL:    v2 = vmData.getLocalNumber(p2);  break;
                    }

                    switch (command.command) {
                        case 'jmpc':
                            var regFlags = vmData.getGlobalNumber(wheel.compiler.command.REG_FLAGS);
                            ((regFlags & v2) === v2) && vmData.setGlobalNumber(wheel.compiler.command.REG_OFFSET_CODE, p1);
                            break;

                        case 'set':
                            saveResult(v2);
                            break;

                        case 'add':
                            saveResult(v1 + v2);
                            break;

                        case 'sub':
                            saveResult(v1 - v2);
                            break;

                        case 'mul':
                            saveResult(v1 * v2);
                            break;

                        case 'div':
                            saveResult(v2 / v2);
                            break;

                        case 'cmp':
                            var flags = 0;
                            (v1 == v2) && (flags |= wheel.compiler.command.FLAG_EQUAL);
                            (v1 != v2) && (flags |= wheel.compiler.command.FLAG_NOT_EQUAL);
                            (v1 <  v2) && (flags |= wheel.compiler.command.FLAG_LESS);
                            (v1 <= v2) && (flags |= wheel.compiler.command.FLAG_LESS_EQUAL);
                            (v1 >  v2) && (flags |= wheel.compiler.command.FLAG_GREATER);
                            (v1 >= v2) && (flags |= wheel.compiler.command.FLAG_GREATER_EQUAL);
                            vmData.setGlobalNumber(wheel.compiler.command.REG_FLAGS, flags);
                            break;

                        case 'module':
                            var modules = this._modules;
                            if (modules[v1]) {
                                modules[v1].run(v2);
                            } else {
                                throw new Error('Unknown module "' + v1 + '"');
                            }
                            break;

                        default:
                            throw new Error('Unknown command "' + command.command + '"');
                    }
                }
            }
        };

        this.onInterval = function() {
            var vmData   = this._vmData;
            var commands = this._commands;
            var count    = 0;
            while ((vmData.getGlobalNumber(wheel.compiler.command.REG_OFFSET_CODE) < commands.length) && (count < 100)) {
                this.runCommand(commands[vmData.getGlobalNumber(wheel.compiler.command.REG_OFFSET_CODE)]);
                vmData.setGlobalNumber(wheel.compiler.command.REG_OFFSET_CODE, vmData.getGlobalNumber(wheel.compiler.command.REG_OFFSET_CODE) + 1);
                count++;
            }
            if (vmData.getGlobalNumber(wheel.compiler.command.REG_OFFSET_CODE) >= commands.length) {
                this.stop();
            }
            this._motors.update();
        };

        this.run = function(commands, stringList, globalConstants, stackOffset, resources) {
            this.stop();

            var modules = this._modules;
            for (var i = 0; i < modules.length; i++) {
                modules[i].setResources(resources);
            }

            var vmData = this._vmData;

            this._motors.reset();
            vmData.setStringList(stringList);
            vmData.setGlobalConstants(globalConstants, stackOffset);
            vmData.pushRegOffsetStack(0);
            this._callStack.push(0xFFFF);
            this._commands = commands.getBuffer();

            vmData.setGlobalNumber(wheel.compiler.command.REG_OFFSET_CODE, commands.getMainIndex());
            this._runInterval = setInterval(this.onInterval.bind(this), 20);
        };

        this.stop = function() {
            if (this._runInterval !== null) {
                clearInterval(this._runInterval);
                this._runInterval = null;
            }
        };

        this.getModule = function(index) {
            return this._modules[index];
        };

        this.getVMData = function() {
            return this._vmData;
        };
    })
);