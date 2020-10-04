/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const DOMNode = require('../../lib/dom').DOMNode;
const $       = require('../../program/commands');

exports.Registers = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._vm              = null;
        this._elementsByIndex = [];
        this.initDOM(opts.parentNode);
        opts.id && opts.id(this);
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                id:        this.setElement.bind(this),
                className: 'flt max-w max-h vscroll registers'
            }
        );
        this.updateDOM();
    }

    setRegisterElement(element, index) {
        this._elementsByIndex[index] = {element: element, index: index};
    }

    setElement(element) {
        this._element = element;
    }

    updateDOM() {
        let dom = {
                type: 'table',
                children: [
                    {
                        type: 'tr',
                        children: [
                            {type: 'th', innerHTML: 'Name'},
                            {type: 'th', innerHTML: 'Offset'},
                            {type: 'th', innerHTML: 'Value'}
                        ]
                    },
                    {
                        type:     'tbody',
                        children: []
                    }
                ]
            };

        ['stack', 'src', 'dest', 'ptr', 'code', 'return', 'flags'].forEach(
            function(register, index) {
                dom.children[1].children.push({
                    type: 'tr',
                    children: [
                        {type: 'td', innerHTML: register},
                        {type: 'td', innerHTML: index},
                        {type: 'td', innerHTML: '', id: function(element) { this.setRegisterElement(element, index); }.bind(this)}
                    ]
                });
            },
            this
        );
        this.create(this._element, dom);
    }

    updateValues() {
        let elementsByIndex = this._elementsByIndex;
        let data            = this._vm.getVMData().getData();
        elementsByIndex.forEach(
            function(elementByIndex) {
                elementByIndex.element.innerHTML = data[elementByIndex.index] || 0;
            }
        );
    }

    update(info) {
        this._vm = info.vm;
        this.updateValues();
    }
};
