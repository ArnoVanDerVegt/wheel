/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const DOMNode = require('../../../../lib/dom').DOMNode;

exports.HomeScreenTile = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._uiId           = 1;
        this._ui             = opts.ui;
        this._title          = opts.title;
        this._subTitle       = opts.subTitle || '';
        this._icon           = opts.icon;
        this._onClick        = opts.onClick;
        this._tabIndex       = opts.tabIndex;
        this._settingsGetter = opts.settingsGetter;
        this.initDOM(opts.parentNode);
        opts.ui.addEventListener('Global.UIId', this, this.onGlobalUIId);
        if (opts.settings) {
            this._settings = opts.settings;
            opts.settings.on('Settings.HomeScreen', this, this.onChangeHomeScreen);
        }
        (typeof opts.id === 'function') && opts.id(this);
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                ref:       this.setRef('homeScreenTile'),
                className: 'home-screen-tile',
                children: [
                    {
                        id:        this.setElement.bind(this),
                        type:      'a',
                        tabIndex:  this._tabIndex,
                        className: 'flt max-w max-h home-screen-tile-content',
                        children: [
                            this.getIcon(),
                            {
                                ref:       this.setRef('homeScreenTileText'),
                                className: 'frt max-h home-screen-tile-text' + ((this._subTitle === '') ? '' : ' with-sub-title'),
                                children: [
                                    {
                                        ref:       this.setRef('title'),
                                        type:      'span',
                                        className: 'flt max-w title',
                                        innerHTML: this._title
                                    },
                                    this.getSubTitle()
                                ]
                            }
                        ]
                    }
                ]
            }
        );
        let visible = this._settingsGetter ? this._settingsGetter() : true;
        this._refs.homeScreenTile.style.display = visible ? 'block' : 'none';
    }

    getSubTitle() {
        return {
            ref:       this.setRef('subTitle'),
            type:      'span',
            className: 'sub-title',
            innerHTML: this._subTitle
        };
    }

    getIcon() {
        return {
            className: 'file-icon large',
            type:      'img',
            src:       this._icon
        };
    }

    setElement(element) {
        this._element = element;
        element.addEventListener('mousedown', this.onCancelEvent.bind(this));
        element.addEventListener('mouseup',   this.onCancelEvent.bind(this));
        element.addEventListener('focus',     this.onFocus.bind(this));
        element.addEventListener('blur',      this.onBlur.bind(this));
        element.addEventListener('keydown',   this.onKeyDown.bind(this));
        element.addEventListener('click',     this.onClick.bind(this));
    }

    onGlobalUIId() {
        this._element.tabIndex = (this._uiId === this._ui.getActiveUIId()) ? this._tabIndex : -1;
    }

    onChangeHomeScreen() {
        if (!this._settingsGetter) {
            return;
        }
        this._refs.homeScreenTile.style.display = this._settingsGetter() ? 'block' : 'none';
    }

    onFocus() {
        this._element.className = 'flt max-w max-h home-screen-tile-content focus';
    }

    onBlur() {
        this._element.className = 'flt max-w max-h home-screen-tile-content';
    }

    onClick() {
        (typeof this._onClick === 'function') && this._onClick();
    }

    onKeyDown(event) {
        if (([32, 13].indexOf(event.keyCode) !== -1) && (typeof this._onClick === 'function')) {
            this._onClick();
        }
    }

    focus() {
        this._element.focus();
    }
};
