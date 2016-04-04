// 1. a partial mvm grammar in simple JSON format
var mvmGrammar = {
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
		'register': 			'register',
		'constant': 			'constant',
		'meta': 				'meta',
		'identifier': 			'identifier',
		'number': 				'number',
		'boolean': 				'boolean',
		'string': 				'string',
		'label': 				'label',
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
				'REG_OFFSET',
				'REG_DRAW_X',
				'REG_DRAW_Y',
				'REG_DRAW_X1',
				'REG_DRAW_Y1',
				'REG_DRAW_X2',
				'REG_DRAW_Y2',
				'REG_DRAW_WIDTH',
				'REG_DRAW_HEIGHT',
				'REG_MOTOR_TARGET',
				'REG_MOTOR_POSITION',
				'REG_MOTOR_POWER'
			]
		},
		'constant': {
			autocomplete: true,
			tokens: [
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
			'tokens': ['proc', 'endp']
		},
		'expression_keyword': {
			'autocomplete': true,
			'tokens': [
				'set',
				'add',
				'sub',
				'mul',
				'div',
				'cmp',
				'jmp',
				'je',
				'jne',
				'jl',
				'jle',
				'inc',
				'dec',
				'abs',
				'neg',
				'arrayw',
				'arrayr'
			]
		},
		'api_keyword': {
			'autocomplete': true,
			'tokens': [
				'print',
				'motorw',
				'motorr',
				'sensorw',
				'sensorr',
				'rect',
				'circle',
				'line'
			]
		},
		'variable': {
			'autocomplete': true,
			'tokens': [
				'number',
				'bool',
				'string'
			]
		}
	},

	// Syntax model (optional)
	'Syntax': {
		'token': 'label | boolean | number | variable | string | keyword | expression_keyword | api_keyword | register | constant | meta | identifier | sign'
	},

	// what to parse and in what order
	'Parser': ['comment', ['token']]
};