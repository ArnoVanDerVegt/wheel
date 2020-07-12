/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher        = require('../../../../js/frontend/lib/dispatcher').dispatcher;
const testComponentCall = require('../../../utils').testComponentCall;

afterEach(function() {
    dispatcher.reset();
});

const LIB_FILENAME = 'assets/template/lib/components/checkbox.whl';

describe(
    'Test Checkbox component module',
    function() {
        testComponentCall(it, 'Should set hidden',   LIB_FILENAME, 'components.checkbox.setHidden',   'hidden',   'number');
        testComponentCall(it, 'Should set disabled', LIB_FILENAME, 'components.checkbox.setDisabled', 'disabled', 'number');
        testComponentCall(it, 'Should set x',        LIB_FILENAME, 'components.checkbox.setX',        'x',        'number');
        testComponentCall(it, 'Should set y',        LIB_FILENAME, 'components.checkbox.setY',        'y',        'number');
        testComponentCall(it, 'Should set text',     LIB_FILENAME, 'components.checkbox.setText',     'text',     'string');
        testComponentCall(it, 'Should set hint',     LIB_FILENAME, 'components.checkbox.setHint',     'title',    'string');
        testComponentCall(it, 'Should set checked',  LIB_FILENAME, 'components.checkbox.setChecked',  'checked',  'number');
    }
);
