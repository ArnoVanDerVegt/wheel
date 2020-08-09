/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const DOMNode = require('../../../../../lib/dom').DOMNode;
const Toolbar = require('../../../../../lib/components/Toolbar').Toolbar;

exports.ToolbarBottom = class extends Toolbar {
    constructor(opts) {
        super(opts);
        this._ui         = opts.ui;
        this._parentNode = opts.parentNode;
        this._formEditor = opts.formEditor;
        this.initDOM();
    }

    initDOM() {
        let formEditor = this._formEditor;
        this.create(
            this._parentNode,
            {
                className: 'resource-options bottom',
                children: [
                    this.addFileSaved(formEditor),
                    this.addCursorInfo(formEditor)
                ]
            }
        );
    }
};
