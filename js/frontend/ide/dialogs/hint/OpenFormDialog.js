/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../../../lib/dispatcher').dispatcher;
const HintDialog = require('./HintDialog').HintDialog;

exports.OpenFormDialog = class extends HintDialog {
    constructor(opts) {
        opts.okButton         = 'Close';
        opts.dialogClassName  = 'open-file';
        opts.signal           = 'Dialog.Hint.OpenForm';
        opts.dispatchDontShow = 'Settings.Set.DontShowOpenForm';
        opts.title            = 'Opening a form';
        opts.lines            = [
            'You\'re opening a form, the property panel is not visible.',
            'Do you want to show the property panel?'
        ];
        super(opts);
    }

    addCustomButtons() {
        return [
            this.addButton({
                value:    'Show the properties',
                tabIndex: 128,
                onClick:  this.onShowProperties.bind(this)
            })
        ];
    }

    onShowProperties() {
        dispatcher.dispatch('Settings.Set.ShowProperties', true);
        this.hide();
    }
};
