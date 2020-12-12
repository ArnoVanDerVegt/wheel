/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../../dispatcher').dispatcher;
const Component  = require('../component/Component').Component;

exports.ProgressBar = class extends Component {
    constructor(opts) {
        opts.baseClassName = 'progress-bar';
        super(opts);
        this._allowAutoWidth = true;
        this._value          = opts.value || 0;
        this.initDOM(opts.parentNode);
        dispatcher.on(opts.event, this, this.onEvent);
    }

    onEvent(opts) {
        if (('value' in opts) && (opts.value >= 0) && (opts.value <= 100)) {
            this._progressElement.style.width = opts.value + '%';
        }
        super.onEvent(opts);
        this.applyStyle(this._element.style, this._style);
    }

    setProgressElement(progressElement) {
        this._progressElement             = progressElement;
        this._progressElement.style.width = this._value + '%';
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                id:        this.setElement.bind(this),
                style:     this.applyStyle({}, this._style),
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
