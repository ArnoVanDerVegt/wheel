/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
class Dispatcher {
    constructor() {
        this._reset();
    }

    _reset() {
        this._listeners  = {};
        this._listenerId = 0;
    }

    reset() {
        this._reset();
    }

    on(signal, ctx, method) {
        let id        = 'listener' + this._listenerId++;
        let listeners = this._listeners;
        listeners[id] = {
            signal: signal,
            ctx:    ctx,
            method: method
        };
        let result = function() {
                delete listeners[id];
            };
        result.on = this.on.bind(this);
        return result;
    }

    dispatch(signal) {
        let listeners = this._listeners;
        let args      = Array.prototype.slice.call(arguments, 1);
        for (let i in listeners) {
            let listener = listeners[i];
            if (listener.signal === signal) {
                if (typeof listener.method === 'function') {
                    listener.method.apply(listener.ctx, args);
                } else {
                    console.error('Listener', i, 'is not a function, signal:', signal);
                }
            }
        }
        return this;
    }
}

exports.Dispatcher = Dispatcher;
exports.dispatcher = new Dispatcher();
