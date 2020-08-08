/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../../../lib/dispatcher').dispatcher;
const DOMNode    = require('../../../lib/dom').DOMNode;
const Dialog     = require('../../../lib/components/Dialog').Dialog;

class Icon extends DOMNode {
    constructor(opts) {
        super(opts);
        this._dialog    = opts.dialog;
        this._tabIndex  = opts.tabIndex;
        this._className = opts.className;
        this.initDOM(opts.parentNode);
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                id: (element) => {
                    this._element = element;
                    element.addEventListener('click', this.onClick.bind(this));
                },
                type:      'input',
                inputType: 'button',
                tabIndex:  this._tabIndex,
                className: 'i i-' + this._className
            }
        );
    }

    onClick() {
        this._dialog.onSelect(this);
    }

    getClassName() {
        return this._className;
    }

    setSelected(selected) {
        this._element.className = 'i i-' + this._className + (selected ? ' active' : '');
    }
}

exports.IconDialog = class extends Dialog {
    constructor(opts) {
        super(opts);
        this._onApply  = null;
        this._selected = null;
        this.createWindow(
            'icon-dialog',
            'Select an icon',
            [
                {
                    ref:       this.setRef('iconList'),
                    className: 'icon-list',
                    children:  this.initIcons()
                },
                {
                    className: 'buttons',
                    children: [
                        this.addButton({
                            ref:      this.setRef('ok'),
                            value:    'Ok',
                            tabIndex: 256,
                            disabled: true,
                            onClick:  this.onApply.bind(this)
                        }),
                        this.addButton({
                            value:    'Cancel',
                            tabIndex: 257,
                            onClick:  this.hide.bind(this)
                        })
                    ]
                }
            ]
        );
        dispatcher.on('Dialog.Icon.Show', this, this.onShow);
    }

    initIcons() {
        let icons = [
                {className: 'point',            title: 'Point'},
                {className: 'circle',           title: 'Circle'},
                {className: 'circle-stripe',    title: 'Circle-stripe'},
                {className: 'rect',             title: 'Rectangle'},
                {className: 'rect-stripe',      title: 'Rectangle-stripe'},
                {className: 'line',             title: 'Line'},
                {className: 'fill-white',       title: 'Line-white'},
                {className: 'fill-black',       title: 'Line-black'},
                {className: 'fill-transparent', title: 'Fill-transparent'},
                {className: 'line-white',       title: 'Line-white'},
                {className: 'line-black',       title: 'Line-black'},
                {className: 'size1',            title: 'Size1'},
                {className: 'size2',            title: 'Size2'},
                {className: 'size3',            title: 'Size3'},
                {className: 'size4',            title: 'Size4'},
                {className: 'text',             title: 'Text'},
                {className: 'header',           title: 'Header'},
                {className: 'btn',              title: 'Button'},
                {className: 'select-btn',       title: 'Select-button'},
                {className: 'text-input',       title: 'Text-input'},
                {className: 'slider',           title: 'Slider'},
                {className: 'text1',            title: 'Text1'},
                {className: 'text2',            title: 'Text2'},
                {className: 'text3',            title: 'Text3'},
                {className: 'move',             title: 'Move'},
                {className: 'label',            title: 'Label'},
                {className: 'checkbox',         title: 'Checkbox'},
                {className: 'tabs',             title: 'Tabs'},
                {className: 'panel',            title: 'Panel'},
                {className: 'status-light',     title: 'Light'},
                {className: 'image',            title: 'Image'},
                {className: 'pu-device',        title: 'Powered-up'},
                {className: 'ev3-sensor',       title: 'EV3-sensor'},
                {className: 'ev3-motor',        title: 'EV3-motor'},
                {className: 'select',           title: 'Select'},
                {className: 'delete',           title: 'Delete'},
                {className: 'copy',             title: 'Copy'},
                {className: 'paste',            title: 'Paste'},
                {className: 'grid',             title: 'Grid'},
                {className: 'binary',           title: 'Binary'},
                {className: 'volume',           title: 'Volume'},
                {className: 'fade-in',          title: 'Fade-in'},
                {className: 'fade-out',         title: 'Fade-out'},
                {className: 'undo',             title: 'Undo'},
                {className: 'play',             title: 'Play'},
                {className: 'progress',         title: 'Progress'},
                {className: 'loading',          title: 'Loading-dots'},
                {className: 'radio',            title: 'Radio'},
                {className: 'dropdown',         title: 'Dropdown'},
                {className: 'list-items',       title: 'List-items'},
                {className: 'timer',            title: 'Timer'},
                {className: 'clock',            title: 'Clock'},
                {className: 'alert-dialog',     title: 'Alert-dialog'},
                {className: 'confirm-dialog',   title: 'Confirm-dialog'}
            ];
        let children = [];
        icons.forEach((icon, index) => {
            children.push({
                type:      Icon,
                dialog:    this,
                className: icon.className,
                tabIndex:  1 + index
            });
        });
        return children;
    }

    onSelect(item) {
        if (this._selected) {
            this._selected.setSelected(false);
        }
        if (this._selected === item) {
            this.onApply();
        } else {
            this._selected = item;
            this._selected.setSelected(true);
            this._refs.ok.setDisabled(false);
        }
    }

    onApply() {
        this._onApply && this._onApply(this._selected.getClassName());
        this.hide();
    }

    onShow(opts) {
        opts || (opts = {});
        this._onApply = opts.onApply;
        this.show();
    }
};
