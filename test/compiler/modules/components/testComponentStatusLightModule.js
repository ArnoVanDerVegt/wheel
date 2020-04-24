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
    'Test Status light component module',
    function() {
        testComponentCall(it, 'Should set hidden', 69, 0, 'hidden');
        testComponentCall(it, 'Should set x',      69, 1, 'x');
        testComponentCall(it, 'Should set y',      69, 2, 'y');
        testComponentCall(it, 'Should set color',  69, 3, 'color');
    }
);
