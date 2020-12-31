/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const path       = require('../../../../shared/lib/path');
const dispatcher = require('../../dispatcher').dispatcher;
const Component  = require('../component/Component').Component;

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
        this.create(
            parentNode,
            {
                id:        this.setElement.bind(this),
                className: this.getClassName(),
                style:     this.applyStyle({}, this._style),
                children:  [{}]
            }
        );
    }
    onEvent(opts) {
        if ('icon' in opts) {
            this._baseClassName     = 'i i-' + opts.icon.toLowerCase();
            this._element.className = this.getClassName();
        }
        super.onEvent(opts);
        this.applyStyle(this._element.style, this._style);
    }
};

exports.Component = exports.Icon;
