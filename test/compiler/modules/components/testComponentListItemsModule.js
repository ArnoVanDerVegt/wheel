/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher        = require('../../../../js/frontend/lib/dispatcher').dispatcher;
const testComponentCall = require('../../../utils').testComponentCall;

afterEach(function() {
    dispatcher.reset();
});

const LIB_FILENAME = 'assets/template/lib/components/listItems.whl';

describe(
    'Test List items component module',
    function() {
        testComponentCall(it, 'Should set hidden', LIB_FILENAME, 'components.listItems.setHidden', 'hidden', 'number');
        testComponentCall(it, 'Should set x',      LIB_FILENAME, 'components.listItems.setX',      'x',      'number');
        testComponentCall(it, 'Should set y',      LIB_FILENAME, 'components.listItems.setY',      'y',      'number');
    }
);
