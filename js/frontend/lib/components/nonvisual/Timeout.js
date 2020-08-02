/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher         = require('../../dispatcher').dispatcher;
const NonVisualComponent = require('./NonVisualComponent').NonVisualComponent;

exports.Timeout = class extends NonVisualComponent {
    constructor(opts) {
        super(opts);
        this._onTimeout     = opts.onTimeout;
        this._timeout       = null;
        this._time          = opts.time;
        this._baseClassName = 'non-visual component-clock';
        this.initDOM(opts.parentNode);
    }

    remove() {
        super.remove();
        if (this._timeout) {
            clearTimeout(this._timeout);
        }
    }

    onEvent(opts) {
        if ('time' in opts) {
            this._time = opts.time;
        }
        if (('start' in opts) && !this._design) {
            if (this._timeout) {
                clearTimeout(this._timeout);
            }
            this._timeout = setTimeout(this.onTimeout.bind(this), this._time);
        }
        if (('cancel' in opts) && this._timeout) {
            clearTimeout(this._timeout);
            this._timeout = null;
        }
        super.onEvent(opts);
    }

    onTimeout() {
        if (typeof this._onTimeout === 'function') {
            this._onTimeout();
        }
    }
};

exports.Component = exports.Timeout;
