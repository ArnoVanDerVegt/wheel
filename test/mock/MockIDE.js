/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
exports.MockIDE = class {
    constructor() {
        this._windowHandle = null;
        this._componentId  = null;
    }

    getProjectFilename() {
        return '';
    }

    getEditor() {
        return null;
    }

    getNextWinUiId() {
        return 10240;
    }

    setTestValue(testValue) {
        this._testValue = testValue;
    }

    getWindowHandle() {
        return this._windowHandle;
    }

    getComponentId() {
        return this._componentId;
    }

    getComponentFormContainer(windowHandle, componentId) {
        return {
            getWindowByUiId: (windowHandle) => {
                this._windowHandle = windowHandle;
                return {
                    getComponentById: (componentId) => {
                        this._componentId = componentId;
                        return {
                            getValue: () => {
                                return this._testValue;
                            }
                        };
                    }
                };
            }
        };
    }
};
