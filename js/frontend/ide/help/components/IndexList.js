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
        this._device = opts.device;
        this.initDOM(opts.parentNode);
    }

    initDOM(parentNode) {
        let deviceChildren = [];
        if (this._device) {
            this._device.split(',').forEach((device) => {
                if (!device) {
                    return;
                }
                deviceChildren.push({type: 'span', className: 'no-select device ' + device.toLowerCase(), innerHTML: device});
            });
        }
        this.create(
            parentNode,
            {
                id:        this.setElement.bind(this),
                className: 'link',
                children: [
                    {
                        type:      'span',
                        className: 'no-select',
                        innerHTML: this._title
                    }
                ].concat(deviceChildren)
            }
        );
    }

    setElement(element) {
        element.addEventListener(
            'click',
            () => {
                this._dialog.onShowFileIndex(this._index);
            }
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
                className: 'flt third',
                children: [
                    {
                        type:      H,
                        size:      '3',
                        className: 'no-select',
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
                            index:  helpFile.index,
                            device: helpFile.device
                        }
                    ]
                });
            },
            this
        );
        this.create(parentNode, node);
    }
};
