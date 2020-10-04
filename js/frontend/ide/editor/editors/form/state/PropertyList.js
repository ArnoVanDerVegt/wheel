/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const formEditorConstants = require('../formEditorConstants');

exports.PropertyList = class {
    constructor(opts) {
        this._componentList   = opts.componentList;
        this._component       = opts.component;
        this._formEditorState = opts.formEditorState;
    }

    getComponentList() {
        return this._componentList;
    }

    getComponentId() {
        return this._component.id;
    }

    getComponentUid() {
        return this._component.uid;
    }

    getList() {
        return [].concat(formEditorConstants.PROPERTIES_BY_TYPE[this._component.type.toUpperCase()].properties);
    }

    getProperty(name) {
        let component = this._component;
        if (name in component) {
            return component[name];
        }
        let properties = formEditorConstants.PROPERTIES_BY_TYPE[component.type.toUpperCase()].properties;
        let info       = null;
        for (let i = 0; i < properties.length; i++) {
            if (properties[i].name === name) {
                info = properties[i];
                break;
            }
        }
        if (!info) {
            return '';
        }
        switch (info.type) {
            case 'boolean':
                return false;
            case 'text':
                if (info.options && (info.options.type === 'number')) {
                    return 0;
                }
                break;
        }
        return '';
    }
};
