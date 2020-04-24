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
    'Test Panel component module',
    function() {
        testComponentCall(it, 'Should set hidden',   70, 0, 'hidden');
        testComponentCall(it, 'Should set x',        70, 1, 'x');
        testComponentCall(it, 'Should set y',        70, 2, 'y');
        testComponentCall(it, 'Should set width',    70, 3, 'width');
        testComponentCall(it, 'Should set height',   70, 4, 'height');
    }
);
