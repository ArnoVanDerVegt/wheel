/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher        = require('../../../../js/frontend/lib/dispatcher').dispatcher;
const testComponentCall = require('../../../utils').testComponentCall;

afterEach(() => {
    dispatcher.reset();
});

const LIB_FILENAME = 'assets/template/lib/modules/components/ev3Sensor.whl';

describe(
    'Test EV3Sensor component module',
    () => {
        testComponentCall(it, {message: 'Should set device', moduleFile: LIB_FILENAME, procName: 'components.ev3Sensor.setType',  property: 'device', type: 'number'});
        testComponentCall(it, {message: 'Should set port',   moduleFile: LIB_FILENAME, procName: 'components.ev3Sensor.setPort',  property: 'port',   type: 'number'});
        testComponentCall(it, {message: 'Should set value',  moduleFile: LIB_FILENAME, procName: 'components.ev3Sensor.setValue', property: 'value',  type: 'number'});
    }
);
