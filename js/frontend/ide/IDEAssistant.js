/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../lib/dispatcher').dispatcher;

exports.IDEAssistant = class {
    constructor(opts) {
        this._settings = opts.settings;
        dispatcher
            .on('IDE.Assistant.OpenForm', this, this.onOpenForm)
            .on('Device.Connected',       this, this.onConnectedDevice);
    }

    /**
     * The user opens a form file but the property panel is not visible...
    **/
    onOpenForm() {
        if (!this._settings.getShowProperties() && !this._settings.getDontShowOpenForm()) {
            dispatcher.dispatch('Dialog.Hint.OpenForm', {});
        }
    }

    /**
     * A device was connected...
    **/
    onConnectedDevice() {
        if (!this._settings.getShowSimulator() && !this._settings.getDontShowConnected()) {
            dispatcher.dispatch('Dialog.Hint.Connected', {});
        }
    }
};
