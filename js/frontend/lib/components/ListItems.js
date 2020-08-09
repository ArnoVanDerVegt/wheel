/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../dispatcher').dispatcher;
const Component  = require('./Component').Component;

exports.ListItems = class extends Component {
    constructor(opts) {
        opts.baseClassName = 'list-items';
        super(opts);
        this._items = opts.items || [];
        this.initDOM(opts.parentNode);
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                className: this.getClassName(),
                id:        this.setElement.bind(this),
                style:     this._style
            }
        );
        this.setItems(this._items);
    }

    setItems(items) {
        this._items = items;
        let element    = this._element;
        let childNodes = element.childNodes;
        while (childNodes.length) {
            element.removeChild(childNodes[0]);
        }
        let children = [];
        items.forEach((item) => {
            children.push({
                type:      'li',
                innerHTML: item
            });
        });
        this.create(
            element,
            {
                type:      'ul',
                className: this.getClassName(),
                children:  children
            }
        );
    }

    onEvent(opts) {
        if ('items' in opts) {
            this.setItems(opts.items);
        }
        super.onEvent(opts);
    }
};

exports.Component = exports.ListItems;
