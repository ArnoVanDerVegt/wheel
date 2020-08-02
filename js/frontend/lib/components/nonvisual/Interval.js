/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../../dispatcher').dispatcher;
const Component  = require('../Component');

exports.Interval = class extends Component.Component {
    constructor(opts) {
        super(opts);
        this._baseClassName = 'non-visual component-timer';
        this._onInterval    = opts.onInterval;
        this._time          = opts.time;
        this._interval      = this._design ? null : setInterval(this.onInterval.bind(this), opts.time);
        this.initDOM(opts.parentNode);
    }

    remove() {
        super.remove();
        if (this._interval) {
            clearInterval(this._interval);
        }
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                id:        this.setElement.bind(this),
                className: this.getClassName()
            }
        );
    }

    onEvent(opts) {
        if ('time' in opts) {
            this._time = opts.time;
            if (this._interval) {
                clearInterval(this._interval);
                this._interval = null;
            }
            if (!this._design) {
                this._interval = setInterval(this.onInterval.bind(this), this._time);
            }
        }
        if (('pause' in opts) && this._interval) {
            clearInterval(this._interval);
            this._interval = null;
        }
        if (('resume' in opts) && !this._design) {
            this._interval = setInterval(this.onInterval.bind(this), this._time);
        }
        super.onEvent(opts);
    }

    onInterval() {
        if (typeof this._onInterval === 'function') {
            this._onInterval();
        }
    }
};

exports.Component = exports.Interval;
