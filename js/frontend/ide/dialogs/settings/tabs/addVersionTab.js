/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const platform = require('../../../../lib/platform');
const Updater  = require('../components/Updater').Updater;

exports.tab = (settingsDialog, opts) => {
    return {
        ref:       settingsDialog.setRef('tabVersion'),
        className: 'tab-panel tab-version',
        children: [
            platform.isElectron() || platform.isNode() ?
                {
                    type:     Updater,
                    ui:       opts.ui,
                    uiId:     opts.uiId,
                    settings: opts.settings
                } :
                null
        ]
    };
};
