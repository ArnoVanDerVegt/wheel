/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const DOMNode           = require('../../lib/dom').DOMNode;
const Record            = require('../../compiler/types/Record').Record;
const $                 = require('../../program/commands');
const VarViewNumber     = require('./components/VarViewNumber').VarViewNumber;
const VarViewString     = require('./components/VarViewString').VarViewString;
const VarViewRecord     = require('./components/VarViewRecord').VarViewRecord;
const RecordTreeBuilder = require('./tree/RecordTreeBuilder').RecordTreeBuilder;
const ArrayTreeBuilder  = require('./tree/ArrayTreeBuilder').ArrayTreeBuilder;

exports.Vars = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._ui                     = opts.ui;
        this._global                 = opts.global;
        this._vm                     = null;
        this._scope                  = null;
        this._elementsByVarName      = {};
        this._varViewRecordByVarName = {};
        this._varViewArrayByVarName  = {};
        this.initDOM(opts.parentNode);
        opts.id && opts.id(this);
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                id:        this.setElement.bind(this),
                className: 'vars'
            }
        );
    }

    setVarElement(element, vr) {
        this._elementsByVarName[vr.getName()] = {element: element, vr: vr};
    }

    setElement(element) {
        this._element = element;
    }

    clearElement(element) {
        while (element.childNodes.length) {
            element.removeChild(element.childNodes[0]);
        }
    }

    updateDOM(scope) {
        let vars = scope.getVars();
        let dom  = {
                type: 'table',
                children: [
                    {
                        type: 'tr',
                        children: [
                            {type: 'th', innerHTML: 'Name'},
                            {type: 'th', innerHTML: 'Type'},
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
        vars.forEach(
            function(vr) {
                if (vr.getName().substr(0, 1) === '!') {
                    return;
                }
                let type = vr.getType();
                dom.children[1].children.push({
                    type: 'tr',
                    children: [
                        {type: 'td', innerHTML: vr.getName()},
                        {type: 'td', innerHTML: type.getName ? type.getName() : type},
                        {type: 'td', innerHTML: vr.getOffset(), className: 'offset'},
                        {type: 'td', id: function(element) { this.setVarElement(element, vr); }.bind(this)}
                    ]
                });
            },
            this
        );
        this.create(this._element, dom);
    }

    updateNumber(elementByVarName, vr, baseOffset) {
        let data = this._vm.getVMData().getData();
        if (vr.getArraySize() === false) {
            this.clearElement(elementByVarName.element);
            new VarViewNumber({
                ui:         this._ui,
                data:       data,
                baseOffset: baseOffset,
                parentNode: elementByVarName.element,
                vr:         vr
            });
        } else {
            let varViewArrayByVarName = this._varViewArrayByVarName;
            let name                  = vr.getName();
            let tree                  = this._arrayTreeBuilder.build(vr, baseOffset);
            if (name in varViewArrayByVarName) {
                varViewArrayByVarName[name].updateTree(tree);
            } else {
                this.clearElement(elementByVarName.element);
                new VarViewNumber({
                    id: function(element) {
                        varViewArrayByVarName[name] = element;
                    },
                    ui:         this._ui,
                    tree:       tree,
                    data:       data,
                    baseOffset: baseOffset,
                    parentNode: elementByVarName.element,
                    vr:         vr
                });
            }
        }
    }

    updateString(elementByVarName, vr, baseOffset) {
        let data = this._vm.getVMData().getData();
        if (vr.getArraySize() === false) {
            this.clearElement(elementByVarName.element);
            new VarViewString({
                ui:         this._ui,
                stringList: this._vm.getVMData().getStringList(),
                data:       data,
                baseOffset: baseOffset,
                parentNode: elementByVarName.element,
                vr:         vr
            });
        } else {
            let varViewArrayByVarName = this._varViewArrayByVarName;
            let name                  = vr.getName();
            let tree                  = this._arrayTreeBuilder.build(vr, baseOffset);
            if (name in varViewArrayByVarName) {
                varViewArrayByVarName[name].updateTree(tree);
            } else {
                this.clearElement(elementByVarName.element);
                new VarViewString({
                    id: function(element) {
                        varViewArrayByVarName[name] = element;
                    },
                    ui:         this._ui,
                    stringList: this._vm.getVMData().getStringList(),
                    tree:       tree,
                    data:       data,
                    baseOffset: baseOffset,
                    parentNode: elementByVarName.element,
                    vr:         vr
                });
            }
        }
    }

    updateRecord(elementByVarName, vr, baseOffset) {
        let data                   = this._vm.getVMData().getData();
        let varViewRecordByVarName = this._varViewRecordByVarName;
        let name                   = vr.getName();
        let tree                   = this._recordTreeBuilder.build(vr, baseOffset);
        if (name in varViewRecordByVarName) {
            varViewRecordByVarName[name].updateTree(tree);
        } else {
            this.clearElement(elementByVarName.element);
            new VarViewRecord({
                id: function(element) {
                    varViewRecordByVarName[name] = element;
                },
                ui:         this._ui,
                tree:       tree,
                data:       data,
                baseOffset: baseOffset,
                parentNode: elementByVarName.element,
                vr:         vr
            });
        }
    }

    updateValues() {
        let data              = this._vm.getVMData().getData();
        let stringList        = this._vm.getVMData().getStringList();
        let elementsByVarName = this._elementsByVarName;
        let baseOffset        = this._global ? 0 : data[$.REG_STACK];
        this._recordTreeBuilder = new RecordTreeBuilder(data, stringList);
        this._arrayTreeBuilder  = new ArrayTreeBuilder(data, stringList);
        this._scope.getVars().forEach(
            function(vr, index) {
                let tree;
                let name             = vr.getName();
                let elementByVarName = elementsByVarName[name];
                if (!elementByVarName) {
                    return;
                }
                if (vr.getType() === 'number') {
                    this.updateNumber(elementByVarName, vr, baseOffset);
                } else if (vr.getType() === 'string') {
                    this.updateString(elementByVarName, vr, baseOffset);
                } else if (vr.getType() instanceof Record) {
                    this.updateRecord(elementByVarName, vr, baseOffset);
                }
            },
            this
        );
    }

    updateScope(scope) {
        if (this._global) {
            scope = scope.getParentScope();
        }
        if (!this._scope || (this._scope.getName() !== scope.getName())) {
            this._elementByVarName       = {};
            this._varViewRecordByVarName = {};
            this._scope                  = scope;
            this.updateDOM(scope);
        }
        this.updateValues();
    }

    updateVM(vm) {
        this._vm = vm;
        return this;
    }

    update(breakpoint) {
        this
            .updateVM(breakpoint.vm)
            .updateScope(breakpoint.scope);
    }
};
