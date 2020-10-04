/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher        = require('../../../../js/frontend/lib/dispatcher').dispatcher;
const testComponentCall = require('../../../utils').testComponentCall;

afterEach(() => {
    dispatcher.reset();
});

const LIB_FILENAME = 'assets/template/lib/components/progressBar.whl';

describe(
    'Test Progress bar component module',
    () => {
        testComponentCall(it, {message: 'Should set hidden', moduleFile: LIB_FILENAME, procName: 'components.progressBar.setHidden', property: 'hidden', type: 'number'});
        testComponentCall(it, {message: 'Should set x',      moduleFile: LIB_FILENAME, procName: 'components.progressBar.setX',      property: 'x',      type: 'number'});
        testComponentCall(it, {message: 'Should set y',      moduleFile: LIB_FILENAME, procName: 'components.progressBar.setY',      property: 'y',      type: 'number'});
        testComponentCall(it, {message: 'Should set width',  moduleFile: LIB_FILENAME, procName: 'components.progressBar.setWidth',  property: 'width',  type: 'number'});
        testComponentCall(it, {message: 'Should set value',  moduleFile: LIB_FILENAME, procName: 'components.progressBar.setValue',  property: 'value',  type: 'number'});
    }
);
