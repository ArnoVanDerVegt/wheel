/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher        = require('../../../../js/frontend/lib/dispatcher').dispatcher;
const testComponentCall = require('../../../utils').testComponentCall;

afterEach(() => {
    dispatcher.reset();
});

const LIB_FILENAME = 'assets/template/lib/components/statusLight.whl';

describe(
    'Test Status light component module',
    () => {
        testComponentCall(it, {message: 'Should set hidden',   moduleFile: LIB_FILENAME, procName: 'components.statusLight.setHidden',   property: 'hidden',   type: 'number'});
        testComponentCall(it, {message: 'Should set x',        moduleFile: LIB_FILENAME, procName: 'components.statusLight.setX',        property: 'x',        type: 'number'});
        testComponentCall(it, {message: 'Should set y',        moduleFile: LIB_FILENAME, procName: 'components.statusLight.setY',        property: 'y',        type: 'number'});
        testComponentCall(it, {message: 'Should set color',    moduleFile: LIB_FILENAME, procName: 'components.statusLight.setColor',    property: 'color',    type: 'number'});
        testComponentCall(it, {message: 'Should set rgbColor', moduleFile: LIB_FILENAME, procName: 'components.statusLight.setRgbColor', property: 'rgbColor', type: 'number'});
        testComponentCall(it, {message: 'Should set rgb',      moduleFile: LIB_FILENAME, procName: 'components.statusLight.setRgb',      property: 'rgb',      type: 'rgb'});
    }
);
