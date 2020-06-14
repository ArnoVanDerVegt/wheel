/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher        = require('../../../../js/frontend/lib/dispatcher').dispatcher;
const testComponentCall = require('../../../utils').testComponentCall;

afterEach(function() {
    dispatcher.reset();
});

const LIB_FILENAME = 'assets/template/lib/components/button.whl';

describe(
    'Test Button component module',
    function() {
        testComponentCall(it, 'Should set tabIndex', LIB_FILENAME, 'components.button.setTabIndex', 'tabIndex', 'number');
        testComponentCall(it, 'Should set hidden',   LIB_FILENAME, 'components.button.setHidden',   'hidden',   'number');
        testComponentCall(it, 'Should set disabled', LIB_FILENAME, 'components.button.setDisabled', 'disabled', 'number');
        testComponentCall(it, 'Should set x',        LIB_FILENAME, 'components.button.setX',        'x',        'number');
        testComponentCall(it, 'Should set y',        LIB_FILENAME, 'components.button.setY',        'y',        'number');
        testComponentCall(it, 'Should set color',    LIB_FILENAME, 'components.button.setColor',    'color',    'number');
        testComponentCall(it, 'Should set value',    LIB_FILENAME, 'components.button.setTitle',    'value',    'string');
        testComponentCall(it, 'Should set title',    LIB_FILENAME, 'components.button.setHint',     'title',    'string');
    }
);
