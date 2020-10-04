/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
/* istanbul ignore next */
const DOMUtils = class {
        attachEvent(querySelector, event, callback) {
            let element = document.querySelector(querySelector);
            element && element.addEventListener(event, callback);
        }

        removeClass(element, className) {
            let c     = element.className || '';
            let items = c.split(' ');
            c = '';
            items.forEach((item) => {
                if (item !== className) {
                    c += item + ' ';
                }
            });
            element.className = c.trim();
        }
    };

exports.DOMUtils = DOMUtils;

/* istanbul ignore next */
const DOMNode = class extends DOMUtils {
    constructor(opts) {
        super(opts);
        this._refs = {};
        if (opts && (typeof opts.ref === 'function')) {
            opts.ref(this);
        }
    }

    create(parentNode, node, setAttribute) {
        let type    = node.type || 'div';
        let domNode = null;
        if (typeof type === 'string') {
            domNode = document.createElement(type);
            for (let i in node) {
                switch (i) {
                    case 'ref':
                        if (typeof node.ref === 'function') {
                            node.ref(domNode);
                        } else if (node.ref) {
                            throw new Error('ref ' + node.ref +  ' is not a function.');
                        }
                        break;
                    case 'children':
                    case 'type':
                        if (type === 'svg') {
                            setAttribute = true;
                        }
                        break;
                    case 'inputType':
                        domNode.type = node[i];
                        break;
                    case'id':
                        if (typeof node.id === 'function') {
                            node.id(domNode);
                        } else {
                            domNode.id = node.id;
                        }
                        break;
                    case 'style':
                        for (let j in node.style) {
                            domNode.style[j] = node.style[j];
                        }
                        break;
                    default:
                        if (setAttribute) {
                            domNode.setAttribute(i, node[i]);
                        } else {
                            domNode[i] = node[i];
                        }
                        break;
                }
            }
            if (parentNode) {
                parentNode.appendChild(domNode);
            }
            let children = node.children || [];
            children.forEach(
                function(child, index) {
                    if (child !== null) {
                        this.create(domNode, child, setAttribute);
                    }
                },
                this
            );
        } else {
            node.parentNode = parentNode;
            node._node      = new type(node);
        }
        return domNode;
    }

    clear() {
        let element = this._element;
        while (element.parentNode.childNodes.length) {
            element.parentNode.removeChild(element.parentNode.childNodes[0]);
        }
    }

    hide() {
        this._element.style.display = 'none';
    }

    show() {
        this._element.style.display = 'block';
    }

    removeClassName(className, removeClassName) {
        let classNames = className.split(' ');
        let result     = '';
        for (let i = 0; i < classNames.length; i++) {
            if (classNames[i] !== removeClassName) {
                result += ' ' + classNames[i];
            }
        }
        return result.trim();
    }

    addClassName(className, addClassName) {
        let classNames = className.split(' ');
        for (let i = 0; i < classNames.length; i++) {
            if (classNames[i] === addClassName) {
                return className;
            }
        }
        return (className + ' ' + addClassName).trim();
    }

    onCancelEvent(event) {
        event.stopPropagation();
        event.preventDefault();
        return this;
    }

    setRef(id) {
        return (element) => {
            this._refs[id] = element;
        };
    }

    getRefs() {
        return this._refs;
    }

    getElementPosition(element) {
        if (!element) {
            element = this._element;
        }
        let offsetX = element.offsetLeft;
        let offsetY = element.offsetTop;
        let parent  = element.offsetParent;
        let matrix;
        let computedStyle;
        while (parent) {
            if (typeof WebKitCSSMatrix === 'undefined') {
                matrix        = {m41: 0, m42: 0};
            } else {
                computedStyle = window.getComputedStyle(parent);
                matrix        = new WebKitCSSMatrix(computedStyle.webkitTransform);
            }
            offsetX += matrix.m41 + parent.offsetLeft;
            offsetY += matrix.m42 + parent.offsetTop - parent.scrollTop;
            parent = parent.offsetParent;
        }
        return {x: offsetX, y: offsetY};
    }
};

exports.DOMNode = DOMNode;
