/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher        = require('../../../../js/frontend/lib/dispatcher').dispatcher;
const testComponentCall = require('../../../utils').testComponentCall;

afterEach(function() {
    dispatcher.reset();
});

const LIB_FILENAME = 'assets/template/lib/components/slider.whl';

describe(
    'Test Slider component module',
    function() {
        testComponentCall(it, 'Should set hidden',   LIB_FILENAME, 'components.slider.setHidden',   'hidden',   'number');
        testComponentCall(it, 'Should set disabled', LIB_FILENAME, 'components.slider.setDisabled', 'disabled', 'number');
        testComponentCall(it, 'Should set x',        LIB_FILENAME, 'components.slider.setX',        'x',        'number');
        testComponentCall(it, 'Should set y',        LIB_FILENAME, 'components.slider.setY',        'y',        'number');
        testComponentCall(it, 'Should set value',    LIB_FILENAME, 'components.slider.setValue',    'value',    'number');
        testComponentCall(it, 'Should get value',    LIB_FILENAME, 'components.slider.getValue',    null,       'getNumber');
    }
);
