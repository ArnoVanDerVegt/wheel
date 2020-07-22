/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
exports.MockIDE = class {
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

    getComponentFormContainer() {
        return {
            getWindowByUiId: () => {
                return {
                    getComponentById: () => {
                        return {
                            getValue: () => {
                                return this._testValue;
                            }
                        }
                    }
                }
            }
        }
    }
};
