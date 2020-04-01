/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher  = require('../dispatcher').dispatcher;
const DOMNode     = require('../dom').DOMNode;
const ContextMenu = require('./ContextMenu').ContextMenu;

class Tab extends DOMNode {
    constructor(opts) {
        super(opts);
        this._tabs    = opts.tabs;
        this._element = null;
        this._focus   = false;
        this._title   = opts.title;
        this._meta    = opts.meta;
        this._onClick = opts.onClick;
        this._onClose = opts.onClose;
        this.initDOM(opts.parentNode);
    }

    initDOM(parentNode) {
        let children = [
                {
                    id:        this.setTitleElement.bind(this),
                    type:      'input',
                    inputType: 'button',
                    className: 'title',
                    title:     this._meta,
                    value:     this._title
                }
            ];
        if (this._onClose) {
            children.push({
                id:        this.setCloseElement.bind(this),
                type:      'input',
                inputType: 'button',
                className: 'close',
                value:     '✖'
            });
        }
        this.create(
            parentNode,
            {
                id:        this.setElement.bind(this),
                className: 'tab',
                children:  children
            }
        );
    }

    remove() {
        this._element.parentNode.removeChild(this._element);
    }

    getTitle() {
        return this._title;
    }

    getMeta() {
        return this._meta || '';
    }

    setElement(element) {
        this._element = element;
    }

    setTitleAndMeta(title, meta) {
        this._title              = title;
        this._meta               = meta;
        this._titleElement.value = title;
        this._titleElement.title = meta;
    }

    setTitleElement(element) {
        this._titleElement = element;
        element.addEventListener('focus',       this.onFocusTitle.bind(this));
        element.addEventListener('blur',        this.onBlurTitle.bind(this));
        element.addEventListener('click',       this.onClick.bind(this));
        element.addEventListener('mousedown',   this.onCancelEvent.bind(this));
        element.addEventListener('mouseup',     this.onCancelEvent.bind(this));
        element.addEventListener('contextmenu', this.onContextMenu.bind(this));
    }

    setCloseElement(element) {
        this._closeElement = element;
        element.addEventListener('focus',     this.onFocusClose.bind(this));
        element.addEventListener('blur',      this.onBlurClose.bind(this));
        element.addEventListener('click',     this.onClickClose.bind(this));
        element.addEventListener('mousedown', this.onCancelEvent.bind(this));
    }

    setActive(active) {
        this._element.className = 'tab' + (active ? ' active' : '');
    }

    setTabIndex(tabIndex) {
        this._titleElement.tabIndex = tabIndex;
        if (this._closeElement) {
            this._closeElement.tabIndex = tabIndex + 1;
        }
    }

    setDisabled(disabled) {
        this._titleElement.disabled = disabled ? 'disabled' : '';
        if (this._closeElement) {
            this._closeElement.disabled = disabled ? 'disabled' : '';
        }
    }

    onFocusTitle(event) {
        this._titleElement.className = 'title focus';
    }

    onBlurTitle(event) {
        this._titleElement.className = 'title';
    }

    onFocusClose(event) {
        this._closeElement.className = 'close focus';
    }

    onBlurClose(event) {
        this._closeElement.className = 'close';
    }

    onClick(event) {
        this.onCancelEvent(event);
        this._titleElement.focus();
        this._onClick(this._title, this._meta);
    }

    onContextMenu(event) {
        let contextMenu = this._tabs.getContextMenu();
        if (contextMenu) {
            contextMenu.show(event.pageX, event.pageY, this);
        }
        this.onCancelEvent(event);
    }

    onClickClose(event) {
        this.onCancelEvent(event);
        this._onClose(this._title, this._meta);
    }

    focus() {
        this._titleElement.focus();
    }
}

exports.Tabs = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._ui             = opts.ui;
        this._tabs           = [];
        this._active         = opts.active || 0;
        this._activeTab      = null;
        this._tabIndex       = opts.tabIndex;
        this._wrapperElement = null;
        this._tabsElement    = null;
        this._contextMenu    = null;
        this._ui             = opts.ui;
        this._uiId           = opts.uiId;
        this._onClick        = opts.onClick;
        this._onGlobalUIId   = this._ui.addEventListener('Global.UIId', this, this.onGlobalUIId);
        this.initDOM(opts.parentNode, opts.tabs || []);
        this.initContextMenu(opts.contextMenuOptions);
        (typeof opts.id === 'function') && opts.id(this);
    }

    initDOM(parentNode, tabs) {
        this.create(
            parentNode,
            {
                id:        this.setWrapperElement.bind(this),
                className: 'tabs',
                children: [
                    {
                        id:        this.setTabsElement.bind(this),
                        className: 'tabs-content'
                    }
                ]
            }
        );
        tabs.forEach(this.add, this);
        if (this._active) {
            this.setActiveTab(this._active.title, this._active.meta);
        }
        this.updateTabIndex();
    }

    initContextMenu(options) {
        if (!options) {
            return;
        }
        this._contextMenu = new ContextMenu({
            ui:         this._ui,
            parentNode: document.body,
            options:    options
        });
    }

    remove(title, meta) {
        meta || (meta = '');
        let tabs = this._tabs;
        for (let i = 0; i < tabs.length; i++) {
            let tab = tabs[i];
            if ((tab.getTitle() === title) && (tab.getMeta() === meta)) {
                tab.remove();
                tabs.splice(i, 1);
                return;
            }
        }
        this.updateTabIndex();
    }

    add(opts) {
        if (typeof opts === 'string') {
            opts = {
                title: opts
            };
        }
        let tabs  = this._tabs;
        let index = tabs.length;
        this._tabs.push(new Tab({
            tabs:       this,
            parentNode: this._tabsElement,
            title:      opts.title,
            meta:       opts.meta || '',
            onClose:    opts.onClose ?
                function(title, meta) {
                    opts.onClose(title, meta);
                } :
                false,
            onClick: (function(title, meta) {
                this.onClickTab(title, meta, index);
                opts.onClick && opts.onClick(title, meta);
            }).bind(this)
        }));
        if (this._tabs.length - 1 === this._active) {
            this.setActiveTab(opts.title, opts.meta);
        }
        this.updateTabIndex();
        return this;
    }

    onGlobalUIId() {
        this.updateTabIndex(this._ui.getActiveUIId() !== this._uiId);
    }

    onClickTab(title, meta, index) {
        this.setActiveTab(title, meta);
        this._onClick && this._onClick(index);
    }

    getContextMenu() {
        return this._contextMenu;
    }

    getActiveTab() {
        return this._activeTab;
    }

    setActiveTab(title, meta) {
        meta || (meta = '');
        this._tabs.forEach(
            function(tab) {
                let active = (tab.getTitle() === title) && (tab.getMeta() === meta);
                tab.setActive(active);
                if (active) {
                    this._activeTab = {title: title, meta: meta};
                }
            },
            this
        );
        return this;
    }

    setWrapperElement(element) {
        this._wrapperElement = element;
    }

    setTabsElement(element) {
        this._tabsElement = element;
    }

    getTabs() {
        return this._tabs;
    }

    setTabs(tabs) {
        let tabsElement = this._tabsElement;
        while (tabsElement.childNodes.length) {
            tabsElement.removeChild(tabsElement.childNodes[0]);
        }
        this._tabs = [];
        tabs.forEach(
            function(tab) {
                let opts = tab;
                if (typeof tab === 'string') {
                    opts = {
                        title: tab
                    };
                }
                opts.parentNode = tabsElement;
                this.add(opts);
            },
            this
        );
        return this;
    }

    renameTab(oldTitle, oldMeta, newTitle, newMeta) {
        oldMeta || (oldMeta = '');
        newMeta || (newMeta = '');
        this._tabs.forEach(
            function(tab) {
                if ((tab.getTitle() === oldTitle) && (tab.getMeta() === oldMeta)) {
                    tab.setTitleAndMeta(newTitle, newMeta);
                    let activeTab = this._activeTab;
                    if (activeTab && (activeTab.title === oldTitle) && (activeTab.meta  === oldMeta)) {
                        this._activeTab = {title: newTitle, meta: newMeta};
                    }
                }
            },
            this
        );
    }

    updateTabIndex(disabled) {
        let tabIndex = this._tabIndex;
        this._tabs.forEach(function(tab) {
            tab.setTabIndex(disabled ? -1 : tabIndex);
            tab.setDisabled(disabled);
            tabIndex += 2;
        });
    }

    focus() {
        this._tabs[0].focus();
        return this;
    }
};
