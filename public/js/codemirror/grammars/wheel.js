// 1. a partial wheel grammar in simple JSON format
var wheelGrammar = {
		// prefix ID for regular expressions used in the grammar
		'RegExpID': 'RE::',
		'Extra': {
			'fold': 'indent'
		},

		// Style model
		'Style': {
			'comment': 				'comment',
			'keyword': 				'keyword',
			'expression_keyword': 	'expression-keyword',
			'api_keyword': 			'api-keyword',
			'variable': 			'variable',
			'struct_variable': 		'struct-variable',
			'register': 			'register',
			'constant': 			'constant',
			'meta': 				'meta',
			'identifier': 			'identifier',
			'number': 				'number',
			'boolean': 				'boolean',
			'string': 				'string',
			'label': 				'label',
			'label_param': 			'label',
			'sign': 				'sign'
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
					'MOTOR_A',
					'MOTOR_B',
					'MOTOR_C',
					'MOTOR_D',
					'MOTOR1_A',
					'MOTOR1_B',
					'MOTOR1_C',
					'MOTOR1_D',
					'MOTOR2_A',
					'MOTOR2_B',
					'MOTOR2_C',
					'MOTOR2_D',
					'MOTOR3_A',
					'MOTOR3_B',
					'MOTOR3_C',
					'MOTOR3_D',
					'MOTOR4_A',
					'MOTOR4_B',
					'MOTOR4_C',
					'MOTOR4_D',
					'MOTOR1_1',
					'MOTOR1_2',
					'MOTOR2_1',
					'MOTOR2_2',
					'MOTOR3_1',
					'MOTOR3_2',
					'MOTOR4_1',
					'MOTOR4_2',
					'MODULE_STANDARD',
					'MODULE_SCREEN',
					'MODULE_BUTTONS',
					'SCREEN_CLEAR',
					'SCREEN_DRAW_PIXEL',
					'SCREEN_DRAW_NUM',
					'SCREEN_DRAW_TEXT',
					'SCREEN_DRAW_LINE',
					'SCREEN_DRAW_RECT',
					'SCREEN_DRAW_CIRCLE',
					'STANDARD_LOG_NUMBER',
					'STANDARD_LOG_STRING',
				]
			},
			'meta': {
				autocomplete: true,
				tokens: [
					'#define',
					'#include',
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
					'abs',
					'neg',
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