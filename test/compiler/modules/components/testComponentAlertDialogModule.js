/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher                          = require('../../../../js/frontend/lib/dispatcher').dispatcher;
const componentAlertDialogModuleConstants = require('../../../../js/shared/vm/modules/components/componentAlertDialogModuleConstants');
const testComponentCall                   = require('../../../utils').testComponentCall;

afterEach(() => {
    dispatcher.reset();
});

const LIB_FILENAME = 'assets/template/lib/modules/components/alertDialog.whl';

describe(
    'Test Alert dialog module',
    () => {
        testComponentCall(
            it,
            {
                message:    'Should show',
                moduleFile: LIB_FILENAME,
                procName:   'components.alertDialog.show',
                property:   'show',
                type:       'const',
                value:      componentAlertDialogModuleConstants.ALERT_DIALOG_TEST_VALUE
            }
        );
    }
);
