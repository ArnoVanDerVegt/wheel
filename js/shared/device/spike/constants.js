/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
exports.DEVICE_TYPE_LIGHT           =  8;
exports.DEVICE_TYPE_SMALL_MOTOR     = 65;
exports.DEVICE_TYPE_LARGE_MOTOR     = 49;
exports.DEVICE_TYPE_MEDIUM_MOTOR    = 75;
exports.DEVICE_TYPE_COLOR_SENSOR    = 61;
exports.DEVICE_TYPE_DISTANCE_SENSOR = 62;
exports.DEVICE_TYPE_FORCE_SENSOR    = 63;

exports.MESSAGE_TYPE_PORTS          =  0;
exports.MESSAGE_TYPE_BATTERY        =  2;
exports.MESSAGE_TYPE_BUTTONS        =  3;

exports.COMMAND_SOUND_OFF           = 'scratch.sound_off';
exports.COMMAND_SOUND_BEEP          = 'scratch.sound_beep';
exports.COMMAND_RUN_FOR_DEGREES     = 'scratch.motor_run_for_degrees';
exports.COMMAND_MOTOR_START         = 'scratch.motor_start';
exports.COMMAND_MOTOR_PWM           = 'scratch.motor_pwm';
exports.COMMAND_BUTTON_LIGHTS       = 'scratch.center_button_lights';
exports.COMMAND_DISPLAY_CLEAR       = 'scratch.display_clear';
exports.COMMAND_DISPLAY_SET_PIXEL   = 'scratch.display_set_pixel';
exports.COMMAND_DISPLAY_TEXT        = 'scratch.display_text';
exports.COMMAND_ULTRASONIC_LIGHT_UP = 'scratch.ultrasonic_light_up';
