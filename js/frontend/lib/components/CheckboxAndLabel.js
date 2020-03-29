/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../dispatcher').dispatcher;
const Component  = require('./Component').Component;
const Checkbox   = require('./Checkbox').Checkbox;

exports.CheckboxAndLabel = class extends Component {
    constructor(opts) {
        super(opts);
        this._text    = opts.text;
        this._checked = !!opts.checked;
        this.initDOM(opts.parentNode);
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                id:        this.setElement.bind(this),
                style:     this._style || {},
                className: 'checkbox-and-label',
                children: [
                    {
                        type:    Checkbox,
                        ui:      this._ui,
                        ref:     this.setRef('checkbox'),
                        checked: this._checked
                    },
                    {
                        className: 'label',
                        ref:       this.setRef('text'),
                        innerHTML: this._text
                    }
                ]
            }
        );
    }

    remove() {
        super.remove();
        this._element.parentNode.removeChild(this._element);
    }

    onEvent(opts) {
        let element = this._element;
        let refs    = this._refs;
        if ('text' in opts) {
            this._text          = opts.text;
            refs.text.innerHTML = opts.text;
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
        if ('checked' in opts) {
            this._checked = opts.checked;
            refs.checkbox.setChecked(this._checked);
        }
    }
};
