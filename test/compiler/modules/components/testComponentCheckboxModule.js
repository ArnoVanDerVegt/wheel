/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher        = require('../../../../js/frontend/lib/dispatcher').dispatcher;
const testComponentCall = require('../../../utils').testComponentCall;

afterEach(function() {
    dispatcher.reset();
});

describe(
    'Test Checkbox component module',
    function() {
        testComponentCall(it, 'Should set tabIndex', 68, 0, 'tabIndex');
        testComponentCall(it, 'Should set hidden',   68, 1, 'hidden');
        testComponentCall(it, 'Should set disabled', 68, 2, 'disabled');
        testComponentCall(it, 'Should set x',        68, 3, 'x');
        testComponentCall(it, 'Should set y',        68, 4, 'y');
        testComponentCall(it, 'Should set text',     68, 5, 'text');
        testComponentCall(it, 'Should set hint',     68, 6, 'title');
        testComponentCall(it, 'Should set checked',  68, 7, 'checked');
    }
);
