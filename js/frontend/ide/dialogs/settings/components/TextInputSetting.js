/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const DOMNode    = require('../../../../lib/dom').DOMNode;
const dispatcher = require('../../../../lib/dispatcher').dispatcher;
const TextInput  = require('../../../../lib/components/TextInput').TextInput;

exports.TextInputSetting = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._ui       = opts.ui;
        this._uiId     = opts.uiId;
        this._settings = opts.settings;
        this._tabIndex = opts.tabIndex;
        this._label    = opts.description;
        this.initDOM(opts.parentNode);
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                className: 'text-input-setting',
                children: [
                ]
            }
        );
    }
};
