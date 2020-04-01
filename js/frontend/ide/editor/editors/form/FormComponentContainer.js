/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher       = require('../../../../lib/dispatcher').dispatcher;
const DOMNode          = require('../../../../lib/dom').DOMNode;
const FormEditorState  = require('./FormEditorState');

const CONSTRUCTOR_BY_TYPE = {
        button:       require('../../../../lib/components/Button').Button,
        selectButton: require('../../../../lib/components/ToolOptions').ToolOptions,
        label:        require('../../../../lib/components/Label').Label,
        checkbox:     require('../../../../lib/components/CheckboxAndLabel').CheckboxAndLabel,
        tabs:         require('../../../../lib/components/TabPanel').TabPanel
    };

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
            .on('AddComponent',    this, this.onAddComponent)
            .on('DeleteComponent', this, this.onDeleteComponent);
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
        dispatcher
            .dispatch('Properties.Select', properties, this._formEditorState)
            .dispatch('Properties.ComponentList', {value: id});
    }

    onAddComponent(opts) {
        opts.componentConstructor = CONSTRUCTOR_BY_TYPE[opts.type];
        if (opts.type === 'tabs') {
            opts.panelConstructor = exports.FormComponentContainer;
            opts.panelOpts        = {
                formEditorState: this._formEditorState,
                ui:              this._ui
            };
        }
        this.addElement(opts);
    }

    onDeleteComponent(id) {
        let elementById = this._elementById;
        if (!elementById[id]) {
            return;
        }
        elementById[id].remove();
        delete elementById[id];
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
        if (opts.panelOpts) {
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
        dispatcher.dispatch('Properties.Select', opts.properties, this._formEditorState);
    }
};
