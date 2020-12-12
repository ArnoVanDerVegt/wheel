/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../../dispatcher').dispatcher;
const Component  = require('./../Component');

exports.LoadingDots = class extends Component.Component {
    constructor(opts) {
        opts.baseClassName = 'loading-dots';
        super(opts);
        this.initDOM(opts.parentNode);
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                id:        this.setElement.bind(this),
                ref:       this.setRef('dots'),
                className: this.getClassName(),
                style:     this.applyStyle({}, this._style),
                children:  [{}, {className: 'design'}]
            }
        );
    }

    setVisible(visible) {
        this._refs.dots.style.display = visible ? 'block' : 'none';
    }

    onEvent(opts) {
        if ('color' in opts) {
            this.setColor(Component.getComponentColor(opts.color));
        }
        super.onEvent(opts);
        this.applyStyle(this._element.style, this._style);
    }
};

exports.Component = exports.LoadingDots;
