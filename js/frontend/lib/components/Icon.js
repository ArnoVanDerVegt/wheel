/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const path       = require('../path');
const dispatcher = require('../dispatcher').dispatcher;
const Component  = require('./Component').Component;

exports.Icon = class extends Component {
    constructor(opts) {
        opts.baseClassName = 'i i-' + (opts.className || 'icon').toLowerCase();
        opts.width         = 64;
        opts.height        = 64;
        delete opts.className;
        super(opts);
        this.initDOM(opts.parentNode);
    }

    initDOM(parentNode) {
        let style  = this._style || {};
        style.width  = this._width  + 'px';
        style.height = this._height + 'px';
        this.create(
            parentNode,
            {
                className: this.getClassName(),
                id:        this.setElement.bind(this),
                style:     style,
                children: [
                    {
                    }
                ]
            }
        );
    }
    onEvent(opts) {
        if ('icon' in opts) {
            this._baseClassName     = 'i i-' + opts.icon.toLowerCase();
            this._element.className = this.getClassName();
        }
        super.onEvent(opts);
    }
};

exports.Component = exports.Icon;
