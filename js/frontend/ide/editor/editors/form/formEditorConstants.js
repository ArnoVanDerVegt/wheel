/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/

// Component types...
exports.COMPONENT_TYPES_STANDARD     = 'standard';
exports.COMPONENT_TYPES_PANEL        = 'panel';
exports.COMPONENT_TYPES_GRAPHICS     = 'graphics';
exports.COMPONENT_TYPES_IO           = 'io';

// Standard components...
exports.COMPONENT_TYPE_FORM          = 'form';
exports.COMPONENT_TYPE_BUTTON        = 'button';
exports.COMPONENT_TYPE_SELECT_BUTTON = 'selectButton';
exports.COMPONENT_TYPE_LABEL         = 'label';
exports.COMPONENT_TYPE_CHECKBOX      = 'checkbox';
exports.COMPONENT_TYPE_TEXT_INPUT    = 'textInput';
exports.COMPONENT_TYPE_SLIDER        = 'slider';
exports.COMPONENT_TYPE_STATUS_LIGHT  = 'statusLight';

// Panel components...
exports.COMPONENT_TYPE_PANEL         = 'panel';
exports.COMPONENT_TYPE_TABS          = 'tabs';

// Graphics components...
exports.COMPONENT_TYPE_RECTANGLE     = 'rectangle';
exports.COMPONENT_TYPE_CIRCLE        = 'circle';
exports.COMPONENT_TYPE_IMAGE         = 'image';

// Sensor/motor components...
exports.COMPONENT_TYPE_PU_DEVICE     = 'puDevice';
exports.COMPONENT_TYPE_EV3_MOTOR     = 'ev3Motor';
exports.COMPONENT_TYPE_EV3_SENSOR    = 'ev3Sensor';

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
    LABEL: {
        component:  'lib/components/Label',
        include:    'lib/components/label.whl',
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
        ],
        events: [
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
    PANEL: {
        component:  'lib/components/Panel',
        include:    'lib/components/panel.whl',
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
        component:  'lib/components/TabPanel',
        include:    'lib/components/tabs.whl',
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
    }
};
