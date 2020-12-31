/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const DOMNode    = require('../../lib/dom').DOMNode;
const dispatcher = require('../../lib/dispatcher').dispatcher;

class MenuOption extends DOMNode {
    constructor(opts) {
        super(opts);
        this._platform    = opts.platform;
        this._menu        = opts.menu;
        this._withCheck   = opts.withCheck;
        this._checked     = opts.checked;
        this._element     = null;
        this._title       = opts.title;
        this._remark      = opts.remark || false;
        this._hotkey      = opts.hotkey;
        this._keyMetaDown = true;
        this._onClick     = opts.onClick;
        this._active      = false;
        this._enabled     = true;
        this._dispatch    = opts.dispatch;
        this._ui          = opts.ui;
        this._ui.addEventListener('Global.Key.Down', this, this.onGlobalKeyDown);
        this.initDOM(opts.parentNode);
        opts.menu.addMenuOption(this);
    }

    initDOM(parentNode) {
        let hotkey = null;
        if (this._hotkey) {
            let hotkeyTitle = '';
            this._hotkey.forEach(
                function(key) {
                    if (key === 'command') {
                        if (this._platform === 'darwin') {
                            hotkeyTitle += '&#8984;';
                        } else {
                            hotkeyTitle += 'Ctrl+';
                        }
                    } else {
                        hotkeyTitle += key;
                    }
                },
                this
            );
            hotkey = {
                type:      'span',
                className: 'hotkey',
                innerHTML: hotkeyTitle
            };
        }
        this.create(
            parentNode,
            {
                id:        this.setElement.bind(this),
                className: 'menu-option' +
                    (this._withCheck ? ' with-check'  : '') +
                    (this._remark    ? ' with-remark' : '') +
                    (this._checked   ? ' checked'     : ''),
                children: [
                    {
                        ref:       this.setRef('title'),
                        type:      'span',
                        className: 'title',
                        innerHTML: this._title
                    },
                    hotkey,
                    {
                        type:      'span',
                        ref:       this.setRef('break'),
                        innerHTML: this._remark ? '<br/>' : ''
                    },
                    this._remark ?
                        {
                            ref:       this.setRef('remark'),
                            className: 'flt maw-w menu-option-remark',
                            innerHTML: this._remark
                        } :
                        null
                ]
            }
        );
    }

    apply(event) {
        if (this._enabled) {
            this._dispatch && dispatcher.dispatch(this._dispatch, event);
            this._onClick  && this._onClick(event);
        }
    }

    updateClassName() {
        this._element.className = 'menu-option' +
            (this._enabled        ? ''             : ' disabled') +
            (this._withCheck      ? ' with-check'  : '') +
            (this._remark         ? ' with-remark' : '') +
            (this._checked        ? ' checked'     : '') +
            ((this._title === '') ? ' disabled'    : '');
    }

    setTitle(title) {
        this._title                = title;
        this._refs.title.innerHTML = title;
        return this;
    }

    setRemark(remark) {
        this._remark                = remark;
        this._refs.break.innerHTML  = remark ? '<br/>' : '';
        this._refs.remark.innerHTML = remark;
        return this;
    }

    setChecked(checked) {
        this._checked = checked;
        this.updateClassName();
        return this;
    }

    getEnabled() {
        return this._enabled;
    }

    setEnabled(enabled) {
        if (this._enabled !== enabled) {
            this._enabled = enabled;
            this.updateClassName();
        }
        return this;
    }

    setElement(element) {
        this._element = element;
        if (this._title === '') {
            return;
        }
        element.addEventListener(
            'mouseout',
            () => {
                this._menu.selectMenuOption(null);
            }
        );
        element.addEventListener(
            'mousemove',
            () => {
                this._menu.selectMenuOption(this);
            }
        );
        element.addEventListener(
            'mousedown',
            this.onCancelEvent.bind(this)
        );
        element.addEventListener(
            'click',
            (event) => {
                this.onCancelEvent(event);
                this.apply();
            }
        );
    }

    getActive() {
        return this._active;
    }

    setActive(active) {
        this._active = active;
        let element = this._element;
        if (active && this._enabled) {
            element.className = this.addClassName(element.className, 'active');
        } else {
            element.className = this.removeClassName(element.className, 'active');
        }
    }

    onGlobalKeyDown(event) {
        let key = (this._platform === 'darwin') ? this._ui.getKeyMetaDown() : this._ui.getKeyControlDown();
        if (!this._hotkey || !key) {
            return;
        }
        if (!this._enabled || (this._ui.getActiveUIId() !== 1)) {
            return;
        }
        key = String.fromCharCode(event.keyCode).toUpperCase();
        if (this._hotkey[1].toUpperCase() === key) {
            dispatcher.dispatch('Global.HotKey.Clear');
            this.apply(event);
        }
    }
}

class MenuSeparator extends DOMNode {
    constructor(opts) {
        super(opts);
        this._className = opts.className || '';
        this.initDOM(opts.parentNode);
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                className: 'flt max-w menu-option-separator ' + this._className,
                children: [
                    {
                        className: 'line'
                    }
                ]
            }
        );
    }
}

exports.Menu = class extends DOMNode {
    constructor(opts) {
        super(opts);
        if (opts.menuItem) {
            opts.menuItem.setMenu(this);
        }
        this._ui           = opts.ui;
        this._platform     = opts.platform;
        this._element      = null;
        this._className    = opts.className || false;
        this._withCheck    = opts.withCheck;
        this._withLeftSide = opts.withLeftSide;
        this._title        = opts.title;
        this._width        = opts.width;
        this._menuOptions  = [];
        this.initDOM(opts);
        (typeof opts.id === 'function') && opts.id(this);
    }

    initDOM(opts) {
        let children = [{className: 'left-side'}];
        opts.items.forEach(
            function(item) {
                if (item.title === '-') {
                    children.push({
                        type:      MenuSeparator,
                        className: item.className
                    });
                } else {
                    children.push({
                        type:      MenuOption,
                        ui:        this._ui,
                        menu:      this,
                        platform:  this._platform,
                        withCheck: this._withCheck,
                        title:     item.title,
                        remark:    item.remark,
                        hotkey:    item.hotkey,
                        dispatch:  item.dispatch,
                        onClick:   item.onClick
                    });
                }
            },
            this
        );
        this.create(
            opts.parentNode,
            {
                id:        this.setElement.bind(this),
                className: 'menu' + (this._className ? ' ' + this._className : ''),
                children:  children
            }
        );
    }

    addMenuOption(menuOption) {
        this._menuOptions.push(menuOption);
    }

    selectMenuOption(menuOption) {
        this._menuOptions.forEach((option) => {
            option.setActive(menuOption === option);
        });
    }

    setFirstActive() {
        let menuOptions = this._menuOptions;
        let found       = false;
        for (let i = 0; i < menuOptions.length; i++) {
            let menuOption = menuOptions[i];
            if (!found && menuOption.getEnabled()) {
                menuOption.setActive(true);
                found = true;
            } else {
                menuOption.setActive(false);
            }
        }
    }

    setLastActive() {
        let menuOptions = this._menuOptions;
        let found       = false;
        for (let i = menuOptions.length - 1; i >= 0; i--) {
            let menuOption = menuOptions[i];
            if (!found && menuOption.getEnabled()) {
                menuOption.setActive(true);
                found = true;
            } else {
                menuOption.setActive(false);
            }
        }
    }

    setPrevActive() {
        let menuOptions = this._menuOptions;
        let found       = false;
        let done        = false;
        for (let i = menuOptions.length - 1; i >= 0; i--) {
            let menuOption = menuOptions[i];
            if (menuOption.getActive()) {
                menuOption.setActive(false);
                found = true;
            } else if (found && menuOption.getEnabled()) {
                menuOption.setActive(true);
                found = false;
                done  = true;
            } else {
                menuOption.setActive(false);
            }
        }
        if (!done) {
            this.setLastActive();
        }
    }

    setNextActive() {
        let menuOptions = this._menuOptions;
        let found       = false;
        let done        = false;
        for (let i = 0; i < menuOptions.length; i++) {
            let menuOption = menuOptions[i];
            if (menuOption.getActive()) {
                menuOption.setActive(false);
                found = true;
            } else if (found && menuOption.getEnabled()) {
                menuOption.setActive(true);
                found = false;
                done  = true;
            } else {
                menuOption.setActive(false);
            }
        }
        if (!done) {
            this.setFirstActive();
        }
    }

    getMenuOptions() {
        return this._menuOptions;
    }

    setElement(element) {
        element.style.width = this._width;
        this._element       = element;
    }

    apply() {
        let menuOptions = this._menuOptions;
        for (let i = 0; i < menuOptions.length; i++) {
            let menuOption = menuOptions[i];
            if (menuOption.getActive()) {
                menuOption.apply();
            }
        }
    }
};
