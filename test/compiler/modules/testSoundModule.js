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
    'Test Sound module',
    function() {
        testModuleCall(
            it,
            'Should play tone',
            [
                'proc playTone(number frequency, number duration, number volume)',
                '    addr frequency',
                '    mod  5, 0',
                'end',
                'proc main()',
                '    playTone(440, 500, 75)',
                'end'
            ],
            5, // Module id
            'Sound.PlayTone',
            {
                frequency: 440,
                duration:  500,
                volume:    75
            }
        );
    }
);
