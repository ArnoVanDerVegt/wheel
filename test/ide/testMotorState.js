/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const MotorState = require('../../js/frontend/ide/simulator/io/MotorState').MotorState;
const assert     = require('assert');

describe(
    'Test MotorState',
    function() {
        describe(
            'Test setters',
            function() {
                it(
                    'Should set speed',
                    function() {
                        let motorState = new MotorState({});
                        motorState.setSpeed(10);
                        assert.equal(motorState.getSpeed(), 10);
                        motorState.setSpeed(-10);
                        assert.equal(motorState.getSpeed(), -10);
                        motorState.setSpeed(110);
                        assert.equal(motorState.getSpeed(), 100);
                        motorState.setSpeed(-110);
                        assert.equal(motorState.getSpeed(), -100);
                    }
                );
                it(
                    'Should set target',
                    function() {
                        let motorState = new MotorState({});
                        motorState.setTarget(123);
                        assert.equal(motorState.getTarget(), 123);
                        motorState.setTarget(-456);
                        assert.equal(motorState.getTarget(), -456);
                    }
                );
                it(
                    'Should set position',
                    function() {
                        let motorState = new MotorState({});
                        motorState.setPosition(50);
                        assert.equal(motorState.getPosition(), 50);
                        motorState.setPosition(5.5);
                        assert.equal(motorState.getPosition(), 6);
                        motorState.setPosition(-5.4);
                        assert.equal(motorState.getPosition(), -5);
                    }
                );
                it(
                    'Should set type',
                    function() {
                        let motorState = new MotorState({});
                        motorState.setType(1);
                        assert.equal(motorState.getType(), 1);
                        motorState.setType(0);
                        assert.equal(motorState.getType(), 0);
                        motorState.setType(2);
                        assert.equal(motorState.getType(), 0);
                        motorState.setType(3);
                        assert.equal(motorState.getType(), 1);
                    }
                );
            }
        );
        describe(
            'Test ready',
            function() {
                it(
                    'Should be ready - equal',
                    function() {
                        let motorState = new MotorState({});
                        motorState.setPosition(10);
                        motorState.setTarget(10);
                        assert.equal(motorState.ready(), true);
                    }
                );
                it(
                    'Should be ready',
                    function() {
                        let motorState = new MotorState({});
                        motorState.setPosition(10);
                        motorState.setTarget(19);
                        assert.equal(motorState.ready(), true);
                        motorState.setPosition(10);
                        motorState.setTarget(1);
                        assert.equal(motorState.ready(), true);
                    }
                );
                it(
                    'Should not be ready',
                    function() {
                        let motorState = new MotorState({});
                        motorState.setPosition(10);
                        motorState.setTarget(30);
                        assert.equal(motorState.ready(), false);
                    }
                );
            }
        );
    }
);
