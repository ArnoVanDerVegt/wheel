/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const formEditorConstants = require('./formEditorConstants');

exports.ComponentBuilder = class {
    constructor(opts) {
        this._formEditorState = opts.formEditorState;
    }

    addProperty(component, property, value) {
        if (property in component) {
            return this;
        }
        component[property] = value;
        return this;
    }

    addFormComponent(component) {
        component.type       = formEditorConstants.COMPONENT_TYPE_FORM;
        component.properties = [].concat(formEditorConstants.PROPERTIES_BY_TYPE.FORM);
        component.events     = [].concat(formEditorConstants.EVENTS_BY_TYPE.FORM);
        this
            .addProperty(component, 'name',   component.name)
            .addProperty(component, 'title',  component.title)
            .addProperty(component, 'width',  component.width)
            .addProperty(component, 'height', component.height);
        return component;
    }

    addButtonComponent(component) {
        component.type       = formEditorConstants.COMPONENT_TYPE_BUTTON;
        component.properties = [].concat(formEditorConstants.PROPERTIES_BY_TYPE.BUTTON);
        component.events     = [].concat(formEditorConstants.EVENTS_BY_TYPE.BUTTON);
        this
            .addProperty(component, 'name',  this._formEditorState.findComponentText(component.type, 'name', 'Button'))
            .addProperty(component, 'value', component.name)
            .addProperty(component, 'title', component.name)
            .addProperty(component, 'color', 'green');
        return component;
    }

    addSelectButton(component) {
        component.type       = formEditorConstants.COMPONENT_TYPE_SELECT_BUTTON;
        component.properties = [].concat(formEditorConstants.PROPERTIES_BY_TYPE.SELECT_BUTTON);
        component.events     = [].concat(formEditorConstants.EVENTS_BY_TYPE.SELECT_BUTTON);
        this
            .addProperty(component, 'name',    this._formEditorState.findComponentText(component.type, 'name', 'SelectButton'))
            .addProperty(component, 'options', ['A', 'B'])
            .addProperty(component, 'color',   'green');
        return component;
    }

    addLabel(component) {
        component.type       = formEditorConstants.COMPONENT_TYPE_LABEL;
        component.properties = [].concat(formEditorConstants.PROPERTIES_BY_TYPE.LABEL);
        component.events     = [].concat(formEditorConstants.EVENTS_BY_TYPE.LABEL);
        this
            .addProperty(component, 'name', this._formEditorState.findComponentText(component.type, 'name', 'Label'))
            .addProperty(component, 'text', component.name);
        return component;
    }

    addCheckBox(component) {
        component.type       = formEditorConstants.COMPONENT_TYPE_CHECKBOX;
        component.properties = [].concat(formEditorConstants.PROPERTIES_BY_TYPE.CHECKBOX);
        component.events     = [].concat(formEditorConstants.EVENTS_BY_TYPE.CHECKBOX);
        this
            .addProperty(component, 'name',    this._formEditorState.findComponentText(component.type, 'name', 'Checkbox'))
            .addProperty(component, 'text',    component.name)
            .addProperty(component, 'checked', false);
        return component;
    }

    addTabs(component) {
        component.type       = formEditorConstants.COMPONENT_TYPE_TABS;
        component.properties = [].concat(formEditorConstants.PROPERTIES_BY_TYPE.TABS);
        component.events     = [].concat(formEditorConstants.EVENTS_BY_TYPE.TABS);
        this
            .addProperty(component, 'name',        this._formEditorState.findComponentText(component.type, 'name', 'Tabs'))
            .addProperty(component, 'tabs',        ['Tab(1)', 'Tab(2)'])
            .addProperty(component, 'width',       200)
            .addProperty(component, 'height',      128)
            .addProperty(component, 'containerId', [this._formEditorState.peekId(), this._formEditorState.peekId() + 1]);
        return component;
    }

    addComponentForType(component, type) {
        switch (type) {
            case formEditorConstants.COMPONENT_TYPE_BUTTON:        return this.addButtonComponent(component);
            case formEditorConstants.COMPONENT_TYPE_SELECT_BUTTON: return this.addSelectButton   (component);
            case formEditorConstants.COMPONENT_TYPE_LABEL:         return this.addLabel          (component);
            case formEditorConstants.COMPONENT_TYPE_CHECKBOX:      return this.addCheckBox       (component);
            case formEditorConstants.COMPONENT_TYPE_TABS:          return this.addTabs           (component);
        }
        return null;
    }
};
