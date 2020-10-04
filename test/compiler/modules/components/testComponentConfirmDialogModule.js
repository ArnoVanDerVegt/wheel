/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher                            = require('../../../../js/frontend/lib/dispatcher').dispatcher;
const componentConfirmDialogModuleConstants = require('../../../../js/shared/vm/modules/components/componentConfirmDialogModuleConstants');
const testComponentCall                     = require('../../../utils').testComponentCall;

afterEach(() => {
    dispatcher.reset();
});

const LIB_FILENAME = 'assets/template/lib/components/confirmDialog.whl';

describe(
    'Test Confirm dialog module',
    () => {
        testComponentCall(
            it,
            {
                message:    'Should show',
                moduleFile: LIB_FILENAME,
                procName:   'components.confirmDialog.show',
                property:   'show',
                type:       'const',
                value:      componentConfirmDialogModuleConstants.CONFIRM_DIALOG_TEST_VALUE
            }
        );
    }
);
