/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const testCodeAndMemory = require('../../utils').testCodeAndMemory;
const testLogs          = require('../../utils').testLogs;

describe(
    'Test extend object',
    () => {
        describe(
            'Test basic object',
            () => {
                testLogs(
                    it,
                    'Should extend a simple object',
                    [
                        'proc printS(string s)',
                        '    addr s',
                        '    mod  0, 2',
                        'end',
                        'object Animal',
                        '    number x, y',
                        'end',
                        'proc Animal.move()',
                        '    printS("Move")',
                        'end',
                        'object Fish extends Animal',
                        'end',
                        'Fish f',
                        'proc main()',
                        '    f.move()',
                        'end'
                    ],
                    [
                        'Move'
                    ]
                );
                testLogs(
                    it,
                    'Should extend a simple object and overwrite a method',
                    [
                        'proc printS(string s)',
                        '    addr s',
                        '    mod  0, 2',
                        'end',
                        'object Animal',
                        '    number x, y',
                        'end',
                        'proc Animal.move()',
                        '    printS("Move")',
                        'end',
                        'object Fish extends Animal',
                        'end',
                        'proc Fish.move()',
                        '    printS("Swim")',
                        'end',
                        'Animal a',
                        'Fish f',
                        'proc main()',
                        '    a.move()',
                        '    f.move()',
                        'end'
                    ],
                    [
                        'Move',
                        'Swim'
                    ]
                );
                testLogs(
                    it,
                    'Should extend a simple object and an empty object and overwrite a method',
                    [
                        'proc printS(string s)',
                        '    addr s',
                        '    mod  0, 2',
                        'end',
                        'object Animal',
                        '    number x, y',
                        'end',
                        'proc Animal.move()',
                        '    printS("Move")',
                        'end',
                        'object Mamal extends Animal',
                        'end',
                        'object Dog extends Mamal',
                        'end',
                        'proc Dog.move()',
                        '    printS("Walk")',
                        '    addr x',
                        '    mod 0, 1',
                        '    addr y',
                        '    mod 0, 1',
                        'end',
                        'Dog d',
                        'proc main()',
                        '    d.x = 5677',
                        '    d.y = 4361',
                        '    d.move()',
                        'end'
                    ],
                    [
                        'Walk',
                        5677,
                        4361
                    ]
                );
            }
        );
    }
);
