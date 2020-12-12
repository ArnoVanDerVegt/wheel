/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const Component = require('./../Component').Component;

exports.CloseButton = class extends Component {
    constructor(opts) {
        super(opts);
        this._baseClassName = 'close-button';
        this._color         = '';
        this._title         = opts.title || '✖';
        this.initDOM(opts.parentNode);
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                id:        this.setElement.bind(this),
                type:      'input',
                inputType: 'button',
                className: this.getClassName(),
                tabIndex:  this._tabIndex,
                disabled:  this._disabled ? 'disabled' : '',
                value:     this._title
            }
        );
    }
};
