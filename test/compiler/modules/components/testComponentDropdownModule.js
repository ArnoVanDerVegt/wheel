/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher        = require('../../../../js/frontend/lib/dispatcher').dispatcher;
const testComponentCall = require('../../../utils').testComponentCall;

afterEach(() => {
    dispatcher.reset();
});

const LIB_FILENAME = 'assets/template/lib/components/dropdown.whl';

describe(
    'Test Dropdown component module',
    () => {
        testComponentCall(it, {message: 'Should set hidden',   moduleFile: LIB_FILENAME, procName: 'components.dropdown.setHidden',   property: 'hidden',   type: 'number'});
        testComponentCall(it, {message: 'Should set disabled', moduleFile: LIB_FILENAME, procName: 'components.dropdown.setDisabled', property: 'disabled', type: 'number'});
        testComponentCall(it, {message: 'Should set x',        moduleFile: LIB_FILENAME, procName: 'components.dropdown.setX',        property: 'x',        type: 'number'});
        testComponentCall(it, {message: 'Should set y',        moduleFile: LIB_FILENAME, procName: 'components.dropdown.setY',        property: 'y',        type: 'number'});
        testComponentCall(it, {message: 'Should set value',    moduleFile: LIB_FILENAME, procName: 'components.dropdown.setValue',    property: 'value',    type: 'number'});
        testComponentCall(it, {message: 'Should get value',    moduleFile: LIB_FILENAME, procName: 'components.dropdown.getValue',                          type: 'getNumber'});
    }
);
