/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const TURN_RATIO_N100 = 0x9C;
const TURN_RATIO_N75  = 0xB5;
const TURN_RATIO_N50  = 0xCE;
const TURN_RATIO_N25  = 0xE7;
const TURN_RATIO_NONE = 0x00;
const TURN_RATIO_P25  = 0x19;
const TURN_RATIO_P50  = 0x32;
const TURN_RATIO_P75  = 0x4B;
const TURN_RATIO_P100 = 0x64;

const POWER_N100      = 0x9C;
const POWER_N75       = 0xB5;
const POWER_N50       = 0xCE;
const POWER_N25       = 0xE7;
const POWER_NONE      = 0x00;
const POWER_P25       = 0x19;
const POWER_P50       = 0x32;
const POWER_P75       = 0x4B;
const POWER_P100      = 0x64;

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

exports.RUN_STATE_IDLE                          = 0x00;
exports.RUN_STATE_RAMP_UP                       = 0x10;
exports.RUN_STATE_RUNNING                       = 0x20;
exports.RUN_STATE_RAMP_DOWN                     = 0x40;

exports.REGULATION_MODE_IDLE                    = 0x00;
exports.REGULATION_MODE_MOTOR_SPEED             = 0x01;
exports.REGULATION_MODE_MOTOR_SYNC              = 0x02;

exports.MODE_MOTOR_ON                           = 0x01;
exports.MODE_MOTOR_ON_BRAKE                     = 0x03;
exports.MODE_BRAKE                              = 0x02;
exports.MODE_REGULATED                          = 0x05;
exports.MODE_REGULATED_BRAKE                    = 0x07;

exports.RESET_ABSOLUTE                          = 0x00;
exports.RESET_RELATIVE                          = 0x01;

exports.SENSOR_TYPE_NONE                        = 0x00;
exports.SENSOR_TYPE_SWITCH                      = 0x01;
exports.SENSOR_TYPE_REFLECTION                  = 0x03;
exports.SENSOR_TYPE_ANGLE                       = 0x04;
exports.SENSOR_TYPE_LIGHT_ACTIVE                = 0x05;
exports.SENSOR_TYPE_LIGHT_INACTIVE              = 0x06;
exports.SENSOR_TYPE_SOUND_DB                    = 0x07;
exports.SENSOR_TYPE_SOUND_DBA                   = 0x08;
exports.SENSOR_TYPE_CUSTOM                      = 0x09;
exports.SENSOR_TYPE_LOW_SPEED                   = 0x0A;
exports.SENSOR_TYPE_LOW_SPEED_9V                = 0x0B;

exports.SENSOR_MODE_RAW                         = 0x00;
exports.SENSOR_MODE_BOOLEAN                     = 0x20;
exports.SENSOR_MODE_TRANSITION_COUNTER          = 0x40;
exports.SENSOR_MODE_PERIOD_COUNTER              = 0x60;
exports.SENSOR_MODE_FULL_SCALED                 = 0x80;
exports.SENSOR_MODE_CELSIUS                     = 0xA0;
exports.SENSOR_MODE_FAHRENHEIT                  = 0xC0;
exports.SENSOR_MODE_ANGLE_STEPS                 = 0xE0;
exports.SENSOR_MODE_SLOPE_MASK                  = 0x1F;
exports.SENSOR_MODE_MODE_MASK                   = 0xE0;

exports.POWER = [
    POWER_N100,
    POWER_N75,
    POWER_N50,
    POWER_N25,
    POWER_NONE,
    POWER_P25,
    POWER_P50,
    POWER_P75,
    POWER_P100
];

exports.TURN_RATIO = [
    TURN_RATIO_N100,
    TURN_RATIO_N75,
    TURN_RATIO_N50,
    TURN_RATIO_N25,
    TURN_RATIO_NONE,
    TURN_RATIO_P25,
    TURN_RATIO_P50,
    TURN_RATIO_P75,
    TURN_RATIO_P100
];

exports.ERROR_MESSAGES = {
    0x81: 'No more handles',
    0x82: 'No space',
    0x83: 'No more files',
    0x84: 'End of file expected',
    0x85: 'End of file',
    0x86: 'Not a linear file',
    0x87: 'File not found',
    0x88: 'Handle all ready closed',
    0x89: 'No linear space',
    0x8A: 'Undefined error',
    0x8B: 'File is busy',
    0x8C: 'No write buffers',
    0x8D: 'Append not possible',
    0x8E: 'File is full',
    0x8F: 'File exists',
    0x90: 'Module not found',
    0x91: 'Out of boundary',
    0x92: 'Illegal file name',
    0x93: 'Illegal handle',
    0x20: 'Pending communication transaction in progress',
    0x40: 'Specified mailbox queue is empty',
    0xBD: 'Request failed (i.e. specified file not found)',
    0xBE: 'Unknown command opcode',
    0xBF: 'Insane packet',
    0xC0: 'Data contains out-of-range values',
    0xDD: 'Communication bus error',
    0xDE: 'No free memory in communication buffer',
    0xDF: 'Specified channel/connection is not valid',
    0xE0: 'Specified channel/connection not configured or busy',
    0xEC: 'No active program',
    0xED: 'Illegal size specified',
    0xEE: 'Illegal mailbox queue ID specified',
    0xEF: 'Attempted to access invalid field of a structure',
    0xF0: 'Bad input or output specified',
    0xFB: 'Insufficient memory available',
    0xFF: 'Bad arguments'
};
