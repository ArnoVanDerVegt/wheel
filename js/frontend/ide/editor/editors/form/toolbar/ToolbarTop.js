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
                        title:     'Undo',
                        disabled:  true,
                        onClick:   formEditor.onUndo.bind(formEditor)
                    }),
                    // Copy, paste, delete...
                    this.addButton({
                        ref:       formEditor.setRef('copy'),
                        uiId:      formEditor.getUIId.bind(formEditor),
                        tabIndex:  tabIndex.FORM_COPY,
                        className: 'toolbar-button',
                        color:     ' ',
                        icon:      'icon-copy',
                        title:     'Copy',
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
                        title:     'Paste',
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
                        title:     'Delete',
                        disabled:  true,
                        onClick:   formEditor.onDelete.bind(formEditor)
                    }),
                    this.addToolOptions({
                        uiId:          formEditor.getUIId.bind(formEditor),
                        tabIndex:      tabIndex.FORM_COMPONENT,
                        label:         'Component:',
                        baseClassName: 'tool-options-toolbar',
                        onSelect:      formEditor.onSelectComponent.bind(formEditor),
                        options: [
                            {title: 'Button',        icon: 'icon-btn'},
                            {title: 'Select button', icon: 'icon-select-btn'},
                            {title: 'Label',         icon: 'icon-label'},
                            {title: 'Checkbox',      icon: 'icon-checkbox'},
                            {title: 'Tabs',          icon: 'icon-tabs'}
                        ]
                    })
                ]
            }
        );
    }
};
