/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../../../lib/dispatcher').dispatcher;
const Dialog     = require('../../../lib/components/Dialog').Dialog;
const Checkbox   = require('../../../lib/components/input/Checkbox').Checkbox;

exports.FindDialog = class extends Dialog {
    addButtons(applyTitle) {
        return this.initButtons([
            {
                ref:      this.setRef('buttonApply'),
                tabIndex: 128,
                value:    applyTitle,
                onClick:  this.onApply.bind(this)
            },
            {
                tabIndex: 129,
                value:    'Cancel',
                color:    'dark-green',
                onClick:  this.hide.bind(this)
            }
        ]);
    }
};
