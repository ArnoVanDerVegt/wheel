/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
exports.COMMAND_TYPE_DIRECT                     = 0x00;
exports.COMMAND_TYPE_SYSTEM                     = 0x01;

exports.DIRECT_COMMAND_START_PROGRAM            = 0x00;
exports.DIRECT_COMMAND_STOP_PROGRAM             = 0x01;
exports.DIRECT_COMMAND_PLAY_SOUND_FILE          = 0x02;
exports.DIRECT_COMMAND_PLAYTONE                 = 0x03;
exports.DIRECT_COMMAND_SET_OUTPUT_STATE         = 0x04;
exports.DIRECT_COMMAND_SET_INPUT_MODE           = 0x05;
exports.DIRECT_COMMAND_GET_OUTPUT_STATE         = 0x06;
exports.DIRECT_COMMAND_GET_INPUT_VALUES         = 0x07;
exports.DIRECT_COMMAND_RESET_INPUT_SCALED_VALUE = 0x08;
exports.DIRECT_COMMAND_MESSAGE_WRITE            = 0x09;
exports.DIRECT_COMMAND_RESET_MOTOR_POSITION     = 0x0A;
exports.DIRECT_COMMAND_GET_BATTERY_LEVEL        = 0x0B;
exports.DIRECT_COMMAND_STOP_SOUND_PLAYBACK      = 0x0C;
exports.DIRECT_COMMAND_KEEP_ALIVE               = 0x0D;
exports.DIRECT_COMMAND_LS_GET_STATUS            = 0x0E;
exports.DIRECT_COMMAND_LS_WRITE                 = 0x0F;
exports.DIRECT_COMMAND_LS_READ                  = 0x10;
exports.DIRECT_COMMAND_GET_CURRENT_PROGRAM_NAME = 0x11;
exports.DIRECT_COMMAND_MESSAGE_READ             = 0x13;
