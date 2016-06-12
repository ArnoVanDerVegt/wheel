/**
 * Compile an array write command.
 *
 *         arrayw array, index, value
 *
 * Store an item in an array at a given index.
 *
**/
wheel(
    'compiler.commands.ArrayW',
    Class(wheel.compiler.commands.CommandCompiler, function(supr) {
        this.compileDestSetup = function(arrayParam, indexParam, valueParam, size) {
            var compilerOutput = this._compiler.getOutput(),
                compilerData   = this._compilerData;

            // The second parameter contains the index...
            compilerOutput.add({
                command: 'set',
                code:    wheel.compiler.command.set.code,
                params: [
                    {type: wheel.compiler.command.T_NUMBER_REGISTER, value: compilerData.findRegister('REG_OFFSET_DEST').index},
                    indexParam
                ]
            });
            // Check if the item size is greater than 1, if so multiply with the item size...
            (size > 1) && compilerOutput.add({
                command: 'mul',
                code:     wheel.compiler.command.mul.code,
                params: [
                    {type: wheel.compiler.command.T_NUMBER_REGISTER, value: compilerData.findRegister('REG_OFFSET_DEST').index},
                    {type: wheel.compiler.command.T_NUMBER_CONSTANT, value: size}
                ]
            });
            if (arrayParam.value !== 0) {
                // Add the offset of the destination var to the REG_OFFSET_DEST register...
                compilerOutput.add({
                    command: 'add',
                    code:    wheel.compiler.command.add.code,
                    params: [
                        {type: wheel.compiler.command.T_NUMBER_REGISTER, value: compilerData.findRegister('REG_OFFSET_DEST').index},
                        {type: wheel.compiler.command.T_NUMBER_CONSTANT, value: parseFloat(arrayParam.value)}
                    ]
                });
            }
            if (wheel.compiler.command.typeToLocation(arrayParam.type) === 'local') {
                compilerOutput.add({
                    command: 'add',
                    code:    wheel.compiler.command.add.code,
                    params: [
                        {type: wheel.compiler.command.T_NUMBER_REGISTER, value: compilerData.findRegister('REG_OFFSET_DEST').index},
                        {type: wheel.compiler.command.T_NUMBER_REGISTER, value: compilerData.findRegister('REG_OFFSET_STACK').index}
                    ]
                });
            }
        };

        this.compileVarWrite = function(arrayParam, indexParam, valueParam, size) {
            var compilerOutput = this._compiler.getOutput();
            var compilerData   = this._compilerData;

            // Set the offset of the source value...
            compilerOutput.add({
                command: 'set',
                code:    wheel.compiler.command.set.code,
                params: [
                    {type: wheel.compiler.command.T_NUMBER_REGISTER, value: compilerData.findRegister('REG_OFFSET_SRC').index},
                    {type: wheel.compiler.command.T_NUMBER_CONSTANT, value: parseFloat(valueParam.value)}
                ]
            });
            if (wheel.compiler.command.typeToLocation(valueParam.type) === 'local') {
                compilerOutput.add({
                    command: 'add',
                    code:    wheel.compiler.command.add.code,
                    params: [
                        {type: wheel.compiler.command.T_NUMBER_REGISTER, value: compilerData.findRegister('REG_OFFSET_SRC').index},
                        {type: wheel.compiler.command.T_NUMBER_REGISTER, value: compilerData.findRegister('REG_OFFSET_STACK').index}
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
                code:    wheel.compiler.command.add.code,
                params: [
                    {type: wheel.compiler.command.T_NUMBER_REGISTER, value: compilerData.findRegister('REG_OFFSET_SRC').index},
                    {type: wheel.compiler.command.T_NUMBER_REGISTER, value: compilerData.findRegister('REG_OFFSET_STACK').index}
                ]
            });
            localOffset && compilerOutput.add({
                command: 'add',
                code:    wheel.compiler.command.add.code,
                params: [
                    {type: wheel.compiler.command.T_NUMBER_REGISTER, value: compilerData.findRegister('REG_OFFSET_SRC').index},
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
            var compiler         = this._compilerData;
            var compilerData     = this._compilerData;
            var size             = 1;
            var arrayParam       = command.params[0];
            var indexParam       = command.params[1];
            var valueParam       = command.params[2];

            if ((arrayParam.type === wheel.compiler.command.T_STRUCT_GLOBAL_ARRAY) ||
                (arrayParam.type === wheel.compiler.command.T_STRUCT_LOCAL_ARRAY)) {
                var arrayStructName = arrayParam.vr.struct.name,
                    valueStructName = valueParam.vr.struct.name;
                if (arrayStructName !== valueStructName) {
                    throw compiler.createError('Type mismatch "' + arrayStructName + '" and "' + valueStructName + '".');
                }
                size = valueParam.vr.struct.size;
            }

            this.compileDestSetup(arrayParam, indexParam, valueParam, size);

            if (valueParam.type === wheel.compiler.command.T_NUMBER_CONSTANT) {
                this.compileConstWrite(arrayParam, indexParam, valueParam, size);
            } else {
                this.compileVarWrite(arrayParam, indexParam, valueParam, size);
            }
        };
    })
);
