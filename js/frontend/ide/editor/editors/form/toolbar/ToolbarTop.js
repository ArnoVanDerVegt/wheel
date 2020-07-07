/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const DOMNode  = require('../../../../../lib/dom').DOMNode;
const Button   = require('../../../../../lib/components/Button').Button;
const Toolbar  = require('../../../../../lib/components/Toolbar').Toolbar;
const tabIndex = require('../../../../tabIndex');

exports.ToolbarTop = class extends Toolbar {
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
                className: 'resource-options top',
                children: [
                    this.addButton({
                        ref:       formEditor.setRef('undo'),
                        uiId:      formEditor.getUIId.bind(formEditor),
                        tabIndex:  tabIndex.FORM_UNDO,
                        className: 'toolbar-button',
                        color:     ' ',
                        icon:      'icon-undo',
                        hint:      {text: 'Undo'},
                        disabled:  true,
                        onClick:   formEditor.onUndo.bind(formEditor)
                    }),
                    {
                        className: 'space'
                    },
                    // Copy, paste, delete...
                    this.addButton({
                        ref:       formEditor.setRef('copy'),
                        uiId:      formEditor.getUIId.bind(formEditor),
                        tabIndex:  tabIndex.FORM_COPY,
                        className: 'toolbar-button',
                        color:     ' ',
                        icon:      'icon-copy',
                        hint:      {text: 'Copy'},
                        disabled:  true,
                        onClick:   formEditor.onCopy.bind(formEditor)
                    }),
                    this.addButton({
                        ref:       formEditor.setRef('paste'),
                        uiId:      formEditor.getUIId.bind(formEditor),
                        tabIndex:  tabIndex.FORM_PASTE,
                        className: 'toolbar-button',
                        color:     ' ',
                        icon:      'icon-paste',
                        hint:      {text: 'Paste'},
                        disabled:  true,
                        onClick:   formEditor.onPaste.bind(formEditor)
                    }),
                    this.addButton({
                        ref:       formEditor.setRef('delete'),
                        uiId:      formEditor.getUIId.bind(formEditor),
                        tabIndex:  tabIndex.FORM_DELETE,
                        className: 'toolbar-button',
                        color:     ' ',
                        icon:      'icon-delete',
                        hint:      {text: 'Delete'},
                        disabled:  true,
                        onClick:   formEditor.onDelete.bind(formEditor)
                    }),
                    {
                        className: 'space'
                    },
                    this.addToolOptions({
                        uiId:          formEditor.getUIId.bind(formEditor),
                        tabIndex:      tabIndex.FORM_COMPONENT_TYPES,
                        baseClassName: 'tool-options-toolbar',
                        onSelect:      formEditor.onSelectComponentTypes.bind(formEditor),
                        collapse:      true,
                        options: [
                            {icon: 'icon-btn',   hint: {text: 'Standard<br/>components'}},
                            {icon: 'icon-tabs',  hint: {text: 'Panel<br/>components'}},
                            {icon: 'icon-image', hint: {text: 'Graphics<br/>components'}}
                        ]
                    }),
                    {
                        className: 'space'
                    },
                    this.addToolOptions({
                        ref:           formEditor.setRef('standardTools'),
                        uiId:          formEditor.getUIId.bind(formEditor),
                        tabIndex:      tabIndex.FORM_COMPONENT,
                        baseClassName: 'tool-options-toolbar standard',
                        onSelect:      formEditor.onSelectStandardComponent.bind(formEditor),
                        options: [
                            {icon: 'icon-btn',          hint: {text: 'Button<br/>component'}},
                            {icon: 'icon-select-btn',   hint: {text: 'SelectButton<br/>component'}},
                            {icon: 'icon-label',        hint: {text: 'Label<br/>component'}},
                            {icon: 'icon-checkbox',     hint: {text: 'Checkbox<br/>component'}},
                            {icon: 'icon-status-light', hint: {text: 'StatusLight<br/>component'}}
                        ]
                    }),
                    this.addToolOptions({
                        ref:           formEditor.setRef('panelTools'),
                        uiId:          formEditor.getUIId.bind(formEditor),
                        tabIndex:      tabIndex.FORM_COMPONENT,
                        baseClassName: 'tool-options-toolbar panels',
                        onSelect:      formEditor.onSelectPanelComponent.bind(formEditor),
                        style: {
                            display: 'none'
                        },
                        options: [
                            {icon: 'icon-tabs',  hint: {text: 'Tabs<br/>component'}},
                            {icon: 'icon-panel', hint: {text: 'Panel<br/>component'}}
                        ]
                    }),
                    this.addToolOptions({
                        ref:           formEditor.setRef('graphicsTools'),
                        uiId:          formEditor.getUIId.bind(formEditor),
                        tabIndex:      tabIndex.FORM_COMPONENT,
                        baseClassName: 'tool-options-toolbar graphics',
                        onSelect:      formEditor.onSelectGraphicsComponent.bind(formEditor),
                        style: {
                            display: 'none'
                        },
                        options: [
                            {icon: 'icon-rect',     hint: {text: 'Rectangle<br/>component'}},
                            {icon: 'icon-circle',   hint: {text: 'Circle<br/>component'}},
                            {icon: 'icon-image',    hint: {text: 'Image<br/>component'}}
                        ]
                    }),
                    {
                        className: 'top-options right',
                        children: [
                            this.addButton({
                                ref:       formEditor.setRef('gridToggle'),
                                uiId:      formEditor.getUIId.bind(formEditor),
                                tabIndex:  tabIndex.FORM_VIEW_GRID,
                                icon:      'icon-grid',
                                className: 'toolbar-button active',
                                color:     ' ',
                                title:     'Grid',
                                onClick:   formEditor.onSelectGrid.bind(formEditor)
                            })
                        ]
                    }
                ]
            }
        );
    }
};
