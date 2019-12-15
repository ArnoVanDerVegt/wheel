const DOMNode = require('../../dom').DOMNode;

const TRIANGLE_RIGHT = '▶';
const TRIANGLE_DOWN  = '▼';

const TreeNode = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._tree       = opts.tree;
        this._parentTree = opts.parentTree;
        this._path       = opts.path;
        this._open       = false;
        opts.parentTree.addNode(opts.path, this);
        this.initDOM(opts.parentNode, opts.tree, opts.indent);
    }

    initDOM(parentNode, treeNode, indent) {
        let children    = treeNode.children;
        let hasChildren = children && children.length;
        let node        = {
                className: 'node',
                children: [
                    {
                        className: 'node-title' + (hasChildren ? ' with-children' : ''),
                        id:        hasChildren ? this.setElement.bind(this) : null,
                        children: [
                            hasChildren ?
                                {
                                    ref:       this.setRef('triangle'),
                                    className: 'node-option',
                                    innerHTML: TRIANGLE_RIGHT
                                } :
                                null,
                            {
                                ref:       this.setRef('titleText'),
                                className: 'node-title-text',
                                innerHTML: treeNode.title
                            }
                        ]
                    }
                ]
            };
        if (hasChildren) {
            let domChildrenWrapper = {
                    style: {
                        paddingLeft: (indent * 8) + 'px',
                        display:     'none'
                    },
                    ref:       this.setRef('content'),
                    className: 'node-content',
                    children:  []
                };
            node.children.push(domChildrenWrapper);
            for (let i = 0; i < children.length; i++) {
                domChildrenWrapper.children.push({
                    type:       TreeNode,
                    parentTree: this._parentTree,
                    indent:     indent + 1,
                    tree:       children[i],
                    path:       this._path + '.' + i
                });
            }
        }
        this.create(parentNode, node);
    }

    setElement(element) {
        element.addEventListener('click', this.onClick.bind(this));
    }

    setTitle(title) {
        this._refs.titleText.innerHTML = title;
    }

    onClick(event) {
        this._open = !this._open;
        let refs = this._refs;
        if (this._open) {
            refs.content.style.display = 'block';
            refs.triangle.innerHTML    = TRIANGLE_DOWN;
        } else {
            refs.content.style.display = 'none';
            refs.triangle.innerHTML    = TRIANGLE_RIGHT;
        }
    }
};

exports.TreeNode = TreeNode;
