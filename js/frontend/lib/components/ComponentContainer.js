/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const Component   = require('./Component').Component;
const Button      = require('./Button').Button;
const TextInput   = require('./TextInput').TextInput;
const Checkbox    = require('./Checkbox').Checkbox;
const ToolOptions = require('./ToolOptions').ToolOptions;

exports.ComponentContainer = class extends Component {
    getUI() {
        return this._ui;
    }

    getUIId() {
        return this._uiId;
    }

    addLabel(text) {
        return {
            innerHTML: text,
            className: 'label'
        };
    }

    addButton(opts) {
        opts.type = Button;
        opts.ui   = this._ui;
        if (!('uiId' in opts)) {
            opts.uiId = this._uiId;
        }
        return opts;
    }

    addTextInput(opts) {
        opts.type = TextInput;
        opts.ui   = this._ui;
        if (!('uiId' in opts)) {
            opts.uiId = this._uiId;
        }
        return opts;
    }

    addCheckbox(opts) {
        opts.type = Checkbox;
        opts.ui   = this._ui;
        if (!('uiId' in opts)) {
            opts.uiId = this._uiId;
        }
        return opts;
    }

    addToolOptions(opts) {
        opts.type = ToolOptions;
        opts.ui   = this._ui;
        if (!('uiId' in opts)) {
            opts.uiId = this._uiId;
        }
        let baseClassName = opts.baseClassName || 'tool-options';
        opts.options.forEach((option) => {
            // Don't bind to this with fat arrow here!
            option.onFocus = function() {
                this._parentNode.className = baseClassName + ' focus';
            };
            // Don't bind to this with fat arrow here!
            option.onBlur = function() {
                this._parentNode.className = baseClassName;
            };
        });
        return opts;
    }
};
