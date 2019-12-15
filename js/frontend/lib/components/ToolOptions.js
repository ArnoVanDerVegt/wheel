/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../dispatcher').dispatcher;
const Button     = require('./Button').Button;
const DOMNode    = require('../dom').DOMNode;

exports.ToolOptions = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._ui         = opts.ui;
        this._uiId       = opts.uiId;
        this._color      = opts.color || 'blue';
        this._elements   = [];
        this._tabIndex   = opts.tabIndex;
        this._tool       = opts.tool || 0;
        this._onSelect   = opts.onSelect;
        this._parentNode = opts.parentNode;
        this._options    = opts.options;
        this._label      = opts.label;
        this._className  = opts.className || '';
        this.initDOM();
    }

    initDOM() {
        if (this._label) {
            this.create(
                this._parentNode,
                {
                    innerHTML: this._label,
                    className: 'label'
                }
            );
        }
        let options  = this._options;
        let children = [];
        for (let i = 0; i < options.length; i++) {
            let option = options[i];
            children.push({
                id:        this.setOptionElement.bind(this),
                ui:        this._ui,
                uiId:      this._uiId,
                dispatch:  option.dispatch,
                event:     option.event,
                type:      Button,
                tabIndex:  this._tabIndex + i,
                icon:      option.icon,
                color:     this._color,
                value:     option.value || '',
                title:     option.title,
                className: (i === this._tool) ? 'active' : 'in-active',
                onClick:   (function(index) {
                    this.onSelectTool(index);
                    option.onClick && option.onClick();
                }).bind(this, i)
            });
        }
        this.create(
            this._parentNode,
            {
                className: 'tool-options ' + (this._className || ''),
                children:  children
            }
        );
    }

    setOptionElement(element) {
        this._elements.push(element);
    }

    onSelectTool(tool) {
        this._tool = tool;
        let options = this._options;
        for (let i = 0; i < options.length; i++) {
            let option = options[i];
            this._elements[i].setClassName((i === tool) ? 'active' : 'in-active');
        }
        this._onSelect && this._onSelect(tool);
    }
};
