/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const ComponentBuilder    = require('../../../../js/frontend/ide/editor/editors/form/ComponentBuilder').ComponentBuilder;
const formEditorConstants = require('../../../../js/frontend/ide/editor/editors/form/formEditorConstants');
const assert              = require('assert');

const shouldContainProperties = (it, message, component, properties) => {
        let count = 0;
        properties.forEach((property) => {
            if (property in component) {
                count++;
            }
        });
        it(
            message,
            () => {
                assert.equal(count, properties.length);
            }
        );
    };

describe(
    'Test ComponentList',
    () => {
        let componentBuilder = new ComponentBuilder({
                componentList: {
                    findComponentText(type, property, name) {
                        return name;
                    }
                },
                formEditorState: {
                    peekId() {
                        return 1;
                    }
                }
            });
        shouldContainProperties(
            it,
            'Should check button properties',
            componentBuilder.addComponentForType({}, formEditorConstants.COMPONENT_TYPE_BUTTON),
            ['name', 'zIndex', 'value', 'title', 'color']
        );
        shouldContainProperties(
            it,
            'Should check selectButton properties',
            componentBuilder.addComponentForType({}, formEditorConstants.COMPONENT_TYPE_SELECT_BUTTON),
            ['name', 'zIndex', 'options', 'color']
        );
        shouldContainProperties(
            it,
            'Should check checkbox properties',
            componentBuilder.addComponentForType({}, formEditorConstants.COMPONENT_TYPE_CHECKBOX),
            ['name', 'zIndex', 'text', 'checked']
        );
        shouldContainProperties(
            it,
            'Should check radio properties',
            componentBuilder.addComponentForType({}, formEditorConstants.COMPONENT_TYPE_RADIO),
            ['name', 'zIndex', 'horizontal', 'options']
        );
        shouldContainProperties(
            it,
            'Should check dropdown properties',
            componentBuilder.addComponentForType({}, formEditorConstants.COMPONENT_TYPE_DROPDOWN),
            ['name', 'zIndex', 'items']
        );
        shouldContainProperties(
            it,
            'Should check textInput properties',
            componentBuilder.addComponentForType({}, formEditorConstants.COMPONENT_TYPE_TEXT_INPUT),
            ['name', 'zIndex', 'width']
        );
        shouldContainProperties(
            it,
            'Should check slider properties',
            componentBuilder.addComponentForType({}, formEditorConstants.COMPONENT_TYPE_SLIDER),
            ['name', 'zIndex', 'maxValue', 'value', 'width']
        );
        shouldContainProperties(
            it,
            'Should check label properties',
            componentBuilder.addComponentForType({}, formEditorConstants.COMPONENT_TYPE_LABEL),
            ['name', 'zIndex', 'text', 'halign']
        );
        shouldContainProperties(
            it,
            'Should check title properties',
            componentBuilder.addComponentForType({}, formEditorConstants.COMPONENT_TYPE_TITLE),
            ['name', 'zIndex', 'text', 'halign']
        );
        shouldContainProperties(
            it,
            'Should check text properties',
            componentBuilder.addComponentForType({}, formEditorConstants.COMPONENT_TYPE_TEXT),
            ['name', 'zIndex', 'text', 'width', 'halign']
        );
        shouldContainProperties(
            it,
            'Should check listItems properties',
            componentBuilder.addComponentForType({}, formEditorConstants.COMPONENT_TYPE_LIST_ITEMS),
            ['name', 'zIndex', 'items']
        );
        shouldContainProperties(
            it,
            'Should check panel properties',
            componentBuilder.addComponentForType({}, formEditorConstants.COMPONENT_TYPE_PANEL),
            ['name', 'zIndex', 'width', 'height', 'containerIds']
        );
        shouldContainProperties(
            it,
            'Should check tabs properties',
            componentBuilder.addComponentForType({}, formEditorConstants.COMPONENT_TYPE_TABS),
            ['name', 'zIndex', 'tabs', 'width', 'height', 'containerIds']
        );
        shouldContainProperties(
            it,
            'Should check rectangle properties',
            componentBuilder.addComponentForType({}, formEditorConstants.COMPONENT_TYPE_RECTANGLE),
            ['name', 'zIndex', 'width', 'height', 'borderWidth', 'borderRadius', 'borderColor', 'fillColor']
        );
        shouldContainProperties(
            it,
            'Should check circle properties',
            componentBuilder.addComponentForType({}, formEditorConstants.COMPONENT_TYPE_CIRCLE),
            ['name', 'zIndex', 'radius', 'borderWidth', 'borderColor', 'fillColor']
        );
        shouldContainProperties(
            it,
            'Should check image properties',
            componentBuilder.addComponentForType({}, formEditorConstants.COMPONENT_TYPE_IMAGE),
            ['name', 'zIndex', 'width', 'height']
        );
        shouldContainProperties(
            it,
            'Should check icon properties',
            componentBuilder.addComponentForType({}, formEditorConstants.COMPONENT_TYPE_ICON),
            ['name', 'zIndex']
        );
        shouldContainProperties(
            it,
            'Should check statusLight properties',
            componentBuilder.addComponentForType({}, formEditorConstants.COMPONENT_TYPE_STATUS_LIGHT),
            ['name', 'zIndex', 'color']
        );
        shouldContainProperties(
            it,
            'Should check statusLight properties',
            componentBuilder.addComponentForType({}, formEditorConstants.COMPONENT_TYPE_PROGRESS_BAR),
            ['name', 'zIndex', 'value', 'width']
        );
        shouldContainProperties(
            it,
            'Should check loadingDots properties',
            componentBuilder.addComponentForType({}, formEditorConstants.COMPONENT_TYPE_LOADING_DOTS),
            ['name', 'zIndex', 'color']
        );
        shouldContainProperties(
            it,
            'Should check puDevice properties',
            componentBuilder.addComponentForType({}, formEditorConstants.COMPONENT_TYPE_PU_DEVICE),
            ['name', 'zIndex', 'port', 'device']
        );
        shouldContainProperties(
            it,
            'Should check ev3MotorDevice properties',
            componentBuilder.addComponentForType({}, formEditorConstants.COMPONENT_TYPE_EV3_MOTOR),
            ['name', 'zIndex', 'port', 'device']
        );
        shouldContainProperties(
            it,
            'Should check ev3SensorDevice properties',
            componentBuilder.addComponentForType({}, formEditorConstants.COMPONENT_TYPE_EV3_SENSOR),
            ['name', 'zIndex', 'port', 'device']
        );
        shouldContainProperties(
            it,
            'Should check interval properties',
            componentBuilder.addComponentForType({}, formEditorConstants.COMPONENT_TYPE_INTERVAL),
            ['name', 'time']
        );
        shouldContainProperties(
            it,
            'Should check timeout properties',
            componentBuilder.addComponentForType({}, formEditorConstants.COMPONENT_TYPE_TIMEOUT),
            ['name', 'time']
        );
        shouldContainProperties(
            it,
            'Should check alertDialog properties',
            componentBuilder.addComponentForType({}, formEditorConstants.COMPONENT_TYPE_ALERT_DIALOG),
            ['name', 'title', 'text']
        );
        shouldContainProperties(
            it,
            'Should check confirmDialog properties',
            componentBuilder.addComponentForType({}, formEditorConstants.COMPONENT_TYPE_CONFIRM_DIALOG),
            ['name', 'title', 'text', 'okTitle', 'cancelTitle']
        );

        it(
            'Should not get properties for invalid type',
            () => {
                assert.equal(componentBuilder.addComponentForType({}, -1), null);
            }
        );
    }
);
