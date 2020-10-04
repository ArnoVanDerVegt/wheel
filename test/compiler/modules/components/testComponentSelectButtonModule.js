/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher        = require('../../../../js/frontend/lib/dispatcher').dispatcher;
const testComponentCall = require('../../../utils').testComponentCall;

afterEach(() => {
    dispatcher.reset();
});

const LIB_FILENAME = 'assets/template/lib/components/selectButton.whl';

describe(
    'Test SelectButton component module',
    () => {
        testComponentCall(it, {message: 'Should set hidden',   moduleFile: LIB_FILENAME, procName: 'components.selectButton.setHidden',   property: 'hidden',   type: 'number'});
        testComponentCall(it, {message: 'Should set disabled', moduleFile: LIB_FILENAME, procName: 'components.selectButton.setDisabled', property: 'disabled', type: 'number'});
        testComponentCall(it, {message: 'Should set x',        moduleFile: LIB_FILENAME, procName: 'components.selectButton.setX',        property: 'x',        type: 'number'});
        testComponentCall(it, {message: 'Should set y',        moduleFile: LIB_FILENAME, procName: 'components.selectButton.setY',        property: 'y',        type: 'number'});
        testComponentCall(it, {message: 'Should set color',    moduleFile: LIB_FILENAME, procName: 'components.selectButton.setColor',    property: 'color',    type: 'number'});
        testComponentCall(it, {message: 'Should set active',   moduleFile: LIB_FILENAME, procName: 'components.selectButton.setActive',   property: 'active',   type: 'number'});
        testComponentCall(it, {message: 'Should get active',   moduleFile: LIB_FILENAME, procName: 'components.selectButton.getActive',                         type: 'getNumber'});
    }
);
