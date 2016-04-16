var T_NUMBER_CONSTANT 		=  0,
	T_NUMBER_GLOBAL 		=  1,
	T_NUMBER_LOCAL			=  2,
	T_NUMBER_REGISTER		=  3,
	T_STRING_REGISTER		=  4,
	T_STRING_CONSTANT		=  5,
	T_PROC  				=  6,
	T_LABEL					=  7,

	T_NUMBER_GLOBAL_ARRAY 	=  8,
	T_NUMBER_LOCAL_ARRAY	=  9,

	T_STRUCT_GLOBAL 		= 10,
	T_STRUCT_GLOBAL_ARRAY 	= 11,
	T_STRUCT_LOCAL 			= 12,
	T_STRUCT_LOCAL_ARRAY 	= 13,

	T_PROC_GLOBAL 			= 14,
	T_PROC_GLOBAL_ARRAY		= 15,
	T_PROC_LOCAL 			= 16,
	T_PROC_LOCAL_ARRAY 		= 17;

var NO_PARAM_COMMANDS 		=  5,
	SINGLE_PARAM_COMMANDS 	= 24;

var commands = {
		// Commands without parameters...
		nop: {
			code: 0
		},
		ret: {
			code: 1
		},
		// Screen commands
		cls: {
			code: 2
		},
		line: {
			code: 3
		},
		rect: {
			code: 4
		},
		circle: {
			code: 5
		},

		// Commands with a single parameter...
		inc: {
			code: 6,
			args: [
				{type: T_NUMBER_GLOBAL},
				{type: T_NUMBER_LOCAL},
				{type: T_NUMBER_REGISTER},
			]
		},
		dec: {
			code: 7,
			args: [
				{type: T_NUMBER_GLOBAL},
				{type: T_NUMBER_LOCAL},
				{type: T_NUMBER_REGISTER},
			]
		},
		abs: {
			code: 8,
			args: [
				{type: T_NUMBER_GLOBAL},
				{type: T_NUMBER_LOCAL},
				{type: T_NUMBER_REGISTER},
			]
		},
		neg: {
			code: 9,
			args: [
				{type: T_NUMBER_GLOBAL},
				{type: T_NUMBER_LOCAL},
				{type: T_NUMBER_REGISTER},
			]
		},
		copy: {
			code: 10,
			args: [
				{type: T_NUMBER_CONSTANT}
			]
		},
		jmp: {
			code: 11,
			args: [
				{type: T_LABEL}
			]
		},
		je: {
			code: 12,
			args: [
				{type: T_LABEL}
			]
		},
		jne: {
			cde: 13,
			args: [
				{type: T_LABEL}
			]
		},
		jl: {
			code: 14,
			args: [
				{type: T_LABEL}
			]
		},
		jle: {
			code: 15,
			args: [
				{type: T_LABEL}
			]
		},
		jg: {
			code: 16,
			args: [
				{type: T_LABEL}
			]
		},
		jge: {
			code: 17,
			args: [
				{type: T_LABEL}
			]
		},
		call: {
			code: 18
		},
		call_global: {
			code: 19,
			args: [
				{type: T_PROC_GLOBAL}
			]
		},
		call_local: {
			code: 20,
			args: [
				{type: T_PROC_LOCAL}
			]
		},
		print: {
			code: 21,
			args: [
				{type: T_NUMBER_CONSTANT},
				{type: T_NUMBER_GLOBAL},
				{type: T_NUMBER_LOCAL},
				{type: T_NUMBER_REGISTER},
				{type: T_STRING_CONSTANT}, // String constant
			]
		},
		log: {
			code: 22,
			args: [
				{type: T_NUMBER_CONSTANT},
				{type: T_NUMBER_GLOBAL},
				{type: T_NUMBER_LOCAL},
				{type: T_NUMBER_REGISTER},
				{type: T_STRING_CONSTANT}, // String constant
			]
		},
		motorw: { // Motor write...
			code: 23,
			args: [
				{type: T_NUMBER_CONSTANT},
				{type: T_NUMBER_GLOBAL},
				{type: T_NUMBER_LOCAL},
				{type: T_NUMBER_REGISTER}
			]
		},
		motorr: { // Motor read...
			code: 24,
			args: [
				{type: T_NUMBER_CONSTANT},
				{type: T_NUMBER_GLOBAL},
				{type: T_NUMBER_LOCAL},
				{type: T_NUMBER_REGISTER}
			]
		},

		// Commands with 2 parameters...
		set: {
			code: 25,
			args: [
				{
					type: T_NUMBER_GLOBAL,
					args: [
						{type: T_NUMBER_CONSTANT},
						{type: T_NUMBER_GLOBAL},
						{type: T_NUMBER_LOCAL},
						{type: T_NUMBER_REGISTER},
						{type: T_PROC}
					]
				},
				{
					type: T_NUMBER_LOCAL,
					args: [
						{type: T_NUMBER_CONSTANT},
						{type: T_NUMBER_GLOBAL},
						{type: T_NUMBER_LOCAL},
						{type: T_NUMBER_REGISTER},
						{type: T_PROC}
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
				}
			]
		},
		add: {
			code: 26,
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
			code: 27,
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
			code: 28,
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
			code: 29,
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

		// Compare, loop...
		cmp: {
			code: 30,
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
		loop: {
			code: 31,
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
				},
				{
					type: T_NUMBER_REGISTER,
					args: [
						{type: T_LABEL}
					]
				},
			]
		},

		// The following commands are compiled into smaller commands with less parameters...
		// Array functions
		arrayr: { // Array read...
			code: 1024,
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
				},
				{
					type: T_PROC_GLOBAL,
					args: [
						{
							type: T_PROC_LOCAL_ARRAY,
							args: [
								{type: T_NUMBER_CONSTANT},
								{type: T_NUMBER_GLOBAL},
								{type: T_NUMBER_LOCAL},
								{type: T_NUMBER_REGISTER}
							]
						},
						{
							type: T_PROC_GLOBAL_ARRAY,
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
					type: T_PROC_LOCAL,
					args: [
						{
							type: T_PROC_LOCAL_ARRAY,
							args: [
								{type: T_NUMBER_CONSTANT},
								{type: T_NUMBER_GLOBAL},
								{type: T_NUMBER_LOCAL},
								{type: T_NUMBER_REGISTER}
							]
						},
						{
							type: T_PROC_GLOBAL_ARRAY,
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

		arrayw: { // Array write...
			code: 1025,
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
								{type: T_NUMBER_REGISTER},
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
								{type: T_NUMBER_REGISTER},
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
								{type: T_NUMBER_REGISTER},
								{type: T_PROC},
								{type: T_PROC_GLOBAL},
								{type: T_PROC_LOCAL}
							]
						},
						{
							type: T_NUMBER_REGISTER,
							args: [
								{type: T_NUMBER_CONSTANT},
								{type: T_NUMBER_GLOBAL},
								{type: T_NUMBER_LOCAL},
								{type: T_NUMBER_REGISTER},
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
								{type: T_NUMBER_REGISTER},
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
								{type: T_NUMBER_REGISTER},
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
								{type: T_NUMBER_REGISTER},
								{type: T_PROC},
								{type: T_PROC_GLOBAL},
								{type: T_PROC_LOCAL}
							]
						},
						{
							type: T_NUMBER_REGISTER,
							args: [
								{type: T_NUMBER_CONSTANT},
								{type: T_NUMBER_GLOBAL},
								{type: T_NUMBER_LOCAL},
								{type: T_NUMBER_REGISTER},
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
						},
						{
							type: T_NUMBER_REGISTER,
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
						},
						{
							type: T_NUMBER_REGISTER,
							args: [
								{type: T_PROC_GLOBAL},
								{type: T_PROC_LOCAL},
								{type: T_PROC}
							]
						}
					]
				}
			]
		}
	};

var typeToLocation = function(type) {
		var result = '';
		switch (type) {
			case T_NUMBER_CONSTANT: 	result = 'const';	break;
			case T_NUMBER_GLOBAL: 		result = 'global';	break;
			case T_NUMBER_GLOBAL_ARRAY:	result = 'global';	break;
			case T_NUMBER_LOCAL: 		result = 'local';	break;
			case T_NUMBER_LOCAL_ARRAY: 	result = 'local';	break;
			case T_NUMBER_REGISTER: 	result = 'reg';		break;

			case T_STRING_REGISTER: 	result = 'reg';		break;
			case T_STRING_CONSTANT: 	result = 'const';	break;

			case T_STRUCT_GLOBAL:		result = 'global';	break;
			case T_STRUCT_GLOBAL_ARRAY:	result = 'global';	break;
			case T_STRUCT_LOCAL: 		result = 'local';	break;
			case T_STRUCT_LOCAL_ARRAY: 	result = 'local';	break;

			case T_PROC_GLOBAL:			result = 'global';	break;
			case T_PROC_GLOBAL_ARRAY:	result = 'global';	break;
			case T_PROC_LOCAL:			result = 'local';	break;
			case T_PROC_LOCAL_ARRAY: 	result = 'local';	break;
		}
		return result;
	};
