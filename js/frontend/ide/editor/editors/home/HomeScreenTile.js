/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const DOMNode = require('../../../../lib/dom').DOMNode;

exports.HomeScreenTile = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._uiId     = 1;
        this._ui       = opts.ui;
        this._title    = opts.title;
        this._subTitle = opts.subTitle || '';
        this._icon     = opts.icon;
        this._onClick  = opts.onClick;
        this._tabIndex = opts.tabIndex;
        this.initDOM(opts.parentNode);
        opts.ui.addEventListener('Global.UIId', this, this.onGlobalUIId);
        (typeof opts.id === 'function') && opts.id(this);
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                className: 'home-screen-tile',
                children: [
                    {
                        id:        this.setElement.bind(this),
                        type:      'a',
                        tabIndex:  this._tabIndex,
                        className: 'home-screen-tile-content',
                        children: [
                            this.getIcon(),
                            {
                                ref:       this.setRef('homeScreenTileText'),
                                className: 'home-screen-tile-text' + ((this._subTitle === '') ? '' : ' with-sub-title'),
                                children: [
                                    {
                                        ref:       this.setRef('title'),
                                        type:      'span',
                                        className: 'title',
                                        innerHTML: this._title
                                    },
                                    {
                                        ref:       this.setRef('subTitle'),
                                        type:      'span',
                                        className: 'sub-title',
                                        innerHTML: this._subTitle
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        );
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

    onFocus() {
        this._element.className = 'home-screen-tile-content focus';
    }

    onBlur() {
        this._element.className = 'home-screen-tile-content';
    }

    onClick() {
        this._onClick();
    }

    onKeyDown(event) {
        if ([32, 13].indexOf(event.keyCode) !== -1) {
            this._onClick();
        }
    }

    focus() {
        this._element.focus();
    }
};
