(function() {
    var wheel = require('../utils/base.js').wheel;

    wheel(
        'vm.VM',
        wheel.Class(wheel.Emitter, function(supr) {
            this.init = function(opts) {
                supr(this, 'init', arguments);

                this._motors      = opts.motors;
                this._vmData      = new wheel.VMData({});
                this._commands    = null;
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
                var vmData = this._vmData;
                var data   = vmData.getData();

                var p1 = command.params[0].value;
                var v1;
                var regOffsetStack = data[wheel.compiler.command.REG_OFFSET_STACK];
                switch (command.params[0].type) {
                    case wheel.compiler.command.T_NUMBER_CONSTANT: v1 = p1;                         break;
                    case wheel.compiler.command.T_NUMBER_GLOBAL:   v1 = data[p1];                   break;
                    case wheel.compiler.command.T_NUMBER_LOCAL:    v1 = data[p1 + regOffsetStack];  break;
                }
                var p2 = command.params[1].value;
                var v2;
                switch (command.params[1].type) {
                    case wheel.compiler.command.T_NUMBER_CONSTANT: v2 = p2;                         break;
                    case wheel.compiler.command.T_NUMBER_GLOBAL:   v2 = data[p2];                   break;
                    case wheel.compiler.command.T_NUMBER_LOCAL:    v2 = data[p2 + regOffsetStack];  break;
                }

                switch (command.code) {
                    case 0: // copy
                        var size          = v1;
                        var regOffsetSrc  = data[wheel.compiler.command.REG_OFFSET_SRC];
                        var regOffsetDest = data[wheel.compiler.command.REG_OFFSET_DEST];
                        for (var i = 0; i < size; i++) {
                            var value = data[regOffsetSrc + i];
                            data[regOffsetDest + i] = data[regOffsetSrc + i];
                        }
                        break;

                    case 1: // jmpc
                        var regFlags = data[wheel.compiler.command.REG_FLAGS];
                        ((regFlags & v2) === v2) && (data[wheel.compiler.command.REG_OFFSET_CODE] = p1);
                        break;

                    case 2: // cmp
                        var flags = 0;
                        (v1 == v2) && (flags |= wheel.compiler.command.FLAG_EQUAL);
                        (v1 != v2) && (flags |= wheel.compiler.command.FLAG_NOT_EQUAL);
                        (v1 <  v2) && (flags |= wheel.compiler.command.FLAG_LESS);
                        (v1 <= v2) && (flags |= wheel.compiler.command.FLAG_LESS_EQUAL);
                        (v1 >  v2) && (flags |= wheel.compiler.command.FLAG_GREATER);
                        (v1 >= v2) && (flags |= wheel.compiler.command.FLAG_GREATER_EQUAL);

                        data[wheel.compiler.command.REG_FLAGS] = flags;
                        break;

                    case 3: // module
                        var modules = this._modules;
                        if (modules[v1]) {
                            modules[v1].run(v2);
                        } else {
                            throw new Error('Unknown module "' + v1 + '"');
                        }
                        break;

                    default:
                        var result = null;
                        switch (command.code) {
                            case 4: // set
                                result = v2;
                                break;

                            case 5: // add
                                result = v1 + v2;
                                break;

                            case 6: // sub
                                result = v1 - v2;
                                break;

                            case 7: // mul
                                result = v1 * v2;
                                break;

                            case 8: // div
                                result = v1 / v2;
                                break;

                            case 9: // mod
                                result = v1 % v2;
                                break;

                            case 10: // and
                                result = v1 & v2;
                                break;

                            case 11: // or
                                result = v1 | v2;
                                break;

                            case 12: // xor
                                result = v1 ^ v2;
                                break;

                            default:
                                throw new Error('Unknown command "' + command.command + '"');
                        }

                        switch (command.params[0].type) {
                            case wheel.compiler.command.T_NUMBER_GLOBAL: data[p1]                  = result; break;
                            case wheel.compiler.command.T_NUMBER_LOCAL:  data[p1 + regOffsetStack] = result; break;
                        }
                }
            };

            this.onInterval = function() {
                var vmData   = this._vmData;
                var commands = this._commands;
                var count    = 0;
                while ((vmData.getGlobalNumber(wheel.compiler.command.REG_OFFSET_CODE) < commands.length - 1) && (count < 100)) {
                    //console.log(vmData.getGlobalNumber(wheel.compiler.command.REG_OFFSET_CODE));
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
                this._commands = commands.getBuffer();

                vmData.setGlobalNumber(wheel.compiler.command.REG_OFFSET_CODE, commands.getMainIndex());
                this._runInterval = setInterval(this.onInterval.bind(this), 20);
            };

            this.runAll = function(commands, stringList, globalConstants, stackOffset, resources) {
                this.stop();

                var modules = this._modules;
                for (var i = 0; i < modules.length; i++) {
                    modules[i].setResources(resources);
                }

                var vmData = this._vmData;

                this._motors.reset();
                vmData.reset(stackOffset);
                vmData.setStringList(stringList);
                vmData.setGlobalConstants(globalConstants, stackOffset);
                this._commands = commands.getBuffer();

                vmData.setGlobalNumber(wheel.compiler.command.REG_OFFSET_CODE, commands.getMainIndex());

                // Return pointers...
                vmData.setGlobalNumber(stackOffset,     stackOffset); // Stack offset
                vmData.setGlobalNumber(stackOffset + 1, 65535);       // Code execution position...

                this.onInterval();
            };

            this.stop = function() {
                if (this._runInterval !== null) {
                    clearInterval(this._runInterval);
                    this._runInterval = null;
                }
            };

            this.getModule = function(index) {
                //console.log('get', this._modules);
                return this._modules[index];
            };

            this.getVMData = function() {
                return this._vmData;
            };
        })
    );
})();