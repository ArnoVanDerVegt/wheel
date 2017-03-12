require('../compiler/PreProcessor.js');
require('../compiler/commands/CommandCompiler.js');
require('../compiler/commands/StringDeclaration.js');
require('../compiler/commands/NumberDeclaration.js');
require('../compiler/commands/NumberInc.js');
require('../compiler/commands/NumberDec.js');
require('../compiler/commands/NumberOperator.js');
require('../compiler/commands/ProcedureDeclaration.js');
require('../compiler/commands/Set.js');
require('../compiler/commands/Call.js');
require('../compiler/commands/CallFunction.js');
require('../compiler/commands/CallReturn.js');
require('../compiler/commands/Ret.js');
require('../compiler/commands/Label.js');
require('../compiler/commands/Array.js');
require('../compiler/commands/ArrayR.js');
require('../compiler/commands/ArrayW.js');
require('../compiler/commands/Addr.js');
require('../compiler/commands/JmpC.js');
require('../compiler/command.js');
require('../compiler/error.js');
require('../compiler/compilerHelper.js');
require('../compiler/CompilerOutput.js');
require('../compiler/CompilerData.js');
require('../compiler/script/ExpressionCompiler.js');
require('../compiler/script/ScriptCompiler.js');
require('../compiler/Compiler.js');

require('../vm/VMData.js');
require('../vm/VM.js');
require('../vm/modules/VMModule.js');
require('../vm/modules/StandardModule.js');
require('../vm/modules/ScreenModule.js');
require('../vm/modules/MotorModule.js');
require('../vm/modules/SensorModule.js');
require('../vm/modules/MathModule.js');
require('../vm/modules/LightModule.js');
require('../vm/modules/ButtonsModule.js');

var wheel = require('../utils/base.js').wheel;

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

    vm.runAll(
        outputCommands,
        compilerData.getStringList(),
        compilerData.getGlobalConstants(),
        compilerData.getGlobalOffset()
    );

    return {testData: testData, outputCommands: outputCommands};
};

exports.standardLines = [
    'proc printN(number n)',
    '    struct PrintNumber',
    '        number n',
    '    ends',
    '    PrintNumber printNumber',
    '    set      printNumber.n,n',
    '    addr     printNumber',
    '    module   0,0',
    'endp',
    'proc printS(string s)',
    '    struct PrintString',
    '        string s',
    '    ends',
    '    PrintString printString',
    '    set      printString.s,s',
    '    addr     printString',
    '    module   0,1',
    'endp'
];