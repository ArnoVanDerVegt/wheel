/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const componentFormModuleConstants = require('../../../../../shared/vm/modules/components/componentFormModuleConstants');
const getDataProvider              = require('../../../../lib/dataprovider/dataProvider').getDataProvider;
const VMModule                     = require('../../VMModule').VMModule;

exports.ComponentFormModule = class extends VMModule {
    constructor(opts) {
        super(opts);
        this._ide = null;
    }

    run(commandId) {
        let vmData = this._vmData;
        let vm     = this._vm;
        let form;
        switch (commandId) {
            case componentFormModuleConstants.FORM_SHOW:
                form = vmData.getRecordFromSrcOffset(['filename']);
                console.log(vmData.getStringList()[form.filename]);
                this.emit('Form.Show', form, this._ide.getProjectFilename());
                break;

            case componentFormModuleConstants.BUTTON_WAIT_FOR_PRESS:
                form = vmData.getRecordFromSrcOffset(['handle']);
                this.emit('Form.Hide', form);
                break;
        }
    }

    setIDE(ide) {
        this._ide = ide;
    }
};
