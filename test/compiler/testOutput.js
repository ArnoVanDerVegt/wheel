/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const assert      = require('assert');
const testCompile = require('../utils').testCompile;
const Text        = require('../../js/frontend/program/output/Text').Text;

describe(
    'Test output',
    () => {
        it(
            'Should output simple program',
            () => {
                let info = testCompile([
                        'number n',
                        'proc main()',
                        '    addr n',
                        '    n = 21',
                        '    mod 0, 1',
                        'end'
                    ]);
                info.program.setTitle('Test program');
                let output = new Text(info.program).getOutput(true, false);
                let expect = [
                        'Wheel VM Program',
                        '#VERSION',
                        '    1',
                        '#NAME',
                        '    Test program',
                        '#LAYERS',
                        '    0',
                        '#HEAP',
                        '    1024',
                        '#STRINGS',
                        '    64,64',
                        '    0',
                        '#CONSTANTS',
                        '    0',
                        '#REG_CODE',
                        '    0',
                        '#REG_STACK',
                        '    10',
                        '#CODE',
                        '0000  set     src,                9',
                        '0001  set     [9],                21',
                        '0002  mod     0,                  1',
                        '#PROC',
                        '    0',
                    ].join('\n');
                assert.equal(output.trim(), expect.trim());
            }
        );
        it(
            'Should output program with string',
            () => {
                let info = testCompile([
                        'string s = "Jumped over the lazy dog"',
                        'proc main()',
                        '    addr s',
                        '    mod  0, 2',
                        'end'
                    ]);
                let output = new Text(info.program).getOutput(true, false);
                let expect = [
                        'Wheel VM Program',
                        '#VERSION',
                        '    1',
                        '#NAME',
                        '    null',
                        '#LAYERS',
                        '    0',
                        '#HEAP',
                        '    1024',
                        '#STRINGS',
                        '    64,64',
                        '    1',
                        '    "Jumped over the lazy dog"',
                        '#CONSTANTS',
                        '    0',
                        '#REG_CODE',
                        '    0',
                        '#REG_STACK',
                        '    10',
                        '#CODE',
                        '0000  set     src,                1',
                        '0001  set     ptr,                9',
                        '0002  mod     10,                 0',
                        '0003  sets    [9],                0',
                        '0004  set     src,                9',
                        '0005  mod     0,                  2',
                        '#PROC',
                        '    0',
                    ].join('\n');
                assert.equal(output.trim(), expect.trim());
            }
        );
        it(
            'Should output program with condition',
            () => {
                let info = testCompile([
                        'number a',
                        'proc main()',
                        '    a = 99',
                        '    if a == 99',
                        '        addr a',
                        '        mod 0, 1',
                        '    end',
                        'end'
                    ]);
                let output = new Text(info.program).getOutput(true, false);
                let expect = [
                        'Wheel VM Program',
                        '#VERSION',
                        '    1',
                        '#NAME',
                        '    null',
                        '#LAYERS',
                        '    0',
                        '#HEAP',
                        '    1024',
                        '#STRINGS',
                        '    64,64',
                        '    0',
                        '#CONSTANTS',
                        '    0',
                        '#REG_CODE',
                        '    0',
                        '#REG_STACK',
                        '    10',
                        '#CODE',
                        '0000  set     [9],                99',
                        '0001  set     [stack],            [9]',
                        '0002  cmp     [stack],            99',
                        '0003  jmpc    flags.neq,          0005',
                        '0004  set     src,                9',
                        '0005  mod     0,                  1',
                        '#PROC',
                        '    0',
                    ].join('\n');
                assert.equal(output.trim(), expect.trim());
            }
        );
        it(
            'Should output program with condition and',
            () => {
                let info = testCompile([
                        'number a',
                        'number b',
                        'proc main()',
                        '    a = 13',
                        '    b = 7',
                        '    if a and b',
                        '        addr b',
                        '        mod 0, 1',
                        '    end',
                        'end'
                    ]);
                let output = new Text(info.program).getOutput(true, false);
                let expect = [
                        'Wheel VM Program',
                        '#VERSION',
                        '    1',
                        '#NAME',
                        '    null',
                        '#LAYERS',
                        '    0',
                        '#HEAP',
                        '    1024',
                        '#STRINGS',
                        '    64,64',
                        '    0',
                        '#CONSTANTS',
                        '    0',
                        '#REG_CODE',
                        '    0',
                        '#REG_STACK',
                        '    11',
                        '#CODE',
                        '0000  set     [9],                13',
                        '0001  set     [10],               7',
                        '0002  set     src,                [9]',
                        '0003  cmp     src,                0',
                        '0004  setf    [stack],            flags.neq',
                        '0005  set     src,                [10]',
                        '0006  cmp     src,                0',
                        '0007  setf    [stack + 1],        flags.neq',
                        '0008  and     [stack],            [stack + 1]',
                        '0009  cmp     [stack],            0',
                        '0010  jmpc    flags.eq,           0012',
                        '0011  set     src,                10',
                        '0012  mod     0,                  1',
                        '#PROC',
                        '    0',
                    ].join('\n');
                assert.equal(output.trim(), expect.trim());
            }
        );
        it(
            'Should output program with jump',
            () => {
                let info = testCompile([
                        'proc main()',
                        '    number i, j',
                        '    i = 1',
                        '    select i',
                        '        case 0:',
                        '            j = 0',
                        '            repeat',
                        '                addr j',
                        '                mod 0, 1',
                        '                j += 1',
                        '                if j > 3',
                        '                    break',
                        '                end',
                        '            end',
                        '        case 1:',
                        '    end',
                        'end'
                    ]);
                let output = new Text(info.program).getOutput(true, false);
                let expect = [
                        'Wheel VM Program',
                        '#VERSION',
                        '    1',
                        '#NAME',
                        '    null',
                        '#LAYERS',
                        '    0',
                        '#HEAP',
                        '    1024',
                        '#STRINGS',
                        '    64,64',
                        '    0',
                        '#CONSTANTS',
                        '    0',
                        '#REG_CODE',
                        '    0',
                        '#REG_STACK',
                        '    9',
                        '#CODE',
                        '0000  set     [stack],            1',
                        '0001  set     [stack + 3],        [stack]',
                        '0002  cmp     [stack + 3],        0',
                        '0003  jmpc    flags.neq,          0014',
                        '0004  set     [stack + 1],        0',
                        '0005  set     src,                1',
                        '0006  add     src,                stack',
                        '0007  mod     0,                  1',
                        '0008  add     [stack + 1],        1',
                        '0009  set     [stack + 4],        [stack + 1]',
                        '0010  cmp     [stack + 4],        3',
                        '0011  jmpc    flags.le,           0012',
                        '0012  jump    0014',
                        '0013  jump    0005',
                        '0014  jump    0017',
                        '0015  cmp     [stack + 3],        1',
                        '0016  jmpc    flags.neq,          0016',
                        '#PROC',
                        '    0',
                    ].join('\n');
                assert.equal(output.trim(), expect.trim());
            }
        );
        it(
            'Should output program with constants',
            () => {
                let info = testCompile([
                        'number a[3] = [0, 1, 2]',
                        'number b[4] = [4, 5, 6, 7]',
                        'proc main()',
                        '    addr a[1]',
                        '    mod  0, 1',
                        '    addr b[2]',
                        '    mod  0, 1',
                        'end'
                    ]);
                let output = new Text(info.program).getOutput(true, false);
                let expect = [
                        'Wheel VM Program',
                        '#VERSION',
                        '    1',
                        '#NAME',
                        '    null',
                        '#LAYERS',
                        '    0',
                        '#HEAP',
                        '    1024',
                        '#STRINGS',
                        '    64,64',
                        '    0',
                        '#CONSTANTS',
                        '    1',
                        '    offset: 0009',
                        '    data:   [0,1,2,4,5,6,7]',
                        '#REG_CODE',
                        '    0',
                        '#REG_STACK',
                        '    16',
                        '#CODE',
                        '0000  set     src,                10',
                        '0001  mod     0,                  1',
                        '0002  set     src,                14',
                        '0003  mod     0,                  1',
                        '#PROC',
                        '    0',
                    ].join('\n');
                assert.equal(output.trim(), expect.trim());
            }
        );
    }
);
