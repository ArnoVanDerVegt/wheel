/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher        = require('../../../../js/frontend/lib/dispatcher').dispatcher;
const testComponentCall = require('../../../utils').testComponentCall;

afterEach(function() {
    dispatcher.reset();
});

const LIB_FILENAME = 'assets/template/lib/components/radio.whl';

describe(
    'Test Radio component module',
    function() {
        testComponentCall(it, 'Should set hidden',   LIB_FILENAME, 'components.radio.setHidden',   'hidden',   'number');
        testComponentCall(it, 'Should set disabled', LIB_FILENAME, 'components.radio.setDisabled', 'disabled', 'number');
        testComponentCall(it, 'Should set x',        LIB_FILENAME, 'components.radio.setX',        'x',        'number');
        testComponentCall(it, 'Should set y',        LIB_FILENAME, 'components.radio.setY',        'y',        'number');
        testComponentCall(it, 'Should set value',    LIB_FILENAME, 'components.radio.setValue',    'value',    'number');
    }
);
