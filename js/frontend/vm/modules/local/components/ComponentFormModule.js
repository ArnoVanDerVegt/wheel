/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const componentFormModuleConstants = require('../../../../../shared/vm/modules/components/componentFormModuleConstants');
const getDataProvider              = require('../../../../lib/dataprovider/dataProvider').getDataProvider;
const path                         = require('../../../../lib/path');
const dispatcher                   = require('../../../../lib/dispatcher').dispatcher;
const VMModule                     = require('../../VMModule').VMModule;

exports.ComponentFormModule = class extends VMModule {
    constructor(opts) {
        super(opts);
        this._ide = null;
    }

    showLoadError(formFilename) {
        if (formFilename.length > 48) {
            formFilename = '...' + formFilename.substr(-48);
        }
        dispatcher.dispatch(
            'Dialog.Alert.Show',
            {
                title: 'Error loading form data',
                lines: [
                    'Failed to load form file:',
                    formFilename
                ]
            }
        );
    }

    loadFormData(filename, callback) {
        let pathAndFilename     = path.getPathAndFilename(this._ide.getProjectFilename());
        let formFilename        = path.join(pathAndFilename.path, filename);
        let formPathAndFilename = path.getPathAndFilename(formFilename);
        let editor              = this._ide.getEditor(formPathAndFilename.path, formPathAndFilename.filename);
        if (editor) {
            callback(editor.getValue());
            return;
        }
        getDataProvider().getData(
            'post',
            'ide/file',
            {filename: formFilename},
            (function(data) {
                let formData;
                try {
                    data     = JSON.parse(data);
                    formData = JSON.parse(data.data.wfrm);
                } catch (error) {
                    data = {success: false};
                }
                if (data.success) {
                    callback(formData);
                    return;
                }
                this.showLoadError(formFilename);
            }).bind(this)
        );
    }

    run(commandId) {
        let vmData = this._vmData;
        let vm     = this._vm;
        let form;
        switch (commandId) {
            case componentFormModuleConstants.FORM_SHOW:
                form = vmData.getRecordFromSrcOffset(['filename']);
                this.loadFormData(
                    vmData.getStringList()[form.filename],
                    function(data) {
                        dispatcher.dispatch('Form.Show', data);
                    }
                );
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
