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
    'Test Motor module',
    function() {
        testModuleCall(
            it,
            'Should set type',
            [
                'proc setType(number layer, number id, number type)',
                '    addr layer',
                '    mod  6, 0',
                'end',
                'proc main()',
                '    setType(1, 0, 4)',
                'end'
            ],
            6, // Module id
            'Motor.SetType',
            {
                layer: 1,
                id:    0,
                type:  4
            }
        );
        testModuleCall(
            it,
            'Should set speed',
            [
                'proc setSpeed(number layer, number id, number speed)',
                '    addr layer',
                '    mod  6, 1',
                'end',
                'proc main()',
                '    setSpeed(0, 3, 75)',
                'end'
            ],
            6, // Module id
            'Motor.SetSpeed',
            {
                layer: 0,
                id:    3,
                speed: 75
            }
        );
        testModuleCall(
            it,
            'Should set brake',
            [
                'proc setBrake(number layer, number id, number brake)',
                '    addr layer',
                '    mod  6, 2',
                'end',
                'proc main()',
                '    setBrake(0, 3, 0)',
                'end'
            ],
            6, // Module id
            'Motor.SetBrake',
            {
                layer: 0,
                id:    3,
                brake: 0
            }
        );
        testModuleCall(
            it,
            'Should reset',
            [
                'proc reset(number layer, number id)',
                '    addr layer',
                '    mod  6, 4',
                'end',
                'proc main()',
                '    reset(1, 2)',
                'end'
            ],
            6, // Module id
            'Motor.Reset',
            {
                layer: 1,
                id:    2
            }
        );
        testModuleCall(
            it,
            'Should moveto',
            [
                'proc moveto(number layer, number id, number target)',
                '    addr layer',
                '    mod  6, 5',
                'end',
                'proc main()',
                '    moveto(2, 2, 389)',
                'end'
            ],
            6, // Module id
            'Motor.MoveTo',
            {
                layer:  2,
                id:     2,
                target: 389
            }
        );
        testModuleCall(
            it,
            'Should turn on',
            [
                'proc on(number layer, number id)',
                '    addr layer',
                '    mod  6, 6',
                'end',
                'proc main()',
                '    on(1, 2)',
                'end'
            ],
            6, // Module id
            'Motor.On',
            {
                layer: 1,
                id:    2
            }
        );
        testModuleCall(
            it,
            'Should moveto',
            [
                'proc timeOn(number layer, number id, number time)',
                '    addr layer',
                '    mod  6, 7',
                'end',
                'proc main()',
                '    timeOn(2, 0, 2000)',
                'end'
            ],
            6, // Module id
            'Motor.TimeOn',
            {
                layer: 2,
                id:    0,
                time:  2000
            }
        );
        testModuleCall(
            it,
            'Should stop',
            [
                'proc stop(number layer, number id)',
                '    addr layer',
                '    mod  6, 8',
                'end',
                'proc main()',
                '    stop(2, 1)',
                'end'
            ],
            6, // Module id
            'Motor.Stop',
            {
                layer: 2,
                id:    1
            }
        );
        it(
            'Should read motor',
            function() {
                let source = [
                        'proc motorLayerRead(number layer, number id)',
                        '    number result',
                        '    addr layer',
                        '    mod  6, 9',
                        '    ret  result',
                        'end',
                        'proc main()',
                        '    number a = motorLayerRead(0, 0)',
                        '    addr a',
                        '    mod  0, 1',
                        'end'
                    ];
                let info = testCompile(source);
                info.modules[6].on('Motor.Read', this, function(motor) {
                    motor.callback(123);
                });
                info.modules[0].on('Console.Log', this, function(opts) {
                    assert.equal(opts.message, 123);
                });
                info.vm.setCommands(info.commands).run();
                assert.equal(info.compiler.getUseInfo().getUsedModule(6, 9), true);
                assert.equal(info.compiler.getUseInfo().getUsedModule(2, 3), false);
            }
        );
    }
);
