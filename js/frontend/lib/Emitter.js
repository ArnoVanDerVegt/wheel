/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const Dispatcher = require('./dispatcher').Dispatcher;

exports.Emitter = class extends Dispatcher {
    addEventListener(signal, ctx, method) {
        let result = this.on(signal, ctx, method);
        result.addEventListener = this.addEventListener.bind(this);
        return result;
    }

    emit(signal) {
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
};
