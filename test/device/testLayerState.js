/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const BasicLayerState     = require('../../js/frontend/vm/device/BasicLayerState').BasicLayerState;
const PoweredUpLayerState = require('../../js/frontend/vm/device/poweredup/LayerState').LayerState;
const PoweredUpState      = require('../../js/frontend/vm/device/poweredup/PoweredUpState').PoweredUpState;
const EV3LayerState       = require('../../js/frontend/vm/device/ev3/LayerState').LayerState;
const assert              = require('assert');

const testDevice = {
        emit: () => {
        },
        getPortsPerLayer: () => {
            return 4;
        }
    };

describe(
    'Test layer state',
    () => {
        describe(
            'Test BasicLayerState',
            () => {
                it(
                    'Should check initial port states',
                    () => {
                        let layerState = new BasicLayerState({device: testDevice});
                        assert.deepEqual(
                            layerState.getPorts(),
                            [
                                {mode: 0, value: 0, startDegrees: 0, targetDegrees: 0, assigned: 0, ready: true, reverse: 1},
                                {mode: 0, value: 0, startDegrees: 0, targetDegrees: 0, assigned: 0, ready: true, reverse: 1},
                                {mode: 0, value: 0, startDegrees: 0, targetDegrees: 0, assigned: 0, ready: true, reverse: 1},
                                {mode: 0, value: 0, startDegrees: 0, targetDegrees: 0, assigned: 0, ready: true, reverse: 1}
                            ]
                        );
                    }
                );
                it(
                    'Should check initial sensor values',
                    () => {
                        let layerState = new BasicLayerState({device: testDevice});
                        assert.deepEqual(layerState.getSensors(), [0, 0, 0, 0]);
                    }
                );
                it(
                    'Should check initial motor values',
                    () => {
                        let layerState = new BasicLayerState({device: testDevice});
                        assert.deepEqual(layerState.getMotors(), [0, 0, 0, 0]);
                    }
                );
                it(
                    'Should check initial port assignents',
                    () => {
                        let layerState = new BasicLayerState({device: testDevice});
                        assert.deepEqual(layerState.getPortAssignments(), [0, 0, 0, 0]);
                    }
                );
                it(
                    'Should change sensor values',
                    () => {
                        let layerState = new BasicLayerState({device: testDevice, layerIndex: 0});
                        layerState.checkSensorChange(
                            [
                                {mode: 0, assigned: 0, value: 1},
                                {mode: 0, assigned: 0, value: 2},
                                {mode: 0, assigned: 0, value: 3},
                                {mode: 0, assigned: 0, value: 4}
                            ],
                            'Assigned',
                            'Changed'
                        );
                        assert.deepEqual(layerState.getSensors(), [1, 2, 3, 4]);
                    }
                );
                it(
                    'Should change sensor assignments',
                    () => {
                        let layerState = new BasicLayerState({device: testDevice, layerIndex: 0});
                        layerState.checkSensorChange([
                            {mode: 0, assigned: 5, value: 0},
                            {mode: 0, assigned: 6, value: 0},
                            {mode: 0, assigned: 7, value: 0},
                            {mode: 0, assigned: 8, value: 0}
                        ]);
                        assert.deepEqual(layerState.getPortAssignments(), [5, 6, 7, 8]);
                    }
                );
                it(
                    'Should emit four changes',
                    () => {
                        let changeCount = 0;
                        let layerState  = new BasicLayerState({
                                layerIndex:   0,
                                signalPrefix: 'Test',
                                device: {
                                    emit: function(signal, assigned, mode) {
                                        changeCount++;
                                    },
                                    getPortsPerLayer: function() {
                                        return 4;
                                    }
                                }
                            });
                        layerState.checkSensorChange([
                            {mode: 0, assigned: 0, value: 1},
                            {mode: 0, assigned: 0, value: 2},
                            {mode: 0, assigned: 0, value: 3},
                            {mode: 0, assigned: 0, value: 4}
                        ]);
                        assert.equal(changeCount, 4);
                    }
                );
                it(
                    'Should emit four signals',
                    () => {
                        let signals    = [];
                        let layerState = new BasicLayerState({
                                layerIndex:   0,
                                signalPrefix: 'Test',
                                device: {
                                    emit: function(signal, assigned, mode) {
                                        signals.push(signal);
                                    },
                                    getPortsPerLayer: function() {
                                        return 4;
                                    }
                                }
                            });
                        layerState.checkSensorChange(
                            [
                                {mode: 0, assigned: 0, value: 1},
                                {mode: 0, assigned: 0, value: 2},
                                {mode: 0, assigned: 0, value: 3},
                                {mode: 0, assigned: 0, value: 4}
                            ],
                            'Assigned',
                            'Changed'
                        );
                        assert.deepEqual(
                            signals,
                            [
                              'Test.Layer0Changed0',
                              'Test.Layer0Changed1',
                              'Test.Layer0Changed2',
                              'Test.Layer0Changed3'
                            ]
                        );
                    }
                );
            }
        );
        describe(
            'Test PoweredUpLayerState',
            () => {
                it(
                    'Should change acceleration',
                    () => {
                        let layerState = new PoweredUpLayerState({device: testDevice});
                        assert.deepEqual(layerState.getAccel(), {x: 0, y: 0, z: 0});
                        layerState.checkAccelChange({x: 11, y: 12, z: 13});
                        assert.deepEqual(layerState.getAccel(), {x: 11, y: 12, z: 13});
                    }
                );
                it(
                    'Should change tilt',
                    () => {
                        let layerState = new PoweredUpLayerState({device: testDevice});
                        assert.deepEqual(layerState.getTilt(), {x: 0, y: 0, z: 0});
                        layerState.checkTiltChange({x: 111, y: 112, z: 113});
                        assert.deepEqual(layerState.getTilt(), {x: 111, y: 112, z: 113});
                    }
                );
                it(
                    'Should change type',
                    () => {
                        let layerState = new PoweredUpLayerState({device: testDevice});
                        assert.equal(layerState.getType(), null);
                        layerState.setState({type: 123, ports: [{}, {}, {}, {}], ready: [{}, {}, {}, {}]});
                        assert.equal(layerState.getType(), 123);
                    }
                );
                it(
                    'Should change uuid',
                    () => {
                        let layerState = new PoweredUpLayerState({device: testDevice});
                        assert.equal(layerState.getUUID(), '');
                        layerState.setState({uuid: 'abcde', ports: [{}, {}, {}, {}], ready: [{}, {}, {}, {}]});
                        assert.equal(layerState.getUUID(), 'abcde');
                    }
                );
                it(
                    'Should change button',
                    () => {
                        let layerState = new PoweredUpLayerState({device: testDevice});
                        assert.equal(layerState.getButton(), 0);
                        layerState.setState({button: 541, ports: [{}, {}, {}, {}], ready: [{}, {}, {}, {}]});
                        assert.equal(layerState.getButton(), 541);
                    }
                );
                it(
                    'Should change connected',
                    () => {
                        let state = new PoweredUpState({LayerState: PoweredUpLayerState});
                        assert.equal(state.getLayerState(0).getConnected(), false);
                        state.setState({layers: [{connected: true, ports: [{}, {}, {}, {}], ready: [{}, {}, {}, {}]}]});
                        assert.equal(state.getLayerState(0).getConnected(), true);
                    }
                );
                it(
                    'Should get port values',
                    () => {
                        let layerState = new PoweredUpLayerState({device: testDevice});
                        assert.deepEqual(layerState.getPortValues('value'), [0, 0, 0, 0]);
                        assert.deepEqual(layerState.getPortAssignments(),   [0, 0, 0, 0]);
                        assert.deepEqual(layerState.getSensors(),           [0, 0, 0, 0]);
                        assert.deepEqual(layerState.getMotors(),            [0, 0, 0, 0]);
                    }
                );
            }
        );
        describe(
            'Test EV3LayerState',
            () => {
                it(
                    'Should change motor assignments',
                    () => {
                        let layerState = new EV3LayerState({device: testDevice});
                        assert.deepEqual(layerState.getMotorAssingments(), [0, 0, 0, 0]);
                        layerState.checkMotorChange([
                            null, null, null, null,
                            {assigned: 1}, {assigned: 2}, {assigned: 3}, {assigned: 4}
                        ]);
                        assert.deepEqual(layerState.getMotorAssingments(), [1, 2, 3, 4]);
                    }
                );
                it(
                    'Should change motor degrees',
                    () => {
                        let layerState = new EV3LayerState({device: testDevice});
                        assert.deepEqual(layerState.getMotorAssingments(), [0, 0, 0, 0]);
                        layerState.checkMotorChange([
                            null, null, null, null,
                            {degrees: 1}, {degrees: 2}, {degrees: 3}, {degrees: 4}
                        ]);
                        assert.deepEqual(layerState.getMotors(), [1, 2, 3, 4]);
                    }
                );
                it(
                    'Should change motor ready',
                    () => {
                        let layerState = new EV3LayerState({device: testDevice});
                        assert.deepEqual(layerState.getMotorValues('ready'), [false, false, false, false]);
                        layerState.checkMotorChange([
                            null, null, null, null,
                            {ready: true}, {ready: false}, {ready: true}, {ready: false}
                        ]);
                        assert.deepEqual(layerState.getMotorValues('ready'), [true, false, true, false]);
                    }
                );
                it(
                    'Should emit four assigned signals',
                    () => {
                        let signals    = [];
                        let layerState = new EV3LayerState({
                                layerIndex:   0,
                                signalPrefix: 'Test',
                                device: {
                                    emit: function(signal, assigned, mode) {
                                        signals.push(signal);
                                    },
                                    getPortsPerLayer: function() {
                                        return 4;
                                    }
                                }
                            });
                        layerState.checkMotorChange([
                            null, null, null, null,
                            {assigned: 1}, {assigned: 2}, {assigned: 3}, {assigned: 4}
                        ]);
                        assert.deepEqual(
                            signals,
                            [
                                'EV3.Layer0.Motor.Assigned0',
                                'EV3.Layer0.Motor.Assigned1',
                                'EV3.Layer0.Motor.Assigned2',
                                'EV3.Layer0.Motor.Assigned3'
                            ]
                        );
                    }
                );
                it(
                    'Should emit four changed signals',
                    () => {
                        let signals    = [];
                        let layerState = new EV3LayerState({
                                layerIndex:   0,
                                signalPrefix: 'Test',
                                device: {
                                    emit: function(signal, assigned, mode) {
                                        signals.push(signal);
                                    },
                                    getPortsPerLayer() {
                                        return 4;
                                    }
                                }
                            });
                        layerState.checkMotorChange([
                            null, null, null, null,
                            {degrees: 1}, {degrees: 2}, {degrees: 3}, {degrees: 4}
                        ]);
                        assert.deepEqual(
                            signals,
                            [
                                'EV3.Layer0.Motor.Changed0',
                                'EV3.Layer0.Motor.Changed1',
                                'EV3.Layer0.Motor.Changed2',
                                'EV3.Layer0.Motor.Changed3'
                            ]
                        );
                    }
                );
            }
        );
    }
);
