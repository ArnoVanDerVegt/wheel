/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
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
        testComponentCall(it, 'Should set tabIndex', LIB_FILENAME, 'components.label.setTabIndex', 'tabIndex', 'number');
        testComponentCall(it, 'Should set hidden',   LIB_FILENAME, 'components.label.setHidden',   'hidden',   'number');
        testComponentCall(it, 'Should set x',        LIB_FILENAME, 'components.label.setX',        'x',        'number');
        testComponentCall(it, 'Should set y',        LIB_FILENAME, 'components.label.setY',        'y',        'number');
        testComponentCall(it, 'Should set text',     LIB_FILENAME, 'components.label.setText',     'text',     'string');
        testComponentCall(it, 'Should set number',   LIB_FILENAME, 'components.label.setNumber',   'number',   'number');
    }
);
