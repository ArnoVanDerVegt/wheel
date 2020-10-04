/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher        = require('../../../../js/frontend/lib/dispatcher').dispatcher;
const testComponentCall = require('../../../utils').testComponentCall;

afterEach(() => {
    dispatcher.reset();
});

const LIB_FILENAME = 'assets/template/lib/components/icon.whl';

describe(
    'Test Icon component module',
    () => {
        testComponentCall(it, {message: 'Should set hidden', moduleFile: LIB_FILENAME, procName: 'components.icon.setHidden', property: 'hidden', type: 'number'});
        testComponentCall(it, {message: 'Should set x',      moduleFile: LIB_FILENAME, procName: 'components.icon.setX',      property: 'x',      type: 'number'});
        testComponentCall(it, {message: 'Should set y',      moduleFile: LIB_FILENAME, procName: 'components.icon.setY',      property: 'y',      type: 'number'});
    }
);
