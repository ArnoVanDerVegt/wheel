/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/

// Component types...
exports.COMPONENT_TYPES_INPUT        = 'input';
exports.COMPONENT_TYPES_TEXT         = 'text';
exports.COMPONENT_TYPES_PANEL        = 'panel';
exports.COMPONENT_TYPES_GRAPHICS     = 'graphics';
exports.COMPONENT_TYPES_STATUS       = 'status';
exports.COMPONENT_TYPES_IO           = 'io';
exports.COMPONENT_TYPES_NON_VISUAL   = 'nonVisual';

exports.COMPONENT_TYPE_FORM          = 'form';

// Input components...
exports.COMPONENT_TYPE_BUTTON        = 'button';
exports.COMPONENT_TYPE_SELECT_BUTTON = 'selectButton';
exports.COMPONENT_TYPE_CHECKBOX      = 'checkbox';
exports.COMPONENT_TYPE_RADIO         = 'radio';
exports.COMPONENT_TYPE_DROPDOWN      = 'dropdown';
exports.COMPONENT_TYPE_TEXT_INPUT    = 'textInput';
exports.COMPONENT_TYPE_SLIDER        = 'slider';

exports.INPUT_COMPONENTS             = [
    exports.COMPONENT_TYPE_BUTTON,
    exports.COMPONENT_TYPE_SELECT_BUTTON,
    exports.COMPONENT_TYPE_CHECKBOX,
    exports.COMPONENT_TYPE_RADIO,
    exports.COMPONENT_TYPE_DROPDOWN,
    exports.COMPONENT_TYPE_TEXT_INPUT,
    exports.COMPONENT_TYPE_SLIDER
];

// Text components...
exports.COMPONENT_TYPE_LABEL         = 'label';
exports.COMPONENT_TYPE_TITLE         = 'title';
exports.COMPONENT_TYPE_TEXT          = 'text';
exports.COMPONENT_TYPE_LIST_ITEMS    = 'listItems';

exports.TEXT_COMPONENTS = [
    exports.COMPONENT_TYPE_LABEL,
    exports.COMPONENT_TYPE_TITLE,
    exports.COMPONENT_TYPE_TEXT,
    exports.COMPONENT_TYPE_LIST_ITEMS
];

// Panel components...
exports.COMPONENT_TYPE_PANEL         = 'panel';
exports.COMPONENT_TYPE_TABS          = 'tabs';

exports.PANEL_COMPONENTS = [
    exports.COMPONENT_TYPE_PANEL,
    exports.COMPONENT_TYPE_TABS
];

// Graphics components...
exports.COMPONENT_TYPE_RECTANGLE     = 'rectangle';
exports.COMPONENT_TYPE_CIRCLE        = 'circle';
exports.COMPONENT_TYPE_IMAGE         = 'image';

exports.GRAPHICS_COMPONENTS = [
    exports.COMPONENT_TYPE_RECTANGLE,
    exports.COMPONENT_TYPE_CIRCLE,
    exports.COMPONENT_TYPE_IMAGE
];

// Status components...
exports.COMPONENT_TYPE_STATUS_LIGHT  = 'statusLight';
exports.COMPONENT_TYPE_PROGRESS_BAR  = 'progressBar';
exports.COMPONENT_TYPE_LOADING_DOTS  = 'loadingDots';

exports.STATUS_COMPONENTS = [
    exports.COMPONENT_TYPE_STATUS_LIGHT,
    exports.COMPONENT_TYPE_PROGRESS_BAR,
    exports.COMPONENT_TYPE_LOADING_DOTS
];

// Sensor/motor components...
exports.COMPONENT_TYPE_PU_DEVICE     = 'puDevice';
exports.COMPONENT_TYPE_EV3_MOTOR     = 'ev3Motor';
exports.COMPONENT_TYPE_EV3_SENSOR    = 'ev3Sensor';

exports.IO_DISPLAY_COMPONENTS = [
    exports.COMPONENT_TYPE_PU_DEVICE,
    exports.COMPONENT_TYPE_EV3_MOTOR,
    exports.COMPONENT_TYPE_EV3_SENSOR
];

// Non visual components...
exports.COMPONENT_TYPE_INTERVAL      = 'interval';
exports.COMPONENT_TYPE_TIMEOUT       = 'timeout';

exports.NON_VISUAL_COMPONENTS = [
    exports.COMPONENT_TYPE_INTERVAL,
    exports.COMPONENT_TYPE_TIMEOUT
];

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

// Component properties...
exports.PROPERTIES_BY_TYPE = {
    FORM: {
        include:   'lib/components/form.whl',
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
    /* ================================= INPUT COMPONENTS ================================= */
    BUTTON: {
        component:  'lib/components/Button',
        include:    'lib/components/button.whl',
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
        component:  'lib/components/ToolOptions',
        include:    'lib/components/selectButton.whl',
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
            }
        ]
    },
    CHECKBOX: {
        component:  'lib/components/CheckboxAndLabel',
        include:    'lib/components/checkbox.whl',
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
                    '    printS("Focus {name} checkbox.")'
                ],
                params: [
                    {name: 'windowHandle', type: 'number', comment: 'The handle to the active window.'}
                ]
            },
            {
                name: 'onBlur',
                code: [
                    '    printS("Blur {name} checkbox.")'
                ],
                params: [
                    {name: 'windowHandle', type: 'number', comment: 'The handle to the active window.'}
                ]
            }
        ]
    },
    RADIO: {
        component:  'lib/components/Radio',
        include:    'lib/components/radio.whl',
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
            {type: 'textList',    name: 'options',      options: {sort: true, remove: true}},
            {type: 'boolean',     name: 'horizontal'},
            {type: 'text',        name: 'value'} // Todo: validate based on options!
        ],
        events: [
            {
                name: 'onChange',
                code: [
                    '    printS("Change {name} radio, value:")',
                    '    printN(value)'
                ],
                params: [
                    {name: 'windowHandle', type: 'number', comment: 'The handle to the active window.'},
                    {name: 'value',        type: 'number', comment: 'New active item.'}
                ]
            },
            {
                name: 'onFocus',
                code: [
                    '    printS("Focus {name} radio.")'
                ],
                params: [
                    {name: 'windowHandle', type: 'number', comment: 'The handle to the active window.'}
                ]
            },
            {
                name: 'onBlur',
                code: [
                    '    printS("Blur {name} radio.")'
                ],
                params: [
                    {name: 'windowHandle', type: 'number', comment: 'The handle to the active window.'}
                ]
            }
        ]
    },
    DROPDOWN: {
        component:  'lib/components/Dropdown',
        include:    'lib/components/dropdown.whl',
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
            {type: 'textList',    name: 'items',        options: {sort: true, remove: true}},
            {type: 'text',        name: 'value'} // Todo: validate based on options!
        ],
        events: [
            {
                name: 'onChange',
                code: [
                    '    printS("Change {name} dropdown, value:")',
                    '    printN(value)'
                ],
                params: [
                    {name: 'windowHandle', type: 'number', comment: 'The handle to the active window.'},
                    {name: 'value',        type: 'number', comment: 'New active item.'}
                ]
            },
            {
                name: 'onFocus',
                code: [
                    '    printS("Focus {name} dropdown.")'
                ],
                params: [
                    {name: 'windowHandle', type: 'number', comment: 'The handle to the active window.'}
                ]
            },
            {
                name: 'onBlur',
                code: [
                    '    printS("Blur {name} dropdown.")'
                ],
                params: [
                    {name: 'windowHandle', type: 'number', comment: 'The handle to the active window.'}
                ]
            }
        ]
    },
    TEXTINPUT: {
        component:  'lib/components/TextInput',
        include:    'lib/components/textInput.whl',
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
            {type: 'text',        name: 'width',        options: {validator: posNumberOrEmptyValidator,      type: 'number'}},
            {type: 'boolean',     name: 'numeric'},
            {type: 'text',        name: 'value'}
        ],
        events: [
            {
                name: 'onChange',
                code: [
                    '    printS("Change {name} text input, value:")',
                    '    printN(value)'
                ],
                params: [
                    {name: 'windowHandle', type: 'number', comment: 'The handle to the active window.'},
                    {name: 'value',        type: 'number', comment: 'The numeric value.'}
                ]
            },
            {
                name: 'onFocus',
                code: [
                    '    printS("Focus {name} text input.")'
                ],
                params: [
                    {name: 'windowHandle', type: 'number', comment: 'The handle to the active window.'}
                ]
            },
            {
                name: 'onBlur',
                code: [
                    '    printS("Blur {name} text input.")'
                ],
                params: [
                    {name: 'windowHandle', type: 'number', comment: 'The handle to the active window.'}
                ]
            }
        ]
    },
    SLIDER: {
        component:  'lib/components/Slider',
        include:    'lib/components/slider.whl',
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
            {type: 'text',        name: 'width',        options: {validator: posNumberOrEmptyValidator,      type: 'number'}},
            {type: 'boolean',     name: 'numeric'},
            {type: 'text',        name: 'maxValue',     options: {validator: posNumberValidator,             type: 'number'}},
            {type: 'text',        name: 'value',        options: {validator: posNumberValidator,             type: 'number'}}
        ],
        events: [
            {
                name: 'onChange',
                code: [
                    '    printS("Change {name} slider, value:")',
                    '    printN(value)'
                ],
                params: [
                    {name: 'windowHandle', type: 'number', comment: 'The handle to the active window.'},
                    {name: 'value',        type: 'number', comment: 'The numeric value.'}
                ]
            },
            {
                name: 'onFocus',
                code: [
                    '    printS("Focus {name} slider.")'
                ],
                params: [
                    {name: 'windowHandle', type: 'number', comment: 'The handle to the active window.'}
                ]
            },
            {
                name: 'onBlur',
                code: [
                    '    printS("Blur {name} slider.")'
                ],
                params: [
                    {name: 'windowHandle', type: 'number', comment: 'The handle to the active window.'}
                ]
            }
        ]
    },
    /* ================================= TEXT COMPONENTS ================================= */
    LABEL: {
        component:  'lib/components/Label',
        include:    'lib/components/label.whl',
        properties: [
            {type: 'type',        name: null},
            {type: 'uid',         name: null},
            {type: 'id',          name: null},
            {type: 'parentId',    name: null},
            {type: 'text',        name: 'name',         options: {validator: nameValidator}},
            {type: 'boolean',     name: 'hidden'},
            {type: 'text',        name: 'x',            options: {validator: posNumberValidator,             type: 'number'}},
            {type: 'text',        name: 'y',            options: {validator: posNumberValidator,             type: 'number'}},
            {type: 'text',        name: 'width',        options: {validator: posNumberOrEmptyValidator,      type: 'number'}},
            {type: 'halign',      name: 'halign'},
            {type: 'text',        name: 'text'},
            {type: 'text',        name: 'value'}
        ],
        events: [
        ]
    },
    TITLE: {
        component:  'lib/components/Title',
        include:    'lib/components/title.whl',
        properties: [
            {type: 'type',        name: null},
            {type: 'uid',         name: null},
            {type: 'id',          name: null},
            {type: 'parentId',    name: null},
            {type: 'text',        name: 'name',         options: {validator: nameValidator}},
            {type: 'boolean',     name: 'hidden'},
            {type: 'text',        name: 'x',            options: {validator: posNumberValidator,             type: 'number'}},
            {type: 'text',        name: 'y',            options: {validator: posNumberValidator,             type: 'number'}},
            {type: 'text',        name: 'text'}
        ],
        events: [
        ]
    },
    TEXT: {
        component:  'lib/components/Text',
        include:    'lib/components/text.whl',
        properties: [
            {type: 'type',        name: null},
            {type: 'uid',         name: null},
            {type: 'id',          name: null},
            {type: 'parentId',    name: null},
            {type: 'text',        name: 'name',         options: {validator: nameValidator}},
            {type: 'boolean',     name: 'hidden'},
            {type: 'text',        name: 'x',            options: {validator: posNumberValidator,             type: 'number'}},
            {type: 'text',        name: 'y',            options: {validator: posNumberValidator,             type: 'number'}},
            {type: 'text',        name: 'width',        options: {validator: posNumberOrEmptyValidator,      type: 'number'}},
            {type: 'halign',      name: 'halign'},
            {type: 'text',        name: 'text'}
        ],
        events: [
        ]
    },
    LISTITEMS: {
        component:  'lib/components/ListItems',
        include:    'lib/components/listItems.whl',
        properties: [
            {type: 'type',        name: null},
            {type: 'uid',         name: null},
            {type: 'id',          name: null},
            {type: 'parentId',    name: null},
            {type: 'text',        name: 'name',         options: {validator: nameValidator}},
            {type: 'boolean',     name: 'hidden'},
            {type: 'text',        name: 'x',            options: {validator: posNumberValidator,             type: 'number'}},
            {type: 'text',        name: 'y',            options: {validator: posNumberValidator,             type: 'number'}},
            {type: 'textList',    name: 'items',        options: {sort: true, remove: true}}
        ],
        events: [
        ]
    },
    /* ================================= GRAPHICS COMPONENTS ================================= */
    RECTANGLE: {
        component:  'lib/components/Rectangle',
        include:    'lib/components/rectangle.whl',
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
        component:  'lib/components/Circle',
        include:    'lib/components/circle.whl',
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
        component:  'lib/components/Image',
        include:    'lib/components/image.whl',
        properties: [
            {type: 'type',        name: null},
            {type: 'uid',         name: null},
            {type: 'id',          name: null},
            {type: 'parentId',    name: null},
            {type: 'text',        name: 'name',         options: {validator: nameValidator}},
            {type: 'boolean',     name: 'hidden'},
            {type: 'text',        name: 'x',            options: {validator: posNumberValidator,             type: 'number'}},
            {type: 'text',        name: 'y',            options: {validator: posNumberValidator,             type: 'number'}},
            {type: 'boolean',     name: 'naturalSize'},
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
    },
    /* ================================= STATUS COMPONENTS ================================= */
    STATUSLIGHT: {
        component:  'lib/components/StatusLight',
        include:    'lib/components/statusLight.whl',
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
    PROGRESSBAR: {
        component:  'lib/components/ProgressBar',
        include:    'lib/components/progressBar.whl',
        properties: [
            {type: 'type',        name: null},
            {type: 'id',          name: null},
            {type: 'parentId',    name: null},
            {type: 'text',        name: 'name',         options: {validator: nameValidator}},
            {type: 'boolean',     name: 'hidden'},
            {type: 'text',        name: 'x',            options: {validator: posNumberValidator,             type: 'number'}},
            {type: 'text',        name: 'y',            options: {validator: posNumberValidator,             type: 'number'}},
            {type: 'text',        name: 'value',        options: {validator: posNumberValidator,             type: 'number'}}
        ],
        events: [
        ]
    },
    LOADINGDOTS: {
        component:  'lib/components/LoadingDots',
        include:    'lib/components/loadingDots.whl',
        properties: [
            {type: 'type',        name: null},
            {type: 'id',          name: null},
            {type: 'parentId',    name: null},
            {type: 'text',        name: 'name',         options: {validator: nameValidator}},
            {type: 'boolean',     name: 'hidden'},
            {type: 'text',        name: 'x',            options: {validator: posNumberValidator,             type: 'number'}},
            {type: 'text',        name: 'y',            options: {validator: posNumberValidator,             type: 'number'}},
            {type: 'color',       name: 'color'}
        ],
        events: [
        ]
    },
    /* ================================= PANEL COMPONENTS ================================= */
    PANEL: {
        component:  'lib/components/Panel',
        include:    'lib/components/panel.whl',
        properties: [
            {type: 'type',         name: null},
            {type: 'uid',          name: null},
            {type: 'id',           name: null},
            {type: 'parentId',     name: null},
            {type: 'containerIds', name: null},
            {type: 'text',         name: 'name',         options: {validator: nameValidator}},
            {type: 'text',         name: 'tabIndex',     options: {validator: posNumberValidator,             type: 'number'}},
            {type: 'boolean',      name: 'hidden'},
            {type: 'text',         name: 'x',            options: {validator: posNumberValidator,             type: 'number'}},
            {type: 'text',         name: 'y',            options: {validator: posNumberValidator,             type: 'number'}},
            {type: 'text',         name: 'width',        options: {validator: posNumberValidatorWithMin(128), type: 'number'}},
            {type: 'text',         name: 'height',       options: {validator: posNumberValidatorWithMin(40),  type: 'number'}}
        ],
        events: [
        ]
    },
    TABS: {
        component:  'lib/components/TabPanel',
        include:    'lib/components/tabs.whl',
        properties: [
            {type: 'type',         name: null},
            {type: 'uid',          name: null},
            {type: 'id',           name: null},
            {type: 'parentId',     name: null},
            {type: 'containerIds', name: null},
            {type: 'text',         name: 'name',         options: {validator: nameValidator}},
            {type: 'text',         name: 'tabIndex',     options: {validator: posNumberValidator,             type: 'number'}},
            {type: 'boolean',      name: 'hidden'},
            {type: 'text',         name: 'x',            options: {validator: posNumberValidator,             type: 'number'}},
            {type: 'text',         name: 'y',            options: {validator: posNumberValidator,             type: 'number'}},
            {type: 'text',         name: 'width',        options: {validator: posNumberValidatorWithMin(128), type: 'number'}},
            {type: 'text',         name: 'height',       options: {validator: posNumberValidatorWithMin(40),  type: 'number'}},
            {type: 'textList',     name: 'tabs',         options: {removeLast: true}}
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
    /* ================================= DEVICE DISPLAY COMPONENTS ================================= */
    PUDEVICE: {
        component:  'lib/components/io/PoweredUpDevice',
        include:    'lib/components/poweredUpDevice.whl',
        properties: [
            {type: 'type',        name: null},
            {type: 'uid',         name: null},
            {type: 'id',          name: null},
            {type: 'parentId',    name: null},
            {type: 'text',        name: 'name',         options: {validator: nameValidator}},
            {type: 'boolean',     name: 'hidden'},
            {type: 'text',        name: 'x',            options: {validator: posNumberValidator,             type: 'number'}},
            {type: 'text',        name: 'y',            options: {validator: posNumberValidator,             type: 'number'}},
            {
                type: 'dropdown',
                name: 'port',
                options: {
                    list: [
                        {title: '1', value: 0},
                        {title: '2', value: 1},
                        {title: '3', value: 2},
                        {title: '4', value: 3}
                    ]
                }
            },
            {
                type: 'dropdown',
                name: 'device',
                options: {
                    list: [
                        {title: 'Basic motor',     value:  1},
                        {title: 'Train motor',     value:  2},
                        {title: 'Led lights',      value:  8},
                        {title: 'Tacho motor',     value: 38},
                        {title: 'Move hub motor',  value: 39},
                        {title: 'Ctrl+ L motor',   value: 46},
                        {title: 'Ctrl+ XL motor',  value: 47},
                        {title: 'Distance sensor', value: 37}
                    ]
                }
            },
            {type: 'boolean',     name: 'colorMode'}
        ],
        events: [
        ]
    },
    EV3MOTOR: {
        component:  'lib/components/io/EV3Motor',
        include:    'lib/components/ev3Motor.whl',
        properties: [
            {type: 'type',        name: null},
            {type: 'uid',         name: null},
            {type: 'id',          name: null},
            {type: 'parentId',    name: null},
            {type: 'text',        name: 'name',         options: {validator: nameValidator}},
            {type: 'boolean',     name: 'hidden'},
            {type: 'text',        name: 'x',            options: {validator: posNumberValidator,             type: 'number'}},
            {type: 'text',        name: 'y',            options: {validator: posNumberValidator,             type: 'number'}},
            {
                type: 'dropdown',
                name: 'port',
                options: {
                    list: [
                        {title: 'A', value: 0},
                        {title: 'B', value: 1},
                        {title: 'C', value: 2},
                        {title: 'D', value: 3}
                    ]
                }
            },
            {
                type: 'dropdown',
                name: 'device',
                options: {
                    list: [
                        {title: 'Medium motor', value:  7},
                        {title: 'Large motor',  value:  8}
                    ]
                }
            }
        ],
        events: [
        ]
    },
    EV3SENSOR: {
        component:  'lib/components/io/EV3Sensor',
        include:    'lib/components/ev3Sensor.whl',
        properties: [
            {type: 'type',        name: null},
            {type: 'uid',         name: null},
            {type: 'id',          name: null},
            {type: 'parentId',    name: null},
            {type: 'text',        name: 'name',         options: {validator: nameValidator}},
            {type: 'boolean',     name: 'hidden'},
            {type: 'text',        name: 'x',            options: {validator: posNumberValidator,             type: 'number'}},
            {type: 'text',        name: 'y',            options: {validator: posNumberValidator,             type: 'number'}},
            {
                type: 'dropdown',
                name: 'port',
                options: {
                    list: [
                        {title: '1', value: 0},
                        {title: '2', value: 1},
                        {title: '3', value: 2},
                        {title: '4', value: 3}
                    ]
                }
            },
            {
                type: 'dropdown',
                name: 'device',
                options: {
                    list: [
                        {title: 'Touch sensor',      value:  1},
                        {title: 'Sound sensor',      value:  3},
                        {title: 'Color sensor',      value:  4},
                        {title: 'Ultrasonic sensor', value:  5},
                        {title: 'Gyro sensor',       value: 32},
                        {title: 'Infrared sensor',   value: 33}
                    ]
                }
            }
        ],
        events: [
        ]
    },
    /* ================================= NON VISUAL COMPONENTS ================================= */
    INTERVAL: {
        component:  'lib/components/nonvisual/Interval',
        include:    'lib/components/interval.whl',
        properties: [
            {type: 'type',        name: null},
            {type: 'uid',         name: null},
            {type: 'id',          name: null},
            {type: 'parentId',    name: null},
            {type: 'text',        name: 'name',         options: {validator: nameValidator}},
            {type: 'text',        name: 'x',            options: {validator: posNumberValidator,             type: 'number'}},
            {type: 'text',        name: 'y',            options: {validator: posNumberValidator,             type: 'number'}},
            {type: 'text',        name: 'time',         options: {validator: posNumberValidator,             type: 'number'}}
        ],
        events: [
            {
                name: 'onInterval',
                code: [
                    '    printS("Interval {name}.")'
                ],
                params: [
                    {name: 'windowHandle', type: 'number', comment: 'The handle to the active window.'}
                ]
            }
        ]
    },
    TIMEOUT: {
        component:  'lib/components/nonvisual/Timeout',
        include:    'lib/components/timeout.whl',
        properties: [
            {type: 'type',        name: null},
            {type: 'uid',         name: null},
            {type: 'id',          name: null},
            {type: 'parentId',    name: null},
            {type: 'text',        name: 'name',         options: {validator: nameValidator}},
            {type: 'text',        name: 'x',            options: {validator: posNumberValidator,             type: 'number'}},
            {type: 'text',        name: 'y',            options: {validator: posNumberValidator,             type: 'number'}},
            {type: 'text',        name: 'time',         options: {validator: posNumberValidator,             type: 'number'}}
        ],
        events: [
            {
                name: 'onTimeout',
                code: [
                    '    printS("Timeout {name}.")'
                ],
                params: [
                    {name: 'windowHandle', type: 'number', comment: 'The handle to the active window.'}
                ]
            }
        ]
    }
};
