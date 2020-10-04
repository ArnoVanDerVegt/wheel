/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher   = require('../../../../lib/dispatcher').dispatcher;
const DOMNode      = require('../../../../lib/dom').DOMNode;

exports.Step = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._dialog     = opts.dialog;
        this._ui         = opts.ui;
        this._uiId       = opts.uiId;
        this._parentNode = opts.parentNode;
        this._visible    = opts.visible;
        this._settings   = opts.settings;
        opts.id(this);
        this.initDOM(opts.parentNode);
    }

    initDOM(parentNode) {
        let content = this.initContent();
        content.ref   = this.setRef('content');
        content.style = {display: this._visible ? 'block' : 'none'};
        this.create(parentNode, content);
    }

    reset() {
    }

    update() {
        return this;
    }

    validate() {
        return true;
    }

    show() {
        this._visible                    = true;
        this._refs.content.style.display = 'block';
    }

    hide() {
        this._visible                    = false;
        this._refs.content.style.display = 'none';
    }
};
