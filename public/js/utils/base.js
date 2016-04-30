function wheel(namespace, item) {
	var path 	= namespace.split('.'),
		w 		= wheel;

	for (var i = 0, j = path.length - 1; i <= j; i++) {
		var p = path[i];
		if (i === j) {
			w[p] = item;
		} else {
			if (!(p in w)) {
				w[p] = {};
			}
			w = w[p];
		}
	}
}

function Class(parent, proto) {
    if (!parent) {
        throw new Error('No parent/prototype');
    }
	if (!proto) {
        proto = parent; parent = null;
	} else {
		if (parent == Error && ErrorParentClass) { parent = ErrorParentClass; }
		proto.prototype = parent.prototype;
	}

    var cls = function() {
            if (this.init) {
                return this.init.apply(this, arguments);
            }
        },
		supr = parent ? function(context, method, args) {
			if (typeof method === 'function') {
				var s = method + '';
				method = s.substr(8, s.indexOf('(') - 8).trim();
			}
			var f = parent.prototype[method];
			if (!f) { throw new Error('No method ' + method); }
			return f.apply(context, args || []);
		} : null;

    cls.prototype = new proto(supr, supr);
    cls.prototype.constructor = cls;
    cls.prototype._parentClass = parent;
    if (name) {
        cls.prototype._class = name;
    }
    return cls;
}

function bind(context, method) {
    if (typeof method === 'string') {
		var args0 = Array.prototype.slice.call(arguments, 2);
		if (args0.length) {
			return function _bound() {
				if (context[method]) {
					var args1 = Array.prototype.slice.call(arguments);
					return context[method].apply(context, args0.concat(args1));
				} else {
					throw new Error('No method: "' + method + '" for ctx: ' + context);
				}
			};
		} else {
			return function _bound() {
				if (context[method]) {
					return context[method].apply(context, arguments);
				} else {
					throw new Error('No method: "' + method + '" for ctx: ' + context);
				}
			};
		}
    }

	var args0 = Array.prototype.slice.call(arguments, 2);
    return function _bound() {
		var args1 = Array.prototype.slice.call(arguments);
        return method.apply(context, args0.concat(args1));
    };
}

var Emitter = Class(function() {
	this.init = function init() {
		this._listeners 	= {};
		this._listenerId 	= 0;
		this._hasTriggered 	= {}; // Object containing triggered events(unique, every event gets only stored once)
	};

	this.on = function on(signal, ctx, method) {
		var id = 'listener' + this._listenerId++;
		this._listeners[id] = {
			signal: signal,
			ctx: ctx,
			method: method
		};
		return bind(this, function() { delete this._listeners[id]; });
	};

	this.once = function once(signal, ctx, method) {
		var id 				= 'listener' + this._listenerId++,
			deleteCallback 	= bind(this, function() { delete this._listeners[id]; });
		this._listeners[id] = {
			signal: signal,
			ctx: ctx,
			method: method,
			once: deleteCallback
		};
		return deleteCallback;
	};

	this.emit = function emit(signal) {
		var listeners 	= this._listeners,
			args 		= Array.prototype.slice.call(arguments, 1);

		this._hasTriggered[signal] = true;

		for (var i in listeners) {
			var listener = listeners[i];
			if (listener.signal === signal) {
				if (typeof listener.ctx === 'function') {
					listener.ctx.apply(listener.ctx, args);
				} else if (typeof listener.method === 'string') {
					if (listener.ctx[listener.method]) {
						listener.ctx[listener.method].apply(listener.ctx, args);
					} else {
						throw new Error('No emitter cb: "' + listener.method + '"' + (typeof listener.method));
					}
				} else if (typeof listener.method === 'function') {
					listener.method.apply(listener.ctx, args);
				} else {
					throw new Error('No emitter cb: "' + listener.method + '"' + (typeof listener.method));
				}
				listener.once && listener.once();
			}
		}
	};

	this.getHasTriggered = function(signal) {
		return (signal === undefined) ? this._hasTriggered : !!this._hasTriggered[signal];
	};

	this.emitOnce = function emitOnce(signal) {
		this._hasTriggered[signal] || this.emit(signal);
	};
});