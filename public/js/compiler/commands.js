/*
Data types:

bool const 			bc
bool var global 	bg
bool var local		bl
bool register 		br
int const 			ic
int var global 		ig
int var local 		il
int register		ir
string const 		sc
string var global	sg
label 				la
procedure 			pr
*/

var commands = {
		// 1..15: Math...
		set: {
			code: 1,
			args: [
				{
					type: 'ng', // Num global
					args: [
						{type: 'nc'}, // Num constant
						{type: 'ng'}, // Num global
						{type: 'nl'}, // Num local
						{type: 'nr'}  // Num register
					]
				},
				{
					type: 'nl', // Num local
					args: [
						{type: 'nc'}, // Num constant
						{type: 'ng'}, // Num global
						{type: 'nl'}, // Num local
						{type: 'nr'}  // Num register
					]
				},
				{
					type: 'nr', // Num register
					args: [
						{type: 'nc'}, // Num constant
						{type: 'ng'}, // Num global
						{type: 'nl'}, // Num local
						{type: 'nr'}  // Num register
					]
				}
			]
		},
		add: {
			code: 2,
			args: [
				{
					type: 'ng', // Num global
					args: [
						{type: 'nc'}, // Num constant
						{type: 'ng'}, // Num global
						{type: 'nl'}, // Num local
						{type: 'nr'}  // Num register
					]
				},
				{
					type: 'nl', // Num local
					args: [
						{type: 'nc'}, // Num constant
						{type: 'ng'}, // Num global
						{type: 'nl'}, // Num local
						{type: 'nr'}  // Num register
					]
				},
				{
					type: 'nr', // Num register
					args: [
						{type: 'nc'}, // Num constant
						{type: 'ng'}, // Num global
						{type: 'nl'}, // Num local
						{type: 'nr'}  // Num register
					]
				},
			]
		},
		sub: {
			code: 3,
			args: [
				{
					type: 'ng', // Num global
					args: [
						{type: 'nc'}, // Num constant
						{type: 'ng'}, // Num global
						{type: 'nl'}, // Num local
						{type: 'nr'}  // Num register
					]
				},
				{
					type: 'nl', // Num local
					args: [
						{type: 'nc'}, // Num constant
						{type: 'ng'}, // Num global
						{type: 'nl'}, // Num local
						{type: 'nr'}  // Num register
					]
				},
				{
					type: 'nr', // Num register
					args: [
						{type: 'nc'}, // Num constant
						{type: 'ng'}, // Num global
						{type: 'nl'}, // Num local
						{type: 'nr'}  // Num register
					]
				},
			]
		},
		mul: {
			code: 4,
			args: [
				{
					type: 'ng', // Num global
					args: [
						{type: 'nc'}, // Num constant
						{type: 'ng'}, // Num global
						{type: 'nl'}, // Num local
						{type: 'nr'}  // Num register
					]
				},
				{
					type: 'nl', // Num local
					args: [
						{type: 'nc'}, // Num constant
						{type: 'ng'}, // Num global
						{type: 'nl'}, // Num local
						{type: 'nr'}  // Num register
					]
				},
				{
					type: 'nr', // Num register
					args: [
						{type: 'nc'}, // Num constant
						{type: 'ng'}, // Num global
						{type: 'nl'}, // Num local
						{type: 'nr'}  // Num register
					]
				},
			]
		},
		div: {
			code: 5,
			args: [
				{
					type: 'ng', // Num global
					args: [
						{type: 'nc'}, // Num constant
						{type: 'ng'}, // Num global
						{type: 'nl'}, // Num local
						{type: 'nr'}  // Num register
					]
				},
				{
					type: 'nl', // Num local
					args: [
						{type: 'nc'}, // Num constant
						{type: 'ng'}, // Num global
						{type: 'nl'}, // Num local
						{type: 'nr'}  // Num register
					]
				},
				{
					type: 'nr', // Num register
					args: [
						{type: 'nc'}, // Num constant
						{type: 'ng'}, // Num global
						{type: 'nl'}, // Num local
						{type: 'nr'}  // Num register
					]
				},
			]
		},

		// 16..31: Compare...
		cmp: {
			code: 16,
			args: [
				{
					type: 'ng', // Num global
					args: [
						{type: 'nc'}, // Num constant
						{type: 'ng'}, // Num global
						{type: 'nl'}, // Num local
						{type: 'nr'}  // Num register
					]
				},
				{
					type: 'nl', // Num local
					args: [
						{type: 'nc'}, // Num constant
						{type: 'ng'}, // Num global
						{type: 'nl'}, // Num local
						{type: 'nr'}  // Num register
					]
				},
				{
					type: 'nr', // Num register
					args: [
						{type: 'nc'}, // Num constant
						{type: 'ng'}, // Num global
						{type: 'nl'}, // Num local
						{type: 'nr'}  // Num register
					]
				},
			]
		},

		// 32..47: Single parameter operators...
		inc: {
			code: 32,
			args: [
				{type: 'ng'}, // Num global
				{type: 'nl'}, // Num local
				{type: 'nr'}, // Num register
			]
		},
		dec: {
			code: 33,
			args: [
				{type: 'ng'}, // Num global
				{type: 'nl'}, // Num local
				{type: 'nr'}, // Num register
			]
		},
		abs: {
			code: 34,
			args: [
				{type: 'ng'}, // Num global
				{type: 'nl'}, // Num local
				{type: 'nr'}, // Num register
			]
		},
		neg: {
			code: 35,
			args: [
				{type: 'ng'}, // Num global
				{type: 'nl'}, // Num local
				{type: 'nr'}, // Num register
			]
		},

		// 48...63: Single parameter procedures...
		print: {
			code: 48,
			args: [
				{type: 'nc'}, // Num constant
				{type: 'ng'}, // Num global
				{type: 'nl'}, // Num local
				{type: 'nr'}, // Num register
				{type: 'sc'}, // String constant
			]
		},
		motorw: { // Motor write...
			code: 49,
			args: [
				{type: 'nc'}, // Num constant
				{type: 'ng'}, // Num global
				{type: 'nl'}, // Num local
				{type: 'nr'}  // Num register
			]
		},
		motorr: { // Motor read...
			code: 50,
			args: [
				{type: 'nc'}, // Num constant
				{type: 'ng'}, // Num global
				{type: 'nl'}, // Num local
				{type: 'nr'}  // Num register
			]
		},

		// 64..95: Flow control...
		jmp: {
			code: 64,
			args: [
				{type: 'la'}
			]
		},
		je: {
			code: 65,
			args: [
				{type: 'la'}
			]
		},
		jne: {
			cde: 66,
			args: [
				{type: 'la'}
			]
		},
		jl: {
			code: 67,
			args: [
				{type: 'la'}
			]
		},
		jle: {
			code: 68,
			args: [
				{type: 'la'}
			]
		},
		jg: {
			code: 69,
			args: [
				{type: 'la'}
			]
		},
		jge: {
			code: 70,
			args: [
				{type: 'la'}
			]
		},

		// 80..95: Call, ret
		call: 		{code: 80},
		ret: 		{code: 81},

		// 96..111: Screen commands
		cls: 		{code: 96},
		line: 		{code: 97},
		rect: 		{code: 98},
		circle: 	{code: 99},
	};