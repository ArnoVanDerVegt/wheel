/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const Dialog              = require('../../../lib/components/Dialog').Dialog;
const Button              = require('../../../lib/components/Button').Button;
const TabPanel            = require('../../../lib/components/TabPanel').TabPanel;
const getImage            = require('../../data/images').getImage;
const formEditorConstants = require('../../editor/editors/form/formEditorConstants');

let uiId = 1240;

exports.FormDialog = class extends Dialog {
    constructor(opts) {
        opts.getImage = getImage;
        opts.uiId     = uiId++;
        super(opts);
        this._title  = '';
        this._width  = 300;
        this._height = 300;
        let children = this.getChildren(opts);
        this.createWindow('form-dialog', this._title, children);
    }

    getChildren(opts) {
        let result = [];
        let componentById = {
                1: result
            };
        opts.data.forEach(
            function(component) {
                let parent = componentById[component.parentId];
                if (component.type === formEditorConstants.COMPONENT_TYPE_FORM) {
                    this._width  = component.width;
                    this._height = component.height;
                    this._title  = component.title;
                } else if (parent) {
                    component.ui    = this._ui;
                    component.uiId  = this._uiId;
                    component.style = {
                        position: 'absolute',
                        left:     component.x + 'px',
                        top:      (component.y + ((component.parentId === 1) ? 64 : 0)) + 'px'
                    };
                    switch (component.type) {
                        case formEditorConstants.COMPONENT_TYPE_BUTTON:
                            component.type = Button;
                            parent.push(component);
                            break;
                        case formEditorConstants.COMPONENT_TYPE_TABS:
                            component.type     = TabPanel;
                            component.children = [];
                            let containerId = component.containerId;
                            containerId.forEach(function(container) {
                                let children = [];
                                componentById[container] = children;
                                component.children.push(children);
                            });
                            parent.push(component);
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
        let height = this._height + 64;
        element.style.marginTop = (height / -2) + 'px';
        element.style.width     = this._width  + 'px';
        element.style.height    = height + 'px';
    }
};
