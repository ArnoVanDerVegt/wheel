/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const DOMNode    = require('../../../../lib/dom').DOMNode;
const Motor      = require('./Motor').Motor;
const MotorAlias = require('./MotorAlias').MotorAlias;

exports.Motors = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._settings       = opts.settings;
        this._ui             = opts.ui;
        this._uiId           = opts.uiId;
        this._dialog         = opts.dialog;
        this._device         = opts.device;
        this._motorValidator = opts.motorValidator;
        this.initDOM(opts.parentNode, opts.dialog);
    }

    initDOM(parentNode, dialog) {
        let children = [];
        for (let i = 0; i < 4; i++) {
            children.push({
                id:       dialog.addMotorAliasElement.bind(dialog),
                settings: this._settings,
                dialog:   this._dialog,
                device:   this._device,
                type:     MotorAlias,
                alias:    (i + 1) + '',
                index:    i
            });
        }
        for (let i = 0; i < 4; i++) {
            children.push({
                id:             dialog.addMotorElement.bind(dialog),
                type:           Motor,
                ui:             this._ui,
                uiId:           this._uiId,
                device:         this._device,
                dialog:         dialog,
                motorId:        i,
                motorValidator: this._motorValidator,
                tabIndex:       10 + 10 * i,
                className:      (i === 3) ? 'last' : ''
            });
        }
        this.create(
            parentNode,
            {
                ref:       dialog.setRef('motors'),
                className: 'motors',
                children:  children
            }
        );
    }
};
