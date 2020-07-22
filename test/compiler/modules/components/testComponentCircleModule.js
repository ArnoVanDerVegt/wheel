/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher        = require('../../../../js/frontend/lib/dispatcher').dispatcher;
const testComponentCall = require('../../../utils').testComponentCall;

afterEach(function() {
    dispatcher.reset();
});

const LIB_FILENAME = 'assets/template/lib/components/circle.whl';

describe(
    'Test Circle component module',
    function() {
        testComponentCall(it, 'Should set hidden',       LIB_FILENAME, 'components.circle.setHidden',       'hidden',       'number');
        testComponentCall(it, 'Should set x',            LIB_FILENAME, 'components.circle.setX',            'x',            'number');
        testComponentCall(it, 'Should set y',            LIB_FILENAME, 'components.circle.setY',            'y',            'number');
        testComponentCall(it, 'Should set radius',       LIB_FILENAME, 'components.circle.setRadius',       'radius',       'number');
        testComponentCall(it, 'Should set fillColor',    LIB_FILENAME, 'components.circle.setFillColor',    'fillColor',    'rgb');
        testComponentCall(it, 'Should set borderColor',  LIB_FILENAME, 'components.circle.setBorderColor',  'borderColor',  'rgb');
        testComponentCall(it, 'Should set borderWidth',  LIB_FILENAME, 'components.circle.setBorderWidth',  'borderWidth',  'number');
        testComponentCall(it, 'Should set borderRadius', LIB_FILENAME, 'components.circle.setBorderRadius', 'borderRadius', 'number');
    }
);
