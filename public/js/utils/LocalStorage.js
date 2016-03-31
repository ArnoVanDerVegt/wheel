var LocalStorage = Class(function() {
		this.init = function(opts) {
			var data = localStorage.getItem('MVM_DATA');
			if (data) {
				try {
					data = JSON.parse(data);
				} catch (error) {
					data = {};
				}
			} else {
				data = {};
			}
			this._data = data;
		};

		this.get = function(key, defaultValue) {
			var data = this._data;
			if (key in data) {
				return data[key];
			} else if (defaultValue === undefined) {
				return null;
			}

			if (this.set(key, defaultValue)) {
				return defaultValue;
			}
			return null;
		};

		this.set = function(key, value) {
			var oldValue = this._data[key];
			this._data[key] = value;
			try {
				localStorage.setItem('MVM_DATA', JSON.stringify(this._data));
			} catch (error) {
				// Saving failed, restore to previous state...
				if (oldValue === undefined) {
					delete this._data[key];
				} else {
					this._data[key] = oldValue;
				}
				return false;
			}
			return true;
		};
	});

LocalStorage.getInstance = function() {
	if (LocalStorage._instance) {
		return LocalStorage._instance;
	};
	LocalStorage._instance = new LocalStorage({});
	return LocalStorage._instance;
};