/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../dispatcher').dispatcher;
const DOMNode    = require('../dom').DOMNode;
const Component  = require('./component/Component').Component;

class MenuItem extends Component {
    constructor(opts) {
        super(opts);
        this._checked       = false;
        this._withCheck     = opts.withCheck;
        this._baseClassName = 'flt rel max-w context-menu-item' + (opts.withCheck ? ' with-check' : '');
        this._option        = opts.option;
        this._menu          = opts.menu;
        this.initDOM(opts.parentNode);
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                ref:       this.setRef('title'),
                id:        this.setElement.bind(this),
                ui:        this._ui,
                className: this.getClassName(),
                innerHTML: this._option.title
            }
        );
    }

    onMouseDown(event) {
        this._option.onClick(this._menu.getItem());
        event.preventDefault();
        event.stopPropagation();
        this._menu.hide();
    }

    getTitle() {
        return this._option.title;
    }

    setChecked(checked) {
        this._checked              = checked;
        this._refs.title.className = 'flt rel max-w context-menu-item' +
            (this._withCheck ? ' with-check' : '') +
            (checked         ? ' checked' : '');
    }
}

class MenuSeparator extends DOMNode {
    constructor(opts) {
        super(opts);
        this.initDOM(opts.parentNode);
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                className: 'flt max-w context-menu-item-separator',
                children: [
                    {
                        className: 'max-w line'
                    }
                ]
            }
        );
    }
}

exports.ContextMenu = class extends Component {
    constructor(opts) {
        super(opts);
        this._ui            = opts.ui;
        this._baseClassName = 'context-menu';
        this._className     = 'hidden';
        this._color         = '';
        this._options       = opts.options;
        this._menuItems     = [];
        this._withCheck     = opts.withCheck;
        this.initDOM(opts.parentNode);
        this._ui
            .addEventListener('Global.Mouse.Down',   this, this.onGlobalMouseDown)
            .addEventListener('Global.Window.Blur',  this, this.onGlobalWindowBlur);
        dispatcher
            .on('MainMenu.Mouse.Move', this, this.onMainMenuMouseMove)
            .on('Global.HideMenu',     this, this.onGlobalHideMenu);
    }

    initDOM(parentNode) {
        let children  = [];
        let menuItems = this._menuItems;
        this._options.forEach(
            function(option) {
                children.push({
                    id: function(element) {
                        if (option.title !== '-') {
                            menuItems.push(element);
                        }
                    },
                    menu:      this,
                    type:      (option.title === '-') ? MenuSeparator : MenuItem,
                    ui:        this._ui,
                    withCheck: this._withCheck,
                    option:    option
                });
            },
            this
        );
        this.create(
            parentNode,
            {
                id:        this.setElement.bind(this),
                className: this.getClassName(),
                children:  children
            }
        );
    }

    onGlobalMouseDown() {
        this.hide();
    }

    onGlobalWindowBlur() {
        this.hide();
    }

    onMainMenuMouseMove() {
        this.hide();
    }

    onGlobalHideMenu() {
        this.hide();
    }

    hide() {
        this._className         = 'hidden';
        this._element.className = this.getClassName();
    }

    show(x, y, item) {
        let element = this._element;
        element.style.left = x + 'px';
        element.style.top  = y + 'px';
        this._className    = '';
        element.className  = this.getClassName() + ' invisible';
        this._item         = item;
        if (y > window.innerHeight / 2) {
            element.style.top = (y - element.offsetHeight) + 'px';
        }
        setTimeout(
            () => {
                if (x > window.innerHeight / 2) {
                    x -= element.offsetWidth;
                    element.style.left = x + 'px';
                }
                element.className = this.getClassName();
            },
            50
        );
    }

    getItem() {
        return this._item;
    }

    getMenuItems() {
        return this._menuItems;
    }
};
