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
