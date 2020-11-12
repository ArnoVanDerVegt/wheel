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
                        '    number i = 4562',
                        '    addr i',
                        '    mod 0, 1',
                        'end',
                        'object Mamal extends Animal',
                        'end',
                        'proc Mamal.test()',
                        '    number i = 9281',
                        '    addr i',
                        '    mod 0, 1',
                        '    super()',
                        'end',
                        'object Dog extends Mamal',
                        'end',
                        'proc Dog.test()',
                        '    number i = 9314',
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
                        9314,
                        9281,
                        4562
                    ]
                );
            }
        );
        describe(
            'Test polymorphism',
            () => {
                testLogs(
                    it,
                    'Should create two objects and cast them as their parent through a pointer field',
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
                        '    number i = 3261',
                        '    addr i',
                        '    mod 0, 1',
                        'end',
                        'object Cat extends Animal',
                        'end',
                        'proc Cat.test()',
                        '    number i = 3674',
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
                        '    number i = 0',
                        '    a[i].a.test()',
                        '    i = 1',
                        '    a[i].a.test()',
                        '    a[i - 1].a.test()',
                        'end'
                    ],
                    [
                        3261,
                        3674,
                        3261,
                        3674,
                        3261
                    ]
                );
                testLogs(
                    it,
                    'Should create one object and cast it as the parent through a type pointer',
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
                        '    number i = 3469',
                        '    addr i',
                        '    mod 0, 1',
                        'end',
                        'Dog d',
                        'proc main()',
                        '    ^Animal a[2]',
                        '    a[0] = @d',
                        '    a[0].test()',
                        '    number i = 1',
                        '    a[i - 1].test()',
                        'end'
                    ],
                    [
                        3469,
                        3469
                    ]
                );
                testLogs(
                    it,
                    'Should create two objects and cast them as their parent through a type pointer',
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
                        '    number i = 5326',
                        '    addr i',
                        '    mod 0, 1',
                        'end',
                        'object Cat extends Animal',
                        'end',
                        'proc Cat.test()',
                        '    number i = 5367',
                        '    addr i',
                        '    mod 0, 1',
                        'end',
                        'Dog d',
                        'Cat c',
                        'proc main()',
                        '    ^Animal a[2]',
                        '    a[0] = @d',
                        '    a[1] = @c',
                        '    number n',
                        '    for n = 0 to 1',
                        '        a[n].test()',
                        '        a[1 - n].test()',
                        '    end',
                        'end'
                    ],
                    [
                        5326,
                        5367,
                        5367,
                        5326
                    ]
                );
                testLogs(
                    it,
                    'Should call sub object proc with with and constant index',
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
                        '    number i = 8462',
                        '    addr i',
                        '    mod 0, 1',
                        'end',
                        'Dog d',
                        'proc main()',
                        '    ^Animal a[2]',
                        '    a[0] = @d',
                        '    with a[0]',
                        '        test()',
                        '    end',
                        'end'
                    ],
                    [
                        8462
                    ]
                );
                testLogs(
                    it,
                    'Should call sub object proc with with and variable index',
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
                        '    number i = 3866',
                        '    addr i',
                        '    mod 0, 1',
                        'end',
                        'Dog d',
                        'proc main()',
                        '    ^Animal a[2]',
                        '    a[0] = @d',
                        '    number i = 0',
                        '    with a[i]',
                        '        test()',
                        '    end',
                        'end'
                    ],
                    [
                        3866
                    ]
                );
                testLogs(
                    it,
                    'Should call sub object proc with with and math expression index',
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
                        '    number i = 8856',
                        '    addr i',
                        '    mod 0, 1',
                        'end',
                        'Dog d',
                        'proc main()',
                        '    ^Animal a[2]',
                        '    a[0] = @d',
                        '    number i = 1',
                        '    with a[i - 1]',
                        '        test()',
                        '    end',
                        'end'
                    ],
                    [
                        8856
                    ]
                );
                testLogs(
                    it,
                    'Should call objects in a typed pointer array in a record',
                    [
                        'object Animal',
                        '    number x',
                        '    number y',
                        'end',
                        'proc Animal.test()',
                        '    number i = 3561',
                        '    addr i',
                        '    mod 0, 1',
                        'end',
                        'object Dog extends Animal',
                        'end',
                        'proc Dog.test()',
                        '    number i = 9913',
                        '    addr i',
                        '    mod 0, 1',
                        'end',
                        'Animal a',
                        'Dog d',
                        'record List',
                        '    ^Animal l[2]',
                        'end',
                        'proc main()',
                        '    List list',
                        '    list.l[0] = @d',
                        '    list.l[1] = @a',
                        '    number i',
                        '    for i = 0 to 1',
                        '        list.l[i].test()',
                        '    end',
                        'end'
                    ],
                    [
                        9913,
                        3561
                    ]
                );
            }
        );
        describe(
            'Test type cast',
            () => {
                testLogs(
                    it,
                    'Should cast object',
                    [
                        'object Animal',
                        '    number x',
                        '    number y',
                        'end',
                        'proc Animal.test()',
                        '    number i = 3534',
                        '    addr i',
                        '    mod 0, 1',
                        'end',
                        'object Dog extends Animal',
                        'end',
                        'proc Dog.doDogThing()',
                        '    number i = 8856',
                        '    addr i',
                        '    mod 0, 1',
                        'end',
                        'Dog d',
                        'proc main()',
                        '    ^Animal a[2]',
                        '    a[0] = @d',
                        '    d.test()',
                        '    with a[0] as Dog',
                        '        doDogThing()',
                        '    end',
                        'end'
                    ],
                    [
                        3534,
                        8856
                    ]
                );
            }
        );
    }
);
