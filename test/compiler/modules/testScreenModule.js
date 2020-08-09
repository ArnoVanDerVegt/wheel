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
    'Test Screen module',
    function() {
        testModuleCall(
            it,
            'Should call Screen.Update',
            [
                'proc main()',
                '    mod 2, 0',
                'end'
            ],
            2, // Module id
            'Screen.Update',
            {
            }
        );
        testModuleCall(
            it,
            'Should call Screen.Clear',
            [
                'proc main()',
                '    mod 2, 1',
                'end'
            ],
            2, // Module id
            'Screen.Clear',
            {
            }
        );
        testModuleCall(
            it,
            'Should call Screen.Fill',
            [
                'proc main()',
                '    record Fill',
                '        number fill',
                '    end',
                '    Fill fill',
                '    fill.fill = 1',
                '    addr fill',
                '    mod  2, 2',
                'end'
            ],
            2, // Module id
            'Screen.Fill',
            {
                fill: 1
            }
        );
        testModuleCall(
            it,
            'Should call Screen.FillColor',
            [
                'proc main()',
                '    record FillColor',
                '        number color',
                '    end',
                '    FillColor fillColor',
                '    fillColor.color = 1',
                '    addr fillColor',
                '    mod  2, 3',
                'end'
            ],
            2, // Module id
            'Screen.FillColor',
            {
                fillColor: 1
            }
        );
        testModuleCall(
            it,
            'Should call Screen.TextSize',
            [
                'proc main()',
                '    record TextSize',
                '        number size',
                '    end',
                '    TextSize textSize',
                '    textSize.size = 2',
                '    addr textSize',
                '    mod  2, 4',
                'end'
            ],
            2, // Module id
            'Screen.TextSize',
            {
                textSize: 2
            }
        );
        testModuleCall(
            it,
            'Should call Screen.TextAlign',
            [
                'proc main()',
                '    record TextAlign',
                '        number align',
                '    end',
                '    TextAlign textAlign',
                '    textAlign.align = 1',
                '    addr textAlign',
                '    mod  2, 5',
                'end'
            ],
            2, // Module id
            'Screen.TextAlign',
            {
                textAlign: 1
            }
        );
        testModuleCall(
            it,
            'Should call Screen.DrawPixel',
            [
                'proc main()',
                '    record DrawPixel',
                '        number x, y',
                '    end',
                '    DrawPixel drawPixel',
                '    drawPixel.x = 25',
                '    drawPixel.y = 53',
                '    addr drawPixel',
                '    mod  2, 6',
                'end'
            ],
            2, // Module id
            'Screen.DrawPixel',
            {
                x: 25,
                y: 53
            }
        );
        testModuleCall(
            it,
            'Should call Screen.DrawNum',
            [
                'proc main()',
                '    record DrawNum',
                '        number x, y, n',
                '    end',
                '    DrawNum drawNum',
                '    drawNum.x = 73',
                '    drawNum.y = 26',
                '    drawNum.n = 11',
                '    addr drawNum',
                '    mod  2, 7',
                'end'
            ],
            2, // Module id
            'Screen.DrawNum',
            {
                x: 73,
                y: 26,
                n: 11
            }
        );
        testModuleCall(
            it,
            'Should call Screen.DrawText',
            [
                'proc main()',
                '    record DrawNum',
                '        number x, y',
                '        string s',
                '    end',
                '    DrawNum drawNum',
                '    drawNum.x = 10',
                '    drawNum.y = 40',
                '    drawNum.s = "Hello world"',
                '    addr drawNum',
                '    mod  2, 8',
                'end'
            ],
            2, // Module id
            'Screen.DrawText',
            {
                x: 10,
                y: 40,
                s: 'Hello world'
            }
        );
        testModuleCall(
            it,
            'Should call Screen.DrawLine',
            [
                'proc main()',
                '    record DrawLine',
                '        number x1, y1, x2, y2',
                '    end',
                '    DrawLine drawLine',
                '    drawLine.x1 = 113',
                '    drawLine.y1 = 73',
                '    drawLine.x2 = 45',
                '    drawLine.y2 = 67',
                '    addr drawLine',
                '    mod  2, 9',
                'end'
            ],
            2, // Module id
            'Screen.DrawLine',
            {
                x1: 113,
                y1: 73,
                x2: 45,
                y2: 67
            }
        );
        testModuleCall(
            it,
            'Should call Screen.DrawRect',
            [
                'proc main()',
                '    record DrawRect',
                '        number x, y, width, height',
                '    end',
                '    DrawRect drawRect',
                '    drawRect.x      = 67',
                '    drawRect.y      = 23',
                '    drawRect.width  = 89',
                '    drawRect.height = 61',
                '    addr drawRect',
                '    mod  2, 10',
                'end'
            ],
            2, // Module id
            'Screen.DrawRect',
            {
                x:      67,
                y:      23,
                width:  89,
                height: 61
            }
        );
        testModuleCall(
            it,
            'Should call Screen.DrawCircle',
            [
                'proc main()',
                '    record DrawCircle',
                '        number x, y, radius',
                '    end',
                '    DrawCircle drawCircle',
                '    drawCircle.x      = 16',
                '    drawCircle.y      = 93',
                '    drawCircle.radius = 43',
                '    addr drawCircle',
                '    mod  2, 11',
                'end'
            ],
            2, // Module id
            'Screen.DrawCircle',
            {
                x:      16,
                y:      93,
                radius: 43
            }
        );
        testModuleCall(
            it,
            'Should call Screen.DrawImage',
            [
                'proc main()',
                '    record DrawNum',
                '        number x, y',
                '        string filename',
                '    end',
                '    DrawNum drawNum',
                '    drawNum.x        = 40',
                '    drawNum.y        = 10',
                '    drawNum.filename = "test.rgf"',
                '    addr drawNum',
                '    mod  2, 12',
                'end'
            ],
            2, // Module id
            'Screen.DrawImage',
            {
                x:        40,
                y:        10,
                filename: 'test.rgf'
            }
        );
    }
);
