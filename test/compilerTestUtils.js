require('../public/js/compiler/PreProcessor.js');
require('../public/js/compiler/commands/CommandCompiler.js');
require('../public/js/compiler/commands/StringDeclaration.js');
require('../public/js/compiler/commands/NumberDeclaration.js');
require('../public/js/compiler/commands/NumberInc.js');
require('../public/js/compiler/commands/NumberDec.js');
require('../public/js/compiler/commands/NumberOperator.js');
require('../public/js/compiler/commands/ProcedureDeclaration.js');
require('../public/js/compiler/commands/Set.js');
require('../public/js/compiler/commands/Call.js');
require('../public/js/compiler/commands/CallFunction.js');
require('../public/js/compiler/commands/CallReturn.js');
require('../public/js/compiler/commands/Ret.js');
require('../public/js/compiler/commands/Label.js');
require('../public/js/compiler/commands/ArrayR.js');
require('../public/js/compiler/commands/ArrayW.js');
require('../public/js/compiler/commands/Addr.js');
require('../public/js/compiler/commands/JmpC.js');
require('../public/js/compiler/command.js');
require('../public/js/compiler/compilerHelper.js');
require('../public/js/compiler/CompilerOutput.js');
require('../public/js/compiler/CompilerData.js');
require('../public/js/compiler/Compiler.js');

require('../public/js/vm/Motors.js');
require('../public/js/vm/Sensors.js');
require('../public/js/vm/VMData.js');
require('../public/js/vm/VM.js');
require('../public/js/vm/modules/VMModule.js');
require('../public/js/vm/modules/StandardModule.js');
require('../public/js/vm/modules/ScreenModule.js');
require('../public/js/vm/modules/MotorModule.js');
require('../public/js/vm/modules/SensorModule.js');
require('../public/js/vm/modules/MathModule.js');
require('../public/js/vm/modules/LightModule.js');
require('../public/js/vm/modules/ButtonsModule.js');

var wheel = require('../public/js/utils/base.js').wheel;

exports.setup = function() {
    var compiler = new wheel.compiler.Compiler({});
    var motors   = new wheel.vm.Motors({});
    var sensors  = new wheel.vm.Sensors({});
    var vm       = new wheel.vm.VM({motors: motors, sensors: sensors});

    return {
        compiler: compiler,
        motors:   motors,
        sensors:  sensors,
        vm:       vm
    };
};

exports.createIncludes = function(lines) {
    return [
        {
            filename: 'test',
            lines:    lines
        }
    ];
};