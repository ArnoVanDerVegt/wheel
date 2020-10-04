/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const ContainerIdsForForm = require('../../../../js/frontend/ide/editor/editors/form/ContainerIdsForForm').ContainerIdsForForm;
const assert              = require('assert');

describe(
    'Test ContainerIdsForForm',
    () => {
        it(
            'Should construct ContainerIdsForForm',
            () => {
                let containerIdsForForm = new ContainerIdsForForm();
                assert.notEqual(containerIdsForForm, null);
            }
        );
        it(
            'Should set and get container',
            () => {
                let containerIdsForForm = new ContainerIdsForForm();
                containerIdsForForm.addContainerId(274, {myContainer: true});
                assert.deepEqual(containerIdsForForm.getFormComponentContainerByContainerId(274), {myContainer: true});
                assert.equal(containerIdsForForm.getFormComponentContainerByContainerId(275), undefined);
            }
        );
    }
);
