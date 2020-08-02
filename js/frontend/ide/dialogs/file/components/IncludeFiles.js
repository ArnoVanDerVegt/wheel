/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const DOMNode  = require('../../../../lib/dom').DOMNode;
const Checkbox = require('../../../../lib/components/Checkbox').Checkbox;

exports.IncludeFiles = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._ui               = opts.ui;
        this._uiId             = opts.uiId;
        this._settings         = opts.settings;
        this._checkboxElements = [];
        this.initDOM(opts.parentNode);
        opts.id(this);
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                id:        this.setRef('includeFiles'),
                className: 'include-files'
            }
        );
    }

    addCheckboxElement(element) {
        this._checkboxElements.push(element);
    }

    getIncludeFileChildren() {
        let children     = [];
        let includeFiles = this._settings.getIncludeFiles().getIncludeFiles();
        for (let i = 0; i < includeFiles.length; i++) {
            let includeFile = includeFiles[i];
            children.push({
                className: 'include-file',
                children: [
                    {
                        id:       this.addCheckboxElement.bind(this),
                        type:     Checkbox,
                        ui:       this._ui,
                        uiId:     this._uiId,
                        tabIndex: 8 + i
                    },
                    {
                        className: 'label file',
                        innerHTML: includeFile.file
                    },
                    {
                        className: 'label description',
                        innerHTML: includeFile.description
                    }
                ]
            });
        }
        return children;
    }

    getIncludeFiles() {
        let result       = [];
        let includeFiles = this._settings.getIncludeFiles().getIncludeFiles();
        this._checkboxElements.forEach((checkboxElement, index) => {
            if (checkboxElement.getValue()) {
                result.push(includeFiles[index].file);
            }
        });
        return result;
    }

    reset() {
        this._checkboxElements.forEach((checkboxElement, index) => {
            checkboxElement.setChecked(false);
        });
    }

    update() {
        let children     = this.getIncludeFileChildren();
        let includeFiles = this._refs.includeFiles;
        let childNodes   = includeFiles.childNodes;
        while (childNodes.length) {
            includeFiles.removeChild(childNodes[0]);
        }
        this._checkboxElements = [];
        children.forEach((child) => {
            this.create(includeFiles, child);
        });
    }
};
