/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const BasicIOState = require('../../js/frontend/ide/plugins/simulator/lib/motor/io/BasicIOState');
const assert       = require('assert');

class MockDevice {
    getConnected() {
        return false;
    }
}

describe(
    'Test BasicIOState',
    () => {
        it(
            'Should create BasicIOState',
            () => {
                let basicIOState = new BasicIOState.BasicIOState({
                        layer: 1,
                        id:    2
                    });
                assert.equal(basicIOState.getLayer(), 1);
                assert.equal(basicIOState.getId(),    2);
                assert.equal(basicIOState.getValue(), 0);
            }
        );
        it(
            'Should set speed',
            () => {
                let basicIOState = new BasicIOState.BasicIOState({
                        layer: 1,
                        id:    2
                    });
                assert.equal(basicIOState.getSpeed(), 100);
                basicIOState.setSpeed(-101); // Should be limited...
                assert.equal(basicIOState.getSpeed(), -100);
                basicIOState.setSpeed(101); // Should be limited...
                assert.equal(basicIOState.getSpeed(), 100);
            }
        );
        it(
            'Should reset timeout',
            () => {
                let value        = -1;
                let basicIOState = new BasicIOState.BasicIOState({
                        onChangeValue: (v) => { value = v; }
                    });
                basicIOState.onResetTimeout();
                assert.equal(value, 0);
            }
        );
        it(
            'Should set connected',
            () => {
                let connected    = null;
                let basicIOState = new BasicIOState.BasicIOState({
                        onChangeConnected: function(c) {
                            connected = c;
                        }
                    });
                assert.equal(basicIOState.getConnected(), false);
                basicIOState.setConnected(true);
                assert.equal(basicIOState.getConnected(), true);
                assert.equal(connected,                   true);
                basicIOState.setConnected(false);
                assert.equal(basicIOState.getConnected(), false);
                assert.equal(connected,                   false);
            }
        );
        it(
            'Should set type',
            () => {
                let type         = null;
                let basicIOState = new BasicIOState.BasicIOState({
                        onChangeType: function(t) {
                            type = t;
                        }
                    });
                assert.equal(basicIOState.getType(), 0);
                basicIOState.setType(5);
                assert.equal(basicIOState.getType(), 5);
                assert.equal(type,                   5);
                basicIOState.setType(9);
                assert.equal(basicIOState.getType(), 9);
                assert.equal(type,                   9);
            }
        );
        it(
            'Should set mode',
            () => {
                let mode         = null;
                let basicIOState = new BasicIOState.BasicIOState({
                        onChangeMode: function(m) {
                            mode = m;
                        }
                    });
                assert.equal(basicIOState.getMode(),  0);
                basicIOState.setMode(15);
                assert.equal(basicIOState.getMode(), 15);
                assert.equal(mode,                   15);
                basicIOState.setMode(19);
                assert.equal(basicIOState.getMode(), 19);
                assert.equal(mode,                   19);
            }
        );
        it(
            'Should set value',
            () => {
                let value        = null;
                let basicIOState = new BasicIOState.BasicIOState({
                        settings: {
                            getSensorAutoReset: () => { return false; }
                        },
                        onChangeValue: function(v) {
                            value = v;
                        }
                    });
                assert.equal(basicIOState.getValue(),   0);
                basicIOState.setValue(115);
                assert.equal(basicIOState.getValue(), 115);
                assert.equal(value,                   115);
                basicIOState.setValue(119);
                assert.equal(basicIOState.getValue(), 119);
                assert.equal(value,                   119);
            }
        );
        it(
            'Should set motorMode',
            () => {
                let basicIOState = new BasicIOState.BasicIOState({});
                basicIOState.setOn(true);
                assert.equal(basicIOState.getMotorMode(), 1);
            }
        );
        it(
            'Should set motor',
            () => {
                let basicIOState = new BasicIOState.BasicIOState({});
                basicIOState.setIsMotor(true);
                assert.equal(basicIOState.getIsMotor(), true);
                basicIOState.setIsMotor(false);
                assert.equal(basicIOState.getIsMotor(), false);
            }
        );
        it(
            'Should update with motor on',
            () => {
                let time         = 1000;
                let basicIOState = new BasicIOState.BasicIOState({
                        device:         new MockDevice(),
                        onChangeMode:   () => {},
                        getCurrentTime: () => {
                            time += 1000;
                            return time;
                        }
                    });
                basicIOState
                    .setIsMotor(true)
                    .setOn(true)
                    .updateSimulatedMotor();
                basicIOState.updateSimulatedMotor();
                assert.equal(basicIOState.getPosition(), Math.round(1000 / 1000 * 272 / 60 * 100));
            }
        );
        it(
            'Should update with motor move to target',
            () => {
                let time         = 1000;
                let basicIOState = new BasicIOState.BasicIOState({
                        device:         new MockDevice(),
                        onChangeMode:   () => {},
                        getCurrentTime: () => {
                            time += 1000;
                            return time;
                        }
                    });
                basicIOState
                    .setIsMotor(true)
                    .setTarget(1000)
                    .updateSimulatedMotor();
                basicIOState.updateSimulatedMotor();
                assert.equal(basicIOState.getPosition(), Math.round(1000 / 1000 * 272 / 60 * 100));
            }
        );
        it(
            'Should update with motor move to target, reached max',
            () => {
                let time         = 1000;
                let basicIOState = new BasicIOState.BasicIOState({
                        device:         new MockDevice(),
                        onChangeMode:   () => {},
                        getCurrentTime: () => {
                            time += 1000;
                            return time;
                        }
                    });
                basicIOState
                    .setIsMotor(true)
                    .setTarget(200)
                    .updateSimulatedMotor();
                basicIOState.updateSimulatedMotor();
                assert.equal(basicIOState.getPosition(), 200);
            }
        );
        it(
            'Should update with motor move to target, reached min',
            () => {
                let time         = 1000;
                let basicIOState = new BasicIOState.BasicIOState({
                        device:         new MockDevice(),
                        onChangeMode:   () => {},
                        getCurrentTime: () => {
                            time += 1000;
                            return time;
                        }
                    });
                basicIOState
                    .setIsMotor(true)
                    .setTarget(-200)
                    .updateSimulatedMotor();
                basicIOState.updateSimulatedMotor();
                assert.equal(basicIOState.getPosition(), -200);
            }
        );
    }
);
