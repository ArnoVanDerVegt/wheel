/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const DOMNode = require('../../dom').DOMNode;

exports.Table = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._head      = opts.head || [];
        this._body      = opts.body || [];
        this._className = opts.className || '';
        this.initDOM(opts.parentNode);
    }

    initDOM(parentNode) {
        let cols = 0;
        let node = {
                type:      'table',
                className: this._className,
                children:  []
            };
        if (this._head.length) {
            cols = this._head.length;
            let head = {
                    type:     'thead',
                    children: [
                        {
                            type:     'tr',
                            children: []
                        }
                    ]
                };
            this._head.forEach((h) => {
                head.children[0].children.push({
                    type:      'th',
                    innerHTML: h
                });
            });
            node.children.push(head);
        }
        if (this._body.length) {
            let body = {
                    type:     'tbody',
                    children: []
                };
            this._body.forEach((b) => {
                if (cols === 0) {
                    cols = b.length;
                }
                let row = {
                        type:     'tr',
                        children: []
                    };
                b.forEach((c) => {
                    c = c.trim();
                    if (c.substr(0, 1) === ':') {
                        row.children.push({
                            colSpan:   c.substr(1, 1),
                            type:      'td',
                            innerHTML: c.substr(2 - c.length)
                        });
                    } else if (cols && (b.length !== cols)) {
                        row.children.push({
                            colSpan:   cols,
                            type:      'td',
                            innerHTML: c
                        });
                    } else {
                        row.children.push({
                            type:      'td',
                            innerHTML: c
                        });
                    }
                });
                body.children.push(row);
            });
            node.children.push(body);
        }
        this.create(parentNode, node);
    }
};
