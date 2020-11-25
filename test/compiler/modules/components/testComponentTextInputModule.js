/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher        = require('../../../../js/frontend/lib/dispatcher').dispatcher;
const testComponentCall = require('../../../utils').testComponentCall;

afterEach(() => {
    dispatcher.reset();
});

const LIB_FILENAME = 'assets/template/lib/modules/components/textInput.whl';

describe(
    'Test Text input component module',
    () => {
        testComponentCall(it, {message: 'Should set hidden',       moduleFile: LIB_FILENAME, procName: 'components.textInput.setHidden',      property: 'hidden',      type: 'number'});
        testComponentCall(it, {message: 'Should set disabled',     moduleFile: LIB_FILENAME, procName: 'components.textInput.setDisabled',    property: 'disabled',    type: 'number'});
        testComponentCall(it, {message: 'Should set x',            moduleFile: LIB_FILENAME, procName: 'components.textInput.setX',           property: 'x',           type: 'number'});
        testComponentCall(it, {message: 'Should set y',            moduleFile: LIB_FILENAME, procName: 'components.textInput.setY',           property: 'y',           type: 'number'});
        testComponentCall(it, {message: 'Should get text value',   moduleFile: LIB_FILENAME, procName: 'components.textInput.getTextValue',                            type: 'getString'});
        testComponentCall(it, {message: 'Should set text value',   moduleFile: LIB_FILENAME, procName: 'components.textInput.setTextValue',   property: 'text',        type: 'string'});
        testComponentCall(it, {message: 'Should get number value', moduleFile: LIB_FILENAME, procName: 'components.textInput.getNumberValue',                          type: 'getNumber'});
        testComponentCall(it, {message: 'Should set number value', moduleFile: LIB_FILENAME, procName: 'components.textInput.setNumberValue', property: 'number',      type: 'number'});
        testComponentCall(it, {message: 'Should set place holder', moduleFile: LIB_FILENAME, procName: 'components.textInput.setPlaceHolder', property: 'placeHolder', type: 'string'});
    }
);
