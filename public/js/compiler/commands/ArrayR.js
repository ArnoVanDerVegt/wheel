/**
 * Compile an array read command.
 *
 *         arrayr value, array, index
 *
 * Read an array value from a given index.
 *
**/
(function() {
    var wheel = require('../../utils/base.js').wheel;
    var $;

    wheel(
        'compiler.commands.ArrayR',
        wheel.Class(wheel.compiler.commands.CommandCompiler, function(supr) {
            this.compileSrcSetupPointer = function(valueParam, arrayParam, indexParam, size) {
                var compiler       = this._compiler;
                var compilerOutput = this._compiler.getOutput();
                var compilerData   = this._compilerData;

                // De-reference the pointer, let REG_SRC point to the value...
                if ($.typeToLocation(arrayParam.type) === 'local') {
                    compilerOutput.a($.set.code, [$.SRC(),   {type: $.T_NUM_L, value: arrayParam.value}]);
                } else {
                    compilerOutput.a($.set.code, [$.DEST(),  $.STACK()]);
                    compilerOutput.a($.set.code, [$.STACK(), {type: $.T_NUM_C, value: arrayParam.value}]);
                    compilerOutput.a($.set.code, [$.SRC(),   {type: $.T_NUM_L, value: 0}]);
                    compilerOutput.a($.set.code, [$.STACK(), $.DEST()]);
                }

                // The third parameter contains the index...
                compilerOutput.a($.set.code, [$.DEST(), indexParam]);

                // Check if the item size is greater than 1, if so multiply with the item size...
                (size > 1) && compilerOutput.a($.mul.code, [$.DEST(), {type: $.T_NUM_C, value: size}]);

/*
                if ((arrayParam.value !== 0) && (arrayParam.metaType !== $.T_META_POINTER)) {
                    // Add the offset of the source var to the REG_SRC register...
                    compilerOutput.add({
                        code: $.add.code,
                        params: [
                            {type: $.T_NUM_G,   value: $.REG_DEST},
                            {type: $.T_NUM_C, value: arrayParam.value}
                        ]
                    });
                }
*/
                // pointer...
                compilerOutput.a($.add.code, [$.SRC(), $.DEST()]);
            };

            this.compileDestSetup = function(valueParam, arrayParam, indexParam, size) {
                var compiler       = this._compiler;
                var compilerOutput = this._compiler.getOutput();
                var compilerData   = this._compilerData;

                // The third parameter contains the index...
                compilerOutput.a($.set.code, [$.SRC(), indexParam]);

                // Check if the item size is greater than 1, if so multiply with the item size...
                (size > 1) && compilerOutput.a($.mul.code, [$.SRC(), {type: $.T_NUM_C, value: size}]);
                if (arrayParam.value !== 0) {
                    // Add the offset of the source var to the REG_SRC register...
                    compilerOutput.a($.add.code, [$.SRC(), {type: $.T_NUM_C, value: arrayParam.value}]);
                }
                if ($.typeToLocation(arrayParam.type) === 'local') {
                    compilerOutput.a($.add.code, [$.SRC(), $.STACK()]);
                }
            };

            this.compile = function(command) {
                $ = wheel.compiler.command;

                var compiler        = this._compiler;
                var compilerOutput  = this._compiler.getOutput();
                var compilerData    = this._compilerData;
                var size            = 1;
                var valueParam      = command.params[0];
                var arrayParam      = command.params[1];
                var indexParam      = command.params[2];

                if ((valueParam.type === $.T_STRUCT_G) ||
                    (valueParam.type === $.T_STRUCT_L)) {
                    var valueStructName = valueParam.vr.struct.name;
                    var arrayStructName = arrayParam.vr.struct.name;
                    if (valueStructName !== arrayStructName) {
                        throw compiler.createError('Type mismatch "' + valueStructName + '" and "' + arrayStructName + '".');
                    }
                    size = valueParam.vr.struct.size;
                }

                if ((arrayParam.metaType === null) && (arrayParam.vr && (arrayParam.vr.metaType === $.T_META_POINTER)) &&
                    (valueParam.metaType === null) && (valueParam.vr && (valueParam.vr.metaType === $.T_META_POINTER))) {
                    // Point *p[10]
                    // Point *p2
                    // arrayr p2, p, 3
                    console.log('a', arrayParam);
                    console.log('v', valueParam);

                    compilerOutput.a($.set.code, [$.DEST(), $.STACK()]);
                    if ($.typeToLocation(indexParam.type) === 'local') {
                        compilerOutput.a($.add.code, [$.STACK(), {type: $.T_NUM_C, value: arrayParam.value}]);
                    } else {
                        compilerOutput.a($.set.code, [$.STACK(), {type: $.T_NUM_C, value: arrayParam.value}]);
                    }

                    compilerOutput.a($.add.code, [$.SRC(),   {type: $.T_NUM_L, value: indexParam.value}]);
                    compilerOutput.a($.set.code, [$.STACK(), $.DEST()]);

                    if ($.typeToLocation(arrayParam.type) === 'local') {
console.log('warning, check local!');
                        compilerOutput.a($.set.code, [{type: $.T_NUM_L, value: arrayParam.value}, $.SRC()]);
                    } else {
console.log('warning, check global!');
                        compilerOutput.a($.set.code, [{type: $.T_NUM_G, value: arrayParam.value}, $.SRC()]);
                    }

                    return;
                }

                if (valueParam.type === $.T_PROC_G) {
                    console.log('Warning unsupported global proc.');
                } else if (valueParam.type === $.T_PROC_L) {
                    if (indexParam.type === $.T_NUM_C) {
                        if ($.typeToLocation(arrayParam.type) === 'global') {
                            compilerOutput.a(
                                $.set.code,
                                [
                                    {type: $.T_NUM_L, value: valueParam.value},
                                    {type: $.T_NUM_G, value: arrayParam.value + indexParam.value}
                                ]
                            );
                        } else {
                            console.log('Unsupported array param location.');
                        }
                    } else {
                        console.log('Unsupported index param type.');
                    }
                } else {
                    if (arrayParam.metaType === $.T_META_POINTER) {
                        this.compileSrcSetupPointer(valueParam, arrayParam, indexParam, size);
                    } else {
                        this.compileDestSetup(valueParam, arrayParam, indexParam, size);
                    }

                    // Set the offset of the destination value...
                    compilerOutput.add({
                        code: $.set.code,
                        params: [
                            $.DEST(),
                            {type: $.T_NUM_C, value: valueParam.value}
                        ]
                    });
                    if ($.typeToLocation(valueParam.type) === 'local') {
                        compilerOutput.a($.add.code, [$.DEST(), $.STACK()]);
                    }

                    compilerOutput.a($.copy.code, [{type: $.T_NUM_C, value: size}, {type: $.T_NUM_C, value: 0}]);
                }
            };
        })
    );
})();