/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const Button           = require('../../../../lib/components/Button').Button;
const ToolOptions      = require('../../../../lib/components/ToolOptions').ToolOptions;
const Label            = require('../../../../lib/components/Label').Label;
const CheckboxAndLabel = require('../../../../lib/components/CheckboxAndLabel').CheckboxAndLabel;
const TabPanel         = require('../../../../lib/components/TabPanel').TabPanel;
const dispatcher       = require('../../../../lib/dispatcher').dispatcher;
const DOMNode          = require('../../../../lib/dom').DOMNode;
const FormEditorState  = require('./FormEditorState');

exports.FormComponentContainer = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._mouseDown       = false;
        this._mouseOffsetX    = 0;
        this._mouseOffsetY    = 0;
        this._mouseElement    = null;
        this._mouseComponent  = null;
        this._mouseMoved      = false;
        this._elementById     = {};
        this._onMouseDown     = opts.onMouseDown;
        this._ui              = opts.ui;
        this._className       = opts.className;
        this._parentId        = opts.formEditorState.getNextId();
        this._formEditorState = opts.formEditorState;
        this._formEditorState
            .on('AddButton',       this, this.onAddButton)
            .on('AddSelectButton', this, this.onAddSelectButton)
            .on('AddLabel',        this, this.onAddLabel)
            .on('AddCheckbox',     this, this.onAddCheckbox)
            .on('AddTabs',         this, this.onAddTabs);
        this.initDOM(opts.parentNode);
        dispatcher.on('Properties.Property.Change', this, this.onChangeProperty);
        opts.id && opts.id(this);
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                id:        this.setFormElement.bind(this),
                className: this._className + ' parent'
            }
        );
    }

    setFormElement(element) {
        this._formElement = element;
        element.addEventListener('click',     this.onClick.bind(this));
        element.addEventListener('mousedown', this.onMouseDown.bind(this));
        element.addEventListener('mousemove', this.onMouseMove.bind(this));
        element.addEventListener('mouseup',   this.onMouseUp.bind(this));
        element.addEventListener('mouseout',  this.onMouseOut.bind(this));
    }

    setClassName(className) {
        this._formElement.className = className + ' parent';
    }

    resetMouseElement() {
        if (this._mouseElement) {
            this._mouseElement.onEvent({pointerEvents: 'auto'});
            this._mouseElement = null;
        }
    }

    onMouseDown(event) {
        // | this._onMouseDown && this._onMouseDown(event);
        this.onCancelEvent(event);
        this._mouseDown  = true;
        this._mouseMoved = false;
    }

    onMouseMove(event) {
        this._mouseMoved = true;
        this.onCancelEvent(event);
        if (!this._mouseDown || !this._mouseElement) {
            return;
        }
        let x        = event.offsetX - this._mouseOffsetX;
        let y        = event.offsetY - this._mouseOffsetY;
        let position = {x: x, y: y};
        this._mouseComponent.x = x;
        this._mouseComponent.y = y;
        this._mouseElement.onEvent(position);
        dispatcher.dispatch('Properties.ChangePosition', position);
    }

    onMouseUp(event) {
        this.onCancelEvent(event);
        this.resetMouseElement();
        this._mouseDown = false;
    }

    onMouseOut(event) {
        this.onCancelEvent(event);
        this.resetMouseElement();
        this._mouseDown = false;
    }

    onClick(event) {
        let className = event.target.className + '';
        if (className.indexOf('parent') === -1) {
            return;
        }
        this.onCancelEvent(event);
        if (this._mouseElement) {
            this.resetMouseElement();
        } else if (!this._mouseMoved) {
            this._formEditorState.addComponent({
                x:        event.offsetX,
                y:        event.offsetY,
                owner:    this,
                parentId: this._parentId
            });
        }
    }

    onChangeProperty(id, property, value) {
        let element = this._elementById[id];
        if (!element) {
            return;
        }
        let opts = {};
        opts[property] = value;
        element.onEvent(opts);
    }

    onComponentMouseDown(event, element, id, type, properties) {
        let offsetX    = event.offsetX;
        let offsetY    = event.offsetY;
        let parentNode = event.target;
        while (parentNode.parentNode.className.indexOf('parent') === -1) {
            offsetX += parentNode.offsetLeft;
            offsetY += parentNode.offsetTop;
            parentNode = parentNode.parentNode;
        }
        this._mouseComponent = this._formEditorState.getComponentById(id);
        if (!this._mouseComponent) {
            return;
        }
        element.onEvent({pointerEvents: 'none'});
        this._mouseDown    = true;
        this._mouseOffsetX = offsetX;
        this._mouseOffsetY = offsetY;
        this._mouseElement = element;
        event.stopPropagation();
        dispatcher.dispatch('Properties.Select', type, properties, this._formEditorState);
    }

    onAddButton(opts) {
        this.addElement({
            type:                 'button',
            id:                   opts.id,
            owner:                opts.owner,
            componentConstructor: Button,
            properties: [
                {type: 'type',        name: null},
                {type: 'id',          name: null},
                {type: 'parentId',    name: null},
                {type: 'string',      name: 'name'},
                {type: 'integer',     name: 'tabIndex'},
                {type: 'integer',     name: 'x'},
                {type: 'integer',     name: 'y'},
                {type: 'color',       name: 'color'},
                {type: 'string',      name: 'value'},
                {type: 'string',      name: 'title'}
            ]
        });
    }

    onAddSelectButton(opts) {
        this.addElement({
            type:                 'selectButton',
            id:                   opts.id,
            owner:                opts.owner,
            componentConstructor: ToolOptions,
            properties: [
                {type: 'type',        name: null},
                {type: 'id',          name: null},
                {type: 'parentId',    name: null},
                {type: 'string',      name: 'name'},
                {type: 'integer',     name: 'tabIndex'},
                {type: 'integer',     name: 'x'},
                {type: 'integer',     name: 'y'},
                {type: 'color',       name: 'color'},
                {type: 'stringList',  name: 'options'}
            ]
        });
    }

    onAddLabel(opts) {
        this.addElement({
            type:                 'label',
            id:                   opts.id,
            owner:                opts.owner,
            componentConstructor: Label,
            properties: [
                {type: 'type',        name: null},
                {type: 'id',          name: null},
                {type: 'parentId',    name: null},
                {type: 'string',      name: 'name'},
                {type: 'integer',     name: 'tabIndex'},
                {type: 'integer',     name: 'x'},
                {type: 'integer',     name: 'y'},
                {type: 'string',      name: 'text'}
            ]
        });
    }

    onAddCheckbox(opts) {
        this.addElement({
            type:                 'checkbox',
            id:                   opts.id,
            owner:                opts.owner,
            componentConstructor: CheckboxAndLabel,
            properties: [
                {type: 'type',        name: null},
                {type: 'id',          name: null},
                {type: 'parentId',    name: null},
                {type: 'string',      name: 'name'},
                {type: 'integer',     name: 'tabIndex'},
                {type: 'integer',     name: 'x'},
                {type: 'integer',     name: 'y'},
                {type: 'string',      name: 'text'},
                {type: 'boolean',     name: 'checked'}
            ]
        });
    }

    onAddTabs(opts) {
        this.addElement({
            type:                 'tabs',
            id:                   opts.id,
            containerId:          [this._formEditorState.peekId(), this._formEditorState.peekId() + 1],
            owner:                opts.owner,
            componentConstructor: TabPanel,
            panelConstructor:     exports.FormComponentContainer,
            panelOpts: {
                formEditorState: this._formEditorState,
                ui:              this._ui
            },
            properties: [
                {type: 'type',        name: null},
                {type: 'id',          name: null},
                {type: 'parentId',    name: null},
                {type: 'containerId', name: null},
                {type: 'string',      name: 'name'},
                {type: 'integer',     name: 'tabIndex'},
                {type: 'integer',     name: 'x'},
                {type: 'integer',     name: 'y'},
                {type: 'integer',     name: 'width'},
                {type: 'integer',     name: 'height'},
                {type: 'stringList',  name: 'tabs'}
            ]
        });
    }

    addElement(opts) {
        if (opts.owner !== this) {
            return;
        }
        let element;
        let component = this._formEditorState.getComponentById(opts.id);
        opts.properties.forEach(function(property) {
            if (property.name && (property.name in component)) {
                opts[property.name] = component[property.name];
            }
        });
        opts.properties.id = opts.id;
        opts.style         = {
            position: 'absolute',
            left:     opts.x + 'px',
            top:      opts.y + 'px'
        };
        if (opts.type === 'tabs') {
            opts.panelOpts.onMouseDown = (function(event) {
                this.onComponentMouseDown(event, element, opts.id, opts.type, opts.properties);
            }).bind(this);
        }
        opts.onMouseDown = (function(event) {
            this.onComponentMouseDown(event, element, opts.id, opts.type, opts.properties);
        }).bind(this);
        opts.parentNode            = this._formElement;
        opts.ui                    = this._ui;
        opts.uiId                  = 1;
        element                    = new opts.componentConstructor(opts);
        this._elementById[opts.id] = element;
        dispatcher.dispatch('Properties.Select', opts.type, opts.properties, this._formEditorState);
    }
};
