/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const DOMNode     = require('../../../../../lib/dom').DOMNode;
const ToolOptions = require('../../../../../lib/components/ToolOptions').ToolOptions;
const Toolbar     = require('../../../../../lib/components/Toolbar').Toolbar;
const Button      = require('../../../../../lib/components/Button').Button;
const tabIndex    = require('../../../../tabIndex');

exports.ToolbarTop = class extends Toolbar {
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
                className: 'resource-options top',
                children: [
                    {
                        ref:       imageEditor.setRef('topDefaultOptions'),
                        className: 'top-options',
                        children: [
                            this.addButton({
                                ref:       imageEditor.setRef('undo'),
                                uiId:      imageEditor.getUIId.bind(imageEditor),
                                tabIndex:  tabIndex.IMAGE_UNDO,
                                icon:      'icon-undo',
                                className: 'toolbar-button',
                                hint:      {text: 'Undo'},
                                color:     ' ',
                                disabled:  true,
                                onClick:   imageEditor.onUndo.bind(imageEditor)
                            }),
                            {
                                className: 'space'
                            },
                            this.addButton({
                                ref:       imageEditor.setRef('copy'),
                                uiId:      imageEditor.getUIId.bind(imageEditor),
                                tabIndex:  tabIndex.IMAGE_COPY,
                                className: 'toolbar-button',
                                color:     ' ',
                                icon:      'icon-copy',
                                hint:      {text: 'Copy'},
                                disabled:  true,
                                onClick:   imageEditor.onCopy.bind(imageEditor)
                            }),
                            this.addButton({
                                ref:       imageEditor.setRef('paste'),
                                uiId:      imageEditor.getUIId.bind(imageEditor),
                                tabIndex:  tabIndex.IMAGE_PASTE,
                                className: 'toolbar-button',
                                color:     ' ',
                                icon:      'icon-paste',
                                hint:      {text: 'Space'},
                                disabled:  true,
                                onClick:   imageEditor.onPaste.bind(imageEditor)
                            }),
                            {
                                className: 'space'
                            },
                            this.addToolOptions({
                                uiId:          imageEditor.getUIId.bind(imageEditor),
                                tabIndex:      tabIndex.IMAGE_TOOL,
                                baseClassName: 'tool-options-toolbar',
                                onSelect:      imageEditor.onSelectTool.bind(imageEditor),
                                options: [
                                    {icon: 'icon-point',  hint: {text: 'Pen<br/>tool'}},
                                    {icon: 'icon-line',   hint: {text: 'Line<br/>tool'}},
                                    {icon: 'icon-rect',   hint: {text: 'Rectangle<br/>tool'}},
                                    {icon: 'icon-circle', hint: {text: 'Circle<br/>tool'}},
                                    {icon: 'icon-text',   hint: {text: 'Text<br/>tool'}},
                                    {icon: 'icon-select', hint: {text: 'Select<br/>tool'}}
                                ]
                            }),
                            {
                                className: 'space'
                            },
                            this.addToolOptions({
                                uiId:          imageEditor.getUIId.bind(imageEditor),
                                tabIndex:      tabIndex.IMAGE_FILL,
                                tool:          1,
                                baseClassName: 'tool-options-toolbar',
                                onSelect: imageEditor.onSelectFill.bind(imageEditor),
                                options: [
                                    {icon: 'icon-fill-white',       hint: {text: 'White<br/>fill'}},
                                    {icon: 'icon-fill-black',       hint: {text: 'Black<br/>fill'}},
                                    {icon: 'icon-fill-transparent', hint: {text: 'Transparent<br/>fill'}}
                                ]
                            }),
                            {
                                className: 'space'
                            },
                            this.addToolOptions({
                                uiId:          imageEditor.getUIId.bind(imageEditor),
                                tabIndex:      tabIndex.IMAGE_STROKE,
                                tool:          1,
                                baseClassName: 'tool-options-toolbar',
                                onSelect:      imageEditor.onSelectStroke.bind(imageEditor),
                                options: [
                                    {icon: 'icon-line-white',       hint: {text: 'White<br/>stroke'}},
                                    {icon: 'icon-line-black',       hint: {text: 'Black<br/>stroke'}},
                                    {icon: 'icon-line-transparent', hint: {text: 'Transparent<br/>stroke'}}
                                ]
                            }),
                            {
                                className: 'space'
                            },
                            this.addToolOptions({
                                uiId:          imageEditor.getUIId.bind(imageEditor),
                                tabIndex:      tabIndex.IMAGE_DRAW_SIZE,
                                baseClassName: 'tool-options-toolbar',
                                onSelect:      imageEditor.onSelectSize.bind(imageEditor),
                                options: [
                                    {icon: 'icon-size1', hint: {text: 'Pen size 1'}},
                                    {icon: 'icon-size2', hint: {text: 'Pen size 2'}},
                                    {icon: 'icon-size3', hint: {text: 'Pen size 3'}},
                                    {icon: 'icon-size4', hint: {text: 'Pen size 4'}}
                                ]
                            })
                        ]
                    },
                    {
                        className: 'top-options right',
                        children: [
                            this.addButton({
                                ref:       imageEditor.setRef('gridToggle'),
                                uiId:      imageEditor.getUIId.bind(imageEditor),
                                tabIndex:  tabIndex.IMAGE_VIEW_GRID,
                                icon:      'icon-grid',
                                className: 'toolbar-button active',
                                color:     ' ',
                                hint:      {text: 'Grid'},
                                onClick:   imageEditor.onSelectGrid.bind(imageEditor)
                            }),
                            this.addButton({
                                ref:       imageEditor.setRef('meta'),
                                uiId:      imageEditor.getUIId.bind(imageEditor),
                                tabIndex:  tabIndex.IMAGE_VIEW_SOURCE,
                                icon:      'icon-binary',
                                className: 'toolbar-button',
                                color:     ' ',
                                hint:      {text: 'Binary'},
                                onClick:   imageEditor.onSelectMeta.bind(imageEditor)
                            })
                        ]
                    }
                ]
            }
        );
    }
};
