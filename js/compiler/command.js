(function() {
    var wheel = require('../utils/base.js').wheel;

    var T_NUM_C                 =  0;
    var T_NUM_G                 =  1;
    var T_NUM_L                 =  2;

    var T_LABEL                 =  4;
    var T_PROC                  =  5;

    var T_NUM_G_ARRAY           =  6;
    var T_NUM_L_ARRAY           =  7;

    var T_STRUCT_G              =  8;
    var T_STRUCT_G_ARRAY        =  9;
    var T_STRUCT_L              = 10;
    var T_STRUCT_L_ARRAY        = 11;

    var T_PROC_G                = 12;
    var T_PROC_G_ARRAY          = 13;
    var T_PROC_L                = 14;
    var T_PROC_L_ARRAY          = 15;

    var T_META_STRING           =  1;
    var T_META_POINTER          =  2;
    var T_META_ADDRESS          =  3;

    var SINGLE_PARAM_COMMANDS   =  0;

    var FLAG_EQUAL              =  1;
    var FLAG_NOT_EQUAL          =  2;
    var FLAG_LESS               =  4;
    var FLAG_LESS_EQUAL         =  8;
    var FLAG_GREATER            = 16;
    var FLAG_GREATER_EQUAL      = 32;

    var REG_STACK               =  0;
    var REG_SRC                 =  1;
    var REG_DEST                =  2;
    var REG_CODE                =  3;
    var REG_RETURN              =  4;
    var REG_FLAGS               =  5;
    var REGS                    = [
            'REG_STACK',
            'REG_SRC',
            'REG_DEST',
            'REG_CODE',
            'REG_RETURN',
            'REG_FLAGS'
        ];

    var REGISTER_COUNT          =  6;

    var ARGS_C                  = [{type: T_NUM_C}];
    var ARGS_GL                 = [{type: T_NUM_G}, {type: T_NUM_L}];
    var ARGS_CGL                = [{type: T_NUM_C}, {type: T_NUM_G}, {type: T_NUM_L}];
    var ARGS_PPGPL              = [{type: T_PROC}, {type: T_PROC_G}, {type: T_PROC_L}];
    var ARGS_CGLP               = [{type: T_NUM_C}, {type: T_NUM_G}, {type: T_NUM_L}, {type: T_PROC}];
    var ARGS_CGLP               = [{type: T_NUM_C}, {type: T_NUM_G}, {type: T_NUM_L}, {type: T_PROC}];
    var ARGS_SGSL               = [{type: T_STRUCT_G}, {type: T_STRUCT_L}];
    var ARGS_LABEL              = [{type: T_LABEL}];
    var ARGS_ALL                = [
            {type: T_NUM_C},
            {type: T_NUM_G},
            {type: T_NUM_L},
            {type: T_PROC},
            {type: T_PROC_G},
            {type: T_PROC_L},
            {type: T_STRUCT_G},
            {type: T_STRUCT_L},
            {type: T_STRUCT_L, metaType: T_META_ADDRESS}
        ];
    var ARGS_CGL_ALL            = [
            {type: T_NUM_C, args: ARGS_ALL},
            {type: T_NUM_G, args: ARGS_ALL},
            {type: T_NUM_L, args: ARGS_ALL}
        ];
    var ARGS_CGL_SGSL           = [
            {type: T_NUM_C, args: ARGS_SGSL},
            {type: T_NUM_G, args: ARGS_SGSL},
            {type: T_NUM_L, args: ARGS_SGSL}
        ];
    var ARGS_CGL_PPGPL          = [
            {type: T_NUM_C, args: ARGS_PPGPL},
            {type: T_NUM_G, args: ARGS_PPGPL},
            {type: T_NUM_L, args: ARGS_PPGPL}
        ];
    var ARGS_GL_CGL             = [
            {type: T_NUM_G, args: ARGS_CGL},
            {type: T_NUM_L, args: ARGS_CGL}
        ];
    var ARGS_SGSL_MPMA          = [
            {type: T_STRUCT_G, metaType: T_META_POINTER},
            {type: T_STRUCT_G, metaType: T_META_ADDRESS},
            {type: T_STRUCT_L, metaType: T_META_POINTER},
            {type: T_STRUCT_L, metaType: T_META_ADDRESS}
        ];
    var ARGS_SGSL_ARRAY_MPMA    = [
            {type: T_STRUCT_G_ARRAY, metaType: T_META_POINTER},
            {type: T_STRUCT_G_ARRAY, metaType: T_META_ADDRESS},
            {type: T_STRUCT_L_ARRAY, metaType: T_META_POINTER},
            {type: T_STRUCT_L_ARRAY, metaType: T_META_ADDRESS},
        ];
    var ARGS_GL_ARRAY_CGL       = [
            {type: T_NUM_L_ARRAY, args: ARGS_CGL},
            {type: T_NUM_G_ARRAY, args: ARGS_CGL}
        ];
    var ARGS_GLPGPL_ARRAY_CGL   = [
            {type: T_NUM_L_ARRAY, args: ARGS_CGL},
            {type: T_NUM_G_ARRAY, args: ARGS_CGL},
            {type: T_PROC_L_ARRAY, args: ARGS_CGL},
            {type: T_PROC_G_ARRAY, args: ARGS_CGL}
        ];

    wheel(
        'compiler.command',
        {
            copy: {code: 0, args: ARGS_C},
            jmpc: {
                code: 1,
                args: [
                    {type: T_LABEL, args: ARGS_C}
                ]
            },
            cmp: {code: 2, args: ARGS_GL_CGL},
            module: {
                code: 3,
                args: [
                    {type: T_NUM_C, args: ARGS_CGL},
                    {type: T_NUM_G, args: ARGS_CGL},
                    {type: T_NUM_L, args: ARGS_CGL}
                ]
            },

            /* Operators */
            set: {
                code: 4,
                args: [
                    {type: T_NUM_G,          args: ARGS_ALL},  // ARGS_CGLP},
                    {type: T_NUM_L,          args: ARGS_ALL},  // ARGS_CGLP},
                    {type: T_PROC_G,         args: ARGS_PPGPL},
                    {type: T_PROC_L,         args: ARGS_PPGPL},
                    {type: T_STRUCT_L,       args: ARGS_ALL},  //
                    {type: T_STRUCT_L,       args: ARGS_SGSL_MPMA,       metaType: T_META_POINTER},
                    {type: T_STRUCT_G,       args: ARGS_ALL},  //
                    {type: T_STRUCT_G,       args: ARGS_SGSL_MPMA,       metaType: T_META_POINTER},
                    {type: T_STRUCT_G_ARRAY, args: ARGS_SGSL_ARRAY_MPMA, metaType: T_META_POINTER},
                    {type: T_STRUCT_L_ARRAY, args: ARGS_SGSL_ARRAY_MPMA, metaType: T_META_POINTER}
                ]
            },
            add: {code: 5, args: ARGS_GL_CGL},
            sub: {code: 6, args: ARGS_GL_CGL},
            mul: {code: 7, args: ARGS_GL_CGL},
            div: {code: 8, args: ARGS_GL_CGL},
            mod: {code: 9, args: ARGS_GL_CGL},

            // The following commands are compiled into smaller commands with less parameters...
            inc: {code: 1024, args: ARGS_GL},
            dec: {code: 1025, args: ARGS_GL},
            // Jump...
            jmp: {code: 1026, args: ARGS_LABEL},
            // Contitional jumps...
            je:  {code: 1031, args: ARGS_LABEL},
            jne: {code: 1032, args: ARGS_LABEL},
            jl:  {code: 1033, args: ARGS_LABEL},
            jle: {code: 1034, args: ARGS_LABEL},
            jg:  {code: 1035, args: ARGS_LABEL},
            jge: {code: 1036, args: ARGS_LABEL},
            // Address...
            addr: {
                code: 1037,
                args: [
                    {type: T_NUM_G},
                    {type: T_NUM_L},
                    {type: T_NUM_G_ARRAY},
                    {type: T_NUM_L_ARRAY},
                    {type: T_STRUCT_G},
                    {type: T_STRUCT_G_ARRAY},
                    {type: T_STRUCT_L},
                    {type: T_STRUCT_L_ARRAY}
                ]
            },
            // Return...
            'return': {
                code: 1042,
                args: [
                    {type: T_NUM_C},
                    {type: T_NUM_G},
                    {type: T_NUM_L},
                    {type: T_PROC},
                    {type: T_PROC_G},
                    {type: T_PROC_L}
                ]
            }
        }
    );

    wheel('compiler.command.T_NUM_C',               T_NUM_C);
    wheel('compiler.command.T_NUM_G',               T_NUM_G);
    wheel('compiler.command.T_NUM_L',               T_NUM_L);
    wheel('compiler.command.T_PROC',                T_PROC);
    wheel('compiler.command.T_LABEL',               T_LABEL);

    wheel('compiler.command.T_NUM_G_ARRAY',         T_NUM_G_ARRAY);
    wheel('compiler.command.T_NUM_L_ARRAY',         T_NUM_L_ARRAY);

    wheel('compiler.command.T_STRUCT_G',            T_STRUCT_G);
    wheel('compiler.command.T_STRUCT_G_ARRAY',      T_STRUCT_G_ARRAY);
    wheel('compiler.command.T_STRUCT_L',            T_STRUCT_L);
    wheel('compiler.command.T_STRUCT_L_ARRAY',      T_STRUCT_L_ARRAY);

    wheel('compiler.command.T_PROC_G',              T_PROC_G);
    wheel('compiler.command.T_PROC_G_ARRAY',        T_PROC_G_ARRAY);
    wheel('compiler.command.T_PROC_L',              T_PROC_L);
    wheel('compiler.command.T_PROC_L_ARRAY',        T_PROC_L_ARRAY);

    wheel('compiler.command.T_META_STRING',         T_META_STRING);
    wheel('compiler.command.T_META_POINTER',        T_META_POINTER);
    wheel('compiler.command.T_META_ADDRESS',        T_META_ADDRESS);

    wheel('compiler.command.SINGLE_PARAM_COMMANDS', SINGLE_PARAM_COMMANDS);

    wheel('compiler.command.FLAG_EQUAL',            FLAG_EQUAL);
    wheel('compiler.command.FLAG_NOT_EQUAL',        FLAG_NOT_EQUAL);
    wheel('compiler.command.FLAG_LESS',             FLAG_LESS);
    wheel('compiler.command.FLAG_LESS_EQUAL',       FLAG_LESS_EQUAL);
    wheel('compiler.command.FLAG_GREATER',          FLAG_GREATER);
    wheel('compiler.command.FLAG_GREATER_EQUAL',    FLAG_GREATER_EQUAL);

    wheel('compiler.command.REG_STACK',             REG_STACK);
    wheel('compiler.command.REG_SRC',               REG_SRC);
    wheel('compiler.command.REG_DEST',              REG_DEST);
    wheel('compiler.command.REG_CODE',              REG_CODE);
    wheel('compiler.command.REG_RETURN',            REG_RETURN);
    wheel('compiler.command.REG_FLAGS',             REG_FLAGS);

    wheel('compiler.command.REGS',                  REGS);

    wheel('compiler.command.STACK',                 function()       { return {type: T_NUM_G, value: REG_STACK  }; });
    wheel('compiler.command.SRC',                   function()       { return {type: T_NUM_G, value: REG_SRC    }; });
    wheel('compiler.command.DEST',                  function()       { return {type: T_NUM_G, value: REG_DEST   }; });
    wheel('compiler.command.CODE',                  function()       { return {type: T_NUM_G, value: REG_CODE   }; });
    wheel('compiler.command.RETURN',                function()       { return {type: T_NUM_G, value: REG_RETURN }; });
    wheel('compiler.command.CONST',                 function(v)      { return {type: T_NUM_C, value: v }; });
    wheel('compiler.command.LOCAL',                 function(offset) { return {type: T_NUM_L, value: offset }; });
    wheel('compiler.command.GLOBAL',                function(offset) { return {type: T_NUM_G, value: offset }; });

    wheel('compiler.command.REGISTER_COUNT',        REGISTER_COUNT);

    wheel(
        'compiler.command.isLocal',
        function(value) {
            return (value.vr.type === T_NUM_L) || (value.vr.type === T_NUM_L_ARRAY) ||
                (value.vr.type === T_STRUCT_L) || (value.vr.type === T_STRUCT_L_ARRAY) ||
                (value.vr.type === T_PROC_L) || (value.vr.type === T_PROC_L_ARRAY);
        }
    );

    wheel(
        'compiler.command.isConst',
        function(value) {
            return (value.type === T_NUM_C);
        }
    );

    wheel(
        'compiler.command.isStructVarType',
        function(value) {
            return (value.vr.type === T_STRUCT_L) || (value.vr.type === T_STRUCT_G) ||
                (value.vr.type === T_STRUCT_L_ARRAY) || (value.vr.type === T_STRUCT_G_ARRAY);
        }
    );

    wheel(
        'compiler.command.isSimpleNumberType',
        function(value) {
            return (value.type === T_NUM_L) || (value.type === T_NUM_G);
        }
    );

    wheel(
        'compiler.command.isNumberType',
        function(value) {
            if (value.vr) {
                return (value.type === T_NUM_L) || (value.type === T_NUM_G) ||
                    (value.type === T_NUM_G_ARRAY) || (value.type === T_NUM_L_ARRAY);
            }
            return false;
        }
    );

    wheel(
        'compiler.command.isProcType',
        function(value) {
            return (value.type === T_PROC) ||
                (value.type === T_PROC_G) || (value.type === T_PROC_L) ||
                (value.type === T_PROC_G_ARRAY) || (value.type === T_PROC_L_ARRAY);
        }
    );

    wheel(
        'compiler.command.isPointerMetaType',
        function(value) {
            return value && (value.metaType === T_META_POINTER);
        }
    );

    wheel(
        'compiler.command.isPointerVarMetaType',
        function(value) {
            return value.vr && (value.vr.metaType === T_META_POINTER);
        }
    );

    wheel(
        'compiler.command.isAddressMetaType',
        function(value) {
            return (value.metaType === T_META_ADDRESS);
        }
    );

    wheel(
        'compiler.command.isStringMetaType',
        function(value) {
            return (value.metaType === T_META_STRING);
        }
    );

    wheel(
        'compiler.command.isStringVarMetaType',
        function(value) {
            return value.vr && (value.vr.metaType === T_META_STRING);
        }
    );

    wheel(
        'compiler.command.isStringConstType',
        function(vr) {
            return (typeof vr.param === 'string') &&
                (vr.param.length > 2) &&
                (vr.param[0] === '"') &&
                (vr.param[vr.param.length - 1] === '"');
        }
    );
})();