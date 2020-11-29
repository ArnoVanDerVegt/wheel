/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const testLogs          = require('../../utils').testLogs;
const testCodeAndMemory = require('../../utils').testCodeAndMemory;

describe(
    'Test select',
    () => {
        describe(
            'Test select number',
            () => {
                testCodeAndMemory(
                    it,
                    'Should select first case, should not create jump table',
                    [
                        'proc main()',
                        '    number i, j',
                        '    i = 1',
                        '    select i',
                        '        case 1:',
                        '            j = 34',
                        '        case 2:',
                        '            j = 48',
                        '    end',
                        '    addr j',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        '0000|0000 set     [stack],        1',
                        '0001|0001 set     [stack + 3],    [stack]',
                        '0002|0002 cmp     [stack + 3],    1',
                        '0003|0002 jmpc    flags.neq,      0005',
                        '0004|0003 set     [stack + 1],    34',
                        '0005|0004 jump    0009',
                        '0006|0004 cmp     [stack + 3],    2',
                        '0007|0004 jmpc    flags.neq,      0008',
                        '0008|0005 set     [stack + 1],    48',
                        '0009|0006 set     src,            1',
                        '0010|0006 add     src,            stack',
                        '0011|0007 mod     0,              1'
                    ],
                    false
                );
                testLogs(
                    it,
                    'Should select first case',
                    [
                        'proc main()',
                        '    number i, j',
                        '    i = 1',
                        '    select i',
                        '        case 1:',
                        '            j = 34',
                        '        case 2:',
                        '            j = 48',
                        '    end',
                        '    addr j',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        34
                    ]
                );
                testLogs(
                    it,
                    'Should select second case',
                    [
                        'proc main()',
                        '    number i, j',
                        '    i = 2',
                        '    select i',
                        '        case 1:',
                        '            j = 34',
                        '        case 2:',
                        '            j = 48',
                        '    end',
                        '    addr j',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        48
                    ]
                );
                testLogs(
                    it,
                    'Should select no case',
                    [
                        'proc main()',
                        '    number i, j',
                        '    i = 3',
                        '    j = 255',
                        '    select i',
                        '        case 1:',
                        '            j = 34',
                        '        case 2:',
                        '            j = 48',
                        '    end',
                        '    addr j',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        255
                    ]
                );
            }
        );
        describe(
            'Test select expression',
            () => {
                testLogs(
                    it,
                    'Should select expression',
                    [
                        'proc main()',
                        '    number i, j',
                        '    i = 3',
                        '    select i * 2',
                        '        case 6:',
                        '            j = 55',
                        '    end',
                        '    addr j',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        55
                    ]
                );
                testLogs(
                    it,
                    'Should not select expression',
                    [
                        'proc main()',
                        '    number i, j',
                        '    i = 3',
                        '    j = 255',
                        '    select i * 2',
                        '        case 5:',
                        '            j = 55',
                        '    end',
                        '    addr j',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        255
                    ]
                );
            }
        );
        describe(
            'Test select with default',
            () => {
                testLogs(
                    it,
                    'Should select first case',
                    [
                        'proc main()',
                        '    number i = 1',
                        '    number j',
                        '    select i',
                        '        case 1:',
                        '            j = 77',
                        '        default:',
                        '            j = 255',
                        '    end',
                        '    addr j',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        77
                    ]
                );
                testLogs(
                    it,
                    'Should select default case',
                    [
                        'proc main()',
                        '    number i = 2',
                        '    number j',
                        '    select i',
                        '        case 1:',
                        '            j = 77',
                        '        default:',
                        '            j = 255',
                        '    end',
                        '    addr j',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        255
                    ]
                );
            }
        );
        describe(
            'Test create jump table',
            () => {
                testCodeAndMemory(
                    it,
                    'Should create jump table for 3 cases',
                    [
                        'proc main()',
                        '    number i = 2',
                        '    number j',
                        '    select i',
                        '        case 1:',
                        '            j = 77',
                        '        case 2:',
                        '            j = 85',
                        '        case 3:',
                        '            j = 495',
                        '    end',
                        '    addr j',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        '0000|0000 set     [stack],        2',
                        '0001|0001 set     [stack + 3],    [stack]',
                        '0002|0002 cmp     [stack + 3],    1',
                        '0003|0002 jmpc    flags.l,        0015',
                        '0004|0002 cmp     [stack + 3],    3',
                        '0005|0002 jmpc    flags.g,        0015',
                        '0006|0002 add     [stack + 3],    6',
                        '0007|0002 set     code,           [stack + 3]',
                        '0008|0003 jump    0011',
                        '0009|0003 jump    0013',
                        '0010|0003 jump    0015',
                        '0011|0004 set     [stack + 1],    77',
                        '0012|0005 jump    0016',
                        '0013|0006 set     [stack + 1],    85',
                        '0014|0007 jump    0016',
                        '0015|0008 set     [stack + 1],    495',
                        '0016|0009 set     src,            1',
                        '0017|0009 add     src,            stack',
                        '0018|0010 mod     0,              1'
                    ],
                    false
                );
                testLogs(
                    it,
                    'Should select first case',
                    [
                        'proc main()',
                        '    number i = 2',
                        '    number j',
                        '    select i',
                        '        case 1:',
                        '            j = 77',
                        '        case 2:',
                        '            j = 85',
                        '        case 3:',
                        '            j = 495',
                        '    end',
                        '    addr j',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        85
                    ]
                );
                testCodeAndMemory(
                    it,
                    'Should create jump table for 3 cases and default',
                    [
                        'proc main()',
                        '    number i = 99',
                        '    number j',
                        '    select i',
                        '        case 1:',
                        '            j = 77',
                        '        case 2:',
                        '            j = 85',
                        '        case 3:',
                        '            j = 495',
                        '        default:',
                        '            j = 361',
                        '    end',
                        '    addr j',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        '0000|0000 set     [stack],        99',
                        '0001|0001 set     [stack + 3],    [stack]',
                        '0002|0002 cmp     [stack + 3],    1',
                        '0003|0002 jmpc    flags.l,        0016',
                        '0004|0002 cmp     [stack + 3],    3',
                        '0005|0002 jmpc    flags.g,        0016',
                        '0006|0002 add     [stack + 3],    6',
                        '0007|0002 set     code,           [stack + 3]',
                        '0008|0003 jump    0011',
                        '0009|0003 jump    0013',
                        '0010|0003 jump    0015',
                        '0011|0004 set     [stack + 1],    77',
                        '0012|0005 jump    0018',
                        '0013|0006 set     [stack + 1],    85',
                        '0014|0007 jump    0018',
                        '0015|0008 set     [stack + 1],    495',
                        '0016|0009 jump    0018',
                        '0017|0010 set     [stack + 1],    361',
                        '0018|0011 set     src,            1',
                        '0019|0011 add     src,            stack',
                        '0020|0012 mod     0,              1'
                    ],
                    false
                );
                testLogs(
                    it,
                    'Should select default',
                    [
                        'proc main()',
                        '    number i = 99',
                        '    number j',
                        '    select i',
                        '        case 1:',
                        '            j = 77',
                        '        case 2:',
                        '            j = 85',
                        '        case 3:',
                        '            j = 495',
                        '        default:',
                        '            j = 361',
                        '    end',
                        '    addr j',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        361
                    ]
                );
                testCodeAndMemory(
                    it,
                    'Should create jump table for missing cases',
                    [
                        'proc main()',
                        '    number i = 2',
                        '    number j',
                        '    select i',
                        '        case 1:',
                        '            j = 77',
                        '        case 2:',
                        '            j = 85',
                        '        case 3:',
                        '            j = 495',
                        '        case 5:',
                        '            j = 356',
                        '    end',
                        '    addr j',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        '0000|0000 set     [stack],        2',
                        '0001|0001 set     [stack + 3],    [stack]',
                        '0002|0002 cmp     [stack + 3],    1',
                        '0003|0002 jmpc    flags.l,        0019',
                        '0004|0002 cmp     [stack + 3],    5',
                        '0005|0002 jmpc    flags.g,        0019',
                        '0006|0002 add     [stack + 3],    6',
                        '0007|0002 set     code,           [stack + 3]',
                        '0008|0003 jump    0013',
                        '0009|0003 jump    0015',
                        '0010|0003 jump    0017',
                        '0011|0003 jump    0020',
                        '0012|0003 jump    0019',
                        '0013|0004 set     [stack + 1],    77',
                        '0014|0005 jump    0020',
                        '0015|0006 set     [stack + 1],    85',
                        '0016|0007 jump    0020',
                        '0017|0008 set     [stack + 1],    495',
                        '0018|0009 jump    0020',
                        '0019|0010 set     [stack + 1],    356',
                        '0020|0011 set     src,            1',
                        '0021|0011 add     src,            stack',
                        '0022|0012 mod     0,              1'
                    ],
                    false
                );
                testLogs(
                    it,
                    'Should select second case',
                    [
                        'proc main()',
                        '    number i = 2',
                        '    number j',
                        '    select i',
                        '        case 1:',
                        '            j = 77',
                        '        case 2:',
                        '            j = 85',
                        '        case 3:',
                        '            j = 495',
                        '        case 5:',
                        '            j = 356',
                        '    end',
                        '    addr j',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        85
                    ]
                );
                testCodeAndMemory(
                    it,
                    'Should select default',
                    [
                        'proc main()',
                        '    number i = 4',
                        '    number j',
                        '    select i',
                        '        case 1:',
                        '            j = 77',
                        '        case 2:',
                        '            j = 85',
                        '        case 3:',
                        '            j = 495',
                        '        case 5:',
                        '            j = 356',
                        '        default:',
                        '            j = 361',
                        '    end',
                        '    addr j',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        '0000|0000 set     [stack],        4',
                        '0001|0001 set     [stack + 3],    [stack]',
                        '0002|0002 cmp     [stack + 3],    1',
                        '0003|0002 jmpc    flags.l,        0020',
                        '0004|0002 cmp     [stack + 3],    5',
                        '0005|0002 jmpc    flags.g,        0020',
                        '0006|0002 add     [stack + 3],    6',
                        '0007|0002 set     code,           [stack + 3]',
                        '0008|0003 jump    0013',
                        '0009|0003 jump    0015',
                        '0010|0003 jump    0017',
                        '0011|0003 jump    0021',
                        '0012|0003 jump    0019',
                        '0013|0004 set     [stack + 1],    77',
                        '0014|0005 jump    0022',
                        '0015|0006 set     [stack + 1],    85',
                        '0016|0007 jump    0022',
                        '0017|0008 set     [stack + 1],    495',
                        '0018|0009 jump    0022',
                        '0019|0010 set     [stack + 1],    356',
                        '0020|0011 jump    0022',
                        '0021|0012 set     [stack + 1],    361',
                        '0022|0013 set     src,            1',
                        '0023|0013 add     src,            stack',
                        '0024|0014 mod     0,              1'
                    ],
                    false
                );
                testLogs(
                    it,
                    'Should select default',
                    [
                        'proc main()',
                        '    number i = 4',
                        '    number j',
                        '    select i',
                        '        case 1:',
                        '            j = 77',
                        '        case 2:',
                        '            j = 85',
                        '        case 3:',
                        '            j = 495',
                        '        case 5:',
                        '            j = 356',
                        '        default:',
                        '            j = 361',
                        '    end',
                        '    addr j',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        361
                    ]
                );
            }
        );
    }
);
