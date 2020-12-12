const Component = require('../component/Component').Component;
const TreeNode  = require('./TreeNode').TreeNode;

exports.Tree = class extends Component {
    constructor(opts) {
        super(opts);
        this._baseClassName = 'tree';
        this._nodeByPath    = {};
        this.initDOM(opts.parentNode);
        opts.tree && this.initTree(opts.tree);
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                ref:       this.setRef('root'),
                className: this.getClassName()
            }
        );
    }

    initTree(tree) {
        this.create(
            this._refs.root,
            {
                type:       TreeNode,
                tree:       tree,
                parentTree: this,
                indent:     1,
                path:       'root'
            }
        );
    }

    addNode(path, node) {
        this._nodeByPath[path] = node;
    }

    updateNode(node, path) {
        if (path in this._nodeByPath) {
            this._nodeByPath[path].setTitle(node.title);
        }
        let children = node.children;
        if (children) {
            for (let i = 0; i < children.length; i++) {
                this.updateNode(children[i], path + '.' + i);
            }
        }
    }

    update(tree) {
        this.updateNode(tree, 'root');
    }
};
