/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const DOMNode = require('../../../lib/dom').DOMNode;

exports.Container = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._firstChild = opts.firstChild || 0;
        this._ui         = opts.ui;
        this._uiId       = opts.uiId;
        this.initDOM(opts.parentNode);
    }

    clear() {
        let childNodes = this._refs.container.childNodes;
        while (childNodes.length > this._firstChild) {
            let childNode = childNodes[childNodes.length - 1];
            childNode.parentNode.removeChild(childNode);
        }
        return this;
    }

    setVisible(visible) {
        this._refs.container.style.display = visible ? 'block' : 'none';
    }
};
