/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher        = require('../../../../js/frontend/lib/dispatcher').dispatcher;
const testComponentCall = require('../../../utils').testComponentCall;

afterEach(function() {
    dispatcher.reset();
});

const LIB_FILENAME = 'assets/template/lib/components/rectangle.whl';

describe(
    'Test Rectangle component module',
    function() {
        testComponentCall(it, 'Should set hidden',       LIB_FILENAME, 'components.rectangle.setHidden',       'hidden',       'number');
        testComponentCall(it, 'Should set x',            LIB_FILENAME, 'components.rectangle.setX',            'x',            'number');
        testComponentCall(it, 'Should set y',            LIB_FILENAME, 'components.rectangle.setY',            'y',            'number');
        testComponentCall(it, 'Should set width',        LIB_FILENAME, 'components.rectangle.setWidth',        'width',        'number');
        testComponentCall(it, 'Should set height',       LIB_FILENAME, 'components.rectangle.setHeight',       'height',       'number');
        testComponentCall(it, 'Should set fillColor',    LIB_FILENAME, 'components.rectangle.setFillColor',    'fillColor',    'rgb');
        testComponentCall(it, 'Should set borderColor',  LIB_FILENAME, 'components.rectangle.setBorderColor',  'borderColor',  'rgb');
        testComponentCall(it, 'Should set borderWidth',  LIB_FILENAME, 'components.rectangle.setBorderWidth',  'borderWidth',  'number');
        testComponentCall(it, 'Should set borderRadius', LIB_FILENAME, 'components.rectangle.setBorderRadius', 'borderRadius', 'number');
    }
);
