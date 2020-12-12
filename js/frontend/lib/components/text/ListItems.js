/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../../dispatcher').dispatcher;
const Component  = require('../component/Component').Component;

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
                id:        this.setElement.bind(this),
                className: this.getClassName(),
                style:     this.applyStyle({}, this._style)
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
                type:      'ol',
                className: this.getClassName(),
                children:  children
            }
        );
    }

    onEvent(opts) {
        if ('items' in opts) {
            this.setItems(opts.items);
        }
        if ('clear' in opts) {
            this.setItems([]);
        }
        if ('item' in opts) {
            this._items.push(opts.item);
            this.setItems(this._items);
        }
        super.onEvent(opts);
        this.applyStyle(this._element.style, this._style);
    }
};

exports.Component = exports.ListItems;
