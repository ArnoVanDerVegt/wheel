/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/

// Component types...
exports.COMPONENT_TYPES_STANDARD     = 'standard';
exports.COMPONENT_TYPES_PANEL        = 'panel';
exports.COMPONENT_TYPES_GRAPHICS     = 'graphics';

// Standard components...
exports.COMPONENT_TYPE_FORM          = 'form';
exports.COMPONENT_TYPE_BUTTON        = 'button';
exports.COMPONENT_TYPE_SELECT_BUTTON = 'selectButton';
exports.COMPONENT_TYPE_LABEL         = 'label';
exports.COMPONENT_TYPE_CHECKBOX      = 'checkbox';
exports.COMPONENT_TYPE_STATUS_LIGHT  = 'statusLight';

// Panel components...
exports.COMPONENT_TYPE_PANEL         = 'panel';
exports.COMPONENT_TYPE_TABS          = 'tabs';

// Graphics components...
exports.COMPONENT_TYPE_RECTANGLE     = 'rectangle';
exports.COMPONENT_TYPE_CIRCLE        = 'circle';
exports.COMPONENT_TYPE_IMAGE         = 'image';

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

const posNumberOrEmptyValidator = function(value) {
        if (value.length < 1) {
            return true;
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

exports.INCLUDE_FOR_COMPONENT = {
        form:         'lib/components/form.whl',
        button:       'lib/components/button.whl',
        selectButton: 'lib/components/selectButton.whl',
        label:        'lib/components/label.whl',
        checkbox:     'lib/components/checkbox.whl',
        statusLight:  'lib/components/statusLight.whl',
        panel:        'lib/components/panel.whl',
        tabs:         'lib/components/tabs.whl',
        rectangle:    'lib/components/rectangle.whl',
        circle:       'lib/components/circle.whl',
        image:        'lib/components/image.whl'
    };

// Component properties...
exports.PROPERTIES_BY_TYPE = {
    FORM: {
        properties: [
            {type: 'type',        name: null},
            {type: 'uid',         name: null},
            {type: 'id',          name: null},
            {type: 'parentId',    name: null},
            {type: 'text',        name: 'name',         options: {validator: nameValidator}},
            {type: 'text',        name: 'title'},
            {type: 'text',        name: 'width',        options: {validator: posNumberValidatorWithMin(128), type: 'number'}},
            {type: 'text',        name: 'height',       options: {validator: posNumberValidatorWithMin(40),  type: 'number'}}
        ],
        events: [
            {
                name: 'onShow',
                code: [
                    '    printS("Show {name} form.")'
                ],
                params: [
                    {name: 'windowHandle', type: 'number', comment: 'The handle to the active window'}
                ]
            },
            {
                name: 'onHide',
                code: [
                '    printS("Hide {name} form.")'
                ],
                params: [
                    {name: 'windowHandle', type: 'number', comment: 'The handle to the active window.'}
                ]
            }
        ]
    },
    BUTTON: {
        properties: [
            {type: 'type',        name: null},
            {type: 'uid',         name: null},
            {type: 'id',          name: null},
            {type: 'parentId',    name: null},
            {type: 'text',        name: 'name',         options: {validator: nameValidator}},
            {type: 'text',        name: 'tabIndex',     options: {validator: posNumberValidator,             type: 'number'}},
            {type: 'boolean',     name: 'hidden'},
            {type: 'boolean',     name: 'disabled'},
            {type: 'text',        name: 'x',            options: {validator: posNumberValidator,             type: 'number'}},
            {type: 'text',        name: 'y',            options: {validator: posNumberValidator,             type: 'number'}},
            {type: 'text',        name: 'width',        options: {validator: posNumberOrEmptyValidator,      type: 'number'}},
            {type: 'text',        name: 'height',       options: {validator: posNumberOrEmptyValidator,      type: 'number'}},
            {type: 'color',       name: 'color'},
            {type: 'text',        name: 'value'},
            {type: 'text',        name: 'title'}
        ],
        events: [
            {
                name: 'onClick',
                code: [
                    '    printS("Click {name} button.")'
                ],
                params: [
                    {name: 'windowHandle', type: 'number', comment: 'The handle to the active window.'}
                ]
            },
            {
                name: 'onFocus',
                code: [
                    '    printS("Focus {name} button.")'
                ],
                params: [
                    {name: 'windowHandle', type: 'number', comment: 'The handle to the active window.'}
                ]
            },
            {
                name: 'onBlur',
                code: [
                    '    printS("Blur {name} button.")'
                ],
                params: [
                    {name: 'windowHandle', type: 'number', comment: 'The handle to the active window.'}
                ]
            },
            {
                name: 'onMouseDown',
                code: [
                    '    printS("Mousedown {name} button.")'
                ],
                params: [
                    {name: 'windowHandle', type: 'number', comment: 'The handle to the active window.'}
                ]
            },
            {
                name: 'onMouseUp',
                code: [
                    '    printS("Mouseup {name} button.")'
                ],
                params: [
                    {name: 'windowHandle', type: 'number', comment: 'The handle to the active window.'}
                ]
            },
            {
                name: 'onMouseOut',
                code: [
                    '    printS("Mouseout {name} button.")'
                ],
                params: [
                    {name: 'windowHandle', type: 'number', comment: 'The handle to the active window.'}
                ]
            }
        ]
    },
    SELECTBUTTON: {
        properties: [
            {type: 'type',        name: null},
            {type: 'uid',         name: null},
            {type: 'id',          name: null},
            {type: 'parentId',    name: null},
            {type: 'text',        name: 'name',         options: {validator: nameValidator}},
            {type: 'text',        name: 'tabIndex',     options: {validator: posNumberValidator,             type: 'number'}},
            {type: 'boolean',     name: 'hidden'},
            {type: 'boolean',     name: 'disabled'},
            {type: 'text',        name: 'x',            options: {validator: posNumberValidator,             type: 'number'}},
            {type: 'text',        name: 'y',            options: {validator: posNumberValidator,             type: 'number'}},
            {type: 'color',       name: 'color'},
            {type: 'textList',    name: 'options',      options: {sort: true, remove: true}}
        ],
        events: [
            {
                name: 'onChange',
                code: [
                    '    printS("Change {name} select button, value:")',
                    '    printN(value)'
                ],
                params: [
                    {name: 'windowHandle', type: 'number', comment: 'The handle to the active window.'},
                    {name: 'value',        type: 'number', comment: 'New active button.'}
                ]
            },
            {
                name: 'onFocus',
                code: [
                    '    printS("Focus {name} select button.")'
                ],
                params: [
                    {name: 'windowHandle', type: 'number', comment: 'The handle to the active window.'}
                ]
            },
            {
                name: 'onBlur',
                code: [
                    '    printS("Blur {name} select button.")'
                ],
                params: [
                    {name: 'windowHandle', type: 'number', comment: 'The handle to the active window.'}
                ]
            }
        ]
    },
    LABEL: {
        properties: [
            {type: 'type',        name: null},
            {type: 'uid',         name: null},
            {type: 'id',          name: null},
            {type: 'parentId',    name: null},
            {type: 'text',        name: 'name',         options: {validator: nameValidator}},
            {type: 'text',        name: 'tabIndex',     options: {validator: posNumberValidator,             type: 'number'}},
            {type: 'boolean',     name: 'hidden'},
            {type: 'text',        name: 'x',            options: {validator: posNumberValidator,             type: 'number'}},
            {type: 'text',        name: 'y',            options: {validator: posNumberValidator,             type: 'number'}},
            {type: 'text',        name: 'width',        options: {validator: posNumberOrEmptyValidator,      type: 'number'}},
            {type: 'halign',      name: 'halign'},
            {type: 'text',        name: 'text'},
            {type: 'text',        name: 'value'}
        ]
    },
    CHECKBOX: {
        properties: [
            {type: 'type',        name: null},
            {type: 'id',          name: null},
            {type: 'parentId',    name: null},
            {type: 'text',        name: 'name',         options: {validator: nameValidator}},
            {type: 'text',        name: 'tabIndex',     options: {validator: posNumberValidator,             type: 'number'}},
            {type: 'boolean',     name: 'hidden'},
            {type: 'boolean',     name: 'disabled'},
            {type: 'text',        name: 'x',            options: {validator: posNumberValidator,             type: 'number'}},
            {type: 'text',        name: 'y',            options: {validator: posNumberValidator,             type: 'number'}},
            {type: 'text',        name: 'text'},
            {type: 'boolean',     name: 'checked'}
        ],
        events: [
            {
                name: 'onChange',
                code: [
                    '    printS("Change {name} checkbox, value:")',
                    '    printN(value)'
                ],
                params: [
                    {name: 'windowHandle', type: 'number', comment: 'The handle to the active window.'},
                    {name: 'value',        type: 'number', comment: 'The checkbox value.'}
                ]
            },
            {
                name: 'onFocus',
                code: [
                    '    printS("Focus {name} select checkbox.")'
                ],
                params: [
                    {name: 'windowHandle', type: 'number', comment: 'The handle to the active window.'}
                ]
            },
            {
                name: 'onBlur',
                code: [
                    '    printS("Blur {name} select checkbox.")'
                ],
                params: [
                    {name: 'windowHandle', type: 'number', comment: 'The handle to the active window.'}
                ]
            }
        ]
    },
    STATUSLIGHT: {
        properties: [
            {type: 'type',        name: null},
            {type: 'id',          name: null},
            {type: 'parentId',    name: null},
            {type: 'text',        name: 'name',         options: {validator: nameValidator}},
            {type: 'boolean',     name: 'hidden'},
            {type: 'text',        name: 'x',            options: {validator: posNumberValidator,             type: 'number'}},
            {type: 'text',        name: 'y',            options: {validator: posNumberValidator,             type: 'number'}},
            {type: 'color',       name: 'color'},
            {type: 'boolean',     name: 'rgbColor'},
            {type: 'rgb',         name: 'rgb'}
        ],
        events: [
        ]
    },
    PANEL: {
        properties: [
            {type: 'type',        name: null},
            {type: 'uid',         name: null},
            {type: 'id',          name: null},
            {type: 'parentId',    name: null},
            {type: 'containerId', name: null},
            {type: 'text',        name: 'name',         options: {validator: nameValidator}},
            {type: 'text',        name: 'tabIndex',     options: {validator: posNumberValidator,             type: 'number'}},
            {type: 'boolean',     name: 'hidden'},
            {type: 'text',        name: 'x',            options: {validator: posNumberValidator,             type: 'number'}},
            {type: 'text',        name: 'y',            options: {validator: posNumberValidator,             type: 'number'}},
            {type: 'text',        name: 'width',        options: {validator: posNumberValidatorWithMin(128), type: 'number'}},
            {type: 'text',        name: 'height',       options: {validator: posNumberValidatorWithMin(40),  type: 'number'}}
        ]
    },
    TABS: {
        properties: [
            {type: 'type',        name: null},
            {type: 'uid',         name: null},
            {type: 'id',          name: null},
            {type: 'parentId',    name: null},
            {type: 'containerId', name: null},
            {type: 'text',        name: 'name',         options: {validator: nameValidator}},
            {type: 'text',        name: 'tabIndex',     options: {validator: posNumberValidator,             type: 'number'}},
            {type: 'boolean',     name: 'hidden'},
            {type: 'text',        name: 'x',            options: {validator: posNumberValidator,             type: 'number'}},
            {type: 'text',        name: 'y',            options: {validator: posNumberValidator,             type: 'number'}},
            {type: 'text',        name: 'width',        options: {validator: posNumberValidatorWithMin(128), type: 'number'}},
            {type: 'text',        name: 'height',       options: {validator: posNumberValidatorWithMin(40),  type: 'number'}},
            {type: 'textList',    name: 'tabs',         options: {removeLast: true}}
        ],
        events: [
            {
                name: 'onChange',
                code: [
                    '    printS("Change {name} tabs, value:")',
                    '    printN(value)'
                ],
                params: [
                    {name: 'windowHandle', type: 'number', comment: 'The handle to the active window.'},
                    {name: 'value',        type: 'number', comment: 'The active tab.'}
                ]
            },
            {
                name: 'onFocus',
                code: [
                    '    printS("Focus {name} tabs.")'
                ],
                params: [
                    {name: 'windowHandle', type: 'number', comment: 'The handle to the active window.'}
                ]
            },
            {
                name: 'onBlur',
                code: [
                    '    printS("Blur {name} tabs.")'
                ],
                params: [
                    {name: 'windowHandle', type: 'number', comment: 'The handle to the active window.'}
                ]
            }
        ]
    },
    RECTANGLE: {
        properties: [
            {type: 'type',        name: null},
            {type: 'uid',         name: null},
            {type: 'id',          name: null},
            {type: 'parentId',    name: null},
            {type: 'text',        name: 'name',         options: {validator: nameValidator}},
            {type: 'boolean',     name: 'hidden'},
            {type: 'text',        name: 'x',            options: {validator: posNumberValidator,             type: 'number'}},
            {type: 'text',        name: 'y',            options: {validator: posNumberValidator,             type: 'number'}},
            {type: 'text',        name: 'width',        options: {validator: posNumberValidator,             type: 'number'}},
            {type: 'text',        name: 'height',       options: {validator: posNumberValidator,             type: 'number'}},
            {type: 'rgb',         name: 'fillColor'},
            {type: 'rgb',         name: 'borderColor'},
            {type: 'text',        name: 'borderWidth',  options: {validator: posNumberValidator,             type: 'number'}},
            {type: 'text',        name: 'borderRadius', options: {validator: posNumberValidator,             type: 'number'}}
        ],
        events: [
            {
                name: 'onClick',
                code: [
                    '    printS("Click {name} rectangle.")'
                ],
                params: [
                    {name: 'windowHandle', type: 'number', comment: 'The handle to the active window.'}
                ]
            },
            {
                name: 'onMouseDown',
                code: [
                    '    printS("Mousedown {name} rectangle.")'
                ],
                params: [
                    {name: 'windowHandle', type: 'number', comment: 'The handle to the active window.'}
                ]
            },
            {
                name: 'onMouseUp',
                code: [
                    '    printS("Mouseup {name} rectangle.")'
                ],
                params: [
                    {name: 'windowHandle', type: 'number', comment: 'The handle to the active window.'}
                ]
            },
            {
                name: 'onMouseMove',
                code: [
                    '    printS("Mousemove {name} rectangle.")'
                ],
                params: [
                    {name: 'windowHandle', type: 'number', comment: 'The handle to the active window.'}
                ]
            },
            {
                name: 'onMouseOut',
                code: [
                    '    printS("Mouseout {name} rectangle.")'
                ],
                params: [
                    {name: 'windowHandle', type: 'number', comment: 'The handle to the active window.'}
                ]
            }
        ]
    },
    CIRCLE: {
        properties: [
            {type: 'type',        name: null},
            {type: 'uid',         name: null},
            {type: 'id',          name: null},
            {type: 'parentId',    name: null},
            {type: 'text',        name: 'name',         options: {validator: nameValidator}},
            {type: 'boolean',     name: 'hidden'},
            {type: 'text',        name: 'x',            options: {validator: posNumberValidator,             type: 'number'}},
            {type: 'text',        name: 'y',            options: {validator: posNumberValidator,             type: 'number'}},
            {type: 'text',        name: 'radius',       options: {validator: posNumberValidator,             type: 'number'}},
            {type: 'rgb',         name: 'fillColor'},
            {type: 'rgb',         name: 'borderColor'},
            {type: 'text',        name: 'borderWidth',  options: {validator: posNumberValidator,             type: 'number'}}
        ],
        events: [
            {
                name: 'onClick',
                code: [
                    '    printS("Click {name} circle.")'
                ],
                params: [
                    {name: 'windowHandle', type: 'number', comment: 'The handle to the active window.'}
                ]
            },
            {
                name: 'onMouseDown',
                code: [
                    '    printS("Mousedown {name} circle.")'
                ],
                params: [
                    {name: 'windowHandle', type: 'number', comment: 'The handle to the active window.'}
                ]
            },
            {
                name: 'onMouseUp',
                code: [
                    '    printS("Mouseup {name} circle.")'
                ],
                params: [
                    {name: 'windowHandle', type: 'number', comment: 'The handle to the active window.'}
                ]
            },
            {
                name: 'onMouseMove',
                code: [
                    '    printS("Mousemove {name} circle.")'
                ],
                params: [
                    {name: 'windowHandle', type: 'number', comment: 'The handle to the active window.'}
                ]
            },
            {
                name: 'onMouseOut',
                code: [
                    '    printS("Mouseout {name} circle.")'
                ],
                params: [
                    {name: 'windowHandle', type: 'number', comment: 'The handle to the active window.'}
                ]
            }
        ]
    },
    IMAGE: {
        properties: [
            {type: 'type',        name: null},
            {type: 'uid',         name: null},
            {type: 'id',          name: null},
            {type: 'parentId',    name: null},
            {type: 'text',        name: 'name',         options: {validator: nameValidator}},
            {type: 'boolean',     name: 'hidden'},
            {type: 'text',        name: 'x',            options: {validator: posNumberValidator,             type: 'number'}},
            {type: 'text',        name: 'y',            options: {validator: posNumberValidator,             type: 'number'}},
            {type: 'text',        name: 'width',        options: {validator: posNumberValidator,             type: 'number'}},
            {type: 'text',        name: 'height',       options: {validator: posNumberValidator,             type: 'number'}},
            {type: 'text',        name: 'src'}
        ],
        events: [
            {
                name: 'onClick',
                code: [
                    '    printS("Click {name} image.")'
                ],
                params: [
                    {name: 'windowHandle', type: 'number', comment: 'The handle to the active window.'}
                ]
            },
            {
                name: 'onMouseDown',
                code: [
                    '    printS("Mousedown {name} image.")'
                ],
                params: [
                    {name: 'windowHandle', type: 'number', comment: 'The handle to the active window.'}
                ]
            },
            {
                name: 'onMouseUp',
                code: [
                    '    printS("Mouseup {name} image.")'
                ],
                params: [
                    {name: 'windowHandle', type: 'number', comment: 'The handle to the active window.'}
                ]
            },
            {
                name: 'onMouseMove',
                code: [
                    '    printS("Mousemove {name} image.")'
                ],
                params: [
                    {name: 'windowHandle', type: 'number', comment: 'The handle to the active window.'}
                ]
            },
            {
                name: 'onMouseOut',
                code: [
                    '    printS("Mouseout {name} image.")'
                ],
                params: [
                    {name: 'windowHandle', type: 'number', comment: 'The handle to the active window.'}
                ]
            }
        ]
    }
};
