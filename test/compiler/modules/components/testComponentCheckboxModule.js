/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher        = require('../../../../js/frontend/lib/dispatcher').dispatcher;
const testComponentCall = require('../../../utils').testComponentCall;

afterEach(() => {
    dispatcher.reset();
});

const LIB_FILENAME = 'assets/template/lib/modules/components/checkbox.whl';

describe(
    'Test Checkbox component module',
    () => {
        testComponentCall(it, {message: 'Should set hidden',   moduleFile: LIB_FILENAME, procName: 'components.checkbox.setHidden',   property: 'hidden',   type: 'number'});
        testComponentCall(it, {message: 'Should set disabled', moduleFile: LIB_FILENAME, procName: 'components.checkbox.setDisabled', property: 'disabled', type: 'number'});
        testComponentCall(it, {message: 'Should set x',        moduleFile: LIB_FILENAME, procName: 'components.checkbox.setX',        property: 'x',        type: 'number'});
        testComponentCall(it, {message: 'Should set y',        moduleFile: LIB_FILENAME, procName: 'components.checkbox.setY',        property: 'y',        type: 'number'});
        testComponentCall(it, {message: 'Should set text',     moduleFile: LIB_FILENAME, procName: 'components.checkbox.setText',     property: 'text',     type: 'string'});
        testComponentCall(it, {message: 'Should set hint',     moduleFile: LIB_FILENAME, procName: 'components.checkbox.setHint',     property: 'title',    type: 'string'});
        testComponentCall(it, {message: 'Should set checked',  moduleFile: LIB_FILENAME, procName: 'components.checkbox.setChecked',  property: 'checked',  type: 'number'});
        // Todo: fix test....
        // testComponentCall(it, {message: 'Should get value',    moduleFile: LIB_FILENAME, procName: 'components.checkbox.getValue', type: 'getNumber'});
    }
);
