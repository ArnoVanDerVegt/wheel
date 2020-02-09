/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const DOMNode = require('../../../../lib/dom').DOMNode;
const Motor   = require('./Motor').Motor;

exports.Motors = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._ui     = opts.ui;
        this._device = opts.device;
        this._uiId   = opts.uiId;
        this.initDOM(opts.parentNode, opts.dialog);
    }

    initDOM(parentNode, dialog) {
        this.create(
            parentNode,
            {
                ref:       dialog.setRef('motors'),
                className: 'motors',
                children: [
                    {
                        id:        dialog.addMotorElement.bind(dialog),
                        type:      Motor,
                        ui:        this._ui,
                        uiId:      this._uiId,
                        device:    this._device,
                        dialog:    dialog,
                        motorId:   0,
                        tabIndex:  10
                    },
                    {
                        id:        dialog.addMotorElement.bind(dialog),
                        type:      Motor,
                        ui:        this._ui,
                        uiId:      this._uiId,
                        device:    this._device,
                        dialog:    dialog,
                        motorId:   1,
                        tabIndex:  20
                    },
                    {
                        id:        dialog.addMotorElement.bind(dialog),
                        type:      Motor,
                        ui:        this._ui,
                        uiId:      this._uiId,
                        device:    this._device,
                        dialog:    dialog,
                        motorId:   2,
                        tabIndex:  30
                    },
                    {
                        id:        dialog.addMotorElement.bind(dialog),
                        type:      Motor,
                        ui:        this._ui,
                        uiId:      this._uiId,
                        device:    this._device,
                        dialog:    dialog,
                        tabIndex:  40,
                        motorId:   3,
                        className: 'last'
                    }
                ]
            }
        );
    }
};
