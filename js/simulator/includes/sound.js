wheel(
    'simulator.includes.sound',
    [
        '#define MODULE_SOUND      7',
        '',
        '#define SOUND_PLAY_TONE   0',
        '#define SOUND_PLAY_SAMPLE 1',
        '',
        'proc playTone(number frequency, number duration, number volume)',
        '    record PlayTone',
        '        number frequency',
        '        number duration',
        '        number volume',
        '    endr',
        '    PlayTone playTone',
        '    asm',
        '        set      playTone.frequency, frequency',
        '        set      playTone.duration,  duration',
        '        set      playTone.volume,    volume',
        '        addr     playTone',
        '        module   MODULE_SOUND,       SOUND_PLAY_TONE',
        '    end',
        'endp'
    ]
);
