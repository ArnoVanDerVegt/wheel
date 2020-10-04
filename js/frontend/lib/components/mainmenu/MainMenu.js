/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher   = require('../../dispatcher').dispatcher;
const DOMNode      = require('../../dom').DOMNode;
const Menu         = require('../Menu').Menu;
const MainMenuItem = require('./MainMenuItem').MainMenuItem;

exports.MainMenu = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._tabIndex     = opts.tabIndex;
        this._ui           = opts.ui;
        this._platform     = opts.platform;
        this._getImage     = opts.getImage;
        this._menus        = [];
        this._menuByHotkey = {};
        this._altPressed   = false;
        this.initDOM(opts.parentNode);
        this._ui
            .addEventListener('Global.UIId',     this, this.onGlobalUIId)
            .addEventListener('Global.Key.Down', this, this.onGlobalKeyDown)
            .addEventListener('Global.Key.Up',   this, this.onGlobalKeyUp);
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                id:        this.setMainMenuElement.bind(this),
                className: 'abs max-w main-menu',
                children: [
                    {
                        type:      'img',
                        src:       this._getImage('images/logos/wheelWhite.svg'),
                        width:     28,
                        height:    28
                    }
                ]
            }
        );
    }

    onGlobalUIId() {
        this.setDisabled(this._ui.getActiveUIId() !== 1);
    }

    onGlobalKeyDown(event) {
        if (this._ui.getActiveUIId() !== 1) {
            return;
        }
        if (event.key === 'Alt') {
            this._altPressed = true;
            let mainMenuElement = this._mainMenuElement;
            mainMenuElement.className = this.addClassName(mainMenuElement.className, 'alt-pressed');
        }
        let key = String.fromCharCode(event.keyCode).toLowerCase();
        if (this._altPressed && (key in this._menuByHotkey)) {
            this._menuByHotkey[key].focus();
        }
    }

    onGlobalKeyUp(event) {
        if (event.key === 'Alt') {
            this._altPressed = false;
            let mainMenuElement = this._mainMenuElement;
            mainMenuElement.className = this.removeClassName(mainMenuElement.className, 'alt-pressed');
        }
    }

    onLeftMenu(menu) {
        let menus = this._menus;
        for (let i = menus.length - 1; i > 0; i--) {
            if (menus[i] === menu) {
                menus[i - 1].focus();
                break;
            }
        }
    }

    onRightMenu(menu) {
        let menus = this._menus;
        for (let i = 0; i < menus.length - 1; i++) {
            if (menus[i] === menu) {
                menus[i + 1].focus();
                break;
            }
        }
    }

    onMouseMove(event) {
        dispatcher.dispatch('MainMenu.Mouse.Move');
    }

    addMenu(opts) {
        opts.ui          = this._ui;
        opts.parentNode  = this._mainMenuElement;
        opts.mainMenu    = this;
        opts.platform    = this._platform;
        opts.onLeftMenu  = this.onLeftMenu.bind(this);
        opts.onRightMenu = this.onRightMenu.bind(this);
        opts.tabIndex    = this._menus.length + this._tabIndex;
        let mainMenuItem = new MainMenuItem(opts);
        this._menuByHotkey[mainMenuItem.getHotkey()] = mainMenuItem;
        this._menus.push(mainMenuItem);
        return mainMenuItem;
    }

    hideAllMenus() {
        this._menus.forEach((menu) => {
            menu.setMenuVisible(false);
        });
    }

    setMainMenuElement(element) {
        this._mainMenuElement = element;
        element.addEventListener('mousemove', this.onMouseMove.bind(this));
    }

    setDisabled(disabled) {
        let menus = this._menus;
        for (let i = 0; i < menus.length; i++) {
            menus[i].setDisabled(disabled);
        }
    }
};
