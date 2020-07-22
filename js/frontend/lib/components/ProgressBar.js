/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../dispatcher').dispatcher;
const Component  = require('./Component').Component;

exports.ProgressBar = class extends Component {
    constructor(opts) {
        opts.baseClassName = 'progress-bar';
        super(opts);
        this._width = opts.width || '';
        this._value = opts.value || 0;
        this.initDOM(opts.parentNode);
        dispatcher.on(opts.event, this, this.onEvent);
    }

    onEvent(opts) {
        if (('value' in opts) && (opts.value >= 0) && (opts.value <= 100)) {
            this._progressElement.style.width = opts.value + '%';
        }
        if ('width' in opts) {
            if (parseInt(opts.width, 10) >= 20) {
                this.setWidth(opts.width + 'px');
            } else {
                this.setWidth('auto');
            }
        }
        super.onEvent(opts);
    }

    setProgressElement(progressElement) {
        this._progressElement             = progressElement;
        this._progressElement.style.width = this._value + '%';
    }

    initDOM(parentNode) {
        let style = this._style || {};
        if (this._width && (parseInt(this._width, 10) >= 20)) {
            style.width = this._width + 'px';
        }
        this.create(
            parentNode,
            {
                style:     style,
                id:        this.setElement.bind(this),
                className: this.getClassName(),
                children: [
                    {
                        className: 'bar',
                        children: [
                            {
                                id:        this.setProgressElement.bind(this),
                                className: 'progress'
                            }
                        ]
                    }
                ]
            }
        );
    }
};

exports.Component = exports.ProgressBar;
