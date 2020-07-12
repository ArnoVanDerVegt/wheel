/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
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
        testComponentCall(it, 'Should set hidden',   LIB_FILENAME, 'components.tabs.setHidden',   'hidden',   'number');
        testComponentCall(it, 'Should set disabled', LIB_FILENAME, 'components.tabs.setDisabled', 'disabled', 'number');
        testComponentCall(it, 'Should set x',        LIB_FILENAME, 'components.tabs.setX',        'x',        'number');
        testComponentCall(it, 'Should set y',        LIB_FILENAME, 'components.tabs.setY',        'y',        'number');
        testComponentCall(it, 'Should set width',    LIB_FILENAME, 'components.tabs.setWidth',    'width',    'number');
        testComponentCall(it, 'Should set height',   LIB_FILENAME, 'components.tabs.setHeight',   'height',   'number');
        testComponentCall(it, 'Should set active',   LIB_FILENAME, 'components.tabs.setActive',   'active',   'number');
    }
);
