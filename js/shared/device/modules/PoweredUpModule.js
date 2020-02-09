/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const poweredUpModuleConstants = require('../../vm/modules/poweredUpModuleConstants');
const DeviceModule             = require('./DeviceModule').DeviceModule;

exports.PoweredUpModule = class extends DeviceModule {
    run(commandId, data) {
    }
};
