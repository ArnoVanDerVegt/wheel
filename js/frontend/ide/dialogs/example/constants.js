/**
 * Wheel, copyright (c) 2021 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/

exports.examples = [
    {
        title:     'Powered Up',
        className: 'p',
        list:  [
            {
                filename:    'examples/poweredup/motor/motor.whlp',
                title:       'Motor',
                description: 'Move a motor a number of degrees'
            },
            {
                filename:    'examples/poweredup/distance/distance.whlp',
                title:       'Distance sensor',
                description: 'Read the distance sensor and log the value'
            },
            {
                filename:    'examples/poweredup/light/light.whlp',
                title:       'Light',
                description: 'Control the led light on the device'
            },
            {
                filename:    'examples/poweredup/tilt/tilt.whlp',
                title:       'Tilt',
                description: 'Log the tilt values'
            }
        ]
    },
    {
        title:     'Spike',
        className: 's',
        list:  [
            {
                filename:    'examples/spike/motor.whlp',
                title:       'Motor',
                description: 'Move a motor a number of degrees'
            },
            {
                filename:    'examples/spike/buttons.whlp',
                title:       'Buttons',
                description: 'Read the device buttons'
            },
            {
                filename:    'examples/spike/text.whlp',
                title:       'Matrix text',
                description: 'Display text on the matrix'
            },
            {
                filename:    'examples/spike/accel.whlp',
                title:       'Acceleration',
                description: 'Log the acceleration values'
            }
        ]
    },
    {
        title:     'EV3',
        className: 'e',
        list:  [
            {
                filename:    'examples/ev3/motor/motor.whlp',
                title:       'Motor',
                description: 'Move a motor a number of degrees'
            },
            {
                filename:    'examples/ev3/sensor/valueNames.whlp',
                title:       'Sensor',
                description: 'Read and display sensor values'
            },
            {
                filename:    'examples/ev3/light/light.whlp',
                title:       'Light',
                description: 'Control the EV3 light'
            },
            {
                filename:    'examples/ev3/sound/tone.whlp',
                title:       'Sound, tone',
                description: 'Play a tone'
            }
        ]
    },
    {
        title:     'General programming',
        className: 'w',
        list:  [
            {
                filename:    'examples/general/string/add.whlp',
                title:       'String, add',
                description: 'Add strings'
            },
            {
                filename:    'examples/general/string/charCode.whlp',
                title:       'String, char code',
                description: 'Get the character code from a string'
            },
            {
                filename:    'examples/general/string/indexOf.whlp',
                title:       'String, index of',
                description: 'Find a string in another string'
            },
            {
                filename:    'examples/general/string/length.whlp',
                title:       'String, length',
                description: 'Get the length of a string'
            },
            {
                filename:    'examples/general/string/subString.whlp',
                title:       'String, sub string',
                description: 'Get a part of a string'
            },
            {
                filename:    'examples/general/string/upperLower.whlp',
                title:       'String, case',
                description: 'Upper or lower case a string'
            },
            {
                filename:    'examples/general/bit/bit.whlp',
                title:       'Bits',
                description: 'Binary operations'
            },
            {
                filename:    'examples/general/math/absNeg.whlp',
                title:       'Math, abs/neg',
                description: 'Absolute or negative value'
            },
            {
                filename:    'examples/general/math/rounding.whlp',
                title:       'Math, rounding',
                description: 'Round, round up or round down'
            },
            {
                filename:    'examples/general/math/sin.whlp',
                title:       'Math, sine',
                description: 'Sine and cosine'
            }
        ]
    },
    {
        title:     'IDE',
        image:     'images/logos/wheelWhite.svg',
        className: 'i',
        list:  [
            {
                filename:    'examples/components/buttons/buttons.wfrm',
                title:       'Buttons',
                description: 'A form with button components'
            },
            {
                filename:    'examples/components/checkbox/checkbox.wfrm',
                title:       'Checkbox',
                description: 'A checkbox component'
            },
            {
                filename:    'examples/components/label/label.wfrm',
                title:       'Label',
                description: 'A form with a label component'
            },
            {
                filename:    'examples/components/tabs/tabs.wfrm',
                title:       'Tabs',
                description: 'A form with tabs'
            }
        ]
    }
];
