(function() {
    var wheel = require('../../utils/base.js').wheel;
    var $;

    wheel(
        'compiler.commands.NumberOperator',
        wheel.Class(wheel.compiler.commands.CommandCompiler, function(supr) {
            this.compile = function(validatedCommand) {
                $ = wheel.compiler.command;

                var compiler         = this._compiler;
                var compilerData     = this._compilerData;
                var compilerOutput   = compiler.getOutput();
                var param1           = validatedCommand.params[0];
                var param2           = validatedCommand.params[1];
                var regDestSet       = false;
                var regStackSaved    = false;

                if (param2.metaType === $.T_META_POINTER) {
                    compilerOutput.a($.set.code, [$.SRC(), {type: $.T_NUM_G, value: $.REG_STACK}]);
                    regStackSaved = true;

                    if ($.typeToLocation(param2.type) === 'local') {
                        compilerOutput.a($.set.code, [$.STACK(), {type: $.T_NUM_L, value: param2.value}]);
                    } else {
                        compilerOutput.a($.set.code, [$.STACK(), {type: $.T_NUM_G, value: param2.value}]);
                    }
                    compilerOutput.a($.set.code, [$.DEST(), {type: $.T_NUM_L,  value: 0}]);
                    regDestSet = true;

                    compilerOutput.a($.set.code, [$.STACK(), $.SRC()]);

                    if (param1.metaType !== $.T_META_POINTER) {
                        param2.type  = $.T_NUM_G;
                        param2.value = $.REG_DEST;
                        compilerOutput.add(validatedCommand);
                        return;
                    }
                }

                if (param1.metaType === $.T_META_POINTER) {
                    if (!regDestSet) {
                        compilerOutput.a($.set.code, [$.DEST(), JSON.parse(JSON.stringify(param2))]);
                    }
                    if (!regStackSaved) {
                        // Save the stack pointer to the source register...
                        compilerOutput.a($.set.code, [$.SRC(), {type: $.T_NUM_G, value: $.REG_STACK}]);
                    }

                    if ($.typeToLocation(param1.type) === 'local') {
                        compilerOutput.a($.set.code, [$.STACK(), {type: $.T_NUM_L, value: param1.value}]);
                    } else {
                        compilerOutput.a($.set.code, [$.STACK(), {type: $.T_NUM_G, value: param1.value}]);
                    }

                    param1.type  = $.T_NUM_L;
                    param1.value = 0;
                    param2.type  = $.T_NUM_G;
                    param2.value = $.REG_DEST;
                    compilerOutput.add(validatedCommand);

                    // Restore the stack register...
                    compilerOutput.a($.set.code, [$.STACK(), $.SRC()]);
                } else {
                    compilerOutput.add(validatedCommand);
                }
            };
        })
    );
})();