window.require = function(filename) {
	if (filename === 'path') {
		return {
			join: function(a, b) {
				while (a.length && (a[a.length - 1] === '/')) {
					a = a.substr(0, a.length - 1);
				}
				while (b.length && (b[0] === '/')) {
					b = b.substr(1 - b.length);
				}
				return a + '/' + b;
			}
		};
	}
	return {wheel: window.wheel};
};