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

                // De-reference the pointer, let REG_OFFSET_SRC point to the value...
                if ($.typeToLocation(arrayParam.type) === 'local') {
                    compilerOutput.add({
                        code: $.set.code,
                        params: [
                            {type: $.T_NUMBER_GLOBAL, value: $.REG_OFFSET_SRC},
                            {type: $.T_NUMBER_LOCAL,  value: arrayParam.value}
                        ]
                    });
                } else {
                    compilerOutput.add({
                        code: $.set.code,
                        params: [
                            {type: $.T_NUMBER_GLOBAL, value: $.REG_OFFSET_DEST},
                            {type: $.T_NUMBER_GLOBAL, value: $.REG_OFFSET_STACK}
                        ]
                    });
                    compilerOutput.add({
                        code: $.set.code,
                        params: [
                            {type: $.T_NUMBER_GLOBAL,   value: $.REG_OFFSET_STACK},
                            {type: $.T_NUMBER_CONSTANT, value: arrayParam.value}
                        ]
                    });
                    compilerOutput.add({
                        code: $.set.code,
                        params: [
                            {type: $.T_NUMBER_GLOBAL, value: $.REG_OFFSET_SRC},
                            {type: $.T_NUMBER_LOCAL,  value: 0}
                        ]
                    });
                    compilerOutput.add({
                        code: $.set.code,
                        params: [
                            {type: $.T_NUMBER_GLOBAL, value: $.REG_OFFSET_STACK},
                            {type: $.T_NUMBER_GLOBAL, value: $.REG_OFFSET_DEST}
                        ]
                    });
                }

                // The third parameter contains the index...
                compilerOutput.add({
                    code: $.set.code,
                    params: [
                        {type: $.T_NUMBER_GLOBAL, value: $.REG_OFFSET_DEST},
                        indexParam
                    ]
                });

                // Check if the item size is greater than 1, if so multiply with the item size...
                (size > 1) && compilerOutput.add({
                    code: $.mul.code,
                    params: [
                        {type: $.T_NUMBER_GLOBAL, value: $.REG_OFFSET_DEST},
                        {type: $.T_NUMBER_CONSTANT, value: size}
                    ]
                });

/*
                if ((arrayParam.value !== 0) && (arrayParam.metaType !== $.T_META_POINTER)) {
                    // Add the offset of the source var to the REG_OFFSET_SRC register...
                    compilerOutput.add({
                        code: $.add.code,
                        params: [
                            {type: $.T_NUMBER_GLOBAL,   value: $.REG_OFFSET_DEST},
                            {type: $.T_NUMBER_CONSTANT, value: arrayParam.value}
                        ]
                    });
                }
*/

                // pointer...
                compilerOutput.add({
                    code: $.add.code,
                    params: [
                        {type: $.T_NUMBER_GLOBAL, value: $.REG_OFFSET_SRC},
                        {type: $.T_NUMBER_GLOBAL, value: $.REG_OFFSET_DEST}
                    ]
                });
            };

            this.compileDestSetup = function(valueParam, arrayParam, indexParam, size) {
                var compiler       = this._compiler;
                var compilerOutput = this._compiler.getOutput();
                var compilerData   = this._compilerData;

                // The third parameter contains the index...
                compilerOutput.add({
                    code: $.set.code,
                    params: [
                        {type: $.T_NUMBER_GLOBAL, value: $.REG_OFFSET_SRC},
                        indexParam
                    ]
                });
                // Check if the item size is greater than 1, if so multiply with the item size...
                (size > 1) && compilerOutput.add({
                    code: $.mul.code,
                    params: [
                        {type: $.T_NUMBER_GLOBAL,   value: $.REG_OFFSET_SRC},
                        {type: $.T_NUMBER_CONSTANT, value: size}
                    ]
                });
                if (arrayParam.value !== 0) {
                    // Add the offset of the source var to the REG_OFFSET_SRC register...
                    compilerOutput.add({
                        code: $.add.code,
                        params: [
                            {type: $.T_NUMBER_GLOBAL,   value: $.REG_OFFSET_SRC},
                            {type: $.T_NUMBER_CONSTANT, value: arrayParam.value}
                        ]
                    });
                }
                if ($.typeToLocation(arrayParam.type) === 'local') {
                    compilerOutput.add({
                        code: $.add.code,
                        params: [
                            {type: $.T_NUMBER_GLOBAL, value: $.REG_OFFSET_SRC},
                            {type: $.T_NUMBER_GLOBAL, value: $.REG_OFFSET_STACK}
                        ]
                    });
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

                if ((valueParam.type === $.T_STRUCT_GLOBAL) ||
                    (valueParam.type === $.T_STRUCT_LOCAL)) {
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

                    compilerOutput.add({ // set dest, stack
                        code: $.set.code,
                        params: [
                            {type: $.T_NUMBER_GLOBAL, value: $.REG_OFFSET_DEST},
                            {type: $.T_NUMBER_GLOBAL, value: $.REG_OFFSET_STACK}
                        ]
                    });
                    if ($.typeToLocation(indexParam.type) === 'local') {
                        compilerOutput.add({ // add stack, arrayParam.value
                            code: $.add.code,
                            params: [
                                {type: $.T_NUMBER_GLOBAL,   value: $.REG_OFFSET_STACK},
                                {type: $.T_NUMBER_CONSTANT, value: arrayParam.value}
                            ]
                        });
                    } else {
                        compilerOutput.add({ // set stakc, arrayParam.value
                            code: $.set.code,
                            params: [
                                {type: $.T_NUMBER_GLOBAL,   value: $.REG_OFFSET_STACK},
                                {type: $.T_NUMBER_CONSTANT, value: arrayParam.value}
                            ]
                        });
                    }

                    compilerOutput.add({ // set src, [stack+array offset]
                        code: $.add.code,
                        params: [
                            {type: $.T_NUMBER_GLOBAL, value: $.REG_OFFSET_SRC},
                            {type: $.T_NUMBER_LOCAL,  value: indexParam.value}
                        ]
                    });
                    compilerOutput.add({ // set stack, dest
                        code: $.set.code,
                        params: [
                            {type: $.T_NUMBER_GLOBAL, value: $.REG_OFFSET_STACK},
                            {type: $.T_NUMBER_GLOBAL, value: $.REG_OFFSET_DEST}
                        ]
                    });

                    if ($.typeToLocation(arrayParam.type) === 'local') {
console.log('warning, check local!');
                        compilerOutput.add({ // set [stack + arrayParam.value], src
                            code: $.set.code,
                            params: [
                                {type: $.T_NUMBER_LOCAL, value: arrayParam.value},
                                {type: $.T_NUMBER_GLOBAL, value: $.REG_OFFSET_SRC}
                            ]
                        });
                    } else {
console.log('warning, check global!');
                        compilerOutput.add({ // set [arrayParam.value], src
                            code: $.set.code,
                            params: [
                                {type: $.T_NUMBER_GLOBAL, value: arrayParam.value},
                                {type: $.T_NUMBER_GLOBAL, value: $.REG_OFFSET_SRC}
                            ]
                        });
                    }

                    return;
                }

                if (valueParam.type === $.T_PROC_GLOBAL) {
                    console.log('Warning unsupported global proc.');
                } else if (valueParam.type === $.T_PROC_LOCAL) {
                    if (indexParam.type === $.T_NUMBER_CONSTANT) {
                        if ($.typeToLocation(arrayParam.type) === 'global') {
                            compilerOutput.add({
                                code: $.set.code,
                                params: [
                                    {type: $.T_NUMBER_LOCAL,  value: valueParam.value},
                                    {type: $.T_NUMBER_GLOBAL, value: arrayParam.value + indexParam.value}
                                ]
                            });
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
                            {type: $.T_NUMBER_GLOBAL,   value: $.REG_OFFSET_DEST},
                            {type: $.T_NUMBER_CONSTANT, value: valueParam.value}
                        ]
                    });
                    if ($.typeToLocation(valueParam.type) === 'local') {
                        compilerOutput.add({
                            code: $.add.code,
                            params: [
                                {type: $.T_NUMBER_GLOBAL, value: $.REG_OFFSET_DEST},
                                {type: $.T_NUMBER_GLOBAL, value: $.REG_OFFSET_STACK}
                            ]
                        });
                    }

                    compilerOutput.add({
                        code: $.copy.code,
                        params: [
                            {type: $.T_NUMBER_CONSTANT, value: size},
                            {type: $.T_NUMBER_CONSTANT, value: 0}
                        ]
                    });
                }
            };
        })
    );
})();