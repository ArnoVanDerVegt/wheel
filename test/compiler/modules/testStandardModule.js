/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const standardModuleConstants = require('../../../js/shared/vm/modules/standardModuleConstants');
const dispatcher              = require('../../../js/frontend/lib/dispatcher').dispatcher;
const testModuleCall          = require('../../utils').testModuleCall;
const testLogs                = require('../../utils').testLogs;
const testCompile             = require('../../utils').testCompile;
const assert                  = require('assert');

describe(
    'Test Standard module',
    () => {
        it(
            'Should clear console',
            () => {
                let source = [
                        'proc main()',
                        '    mod 0, ' + standardModuleConstants.STANDARD_CLEAR_CONSOLE,
                        'end'
                    ];
                let info    = testCompile(source);
                let cleared = false;
                info.modules[0].on('Console.Clear', this, () => {
                    cleared = true;
                });
                info.vm.setCommands(info.commands).run();
                assert.equal(cleared, true);
            }
        );
    }
);
