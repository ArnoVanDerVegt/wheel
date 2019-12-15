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
    'Test Math module',
    function() {
        testLogs(
            it,
            'Should round a number',
            [
                'proc round(number n)',
                '    addr n',
                '    mod  1, 0',
                'end',
                'proc main()',
                '    number n = round(1.6)',
                '    addr n',
                '    mod  0, 1',
                'end'
            ],
            [
                2
            ]
        );
        testLogs(
            it,
            'Should round a number',
            [
                'proc round(number n)',
                '    addr n',
                '    mod  1, 0',
                'end',
                'proc main()',
                '    number n = round(12.4)',
                '    addr n',
                '    mod 0, 1',
                'end'
            ],
            [
                12
            ]
        );
        testLogs(
            it,
            'Should floor a number',
            [
                'proc floor(number n)',
                '    addr n',
                '    mod  1, 1',
                'end',
                'proc main()',
                '    number n = floor(56.9)',
                '    addr n',
                '    mod  0, 1',
                'end'
            ],
            [
                56
            ]
        );
        testLogs(
            it,
            'Should ceil a number',
            [
                'proc ceil(number n)',
                '    addr n',
                '    mod  1, 2',
                'end',
                'proc main()',
                '    number n = ceil(93.1)',
                '    addr n',
                '    mod  0, 1',
                'end'
            ],
            [
                94
            ]
        );
        testLogs(
            it,
            'Should abs a number',
            [
                'proc abs(number n)',
                '    addr n',
                '    mod  1, 3',
                'end',
                'proc main()',
                '    number n = abs(-45)',
                '    addr n',
                '    mod  0, 1',
                'end'
            ],
            [
                45
            ]
        );
        testLogs(
            it,
            'Should abs a number',
            [
                'proc abs(number n)',
                '    addr n',
                '    mod  1, 3',
                'end',
                'proc main()',
                '    number n = abs(78)',
                '    addr n',
                '    mod  0, 1',
                'end'
            ],
            [
                78
            ]
        );
        testLogs(
            it,
            'Should neg a number',
            [
                'proc neg(number n)',
                '    addr n',
                '    mod  1, 4',
                'end',
                'proc main()',
                '    number n = neg(-15)',
                '    addr n',
                '    mod  0, 1',
                'end'
            ],
            [
                -15
            ]
        );
        testLogs(
            it,
            'Should neg a number',
            [
                'proc neg(number n)',
                '    addr n',
                '    mod  1, 4',
                'end',
                'proc main()',
                '    number n = neg(15)',
                '    addr n',
                '    mod  0, 1',
                'end'
            ],
            [
                -15
            ]
        );
        testLogs(
            it,
            'Should get sine',
            [
                'proc sin(number n)',
                '    addr n',
                '    mod  1, 6',
                'end',
                'proc main()',
                '    number n = sin(-' + (Math.PI / 2) + ')',
                '    addr n',
                '    mod  0, 1',
                'end'
            ],
            [
                -1
            ]
        );
        testLogs(
            it,
            'Should get cosine',
            [
                'proc cos(number n)',
                '    addr n',
                '    mod  1, 7',
                'end',
                'proc main()',
                '    number n = cos(' + Math.PI + ')',
                '    addr n',
                '    mod  0, 1',
                'end'
            ],
            [
                -1
            ]
        );
        testLogs(
            it,
            'Should get tan',
            [
                'proc tan(number n)',
                '    addr n',
                '    mod  1, 8',
                'end',
                'proc main()',
                '    number n = tan(0)',
                '    addr n',
                '    mod  0, 1',
                'end'
            ],
            [
                0
            ]
        );
        testLogs(
            it,
            'Should get asine',
            [
                'proc asin(number n)',
                '    addr n',
                '    mod  1, 9',
                'end',
                'proc main()',
                '    number n = asin(0.5)',
                '    addr n',
                '    mod  0, 1',
                'end'
            ],
            [
                Math.asin(0.5)
            ]
        );
        testLogs(
            it,
            'Should get acosine',
            [
                'proc acos(number n)',
                '    addr n',
                '    mod  1, 10',
                'end',
                'proc main()',
                '    number n = acos(0.5)',
                '    addr n',
                '    mod  0, 1',
                'end'
            ],
            [
                Math.acos(0.5)
            ]
        );
        testLogs(
            it,
            'Should get atan',
            [
                'proc atan(number n)',
                '    addr n',
                '    mod  1, 11',
                'end',
                'proc main()',
                '    number n = atan(0.5)',
                '    addr n',
                '    mod  0, 1',
                'end'
            ],
            [
                Math.atan(0.5)
            ]
        );
        testLogs(
            it,
            'Should get remainder',
            [
                'proc remainder(number i, number j)',
                '    addr i',
                '    mod  1, 12',
                'end',
                'proc main()',
                '    number n = remainder(30, 7)',
                '    addr n',
                '    mod  0, 1',
                'end'
            ],
            [
                2
            ]
        );
        testLogs(
            it,
            'Should get exp',
            [
                'proc exp(number n)',
                '    addr n',
                '    mod  1, 13',
                'end',
                'proc main()',
                '    number n = exp(30)',
                '    addr n',
                '    mod  0, 1',
                'end'
            ],
            [
                Math.exp(30)
            ]
        );
        testLogs(
            it,
            'Should get sqrt',
            [
                'proc sqrt(number n)',
                '    addr n',
                '    mod  1, 14',
                'end',
                'proc main()',
                '    number n = sqrt(9)',
                '    addr n',
                '    mod  0, 1',
                'end'
            ],
            [
                Math.sqrt(9)
            ]
        );
        testLogs(
            it,
            'Should get log',
            [
                'proc log(number n)',
                '    addr n',
                '    mod  1, 15',
                'end',
                'proc main()',
                '    number n = log(100)',
                '    addr n',
                '    mod  0, 1',
                'end'
            ],
            [
                Math.log(100)
            ]
        );
        testLogs(
            it,
            'Should get pow',
            [
                'proc pow(number i, number j)',
                '    addr i',
                '    mod  1, 16',
                'end',
                'proc main()',
                '    number n = pow(5, 3)',
                '    addr n',
                '    mod  0, 1',
                'end'
            ],
            [
                Math.pow(5, 3)
            ]
        );
        it(
            'Should get a random number',
            function() {
                let source = [
                        'proc random(number min, number max)',
                        '    addr min',
                        '    mod  1, 5',
                        'end',
                        'proc main()',
                        '    number n = random(5, 20)',
                        '    addr n',
                        '    mod  0, 1',
                        'end'
                    ];
                let info = testCompile(source);
                info.modules[0].on('Console.Log', this, function(opts) {
                    assert.equal(opts.message <= 20, true);
                    assert.equal(opts.message >= 5, true);
                });
                info.vm.setCommands(info.commands).run();
            }
        );
        testLogs(
            it,
            'Should get odd',
            [
                'proc odd(number n)',
                '    addr n',
                '    mod  1, 17',
                'end',
                'proc main()',
                '    number n = odd(3)',
                '    addr n',
                '    mod  0, 1',
                'end'
            ],
            [
                1
            ]
        );
        testLogs(
            it,
            'Should get odd, negative',
            [
                'proc odd(number n)',
                '    addr n',
                '    mod  1, 17',
                'end',
                'proc main()',
                '    number n = odd(-3)',
                '    addr n',
                '    mod  0, 1',
                'end'
            ],
            [
                1
            ]
        );
        testLogs(
            it,
            'Should not get odd',
            [
                'proc odd(number n)',
                '    addr n',
                '    mod  1, 17',
                'end',
                'proc main()',
                '    number n = odd(10)',
                '    addr n',
                '    mod  0, 1',
                'end'
            ],
            [
                0
            ]
        );
        testLogs(
            it,
            'Should not get odd, negative',
            [
                'proc odd(number n)',
                '    addr n',
                '    mod  1, 17',
                'end',
                'proc main()',
                '    number n = odd(-10)',
                '    addr n',
                '    mod  0, 1',
                'end'
            ],
            [
                0
            ]
        );
        testLogs(
            it,
            'Should get even',
            [
                'proc even(number n)',
                '    addr n',
                '    mod  1, 18',
                'end',
                'proc main()',
                '    number n = even(4)',
                '    addr n',
                '    mod  0, 1',
                'end'
            ],
            [
                1
            ]
        );
        testLogs(
            it,
            'Should not get even',
            [
                'proc even(number n)',
                '    addr n',
                '    mod  1, 18',
                'end',
                'proc main()',
                '    number n = even(5)',
                '    addr n',
                '    mod  0, 1',
                'end'
            ],
            [
                0
            ]
        );
        testLogs(
            it,
            'Should get even, negative',
            [
                'proc even(number n)',
                '    addr n',
                '    mod  1, 18',
                'end',
                'proc main()',
                '    number n = even(-4)',
                '    addr n',
                '    mod  0, 1',
                'end'
            ],
            [
                1
            ]
        );
        testLogs(
            it,
            'Should not get even, negative',
            [
                'proc even(number n)',
                '    addr n',
                '    mod  1, 18',
                'end',
                'proc main()',
                '    number n = even(-5)',
                '    addr n',
                '    mod  0, 1',
                'end'
            ],
            [
                0
            ]
        );
    }
);
