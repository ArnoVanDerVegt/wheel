/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const Menu    = require('./Menu').Menu;
const DOMNode = require('../dom').DOMNode;

exports.MainMenuItem = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._platform    = opts.platform;
        this._withCheck   = opts.withCheck;
        this._className   = opts.className;
        this._mainMenu    = opts.mainMenu;
        this._focussed    = false;
        this._menu        = null;
        this._menuVisible = false;
        this._title       = opts.title;
        this._width       = opts.width;
        this._items       = opts.items;
        this._tabIndex    = opts.tabIndex;
        this._onLeftMenu  = opts.onLeftMenu;
        this._onRightMenu = opts.onRightMenu;
        this._ui          = opts.ui;
        this._uiId        = opts.uiId || 1;
        this._ui.addEventListener('Global.UIId', this, this.onGlobalUIId);
        this.initDOM(opts.parentNode);
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                id:        this.setMainMenuItem.bind(this),
                className: 'main-menu-item',
                children: [
                    {
                        id:        this.setMenuItemElement.bind(this),
                        type:      'a',
                        tabIndex:  this._tabIndex,
                        href:      '#',
                        children:  this.getTitleElements(this._title)
                    },
                    {
                        id:        this.setMenuElement.bind(this),
                        type:      Menu,
                        ui:        this._ui,
                        platform:  this._platform,
                        className: this._className,
                        width:     this._width,
                        menuItem:  this,
                        withCheck: this._withCheck,
                        items:     this._items
                    }
                ]
            }
        );
    }

    getTitleElements(title) {
        let children = [];
        let i        = title.indexOf('^');
        let left     = title.substr(0, i);
        if (left !== '') {
            children.push({
                type:      'span',
                innerHTML: left
            });
        }
        let hotkey = title.substr(i + 1, 1);
        children.push({
            type:      'span',
            className: 'hotkey',
            innerHTML: hotkey
        });
        this._hotkey = hotkey;
        let right = title.substr(i + 2, title.length - i - 2);
        if (right !== '') {
            children.push({
                type:      'span',
                innerHTML: right
            });
        }
        return children;
    }

    setMenuItemElement(element) {
        this._menuItemElement = element;
        element.addEventListener('focus',     this.onFocus.bind(this));
        element.addEventListener('blur',      this.onBlur.bind(this));
        element.addEventListener('keydown',   this.onKeyDown.bind(this));
        element.addEventListener('mousedown', this.onCancelEvent.bind(this));
        element.addEventListener('click',     this.onCancelEvent.bind(this));
    }

    setMainMenuItem(element) {
        this._mainMenuItemElement = element;
        element.addEventListener('mousemove', this.onMouseMove.bind(this));
        element.addEventListener('mouseout',  this.onMouseOut.bind(this));
    }

    setMenuElement(element) {
        this._menuElement = element;
    }

    getMenu() {
        return this._menu;
    }

    setMenu(menu) {
        this._menu = menu;
    }

    getHotkey() {
        return this._hotkey.toLowerCase();
    }

    setMenuVisible(visible) {
        if (this._menuVisible === visible) {
            return;
        }
        this._menuVisible = visible;
        let element = this._mainMenuItemElement;
        if (visible) {
            element.className = this.addClassName(element.className, 'visible');
        } else {
            element.className = this.removeClassName(element.className, 'visible');
        }
    }

    setDisabled(disabled) {
        this._menuItemElement.tabIndex = disabled ? -1 : this._tabIndex;
    }

    onGlobalUIId() {
        if (this._uiId === this._ui.getActiveUIId()) {
            if (!this._disabled) {
                this._menuItemElement.disabled = '';
            }
        } else {
            this._menuItemElement.disabled = 'disabled';
        }
    }

    onMouseMove(event) {
        let className = event.target.className || '';
        if ((className.indexOf('separator') !== -1) || (className.indexOf('disabled') !== -1)) {
            this.setMenuVisible(true);
            return;
        }
        if (!this._menuVisible) {
            if (!this._focussed) {
                this._focussed = true;
                this._menuItemElement.focus();
            }
            this._mainMenu.hideAllMenus();
            this.setMenuVisible(true);
        }
    }

    onMouseOut() {
        this._focussed = false;
        this.setMenuVisible(false);
    }

    onFocus() {
        this._mainMenu.hideAllMenus();
        this.setMenuVisible(true);
        if (!this._focussed) {
            this._menu.setFirstActive();
        }
        this._focussed = true;
    }

    onBlur() {
        this._focussed = false;
        this.setMenuVisible(false);
    }

    onKeyDown(event) {
        switch (event.keyCode) {
            case 13: // Enter
                this._menu.apply();
                this._focussed = false;
                this.setMenuVisible(false);
                break;
            case 27: // Escape
                this._focussed = false;
                this.setMenuVisible(false);
                break;
            case 37: // Left
                this._onLeftMenu(this);
                break;
            case 38: // Up
                this._menu.setPrevActive();
                break;
            case 39: // Right
                this._onRightMenu(this);
                break;
            case 40: // Down
                this._menu.setNextActive();
                break;
        }
    }

    focus() {
        this._menuItemElement.focus();
        this.setMenuVisible(true);
    }
};
