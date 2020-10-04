/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const formEditorConstants = require('../../../../js/frontend/ide/editor/editors/form/formEditorConstants');
const assert              = require('assert');

describe(
    'Test property validators',
    () => {
        describe(
            'Test name validator',
            () => {
                it(
                    'Should not validate short name',
                    () => {
                        assert.equal(formEditorConstants.nameValidator('ab'), false);
                    }
                );
                it(
                    'Should not validate starting with number',
                    () => {
                        assert.equal(formEditorConstants.nameValidator('0abc'), false);
                    }
                );
                it(
                    'Should not validate with non alphanumeric',
                    () => {
                        assert.equal(formEditorConstants.nameValidator('abc!'), false);
                    }
                );
                it(
                    'Should validate alpha',
                    () => {
                        assert.equal(formEditorConstants.nameValidator('abc'), true);
                    }
                );
                it(
                    'Should validate alphanumeric',
                    () => {
                        assert.equal(formEditorConstants.nameValidator('abc1'), true);
                    }
                );
            }
        );
        describe(
            'Test positive number validator',
            () => {
                it(
                    'Should not validate empty string',
                    () => {
                        assert.equal(formEditorConstants.posNumberValidator(''), false);
                    }
                );
                it(
                    'Should not validate negative number',
                    () => {
                        assert.equal(formEditorConstants.posNumberValidator(-1), false);
                    }
                );
                it(
                    'Should not validate positive float number',
                    () => {
                        assert.equal(formEditorConstants.posNumberValidator(1.5), false);
                    }
                );
                it(
                    'Should validate positive number',
                    () => {
                        assert.equal(formEditorConstants.posNumberValidator(15), true);
                    }
                );
            }
        );
        describe(
            'Test positive number or empty validator',
            () => {
                it(
                    'Should not validate negative number',
                    () => {
                        assert.equal(formEditorConstants.posNumberOrEmptyValidator(-1), false);
                    }
                );
                it(
                    'Should not validate positive float number',
                    () => {
                        assert.equal(formEditorConstants.posNumberOrEmptyValidator(1.5), false);
                    }
                );
                it(
                    'Should validate empty string',
                    () => {
                        assert.equal(formEditorConstants.posNumberOrEmptyValidator(''), true);
                    }
                );
                it(
                    'Should validate positive number',
                    () => {
                        assert.equal(formEditorConstants.posNumberOrEmptyValidator(15), true);
                    }
                );
            }
        );
        describe(
            'Test number validator',
            () => {
                it(
                    'Should not validate empty string',
                    () => {
                        assert.equal(formEditorConstants.numberValidator(''), false);
                    }
                );
                it(
                    'Should not validate minus string',
                    () => {
                        assert.equal(formEditorConstants.numberValidator('-'), false);
                    }
                );
                it(
                    'Should not validate alpha string',
                    () => {
                        assert.equal(formEditorConstants.numberValidator('-1a2'), false);
                    }
                );
                it(
                    'Should validate negative number',
                    () => {
                        assert.equal(formEditorConstants.numberValidator('-1'), true);
                    }
                );
                it(
                    'Should validate number',
                    () => {
                        assert.equal(formEditorConstants.numberValidator(67), true);
                    }
                );
            }
        );
        describe(
            'Test number validator with min value',
            () => {
                it(
                    'Should not validate low value',
                    () => {
                        assert.equal(formEditorConstants.posNumberValidatorWithMin(10)(9), false);
                    }
                );
                it(
                    'Should not validate high value',
                    () => {
                        assert.equal(formEditorConstants.posNumberValidatorWithMin(10)(10), true);
                        assert.equal(formEditorConstants.posNumberValidatorWithMin(10)(11), true);
                    }
                );
            }
        );
    }
);
