/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher        = require('../../../../js/frontend/lib/dispatcher').dispatcher;
const testComponentCall = require('../../../utils').testComponentCall;

afterEach(function() {
    dispatcher.reset();
});

const LIB_FILENAME = 'assets/template/lib/components/tabs.whl';

describe(
    'Test Tabs component module',
    function() {
        testComponentCall(it, {message: 'Should set hidden',   moduleFile: LIB_FILENAME, procName: 'components.tabs.setHidden',   property: 'hidden',   type: 'number'});
        testComponentCall(it, {message: 'Should set disabled', moduleFile: LIB_FILENAME, procName: 'components.tabs.setDisabled', property: 'disabled', type: 'number'});
        testComponentCall(it, {message: 'Should set x',        moduleFile: LIB_FILENAME, procName: 'components.tabs.setX',        property: 'x',        type: 'number'});
        testComponentCall(it, {message: 'Should set y',        moduleFile: LIB_FILENAME, procName: 'components.tabs.setY',        property: 'y',        type: 'number'});
        testComponentCall(it, {message: 'Should set width',    moduleFile: LIB_FILENAME, procName: 'components.tabs.setWidth',    property: 'width',    type: 'number'});
        testComponentCall(it, {message: 'Should set height',   moduleFile: LIB_FILENAME, procName: 'components.tabs.setHeight',   property: 'height',   type: 'number'});
        testComponentCall(it, {message: 'Should set active',   moduleFile: LIB_FILENAME, procName: 'components.tabs.setActive',   property: 'active',   type: 'number'});
        testComponentCall(it, {message: 'Should get active',   moduleFile: LIB_FILENAME, procName: 'components.tabs.getActive',                         type: 'getNumber'});
    }
);
