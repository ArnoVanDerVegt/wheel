/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const Emitter             = require('../../../../../lib/Emitter').Emitter;
const formEditorConstants = require('../formEditorConstants');

exports.FormEditorToolbarState = class extends Emitter {
    constructor(opts) {
        super(opts);
        this._componentTypes        = formEditorConstants.COMPONENT_TYPES_INPUT;
        this._inputComponent        = formEditorConstants.COMPONENT_TYPE_BUTTON;
        this._textComponent         = formEditorConstants.COMPONENT_TYPE_LABEL;
        this._panelComponent        = formEditorConstants.COMPONENT_TYPE_TABS;
        this._graphicsComponent     = formEditorConstants.COMPONENT_TYPE_RECTANGLE;
        this._statusComponent       = formEditorConstants.COMPONENT_TYPE_STATUS_LIGHT;
        this._ioComponent           = formEditorConstants.COMPONENT_TYPE_PU_DEVICE;
        this._dialogComponent       = formEditorConstants.COMPONENT_TYPE_ALERT_DIALOG;
        this._nonVisualComponent    = formEditorConstants.COMPONENT_TYPE_INTERVAL;
    }

    getComponentTypes() {
        return this._componentTypes;
    }

    /**
     * Select the types of component: COMPONENT_TYPES_STANDARD, COMPONENT_TYPES_GRAPHICS
    **/
    setComponentTypes(componentTypes) {
        this._componentTypes = componentTypes;
    }

    getActiveAddComponentType() {
        switch (this._componentTypes) {
            case formEditorConstants.COMPONENT_TYPES_INPUT:      return this._inputComponent;
            case formEditorConstants.COMPONENT_TYPES_TEXT:       return this._textComponent;
            case formEditorConstants.COMPONENT_TYPES_PANEL:      return this._panelComponent;
            case formEditorConstants.COMPONENT_TYPES_GRAPHICS:   return this._graphicsComponent;
            case formEditorConstants.COMPONENT_TYPES_STATUS:     return this._statusComponent;
            case formEditorConstants.COMPONENT_TYPES_IO:         return this._ioComponent;
            case formEditorConstants.COMPONENT_TYPES_DIALOG:     return this._dialogComponent;
            case formEditorConstants.COMPONENT_TYPES_NON_VISUAL: return this._nonVisualComponent;
        }
        return formEditorConstants.COMPONENT_TYPE_BUTTON;
    }

    getActiveComponentIndices() {
        switch (this._componentTypes) {
            case formEditorConstants.COMPONENT_TYPES_INPUT:
                return {toolGroup: 0, toolIndex: formEditorConstants.INPUT_COMPONENTS.indexOf(this._inputComponent)};
            case formEditorConstants.COMPONENT_TYPES_TEXT:
                return {toolGroup: 1, toolIndex: formEditorConstants.TEXT_COMPONENTS.indexOf(this._textComponent)};
            case formEditorConstants.COMPONENT_TYPES_PANEL:
                return {toolGroup: 2, toolIndex: formEditorConstants.PANEL_COMPONENTS.indexOf(this._panelComponent)};
            case formEditorConstants.COMPONENT_TYPES_GRAPHICS:
                return {toolGroup: 3, toolIndex: formEditorConstants.GRAPHICS_COMPONENTS.indexOf(this._graphicsComponent)};
            case formEditorConstants.COMPONENT_TYPES_STATUS:
                return {toolGroup: 4, toolIndex: formEditorConstants.STATUS_COMPONENTS.indexOf(this._statusComponent)};
            case formEditorConstants.IO_DISPLAY_COMPONENTS:
                return {toolGroup: 5, toolIndex: formEditorConstants.IO_DISPLAY_COMPONENTS.indexOf(this._ioComponent)};
            case formEditorConstants.DIALOG_COMPONENTS:
                return {toolGroup: 6, toolIndex: formEditorConstants.DIALOG_COMPONENTS.indexOf(this._dialogComponent)};
            case formEditorConstants.NON_VISUAL_COMPONENTS:
                return {toolGroup: 7, toolIndex: formEditorConstants.NON_VISUAL_COMPONENTS.indexOf(this._nonVisualComponent)};
        }
        return {toolGroup: 0, toolIndex: 0};
    }

    setInputComponent(inputComponent) {
        this._inputComponent = inputComponent;
    }

    setTextComponent(textComponent) {
        this._textComponent = textComponent;
    }

    setPanelComponent(panelComponent) {
        this._panelComponent = panelComponent;
    }

    setGraphicsComponent(graphicsComponent) {
        this._graphicsComponent = graphicsComponent;
    }

    setStatusComponent(statusComponent) {
        this._statusComponent = statusComponent;
    }

    setIOComponent(ioComponent) {
        this._ioComponent = ioComponent;
    }

    setDialogComponent(dialogComponent) {
        this._dialogComponent = dialogComponent;
    }

    setNonVisualComponent(nonVisualComponent) {
        this._nonVisualComponent = nonVisualComponent;
    }
};
