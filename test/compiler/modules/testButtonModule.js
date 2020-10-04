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
    'Test Button module',
    () => {
        let source = [
                'proc button()',
                '    number b',
                '    addr b',
                '    mod  4, 0',
                '    ret  b',
                'end',
                'proc main()',
                '    number a = button()',
                '    addr a',
                '    mod  0, 1',
                'end'
            ];
        it(
            'Should read button',
            () => {
                let info = testCompile(source);
                info.modules[4].on('Button.Button', this, function(b) {
                    b.callback(3);
                });
                info.modules[0].on('Console.Log', this, function(opts) {
                    assert.equal(opts.message, 3);
                });
                info.vm.setCommands(info.commands).run();
            }
        );
        it(
            'Should wait for button press',
            function(done) {
                let source = [
                        'proc waitForPress()',
                        '    mod 4, 1',
                        'end',
                        'proc main()',
                        '    waitForPress()',
                        '    number a = 55',
                        '    addr a',
                        '    mod  0, 1',
                        'end'
                    ];
                let info = testCompile(source);
                info.modules[4].on('Button.WaitForPress', this, function(button) {
                    button(false);
                    setTimeout(
                        () => {
                            button(true);
                            assert.equal(typeof button === 'function', true);
                        },
                        10
                    );
                });
                info.modules[0].on('Console.Log', this, function(opts) {
                    assert.equal(opts.message, 55);
                    done();
                });
                info.vm.setCommands(info.commands).run();
            }
        );
    }
);
