/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const DOMNode     = require('../../../../lib/dom').DOMNode;
const Dropdown    = require('../../../../lib/components/Dropdown').Dropdown;
const Button      = require('../../../../lib/components/Button').Button;
const CloseButton = require('../../../../lib/components/CloseButton').CloseButton;
const getImage    = require('../../../data/images').getImage;

class GearItem extends DOMNode {
    constructor(opts) {
        super(opts);
        this._dialog   = opts.dialog;
        this._ui       = opts.ui;
        this._uiId     = opts.uiId;
        this._index    = opts.index;
        this._list     = opts.list;
        this._from     = opts.from;
        this._to       = opts.to;
        this._selected = opts.selected;
        this._tabIndex = opts.tabIndex;
        this.initDOM(opts.parentNode);
        this._list.addItem(this);
    }

    initImage(ref, opts) {
        return {
            ref:       this.setRef(ref + 'Wrapper'),
            className: 'gear-list-image-wrapper',
            style: {
                backgroundColor: opts.color
            },
            children: [
                {
                    ref:       this.setRef(ref + 'Img'),
                    type:      'img',
                    src:       getImage(opts.image)
                },
                {
                    ref:       this.setRef(ref + 'Value'),
                    className: 'value',
                    innerHTML: opts.gear
                }
            ]
        };
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                ref:       this.setRef('item'),
                className: 'gear-list-item' + (this._selected ? ' selected' : ''),
                children: [
                    this.initImage('from', this._from),
                    this.initImage('to',   this._to),
                    {
                        ref:       this.setRef('gearInfo'),
                        innerHTML: this.getInfo(),
                        className: 'gear-info'
                    },
                    {
                        ref:       this.setRef('itemLink'),
                        type:      'a',
                        className: 'item',
                        href:      '#',
                        id:        this.addLinkElement.bind(this),
                        tabIndex:  this._tabIndex
                    },
                    {
                        type:      CloseButton,
                        ref:       this.setRef('closeButton'),
                        ui:        this._ui,
                        uiId:      this._uiId,
                        tabIndex:  this._tabIndex + 1,
                        onClick:   this.onRemove.bind(this)
                    }
                ]
            }
        );
    }

    addLinkElement(element) {
        element.addEventListener('click',     this.onClick.bind(this));
        element.addEventListener('mousedown', this.onCancelEvent.bind(this));
        element.addEventListener('mouseup',   this.onMouseUp.bind(this));
        element.addEventListener('focus',     this.onFocus.bind(this));
    }

    update(opts) {
        let refs = this._refs;
        this._from = opts.from;
        this._to   = opts.to;
        refs.fromWrapper.style.backgroundColor = opts.from.color;
        refs.fromImg.src                       = getImage(opts.from.image);
        refs.fromValue.innerHTML               = opts.from.gear;
        refs.toWrapper.style.backgroundColor   = opts.to.color;
        refs.toImg.src                         = getImage(opts.to.image);
        refs.toValue.innerHTML                 = opts.to.gear;
        refs.gearInfo.innerHTML                = this.getInfo();
    }

    setIndex(index) {
        this._index = index;
        return this;
    }

    setTabIndex(tabIndex) {
        let refs = this._refs;
        this._tabIndex         = tabIndex;
        refs.itemLink.tabIndex = this._tabIndex;
        refs.closeButton.setTabIndex(this._tabIndex + 1);
    }

    getInfo() {
        let dialog = this._dialog;
        let from   = this._from;
        let to     = this._to;
        if (to.gear > from.gear) {
            return 'The gear ratio is <b>' + to.gear + ':' + from.gear + '</b><br/>' +
                'The speed is decreased ' + dialog.toFixed(to.gear / from.gear, 3) + ' times.<br/>' +
                'The torque is increased ' + dialog.toFixed(to.gear / from.gear, 3) + ' times.<br/>' +
                'The follower gear rotates ' + dialog.toFixed(from.gear / to.gear, 3) + ' time per each revolution of the driver gear.';
        }
        return 'The gear ratio is <b>' + to.gear + ':' + from.gear + '</b><br/>' +
            'The speed is increased ' + dialog.toFixed(1 / (to.gear / from.gear), 3) + ' times.<br/>' +
            'The torque is decreased ' + dialog.toFixed(1 / (to.gear / from.gear), 3) + ' times.<br/>' +
            'The follower gear rotates ' + dialog.toFixed(from.gear / to.gear, 3) + ' time per each revolution of the driver gear.';
    }

    getFrom() {
        return this._from;
    }

    getTo() {
        return this._to;
    }

    setSelected(selected) {
        this._selected            = selected;
        this._refs.item.className = 'gear-list-item' + (selected ? ' selected' : '');
    }

    onRemove() {
        this._list.remove(this._index);
        this._refs.item.parentNode.removeChild(this._refs.item);
    }

    onFocus(event) {
        this._list.setSelected(this);
    }

    onClick(event) {
        this.onCancelEvent(event);
        this._list.setSelected(this);
    }

    onMouseUp(event) {
        this.onCancelEvent(event);
        this._refs.itemLink.focus();
    }
}

exports.GearList = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._list     = [];
        this._dialog   = opts.dialog;
        this._gears    = opts.gears;
        this._ui       = opts.ui;
        this._uiId     = opts.uiId;
        this._onSelect = opts.onSelect;
        this._selected = null;
        this.initDOM(opts.parentNode);
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                className: 'gear-list',
                children: [
                    {
                        className: 'gear-list-content',
                        ref: this.setRef('list')
                    }
                ]
            }
        );
    }

    setSelected(selected) {
        if (this._selected) {
            this._selected.setSelected(false);
        }
        selected.setSelected(true);
        this._selected = selected;
        this._onSelect({from: selected.getFrom(), to: selected.getTo()});
    }

    getList() {
        return this._list;
    }

    addItem(gearItem) {
        let list = this._list;
        list.push(gearItem);
        if (this._selected) {
            this._selected.setSelected(false);
        }
        this._selected               = gearItem;
        this._refs.list.style.height = (list.length * 72) + 'px';
    }

    add(opts) {
        this.create(
            this._refs.list,
            {
                type:     GearItem,
                dialog:   this._dialog,
                ui:       this._ui,
                uiId:     this._uiId,
                list:     this,
                from:     opts.from,
                to:       opts.to,
                selected: true,
                index:    this._list.length,
                tabIndex: 2 + this._list.length * 2
            }
        );
    }

    remove(index) {
        let list = this._list;
        list.splice(index, 1);
        list.forEach((gearItem, index) => {
            gearItem
                .setIndex(index)
                .setTabIndex(2 + index * 2);
        });
        this._refs.list.style.height = (list.length * 72) + 'px';
        this._onSelect(null);
    }

    update(opts) {
        if (this._selected) {
            this._selected.update(opts);
        }
    }
};
