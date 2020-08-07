/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const componentAlertDialogModuleConstants = require('../../../../../shared/vm/modules/components/componentAlertDialogModuleConstants');
const dispatcher                          = require('../../../../lib/dispatcher').dispatcher;
const VMModule                            = require('./../../VMModule').VMModule;

exports.ComponentAlertDialogModule = class extends VMModule {
    run(commandId) {
        let vmData      = this._vmData;
        let vm          = this._vm;
        let property    = '';
        let alertDialog = null;
        let opts        = {};
        switch (commandId) {
            case componentAlertDialogModuleConstants.ALERT_DIALOG_SHOW: property = 'show'; break;
        }
        if (property !== '') {
            alertDialog    = vmData.getRecordFromSrcOffset(['window', 'component']);
            opts[property] = componentAlertDialogModuleConstants.ALERT_DIALOG_TEST_VALUE;
            dispatcher.dispatch(alertDialog.window + '_' + alertDialog.component, opts);
        }
    }
};
