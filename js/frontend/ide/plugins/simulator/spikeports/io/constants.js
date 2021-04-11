/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const spikeModuleConstants  = require('../../../../../../shared/vm/modules/spikeModuleConstants');
const sensorModuleConstants = require('../../../../../../shared/vm/modules/sensorModuleConstants');

let deviceInfo = [];
deviceInfo[spikeModuleConstants.SPIKE_DEVICE_MEDIUM_MOTOR  ] = {src: 'images/spike/motorMedium64.png', motor: true,  value: true};
deviceInfo[spikeModuleConstants.SPIKE_DEVICE_LARGE_MOTOR   ] = {src: 'images/spike/motorLarge64.png',  motor: true,  value: true};
deviceInfo[sensorModuleConstants.SENSOR_TYPE_SPIKE_DISTANCE] = {src: 'images/spike/distance64.png',    motor: false, value: true};
deviceInfo[sensorModuleConstants.SENSOR_TYPE_SPIKE_COLOR   ] = {src: 'images/spike/color64.png',       motor: false, value: true};
deviceInfo[sensorModuleConstants.SENSOR_TYPE_SPIKE_FORCE   ] = {src: 'images/spike/force64.png',       motor: false, value: true};

exports.deviceInfo = deviceInfo;
