/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const BasicIOState = require('../../js/frontend/ide/plugins/simulator/lib/motor/io/BasicIOState').BasicIOState;
const assert       = require('assert');

describe(
    'Test BasicIOState',
    function() {
        it(
            'Should create BasicIOState',
            function() {
                let basicIOState = new BasicIOState({
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
            function() {
                let basicIOState = new BasicIOState({
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
            'Should set connected',
            function() {
                let connected    = null;
                let basicIOState = new BasicIOState({
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
            function() {
                let type         = null;
                let basicIOState = new BasicIOState({
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
    }
);
