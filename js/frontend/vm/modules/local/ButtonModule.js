/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const buttonModuleConstants = require('../../../../shared/vm/modules/buttonModuleConstants');
const VMModule              = require('./../VMModule').VMModule;

exports.ButtonModule = class extends VMModule {
    run(commandId) {
        let vmData = this._vmData;
        let vm     = this._vm;
        switch (commandId) {
            case buttonModuleConstants.BUTTON_READ:
                let button = vmData.getRecordFromSrcOffset(['layer']);
                button.callback = function(button) { vmData.setNumberAtRet(button); };
                this.emit('Button.Button', button);
                break;

            case buttonModuleConstants.BUTTON_WAIT_FOR_PRESS:
                vm.sleep(1000);
                let interval = setInterval(
                        () => {
                            this.emit(
                                'Button.WaitForPress',
                                function(button) {
                                    if (!button) {
                                        vm.sleep(1000);
                                        return;
                                    }
                                    clearInterval(interval);
                                    vm.sleep(0);
                                }
                            );
                        },
                        50
                    );
                break;
        }
    }
};
