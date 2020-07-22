/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher        = require('../../../../js/frontend/lib/dispatcher').dispatcher;
const testComponentCall = require('../../../utils').testComponentCall;

afterEach(function() {
    dispatcher.reset();
});

const LIB_FILENAME = 'assets/template/lib/components/dropdown.whl';

describe(
    'Test Dropdown component module',
    function() {
        testComponentCall(it, 'Should set hidden',   LIB_FILENAME, 'components.dropdown.setHidden',   'hidden',   'number');
        testComponentCall(it, 'Should set disabled', LIB_FILENAME, 'components.dropdown.setDisabled', 'disabled', 'number');
        testComponentCall(it, 'Should set x',        LIB_FILENAME, 'components.dropdown.setX',        'x',        'number');
        testComponentCall(it, 'Should set y',        LIB_FILENAME, 'components.dropdown.setY',        'y',        'number');
        testComponentCall(it, 'Should set value',    LIB_FILENAME, 'components.dropdown.setValue',    'value',    'number');
    }
);
