/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher        = require('../../../../js/frontend/lib/dispatcher').dispatcher;
const testComponentCall = require('../../../utils').testComponentCall;

afterEach(function() {
    dispatcher.reset();
});

const LIB_FILENAME = 'assets/template/lib/components/selectButton.whl';

describe(
    'Test SelectButton component module',
    function() {
        testComponentCall(it, 'Should set hidden',   LIB_FILENAME, 'components.selectButton.setHidden',   'hidden',   'number');
        testComponentCall(it, 'Should set disabled', LIB_FILENAME, 'components.selectButton.setDisabled', 'disabled', 'number');
        testComponentCall(it, 'Should set x',        LIB_FILENAME, 'components.selectButton.setX',        'x',        'number');
        testComponentCall(it, 'Should set y',        LIB_FILENAME, 'components.selectButton.setY',        'y',        'number');
        testComponentCall(it, 'Should set color',    LIB_FILENAME, 'components.selectButton.setColor',    'color',    'number');
        testComponentCall(it, 'Should set active',   LIB_FILENAME, 'components.selectButton.setActive',   'active',   'number');
    }
);
