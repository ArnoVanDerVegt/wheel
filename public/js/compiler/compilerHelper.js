wheel(
	'compiler.compilerHelper',
	{
		validateString: function(s, valid) {
			if (!valid) {
				valid = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_';
			}
			for (var i = 0; i < s.length; i++) {
				if (valid.indexOf(s[i]) === -1) {
					return false;
				}
			}
			return true;
		},

		parseNumberArray: function(value, compiler) {
			console.log(value);
			var value = value.trim();
			if (value.length && (value[0] === '[') && (value[value.length - 1] !== ']')) {
				throw compiler.createError('Syntax error.');
			}

			value = value.substr(1, value.length - 2);
			var values 	= value.split(','),
				data 	= [];
			for (var j = 0; j < values.length; j++) {
				var v = parseFloat(values[j].trim());
				if (isNaN(v)) {
					throw compiler.createError('Number expected, found "' + values[j] + '".');
				}
				data.push(v);
			}
			return data;
		},

		parseStringArray: function(value, compiler, compilerData) {
			var value = value.trim();
			if (value.length && (value[0] === '[') && (value[value.length - 1] !== ']')) {
				throw compiler.createError('Syntax error.');
			}

			value = value.substr(1, value.length - 2);
			var values 	= value.split(','),
				data 	= [];
			for (var j = 0; j < values.length; j++) {
				var v = values[j].trim();
				if ((v.length < 2) || (v[0] !== '"') || (v.substr(-1) !== '"')) {
					throw compiler.createError('String expected, found "' + values[j] + '".');
				}
				data.push(compilerData.declareString(v.substr(1, v.length - 2)));
			}
			return data;
		},

		splitParams: function(params) {
			var result 	= [],
				param 	= '',
				j 		= 0;

			while (j < params.length) {
				var c = params[j];
				switch (c) {
					case ',':
						param = param.trim();
						(param !== '') && result.push(param);
						param = '';
						break;

					case '[':
						while (j < params.length) {
							var c = params[j++];
							param += c;
							if (c === ']') {
								break;
							}
						}
						break;

					case '"':
						j++;
						param += '"';
						while (j < params.length) {
							var c = params[j++];
							param += c;
							if (c === '"') {
								break;
							}
						}
						break;

					default:
						param += c;
						break;
				}
				j++;
			}
			param = param.trim();
			(param !== '') && result.push(param);

			return result;
		}
	}
);