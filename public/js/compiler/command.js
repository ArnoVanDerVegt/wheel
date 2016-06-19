(function() {
    var T_NUMBER_CONSTANT       =  0;
    var T_NUMBER_GLOBAL         =  1;
    var T_NUMBER_LOCAL          =  2;

    var T_LABEL                 =  4;
    var T_PROC                  =  5;

    var T_NUMBER_GLOBAL_ARRAY   =  6;
    var T_NUMBER_LOCAL_ARRAY    =  7;

    var T_STRUCT_GLOBAL         =  8;
    var T_STRUCT_GLOBAL_ARRAY   =  9;
    var T_STRUCT_LOCAL          = 10;
    var T_STRUCT_LOCAL_ARRAY    = 11;

    var T_PROC_GLOBAL           = 12;
    var T_PROC_GLOBAL_ARRAY     = 13;
    var T_PROC_LOCAL            = 14;
    var T_PROC_LOCAL_ARRAY      = 15;

    var T_META_STRING           =  1;
    var T_META_POINTER          =  2;
    var T_META_ADDRESS          =  3;

    var NO_PARAM_COMMANDS       =  0;
    var SINGLE_PARAM_COMMANDS   =  3;

    var FLAG_EQUAL              =  1;
    var FLAG_NOT_EQUAL          =  2;
    var FLAG_LESS               =  4;
    var FLAG_LESS_EQUAL         =  8;
    var FLAG_GREATER            = 16;
    var FLAG_GREATER_EQUAL      = 32;

    var REG_OFFSET_STACK        =  0;
    var REG_OFFSET_SRC          =  1;
    var REG_OFFSET_DEST         =  2;
    var REG_OFFSET_CODE         =  3;
    var REG_RETURN              =  4;
    var REG_FLAGS               =  5;

    var REGISTER_COUNT          =  6;

    wheel(
        'compiler.command',
        {
            // Commands without parameters...
            ret: {
                code: 0
            },

            // Commands with a single parameter...
            copy: {
                code: 1,
                args: [
                    {type: T_NUMBER_CONSTANT}
                ]
            },
            jmp: {
                code: 2,
                args: [
                    {type: T_LABEL}
                ]
            },
            call: {
                code: 3,
                args: [
                    {type: T_NUMBER_CONSTANT},
                    {type: T_PROC_LOCAL},
                    {type: T_PROC_GLOBAL}
                ]
            },
            // Commands with 2 parameters...
            jmpc: {
                code: 4,
                args: [
                    {
                        type: T_LABEL,
                        args: [
                            {type: T_NUMBER_CONSTANT}
                        ]
                    }
                ]
            },
            set: {
                code: 5,
                args: [
                    {
                        type: T_NUMBER_GLOBAL,
                        args: [
                            {type: T_NUMBER_CONSTANT},
                            {type: T_NUMBER_GLOBAL},
                            {type: T_NUMBER_LOCAL},
                            {type: T_PROC}
                        ]
                    },
                    {
                        type: T_NUMBER_LOCAL,
                        args: [
                            {type: T_NUMBER_CONSTANT},
                            {type: T_NUMBER_GLOBAL},
                            {type: T_NUMBER_LOCAL},
                            {type: T_PROC}
                        ]
                    },
                    {
                        type: T_PROC_GLOBAL,
                        args: [
                            {type: T_PROC_GLOBAL},
                            {type: T_PROC_LOCAL},
                            {type: T_PROC}
                        ]
                    },
                    {
                        type: T_PROC_LOCAL,
                        args: [
                            {type: T_PROC_GLOBAL},
                            {type: T_PROC_LOCAL},
                            {type: T_PROC}
                        ]
                    },
                    {
                        type:         T_STRUCT_LOCAL,
                        metaType:     T_META_POINTER,
                        args: [
                            {type: T_STRUCT_GLOBAL, metaType: T_META_POINTER},
                            {type: T_STRUCT_GLOBAL, metaType: T_META_ADDRESS},
                            {type: T_STRUCT_LOCAL,     metaType: T_META_POINTER},
                            {type: T_STRUCT_LOCAL,     metaType: T_META_ADDRESS}
                        ]
                    },
                    {
                        type:         T_STRUCT_GLOBAL,
                        metaType:     T_META_POINTER,
                        args: [
                            {type: T_STRUCT_GLOBAL, metaType: T_META_POINTER},
                            {type: T_STRUCT_GLOBAL, metaType: T_META_ADDRESS},
                            {type: T_STRUCT_LOCAL,     metaType: T_META_POINTER},
                            {type: T_STRUCT_LOCAL,     metaType: T_META_ADDRESS}
                        ]
                    }
                ]
            },
            add: {
                code: 6,
                args: [
                    {
                        type: T_NUMBER_GLOBAL,
                        args: [
                            {type: T_NUMBER_CONSTANT},
                            {type: T_NUMBER_GLOBAL},
                            {type: T_NUMBER_LOCAL}
                        ]
                    },
                    {
                        type: T_NUMBER_LOCAL,
                        args: [
                            {type: T_NUMBER_CONSTANT},
                            {type: T_NUMBER_GLOBAL},
                            {type: T_NUMBER_LOCAL}
                        ]
                    }
                ]
            },
            sub: {
                code: 7,
                args: [
                    {
                        type: T_NUMBER_GLOBAL,
                        args: [
                            {type: T_NUMBER_CONSTANT},
                            {type: T_NUMBER_GLOBAL},
                            {type: T_NUMBER_LOCAL}
                        ]
                    },
                    {
                        type: T_NUMBER_LOCAL,
                        args: [
                            {type: T_NUMBER_CONSTANT},
                            {type: T_NUMBER_GLOBAL},
                            {type: T_NUMBER_LOCAL}
                        ]
                    }
                ]
            },
            mul: {
                code: 8,
                args: [
                    {
                        type: T_NUMBER_GLOBAL,
                        args: [
                            {type: T_NUMBER_CONSTANT},
                            {type: T_NUMBER_GLOBAL},
                            {type: T_NUMBER_LOCAL}
                        ]
                    },
                    {
                        type: T_NUMBER_LOCAL,
                        args: [
                            {type: T_NUMBER_CONSTANT},
                            {type: T_NUMBER_GLOBAL},
                            {type: T_NUMBER_LOCAL}
                        ]
                    }
                ]
            },
            div: {
                code: 9,
                args: [
                    {
                        type: T_NUMBER_GLOBAL,
                        args: [
                            {type: T_NUMBER_CONSTANT},
                            {type: T_NUMBER_GLOBAL},
                            {type: T_NUMBER_LOCAL}
                        ]
                    },
                    {
                        type: T_NUMBER_LOCAL,
                        args: [
                            {type: T_NUMBER_CONSTANT},
                            {type: T_NUMBER_GLOBAL},
                            {type: T_NUMBER_LOCAL}
                        ]
                    }
                ]
            },
            mod: {
                code: 10,
                args: [
                    {
                        type: T_NUMBER_GLOBAL,
                        args: [
                            {type: T_NUMBER_CONSTANT},
                            {type: T_NUMBER_GLOBAL},
                            {type: T_NUMBER_LOCAL}
                        ]
                    },
                    {
                        type: T_NUMBER_LOCAL,
                        args: [
                            {type: T_NUMBER_CONSTANT},
                            {type: T_NUMBER_GLOBAL},
                            {type: T_NUMBER_LOCAL}
                        ]
                    }
                ]
            },
            and: {
                code: 11,
                args: [
                    {
                        type: T_NUMBER_GLOBAL,
                        args: [
                            {type: T_NUMBER_CONSTANT},
                            {type: T_NUMBER_GLOBAL},
                            {type: T_NUMBER_LOCAL}
                        ]
                    },
                    {
                        type: T_NUMBER_LOCAL,
                        args: [
                            {type: T_NUMBER_CONSTANT},
                            {type: T_NUMBER_GLOBAL},
                            {type: T_NUMBER_LOCAL}
                        ]
                    }
                ]
            },
            or: {
                code: 12,
                args: [
                    {
                        type: T_NUMBER_GLOBAL,
                        args: [
                            {type: T_NUMBER_CONSTANT},
                            {type: T_NUMBER_GLOBAL},
                            {type: T_NUMBER_LOCAL}
                        ]
                    },
                    {
                        type: T_NUMBER_LOCAL,
                        args: [
                            {type: T_NUMBER_CONSTANT},
                            {type: T_NUMBER_GLOBAL},
                            {type: T_NUMBER_LOCAL}
                        ]
                    }
                ]
            },

            // Compare, loop...
            cmp: {
                code: 13,
                args: [
                    {
                        type: T_NUMBER_GLOBAL,
                        args: [
                            {type: T_NUMBER_CONSTANT},
                            {type: T_NUMBER_GLOBAL},
                            {type: T_NUMBER_LOCAL}
                        ]
                    },
                    {
                        type: T_NUMBER_LOCAL,
                        args: [
                            {type: T_NUMBER_CONSTANT},
                            {type: T_NUMBER_GLOBAL},
                            {type: T_NUMBER_LOCAL}
                        ]
                    }
                ]
            },
            module: {
                code: 14,
                args: [
                    {
                        type: T_NUMBER_CONSTANT,
                        args: [
                            {type: T_NUMBER_CONSTANT},
                            {type: T_NUMBER_GLOBAL},
                            {type: T_NUMBER_LOCAL}
                        ]
                    },
                    {
                        type: T_NUMBER_GLOBAL,
                        args: [
                            {type: T_NUMBER_CONSTANT},
                            {type: T_NUMBER_GLOBAL},
                            {type: T_NUMBER_LOCAL}
                        ]
                    },
                    {
                        type: T_NUMBER_LOCAL,
                        args: [
                            {type: T_NUMBER_CONSTANT},
                            {type: T_NUMBER_GLOBAL},
                            {type: T_NUMBER_LOCAL}
                        ]
                    }
                ]
            },

            // The following commands are compiled into smaller commands with less parameters...
            inc: {
                code: 1024,
                args: [
                    {type: T_NUMBER_GLOBAL},
                    {type: T_NUMBER_LOCAL}
                ]
            },
            dec: {
                code: 1025,
                args: [
                    {type: T_NUMBER_GLOBAL},
                    {type: T_NUMBER_LOCAL}
                ]
            },
            // Contitional jumps...
            je: {
                code: 1031,
                args: [
                    {type: T_LABEL}
                ]
            },
            jne: {
                cde: 1032,
                args: [
                    {type: T_LABEL}
                ]
            },
            jl: {
                code: 1033,
                args: [
                    {type: T_LABEL}
                ]
            },
            jle: {
                code: 1034,
                args: [
                    {type: T_LABEL}
                ]
            },
            jg: {
                code: 1035,
                args: [
                    {type: T_LABEL}
                ]
            },
            jge: {
                code: 1036,
                args: [
                    {type: T_LABEL}
                ]
            },
            // Address...
            addr: {
                code: 1037,
                args: [
                    {type: T_NUMBER_GLOBAL},
                    {type: T_NUMBER_LOCAL},
                    {type: T_NUMBER_GLOBAL_ARRAY},
                    {type: T_NUMBER_LOCAL_ARRAY},
                    {type: T_STRUCT_GLOBAL},
                    {type: T_STRUCT_GLOBAL_ARRAY},
                    {type: T_STRUCT_LOCAL},
                    {type: T_STRUCT_LOCAL_ARRAY}
                ]
            },
            // Array functions
            arrayr: { // Array read...
                code: 1038,
                args: [
                    {
                        type: T_NUMBER_GLOBAL,
                        args: [
                            {
                                type: T_NUMBER_LOCAL_ARRAY,
                                args: [
                                    {type: T_NUMBER_CONSTANT},
                                    {type: T_NUMBER_GLOBAL},
                                    {type: T_NUMBER_LOCAL}
                                ]
                            },
                            {
                                type: T_NUMBER_GLOBAL_ARRAY,
                                args: [
                                    {type: T_NUMBER_CONSTANT},
                                    {type: T_NUMBER_GLOBAL},
                                    {type: T_NUMBER_LOCAL}
                                ]
                            }
                        ]
                    },
                    {
                        type: T_NUMBER_LOCAL,
                        args: [
                            {
                                type: T_NUMBER_LOCAL_ARRAY,
                                args: [
                                    {type: T_NUMBER_CONSTANT},
                                    {type: T_NUMBER_GLOBAL},
                                    {type: T_NUMBER_LOCAL}
                                ]
                            },
                            {
                                type: T_NUMBER_GLOBAL_ARRAY,
                                args: [
                                    {type: T_NUMBER_CONSTANT},
                                    {type: T_NUMBER_GLOBAL},
                                    {type: T_NUMBER_LOCAL}
                                ]
                            }
                        ]
                    },
                    {
                        type: T_STRUCT_GLOBAL,
                        args: [
                            {
                                type: T_STRUCT_LOCAL_ARRAY,
                                args: [
                                    {type: T_NUMBER_CONSTANT},
                                    {type: T_NUMBER_GLOBAL},
                                    {type: T_NUMBER_LOCAL}
                                ]
                            },
                            {
                                type: T_STRUCT_GLOBAL_ARRAY,
                                args: [
                                    {type: T_NUMBER_CONSTANT},
                                    {type: T_NUMBER_GLOBAL},
                                    {type: T_NUMBER_LOCAL}
                                ]
                            }
                        ]
                    },
                    {
                        type: T_STRUCT_LOCAL,
                        args: [
                            {
                                type: T_STRUCT_LOCAL_ARRAY,
                                args: [
                                    {type: T_NUMBER_CONSTANT},
                                    {type: T_NUMBER_GLOBAL},
                                    {type: T_NUMBER_LOCAL}
                                ]
                            },
                            {
                                type: T_STRUCT_GLOBAL_ARRAY,
                                args: [
                                    {type: T_NUMBER_CONSTANT},
                                    {type: T_NUMBER_GLOBAL},
                                    {type: T_NUMBER_LOCAL}
                                ]
                            }
                        ]
                    },
                    {
                        type: T_PROC_GLOBAL,
                        args: [
                            {
                                type: T_PROC_LOCAL_ARRAY,
                                args: [
                                    {type: T_NUMBER_CONSTANT},
                                    {type: T_NUMBER_GLOBAL},
                                    {type: T_NUMBER_LOCAL}
                                ]
                            },
                            {
                                type: T_PROC_GLOBAL_ARRAY,
                                args: [
                                    {type: T_NUMBER_CONSTANT},
                                    {type: T_NUMBER_GLOBAL},
                                    {type: T_NUMBER_LOCAL}
                                ]
                            }
                        ]
                    },
                    {
                        type: T_PROC_LOCAL,
                        args: [
                            {
                                type: T_PROC_LOCAL_ARRAY,
                                args: [
                                    {type: T_NUMBER_CONSTANT},
                                    {type: T_NUMBER_GLOBAL},
                                    {type: T_NUMBER_LOCAL}
                                ]
                            },
                            {
                                type: T_PROC_GLOBAL_ARRAY,
                                args: [
                                    {type: T_NUMBER_CONSTANT},
                                    {type: T_NUMBER_GLOBAL},
                                    {type: T_NUMBER_LOCAL}
                                ]
                            }
                        ]
                    }
                ]
            },
            arrayw: { // Array write...
                code: 1039,
                args: [
                    {
                        type: T_NUMBER_LOCAL_ARRAY,
                        args: [
                            {
                                type: T_NUMBER_CONSTANT,
                                args: [
                                    {type: T_NUMBER_CONSTANT},
                                    {type: T_NUMBER_GLOBAL},
                                    {type: T_NUMBER_LOCAL},
                                    {type: T_PROC},
                                    {type: T_PROC_GLOBAL},
                                    {type: T_PROC_LOCAL}
                                ]
                            },
                            {
                                type: T_NUMBER_GLOBAL,
                                args: [
                                    {type: T_NUMBER_CONSTANT},
                                    {type: T_NUMBER_GLOBAL},
                                    {type: T_NUMBER_LOCAL},
                                    {type: T_PROC},
                                    {type: T_PROC_GLOBAL},
                                    {type: T_PROC_LOCAL}
                                ]
                            },
                            {
                                type: T_NUMBER_LOCAL,
                                args: [
                                    {type: T_NUMBER_CONSTANT},
                                    {type: T_NUMBER_GLOBAL},
                                    {type: T_NUMBER_LOCAL},
                                    {type: T_PROC},
                                    {type: T_PROC_GLOBAL},
                                    {type: T_PROC_LOCAL}
                                ]
                            }
                        ]
                    },
                    {
                        type: T_NUMBER_GLOBAL_ARRAY,
                        args: [
                            {
                                type: T_NUMBER_CONSTANT,
                                args: [
                                    {type: T_NUMBER_CONSTANT},
                                    {type: T_NUMBER_GLOBAL},
                                    {type: T_NUMBER_LOCAL},
                                    {type: T_PROC},
                                    {type: T_PROC_GLOBAL},
                                    {type: T_PROC_LOCAL}
                                ]
                            },
                            {
                                type: T_NUMBER_GLOBAL,
                                args: [
                                    {type: T_NUMBER_CONSTANT},
                                    {type: T_NUMBER_GLOBAL},
                                    {type: T_NUMBER_LOCAL},
                                    {type: T_PROC},
                                    {type: T_PROC_GLOBAL},
                                    {type: T_PROC_LOCAL}
                                ]
                            },
                            {
                                type: T_NUMBER_LOCAL,
                                args: [
                                    {type: T_NUMBER_CONSTANT},
                                    {type: T_NUMBER_GLOBAL},
                                    {type: T_NUMBER_LOCAL},
                                    {type: T_PROC},
                                    {type: T_PROC_GLOBAL},
                                    {type: T_PROC_LOCAL}
                                ]
                            }
                        ]
                    },
                    {
                        type: T_STRUCT_GLOBAL_ARRAY,
                        args: [
                            {
                                type: T_NUMBER_CONSTANT,
                                args: [
                                    {type: T_STRUCT_GLOBAL},
                                    {type: T_STRUCT_LOCAL}
                                ]
                            },
                            {
                                type: T_NUMBER_GLOBAL,
                                args: [
                                    {type: T_STRUCT_GLOBAL},
                                    {type: T_STRUCT_LOCAL}
                                ]
                            },
                            {
                                type: T_NUMBER_LOCAL,
                                args: [
                                    {type: T_STRUCT_GLOBAL},
                                    {type: T_STRUCT_LOCAL}
                                ]
                            }
                        ]
                    },
                    {
                        type: T_STRUCT_LOCAL_ARRAY,
                        args: [
                            {
                                type: T_NUMBER_CONSTANT,
                                args: [
                                    {type: T_STRUCT_GLOBAL},
                                    {type: T_STRUCT_LOCAL}
                                ]
                            },
                            {
                                type: T_NUMBER_GLOBAL,
                                args: [
                                    {type: T_STRUCT_GLOBAL},
                                    {type: T_STRUCT_LOCAL}
                                ]
                            },
                            {
                                type: T_NUMBER_LOCAL,
                                args: [
                                    {type: T_STRUCT_GLOBAL},
                                    {type: T_STRUCT_LOCAL}
                                ]
                            }
                        ]
                    },
                    {
                        type: T_PROC_GLOBAL_ARRAY,
                        args: [
                            {
                                type: T_NUMBER_CONSTANT,
                                args: [
                                    {type: T_PROC_GLOBAL},
                                    {type: T_PROC_LOCAL},
                                    {type: T_PROC}
                                ]
                            },
                            {
                                type: T_NUMBER_GLOBAL,
                                args: [
                                    {type: T_PROC_GLOBAL},
                                    {type: T_PROC_LOCAL},
                                    {type: T_PROC}
                                ]
                            },
                            {
                                type: T_NUMBER_LOCAL,
                                args: [
                                    {type: T_PROC_GLOBAL},
                                    {type: T_PROC_LOCAL},
                                    {type: T_PROC}
                                ]
                            }
                        ]
                    },
                    {
                        type: T_PROC_LOCAL_ARRAY,
                        args: [
                            {
                                type: T_NUMBER_CONSTANT,
                                args: [
                                    {type: T_PROC_GLOBAL},
                                    {type: T_PROC_LOCAL},
                                    {type: T_PROC}
                                ]
                            },
                            {
                                type: T_NUMBER_GLOBAL,
                                args: [
                                    {type: T_PROC_GLOBAL},
                                    {type: T_PROC_LOCAL},
                                    {type: T_PROC}
                                ]
                            },
                            {
                                type: T_NUMBER_LOCAL,
                                args: [
                                    {type: T_PROC_GLOBAL},
                                    {type: T_PROC_LOCAL},
                                    {type: T_PROC}
                                ]
                            }
                        ]
                    }
                ]
            },
            // Loops...
            loopdn: {
                code: 1040,
                args: [
                    {
                        type: T_NUMBER_GLOBAL,
                        args: [
                            {type: T_LABEL}
                        ]
                    },
                    {
                        type: T_NUMBER_LOCAL,
                        args: [
                            {type: T_LABEL}
                        ]
                    }
                ]
            },
            loopup: {
                code: 1041,
                args: [
                    {
                        type: T_NUMBER_GLOBAL,
                        args: [
                            {
                                type: T_NUMBER_CONSTANT,
                                args: [{type: T_LABEL}]
                            },
                            {
                                type: T_NUMBER_GLOBAL,
                                args: [{type: T_LABEL}]
                            },
                            {
                                type: T_NUMBER_LOCAL,
                                args: [{type: T_LABEL}]
                            }
                        ]
                    },
                    {
                        type: T_NUMBER_LOCAL,
                        args: [
                            {
                                type: T_NUMBER_CONSTANT,
                                args: [{type: T_LABEL}]
                            },
                            {
                                type: T_NUMBER_GLOBAL,
                                args: [{type: T_LABEL}]
                            },
                            {
                                type: T_NUMBER_LOCAL,
                                args: [{type: T_LABEL}]
                            }
                        ]
                    }
                ]
            },
            'return': {
                code: 1042,
                args: [
                    {type: T_NUMBER_CONSTANT},
                    {type: T_NUMBER_GLOBAL},
                    {type: T_NUMBER_LOCAL},
                    {type: T_PROC},
                    {type: T_PROC_GLOBAL},
                    {type: T_PROC_LOCAL}
                ]
            }
        }
    );

    wheel('compiler.command.T_NUMBER_CONSTANT',     T_NUMBER_CONSTANT);
    wheel('compiler.command.T_NUMBER_GLOBAL',       T_NUMBER_GLOBAL);
    wheel('compiler.command.T_NUMBER_LOCAL',        T_NUMBER_LOCAL);
    wheel('compiler.command.T_PROC',                T_PROC);
    wheel('compiler.command.T_LABEL',               T_LABEL);

    wheel('compiler.command.T_NUMBER_GLOBAL_ARRAY', T_NUMBER_GLOBAL_ARRAY);
    wheel('compiler.command.T_NUMBER_LOCAL_ARRAY',  T_NUMBER_LOCAL_ARRAY);

    wheel('compiler.command.T_STRUCT_GLOBAL',       T_STRUCT_GLOBAL);
    wheel('compiler.command.T_STRUCT_GLOBAL_ARRAY', T_STRUCT_GLOBAL_ARRAY);
    wheel('compiler.command.T_STRUCT_LOCAL',        T_STRUCT_LOCAL);
    wheel('compiler.command.T_STRUCT_LOCAL_ARRAY',  T_STRUCT_LOCAL_ARRAY);

    wheel('compiler.command.T_PROC_GLOBAL',         T_PROC_GLOBAL);
    wheel('compiler.command.T_PROC_GLOBAL_ARRAY',   T_PROC_GLOBAL_ARRAY);
    wheel('compiler.command.T_PROC_LOCAL',          T_PROC_LOCAL);
    wheel('compiler.command.T_PROC_LOCAL_ARRAY',    T_PROC_LOCAL_ARRAY);

    wheel('compiler.command.T_META_STRING',         T_META_STRING);
    wheel('compiler.command.T_META_POINTER',        T_META_POINTER);
    wheel('compiler.command.T_META_ADDRESS',        T_META_ADDRESS);

    wheel('compiler.command.NO_PARAM_COMMANDS',     NO_PARAM_COMMANDS);
    wheel('compiler.command.SINGLE_PARAM_COMMANDS', SINGLE_PARAM_COMMANDS);

    wheel('compiler.command.FLAG_EQUAL',            FLAG_EQUAL);
    wheel('compiler.command.FLAG_NOT_EQUAL',        FLAG_NOT_EQUAL);
    wheel('compiler.command.FLAG_LESS',             FLAG_LESS);
    wheel('compiler.command.FLAG_LESS_EQUAL',       FLAG_LESS_EQUAL);
    wheel('compiler.command.FLAG_GREATER',          FLAG_GREATER);
    wheel('compiler.command.FLAG_GREATER_EQUAL',    FLAG_GREATER_EQUAL);

    wheel('compiler.command.REG_OFFSET_STACK',      REG_OFFSET_STACK);
    wheel('compiler.command.REG_OFFSET_SRC',        REG_OFFSET_SRC);
    wheel('compiler.command.REG_OFFSET_DEST',       REG_OFFSET_DEST);
    wheel('compiler.command.REG_RETURN',            REG_RETURN);
    wheel('compiler.command.REG_FLAGS',             REG_FLAGS);

    wheel('compiler.command.REGISTER_COUNT',        REGISTER_COUNT);

    wheel(
        'compiler.command.typeToLocation',
        function(type) {
            var result = '';
            switch (type) {
                case T_NUMBER_CONSTANT:     result = 'const';    break;
                case T_NUMBER_GLOBAL:       result = 'global';   break;
                case T_NUMBER_GLOBAL_ARRAY: result = 'global';   break;
                case T_NUMBER_LOCAL:        result = 'local';    break;
                case T_NUMBER_LOCAL_ARRAY:  result = 'local';    break;

                case T_STRUCT_GLOBAL:       result = 'global';   break;
                case T_STRUCT_GLOBAL_ARRAY: result = 'global';   break;
                case T_STRUCT_LOCAL:        result = 'local';    break;
                case T_STRUCT_LOCAL_ARRAY:  result = 'local';    break;

                case T_PROC_GLOBAL:         result = 'global';   break;
                case T_PROC_GLOBAL_ARRAY:   result = 'global';   break;
                case T_PROC_LOCAL:          result = 'local';    break;
                case T_PROC_LOCAL_ARRAY:    result = 'local';    break;
            }
            return result;
        }
    );
})();