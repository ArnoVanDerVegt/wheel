/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const BasicLayerState     = require('../../js/frontend/vm/BasicLayerState').BasicLayerState;
const PoweredUpLayerState = require('../../js/frontend/vm/poweredup/LayerState').LayerState;
const EV3LayerState       = require('../../js/frontend/vm/ev3/LayerState').LayerState;
const assert              = require('assert');

describe(
    'Test layer state',
    function() {
        describe(
            'Test BasicLayerState',
            function() {
                it(
                    'Should check initial port states',
                    function() {
                        let layerState = new BasicLayerState({});
                        assert.deepEqual(
                            layerState.getPorts(),
                            [
                                {mode: 0, value: 0, startDegrees: 0, targetDegrees: 0, assigned: 0, ready: true},
                                {mode: 0, value: 0, startDegrees: 0, targetDegrees: 0, assigned: 0, ready: true},
                                {mode: 0, value: 0, startDegrees: 0, targetDegrees: 0, assigned: 0, ready: true},
                                {mode: 0, value: 0, startDegrees: 0, targetDegrees: 0, assigned: 0, ready: true}
                            ]
                        );
                    }
                );
                it(
                    'Should check initial sensor values',
                    function() {
                        let layerState = new BasicLayerState({});
                        assert.deepEqual(layerState.getSensors(), [0, 0, 0, 0]);
                    }
                );
                it(
                    'Should check initial motor values',
                    function() {
                        let layerState = new BasicLayerState({});
                        assert.deepEqual(layerState.getMotors(), [0, 0, 0, 0]);
                    }
                );
                it(
                    'Should check initial port assignents',
                    function() {
                        let layerState = new BasicLayerState({});
                        assert.deepEqual(layerState.getPortAssignments(), [0, 0, 0, 0]);
                    }
                );
                it(
                    'Should change sensor values',
                    function() {
                        let layerState = new BasicLayerState({device: {emit: function() {}}});
                        layerState.checkSensorChange([
                            {mode: 0, assigned: 0, value: 1},
                            {mode: 0, assigned: 0, value: 2},
                            {mode: 0, assigned: 0, value: 3},
                            {mode: 0, assigned: 0, value: 4}
                        ]);
                        assert.deepEqual(layerState.getSensors(), [1, 2, 3, 4]);
                    }
                );
                it(
                    'Should change sensor assignments',
                    function() {
                        let layerState = new BasicLayerState({device: {emit: function() {}}});
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
                    function() {
                        let changeCount = 0;
                        let layerState  = new BasicLayerState({
                                layer:        0,
                                signalPrefix: 'Test',
                                device: {
                                    emit: function(signal, assigned, mode) {
                                        changeCount++;
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
                    function() {
                        let signals    = [];
                        let layerState = new BasicLayerState({
                                layer:        0,
                                signalPrefix: 'Test',
                                device: {
                                    emit: function(signal, assigned, mode) {
                                        signals.push(signal);
                                    }
                                }
                            });
                        layerState.checkSensorChange([
                            {mode: 0, assigned: 0, value: 1},
                            {mode: 0, assigned: 0, value: 2},
                            {mode: 0, assigned: 0, value: 3},
                            {mode: 0, assigned: 0, value: 4}
                        ]);
                        assert.deepEqual(
                            signals,
                            [
                              'Test0Sensor0Changed',
                              'Test0Sensor1Changed',
                              'Test0Sensor2Changed',
                              'Test0Sensor3Changed'
                            ]
                        );
                    }
                );
            }
        );
        describe(
            'Test PoweredUpLayerState',
            function() {
                it(
                    'Should change acceleration',
                    function() {
                        let layerState = new PoweredUpLayerState({device: {emit: function() {}}});
                        assert.deepEqual(layerState.getAccel(), {x: 0, y: 0, z: 0});
                        layerState.checkAccelChange({x: 11, y: 12, z: 13});
                        assert.deepEqual(layerState.getAccel(), {x: 11, y: 12, z: 13});
                    }
                );
                it(
                    'Should change tilt',
                    function() {
                        let layerState = new PoweredUpLayerState({device: {emit: function() {}}});
                        assert.deepEqual(layerState.getTilt(), {x: 0, y: 0, z: 0});
                        layerState.checkTiltChange({x: 111, y: 112, z: 113});
                        assert.deepEqual(layerState.getTilt(), {x: 111, y: 112, z: 113});
                    }
                );
                it(
                    'Should change type',
                    function() {
                        let layerState = new PoweredUpLayerState({device: {emit: function() {}}});
                        assert.equal(layerState.getType(), null);
                        layerState.setState({type: 123, ports: [{}, {}, {}, {}], ready: [{}, {}, {}, {}]});
                        assert.equal(layerState.getType(), 123);
                    }
                );
                it(
                    'Should change uuid',
                    function() {
                        let layerState = new PoweredUpLayerState({device: {emit: function() {}}});
                        assert.equal(layerState.getUUID(), '');
                        layerState.setState({uuid: 'abcde', ports: [{}, {}, {}, {}], ready: [{}, {}, {}, {}]});
                        assert.equal(layerState.getUUID(), 'abcde');
                    }
                );
                it(
                    'Should change button',
                    function() {
                        let layerState = new PoweredUpLayerState({device: {emit: function() {}}});
                        assert.equal(layerState.getButton(), 0);
                        layerState.setState({button: 541, ports: [{}, {}, {}, {}], ready: [{}, {}, {}, {}]});
                        assert.equal(layerState.getButton(), 541);
                    }
                );
                it(
                    'Should change connected',
                    function() {
                        let layerState = new PoweredUpLayerState({device: {emit: function() {}}});
                        assert.equal(layerState.getConnected(), false);
                        layerState.setState({connected: true, ports: [{}, {}, {}, {}], ready: [{}, {}, {}, {}]});
                        assert.equal(layerState.getConnected(), true);
                    }
                );
            }
        );
        describe(
            'Test EV3LayerState',
            function() {
                it(
                    'Should change motor assignments',
                    function() {
                        let layerState = new EV3LayerState({device: {emit: function() {}}});
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
                    function() {
                        let layerState = new EV3LayerState({device: {emit: function() {}}});
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
                    function() {
                        let layerState = new EV3LayerState({device: {emit: function() {}}});
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
                    function() {
                        let signals    = [];
                        let layerState = new EV3LayerState({
                                layer:        0,
                                signalPrefix: 'Test',
                                device: {
                                    emit: function(signal, assigned, mode) {
                                        signals.push(signal);
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
                                'EV3.Layer0Motor0Assigned',
                                'EV3.Layer0Motor1Assigned',
                                'EV3.Layer0Motor2Assigned',
                                'EV3.Layer0Motor3Assigned'
                            ]
                        );
                    }
                );
                it(
                    'Should emit four changed signals',
                    function() {
                        let signals    = [];
                        let layerState = new EV3LayerState({
                                layer:        0,
                                signalPrefix: 'Test',
                                device: {
                                    emit: function(signal, assigned, mode) {
                                        signals.push(signal);
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
                                'EV3.Layer0Motor0Changed',
                                'EV3.Layer0Motor1Changed',
                                'EV3.Layer0Motor2Changed',
                                'EV3.Layer0Motor3Changed'
                            ]
                        );
                    }
                );
            }
        );
    }
);
