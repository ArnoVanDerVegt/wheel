/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../../../lib/dispatcher').dispatcher;
const HintDialog = require('./HintDialog').HintDialog;

const SHOW_SIGNAL = 'Dialog.Hint.Connected';

exports.ConnectedDialog = class extends HintDialog {
    constructor(opts) {
        opts.height           = 264;
        opts.okButton         = 'Close';
        opts.dialogClassName  = 'connected';
        opts.signal           = SHOW_SIGNAL;
        opts.dispatchDontShow = 'Settings.Set.DontShow.Connected';
        opts.title            = 'Connected to a device';
        opts.lines            = [
            'You\'ve connected a device. The simulator panel is not visible.',
            'Do you want to show the simulator panel?',
            'This allows you to view information about the device and connected motors and sensors.',
            '',
            'You can make the simulator panel visible from the view menu.'
        ];
        super(opts);
    }

    addCustomButtons() {
        return [
            {
                value:    'Show the simulator',
                tabIndex: 128,
                onClick:  this.onShowSimulator.bind(this)
            }
        ];
    }

    onShowSimulator() {
        dispatcher.dispatch('Settings.Set.ShowSimulator', true);
        this.hide();
    }
};

exports.ConnectedDialog.SHOW_SIGNAL = SHOW_SIGNAL;
