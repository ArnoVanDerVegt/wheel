/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher        = require('../../../../js/frontend/lib/dispatcher').dispatcher;
const testComponentCall = require('../../../utils').testComponentCall;

afterEach(function() {
    dispatcher.reset();
});

const LIB_FILENAME = 'assets/template/lib/components/ev3Sensor.whl';

describe(
    'Test EV3Sensor component module',
    function() {
        testComponentCall(it, 'Should set type',  LIB_FILENAME, 'components.ev3Sensor.setType',  'type',  'number');
        testComponentCall(it, 'Should set port',  LIB_FILENAME, 'components.ev3Sensor.setPort',  'port',  'number');
        testComponentCall(it, 'Should set value', LIB_FILENAME, 'components.ev3Sensor.setValue', 'value', 'number');
    }
);
