/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../../lib/dispatcher').dispatcher;
const DOMNode    = require('../../lib/dom').DOMNode;
const tabIndex   = require('../tabIndex');

exports.Form = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this.initDOM(opts.parentNode);
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                ref:       this.setRef('container'),
                className: 'abs max-w max-h form-container',
                children:  []
            }
        );
    }

    initNode(component, element) {
        this._nameElement = element;
        element.addEventListener('click',       this.onClickComponent.bind(this, component));
        element.addEventListener('mouseup',     this.onCancelEvent.bind(this));
        element.addEventListener('mousedown',   this.onCancelEvent.bind(this));
        // | element.addEventListener('contextmenu', this.onContextMenu.bind(this));
        // | element.addEventListener('keydown',     this.onKeyDown.bind(this));
        // | element.addEventListener('focus',       this.onFocus.bind(this));
        // | element.addEventListener('blur',        this.onBlur.bind(this));
    }

    initTree(root) {
        let tree = {
                className: 'flt max-w',
                children:  []
            };
        const addNode = (node, depth) => {
                tree.children.push({
                    className: 'flt max-w component',
                    style: {
                        paddingLeft: depth + 'px'
                    },
                    children: [
                        (node.component.type ?
                            {
                                type:      'span',
                                className: 'flt icon component-' + node.component.type.toLowerCase()
                            } :
                            null),
                        (node.component.uid ?
                            {
                                type:      'a',
                                className: 'name flt' + (('hidden' in node.component) && node.component.hidden ? ' hidden' : ''),
                                id:        this.initNode.bind(this, node.component),
                                innerHTML: node.component.name,
                                style: {
                                    maxWidth: (256 - depth) + 'px'
                                }
                            } :
                            {
                                type:      'span',
                                className: 'flt',
                                innerHTML: node.component.name,
                                style: {
                                    maxWidth: (256 - depth) + 'px'
                                }
                            })
                    ]
                });
                if (node.children) {
                    node.children.forEach((childNode) => {
                        addNode(childNode, depth + 12);
                    });
                }
            };
        addNode(root, 8);
        this.create(this._refs.container, tree);
    }

    clear() {
        let childNodes = this._refs.container.childNodes;
        while (childNodes.length) {
            let childNode = childNodes[childNodes.length - 1];
            childNode.parentNode.removeChild(childNode);
        }
        return this;
    }

    setVisible(visible) {
        this._refs.container.style.display = visible ? 'block' : 'none';
    }

    setItems(items) {
        for (let i = 0; i < items.length; i++) {
            items[i] = items[i].component;
        }
        items.sort();
        let nodeById = {};
        nodeById[1] = {children: [], component: {name: 'Form'}};
        items.forEach((item) => {
            let node = {component: item, children: []};
            if ('parentId' in item) {
                nodeById[item.parentId].children.push(node);
            }
            if ('containerIds' in item) {
                item.containerIds.forEach((containerId, index) => {
                    let childNode = {children: [], component: {name: (index + 1) + ''}};
                    nodeById[containerId] = childNode;
                    node.children.push(childNode);
                });
            }
        });
        this
            .clear()
            .initTree(nodeById[1]);
    }

    onClickComponent(component, event) {
        this.onCancelEvent(event);
        dispatcher.dispatch('Properties.SelectComponent', component.id);
    }
};
