// 1. a partial rgf grammar in simple JSON format
var rgfGrammar = {
	// prefix ID for regular expressions used in the grammar
	'RegExpID': 'RE::',

	// Style model
	'Style': {
		'color0': 'color0',
		'color1': 'color1'
	},

	// Lexical model
	'Lex': {
		'color0': {
			autocomplete: true,
			tokens: [
				'0',
			]
		},
		'color1': {
			autocomplete: true,
			tokens: [
				'1',
			]
		}
	},

	// Syntax model (optional)
	'Syntax': {
		'token': 'color0 | color1'
	},

	// what to parse and in what order
	'Parser': ['comment', ['token']]
};