/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../dispatcher').dispatcher;
const Component  = require('./Component').Component;
const Tabs       = require('./Tabs').Tabs;

exports.TabPanel = class extends Component {
    constructor(opts) {
        opts.baseClassName = 'tab-panels';
        super(opts);
        this._containerIdsForForm = opts.containerIdsForForm;
        this._settings            = opts.settings;
        this._getDataProvider     = opts.getDataProvider;
        this._getFormPath         = opts.getFormPath;
        this._design              = opts.design;
        this._containerIds        = opts.containerIds;
        this._panelConstructor    = opts.panelConstructor || 'div';
        this._panelOpts           = opts.panelOpts || {};
        this._width               = opts.width     || 128;
        this._height              = opts.height    ||  80;
        this._children            = opts.children  || [];
        this._tabs                = opts.tabs;
        this._panels              = [];
        this._active              = 0;
        this._onChange            = opts.onChange;
        this._events              = [];
        this.initDOM(opts.parentNode);
    }

    initPanels() {
        this._panels.length = 0;
        let children = [];
        this._tabs.forEach((tab, index) => {
            let opts = Object.assign({}, this._panelOpts);
            opts.type                = this._panelConstructor;
            opts.containerIdsForForm = this._containerIdsForForm;
            opts.getDataProvider     = this._getDataProvider;
            opts.getFormPath         = this._getFormPath;
            opts.settings            = this._settings;
            opts.design              = this._design;
            opts.containerId         = this._containerIds ? this._containerIds[index] : null;
            opts.id                  = this.addPanel.bind(this);
            opts.className           = 'tab-panel' + ((index === this._active) ? ' visible' : '');
            opts.children            = this._children[index] || [];
            children.push(opts);
        });
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
                className: this.getClassName(),
                children: [
                    {
                        type:    Tabs,
                        ui:      this._ui,
                        uiId:    this._uiId,
                        ref:     this.setRef('tabs'),
                        tabs:    this._tabs,
                        active:  this._active,
                        onClick: this.onClickTab.bind(this)
                    }
                ].concat(this.initPanels())
            }
        );
    }

    remove() {
        let events = this._events;
        while (events.length) {
            events.pop()();
        }
        super.remove();
    }

    addPanel(panel) {
        this._panels.push(panel);
    }

    addTab() {
        let opts = Object.assign({}, this._panelOpts);
        opts.panel     = true;
        opts.type      = this._panelConstructor;
        opts.design    = this._design;
        opts.id        = this.addPanel.bind(this);
        opts.className = 'tab-panel';
        this.create(this._element, opts);
        let active = this._tabs.length - 1;
        this._refs.tabs.setActiveTab(this._tabs[active], '');
        this.onClickTab(active);
        return this;
    }

    onClickTab(index) {
        this._active = index;
        this._panels.forEach((panel, i) => {
            let className = 'tab-panel' + ((i === index) ? ' visible' : '');
            if (typeof panel.setClassName === 'function') {
                panel.setClassName(className);
            } else {
                panel.className = className;
            }
        });
        this._onChange && this._onChange(index);
    }

    onEvent(opts) {
        let element = this._element;
        let refs    = this._refs;
        if ('width' in opts) {
            element.style.width = Math.max(opts.width, 128) + 'px';
        }
        if ('height' in opts) {
            element.style.height = Math.max(opts.height, 80) + 'px';
        }
        if ('tabs' in opts) {
            let tabCount = this._tabs.length;
            this._tabs = opts.tabs;
            refs.tabs.setTabs(opts.tabs);
            if (opts.tabs.length > tabCount) {
                this.addTab();
            } else if (opts.tabs.length < tabCount) {
                this._panels.pop().remove();
            }
            this.onClickTab(this._panels.length - 1);
        }
        if ('tab' in opts) {
            this.onAddTabComponent(opts.tab);
        }
        super.onEvent(opts);
    }

    onAddTabComponent(opts) {
        this._tabs.push(opts.tab);
        this._refs.tabs.setTabs(this._tabs);
        this
            .addTab()
            .onClickTab(this._active);
    }

    getActive() {
        return this._active;
    }
};

exports.Component = exports.TabPanel;
