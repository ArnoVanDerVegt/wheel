/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../../../lib/dispatcher').dispatcher;
const DOMNode    = require('../../../lib/dom').DOMNode;
const tabIndex   = require('../../tabIndex');
const Container  = require('./Container').Container;

exports.Form = class extends Container {
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
        element.addEventListener('keydown',     this.onKeyDown.bind(this, component));
        // | element.addEventListener('contextmenu', this.onContextMenu.bind(this));
        // | element.addEventListener('focus',       this.onFocus.bind(this));
        // | element.addEventListener('blur',        this.onBlur.bind(this));
    }

    initTree(root) {
        let tab  = tabIndex.PROPERTIES_CONTAINER;
        let tree = {
                className: 'flt max-w',
                children:  []
            };
        const addNode = (node, depth) => {
                if (node.component.uid) {
                    tab++;
                }
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
                                title:     node.component.name,
                                tabIndex:  tab,
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

    onKeyDown(component, event) {
        if (event.keyCode === 13) { // Enter...
            dispatcher.dispatch('Properties.SelectComponent', component.id);
        }
    }
};
