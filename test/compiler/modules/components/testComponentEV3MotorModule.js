/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher        = require('../../../../js/frontend/lib/dispatcher').dispatcher;
const testComponentCall = require('../../../utils').testComponentCall;

afterEach(() => {
    dispatcher.reset();
});

const LIB_FILENAME = 'assets/template/lib/modules/components/ev3Motor.whl';

describe(
    'Test EV3Motor component module',
    () => {
        testComponentCall(it, {message: 'Should set device', moduleFile: LIB_FILENAME, procName: 'components.ev3Motor.setType',  property: 'device', type: 'number'});
        testComponentCall(it, {message: 'Should set port',   moduleFile: LIB_FILENAME, procName: 'components.ev3Motor.setPort',  property: 'port',   type: 'number'});
        testComponentCall(it, {message: 'Should set speed',  moduleFile: LIB_FILENAME, procName: 'components.ev3Motor.setSpeed', property: 'speed',  type: 'number'});
        testComponentCall(it, {message: 'Should set value',  moduleFile: LIB_FILENAME, procName: 'components.ev3Motor.setValue', property: 'value',  type: 'number'});
        testComponentCall(it, {message: 'Should set ready',  moduleFile: LIB_FILENAME, procName: 'components.ev3Motor.setReady', property: 'ready',  type: 'number'});
    }
);
