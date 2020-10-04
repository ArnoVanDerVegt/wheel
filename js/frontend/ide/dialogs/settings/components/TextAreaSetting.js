/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const TextArea         = require('../../../../lib/components/TextArea').TextArea;
const TextInputSetting = require('./TextInputSetting').TextInputSetting;

exports.TextAreaSetting = class extends TextInputSetting {
    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                className: 'flt text-input-setting',
                children: [
                    (this._label !== '') ?
                        {
                            className: 'no-select label',
                            innerHTML: this._label
                        } :
                        null,
                    {
                        type:      TextArea,
                        ref:       this.setRef('input'),
                        value:     this._value,
                        numeric:   this._numeric,
                        className: this._className,
                        ui:        this._ui,
                        uiId:      this._uiId,
                        onKeyUp:   this.onChange.bind(this)
                    }
                ]
            }
        );
    }
};
