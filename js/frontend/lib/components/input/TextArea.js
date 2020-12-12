/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const TextInput  = require('./TextInput').TextInput;

exports.TextArea = class extends TextInput {
    constructor(opts) {
        opts.baseClassName = 'text-area';
        super(opts);
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                type:        'textarea',
                wrap:        'off',
                id:          this.setElement.bind(this),
                className:   this.getClassName(),
                style:       this.applyStyle({}, this._style),
                tabIndex:    this._tabIndex,
                value:       this._value,
            }
        );
    }
};
