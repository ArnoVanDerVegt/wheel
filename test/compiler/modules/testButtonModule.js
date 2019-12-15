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
    function() {
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
            function() {
                let info = testCompile(source);
                info.modules[4].on('Button.Button', this, function(b) {
                    b(3);
                });
                info.modules[0].on('Console.Log', this, function(opts) {
                    assert.equal(opts.message, 3);
                });
                info.vm.setCommands(info.commands).run();
            }
        );
    }
);
