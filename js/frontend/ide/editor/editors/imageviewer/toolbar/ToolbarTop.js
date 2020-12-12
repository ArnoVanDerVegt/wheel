/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const path     = require('../../../../../lib/path');
const DOMNode  = require('../../../../../lib/dom').DOMNode;
const Toolbar  = require('../../../../../lib/components/Toolbar').Toolbar;
const tabIndex = require('../../../../tabIndex');

exports.ToolbarTop = class extends Toolbar {
    constructor(opts) {
        super(opts);
        this._ui          = opts.ui;
        this._parentNode  = opts.parentNode;
        this._imageViewer = opts.imageViewer;
        this.initDOM();
    }

    initDOM() {
        let imageViewer = this._imageViewer;
        this.create(
            this._parentNode,
            {
                className: 'flt max-w resource-options top',
                children: [
                    {
                        className: 'label',
                        innerHTML: path.join(imageViewer.getPath(), imageViewer.getFilename())
                    }
                ]
            }
        );
    }
};
