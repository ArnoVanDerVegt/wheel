/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const DOMNode     = require('../../../../lib/dom').DOMNode;
const dispatcher  = require('../../../../lib/dispatcher').dispatcher;
const Button      = require('../../../../lib/components/input/Button').Button;
const CloseButton = require('../../../../lib/components/input/CloseButton').CloseButton;
const TextInput   = require('../../../../lib/components/input/TextInput').TextInput;

exports.IncludeFilesSetting = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._ui       = opts.ui;
        this._uiId     = opts.uiId;
        this._settings = opts.settings;
        this._tabIndex = opts.tabIndex;
        this.initDOM(opts.parentNode);
        this.initIncludeFileList();
        this._settings.on('Settings.IncludeFiles', this, this.initIncludeFileList);
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                className: 'text-property-setting',
                children: [
                    {
                        ref:       this.setRef('includeFileList'),
                        className: 'flt max-w text-property-list'
                    },
                    {
                        className: 'flt max-w text-property-row',
                        children: [
                            {
                                type:     Button,
                                color:    'blue',
                                ui:       this._ui,
                                uiId:     this._uiId,
                                tabIndex: this._tabIndex + 1024,
                                value:    'Add include file',
                                onClick:  this.onAddInclude.bind(this)
                            },
                            {
                                type:     Button,
                                color:    'blue',
                                ui:       this._ui,
                                uiId:     this._uiId,
                                tabIndex: this._tabIndex + 1025,
                                value:    'Restore default includes',
                                onClick:  this.onRestoreDefaults.bind(this)
                            }
                        ]
                    }
                ]
            }
        );
    }

    initIncludeFileList() {
        let parentNode   = this._refs.includeFileList;
        let childNodes   = parentNode.childNodes;
        let includeFiles = this._settings.getIncludeFiles().getIncludeFiles();
        while (childNodes.length) {
            parentNode.removeChild(childNodes[0]);
        }
        includeFiles.forEach((includeFile, index) => {
            this.create(
                parentNode,
                {
                    className: 'flt max-w text-property-row',
                    children: [
                        {
                            type:      CloseButton,
                            className: 'sort',
                            ui:        this._ui,
                            uiId:      this._uiId,
                            tabIndex:  this._tabIndex + index * 5 + 2,
                            title:     '▲',
                            onClick:   this.onSortUp.bind(this, index)
                        },
                        {
                            className: 'no-select label',
                            innerHTML: 'File'
                        },
                        {
                            type:      TextInput,
                            value:     includeFile.file,
                            ui:        this._ui,
                            uiId:      this._uiId,
                            tabIndex:  this._tabIndex + index * 5,
                            onBlur:    this.onChangeFile.bind(this, index)
                        }
                    ]
                }
            );
            this.create(
                parentNode,
                {
                    className: 'flt max-w text-property-row last',
                    children: [
                        {
                            type:      CloseButton,
                            className: 'sort',
                            ui:        this._ui,
                            uiId:      this._uiId,
                            tabIndex:  this._tabIndex + index * 5 + 3,
                            title:     '▼',
                            onClick:   this.onSortDown.bind(this, index)
                        },
                        {
                            type:      CloseButton,
                            ui:        this._ui,
                            uiId:      this._uiId,
                            tabIndex:  this._tabIndex + index * 5 + 4,
                            onClick:   this.onDelete.bind(this, index)
                        },
                        {
                            className: 'no-select label',
                            innerHTML: 'Description'
                        },
                        {
                            type:      TextInput,
                            value:     includeFile.description,
                            ui:        this._ui,
                            uiId:      this._uiId,
                            tabIndex:  this._tabIndex + index * 5 + 1,
                            onBlur:    this.onChangeDescription.bind(this, index)
                        }
                    ]
                }
            );
        });
    }

    onChangeFile(index, event) {
        dispatcher.dispatch('Settings.IncludeFile.SetFile', {index: index, file: event.target.value});
    }

    onChangeDescription(index, event) {
        dispatcher.dispatch('Settings.IncludeFile.SetDescription', {index: index, description: event.target.value});
    }

    onAddInclude() {
        dispatcher.dispatch('Settings.IncludeFile.Add');
    }

    onSortUp(index) {
        dispatcher.dispatch('Settings.IncludeFile.SetUp', index);
    }

    onSortDown(index) {
        dispatcher.dispatch('Settings.IncludeFile.SetDown', index);
    }

    onDelete(index) {
        let includeFile = this._settings.getIncludeFiles().getIncludeFiles()[index];
        dispatcher.dispatch(
            'Dialog.Confirm.Show',
            {
                title:         'Confirm delete include file',
                lines:         ['Are you sure you want to delete the include file', '<i>' + includeFile.file + '</i> ?'],
                applyCallback: () => {
                    dispatcher.dispatch('Settings.IncludeFile.Delete', index);
                }
            }
        );
    }

    onRestoreDefaults() {
        dispatcher.dispatch(
            'Dialog.Confirm.Show',
            {
                title:         'Confirm restore default includes',
                lines:         ['Are you sure you want to restore the include list to the default list?'],
                dispatchApply: 'Settings.IncludeFile.SetDefaults'
            }
        );
    }
};
