/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher        = require('../../../../js/frontend/lib/dispatcher').dispatcher;
const testComponentCall = require('../../../utils').testComponentCall;

afterEach(() => {
    dispatcher.reset();
});

const LIB_FILENAME = 'assets/template/lib/components/image.whl';

describe(
    'Test Image component module',
    () => {
        testComponentCall(it, {message: 'Should set hidden', moduleFile: LIB_FILENAME, procName: 'components.image.setHidden', property: 'hidden', type: 'number'});
        testComponentCall(it, {message: 'Should set x',      moduleFile: LIB_FILENAME, procName: 'components.image.setX',      property: 'x',      type: 'number'});
        testComponentCall(it, {message: 'Should set y',      moduleFile: LIB_FILENAME, procName: 'components.image.setY',      property: 'y',      type: 'number'});
        testComponentCall(it, {message: 'Should set width',  moduleFile: LIB_FILENAME, procName: 'components.image.setWidth',  property: 'width',  type: 'number'});
        testComponentCall(it, {message: 'Should set height', moduleFile: LIB_FILENAME, procName: 'components.image.setHeight', property: 'height', type: 'number'});
        testComponentCall(it, {message: 'Should set src',    moduleFile: LIB_FILENAME, procName: 'components.image.setSrc',    property: 'src',    type: 'string'});
    }
);
