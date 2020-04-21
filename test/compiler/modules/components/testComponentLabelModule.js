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
    'Test Label component module',
    function() {
        testComponentCall(it, 'Should set tabIndex', 67, 0, 'tabIndex');
        testComponentCall(it, 'Should set hidden',   67, 1, 'hidden');
        testComponentCall(it, 'Should set x',        67, 2, 'x');
        testComponentCall(it, 'Should set y',        67, 3, 'y');
        testComponentCall(it, 'Should set text',     67, 4, 'text');
    }
);
