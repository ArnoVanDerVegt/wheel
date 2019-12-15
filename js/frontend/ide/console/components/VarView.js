const DOMNode = require('../../../lib/dom').DOMNode;

exports.VarView = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._elementByPath = {};
        this._tree          = opts.tree;
        this._ui            = opts.ui;
        this._data          = opts.data;
        this._baseOffset    = opts.baseOffset;
        this._vr            = opts.vr;
        this.initDOM(opts.parentNode);
        (typeof opts.id === 'function') && opts.id(this);
    }

    getValue(offset) {
        let value = this._data[offset];
        return (typeof value === 'number') ? value : '-';
    }

    initNodeLine(indent, title) {
        return {
            className: 'node-line',
            style:     {marginLeft: indent + 'px'},
            children: [
                {
                    type:      'span',
                    innerHTML: title
                }
            ]
        };
    }
};
