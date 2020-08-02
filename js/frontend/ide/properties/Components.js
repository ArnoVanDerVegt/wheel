/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const DOMNode    = require('../../lib/dom').DOMNode;
const dispatcher = require('../../lib/dispatcher').dispatcher;
const Button     = require('../../lib/components/Button').Button;

exports.Components = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._first                 = true;
        this._toolGroup             = 0;
        this._ui                    = opts.ui;
        this._uiId                  = opts.uiId;
        this._buttons               = [];
        this._buttonByGroupAndIndex = {};
        this._active                = 0;
        this.initDOM(opts.parentNode);
        dispatcher.on('FormEditor.Select.ToolbarTool', this, this.onSelectToolbarTool);
    }

    initTitle(title) {
        return {
            className: 'title',
            innerHTML: title
        };
    }

    initButton(item) {
        let first = this._first;
        item.toolGroup = this._toolGroup;
        item.index     = this._buttons.length;
        this._first = false;
        this._buttons.push(item);
        return {
            id:        (element) => { item.element = element; },
            type:      Button,
            ui:        this._ui,
            uiId:      1,
            className: 'component-button component-' + item.image + (first ? ' active' : ''),
            hint:      item.hint ? {text: item.hint} : false,
            color:     '',
            onClick:   this.onSelectComponentWithDispatch.bind(this, item)
        };
    }

    initGroup(opts) {
        let children = [];
        opts.items.forEach((item, index) => {
            item.toolType  = opts.toolType;
            item.toolIndex = index;
            this._buttonByGroupAndIndex[this._toolGroup + '_' + index] = item;
            children.push(this.initButton(item));
        });
        this._toolGroup++;
        return {
            className: 'group',
            children:  children
        };
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                ref:       this.setRef('container'),
                className: 'components-container',
                children:  [
                    {
                        className: 'components-content',
                        children: [
                            this.initTitle('Input components'),
                            this.initGroup({
                                toolType: 'inputTools',
                                items: [
                                    {image: 'btn',           hint: 'Button<br/>component'},
                                    {image: 'select-btn',    hint: 'Select button<br/>component'},
                                    {image: 'checkbox',      hint: 'Checkbox<br/>component'},
                                    {image: 'radio',         hint: 'Radio<br/>component'},
                                    {image: 'dropdown',      hint: 'Dropdown<br/>component'},
                                    {image: 'text-input',    hint: 'Text input<br/>component'},
                                    {image: 'slider',        hint: 'Slider<br/>component'}
                                ]
                            }),
                            this.initTitle('Text components'),
                            this.initGroup({
                                toolType: 'textTools',
                                items: [
                                    {image: 'label',         hint: 'Label<br/>component'},
                                    {image: 'header',        hint: 'Title<br/>component'},
                                    {image: 'text',          hint: 'Text<br/>component'},
                                    {image: 'list-items',    hint: 'Items list<br/>component'}
                                ]
                            }),
                            this.initTitle('Panel components'),
                            this.initGroup({
                                toolType: 'panelTools',
                                items: [
                                    {image: 'panel',         hint: 'Panel<br/>component'},
                                    {image: 'tabs',          hint: 'Tabs<br/>component'}
                                ]
                            }),
                            this.initTitle('Graphics components'),
                            this.initGroup({
                                toolType: 'graphicsTools',
                                items: [
                                    {image: 'rect-stripe',   hint: 'Rectangle<br/>component'},
                                    {image: 'circle-stripe', hint: 'Circle<br/>component'},
                                    {image: 'image',         hint: 'Image<br/>component'}
                                ]
                            }),
                            this.initTitle('Status components'),
                            this.initGroup({
                                toolType: 'statusTools',
                                items: [
                                    {image: 'status-light',  hint: 'Status light<br/>component'},
                                    {image: 'progress',      hint: 'Progress bar<br/>component'},
                                    {image: 'loading',       hint: 'Loading dots<br/>component'}
                                ]
                            }),
                            this.initTitle('Device display components'),
                            this.initGroup({
                                toolType: 'ioTools',
                                items: [
                                    {image: 'pu-device',     hint: 'Powered Up device<br/>component'},
                                    {image: 'ev3-sensor',    hint: 'EV3 sensor<br/>component'},
                                    {image: 'ev3-motor',     hint: 'EV3 motor<br/>component'}
                                ]
                            }),
                            this.initTitle('Non visual components'),
                            this.initGroup({
                                toolType: 'nonVisualTools',
                                items: [
                                    {image: 'timer',         hint: 'Interval<br/>component'},
                                    {image: 'clock',         hint: 'Timeout<br/>component'}
                                ]
                            })
                        ]
                    }
                ]
            }
        );
    }

    onSelectComponent(item) {
        let buttons    = this._buttons;
        let activeItem = buttons[this._active];
        activeItem.element.setClassName('component-button component-' + activeItem.image);
        this._active = item.index;
        buttons[this._active].element.setClassName('component-button component-' + item.image + ' active');
    }

    onSelectComponentWithDispatch(item) {
        this.onSelectComponent(item);
        dispatcher.dispatch('FormEditor.Select.Tool', item);
    }

    onSelectToolbarTool(opts) {
        let item = this._buttonByGroupAndIndex[opts.toolGroup + '_' + opts.toolIndex];
        item && this.onSelectComponent(item);
    }

    setVisible(visible) {
        this._refs.container.style.display = visible ? 'block' : 'none';
    }
};
