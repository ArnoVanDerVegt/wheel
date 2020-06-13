/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const DOMNode     = require('../../../../../lib/dom').DOMNode;
const Toolbar     = require('../../../../../lib/components/Toolbar').Toolbar;
const ToolOptions = require('../../../../../lib/components/ToolOptions').ToolOptions;
const Button      = require('../../../../../lib/components/Button').Button;
const Checkbox    = require('../../../../../lib/components/Checkbox').Checkbox;
const TextInput   = require('../../../../../lib/components/TextInput').TextInput;
const Slider      = require('../../../../../lib/components/Slider').Slider;
const tabIndex    = require('../../../../tabIndex');

exports.ToolbarBottom = class extends Toolbar {
    constructor(opts) {
        super(opts);
        this._ui          = opts.ui;
        this._parentNode  = opts.parentNode;
        this._imageEditor = opts.imageEditor;
        this.initDOM();
    }

    initDOM() {
        let imageEditor = this._imageEditor;
        this.create(
            this._parentNode,
            {
                className: 'resource-options bottom',
                children: [
                    this.addFileSaved(imageEditor),
                    {
                        ref:       imageEditor.setRef('fontOptions'),
                        className: 'bottom-options hidden',
                        children: [
                            this.addLabel('Text:'),
                            {
                                ref:         imageEditor.setRef('text'),
                                type:        TextInput,
                                ui:          this._ui,
                                uiId:        1,
                                tabIndex:    tabIndex.IMAGE_TEXT,
                                onKeyUp:     imageEditor.onKeyUp.bind(imageEditor),
                                placeholder: 'Enter text'
                            },
                            this.addToolOptions({
                                uiId:          1,
                                tabIndex:      tabIndex.IMAGE_FONT_SIZE,
                                label:         'Font:',
                                baseClassName: 'tool-options-toolbar',
                                onSelect:      imageEditor.onSelectFont.bind(imageEditor),
                                options: [
                                    {title: 'Size 1', icon: 'icon-text1'},
                                    {title: 'Size 2', icon: 'icon-text2'},
                                    {title: 'Size 3', icon: 'icon-text3'}
                                ]
                            }),
                            {
                                innerHTML: 'Monospace:',
                                className: 'label monospace'
                            },
                            {
                                type:     Checkbox,
                                ui:       this._ui,
                                uiId:     1,
                                tabIndex: tabIndex.IMAGE_MONOSPACE,
                                onChange: imageEditor.onChangeMonospace.bind(imageEditor)
                            }
                        ]
                    },
                    this.addCursorInfo(imageEditor),
                    this.addZoom(imageEditor, tabIndex.IMAGE_ZOOM, 1, imageEditor.setRef('bottomDefaultOptions'))
                ]
            }
        );
    }
};
