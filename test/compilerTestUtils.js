require('../js/WheelClass.js');
require('../js/compiler/PreProcessor.js');
require('../js/compiler/command.js');
require('../js/compiler/commands/CommandCompiler.js');
require('../js/compiler/commands/Declaration.js');
require('../js/compiler/commands/StringDeclaration.js');
require('../js/compiler/commands/NumberDeclaration.js');
require('../js/compiler/commands/NumberInc.js');
require('../js/compiler/commands/NumberDec.js');
require('../js/compiler/commands/NumberOperator.js');
require('../js/compiler/commands/ProcedureDeclaration.js');
require('../js/compiler/commands/Set.js');
require('../js/compiler/commands/Call.js');
require('../js/compiler/commands/CallFunction.js');
require('../js/compiler/commands/CallReturn.js');
require('../js/compiler/commands/Ret.js');
require('../js/compiler/commands/Label.js');
require('../js/compiler/commands/Addr.js');
require('../js/compiler/commands/JmpC.js');
require('../js/compiler/error.js');
require('../js/compiler/compilerHelper.js');
require('../js/compiler/CompilerOutput.js');
require('../js/compiler/CompilerList.js');
require('../js/compiler/CompilerRecord.js');
require('../js/compiler/CompilerData.js');
require('../js/compiler/CompilerMeta.js');
require('../js/compiler/script/NumericExpressionCompiler.js');
require('../js/compiler/script/BooleanExpressionCompiler.js');
require('../js/compiler/script/ScriptCompiler.js');
require('../js/compiler/Compiler.js');

require('../js/vm/VMData.js');
require('../js/vm/VM.js');
require('../js/vm/modules/VMModule.js');
require('../js/vm/modules/StandardModule.js');
require('../js/vm/modules/ScreenModule.js');
require('../js/vm/modules/MotorModule.js');
require('../js/vm/modules/SensorModule.js');
require('../js/vm/modules/MathModule.js');
require('../js/vm/modules/LightModule.js');
require('../js/vm/modules/ButtonsModule.js');
require('../js/vm/modules/SoundModule.js');

var wheel = require('../js/utils/base.js').wheel;

var setup = function() {
    var compiler = new wheel.compiler.Compiler({});
    var vm       = new wheel.vm.VM({});
    var messages = [];

    vm.on(
        'Log',
        this,
        function(message) {
            messages.push(message);
        }
    );

    return {
        compiler: compiler,
        vm:       vm,
        messages: messages
    };
};
exports.setup = setup;

var createIncludes = function(lines) {
    return [
        {
            filename: 'test',
            lines:    lines
        }
    ];
};
exports.createIncludes = createIncludes;

exports.compile = function(lines) {
    var testData       = setup();
    var compiler       = testData.compiler;
    var vm             = testData.vm;
    var includes       = createIncludes(lines);

    compiler.compile(includes);
};

exports.compileAndRun = function(lines) {
    var testData       = setup();
    var compiler       = testData.compiler;
    var vm             = testData.vm;
    var includes       = createIncludes(lines);
    var outputCommands = compiler.compile(includes);
    var compilerData   = compiler.getCompilerData();
    var vmData         = vm.getVMData();

    //console.log(outputCommands.getLines());

    vm.runAll(
        outputCommands,
        compilerData.getStringList(),
        compilerData.getGlobalConstants(),
        compilerData.getGlobalOffset()
    );

    return {testData: testData, outputCommands: outputCommands, compilerData: compilerData};
};

exports.randomInts = function(count) {
    if (count === undefined) {
        return Math.round(Math.random() * 65536 - 32768);
    }
    var result = [];
    while (result.length < count) {
        result.push(Math.round(Math.random() * 65536 - 32768));
    }
    return result;
}

exports.standardLines = [
    'proc printN(number n)',
    '    record PrintNumber',
    '        number n',
    '    endr',
    '    PrintNumber printNumber',
    '    printNumber.n = n',
    '    asm',
    '        addr     printNumber',
    '        module   0,0',
    '    end',
    'endp',
    'proc printS(string s)',
    '    record PrintString',
    '        string s',
    '    endr',
    '    PrintString printString',
    '    printString.s = s',
    '    asm',
    '        addr     printString',
    '        module   0,1',
    '    end',
    'endp'
];