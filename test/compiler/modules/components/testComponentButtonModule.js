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
    'Test Button component module',
    function() {
        testComponentCall(it, 'Should set tabIndex', 65, 0, 'tabIndex');
        testComponentCall(it, 'Should set hidden',   65, 1, 'hidden');
        testComponentCall(it, 'Should set disabled', 65, 2, 'disabled');
        testComponentCall(it, 'Should set x',        65, 3, 'x');
        testComponentCall(it, 'Should set y',        65, 4, 'y');
        testComponentCall(it, 'Should set color',    65, 5, 'color');
        testComponentCall(it, 'Should set value',    65, 6, 'value');
        testComponentCall(it, 'Should set title',    65, 7, 'title');
    }
);
