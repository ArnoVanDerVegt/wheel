/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher        = require('../../../../js/frontend/lib/dispatcher').dispatcher;
const testComponentCall = require('../../../utils').testComponentCall;

afterEach(function() {
    dispatcher.reset();
});

const LIB_FILENAME = 'assets/template/lib/components/panel.whl';

describe(
    'Test Panel component module',
    function() {
        testComponentCall(it, 'Should set hidden', LIB_FILENAME, 'components.panel.setHidden', 'hidden', 'number');
        testComponentCall(it, 'Should set x',      LIB_FILENAME, 'components.panel.setX',      'x',      'number');
        testComponentCall(it, 'Should set y',      LIB_FILENAME, 'components.panel.setY',      'y',      'number');
        testComponentCall(it, 'Should set width',  LIB_FILENAME, 'components.panel.setWidth',  'width',  'number');
        testComponentCall(it, 'Should set height', LIB_FILENAME, 'components.panel.setHeight', 'height', 'number');
    }
);
