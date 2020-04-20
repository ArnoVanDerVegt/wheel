/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher     = require('../../../../js/frontend/lib/dispatcher').dispatcher;
const testModuleCall = require('../../../utils').testModuleCall;
const testLogs       = require('../../../utils').testLogs;
const testCompile    = require('../../../utils').testCompile;
const assert         = require('assert');

afterEach(function() {
    dispatcher.reset();
});

describe(
    'Test Form component module',
    function() {
        it(
            'Should show a form',
            function() {
                let source = [
                        'proc formShow(string filename)',
                        '    addr filename',
                        '    mod  64, 0',
                        'end',
                        'proc main()',
                        '    number handle',
                        '    string filename = "test.wfrm"',
                        '    handle = formShow(filename)',
                        'end'
                    ];
                let info = testCompile(source);
                dispatcher.on(
                    'Form.Show',
                    this,
                    function(data) {
                        assert.deepEqual({filename: '/test.wfrm'}, data);
                    }
                );
                info.vm.setCommands(info.commands).run();
            }
        );
    }
);
