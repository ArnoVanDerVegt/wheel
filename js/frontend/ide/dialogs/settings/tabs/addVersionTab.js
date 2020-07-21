/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const platform = require('../../../../lib/platform');
const getImage = require('../../../data/images').getImage;
const Updater  = require('../components/Updater').Updater;

exports.tab = (settingsDialog, opts) => {
    let settings = opts.settings;
    let os       = settings.getOS();
    let info;
    if (platform.isNode()) {
        info = 'Version: ' + settings.getVersion() + ', Platform: NodeJS';
    } else if (platform.isElectron()) {
        info = 'Version: ' + settings.getVersion() + ', Platform: ' + os.platform + ', Arch: ' + os.arch;
    } else {
        info = 'Version: ' + settings.getVersion() + ', Platform: ' + navigator.product;
    }
    return {
        ref:       settingsDialog.setRef('tabVersion'),
        className: 'tab-panel tab-version',
        children: [
            {
                className: 'version',
                children: [
                    {
                        type:      'img',
                        src:       getImage('images/logos/logo.png')
                    },
                    {
                        className: 'version-info',
                        innerHTML: info
                    }
                ]
            },
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
