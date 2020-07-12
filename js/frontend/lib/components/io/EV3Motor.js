/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const BasicIODevice        = require('./BasicIODevice').BasicIODevice;
const motorModuleConstants = require('../../../../shared/vm/modules/motorModuleConstants');

exports.EV3Motor = class extends BasicIODevice {
    constructor(opts) {
        opts.canSetSpeed = true;
        opts.canSetValue = true;
        opts.canSetReady = true;
        opts.canSetColor = false;
        super(opts);
        this.setSpeedVisible(true);
    }

    setType(type) {
        let image = false;
        switch (type) {
            case 7: image = 'images/ev3/motorMedium.png'; break;
            case 8: image = 'images/ev3/motorLarge.png';  break;
        }
        if (image) {
            this
                .setImage(image)
                .setImageVisible(true);
        } else {
            this.setImageVisible(false);
        }
    }

    setPort(port) {
        if ((port >= 0) && (port < 4)) {
            super.setPort(String.fromCharCode(65 + port));
        }
    }
};
