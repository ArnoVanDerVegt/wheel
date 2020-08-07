/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher                       = require('../../../../js/frontend/lib/dispatcher').dispatcher;
const componentIntervalModuleConstants = require('../../../../js/shared/vm/modules/components/componentIntervalModuleConstants');
const testComponentCall                = require('../../../utils').testComponentCall;

afterEach(function() {
    dispatcher.reset();
});

const LIB_FILENAME = 'assets/template/lib/components/interval.whl';

describe(
    'Test Interval module',
    function() {
        testComponentCall(it, {message: 'Should set time', moduleFile: LIB_FILENAME, procName: 'components.interval.setTime', property: 'time', type: 'number'});
        testComponentCall(
            it,
            {
                message:    'Should pause',
                moduleFile: LIB_FILENAME,
                procName:   'components.interval.pause',
                property:   'pause',
                type:       'const',
                value:      componentIntervalModuleConstants.INTERVAL_TEST_VALUE
            }
        );
        testComponentCall(
            it,
            {
                message:    'Should resume',
                moduleFile: LIB_FILENAME,
                procName:   'components.interval.resume',
                property:   'resume',
                type:       'const',
                value:      componentIntervalModuleConstants.INTERVAL_TEST_VALUE
            }
        );
    }
);
