/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const DOMNode  = require('../../../../lib/dom').DOMNode;
const Checkbox = require('../../../../lib/components/Checkbox').Checkbox;

const includeFiles = [
        {file: 'lib/bit.whl',      description: 'Binary operations like `and` and `or`'},
        {file: 'lib/button.whl',   description: 'Read EV3 buttons'},
        {file: 'lib/file.whl',     description: 'Read and write files'},
        {file: 'lib/light.whl',    description: 'Control the EV3 light'},
        {file: 'lib/math.whl',     description: 'Math functions: `round`, `sin`, etc...'},
        {file: 'lib/motor.whl',    description: 'Control motors'},
        {file: 'lib/screen.whl',   description: 'Drawing functions'},
        {file: 'lib/sensor.whl',   description: 'Read sensors'},
        {file: 'lib/sound.whl',    description: 'Play tones and samples'},
        {file: 'lib/standard.whl', description: 'Standard functions'},
        {file: 'lib/string.whl',   description: 'String functions'},
        {file: 'lib/system.whl',   description: 'Access to EV3 system functions'}
    ];

exports.IncludeFiles = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._ui               = opts.ui;
        this._uiId             = opts.uiId;
        this._checkboxElements = [];
        this.initDOM(opts.parentNode);
        opts.id(this);
    }

    initDOM(parentNode) {
        let children = [];
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
        this.create(
            parentNode,
            {
                className: 'include-files',
                children:  children
            }
        );
    }

    addCheckboxElement(element) {
        this._checkboxElements.push(element);
    }

    getIncludeFiles() {
        let result = [];
        this._checkboxElements.forEach(function(checkboxElement, index) {
            if (checkboxElement.getValue()) {
                result.push(includeFiles[index].file);
            }
        });
        return result;
    }

    reset() {
        this._checkboxElements.forEach(function(checkboxElement, index) {
            checkboxElement.setChecked(false);
        });
    }
};
