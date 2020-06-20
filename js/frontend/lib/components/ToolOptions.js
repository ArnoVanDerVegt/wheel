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
        this._ui            = opts.ui;
        this._uiId          = opts.uiId;
        this._tabIndex      = opts.tabIndex;
        this._onMouseDown   = opts.onMouseDown;
        this._onSelect      = opts.onSelect;
        this._onChange      = opts.onChange;
        this._parentNode    = opts.parentNode;
        this._options       = opts.options;
        this._label         = opts.label;
        this._style         = opts.style         || {};
        this._color         = opts.color         || 'blue';
        this._disabled      = opts.disabled      || false;
        this._tool          = opts.tool          || 0;
        this._baseClassName = opts.baseClassName || 'tool-options';
        this._className     = opts.className     || '';
        this._elements      = [];
        this.initDOM();
    }

    initOptions() {
        let options  = this._options;
        let children = [];
        for (let i = 0; i < options.length; i++) {
            let option = options[i];
            let opts   = {
                    type:      Button,
                    id:        this.setOptionElement.bind(this),
                    ui:        this._ui,
                    uiId:      this._uiId,
                    tabIndex:  this._tabIndex + i,
                    color:     this._color,
                    className: (i === this._tool) ? 'active' : 'in-active',
                    onClick:   (function(index) {
                        this.onSelectTool(index);
                        option.onClick && option.onClick();
                    }).bind(this, i)
                };
            if (typeof option === 'string') {
                opts.value    = option;
                opts.title    = option;
            } else {
                opts.hint     = option.hint;
                opts.dispatch = option.dispatch;
                opts.event    = option.event;
                opts.icon     = option.icon;
                opts.value    = option.value || '';
                opts.title    = option.title;
                opts.onFocus  = option.onFocus;
                opts.onBlur   = option.onBlur;
            }
            children.push(opts);
        }
        return children;
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
        this.create(
            this._parentNode,
            {
                id:        this.setElement.bind(this),
                className: this._baseClassName + ' ' + (this._className || ''),
                style:     this._style,
                children:  this.initOptions()
            }
        );
    }

    setElement(element) {
        this._element = element;
        if (this._onMouseDown) {
            element.addEventListener('mousedown', this._onMouseDown);
        }
    }

    setDisabled(disabled) {
        // Todo: set disabled.
    }

    setOptionElement(element) {
        this._elements.push(element);
    }

    setOptions(options) {
        let elements = this._elements;
        if (options.length === elements.length) {
            elements.forEach((element, index) => {
                element.onEvent({value: options[index]});
            });
        } else {
            elements.forEach((element) => {
                element.remove();
            });
            this._options = options;
            let element  = this._element;
            let children = this.initOptions();
            elements.length = 0;
            children.forEach(
                function(button) {
                    button.parentNode = element;
                    button.disabled   = this._disabled;
                    button.color      = this._color;
                    new Button(button);
                },
                this
            );
        }
    }

    onEvent(opts) {
        let element  = this._element;
        let elements = this._elements;
        if ('options' in opts) {
            this.setOptions(opts.options);
        }
        if ('color' in opts) {
            this._color = opts.color;
            elements.forEach((element) => {
                element.setColor(opts.color);
            });
        }
        if ('disabled' in opts) {
            this._disabled = opts.disabled;
            elements.forEach((element) => {
                element.setDisabled(opts.disabled);
            });
        }
        if ('hidden' in opts) {
            element.style.display = opts.hidden ? 'none' : 'block';
        }
        if ('x' in opts) {
            element.style.left = opts.x + 'px';
        }
        if ('y' in opts) {
            element.style.top = opts.y + 'px';
        }
        if ('pointerEvents' in opts) {
            element.style.pointerEvents = opts.pointerEvents;
        }
    }

    onSelectTool(tool) {
        this._tool = tool;
        let options = this._options;
        for (let i = 0; i < options.length; i++) {
            let option = options[i];
            this._elements[i].setClassName((i === tool) ? 'active' : 'in-active');
        }
        this._onSelect && this._onSelect(tool);
        this._onChange && this._onChange(tool);
    }
};
