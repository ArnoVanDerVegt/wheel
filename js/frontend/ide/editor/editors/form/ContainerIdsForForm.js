/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/

/**
 * - All components except for the form have a parentId.
 *
 * - If a component can contain other components then it has a list called `containerIds`.
 * - The child component(s) of that component have a parentId which is equal to a value
 *   in the `componentIds` list.
 *
 * - The form component does not have a `containerIds` property.
**/

exports.ContainerIdsForForm = class {
    constructor() {
        this._containerIds = {};
    }

    addContainerId(containerId, formComponentContainer) {
        this._containerIds[containerId] = formComponentContainer;
    }

    getFormComponentContainerByContainerId(containerId) {
        return this._containerIds[containerId];
    }
};
