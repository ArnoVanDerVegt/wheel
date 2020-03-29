/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../dispatcher').dispatcher;
const Component  = require('./Component').Component;
const Tabs       = require('./Tabs').Tabs;

exports.TabPanel = class extends Component {
    constructor(opts) {
        super(opts);
        this._panelConstructor = opts.panelConstructor || 'div';
        this._panelOpts        = opts.panelOpts || {};
        this._tabs             = opts.tabs;
        this._width            = opts.width  || 128;
        this._height           = opts.height ||  80;
        this._panels           = [];
        this._active           = 0;
        this.initDOM(opts.parentNode);
    }

    initPanels() {
        this._panels.length = 0;
        let children = [];
        this._tabs.forEach(
            function(tab, index) {
                let opts = Object.assign({}, this._panelOpts);
                opts.type      = this._panelConstructor;
                opts.id        = this.addPanel.bind(this);
                opts.className = 'tab-panel' + ((index === this._active) ? ' visible' : '');
                children.push(opts);
            },
            this
        );
        return children;
    }

    initDOM(parentNode) {
        let style = this._style || {};
        style.width  = this._width  + 'px';
        style.height = this._height + 'px';
        this.create(
            parentNode,
            {
                id:        this.setElement.bind(this),
                style:     style,
                className: 'tab-panels',
                children: [
                    {
                        type:    Tabs,
                        ui:      this._ui,
                        ref:     this.setRef('tabs'),
                        tabs:    this._tabs,
                        active:  this._active,
                        onClick: this.onClickTab.bind(this)
                    }
                ].concat(this.initPanels())
            }
        );
    }

    addPanel(panel) {
        this._panels.push(panel);
    }

    remove() {
        super.remove();
        this._element.parentNode.removeChild(this._element);
    }

    onClickTab(index) {
        this._active = index;
        this._panels.forEach(function(panel, i) {
            let className = 'tab-panel' + ((i === index) ? ' visible' : '');
            if (typeof panel.setClassName === 'function') {
                panel.setClassName(className);
            } else {
                panel.className = className;
            }
        });
    }

    onEvent(opts) {
        let element = this._element;
        let refs    = this._refs;
        if ('x' in opts) {
            element.style.left = opts.x + 'px';
        }
        if ('y' in opts) {
            element.style.top = opts.y + 'px';
        }
        if ('width' in opts) {
            element.style.width = Math.max(opts.width, 128) + 'px';
        }
        if ('height' in opts) {
            element.style.height = Math.max(opts.height, 80) + 'px';
        }
        if ('pointerEvents' in opts) {
            element.style.pointerEvents = opts.pointerEvents;
        }
        if ('tabs' in opts) {
            this._refs.tabs.setTabs(opts.tabs);
        }
    }
};
