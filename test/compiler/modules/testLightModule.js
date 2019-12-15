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
    'Test Light',
    function() {
        testModuleCall(
            it,
            'Should set light pattern',
            [
                'proc light(number color)',
                '    record Light',
                '        number color',
                '    end',
                '    Light light',
                '    light.color = color',
                '    addr light',
                '    mod  3, 0',
                'end',
                'proc main()',
                '    light(1)',
                'end'
            ],
            3, // Module id
            'Light.Light',
            {
                color: 1
            }
        );
    }
);
