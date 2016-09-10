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

    wheel(
        'compiler.commands.ArrayW',
        wheel.Class(wheel.compiler.commands.CommandCompiler, function(supr) {
            this.compileDestSetup = function(arrayParam, indexParam, valueParam, size) {
                var compilerOutput = this._compiler.getOutput();
                var compilerData   = this._compilerData;

                // The second parameter contains the index...
                compilerOutput.add({
                    command: 'set',
                    code:    wheel.compiler.command.set.code,
                    params: [
                        {type: wheel.compiler.command.T_NUMBER_GLOBAL, value: wheel.compiler.command.REG_OFFSET_DEST},
                        indexParam
                    ]
                });
                // Check if the item size is greater than 1, if so multiply with the item size...
                (size > 1) && compilerOutput.add({
                    command: 'mul',
                    code:     wheel.compiler.command.mul.code,
                    params: [
                        {type: wheel.compiler.command.T_NUMBER_GLOBAL,   value: wheel.compiler.command.REG_OFFSET_DEST},
                        {type: wheel.compiler.command.T_NUMBER_CONSTANT, value: size}
                    ]
                });

                if (wheel.compiler.command.typeToLocation(arrayParam.type) === 'local') {
                    if (arrayParam.metaType === wheel.compiler.command.T_META_POINTER) {
                        // Local pointer...
                        compilerOutput.add({
                            command: 'add',
                            code:    wheel.compiler.command.add.code,
                            params: [
                                {type: wheel.compiler.command.T_NUMBER_GLOBAL, value: wheel.compiler.command.REG_OFFSET_DEST},
                                {type: wheel.compiler.command.T_NUMBER_LOCAL,  value: arrayParam.value}
                            ]
                        });
                    } else {
                        // Local...
                        if (arrayParam.value !== 0) {
                            // Add the offset of the destination var to the REG_OFFSET_DEST register...
                            compilerOutput.add({
                                command: 'add',
                                code:    wheel.compiler.command.add.code,
                                params: [
                                    {type: wheel.compiler.command.T_NUMBER_GLOBAL,   value: wheel.compiler.command.REG_OFFSET_DEST},
                                    {type: wheel.compiler.command.T_NUMBER_CONSTANT, value: arrayParam.value}
                                ]
                            });
                        }
                        compilerOutput.add({
                            command: 'add',
                            code:    wheel.compiler.command.add.code,
                            params: [
                                {type: wheel.compiler.command.T_NUMBER_GLOBAL, value: wheel.compiler.command.REG_OFFSET_DEST},
                                {type: wheel.compiler.command.T_NUMBER_GLOBAL, value: wheel.compiler.command.REG_OFFSET_STACK}
                            ]
                        });
                    }
                } else {
                    if (arrayParam.value !== 0) {
                        // Add the offset of the destination var to the REG_OFFSET_DEST register...
                        compilerOutput.add({
                            command: 'add',
                            code:    wheel.compiler.command.add.code,
                            params: [
                                {type: wheel.compiler.command.T_NUMBER_GLOBAL, value: wheel.compiler.command.REG_OFFSET_DEST},
                                {type: wheel.compiler.command.T_NUMBER_CONSTANT, value: parseFloat(arrayParam.value)}
                            ]
                        });
                    }
                    if (wheel.compiler.command.typeToLocation(arrayParam.type) === 'local') {
                        compilerOutput.add({
                            command: 'add',
                            code:    wheel.compiler.command.add.code,
                            params: [
                                {type: wheel.compiler.command.T_NUMBER_GLOBAL, value: wheel.compiler.command.REG_OFFSET_DEST},
                                {type: wheel.compiler.command.T_NUMBER_GLOBAL, value: wheel.compiler.command.REG_OFFSET_STACK}
                            ]
                        });
                    }
                }
            };

            this.compileVarWrite = function(arrayParam, indexParam, valueParam, size) {
                var compilerOutput = this._compiler.getOutput();
                var compilerData   = this._compilerData;

                if (valueParam.type === wheel.compiler.command.T_PROC) {
                    if (wheel.compiler.command.typeToLocation(arrayParam.type) === 'global') {
                        if (indexParam.type === wheel.compiler.command.T_NUMBER_CONSTANT) {
                            compilerOutput.add({
                                command: 'set',
                                code:    wheel.compiler.command.set.code,
                                params: [
                                    {type: wheel.compiler.command.T_NUMBER_GLOBAL,   value: arrayParam.value + indexParam.value},
                                    {type: wheel.compiler.command.T_NUMBER_CONSTANT, value: valueParam.value}
                                ]
                            });
                        } else {
                            console.log('Unsupported index param type.');
                        }
                    } else {
                        console.log('Unsupported local index.');
                        /*compilerOutput.add({
                            command: 'set',
                            code:    wheel.compiler.command.set.code,
                            params: [
                                {type: wheel.compiler.command.T_NUMBER_GLOBAL,   value: wheel.compiler.command.REG_OFFSET_SRC},
                                {type: wheel.compiler.command.T_NUMBER_CONSTANT, value: valueParam.value}
                            ]
                        });*/
                    }
                } else {
                    // Set the offset of the source value...
                    compilerOutput.add({
                        command: 'set',
                        code:    wheel.compiler.command.set.code,
                        params: [
                            {type: wheel.compiler.command.T_NUMBER_GLOBAL,   value: wheel.compiler.command.REG_OFFSET_SRC},
                            {type: wheel.compiler.command.T_NUMBER_CONSTANT, value: parseFloat(valueParam.value)}
                        ]
                    });
                    if (wheel.compiler.command.typeToLocation(valueParam.type) === 'local') {
                        compilerOutput.add({
                            command: 'add',
                            code:    wheel.compiler.command.add.code,
                            params: [
                                {type: wheel.compiler.command.T_NUMBER_GLOBAL, value: wheel.compiler.command.REG_OFFSET_SRC},
                                {type: wheel.compiler.command.T_NUMBER_GLOBAL, value: wheel.compiler.command.REG_OFFSET_STACK}
                            ]
                        });
                    }

                    compilerOutput.add({
                        command: 'copy',
                        code:    wheel.compiler.command.copy.code,
                        params: [
                            {type: wheel.compiler.command.T_NUMBER_CONSTANT, value: size},
                            {type: wheel.compiler.command.T_NUMBER_CONSTANT, value: 0}
                        ]
                    });
                }
            };

            this.compileConstWrite = function(arrayParam, indexParam, valueParam) {
                var compilerOutput = this._compiler.getOutput();
                var compilerData   = this._compilerData;
                var localOffset    = compilerData.getLocalOffset();

                if (valueParam.metaType === wheel.compiler.command.T_META_STRING) {
                    valueParam.value = compilerData.declareString(valueParam.value);
                }
                compilerOutput.add({
                    command: 'set',
                    code:    wheel.compiler.command.set.code,
                    params: [
                        {type: wheel.compiler.command.T_NUMBER_LOCAL,    value: localOffset},
                        {type: wheel.compiler.command.T_NUMBER_CONSTANT, value: valueParam.value}
                    ]
                });
                compilerOutput.add({
                    command: 'set',
                    code:    wheel.compiler.command.set.code,
                    params: [
                        {type: wheel.compiler.command.T_NUMBER_GLOBAL, value: wheel.compiler.command.REG_OFFSET_SRC},
                        {type: wheel.compiler.command.T_NUMBER_GLOBAL, value: wheel.compiler.command.REG_OFFSET_STACK}
                    ]
                });
                localOffset && compilerOutput.add({
                    command: 'add',
                    code:    wheel.compiler.command.add.code,
                    params: [
                        {type: wheel.compiler.command.T_NUMBER_GLOBAL,   value: wheel.compiler.command.REG_OFFSET_SRC},
                        {type: wheel.compiler.command.T_NUMBER_CONSTANT, value: localOffset}
                    ]
                });

                compilerOutput.add({
                    command: 'copy',
                    code:    wheel.compiler.command.copy.code,
                    params: [
                        {type: wheel.compiler.command.T_NUMBER_CONSTANT, value: 1},
                        {type: wheel.compiler.command.T_NUMBER_CONSTANT, value: 0}
                    ]
                });
            };

            this.compile = function(command) {
                var compiler     = this._compilerData;
                var compilerData = this._compilerData;
                var size         = 1;
                var arrayParam   = command.params[0];
                var indexParam   = command.params[1];
                var valueParam   = command.params[2];

                if ((arrayParam.type === wheel.compiler.command.T_STRUCT_GLOBAL_ARRAY) ||
                    (arrayParam.type === wheel.compiler.command.T_STRUCT_LOCAL_ARRAY)) {
                    var arrayStructName = arrayParam.vr.struct.name;
                    var valueStructName = valueParam.vr.struct.name;
                    if (arrayStructName !== valueStructName) {
                        throw compiler.createError('Type mismatch "' + arrayStructName + '" and "' + valueStructName + '".');
                    }
                    size = valueParam.vr.struct.size;
                }

                if (valueParam.type !== wheel.compiler.command.T_PROC) {
                    this.compileDestSetup(arrayParam, indexParam, valueParam, size);
                }

                if (valueParam.type === wheel.compiler.command.T_NUMBER_CONSTANT) {
                    this.compileConstWrite(arrayParam, indexParam, valueParam, size);
                } else {
                    this.compileVarWrite(arrayParam, indexParam, valueParam, size);
                }
            };
        })
    );
})();