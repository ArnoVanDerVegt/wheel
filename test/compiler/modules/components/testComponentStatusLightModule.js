/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher        = require('../../../../js/frontend/lib/dispatcher').dispatcher;
const testComponentCall = require('../../../utils').testComponentCall;

afterEach(function() {
    dispatcher.reset();
});

const LIB_FILENAME = 'assets/template/lib/components/statusLight.whl';

describe(
    'Test Status light component module',
    function() {
        testComponentCall(it, 'Should set hidden',   LIB_FILENAME, 'components.statusLight.setHidden',   'hidden',   'number');
        testComponentCall(it, 'Should set x',        LIB_FILENAME, 'components.statusLight.setX',        'x',        'number');
        testComponentCall(it, 'Should set y',        LIB_FILENAME, 'components.statusLight.setY',        'y',        'number');
        testComponentCall(it, 'Should set color',    LIB_FILENAME, 'components.statusLight.setColor',    'color',    'number');
        testComponentCall(it, 'Should set rgbColor', LIB_FILENAME, 'components.statusLight.setRgbColor', 'rgbColor', 'number');
        testComponentCall(it, 'Should set rgb',      LIB_FILENAME, 'components.statusLight.setRgb',      'rgb',      'rgb');
    }
);
