/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher          = require('../../../../lib/dispatcher').dispatcher;
const DOMNode             = require('../../../../lib/dom').DOMNode;
const FormEditorState     = require('./state/FormEditorState');
const EventList           = require('./state/EventList').EventList;
const PropertyList        = require('./state/PropertyList').PropertyList;
const formEditorConstants = require('./formEditorConstants');

const CONSTRUCTOR_BY_TYPE = {
        button:       require('../../../../lib/components/Button').Button,
        selectButton: require('../../../../lib/components/ToolOptions').ToolOptions,
        label:        require('../../../../lib/components/Label').Label,
        checkbox:     require('../../../../lib/components/CheckboxAndLabel').CheckboxAndLabel,
        statusLight:  require('../../../../lib/components/StatusLight').StatusLight,
        panel:        require('../../../../lib/components/Panel').Panel,
        tabs:         require('../../../../lib/components/TabPanel').TabPanel
    };

let formComponentContainerByParentId = {};

exports.getFormComponentContainerByParentId = function(parentId) {
    return formComponentContainerByParentId[parentId];
};

exports.FormComponentContainer = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._mouseDown        = false;
        this._mouseOffsetX     = 0;
        this._mouseOffsetY     = 0;
        this._mouseElement     = null;
        this._mouseComponentId = null;
        this._mouseMoved       = false;
        this._elementById      = {};
        this._onMouseDown      = opts.onMouseDown;
        this._ui               = opts.ui;
        this._className        = opts.className;
        this._parentId         = opts.formEditorState.getNextId();
        this._formEditorState  = opts.formEditorState;
        this._events           = [
            this._formEditorState.on('AddComponent',    this, this.onAddComponent),
            this._formEditorState.on('DeleteComponent', this, this.onDeleteComponent),
            this._formEditorState.on('ChangePosition',  this, this.onChangePosition),
            this._formEditorState.on('ChangeProperty',  this, this.onChangeProperty),
            dispatcher.on('Properties.Property.Change', this, this.onChangeProperty)
        ];
        this.initDOM(opts.parentNode);
        opts.id && opts.id(this);
        formComponentContainerByParentId[this._parentId] = this;
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

    remove() {
        let events = this._events;
        while (events.length) {
            events.pop()();
        }
        this._formElement.parentNode.removeChild(this._formElement);
    }

    getFormElement() {
        return this._formElement;
    }

    setClassName(className) {
        this._formElement.className = className;
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

    getParentId() {
        return this._parentId;
    }

    getElementById(id) {
        return this._elementById[id];
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
        this._formEditorState.setComponentPositionById(this._mouseComponentId, position);
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

    onChangePosition(id, position) {
        let element = this._elementById[id];
        if (!element) {
            return;
        }
        element.onEvent(position);
    }

    onComponentMouseDown(event, element, opts) {
        let offsetX    = event.offsetX;
        let offsetY    = event.offsetY;
        let parentNode = event.target;
        while (parentNode.parentNode.className.indexOf('parent') === -1) {
            offsetX += parentNode.offsetLeft;
            offsetY += parentNode.offsetTop;
            parentNode = parentNode.parentNode;
        }
        if (!this._formEditorState.getComponentById(opts.id)) {
            return;
        }
        element.onEvent({pointerEvents: 'none'});
        this._mouseDown        = true;
        this._mouseComponentId = opts.id;
        this._mouseOffsetX     = offsetX;
        this._mouseOffsetY     = offsetY;
        this._mouseElement     = element;
        event.stopPropagation();
        dispatcher
            .dispatch('Properties.Select.Properties', opts.propertyList, this._formEditorState)
            .dispatch('Properties.Select.Events', opts.eventList, this._formEditorState)
            .dispatch('Properties.ComponentList', {value: opts.id});
    }

    onAddComponent(opts) {
        opts.componentConstructor = CONSTRUCTOR_BY_TYPE[opts.type];
        if (!opts.componentConstructor) {
            return;
        }
        switch (opts.type) {
            case formEditorConstants.COMPONENT_TYPE_PANEL:
                opts.panelConstructor = exports.FormComponentContainer;
                opts.panelOpts        = {
                    formEditorState: this._formEditorState,
                    ui:              this._ui
                };
                break;
            case formEditorConstants.COMPONENT_TYPE_TABS:
                opts.panelConstructor = exports.FormComponentContainer;
                opts.panelOpts        = {
                    formEditorState: this._formEditorState,
                    ui:              this._ui
                };
                break;
        }
        this.addElement(opts);
    }

    onDeleteComponent(opts) {
        let elementById = this._elementById;
        if (!elementById[opts.id]) {
            return;
        }
        elementById[opts.id].remove();
        delete elementById[opts.id];
    }

    addElement(opts) {
        if (opts.owner !== this) {
            return;
        }
        let element;
        let formEditorState = this._formEditorState;
        let component       = formEditorState.propertiesFromComponentToOpts(opts.id, opts.propertyList, opts);
        opts.onMouseDown  = (function(event) { this.onComponentMouseDown(event, element, opts); }).bind(this);
        opts.style        = {position: 'absolute', left: opts.x + 'px', top: opts.y + 'px'};
        opts.parentNode   = this._formElement;
        opts.ui           = this._ui;
        opts.uiId         = 1;
        opts.propertyList = new PropertyList({
            component:       component,
            componentList:   formEditorState.getComponentList(),
            formEditorState: formEditorState
        });
        opts.eventList    = new EventList({
            component:       component,
            formEditorState: formEditorState
        });
        if (opts.panelOpts) {
            opts.panelOpts.onMouseDown = (function(event) {
                this.onComponentMouseDown(event, element, opts);
            }).bind(this);
        }
        element                    = new opts.componentConstructor(opts);
        this._elementById[opts.id] = element;
        dispatcher
            .dispatch('Properties.Select.Properties', opts.propertyList, formEditorState)
            .dispatch('Properties.Select.Events', opts.eventList, formEditorState);
    }
};
