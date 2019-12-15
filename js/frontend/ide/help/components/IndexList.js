/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const DOMNode = require('../../../lib/dom').DOMNode;
const H       = require('../../../lib/components/basic/H').H;

class HelpLink extends DOMNode {
    constructor(opts) {
        super(opts);
        this._dialog = opts.dialog;
        this._title  = opts.title;
        this._index  = opts.index;
        this.initDOM(opts.parentNode);
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                id:        this.setElement.bind(this),
                type:      'span',
                className: 'link',
                innerHTML: this._title
            }
        );
    }

    setElement(element) {
        element.addEventListener(
            'click',
            (function() {
                this._dialog.onShowFileIndex(this._index);
            }).bind(this)
        );
    }
}

exports.IndexList = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._dialog    = opts.dialog;
        this._title     = opts.title;
        this._helpFiles = opts.helpFiles;
        this._helpFiles.sort();
        this.initDOM(opts.parentNode);
    }

    initDOM(parentNode) {
        let node = {
                className: 'quarter',
                children: [
                    {
                        type:      H,
                        size:      '3',
                        innerHTML: this._title
                    },
                    {
                        type:      'ul',
                        children:  []
                    }
                ]
            };
        this._helpFiles.forEach(
            function(helpFile) {
                node.children[1].children.push({
                    type: 'li',
                    children: [
                        {
                            type:   HelpLink,
                            dialog: this._dialog,
                            title:  helpFile.name,
                            index:  helpFile.index
                        }
                    ]
                });
            },
            this
        );
        this.create(parentNode, node);
    }
};
