/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const DOMNode  = require('../../../../../lib/dom').DOMNode;
const Toolbar  = require('../../../../../lib/components/Toolbar').Toolbar;
const Button   = require('../../../../../lib/components/Button').Button;
const Slider   = require('../../../../../lib/components/Slider').Slider;
const tabIndex = require('../../../../tabIndex');

exports.ToolbarBottom = class extends Toolbar {
    constructor(opts) {
        super(opts);
        this._ui          = opts.ui;
        this._parentNode  = opts.parentNode;
        this._soundEditor = opts.soundEditor;
        this.initDOM();
    }

    initDOM() {
        let soundEditor = this._soundEditor;
        this.create(
            this._parentNode,
            {
                className: 'resource-options bottom',
                children: [
                    this.addFileSaved(soundEditor),
                    this.addCursorInfo(soundEditor),
                    this.addZoom(soundEditor, tabIndex.SOUND_ZOOM, 0)
                ]
            }
        );
    }
};
