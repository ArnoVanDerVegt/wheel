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
    'Test modules',
    function() {
        describe(
            'Test System',
            function() {
                testLogs(
                    it,
                    'Should get the battery voltage',
                    [
                        'proc getBatteryVoltage()',
                        '    mod 9, 0',
                        'end',
                        'proc main()',
                        '    number voltage = getBatteryVoltage()',
                        '    addr voltage',
                        '    mod  0, 1',
                        'end'
                    ],
                    [
                        7
                    ]
                );
                testLogs(
                    it,
                    'Should get the battery currency',
                    [
                        'proc getBatteryCurrency()',
                        '    mod 9, 1',
                        'end',
                        'proc main()',
                        '    number currency = getBatteryCurrency()',
                        '    addr currency',
                        '    mod  0, 1',
                        'end'
                    ],
                    [
                        500
                    ]
                );
                testLogs(
                    it,
                    'Should get the battery level',
                    [
                        'proc getBatteryLevel()',
                        '    mod 9, 2',
                        'end',
                        'proc main()',
                        '    number level = getBatteryLevel()',
                        '    addr level',
                        '    mod  0, 1',
                        'end'
                    ],
                    [
                        25
                    ]
                );
                testLogs(
                    it,
                    'Should get the volume',
                    [
                        'proc getVolume()',
                        '    mod  9, 3',
                        'end',
                        'proc main()',
                        '    number volume = getVolume()',
                        '    addr volume',
                        '    mod  0, 1',
                        'end'
                    ],
                    [
                        50
                    ]
                );
                testModuleCall(
                    it,
                    'Should set the volume',
                    [
                        'proc main()',
                        '    number volume',
                        '    volume = 33',
                        '    addr volume',
                        '    mod  9, 4',
                        'end'
                    ],
                    9, // Module id
                    'System.SetVolume',
                    {
                        volume: 33
                    }
                );
                testLogs(
                    it,
                    'Should get the power off time',
                    [
                        'proc getPowerOffTime()',
                        '    mod  9, 5',
                        'end',
                        'proc main()',
                        '    number time = getPowerOffTime()',
                        '    addr time',
                        '    mod  0, 1',
                        'end'
                    ],
                    [
                        30
                    ]
                );
                testModuleCall(
                    it,
                    'Should set the power off time',
                    [
                        'proc main()',
                        '    number time',
                        '    time = 60',
                        '    addr time',
                        '    mod  9, 6',
                        'end'
                    ],
                    9, // Module id
                    'System.SetPowerOffMinutes',
                    {
                        time: 60
                    }
                );
                testLogs(
                    it,
                    'Should get the brick name',
                    [
                        'proc main()',
                        '    string name',
                        '    addr name',
                        '    mod  9, 7',
                        '    mod  0, 2',
                        'end'
                    ],
                    [
                        'EV3'
                    ]
                );
                testModuleCall(
                    it,
                    'Should set the brick name',
                    [
                        'proc main()',
                        '    string name',
                        '    name = "serialBrick1"',
                        '    addr name',
                        '    mod  9, 8',
                        'end'
                    ],
                    9, // Module id
                    'System.SetBrickname',
                    {
                        name: 'serialBrick1'
                    }
                );
                testLogs(
                    it,
                    'Should get the total memory',
                    [
                        'proc getTotalMemory()',
                        '    mod  9, 9',
                        'end',
                        'proc main()',
                        '    number total = getTotalMemory()',
                        '    addr total',
                        '    mod  0, 1',
                        'end'
                    ],
                    [
                        16 * 1024
                    ]
                );
                testLogs(
                    it,
                    'Should get the free memory',
                    [
                        'proc getFreeMemory()',
                        '    mod  9, 10',
                        'end',
                        'proc main()',
                        '    number free = getFreeMemory()',
                        '    addr free',
                        '    mod  0, 1',
                        'end'
                    ],
                    [
                        4 * 1024
                    ]
                );
            }
        );
    }
);
