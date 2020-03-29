/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const FormComponentContainer = require('./FormComponentContainer').FormComponentContainer;

exports.FormComponent = class extends FormComponentContainer {
    setSize(width, height) {
        this._formElement.style.width  = width  + 'px';
        this._formElement.style.height = height + 'px';
    }
};
