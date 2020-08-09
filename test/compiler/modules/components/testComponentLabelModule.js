/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher        = require('../../../../js/frontend/lib/dispatcher').dispatcher;
const testComponentCall = require('../../../utils').testComponentCall;

afterEach(function() {
    dispatcher.reset();
});

const LIB_FILENAME = 'assets/template/lib/components/label.whl';

describe(
    'Test Label component module',
    function() {
        testComponentCall(it, {message: 'Should set hidden',       moduleFile: LIB_FILENAME, procName: 'components.label.setHidden',      property: 'hidden', type: 'number'});
        testComponentCall(it, {message: 'Should set x',            moduleFile: LIB_FILENAME, procName: 'components.label.setX',           property: 'x',      type: 'number'});
        testComponentCall(it, {message: 'Should set y',            moduleFile: LIB_FILENAME, procName: 'components.label.setY',           property: 'y',      type: 'number'});
        testComponentCall(it, {message: 'Should set value number', moduleFile: LIB_FILENAME, procName: 'components.label.setValueNumber', property: 'value',  type: 'number'});
        testComponentCall(it, {message: 'Should set value string', moduleFile: LIB_FILENAME, procName: 'components.label.setValueString', property: 'value',  type: 'string'});
    }
);
