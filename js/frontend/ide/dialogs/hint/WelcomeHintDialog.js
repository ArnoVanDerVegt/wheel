/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const HintDialog = require('./HintDialog').HintDialog;

exports.WelcomeHintDialog = class extends HintDialog {
    constructor(opts) {
        opts.signal           = 'Dialog.WelcomeHint.Show';
        opts.dispatchDontShow = 'Settings.Set.DontShowWelcomeHintDialog';
        opts.title            = 'Welcome to the Wheel demo version';
        opts.lines            = [
            'You are running the demo version of Wheel.',
            '',
            'With this version you can edit and compile programs.',
            'If you save a program then it will be stored in the local storage of your browser.',
            '',
            'The web version can not connect to your EV3 brick,',
            'for this you have to download and install the local version.',
            '',
            'You can copy and save the compiled code and upload it to your EV3 brick.'
        ];
        super(opts);
    }
};
