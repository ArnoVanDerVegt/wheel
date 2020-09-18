/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../../lib/dispatcher').dispatcher;
const Dialog     = require('../../lib/components/Dialog').Dialog;
const Img        = require('../../lib/components/basic/Img').Img;
const getImage   = require('../data/images').getImage;

exports.AlertDialog = class extends Dialog {
    constructor(opts) {
        super(opts);
        this.initWindow('alert-dialog', 'Alert', this.initWindowContent(opts));
        dispatcher.on('Dialog.Alert.Show', this, this.onShow);
    }

    initWindowContent(opts) {
        return [
            {
                ref:  this.setRef('image'),
                type: Img
            },
            {
                ref:       this.setRef('text'),
                className: 'dialog-lt dialog-cw abs alert-text'
            },
            {
                className: 'buttons',
                children: [
                    this.addButton({
                        value:   'Ok',
                        onClick: this.hide.bind(this)
                    })
                ]
            }
        ];
    }

    onShow(opts) {
        let refs          = this._refs;
        let dialogElement = this._dialogElement;
        refs.title.innerHTML = opts.title || 'Title';
        refs.text.innerHTML  = (opts.lines || ['Lorem ipsum dolor sit amet, consectetur adipiscing elit.']).join('<br/>');
        if (opts.image) {
            refs.image.setSrc(getImage(opts.image));
            dialogElement.className = this.addClassName(dialogElement.className, 'with-image');
        } else {
            dialogElement.className = this.removeClassName(dialogElement.className, 'with-image');
        }
        this.show();
    }
};
