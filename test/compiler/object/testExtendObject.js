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
                testLogs(
                    it,
                    'Should extend a simple object and an empty object and overwrite a method',
                    [
                        'object Animal',
                        '    number x',
                        '    number y',
                        'end',
                        'proc Animal.setXY(number xx, number yy)',
                        '    x = xx',
                        '    y = yy',
                        'end',
                        'object Mamal extends Animal',
                        'end',
                        'object Dog extends Mamal',
                        'end',
                        'Dog d',
                        'proc main()',
                        '    d.setXY(3357, 2371)',
                        '    addr d.x',
                        '    mod 0, 1',
                        '    addr d.y',
                        '    mod 0, 1',
                        'end'
                    ],
                    [
                        3357,
                        2371
                    ]
                );
                testLogs(
                    it,
                    'Should extend a simple object and an empty object and overwrite a method',
                    [
                        'object Animal',
                        '    number x',
                        '    number y',
                        'end',
                        'proc Animal.test()',
                        '    number i = 1111',
                        '    addr i',
                        '    mod 0, 1',
                        'end',

                        'object Mamal extends Animal',
                        'end',
                        'proc Mamal.test()',
                        '    number i = 2222',
                        '    addr i',
                        '    mod 0, 1',
                        '    super()',
                        'end',

                        'object Dog extends Mamal',
                        'end',
                        'proc Dog.test()',
                        '    number i = 3333',
                        '    addr i',
                        '    mod 0, 1',
                        '    super()',
                        'end',

                        'Dog d',
                        'proc main()',
                        '    d.test()',
                        'end'
                    ],
                    [
                        3333,
                        2222,
                        1111
                    ]
                );
                testLogs(
                    it,
                    'Should extend a simple object and an empty object and overwrite a method',
                    [
                        'object Animal',
                        '    number x',
                        '    number y',
                        'end',
                        'proc Animal.test()',
                        'end',

                        'object Dog extends Animal',
                        'end',
                        'proc Dog.test()',
                        '    number i = 2222',
                        '    addr i',
                        '    mod 0, 1',
                        'end',

                        'object Cat extends Animal',
                        'end',
                        'proc Cat.test()',
                        '    number i = 3333',
                        '    addr i',
                        '    mod 0, 1',
                        'end',

                        'Dog d',
                        'Cat c',
                        'record AnimalPtr',
                        '    Animal ^a',
                        'end',
                        'proc main()',
                        '    AnimalPtr a[2]',
                        '    a[0].a = @d',
                        '    a[1].a = @c',
                        '    a[0].a.test()',
                        '    a[1].a.test()',
                        'end'
                    ],
                    [
                        2222,
                        3333
                    ]
                );
                testLogs(
                    it,
                    'Should extend a simple object and an empty object and overwrite a method',
                    [
                        'object Animal',
                        '    number x',
                        '    number y',
                        'end',
                        'proc Animal.test()',
                        'end',

                        'object Dog extends Animal',
                        'end',
                        'proc Dog.test()',
                        '    number i = 2222',
                        '    addr i',
                        '    mod 0, 1',
                        'end',

                        'Dog d',
                        'proc main()',
                        '    ^Animal a[2]',
                        '    a[0] = @d',
                        '    a[0].test()',
                        'end'
                    ],
                    [
                        2222
                    ]
                );
            }
        );
    }
);
