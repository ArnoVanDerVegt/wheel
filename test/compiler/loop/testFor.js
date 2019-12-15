/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const testLogs = require('../../utils').testLogs;

describe(
    'Test for',
    function() {
        describe(
            'Test for to',
            function() {
                testLogs(
                    it,
                    'Should loop three times',
                    [
                        'proc main()',
                        '    number n',
                        '    for n = 0 to 3',
                        '       addr n',
                        '       mod 0, 1',
                        '    end',
                        'end'
                    ],
                    [
                        0, 1, 2, 3
                    ]
                );
                testLogs(
                    it,
                    'Should loop nine times with two nested loops',
                    [
                        'proc main()',
                        '    number i',
                        '    number j',
                        '    for i = 0 to 2',
                        '       for j = 0 to 2',
                        '           addr j',
                        '           mod 0, 1',
                        '       end',
                        '    end',
                        'end'
                    ],
                    [
                        0, 1, 2, 0, 1, 2, 0, 1, 2
                    ]
                );
                testLogs(
                    it,
                    'Should not loop to',
                    [
                        'proc main()',
                        '    number i',
                        '    for i = 4 to 3',
                        '        addr i',
                        '        mod 0, 1',
                        '    end',
                        'end'
                    ],
                    [
                    ]
                );
                testLogs(
                    it,
                    'Should not loop to',
                    [
                        'proc main()',
                        '    number i',
                        '    for i = 3 to 3',
                        '        addr i',
                        '        mod 0, 1',
                        '    end',
                        'end'
                    ],
                    [
                        3
                    ]
                );
                testLogs(
                    it,
                    'Should nested loops with two counters',
                    [
                        'proc main()',
                        '    number i, j',
                        '    number x, y',
                        '    y = 0',
                        '    for i = 0 to 2',
                        '        x = 0',
                        '        for j = 0 to 2',
                        '            addr y',
                        '            mod 0, 1',
                        '            addr x',
                        '            mod 0, 1',
                        '            x += 2',
                        '        end',
                        '        y += 3',
                        '    end',
                        'end'
                    ],
                    [
                        0, 0, 0, 2, 0, 4,
                        3, 0, 3, 2, 3, 4,
                        6, 0, 6, 2, 6, 4
                   ]
                );
            }
        );
        describe(
            'Test for with step',
            function() {
                testLogs(
                    it,
                    'Should loop up four times with step two',
                    [
                        'proc main()',
                        '    number n',
                        '    for n = 0 to 6 step 2',
                        '       addr n',
                        '       mod 0, 1',
                        '    end',
                        'end'
                    ],
                    [
                        0, 2, 4, 6
                    ]
                );
                testLogs(
                    it,
                    'Should loop down four times with step two',
                    [
                        'proc main()',
                        '    number n',
                        '    for n = 8 downto 2 step 2',
                        '       addr n',
                        '       mod 0, 1',
                        '    end',
                        'end'
                    ],
                    [
                        8, 6, 4, 2
                    ]
                );
            }
        );
        describe(
            'Test for to with operator',
            function() {
                testLogs(
                    it,
                    'Should loop to max with operator',
                    [
                        'proc main()',
                        '    number i, j = 2',
                        '    for i = 0 to 3 * j',
                        '       addr i',
                        '       mod 0, 1',
                        '    end',
                        'end'
                    ],
                    [
                        0, 1, 2, 3, 4, 5, 6
                    ]
                );
                testLogs(
                    it,
                    'Should loop from with operator',
                    [
                        'proc main()',
                        '    number i, j = 2',
                        '    for i = j * 2 to 8',
                        '       addr i',
                        '       mod 0, 1',
                        '    end',
                        'end'
                    ],
                    [
                        4, 5, 6, 7, 8
                    ]
                );
            }
        );
        describe(
            'Test for downto',
            function() {
                testLogs(
                    it,
                    'Should loop four times',
                    [
                        'proc main()',
                        '    number n',
                        '    for n = 3 downto 0',
                        '       addr n',
                        '       mod 0, 1',
                        '    end',
                        'end'
                    ],
                    [
                        3, 2, 1, 0
                    ]
                );
                testLogs(
                    it,
                    'Should loop nine times with two nested loops',
                    [
                        'proc main()',
                        '    number i',
                        '    number j',
                        '    for i = 3 downto 1',
                        '       for j = 3 downto 1',
                        '           addr j',
                        '           mod 0, 1',
                        '       end',
                        '    end',
                        'end'
                    ],
                    [
                        3, 2, 1, 3, 2, 1, 3, 2, 1
                    ]
                );
                testLogs(
                    it,
                    'Should not loop downto',
                    [
                        'proc main()',
                        '    number i',
                        '    for i = 3 downto 4',
                        '       addr i',
                        '       mod 0, 1',
                        '    end',
                        'end'
                    ],
                    [
                    ]
                );
                testLogs(
                    it,
                    'Should loop downto',
                    [
                        'proc main()',
                        '    number i',
                        '    for i = 3 downto 3',
                        '       addr i',
                        '       mod 0, 1',
                        '    end',
                        'end'
                    ],
                    [
                        3
                    ]
                );
            }
        );
        describe(
            'Test for downto with operator',
            function() {
                testLogs(
                    it,
                    'Should loop to min with operator',
                    [
                        'proc main()',
                        '    number i, j = 2',
                        '    for i = 10 downto 3 * j',
                        '       addr i',
                        '       mod 0, 1',
                        '    end',
                        'end'
                    ],
                    [
                        10, 9, 8, 7, 6
                    ]
                );
                testLogs(
                    it,
                    'Should loop from with operator',
                    [
                        'proc main()',
                        '    number i, j = 2',
                        '    for i = j * 2 downto 0',
                        '       addr i',
                        '       mod 0, 1',
                        '    end',
                        'end'
                    ],
                    [
                        4, 3, 2, 1, 0
                    ]
                );
            }
        );
    }
);
