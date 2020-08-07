/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const componentConfirmDialogModuleConstants = require('../../../../../shared/vm/modules/components/componentConfirmDialogModuleConstants');
const dispatcher                            = require('../../../../lib/dispatcher').dispatcher;
const VMModule                              = require('./../../VMModule').VMModule;

exports.ComponentConfirmDialogModule = class extends VMModule {
    run(commandId) {
        let vmData        = this._vmData;
        let vm            = this._vm;
        let property      = '';
        let confirmDialog = null;
        let opts          = {};
        switch (commandId) {
            case componentConfirmDialogModuleConstants.CONFIRM_DIALOG_SHOW: property = 'show'; break;
        }
        if (property !== '') {
            confirmDialog  = vmData.getRecordFromSrcOffset(['window', 'component']);
            opts[property] = componentConfirmDialogModuleConstants.CONFIRM_DIALOG_TEST_VALUE;
            dispatcher.dispatch(confirmDialog.window + '_' + confirmDialog.component, opts);
        }
    }
};
