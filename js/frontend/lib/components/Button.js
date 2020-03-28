/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../dispatcher').dispatcher;
const Component  = require('./Component').Component;

exports.Button = class extends Component {
    constructor(opts) {
        super(opts);
        this._icon          = opts.icon;
        this._baseClassName = (this._icon ? 'icon-' : ' ') + 'button ' + (this._icon ? this._icon : '');
        this.initDOM(opts.parentNode);
        if (opts.event) {
            dispatcher.on(opts.event, this, this.onEvent);
        }
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                id:        this.setElement.bind(this),
                className: this.getClassName(),
                type:      'input',
                inputType: 'button',
                tabIndex:  this._tabIndex,
                disabled:  this._disabled ? 'disabled' : '',
                value:     this._value || '',
                title:     this._title || '',
                style:     this._style || {}
            }
        );
    }

    onEvent(opts) {
        let element = this._element;
        if ('className' in opts) {
            this.setClassName(opts.className);
        }
        if ('hidden' in opts) {
            this.setHidden(opts.hidden);
        }
        if ('value' in opts) {
            this.setValue(opts.value);
        }
        if ('title' in opts) {
            this.setTitle(opts.title);
        }
        if ('disabled' in opts) {
            this._disabled    = opts.disabled;
            element.disabled  = opts.disabled ? 'disabled' : '';
            element.className = this.getClassName();
        }
        if ('x' in opts) {
            element.style.left = opts.x + 'px';
        }
        if ('y' in opts) {
            element.style.top = opts.y + 'px';
        }
        if ('pointerEvents' in opts) {
            element.style.pointerEvents = opts.pointerEvents;
        }
    }
};
