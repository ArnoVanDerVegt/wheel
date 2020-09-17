/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher   = require('../../../../lib/dispatcher').dispatcher;
const DOMNode      = require('../../../../lib/dom').DOMNode;
const Button       = require('../../../../lib/components/Button').Button;
const Dropdown     = require('../../../../lib/components/Dropdown').Dropdown;
const IncludeFiles = require('../../../../lib/components/IncludeFiles').IncludeFiles;
const getImage     = require('../../../data/images').getImage;
const Step         = require('./Step').Step;

exports.PoweredUpStep4Include = class extends Step {
    initContent() {
        return {
            ui:        this._ui,
            uiId:      this._uiId,
            className: 'step-content step5',
            children: [
                {
                    type:     IncludeFiles,
                    ref:      this.setRef('includeFiles'),
                    id:       this.setIncludeFilesElement.bind(this),
                    ui:       this._ui,
                    uiId:     this._uiId,
                    settings: this._settings,
                    types:    ['General']
                }
            ]
        };
    }

    reset() {
        this._refs.includeFiles.reset();
    }

    setIncludeFilesElement(element) {
        this._includeFilesElement = element;
        element.reset();
        element.update();
    }

    getIncludeFiles() {
        return this._includeFilesElement.getIncludeFiles();
    }
};
