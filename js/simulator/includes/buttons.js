wheel(
    'simulator.includes.buttons',
    [
        '#define MODULE_BUTTONS 6',
        '#define BUTTON_READ    0',
        '',
        'proc button()',
        '    record Button',
        '        number result',
        '    endr',
        '    Button button',
        '    addr   button',
        '    module MODULE_BUTTONS, BUTTON_READ',
        '',
        '    return button.result',
        'endp'
    ]
);
