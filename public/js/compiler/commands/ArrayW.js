/**
 * Compile an array write command.
 *
 *         arrayw array, index, value
 *
 * Store an item in an array at a given index.
 *
**/
(function() {
    var wheel = require('../../utils/base.js').wheel;
    var $;

    wheel(
        'compiler.commands.ArrayW',
        wheel.Class(wheel.compiler.commands.CommandCompiler, function(supr) {
            this.compileDestSetup = function(arrayParam, indexParam, valueParam, size) {
                var compilerOutput = this._compiler.getOutput();
                var compilerData   = this._compilerData;

                // The second parameter contains the index...
                // set dest, indexParam
                compilerOutput.a($.set.code, [$.DEST(), indexParam]);
                // Check if the item size is greater than 1, if so multiply with the item size...
                (size > 1) && // mul dest, size
                    compilerOutput.a($.mul.code, [$.DEST(), {type: $.T_NUM_C, value: size}]);

                if ($.typeToLocation(arrayParam.type) === 'local') {
                    if (arrayParam.metaType === $.T_META_POINTER) {
                        // Local pointer...
                        compilerOutput.a($.add.code, [$.DEST(), {type: $.T_NUM_L, value: arrayParam.value}]);
                    } else {
                        // Local...
                        (arrayParam.value !== 0) &&
                            // Add the offset of the destination var to the REG_DEST register...
                            compilerOutput.a($.add.code, [$.DEST(), {type: $.T_NUM_C, value: arrayParam.value}]);

                        compilerOutput.a($.add.code, [$.DEST(), $.STACK()]);
                    }
                } else {
                    if (arrayParam.value !== 0) {
                        // Add the offset of the destination var to the REG_DEST register...
                        compilerOutput.a($.add.code, [$.DEST(), {type: $.T_NUM_C, value: parseFloat(arrayParam.value)}]);
                    }
                    if ($.typeToLocation(arrayParam.type) === 'local') {
                        compilerOutput.a($.add.code, [{type: $.T_NUM_G, value: $.REG_DEST}, $.STACK()]);
                    }
                }
            };

            this.compileVarWrite = function(arrayParam, indexParam, valueParam, size) {
                var compilerOutput = this._compiler.getOutput();
                var compilerData   = this._compilerData;

                if (valueParam.type === $.T_PROC) {
                    if ($.typeToLocation(arrayParam.type) === 'global') {
                        if (indexParam.type === $.T_NUM_C) {
                            // set [offset], valueParam.value
                            var offset = arrayParam.value + indexParam.value;
                            compilerOutput.a($.set.code, [{type: $.T_NUM_G, value: offset}, {type: $.T_NUM_C, value: valueParam.value}]);
                        } else {
                            console.log('Unsupported index param type.');
                        }
                    } else {
                        console.log('Unsupported local index.');
                        /*compilerOutput.add({
                            code: $.set.code,
                            params: [
                                {type: $.T_NUM_G,   value: $.REG_SRC},
                                {type: $.T_NUM_C, value: valueParam.value}
                            ]
                        });*/
                    }
                } else {
                    // Set the offset of the source value...
                    compilerOutput.a($.set.code, [$.SRC(), {type: $.T_NUM_C, value: parseFloat(valueParam.value)}]);
                    if ($.typeToLocation(valueParam.type) === 'local') {
                        compilerOutput.a($.add.code, [$.SRC(), $.STACK()]);
                    }

                    compilerOutput.a($.copy.code, [{type: $.T_NUM_C, value: size}, {type: $.T_NUM_C, value: 0}]);
                }
            };

            this.compileConstWrite = function(arrayParam, indexParam, valueParam) {
                var compilerOutput = this._compiler.getOutput();
                var compilerData   = this._compilerData;
                var localOffset    = compilerData.getLocalOffset();

                if (valueParam.metaType === $.T_META_STRING) {
                    valueParam.value = compilerData.declareString(valueParam.value);
                }
                compilerOutput.a($.set.code, [{type: $.T_NUM_L, value: localOffset}, {type: $.T_NUM_C, value: valueParam.value}]);

                compilerOutput.a($.set.code, [$.SRC(), $.STACK()]);
                localOffset && compilerOutput.a($.add.code, [$.SRC(), {type: $.T_NUM_C, value: localOffset}]);

                compilerOutput.a($.copy.code, [{type: $.T_NUM_C, value: 1}, {type: $.T_NUM_C, value: 0}]);
            };

            this.compilePointerWrite = function(arrayParam, indexParam, valueParam) {
                var compilerOutput = this._compiler.getOutput();
                var compilerData   = this._compilerData;
                var localOffset    = compilerData.getLocalOffset();

                if ($.typeToLocation(arrayParam.type) === 'local') {
                    compilerOutput.a($.set.code, [{type: $.T_NUM_L, value: localOffset}, {type: $.T_NUM_C, value: valueParam.value}]);
                    compilerOutput.a($.add.code, [{type: $.T_NUM_L, value: localOffset}, $.STACK()]);
                } else {
                    compilerOutput.add({
                        code: $.set.code,
                        params: [
                            {type: $.T_NUM_L, value: localOffset},
                            {type: $.T_NUM_C, value: valueParam.value}
                        ]
                    });
                }

                compilerOutput.a($.set.code, [$.SRC(), $.STACK()]);
                localOffset && compilerOutput.a($.add.code, [$.SRC(), {type: $.T_NUM_C, value: localOffset}]);

                compilerOutput.a($.copy.code, [{type: $.T_NUM_C, value: 1}, {type: $.T_NUM_C, value: 0}]);
            };

            this.compile = function(command) {
                $ = wheel.compiler.command;

                var compiler     = this._compilerData;
                var compilerData = this._compilerData;
                var size         = 1;
                var arrayParam   = command.params[0];
                var indexParam   = command.params[1];
                var valueParam   = command.params[2];

                if ((arrayParam.type === $.T_STRUCT_G_ARRAY) ||
                    (arrayParam.type === $.T_STRUCT_L_ARRAY)) {
                    var arrayStructName = arrayParam.vr.struct.name;
                    var valueStructName = valueParam.vr.struct.name;
                    if (arrayStructName !== valueStructName) {
                        throw compiler.createError('Type mismatch "' + arrayStructName + '" and "' + valueStructName + '".');
                    }
                    size = valueParam.vr.struct.size;
                }
                if (arrayParam && arrayParam.vr && (arrayParam.vr.metaType === $.T_META_POINTER)) {
                    if ((arrayParam.metaType === null) && (valueParam.metaType === $.T_META_ADDRESS)) {
                        // Point *p[10]
                        // arrayw p, 3, &p1
                        this.compilePointerWrite(arrayParam, indexParam, valueParam);
                        return;
                    }
                }

                if (valueParam.type !== $.T_PROC) {
                    this.compileDestSetup(arrayParam, indexParam, valueParam, size);
                }

                if (valueParam.type === $.T_NUM_C) {
                    this.compileConstWrite(arrayParam, indexParam, valueParam, size);
                } else {
                    this.compileVarWrite(arrayParam, indexParam, valueParam, size);
                }
            };
        })
    );
})();