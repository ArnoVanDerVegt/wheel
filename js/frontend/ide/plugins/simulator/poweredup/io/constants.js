/**
 * Wheel, copyright (c) 2021 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const poweredUpModuleConstants = require('../../../../../../shared/vm/modules/poweredUpModuleConstants');

let deviceInfo = [];
deviceInfo[poweredUpModuleConstants.POWERED_UP_DEVICE_BASIC_MOTOR              ] = {src: 'images/poweredup/motor64.png',       motor: true,  value: false};
deviceInfo[poweredUpModuleConstants.POWERED_UP_DEVICE_TRAIN_MOTOR              ] = {src: 'images/poweredup/train64.png',       motor: true,  value: false};
deviceInfo[poweredUpModuleConstants.POWERED_UP_DEVICE_BOOST_TACHO_MOTOR        ] = {src: 'images/poweredup/motorM64.png',      motor: true,  value: true};
deviceInfo[poweredUpModuleConstants.POWERED_UP_DEVICE_BOOST_MOVE_HUB_MOTOR     ] = {src: 'images/poweredup/moveHub64.png',     motor: true,  value: true};
deviceInfo[poweredUpModuleConstants.POWERED_UP_DEVICE_CONTROL_PLUS_LARGE_MOTOR ] = {src: 'images/poweredup/motorL64.png',      motor: true,  value: true};
deviceInfo[poweredUpModuleConstants.POWERED_UP_DEVICE_CONTROL_PLUS_XLARGE_MOTOR] = {src: 'images/poweredup/motorXl64.png',     motor: true,  value: true};
deviceInfo[poweredUpModuleConstants.POWERED_UP_DEVICE_LED_LIGHTS               ] = {src: 'images/poweredup/light64.png',       motor: false, value: false};
deviceInfo[poweredUpModuleConstants.POWERED_UP_DEVICE_BOOST_DISTANCE           ] = {src: 'images/poweredup/lightSensor64.png', motor: false, value: true};

exports.deviceInfo = deviceInfo;
