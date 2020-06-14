/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const platform         = require('../platform');
const HttpDataProvider = require('./HttpDataProvider').HttpDataProvider;
const httpDataProvider = new HttpDataProvider();

let electronDataProvider = null;

exports.getDataProvider = function() {
    if (platform.isElectron()) {
        if (!electronDataProvider) {
            const ElectronDataProvider = require('./ElectronDataProvider').ElectronDataProvider;
            electronDataProvider = new ElectronDataProvider();
        }
        return electronDataProvider;
    }
    return httpDataProvider;
};
