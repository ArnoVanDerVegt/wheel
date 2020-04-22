/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/

// Component types...
exports.COMPONENT_TYPE_FORM          = 'form';
exports.COMPONENT_TYPE_BUTTON        = 'button';
exports.COMPONENT_TYPE_SELECT_BUTTON = 'selectButton';
exports.COMPONENT_TYPE_LABEL         = 'label';
exports.COMPONENT_TYPE_CHECKBOX      = 'checkbox';
exports.COMPONENT_TYPE_TABS          = 'tabs';

// Edit actions for undo...
exports.ACTION_ADD_COMPONENT         = 0;
exports.ACTION_DELETE_COMPONENT      = 1;
exports.ACTION_TAB_ADD_TAB           = 2;
exports.ACTION_TAB_DELETE_TAB        = 3;
exports.ACTION_CHANGE_POSITION       = 4;
exports.ACTION_CHANGE_PROPERTY       = 5;

const NUMERIC                        = '0123456789';
const ALPHA                          = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const ALPHA_NUMERIC                  = ALPHA + NUMERIC;

const nameValidator = function(value) {
        if ((value.length < 3) || (NUMERIC.indexOf(value[0]) !== -1)) {
            return false;
        }
        value = value.toUpperCase();
        for (let i = 0; i < value.length; i++) {
            if (ALPHA_NUMERIC.indexOf(value[i]) === -1) {
                return false;
            }
        }
        return true;
    };

const posNumberValidator = function(value) {
        if (value.length < 1) {
            return false;
        }
        for (let i = 0; i < value.length; i++) {
            if (NUMERIC.indexOf(value[i]) === -1) {
                return false;
            }
        }
        return true;
    };

const numberValidator = function(value) {
        if (!value.length || ((value.length === 1) && (NUMERIC.indexOf(value) === -1))) {
            return false;
        }
        let start = (value[0] === '-') ? 1 : 0;
        for (let i = start; i < value.length; i++) {
            if (NUMERIC.indexOf(value[i]) === -1) {
                return false;
            }
        }
        return true;
    };

const posNumberValidatorWithMin = function(min) {
        return function(value) {
            let result = posNumberValidator(value);
            return result && (parseInt(value, 10) >= min);
        };
    };

// Component properties...
exports.PROPERTIES_BY_TYPE = {
    FORM: [
        {type: 'type',        name: null},
        {type: 'uid',         name: null},
        {type: 'id',          name: null},
        {type: 'parentId',    name: null},
        {type: 'text',        name: 'name',     options: {validator: nameValidator}},
        {type: 'text',        name: 'title'},
        {type: 'text',        name: 'width',    options: {validator: posNumberValidatorWithMin(128), type: 'number'}},
        {type: 'text',        name: 'height',   options: {validator: posNumberValidatorWithMin(40),  type: 'number'}}
    ],
    BUTTON: [
        {type: 'type',        name: null},
        {type: 'uid',         name: null},
        {type: 'id',          name: null},
        {type: 'parentId',    name: null},
        {type: 'text',        name: 'name',     options: {validator: nameValidator}},
        {type: 'text',        name: 'tabIndex', options: {validator: posNumberValidator,             type: 'number'}},
        {type: 'boolean',     name: 'hidden'},
        {type: 'boolean',     name: 'disabled'},
        {type: 'text',        name: 'x',        options: {validator: posNumberValidator,             type: 'number'}},
        {type: 'text',        name: 'y',        options: {validator: posNumberValidator,             type: 'number'}},
        {type: 'color',       name: 'color'},
        {type: 'text',        name: 'value'},
        {type: 'text',        name: 'title'}
    ],
    SELECTBUTTON: [
        {type: 'type',        name: null},
        {type: 'uid',         name: null},
        {type: 'id',          name: null},
        {type: 'parentId',    name: null},
        {type: 'text',        name: 'name',     options: {validator: nameValidator}},
        {type: 'text',        name: 'tabIndex', options: {validator: posNumberValidator,             type: 'number'}},
        {type: 'boolean',     name: 'hidden'},
        {type: 'boolean',     name: 'disabled'},
        {type: 'text',        name: 'x',        options: {validator: posNumberValidator,             type: 'number'}},
        {type: 'text',        name: 'y',        options: {validator: posNumberValidator,             type: 'number'}},
        {type: 'color',       name: 'color'},
        {type: 'textList',    name: 'options',  options: {sort: true, remove: true}}
    ],
    LABEL: [
        {type: 'type',        name: null},
        {type: 'uid',         name: null},
        {type: 'id',          name: null},
        {type: 'parentId',    name: null},
        {type: 'text',        name: 'name',     options: {validator: nameValidator}},
        {type: 'text',        name: 'tabIndex', options: {validator: posNumberValidator,             type: 'number'}},
        {type: 'boolean',     name: 'hidden'},
        {type: 'text',        name: 'x',        options: {validator: posNumberValidator,             type: 'number'}},
        {type: 'text',        name: 'y',        options: {validator: posNumberValidator,             type: 'number'}},
        {type: 'text',        name: 'text'}
    ],
    CHECKBOX: [
        {type: 'type',        name: null},
        {type: 'id',          name: null},
        {type: 'parentId',    name: null},
        {type: 'text',        name: 'name',     options: {validator: nameValidator}},
        {type: 'text',        name: 'tabIndex', options: {validator: posNumberValidator,             type: 'number'}},
        {type: 'boolean',     name: 'hidden'},
        {type: 'boolean',     name: 'disabled'},
        {type: 'text',        name: 'x',        options: {validator: posNumberValidator,             type: 'number'}},
        {type: 'text',        name: 'y',        options: {validator: posNumberValidator,             type: 'number'}},
        {type: 'text',        name: 'text'},
        {type: 'boolean',     name: 'checked'}
    ],
    TABS: [
        {type: 'type',        name: null},
        {type: 'uid',         name: null},
        {type: 'id',          name: null},
        {type: 'parentId',    name: null},
        {type: 'containerId', name: null},
        {type: 'text',        name: 'name',     options: {validator: nameValidator}},
        {type: 'text',        name: 'tabIndex', options: {validator: posNumberValidator,             type: 'number'}},
        {type: 'boolean',     name: 'hidden'},
        {type: 'text',        name: 'x',        options: {validator: posNumberValidator,             type: 'number'}},
        {type: 'text',        name: 'y',        options: {validator: posNumberValidator,             type: 'number'}},
        {type: 'text',        name: 'width',    options: {validator: posNumberValidatorWithMin(128), type: 'number'}},
        {type: 'text',        name: 'height',   options: {validator: posNumberValidatorWithMin(40),  type: 'number'}},
        {type: 'textList',    name: 'tabs',     options: {removeLast: true}}
    ]
};

// Component properties...
exports.EVENTS_BY_TYPE = {
    FORM: [
        {name: 'onShow',   params: ['windowHandle']},
        {name: 'onHide',   params: ['windowHandle']}
    ],
    BUTTON: [
        {name: 'onClick',  params: ['windowHandle']},
        {name: 'onFocus',  params: ['windowHandle']},
        {name: 'onBlur',   params: ['windowHandle']}
    ],
    SELECTBUTTON: [
        {name: 'onChange', params: ['windowHandle', 'value']},
        {name: 'onFocus',  params: ['windowHandle']},
        {name: 'onBlur',   params: ['windowHandle']}
    ],
    LABEL: [
    ],
    CHECKBOX: [
        {name: 'onChange', params: ['windowHandle', 'value']},
        {name: 'onFocus',  params: ['windowHandle']},
        {name: 'onBlur',   params: ['windowHandle']}
    ],
    TABS: [
        {name: 'onChange', params: ['windowHandle', 'value']},
        {name: 'onFocus',  params: ['windowHandle']},
        {name: 'onBlur',   params: ['windowHandle']}
    ]
};
