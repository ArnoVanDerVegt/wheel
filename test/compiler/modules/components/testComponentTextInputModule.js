/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher        = require('../../../../js/frontend/lib/dispatcher').dispatcher;
const testComponentCall = require('../../../utils').testComponentCall;

afterEach(function() {
    dispatcher.reset();
});

const LIB_FILENAME = 'assets/template/lib/components/textInput.whl';

describe(
    'Test Text input component module',
    function() {
        testComponentCall(it, 'Should set hidden',       LIB_FILENAME, 'components.textInput.setHidden',      'hidden',      'number');
        testComponentCall(it, 'Should set disabled',     LIB_FILENAME, 'components.textInput.setDisabled',    'disabled',    'number');
        testComponentCall(it, 'Should set x',            LIB_FILENAME, 'components.textInput.setX',           'x',           'number');
        testComponentCall(it, 'Should set y',            LIB_FILENAME, 'components.textInput.setY',           'y',           'number');
        testComponentCall(it, 'Should get text value',   LIB_FILENAME, 'components.textInput.getTextValue',   null,          'getString');
        testComponentCall(it, 'Should set text value',   LIB_FILENAME, 'components.textInput.setTextValue',   'text',        'string');
        testComponentCall(it, 'Should get number value', LIB_FILENAME, 'components.textInput.getNumberValue', null,          'getNumber');
        testComponentCall(it, 'Should set number value', LIB_FILENAME, 'components.textInput.setNumberValue', 'number',      'number');
        testComponentCall(it, 'Should set place holder', LIB_FILENAME, 'components.textInput.setPlaceHolder', 'placeHolder', 'string');
    }
);
