/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher        = require('../../../../js/frontend/lib/dispatcher').dispatcher;
const testComponentCall = require('../../../utils').testComponentCall;

afterEach(function() {
    dispatcher.reset();
});

const LIB_FILENAME = 'assets/template/lib/components/poweredUpDevice.whl';

describe(
    'Test PUDevice component module',
    function() {
        testComponentCall(it, 'Should set type',       LIB_FILENAME, 'components.puDevice.setType',      'type',      'number');
        testComponentCall(it, 'Should set port',       LIB_FILENAME, 'components.puDevice.setPort',      'port',      'number');
        testComponentCall(it, 'Should set speed',      LIB_FILENAME, 'components.puDevice.setSpeed',     'speed',     'number');
        testComponentCall(it, 'Should set value',      LIB_FILENAME, 'components.puDevice.setValue',     'value',     'number');
        testComponentCall(it, 'Should set ready',      LIB_FILENAME, 'components.puDevice.setReady',     'ready',     'number');
        testComponentCall(it, 'Should set color mode', LIB_FILENAME, 'components.puDevice.setColorMode', 'colorMode', 'number');
    }
);
