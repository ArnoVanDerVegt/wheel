// 1. a partial wheel grammar in simple JSON format
var wheelGrammar = {
        // prefix ID for regular expressions used in the grammar
        'RegExpID': 'RE::',
        'Extra': {
            'fold': 'indent'
        },

        // Style model
        'Style': {
            'comment':                 'comment',
            'keyword':                 'keyword',
            'expression_keyword':     'expression-keyword',
            'api_keyword':             'api-keyword',
            'variable':             'variable',
            'struct_variable':         'struct-variable',
            'register':             'register',
            'constant':             'constant',
            'meta':                 'meta',
            'identifier':             'identifier',
            'number':                 'number',
            'boolean':                 'boolean',
            'string':                 'string',
            'label':                 'label',
            'label_param':             'label',
            'sign':                 'sign'
        },

        // Lexical model
        'Lex': {
            'comment:comment': {
                interleave: true,
                tokens: [[";", null]]
            },
            'string:escaped-block': [ "\"" ],
            'register': {
                autocomplete: true,
                tokens: [
                    'REG_OFFSET_STACK',
                    'REG_OFFSET_SRC',
                    'REG_OFFSET_DEST'
                ]
            },
            'constant': {
                autocomplete: true,
                tokens: [
                    'MODULE_STANDARD',
                    'MODULE_SCREEN',
                    'MODULE_BUTTONS',
                    'MODULE_MATH',
                    'MODULE_SENSOR',
                    'SCREEN_CLEAR',
                    'SCREEN_DRAW_PIXEL',
                    'SCREEN_DRAW_NUMBER',
                    'SCREEN_DRAW_TEXT',
                    'SCREEN_DRAW_LINE',
                    'SCREEN_DRAW_RECT',
                    'SCREEN_DRAW_CIRCLE',
                    'SCREEN_DRAW_IMAGE',
                    'STANDARD_LOG_NUMBER',
                    'STANDARD_LOG_STRING',
                    'MATH_ROUND',
                    'MATH_CEIL',
                    'MATH_FLOOR',
                    'MATH_ABS',
                    'MATH_NEG',
                    'MODULE_MOTORS',
                    'MOTOR_RESET',
                    'MOTOR_MOVE_TO',
                    'MOTOR_MOVE',
                    'MOTOR_STOP'
                ]
            },
            'meta': {
                autocomplete: true,
                tokens: [
                    '#define',
                    '#include',
                    '#resource',
                    '#project'
                ]
            },
            'sign': {
                tokens: ['(', ')', ',']
            },
            'label': 'RE::/[A-Z]([A-Z0-9]*[a-z][a-z0-9]*[A-Z]|[a-z0-9]*[A-Z][A-Z0-9]*[a-z])[A-Za-z0-9]*:/i',
            'label_param': {
                'autocomplete': true,
                'tokens': [
                    '_____________________________'
                ]
            },
            //'identifier': 'RE::/[^A-Za-z0-9_.]*/i',
            // "RE::/\\S+/",
            'identifier': 'RE::/[A-Z]([A-Z0-9]*[a-z][a-z0-9]*[A-Z]|[a-z0-9]*[A-Z][A-Z0-9]*[a-z])[A-Za-z0-9]*/i',
            'number': [
                // floats
                "RE::/\\d*\\.\\d+(e[\\+\\-]?\\d+)?/",
                "RE::/\\d+\\.\\d*/",
                "RE::/\\.\\d+/",
                // integers
                // hex
                "RE::/0x[0-9a-fA-F]+L?/",
                // binary
                "RE::/0b[01]+L?/",
                // octal
                "RE::/0o[0-7]+L?/",
                // decimal
                "RE::/[1-9]\\d*(e[\\+\\-]?\\d+)?L?/",
                // just zero
                "RE::/0(?![\\dx])/"
            ],
            'boolean': {
                'autocomplete': true,
                'tokens': ['TRUE', 'FALSE']
            },
            'keyword': {
                'autocomplete': true,
                'tokens': [
                    'proc',
                    'endp',
                    'struct',
                    'ends'
                ]
            },
            'expression_keyword': {
                'autocomplete': true,
                'tokens': [
                    'set',
                    'add',
                    'sub',
                    'mul',
                    'div',
                    'mod',
                    'and',
                    'or',
                    'cmp',
                    'addr',
                    'jmp',
                    'je',
                    'jne',
                    'jl',
                    'jle',
                    'inc',
                    'dec',
                    'loopdn',
                    'loopup',
                    'arrayw',
                    'arrayr',
                    'module'
                ]
            },
            'api_keyword': {
                'autocomplete': true,
                'tokens': [
                    'printN',
                    'printS',
                    'drawLine',
                    'drawRect',
                    'drawPixel',
                    'drawCircle',
                    'drawNumber',
                    'drawText',
                    'round',
                    'floor',
                    'ceil',
                    'abs',
                    'neg'
                ]
            },
            'variable': {
                'autocomplete': true,
                'tokens': [
                    'number',
                    'string'
                ]
            },
            'struct_variable': {
                'autocomplete': true,
                'tokens': [
                    '______________________________'
                ]
            }
        },

        // Syntax model (optional)
        'Syntax': {
            'token': 'label | label_param | boolean | number | variable | struct_variable | string | keyword | expression_keyword | api_keyword | register | constant | meta | identifier | sign'
        },

        // what to parse and in what order
        'Parser': ['comment', ['token']]
    };