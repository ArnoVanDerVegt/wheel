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

// Component properties...
exports.PROPERTIES_BY_TYPE           = {
    FORM: [
        {type: 'type',        name: null},
        {type: 'uid',         name: null},
        {type: 'id',          name: null},
        {type: 'parentId',    name: null},
        {type: 'string',      name: 'name'},
        {type: 'string',      name: 'title'},
        {type: 'integer',     name: 'width'},
        {type: 'integer',     name: 'height'}
    ],
    BUTTON: [
        {type: 'type',        name: null},
        {type: 'uid',         name: null},
        {type: 'id',          name: null},
        {type: 'parentId',    name: null},
        {type: 'string',      name: 'name'},
        {type: 'integer',     name: 'tabIndex'},
        {type: 'boolean',     name: 'hidden'},
        {type: 'boolean',     name: 'disabled'},
        {type: 'integer',     name: 'x'},
        {type: 'integer',     name: 'y'},
        {type: 'color',       name: 'color'},
        {type: 'string',      name: 'value'},
        {type: 'string',      name: 'title'}
    ],
    SELECT_BUTTON: [
        {type: 'type',        name: null},
        {type: 'uid',         name: null},
        {type: 'id',          name: null},
        {type: 'parentId',    name: null},
        {type: 'string',      name: 'name'},
        {type: 'integer',     name: 'tabIndex'},
        {type: 'boolean',     name: 'hidden'},
        {type: 'boolean',     name: 'disabled'},
        {type: 'integer',     name: 'x'},
        {type: 'integer',     name: 'y'},
        {type: 'color',       name: 'color'},
        {type: 'stringList',  name: 'options', options: {sort: true, remove: true}}
    ],
    LABEL: [
        {type: 'type',        name: null},
        {type: 'uid',         name: null},
        {type: 'id',          name: null},
        {type: 'parentId',    name: null},
        {type: 'string',      name: 'name'},
        {type: 'integer',     name: 'tabIndex'},
        {type: 'boolean',     name: 'hidden'},
        {type: 'integer',     name: 'x'},
        {type: 'integer',     name: 'y'},
        {type: 'string',      name: 'text'}
    ],
    CHECKBOX: [
        {type: 'type',        name: null},
        {type: 'id',          name: null},
        {type: 'parentId',    name: null},
        {type: 'string',      name: 'name'},
        {type: 'integer',     name: 'tabIndex'},
        {type: 'boolean',     name: 'hidden'},
        {type: 'boolean',     name: 'disabled'},
        {type: 'integer',     name: 'x'},
        {type: 'integer',     name: 'y'},
        {type: 'string',      name: 'text'},
        {type: 'boolean',     name: 'checked'}
    ],
    TABS: [
        {type: 'type',        name: null},
        {type: 'uid',         name: null},
        {type: 'id',          name: null},
        {type: 'parentId',    name: null},
        {type: 'containerId', name: null},
        {type: 'string',      name: 'name'},
        {type: 'integer',     name: 'tabIndex'},
        {type: 'boolean',     name: 'hidden'},
        {type: 'integer',     name: 'x'},
        {type: 'integer',     name: 'y'},
        {type: 'integer',     name: 'width'},
        {type: 'integer',     name: 'height'},
        {type: 'stringList',  name: 'tabs', options: {removeLast: true}}
    ]
};

// Component properties...
exports.EVENTS_BY_TYPE               = {
    FORM: [
        {name: 'onShow'},
        {name: 'onHide'}
    ],
    BUTTON: [
        {name: 'onClick'},
        {name: 'onFocus'},
        {name: 'onBlur'}
    ],
    SELECT_BUTTON: [
        {name: 'onSelect', params: ['index']},
        {name: 'onFocus'},
        {name: 'onBlur'}
    ],
    LABEL: [
    ],
    CHECKBOX: [
        {name: 'onClick',  params: ['value']},
        {name: 'onFocus'},
        {name: 'onBlur'}
    ],
    TABS: [
        {name: 'onSelect', params: ['index']},
        {name: 'onFocus'},
        {name: 'onBlur'}
    ]
};
