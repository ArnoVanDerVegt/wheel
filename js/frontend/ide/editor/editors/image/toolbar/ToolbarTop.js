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
                                title:     'Undo',
                                color:     ' ',
                                disabled:  true,
                                onClick:   imageEditor.onUndo.bind(imageEditor)
                            }),
                            this.addButton({
                                ref:       imageEditor.setRef('copy'),
                                uiId:      imageEditor.getUIId.bind(imageEditor),
                                tabIndex:  tabIndex.IMAGE_COPY,
                                className: 'toolbar-button',
                                color:     ' ',
                                icon:      'icon-copy',
                                title:     'Copy',
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
                                title:     'Paste',
                                disabled:  true,
                                onClick:   imageEditor.onPaste.bind(imageEditor)
                            }),
                            this.addToolOptions({
                                uiId:      imageEditor.getUIId.bind(imageEditor),
                                tabIndex:  tabIndex.IMAGE_TOOL,
                                label:     'Tool:',
                                onSelect:  imageEditor.onSelectTool.bind(imageEditor),
                                options: [
                                    {title: 'Pen',    icon: 'icon-point'},
                                    {title: 'Line',   icon: 'icon-line'},
                                    {title: 'Rect',   icon: 'icon-rect'},
                                    {title: 'Circle', icon: 'icon-circle'},
                                    {title: 'Text',   icon: 'icon-text'},
                                    {title: 'Select', icon: 'icon-select'}
                                ]
                            }),
                            this.addToolOptions({
                                uiId:     imageEditor.getUIId.bind(imageEditor),
                                tabIndex: tabIndex.IMAGE_FILL,
                                tool:     1,
                                label:    'Fill:',
                                onSelect: imageEditor.onSelectFill.bind(imageEditor),
                                options: [
                                    {title: 'White',       icon: 'icon-fill-white'},
                                    {title: 'Black',       icon: 'icon-fill-black'},
                                    {title: 'Transparent', icon: 'icon-fill-transparent'}
                                ]
                            }),
                            this.addToolOptions({
                                uiId:     imageEditor.getUIId.bind(imageEditor),
                                tabIndex: tabIndex.IMAGE_STROKE,
                                tool:     1,
                                label:    'Stroke:',
                                onSelect: imageEditor.onSelectStroke.bind(imageEditor),
                                options: [
                                    {title: 'White',       icon: 'icon-line-white'},
                                    {title: 'Black',       icon: 'icon-line-black'},
                                    {title: 'Transparent', icon: 'icon-line-transparent'}
                                ]
                            }),
                            this.addToolOptions({
                                uiId:     imageEditor.getUIId.bind(imageEditor),
                                tabIndex: tabIndex.IMAGE_DRAW_SIZE,
                                label:    'Size:',
                                onSelect: imageEditor.onSelectSize.bind(imageEditor),
                                options: [
                                    {title: 'Size 1', icon: 'icon-size1'},
                                    {title: 'Size 2', icon: 'icon-size2'},
                                    {title: 'Size 3', icon: 'icon-size3'},
                                    {title: 'Size 4', icon: 'icon-size4'}
                                ]
                            })
                        ]
                    },
                    {
                        className: 'top-options right',
                        children: [
                            this.addLabel('View:'),
                            this.addButton({
                                ref:       imageEditor.setRef('gridToggle'),
                                uiId:      imageEditor.getUIId.bind(imageEditor),
                                tabIndex:  tabIndex.IMAGE_VIEW_GRID,
                                icon:      'icon-grid',
                                className: 'toolbar-button active',
                                color:     ' ',
                                title:     'Grid',
                                onClick:   imageEditor.onSelectGrid.bind(imageEditor)
                            }),
                            this.addButton({
                                ref:       imageEditor.setRef('meta'),
                                uiId:      imageEditor.getUIId.bind(imageEditor),
                                tabIndex:  tabIndex.IMAGE_VIEW_SOURCE,
                                icon:      'icon-binary',
                                className: 'toolbar-button',
                                color:     ' ',
                                title:     'Binary',
                                onClick:   imageEditor.onSelectMeta.bind(imageEditor)
                            })
                        ]
                    }
                ]
            }
        );
    }
};
