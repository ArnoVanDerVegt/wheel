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
        testComponentCall(it, {message: 'Should set hidden',       moduleFile: LIB_FILENAME, procName: 'components.circle.setHidden',       property: 'hidden',       type: 'number'});
        testComponentCall(it, {message: 'Should set x',            moduleFile: LIB_FILENAME, procName: 'components.circle.setX',            property: 'x',            type: 'number'});
        testComponentCall(it, {message: 'Should set y',            moduleFile: LIB_FILENAME, procName: 'components.circle.setY',            property: 'y',            type: 'number'});
        testComponentCall(it, {message: 'Should set radius',       moduleFile: LIB_FILENAME, procName: 'components.circle.setRadius',       property: 'radius',       type: 'number'});
        testComponentCall(it, {message: 'Should set fillColor',    moduleFile: LIB_FILENAME, procName: 'components.circle.setFillColor',    property: 'fillColor',    type: 'rgb'});
        testComponentCall(it, {message: 'Should set borderColor',  moduleFile: LIB_FILENAME, procName: 'components.circle.setBorderColor',  property: 'borderColor',  type: 'rgb'});
        testComponentCall(it, {message: 'Should set borderWidth',  moduleFile: LIB_FILENAME, procName: 'components.circle.setBorderWidth',  property: 'borderWidth',  type: 'number'});
        testComponentCall(it, {message: 'Should set borderRadius', moduleFile: LIB_FILENAME, procName: 'components.circle.setBorderRadius', property: 'borderRadius', type: 'number'});
    }
);
