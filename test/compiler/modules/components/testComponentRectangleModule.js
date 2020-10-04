/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher        = require('../../../../js/frontend/lib/dispatcher').dispatcher;
const testComponentCall = require('../../../utils').testComponentCall;

afterEach(() => {
    dispatcher.reset();
});

const LIB_FILENAME = 'assets/template/lib/components/rectangle.whl';

describe(
    'Test Rectangle component module',
    () => {
        testComponentCall(it, {message: 'Should set hidden',       moduleFile: LIB_FILENAME, procName: 'components.rectangle.setHidden',       property: 'hidden',       type: 'number'});
        testComponentCall(it, {message: 'Should set x',            moduleFile: LIB_FILENAME, procName: 'components.rectangle.setX',            property: 'x',            type: 'number'});
        testComponentCall(it, {message: 'Should set y',            moduleFile: LIB_FILENAME, procName: 'components.rectangle.setY',            property: 'y',            type: 'number'});
        testComponentCall(it, {message: 'Should set width',        moduleFile: LIB_FILENAME, procName: 'components.rectangle.setWidth',        property: 'width',        type: 'number'});
        testComponentCall(it, {message: 'Should set height',       moduleFile: LIB_FILENAME, procName: 'components.rectangle.setHeight',       property: 'height',       type: 'number'});
        testComponentCall(it, {message: 'Should set fillColor',    moduleFile: LIB_FILENAME, procName: 'components.rectangle.setFillColor',    property: 'fillColor',    type: 'rgb'});
        testComponentCall(it, {message: 'Should set borderColor',  moduleFile: LIB_FILENAME, procName: 'components.rectangle.setBorderColor',  property: 'borderColor',  type: 'rgb'});
        testComponentCall(it, {message: 'Should set borderWidth',  moduleFile: LIB_FILENAME, procName: 'components.rectangle.setBorderWidth',  property: 'borderWidth',  type: 'number'});
        testComponentCall(it, {message: 'Should set borderRadius', moduleFile: LIB_FILENAME, procName: 'components.rectangle.setBorderRadius', property: 'borderRadius', type: 'number'});
    }
);
