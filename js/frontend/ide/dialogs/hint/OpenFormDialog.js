/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../../../lib/dispatcher').dispatcher;
const HintDialog = require('./HintDialog').HintDialog;

const SHOW_SIGNAL = 'Dialog.Hint.OpenForm';

exports.OpenFormDialog = class extends HintDialog {
    constructor(opts) {
        opts.height           = 248;
        opts.okButton         = 'Close';
        opts.dialogClassName  = 'open-file';
        opts.signal           = SHOW_SIGNAL;
        opts.dispatchDontShow = 'Settings.Set.DontShow.OpenForm';
        opts.title            = 'Opening a form';
        opts.lines            = [
            'You\'re opening a form. The property panel is not visible.',
            'Do you want to show the property panel?',
            'This allows you to change items on the form.',
            '',
            'You can make the property panel visible from the view menu.'
        ];
        super(opts);
    }

    addCustomButtons() {
        return [
            {
                value:    'Show the properties',
                tabIndex: 128,
                onClick:  this.onShowProperties.bind(this)
            }
        ];
    }

    onShowProperties() {
        dispatcher.dispatch('Settings.Set.ShowProperties', true);
        this.hide();
    }
};

exports.OpenFormDialog.SHOW_SIGNAL = SHOW_SIGNAL;
