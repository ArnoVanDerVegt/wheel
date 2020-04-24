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
    'Test Tabs component module',
    function() {
        testComponentCall(it, 'Should set tabIndex', 71, 0, 'tabIndex');
        testComponentCall(it, 'Should set hidden',   71, 1, 'hidden');
        testComponentCall(it, 'Should set disabled', 71, 2, 'disabled');
        testComponentCall(it, 'Should set x',        71, 3, 'x');
        testComponentCall(it, 'Should set y',        71, 4, 'y');
        testComponentCall(it, 'Should set width',    71, 5, 'width');
        testComponentCall(it, 'Should set height',   71, 6, 'height');
        testComponentCall(it, 'Should set active',   71, 7, 'active');
    }
);
