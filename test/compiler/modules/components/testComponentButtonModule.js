/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher        = require('../../../../js/frontend/lib/dispatcher').dispatcher;
const testComponentCall = require('../../../utils').testComponentCall;

afterEach(() => {
    dispatcher.reset();
});

const LIB_FILENAME = 'assets/template/lib/modules/components/button.whl';

describe(
    'Test Button component module',
    () => {
        testComponentCall(it, {message: 'Should set hidden',   moduleFile: LIB_FILENAME, procName: 'components.button.setHidden',   property: 'hidden',   type: 'number'});
        testComponentCall(it, {message: 'Should set disabled', moduleFile: LIB_FILENAME, procName: 'components.button.setDisabled', property: 'disabled', type: 'number'});
        testComponentCall(it, {message: 'Should set x',        moduleFile: LIB_FILENAME, procName: 'components.button.setX',        property: 'x',        type: 'number'});
        testComponentCall(it, {message: 'Should set y',        moduleFile: LIB_FILENAME, procName: 'components.button.setY',        property: 'y',        type: 'number'});
        testComponentCall(it, {message: 'Should set color',    moduleFile: LIB_FILENAME, procName: 'components.button.setColor',    property: 'color',    type: 'number'});
        testComponentCall(it, {message: 'Should set value',    moduleFile: LIB_FILENAME, procName: 'components.button.setTitle',    property: 'value',    type: 'string'});
        testComponentCall(it, {message: 'Should set title',    moduleFile: LIB_FILENAME, procName: 'components.button.setHint',     property: 'title',    type: 'string'});
    }
);
