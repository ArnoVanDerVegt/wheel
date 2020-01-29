/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const Component   = require('./Component').Component;
const Button      = require('./Button').Button;
const TextInput   = require('./TextInput').TextInput;
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

    addToolOptions(opts) {
        opts.type = ToolOptions;
        opts.ui   = this._ui;
        if (!('uiId' in opts)) {
            opts.uiId = this._uiId;
        }
        opts.options.forEach(function(option) {
            option.onFocus = function() {
                this._parentNode.className = 'tool-options focus';
            }
            option.onBlur = function() {
                this._parentNode.className = 'tool-options';
            }
        });
        return opts;
    }
};
