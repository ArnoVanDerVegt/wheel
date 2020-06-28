/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher          = require('../../../lib/dispatcher').dispatcher;
const Dialog              = require('../../../lib/components/Dialog').Dialog;
const Button              = require('../../../lib/components/Button').Button;
const Label               = require('../../../lib/components/Label').Label;
const ToolOptions         = require('../../../lib/components/ToolOptions').ToolOptions;
const CheckboxAndLabel    = require('../../../lib/components/CheckboxAndLabel').CheckboxAndLabel;
const StatusLight         = require('../../../lib/components/StatusLight').StatusLight;
const TabPanel            = require('../../../lib/components/TabPanel').TabPanel;
const Rectangle           = require('../../../lib/components/Rectangle').Rectangle;
const Circle              = require('../../../lib/components/Circle').Circle;
const Image               = require('../../../lib/components/Image').Image;
const getImage            = require('../../data/images').getImage;
const formEditorConstants = require('../../editor/editors/form/formEditorConstants');

exports.FormDialog = class extends Dialog {
    constructor(opts) {
        opts.getImage = getImage;
        super(opts);
        this._vm                     = opts.vm;
        this._program                = opts.program;
        this._onHide                 = opts.onHide;
        this._componentFormContainer = opts.componentFormContainer;
        this._win                    = this._componentFormContainer.addWindow();
        this._title                  = '';
        this._width                  = 300;
        this._height                 = 300;
        this._onHideEvent            = null; // Wheel event for hiding...
        this._onShowEvent            = null; // Wheel event for showing...
        let children = this.getChildren(opts);
        this.createWindow('form-dialog', this._title, children);
    }

    addDefaultEvent(component, property) {
        let entryPoint = this._program.getEventInfo(component[property]);
        if (!entryPoint) {
            // Log warning...
            dispatcher.dispatch(
                'Console.Log',
                {
                    message:   'Warning: failed to find callback "' + component[property] + '" for <i>' + component.name + '.' + property + '</i> event.',
                    className: 'warning'
                }
            );
            component[property] = function() {};
            return;
        }
        let vm  = this._vm;
        let win = this._win;
        component[property] = function() {
            vm.runEvent(entryPoint, [win.getUiId()]);
        };
    }

    addChangeEvent(component, property) {
        let entryPoint = this._program.getEventInfo(component[property]);
        if (!entryPoint) {
            return;
        }
        let vm  = this._vm;
        let win = this._win;
        component[property] = function(value) {
            vm.runEvent(entryPoint, [win.getUiId(), value]);
        };
    }

    addFormEvents(component) {
        let vm  = this._vm;
        let win = this._win;
        ['onShow', 'onHide'].forEach(
            function(event) {
                if (event in component) {
                    let entryPoint = this._program.getEventInfo(component[event]);
                    if (entryPoint) {
                        this['_' + event + 'Event'] = function() {
                            vm.runEvent(entryPoint, [win.getUiId()]);
                        };
                    }
                }
            },
            this
        );
    }

    getComponentEvents(component) {
        let vm = this._vm;
        for (let property in component) {
            if (property.substr(0, 2) === 'on') {
                switch (property) {
                    case 'onClick':
                    case 'onFocus':
                    case 'onBlur':
                    case 'onShow':
                    case 'onHide':
                    case 'onMouseDown':
                    case 'onMouseUp':
                    case 'onMouseOut':
                        this.addDefaultEvent(component, property);
                        break;
                    case 'onChange':
                        this.addChangeEvent(component, property);
                        break;
                    default:
                        component[property] = function() {};
                        break;
                }
            }
        }
        return component;
    }

    getChildren(opts) {
        let result = [];
        let componentById = {
                1: result
            };
        opts.data.forEach(
            function(component) {
                let win    = this._win;
                let parent = componentById[component.parentId];
                if (component.type === formEditorConstants.COMPONENT_TYPE_FORM) {
                    this._width  = component.width;
                    this._height = component.height;
                    this._title  = component.title;
                    this.addFormEvents(component);
                } else if (parent) {
                    component.event = win.getUiId() + '_' + parseInt(component.uid, 16);
                    component.id    = win.addComponent.bind(win);
                    component.ui    = this._ui;
                    component.uiId  = this._uiId;
                    component.style = {
                        position: 'absolute',
                        left:     component.x + 'px',
                        top:      (parseInt(component.y, 10) + ((component.parentId === 1) ? 64 : 0)) + 'px'
                    };
                    switch (component.type) {
                        case formEditorConstants.COMPONENT_TYPE_BUTTON:
                            component.type = Button;
                            parent.push(this.getComponentEvents(component));
                            break;
                        case formEditorConstants.COMPONENT_TYPE_LABEL:
                            component.type = Label;
                            parent.push(this.getComponentEvents(component));
                            break;
                        case formEditorConstants.COMPONENT_TYPE_SELECT_BUTTON:
                            component.type = ToolOptions;
                            parent.push(this.getComponentEvents(component));
                            break;
                        case formEditorConstants.COMPONENT_TYPE_CHECKBOX:
                            component.type = CheckboxAndLabel;
                            parent.push(this.getComponentEvents(component));
                            break;
                        case formEditorConstants.COMPONENT_TYPE_STATUS_LIGHT:
                            component.type = StatusLight;
                            parent.push(this.getComponentEvents(component));
                            break;
                        case formEditorConstants.COMPONENT_TYPE_TABS:
                            component.type     = TabPanel;
                            component.children = [];
                            let containerId = component.containerId;
                            containerId.forEach((container) => {
                                let children = [];
                                componentById[container] = children;
                                component.children.push(children);
                            });
                            parent.push(this.getComponentEvents(component));
                            break;
                        case formEditorConstants.COMPONENT_TYPE_RECTANGLE:
                            component.type = Rectangle;
                            parent.push(this.getComponentEvents(component));
                            break;
                        case formEditorConstants.COMPONENT_TYPE_CIRCLE:
                            component.type = Circle;
                            parent.push(this.getComponentEvents(component));
                            break;
                        case formEditorConstants.COMPONENT_TYPE_IMAGE:
                            component.type = Image;
                            parent.push(this.getComponentEvents(component));
                            break;
                    }
                }
            },
            this
        );
        return result;
    }

    setDialogContentElement(element) {
        super.setDialogContentElement(element);
        let height = parseInt(this._height, 10) + 64;
        element.style.marginTop = (height / -2) + 'px';
        element.style.width     = this._width  + 'px';
        element.style.height    = height + 'px';
    }

    onHide() {
        this._onHideEvent && this._onHideEvent();
        super.onHide();
        this._onHide(this._win.getUiId());
    }

    show() {
        this._onShowEvent && this._onShowEvent();
        super.show();
        return this;
    }
};
