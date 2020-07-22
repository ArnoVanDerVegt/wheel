/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../lib/dispatcher').dispatcher;

exports.IDEAssistant = class {
    constructor(opts) {
        this._settings = opts.settings;
        dispatcher
            .on('Create.Form',            this, this.onOpenForm)
            .on('IDE.Assistant.OpenForm', this, this.onOpenForm)
            .on('Device.Connected',       this, this.onConnectedDevice);
    }

    /**
     * The user opens a form file but the property panel is not visible...
    **/
    onOpenForm() {
        // Add a timeout to allow the active window to close...
        setTimeout(
            () => {
                if (!this._settings.getShowProperties() && !this._settings.getDontShowOpenForm()) {
                    dispatcher.dispatch('Dialog.Hint.OpenForm', {});
                }
            },
            500
        );
    }

    /**
     * A device was connected...
    **/
    onConnectedDevice() {
        // Add a timeout to allow the active window to close...
        setTimeout(
            () => {
                if (!this._settings.getShowSimulator() && !this._settings.getDontShowConnected()) {
                    dispatcher.dispatch('Dialog.Hint.Connected', {});
                }
            },
            500
        );
    }
};
