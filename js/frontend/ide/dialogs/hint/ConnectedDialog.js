/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../../../lib/dispatcher').dispatcher;
const HintDialog = require('./HintDialog').HintDialog;

exports.ConnectedDialog = class extends HintDialog {
    constructor(opts) {
        opts.okButton         = 'Close';
        opts.dialogClassName  = 'connected';
        opts.signal           = 'Dialog.Hint.Connected';
        opts.dispatchDontShow = 'Settings.Set.DontShowConnected';
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
            this.addButton({
                value:    'Show the simulator',
                tabIndex: 128,
                onClick:  this.onShowSimulator.bind(this)
            })
        ];
    }

    onShowSimulator() {
        dispatcher.dispatch('Settings.Set.ShowSimulator', true);
        this.hide();
    }
};
