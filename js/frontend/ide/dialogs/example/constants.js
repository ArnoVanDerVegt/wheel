/**
 * Wheel, copyright (c) 2021 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/

exports.examples = [
    {
        title:     'EV3',
        image:     'images/ev3/ev364.png',
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
        title:     'Powered Up',
        image:     'images/poweredup/hub64.png',
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
            }
        ]
    },
    {
        title:     'Spike',
        image:     'images/spike/spike64.png',
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
