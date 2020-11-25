/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher        = require('../../../../js/frontend/lib/dispatcher').dispatcher;
const testComponentCall = require('../../../utils').testComponentCall;

afterEach(() => {
    dispatcher.reset();
});

const LIB_FILENAME = 'assets/template/lib/modules/components/listItems.whl';

describe(
    'Test List items component module',
    () => {
        testComponentCall(it, {message: 'Should set hidden', moduleFile: LIB_FILENAME, procName: 'components.listItems.setHidden', property: 'hidden', type: 'number'});
        testComponentCall(it, {message: 'Should set x',      moduleFile: LIB_FILENAME, procName: 'components.listItems.setX',      property: 'x',      type: 'number'});
        testComponentCall(it, {message: 'Should set y',      moduleFile: LIB_FILENAME, procName: 'components.listItems.setY',      property: 'y',      type: 'number'});
    }
);
