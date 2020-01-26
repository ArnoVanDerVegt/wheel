/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const DOMNode     = require('../../../../../lib/dom').DOMNode;
const dispatcher  = require('../../../../../lib/dispatcher').dispatcher;
const Toolbar     = require('../../../../../lib/components/Toolbar').Toolbar;
const Button      = require('../../../../../lib/components/Button').Button;
const ToolOptions = require('../../../../../lib/components/ToolOptions').ToolOptions;
const tabIndex    = require('../../../../tabIndex');

exports.ToolbarBottomViewer = class extends Toolbar {
    constructor(opts) {
        super(opts);
        this._ui          = opts.ui;
        this._settings    = opts.settings;
        this._parentNode  = opts.parentNode;
        this._wheelEditor = opts.wheelEditor;
        this.initDOM();
        dispatcher
            .on('Compile.Start',   this, this.onCompileStart)
            .on('Compile.Success', this, this.onCompileSuccess)
            .on('Compile.Warning', this, this.onCompileWarning)
            .on('Compile.Failed',  this, this.onCompileFailed);
    }

    initDOM() {
        let wheelEditor = this._wheelEditor;
        this.create(
            this._parentNode,
            {
                className: 'resource-options bottom viewer',
                children: [
                    this.addFileSaved(wheelEditor),
                    {
                        type:      ToolOptions,
                        ui:        this._ui,
                        color:     'green',
                        className: 'view-output',
                        uiId:      1,
                        options:  [
                            {
                                ui:       this._ui,
                                uiId:     1,
                                value:    'Text',
                                tabIndex: tabIndex.VM_VIEWER_SELECT_TEXT,
                                onClick:  wheelEditor.onSelectText.bind(wheelEditor)
                            },
                            {
                                ui:       this._ui,
                                uiId:     1,
                                value:    'Rtf',
                                tabIndex: tabIndex.VM_VIEWER_SELECT_RTF,
                                onClick:  wheelEditor.onSelectRtf.bind(wheelEditor)
                            }
                        ]
                    },
                    {
                        ref:       wheelEditor.setRef('selectAndCopy'),
                        ui:        this._ui,
                        uiId:      1,
                        type:      Button,
                        className: 'select-and-copy',
                        disabled:  true,
                        value:     'Select and copy',
                        tabIndex:  tabIndex.VM_VIEWER_SELECT_AND_COPY,
                        onClick:   wheelEditor.onSelectAndCopy.bind(wheelEditor)
                    }
                ]
            }
        );
    }

    setCompileInfo(element) {
        this._compileInfoElement = element;
        element.addEventListener('click', this.onClickStatus.bind(this));
    }

    setFilenameAndStatus(filename, status) {
    }

    onCompileStart(projectFilename) {
        this.setFilenameAndStatus(projectFilename, '');
    }

    onCompileSuccess(projectFilename) {
        this.setFilenameAndStatus(projectFilename, 'success');
    }

    onCompileWarning(projectFilename) {
        this.setFilenameAndStatus(projectFilename, 'warning');
    }

    onCompileFailed(projectFilename) {
        this.setFilenameAndStatus(projectFilename, 'failed');
    }

    onClickStatus() {
        dispatcher.dispatch('Settings.Toggle.ShowConsole');
    }
};
