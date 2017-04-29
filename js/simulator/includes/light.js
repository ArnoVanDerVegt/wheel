wheel(
    'simulator.includes.light',
    [
        '#define MODULE_LIGHT      5',
        '',
        '#define LIGHT_UPDATE      0',
        '',
        '#define LIGHT_OFF         0',
        '#define LIGHT_RED         1',
        '#define LIGHT_YELLOW      2',
        '#define LIGHT_GREEN       3',
        '',
        '#define LIGHT_FLASH_OFF   0',
        '#define LIGHT_FLASH_ON    1',
        '',
        'proc light(number color, number flash)',
        '    record Light',
        '        number color, flash',
        '    endr',
        '    Light light',
        '    set      light.color,  color',
        '    set      light.flash,  flash',
        '    addr     light',
        '    module   MODULE_LIGHT, LIGHT_UPDATE',
        'endp'
    ]
);
