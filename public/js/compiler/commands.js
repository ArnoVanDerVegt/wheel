var T_NUMBER_CONSTANT 		=  0,
	T_NUMBER_GLOBAL 		=  1,
	T_NUMBER_GLOBAL_ARRAY 	=  2,
	T_NUMBER_LOCAL			=  3,
	T_NUMBER_LOCAL_ARRAY	=  4,
	T_NUMBER_REGISTER		=  5,

	T_STRING_REGISTER		=  6,
	T_STRING_CONSTANT		=  7,

	T_STRUCT_GLOBAL 		=  8,
	T_STRUCT_GLOBAL_ARRAY 	=  9,
	T_STRUCT_LOCAL 			= 10,
	T_STRUCT_LOCAL_ARRAY 	= 11,

	T_LABEL					= 12;

var commands = {
		nop: {
			code: 0
		},
		// 1..15: Math...
		set: {
			code: 1,
			args: [
				{
					type: T_NUMBER_GLOBAL,
					args: [
						{type: T_NUMBER_CONSTANT},
						{type: T_NUMBER_GLOBAL},
						{type: T_NUMBER_LOCAL},
						{type: T_NUMBER_REGISTER}
					]
				},
				{
					type: T_NUMBER_LOCAL,
					args: [
						{type: T_NUMBER_CONSTANT},
						{type: T_NUMBER_GLOBAL},
						{type: T_NUMBER_LOCAL},
						{type: T_NUMBER_REGISTER}
					]
				},
				{
					type: T_NUMBER_REGISTER,
					args: [
						{type: T_NUMBER_CONSTANT},
						{type: T_NUMBER_GLOBAL},
						{type: T_NUMBER_LOCAL},
						{type: T_NUMBER_REGISTER}
					]
				}
			]
		},
		add: {
			code: 2,
			args: [
				{
					type: T_NUMBER_GLOBAL,
					args: [
						{type: T_NUMBER_CONSTANT},
						{type: T_NUMBER_GLOBAL},
						{type: T_NUMBER_LOCAL},
						{type: T_NUMBER_REGISTER}
					]
				},
				{
					type: T_NUMBER_LOCAL,
					args: [
						{type: T_NUMBER_CONSTANT},
						{type: T_NUMBER_GLOBAL},
						{type: T_NUMBER_LOCAL},
						{type: T_NUMBER_REGISTER}
					]
				},
				{
					type: T_NUMBER_REGISTER,
					args: [
						{type: T_NUMBER_CONSTANT},
						{type: T_NUMBER_GLOBAL},
						{type: T_NUMBER_LOCAL},
						{type: T_NUMBER_REGISTER}
					]
				},
			]
		},
		sub: {
			code: 3,
			args: [
				{
					type: T_NUMBER_GLOBAL,
					args: [
						{type: T_NUMBER_CONSTANT},
						{type: T_NUMBER_GLOBAL},
						{type: T_NUMBER_LOCAL},
						{type: T_NUMBER_REGISTER}
					]
				},
				{
					type: T_NUMBER_LOCAL,
					args: [
						{type: T_NUMBER_CONSTANT},
						{type: T_NUMBER_GLOBAL},
						{type: T_NUMBER_LOCAL},
						{type: T_NUMBER_REGISTER}
					]
				},
				{
					type: T_NUMBER_REGISTER,
					args: [
						{type: T_NUMBER_CONSTANT},
						{type: T_NUMBER_GLOBAL},
						{type: T_NUMBER_LOCAL},
						{type: T_NUMBER_REGISTER}
					]
				},
			]
		},
		mul: {
			code: 4,
			args: [
				{
					type: T_NUMBER_GLOBAL,
					args: [
						{type: T_NUMBER_CONSTANT},
						{type: T_NUMBER_GLOBAL},
						{type: T_NUMBER_LOCAL},
						{type: T_NUMBER_REGISTER}
					]
				},
				{
					type: T_NUMBER_LOCAL,
					args: [
						{type: T_NUMBER_CONSTANT},
						{type: T_NUMBER_GLOBAL},
						{type: T_NUMBER_LOCAL},
						{type: T_NUMBER_REGISTER}
					]
				},
				{
					type: T_NUMBER_REGISTER,
					args: [
						{type: T_NUMBER_CONSTANT},
						{type: T_NUMBER_GLOBAL},
						{type: T_NUMBER_LOCAL},
						{type: T_NUMBER_REGISTER}
					]
				},
			]
		},
		div: {
			code: 5,
			args: [
				{
					type: T_NUMBER_GLOBAL,
					args: [
						{type: T_NUMBER_CONSTANT},
						{type: T_NUMBER_GLOBAL},
						{type: T_NUMBER_LOCAL},
						{type: T_NUMBER_REGISTER}
					]
				},
				{
					type: T_NUMBER_LOCAL,
					args: [
						{type: T_NUMBER_CONSTANT},
						{type: T_NUMBER_GLOBAL},
						{type: T_NUMBER_LOCAL},
						{type: T_NUMBER_REGISTER}
					]
				},
				{
					type: T_NUMBER_REGISTER,
					args: [
						{type: T_NUMBER_CONSTANT},
						{type: T_NUMBER_GLOBAL},
						{type: T_NUMBER_LOCAL},
						{type: T_NUMBER_REGISTER}
					]
				},
			]
		},

		// 16..31: Compare...
		cmp: {
			code: 16,
			args: [
				{
					type: T_NUMBER_GLOBAL,
					args: [
						{type: T_NUMBER_CONSTANT},
						{type: T_NUMBER_GLOBAL},
						{type: T_NUMBER_LOCAL},
						{type: T_NUMBER_REGISTER}
					]
				},
				{
					type: T_NUMBER_LOCAL,
					args: [
						{type: T_NUMBER_CONSTANT},
						{type: T_NUMBER_GLOBAL},
						{type: T_NUMBER_LOCAL},
						{type: T_NUMBER_REGISTER}
					]
				},
				{
					type: T_NUMBER_REGISTER,
					args: [
						{type: T_NUMBER_CONSTANT},
						{type: T_NUMBER_GLOBAL},
						{type: T_NUMBER_LOCAL},
						{type: T_NUMBER_REGISTER}
					]
				},
			]
		},

		// 32..47: Single parameter operators...
		inc: {
			code: 32,
			args: [
				{type: T_NUMBER_GLOBAL},
				{type: T_NUMBER_LOCAL},
				{type: T_NUMBER_REGISTER},
			]
		},
		dec: {
			code: 33,
			args: [
				{type: T_NUMBER_GLOBAL},
				{type: T_NUMBER_LOCAL},
				{type: T_NUMBER_REGISTER},
			]
		},
		abs: {
			code: 34,
			args: [
				{type: T_NUMBER_GLOBAL},
				{type: T_NUMBER_LOCAL},
				{type: T_NUMBER_REGISTER},
			]
		},
		neg: {
			code: 35,
			args: [
				{type: T_NUMBER_GLOBAL},
				{type: T_NUMBER_LOCAL},
				{type: T_NUMBER_REGISTER},
			]
		},

		// 48...63: Single parameter procedures...
		print: {
			code: 48,
			args: [
				{type: T_NUMBER_CONSTANT},
				{type: T_NUMBER_GLOBAL},
				{type: T_NUMBER_LOCAL},
				{type: T_NUMBER_REGISTER},
				{type: T_STRING_CONSTANT}, // String constant
			]
		},
		log: {
			code: 49,
			args: [
				{type: T_NUMBER_CONSTANT},
				{type: T_NUMBER_GLOBAL},
				{type: T_NUMBER_LOCAL},
				{type: T_NUMBER_REGISTER},
				{type: T_STRING_CONSTANT}, // String constant
			]
		},
		motorw: { // Motor write...
			code: 50,
			args: [
				{type: T_NUMBER_CONSTANT},
				{type: T_NUMBER_GLOBAL},
				{type: T_NUMBER_LOCAL},
				{type: T_NUMBER_REGISTER}
			]
		},
		motorr: { // Motor read...
			code: 51,
			args: [
				{type: T_NUMBER_CONSTANT},
				{type: T_NUMBER_GLOBAL},
				{type: T_NUMBER_LOCAL},
				{type: T_NUMBER_REGISTER}
			]
		},

		// 64..95: Flow control...
		jmp: {
			code: 64,
			args: [
				{type: T_LABEL}
			]
		},
		je: {
			code: 65,
			args: [
				{type: T_LABEL}
			]
		},
		jne: {
			cde: 66,
			args: [
				{type: T_LABEL}
			]
		},
		jl: {
			code: 67,
			args: [
				{type: T_LABEL}
			]
		},
		jle: {
			code: 68,
			args: [
				{type: T_LABEL}
			]
		},
		jg: {
			code: 69,
			args: [
				{type: T_LABEL}
			]
		},
		jge: {
			code: 70,
			args: [
				{type: T_LABEL}
			]
		},

		// 80..83: Call, ret
		call: 		{code: 80},
		ret: 		{code: 81},

		// 84..95: Array functions
		arrayr: 	{ // Array read...
			code: 84,
			args: [
				{
					type: T_NUMBER_GLOBAL,
					args: [
						{
							type: T_NUMBER_LOCAL_ARRAY,
							args: [
								{type: T_NUMBER_CONSTANT},
								{type: T_NUMBER_GLOBAL},
								{type: T_NUMBER_LOCAL},
								{type: T_NUMBER_REGISTER}
							]
						},
						{
							type: T_NUMBER_GLOBAL_ARRAY,
							args: [
								{type: T_NUMBER_CONSTANT},
								{type: T_NUMBER_GLOBAL},
								{type: T_NUMBER_LOCAL},
								{type: T_NUMBER_REGISTER}
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
								{type: T_NUMBER_LOCAL},
								{type: T_NUMBER_REGISTER}
							]
						},
						{
							type: T_NUMBER_GLOBAL_ARRAY,
							args: [
								{type: T_NUMBER_CONSTANT},
								{type: T_NUMBER_GLOBAL},
								{type: T_NUMBER_LOCAL},
								{type: T_NUMBER_REGISTER}
							]
						}
					]
				},
				{
					type: T_NUMBER_REGISTER,
					args: [
						{
							type: T_NUMBER_LOCAL_ARRAY,
							args: [
								{type: T_NUMBER_CONSTANT},
								{type: T_NUMBER_GLOBAL},
								{type: T_NUMBER_LOCAL},
								{type: T_NUMBER_REGISTER}
							]
						},
						{
							type: T_NUMBER_GLOBAL_ARRAY,
							args: [
								{type: T_NUMBER_CONSTANT},
								{type: T_NUMBER_GLOBAL},
								{type: T_NUMBER_LOCAL},
								{type: T_NUMBER_REGISTER}
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
								{type: T_NUMBER_LOCAL},
								{type: T_NUMBER_REGISTER}
							]
						},
						{
							type: T_STRUCT_GLOBAL_ARRAY,
							args: [
								{type: T_NUMBER_CONSTANT},
								{type: T_NUMBER_GLOBAL},
								{type: T_NUMBER_LOCAL},
								{type: T_NUMBER_REGISTER}
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
								{type: T_NUMBER_LOCAL},
								{type: T_NUMBER_REGISTER}
							]
						},
						{
							type: T_STRUCT_GLOBAL_ARRAY,
							args: [
								{type: T_NUMBER_CONSTANT},
								{type: T_NUMBER_GLOBAL},
								{type: T_NUMBER_LOCAL},
								{type: T_NUMBER_REGISTER}
							]
						}
					]
				}
			]
		},

		arrayw: 	{ // Array write...
			code: 85,
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
								{type: T_NUMBER_REGISTER}
							]
						},
						{
							type: T_NUMBER_GLOBAL,
							args: [
								{type: T_NUMBER_CONSTANT},
								{type: T_NUMBER_GLOBAL},
								{type: T_NUMBER_LOCAL},
								{type: T_NUMBER_REGISTER}
							]
						},
						{
							type: T_NUMBER_LOCAL,
							args: [
								{type: T_NUMBER_CONSTANT},
								{type: T_NUMBER_GLOBAL},
								{type: T_NUMBER_LOCAL},
								{type: T_NUMBER_REGISTER}
							]
						},
						{
							type: T_NUMBER_REGISTER,
							args: [
								{type: T_NUMBER_CONSTANT},
								{type: T_NUMBER_GLOBAL},
								{type: T_NUMBER_LOCAL},
								{type: T_NUMBER_REGISTER}
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
								{type: T_NUMBER_REGISTER}
							]
						},
						{
							type: T_NUMBER_GLOBAL,
							args: [
								{type: T_NUMBER_CONSTANT},
								{type: T_NUMBER_GLOBAL},
								{type: T_NUMBER_LOCAL},
								{type: T_NUMBER_REGISTER}
							]
						},
						{
							type: T_NUMBER_LOCAL,
							args: [
								{type: T_NUMBER_CONSTANT},
								{type: T_NUMBER_GLOBAL},
								{type: T_NUMBER_LOCAL},
								{type: T_NUMBER_REGISTER}
							]
						},
						{
							type: T_NUMBER_REGISTER,
							args: [
								{type: T_NUMBER_CONSTANT},
								{type: T_NUMBER_GLOBAL},
								{type: T_NUMBER_LOCAL},
								{type: T_NUMBER_REGISTER}
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
						},
						{
							type: T_NUMBER_REGISTER,
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
						},
						{
							type: T_NUMBER_REGISTER,
							args: [
								{type: T_STRUCT_GLOBAL},
								{type: T_STRUCT_LOCAL}
							]
						}
					]
				}
			]
		},

		// 96..111: Screen commands
		cls: 		{code: 96},
		line: 		{code: 97},
		rect: 		{code: 98},
		circle: 	{code: 99},
	};