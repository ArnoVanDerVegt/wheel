const Tree    = require('../../../lib/components/tree/Tree').Tree;
const VarView = require('./VarView').VarView;

exports.VarViewRecord = class extends VarView {
    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                ref:       this.setRef('tree'),
                type:      Tree,
                ui:        this._ui,
                tree:      this._tree,
                className: 'wheel'
            }
        );
    }

    updateTree(tree) {
        this._refs.tree.update(tree);
    }
};
