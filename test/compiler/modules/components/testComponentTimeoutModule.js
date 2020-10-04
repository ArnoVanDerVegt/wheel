/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher                      = require('../../../../js/frontend/lib/dispatcher').dispatcher;
const componentTimeoutModuleConstants = require('../../../../js/shared/vm/modules/components/componentTimeoutModuleConstants');
const testComponentCall               = require('../../../utils').testComponentCall;

afterEach(() => {
    dispatcher.reset();
});

const LIB_FILENAME = 'assets/template/lib/components/timeout.whl';

describe(
    'Test Timeout module',
    () => {
        testComponentCall(it, {message: 'Should set time', moduleFile: LIB_FILENAME, procName: 'components.timeout.setTime', property: 'time', type: 'number'});
        testComponentCall(
            it,
            {
                message:    'Should start',
                moduleFile: LIB_FILENAME,
                procName:   'components.timeout.start',
                property:   'start',
                type:       'const',
                value:      componentTimeoutModuleConstants.TIMEOUT_TEST_VALUE
            }
        );
        testComponentCall(
            it,
            {
                message:    'Should cancel',
                moduleFile: LIB_FILENAME,
                procName:   'components.timeout.cancel',
                property:   'cancel',
                type:       'const',
                value:      componentTimeoutModuleConstants.TIMEOUT_TEST_VALUE
            }
        );
    }
);
