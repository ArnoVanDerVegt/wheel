/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../../../../lib/dispatcher').dispatcher;
const Editor     = require('../Editor').Editor;

exports.TextEditor = class extends Editor {
    constructor(opts) {
        super(opts);
        this._textAreaElement = null;
        this._onGlobalUIId    = dispatcher.on('Global.UIId', this, this.onGlobalUIId);
        this.initDOM(opts.parentNode);
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                ref:       this.setRef('wrapper'),
                className: 'text-wrapper',
                children: [
                    {
                        id:    this.setTextareaElement.bind(this),
                        type:  'textarea',
                        value: this._value
                    }
                ]
            }
        );
    }

    remove() {
        super.remove();
        this._onGlobalUIId();
    }

    show() {
        super.show();
        dispatcher.dispatch('Screen.Ready');
    }

    onGlobalUIId() {
        this._textAreaElement = (uiId.getActiveUIId() === 1) ? '' : 'disabled';
    }

    setTextareaElement(element) {
        this._textAreaElement = element;
    }

    getValue() {
        return this._textAreaElement.value;
    }

    setValue(value, reset) {
        this._textAreaElement.value = value;
    }
};
