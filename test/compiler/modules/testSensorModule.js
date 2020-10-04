/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher     = require('../../../js/frontend/lib/dispatcher').dispatcher;
const testModuleCall = require('../../utils').testModuleCall;
const testLogs       = require('../../utils').testLogs;
const testCompile    = require('../../utils').testCompile;
const assert         = require('assert');

describe(
    'Test Sensor',
    () => {
        testModuleCall(
            it,
            'Should set type',
            [
                'proc setType(number layer, number id, number type)',
                '    addr layer',
                '    mod  7, 0',
                'end',
                'proc main()',
                '    setType(1, 0, 4)',
                'end'
            ],
            7, // Module id
            'Sensor.SetType',
            {
                layer: 1,
                id:    0,
                type:  4
            }
        );
        testModuleCall(
            it,
            'Should get type',
            [
                'proc getType(number layer, number id)',
                '    addr layer',
                '    mod  7, 1',
                'end',
                'proc main()',
                '    number type = getType(2, 3)',
                'end'
            ],
            7, // Module id
            'Sensor.GetType',
            {
                layer: 2,
                id:    3
            }
        );
        testModuleCall(
            it,
            'Should set type',
            [
                'proc setMode(number layer, number id, number mode)',
                '    addr layer',
                '    mod  7, 2',
                'end',
                'proc main()',
                '    setMode(0, 1, 5)',
                'end'
            ],
            7, // Module id
            'Sensor.SetMode',
            {
                layer: 0,
                id:    1,
                mode:  5
            }
        );
        testModuleCall(
            it,
            'Should reset',
            [
                'proc reset(number layer, number id)',
                '    addr layer',
                '    mod  7, 3',
                'end',
                'proc main()',
                '    reset(1, 1)',
                'end'
            ],
            7, // Module id
            'Sensor.Reset',
            {
                layer: 1,
                id:    1
            }
        );
        let source = [
                'proc sensorLayerRead(number layer, number id)',
                '    number result',
                '    addr layer',
                '    mod  7, 4',
                '    ret  result',
                'end',
                'proc main()',
                '    number a = sensorLayerRead(0, 0)',
                '    addr a',
                '    mod  0, 1',
                'end'
            ];
        it(
            'Should read sensor',
            () => {
                let info = testCompile(source);
                info.modules[7].on('Sensor.Read', this, function(s) {
                    s.callback(4645);
                });
                info.modules[0].on('Console.Log', this, function(opts) {
                    assert.equal(opts.message, 4645);
                });
                info.vm.setCommands(info.commands).run();
            }
        );
    }
);
