const Tree    = require('../../../lib/components/tree/Tree').Tree;
const VarView = require('./VarView').VarView;
const getSpan = require('../spans').getSpan;

exports.VarViewString = class extends VarView {
    constructor(opts) {
        super(opts);
        this._stringList = opts.stringList;
    }

    initDOM(parentNode) {
        let vr         = this._vr;
        let baseOffset = this._baseOffset;
        let offset     = baseOffset + (vr.getPointer() ? this._data[vr.getOffset()] : vr.getOffset());
        let arraySize  = vr.getArraySize();
        let node       = {
                className: 'wheel',
                children:  []
            };
        if (arraySize === false) {
            node.innerHTML = getSpan('"' + this._stringList[this.getValue(offset)] + '"', 'string');
        } else {
            node.children.push({
                ref:  this.setRef('tree'),
                type: Tree,
                ui:   this._ui,
                tree: this._tree
            });
        }
        this.create(parentNode, node);
    }

    updateTree(tree) {
        this._refs.tree.update(tree);
    }
};
