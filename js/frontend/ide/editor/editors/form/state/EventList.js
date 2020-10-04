/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const formEditorConstants = require('../formEditorConstants');

exports.EventList = class {
    constructor(opts) {
        this._component       = opts.component;
        this._formEditorState = opts.formEditorState;
    }

    getComponentId() {
        return this._component.id;
    }

    getComponentUid() {
        return this._component.uid;
    }

    getComponentName () {
        return this._component.name;
    }

    getFormName() {
        return this._formEditorState.getFormName();
    }

    getList() {
        return [].concat(formEditorConstants.PROPERTIES_BY_TYPE[this._component.type.toUpperCase()].events);
    }

    getEvent(name) {
        return this._component[name] || '';
    }

    getEventName(name) {
        let formName      = this.getFormName();
        let componentName = this.getComponentName();
        return 'on' +
            formName.substr(0, 1).toUpperCase() + formName.substr(1 - formName.length) +
            componentName.substr(0, 1).toUpperCase() + componentName.substr(1 - componentName.length) +
            name.substr(2 - name.length);
    }

    getUpdatedEvents() {
        let list   = this.getList();
        let result = {};
        list.forEach(
            function(event) {
                result[event.name] = this.getEventName(event.name);
            },
            this
        );
        return result;
    }
};
