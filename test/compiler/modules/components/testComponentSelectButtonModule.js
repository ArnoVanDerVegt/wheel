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
    'Test SelectButton component module',
    function() {
        testComponentCall(it, 'Should set tabIndex', 66, 0, 'tabIndex');
        testComponentCall(it, 'Should set hidden',   66, 1, 'hidden');
        testComponentCall(it, 'Should set disabled', 66, 2, 'disabled');
        testComponentCall(it, 'Should set x',        66, 3, 'x');
        testComponentCall(it, 'Should set y',        66, 4, 'y');
        testComponentCall(it, 'Should set color',    66, 5, 'color');
        testComponentCall(it, 'Should set active',   66, 6, 'active');
    }
);
