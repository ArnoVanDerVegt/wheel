/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher        = require('../../../../js/frontend/lib/dispatcher').dispatcher;
const testComponentCall = require('../../../utils').testComponentCall;

afterEach(function() {
    dispatcher.reset();
});

const LIB_FILENAME = 'assets/template/lib/components/image.whl';

describe(
    'Test Image component module',
    function() {
        testComponentCall(it, 'Should set hidden', LIB_FILENAME, 'components.image.setHidden', 'hidden', 'number');
        testComponentCall(it, 'Should set x',      LIB_FILENAME, 'components.image.setX',      'x',      'number');
        testComponentCall(it, 'Should set y',      LIB_FILENAME, 'components.image.setY',      'y',      'number');
        testComponentCall(it, 'Should set width',  LIB_FILENAME, 'components.image.setWidth',  'width',  'number');
        testComponentCall(it, 'Should set height', LIB_FILENAME, 'components.image.setHeight', 'height', 'number');
        testComponentCall(it, 'Should set src',    LIB_FILENAME, 'components.image.setSrc',    'src',    'string');
    }
);
