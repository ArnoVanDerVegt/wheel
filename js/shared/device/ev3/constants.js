/**
 * Copyright 2015 Ken Aspeslagh @massivevector
**/
exports.DIRECT_COMMAND_PREFIX                 = '800000';
exports.DIRECT_COMMAND_REPLY_PREFIX           = '000100';
exports.DIRECT_COMMAND_REPLY_SENSOR_PREFIX    = '000400';
exports.DIRECT_COMMAND_REPLY_ALL_TYPES_PREFIX = '001000';

// Direct command opcode/prefixes
exports.SET_MOTOR_SPEED                       = 'A400';
exports.SET_MOTOR_STOP                        = 'A300';
exports.SET_MOTOR_START                       = 'A600';
exports.SET_MOTOR_STEP_SPEED                  = 'AC00';

exports.PLAYTONE                              = '9401';
exports.INPUT_DEVICE_GET_TYPE_MODE            = '9905';
exports.INPUT_DEVICE_READY_SI                 = '991D';
exports.BEGIN_DOWNLOAD                        = '0192';
exports.CONTINUE_DOWNLOAD                     = '8193';
exports.BEGIN_LIST_FILES                      = '0199';
exports.CONTINUE_LIST_FILES                   = '819A';
exports.CREATE_DIR                            = '019B';
exports.DELETE_FILE                           = '019C';

exports.NOOP                                  = '0201';
exports.LED                                   = '1B';
exports.MODE0                                 = '00';

exports.UIDRAW                                = '84';
exports.UIDRAW_FILLWINDOW                     = '13';
exports.UIDRAW_PICTURE                        = '07';
exports.UIDRAW_BMPFILE                        = '1C';
exports.UIDRAW_UPDATE                         = '00';

exports.UIREAD                                = '81';
exports.UIREAD_BATTERY                        = '12';

exports.UIWRITE                               = '82';
exports.UIWRITE_INIT_RUN                      = '19';

exports.READ_SENSOR                           = '9A';
exports.READ_FROM_MOTOR                       = 'FF';
exports.READ_MOTOR_POSITION                   = '01';
exports.READ_MOTOR_SPEED                      = '02';

exports.SYSTEM_REPLY_ERROR                    = 5;
exports.SYSTEM_COMMAND                        = 'SYSTEM_COMMAND';

exports.MEDIUM_MOTOR                          = 8;
exports.LARGE_MOTOR                           = 7;
exports.MOTORS                                = [exports.MEDIUM_MOTOR, exports.LARGE_MOTOR];

